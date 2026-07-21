import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";

const chromePort = process.env.CHROME_DEBUG_PORT || "9333";
const baseUrl = process.env.QA_URL || "http://127.0.0.1:3108";
const outputDir = path.resolve("artifacts/cinematic-flagship-homepage");
const ffmpeg = process.env.FFMPEG_PATH || "/opt/homebrew/bin/ffmpeg";
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

class CdpSession {
  constructor(url, targetId) {
    this.url = url;
    this.targetId = targetId;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    this.socket = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      for (const listener of this.listeners.get(message.method) || []) listener(message.params);
    });
  }

  on(method, listener) {
    this.listeners.set(method, [...(this.listeners.get(method) || []), listener]);
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const response = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  }

  async close() {
    this.socket.close();
    await fetch(`http://127.0.0.1:${chromePort}/json/close/${this.targetId}`).catch(() => null);
  }
}

async function newPage(width, height, mobile) {
  const target = await fetch(
    `http://127.0.0.1:${chromePort}/json/new?${encodeURIComponent("about:blank")}`,
    { method: "PUT" },
  ).then((response) => response.json());
  const session = new CdpSession(target.webSocketDebuggerUrl, target.id);
  await session.connect();
  await Promise.all([session.send("Page.enable"), session.send("Runtime.enable")]);
  await session.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
    screenWidth: width,
    screenHeight: height,
  });
  await session.send("Page.navigate", { url: baseUrl });
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const ready = await session.evaluate(`document.readyState === "complete" && Boolean(document.querySelector(".arrival"))`).catch(() => false);
    if (ready) break;
    await sleep(100);
  }
  await session.evaluate(`new Promise(async (resolve) => {
    await document.fonts.ready;
    await new Promise((done) => setTimeout(done, 1300));
    resolve();
  })`);
  return session;
}

async function encodeFrames(frameDir, outputFile) {
  await new Promise((resolve, reject) => {
    const child = spawn(ffmpeg, [
      "-y", "-loglevel", "error", "-framerate", "30",
      "-i", path.join(frameDir, "frame-%05d.jpg"),
      "-vf", "scale=in_range=full:out_range=tv,format=yuv420p",
      "-c:v", "libx264", "-preset", "medium", "-crf", "20",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", outputFile,
    ], { stdio: "inherit" });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)));
  });
}

async function record({ name, width, height, mobile, action }) {
  const session = await newPage(width, height, mobile);
  const frameDir = await mkdtemp(path.join(os.tmpdir(), `1118-${name}-`));
  const writes = [];
  let frame = 0;

  const queueStill = async (count) => {
    const shot = await session.send("Page.captureScreenshot", { format: "jpeg", quality: 88, fromSurface: true });
    for (let index = 0; index < count; index += 1) {
      const current = frame++;
      writes.push(writeFile(path.join(frameDir, `frame-${String(current).padStart(5, "0")}.jpg`), Buffer.from(shot.data, "base64")));
    }
  };

  session.on("Page.screencastFrame", ({ data, sessionId }) => {
    const current = frame++;
    writes.push(writeFile(path.join(frameDir, `frame-${String(current).padStart(5, "0")}.jpg`), Buffer.from(data, "base64")));
    void session.send("Page.screencastFrameAck", { sessionId });
  });

  await queueStill(36);
  await session.send("Page.startScreencast", {
    format: "jpeg",
    quality: 88,
    maxWidth: width,
    maxHeight: height,
    everyNthFrame: 2,
  });
  await action(session, queueStill);
  await session.send("Page.stopScreencast");
  await queueStill(36);
  await Promise.all(writes);
  await session.close();

  const outputFile = path.join(outputDir, `${name}.mp4`);
  await encodeFrames(frameDir, outputFile);
  return { name, frameCount: frame, outputFile, frameDir };
}

async function walkthrough(session) {
  await session.evaluate(`new Promise((resolve) => {
    const start = performance.now();
    const duration = 18000;
    const maximum = document.documentElement.scrollHeight - innerHeight;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = progress < .5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      scrollTo(0, Math.round(maximum * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else setTimeout(resolve, 900);
    };
    requestAnimationFrame(tick);
  })`);
}

async function worksInteraction(session, queueStill) {
  await session.evaluate(`document.querySelector("#works").scrollIntoView({ block: "center" })`);
  await sleep(1000);
  await queueStill(36);
  for (const index of [1, 2, 0]) {
    await session.evaluate(`document.querySelectorAll(".works-rail button")[${index}].click()`);
    await sleep(900);
    await queueStill(45);
  }
}

async function comparisonInteraction(session, queueStill) {
  await session.evaluate(`scrollTo(0,0)`);
  await sleep(500);
  const bounds = await session.evaluate(`(() => {
    const rect = document.querySelector(".comparison").getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  })()`);
  const y = bounds.y + bounds.height * .52;
  await session.send("Input.dispatchMouseEvent", { type: "mousePressed", x: bounds.x + bounds.width * .5, y, button: "left", clickCount: 1 });
  for (let step = 0; step <= 30; step += 1) {
    await session.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: bounds.x + bounds.width * (.5 - step * .01),
      y,
      button: "left",
    });
    await sleep(35);
  }
  for (let step = 0; step <= 60; step += 1) {
    await session.send("Input.dispatchMouseEvent", {
      type: "mouseMoved",
      x: bounds.x + bounds.width * (.2 + step * .01),
      y,
      button: "left",
    });
    await sleep(35);
  }
  await session.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: bounds.x + bounds.width * .8, y, button: "left", clickCount: 1 });
  await queueStill(54);
}

await mkdir(outputDir, { recursive: true });
const results = [];
results.push(await record({ name: "desktop-cinematic-walkthrough", width: 1440, height: 900, mobile: false, action: walkthrough }));
results.push(await record({ name: "mobile-cinematic-walkthrough", width: 390, height: 844, mobile: true, action: walkthrough }));
results.push(await record({ name: "works-interaction", width: 1440, height: 900, mobile: false, action: worksInteraction }));
results.push(await record({ name: "comparison-interaction", width: 1440, height: 900, mobile: false, action: comparisonInteraction }));
console.log(JSON.stringify(results, null, 2));
