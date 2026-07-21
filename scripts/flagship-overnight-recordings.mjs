import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";

const chromePort = process.env.CHROME_DEBUG_PORT || "9333";
const baseUrl = process.env.QA_URL || "http://127.0.0.1:3108";
const outputDir = path.resolve("artifacts/approved-full-width-composition");
const ffmpeg = process.env.FFMPEG_PATH || "/opt/homebrew/bin/ffmpeg";

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

class CdpSession {
  constructor(url) {
    this.url = url;
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

      for (const listener of this.listeners.get(message.method) || []) {
        listener(message.params);
      }
    });
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) || [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
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
    if (response.exceptionDetails) {
      throw new Error(response.exceptionDetails.text || "Runtime evaluation failed");
    }
    return response.result.value;
  }

  close() {
    this.socket.close();
  }
}

async function newPage(width, height, mobile) {
  const target = await fetch(
    `http://127.0.0.1:${chromePort}/json/new?${encodeURIComponent("about:blank")}`,
    { method: "PUT" },
  ).then((response) => response.json());
  const session = new CdpSession(target.webSocketDebuggerUrl);
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

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const ready = await session
      .evaluate(`document.readyState === "complete"`)
      .catch(() => false);
    if (ready) break;
    await sleep(100);
  }

  await session.evaluate(`
    (async () => {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      document.documentElement.style.scrollBehavior = "auto";
      Array.from(document.images).forEach((image) => { image.loading = "eager"; });
      const step = Math.max(420, Math.floor(window.innerHeight * 0.75));
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await delay(75);
      }
      window.scrollTo(0, 0);
      await document.fonts.ready;
      await Promise.race([
        Promise.all(Array.from(document.images).map((image) => {
          if (image.complete) return Promise.resolve();
          return new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          });
        })),
        delay(3000),
      ]);
      await delay(500);
    })()
  `);
  return session;
}

async function encodeFrames(frameDir, outputFile) {
  await new Promise((resolve, reject) => {
    const process = spawn(
      ffmpeg,
      [
        "-y",
        "-loglevel",
        "error",
        "-framerate",
        "30",
        "-i",
        path.join(frameDir, "frame-%05d.jpg"),
        "-vf",
        "scale=in_range=full:out_range=tv,format=yuv420p",
        "-c:v",
        "libx264",
        "-preset",
        "medium",
        "-crf",
        "20",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        outputFile,
      ],
      { stdio: "inherit" },
    );
    process.once("error", reject);
    process.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

async function record({ name, width, height, mobile }) {
  const session = await newPage(width, height, mobile);
  const frameDir = await mkdtemp(path.join(os.tmpdir(), `1118-${name}-`));
  const writes = [];
  let frame = 0;

  const queueStill = async (count) => {
    const screenshot = await session.send("Page.captureScreenshot", {
      format: "jpeg",
      quality: 86,
      fromSurface: true,
    });
    for (let index = 0; index < count; index += 1) {
      const currentFrame = frame;
      frame += 1;
      writes.push(
        writeFile(
          path.join(frameDir, `frame-${String(currentFrame).padStart(5, "0")}.jpg`),
          Buffer.from(screenshot.data, "base64"),
        ),
      );
    }
  };

  session.on("Page.screencastFrame", ({ data, sessionId }) => {
    const currentFrame = frame;
    frame += 1;
    writes.push(
      writeFile(
        path.join(frameDir, `frame-${String(currentFrame).padStart(5, "0")}.jpg`),
        Buffer.from(data, "base64"),
      ),
    );
    void session.send("Page.screencastFrameAck", { sessionId });
  });

  await queueStill(24);
  await session.send("Page.startScreencast", {
    format: "jpeg",
    quality: 86,
    maxWidth: width,
    maxHeight: height,
    everyNthFrame: 2,
  });
  await sleep(500);
  await session.evaluate(`
    new Promise((resolve) => {
      const start = performance.now();
      const duration = 12000;
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        window.scrollTo(0, Math.round(maximum * eased));
        if (progress < 1) requestAnimationFrame(tick);
        else setTimeout(resolve, 700);
      };
      requestAnimationFrame(tick);
    })
  `);
  await session.send("Page.stopScreencast");
  await queueStill(24);
  await Promise.all(writes);
  session.close();

  if (frame < 30) throw new Error(`${name} captured only ${frame} frames`);
  const outputFile = path.join(outputDir, `${name}-scroll-through.mp4`);
  await encodeFrames(frameDir, outputFile);
  return { name, frames: frame, outputFile, frameDir };
}

await mkdir(outputDir, { recursive: true });
const results = [];
results.push(await record({ name: "desktop", width: 1440, height: 900, mobile: false }));
results.push(await record({ name: "mobile", width: 390, height: 844, mobile: true }));
console.log(JSON.stringify(results, null, 2));
