import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";

const port = process.env.CHROME_DEBUG_PORT || "9333";
const baseUrl = process.env.QA_URL || "http://127.0.0.1:3118";
const outputDir = path.resolve(
  process.env.QA_OUTPUT_DIR || "artifacts/1118-company-website-launch",
);
const ffmpeg = process.env.FFMPEG_PATH || "/opt/homebrew/bin/ffmpeg";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Cdp {
  constructor(url, id) {
    this.url = url;
    this.targetId = id;
    this.next = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", ({ data }) => {
      const message = JSON.parse(data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
      } else {
        for (const listener of this.listeners.get(message.method) || []) {
          listener(message.params);
        }
      }
    });
  }

  on(method, listener) {
    this.listeners.set(method, [
      ...(this.listeners.get(method) || []),
      listener,
    ]);
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.next++;
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const response = await this.send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (response.exceptionDetails) {
      throw new Error(JSON.stringify(response.exceptionDetails));
    }
    return response.result.value;
  }

  async close() {
    this.ws.close();
    await fetch(
      `http://127.0.0.1:${port}/json/close/${this.targetId}`,
    ).catch(() => null);
  }
}

async function openPage(width, height) {
  const target = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`,
    { method: "PUT" },
  ).then((response) => response.json());
  const page = new Cdp(target.webSocketDebuggerUrl, target.id);
  await page.connect();
  await Promise.all([page.send("Page.enable"), page.send("Runtime.enable")]);
  await page.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 480,
    screenWidth: width,
    screenHeight: height,
  });
  await page.send("Page.navigate", { url: baseUrl });
  for (let attempt = 0; attempt < 80; attempt++) {
    const ready = await page
      .eval(
        'document.readyState === "complete" && document.querySelector(".arrival")',
      )
      .catch(() => false);
    if (ready) break;
    await sleep(100);
  }
  await page.eval(
    "document.fonts.ready.then(() => new Promise((resolve) => setTimeout(resolve, 800)))",
  );
  return page;
}

async function encode(frameDir, outputFile) {
  await new Promise((resolve, reject) => {
    const child = spawn(
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
    child.once("error", reject);
    child.once("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`ffmpeg exited ${code}`)),
    );
  });
}

async function recordWalkthrough() {
  const width = 1440;
  const height = 900;
  const page = await openPage(width, height);
  const frameDir = await mkdtemp(
    path.join(os.tmpdir(), "1118-company-launch-walkthrough-"),
  );
  const writes = [];
  let frame = 0;
  const still = async (count = 18) => {
    const shot = await page.send("Page.captureScreenshot", {
      format: "jpeg",
      quality: 88,
      fromSurface: true,
    });
    for (let index = 0; index < count; index++) {
      const current = frame++;
      writes.push(
        writeFile(
          path.join(
            frameDir,
            `frame-${String(current).padStart(5, "0")}.jpg`,
          ),
          Buffer.from(shot.data, "base64"),
        ),
      );
    }
  };

  page.on("Page.screencastFrame", ({ data, sessionId }) => {
    const current = frame++;
    writes.push(
      writeFile(
        path.join(
          frameDir,
          `frame-${String(current).padStart(5, "0")}.jpg`,
        ),
        Buffer.from(data, "base64"),
      ),
    );
    void page.send("Page.screencastFrameAck", { sessionId });
  });

  await still();
  await page.send("Page.startScreencast", {
    format: "jpeg",
    quality: 88,
    maxWidth: width,
    maxHeight: height,
    everyNthFrame: 2,
  });
  await page.eval(`new Promise((resolve) => {
    const start = performance.now();
    const duration = 12000;
    const maximum = document.documentElement.scrollHeight - innerHeight;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      scrollTo(0, Math.round(maximum * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else setTimeout(resolve, 500);
    };
    requestAnimationFrame(tick);
  })`);
  await page.send("Page.stopScreencast");
  await still();
  await Promise.all(writes);
  await page.close();

  const outputFile = path.join(outputDir, "founder-walkthrough.mp4");
  await encode(frameDir, outputFile);
  return { name: "founder-walkthrough", frames: frame, outputFile };
}

await mkdir(outputDir, { recursive: true });
const result = await recordWalkthrough();
await writeFile(
  path.join(outputDir, "recording-report.json"),
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result, null, 2));
