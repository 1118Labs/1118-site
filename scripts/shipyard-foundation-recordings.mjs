import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import os from "node:os";
import path from "node:path";

const port = process.env.CHROME_DEBUG_PORT || "9333";
const baseUrl = process.env.QA_URL || "http://localhost:3000";
const outputDir = path.resolve("artifacts/shipyard-foundation-rebuild");
const ffmpeg = process.env.FFMPEG_PATH || "/opt/homebrew/bin/ffmpeg";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Cdp {
  constructor(url, id) { this.url = url; this.targetId = id; this.next = 1; this.pending = new Map(); this.listeners = new Map(); }
  async connect() { this.ws = new WebSocket(this.url); await new Promise((resolve, reject) => { this.ws.addEventListener("open", resolve, { once: true }); this.ws.addEventListener("error", reject, { once: true }); }); this.ws.addEventListener("message", ({ data }) => { const message = JSON.parse(data); if (message.id) { const pending = this.pending.get(message.id); if (!pending) return; this.pending.delete(message.id); if (message.error) pending.reject(new Error(message.error.message)); else pending.resolve(message.result); } else for (const listener of this.listeners.get(message.method) || []) listener(message.params); }); }
  on(method, listener) { this.listeners.set(method, [...(this.listeners.get(method) || []), listener]); }
  send(method, params = {}) { return new Promise((resolve, reject) => { const id = this.next++; this.pending.set(id, { resolve, reject }); this.ws.send(JSON.stringify({ id, method, params })); }); }
  async eval(expression) { const response = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails)); return response.result.value; }
  async close() { this.ws.close(); await fetch(`http://127.0.0.1:${port}/json/close/${this.targetId}`).catch(() => null); }
}

async function openPage(width, height) {
  const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }).then((response) => response.json());
  const page = new Cdp(target.webSocketDebuggerUrl, target.id); await page.connect();
  await Promise.all([page.send("Page.enable"), page.send("Runtime.enable")]);
  await page.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 480, screenWidth: width, screenHeight: height });
  await page.send("Page.navigate", { url: baseUrl });
  for (let i = 0; i < 70; i++) { if (await page.eval(`document.readyState === "complete" && document.querySelector(".arrival")`).catch(() => false)) break; await sleep(100); }
  await page.eval(`document.fonts.ready.then(()=>new Promise(r=>setTimeout(r,800)))`); return page;
}

async function encode(frameDir, outputFile) {
  await new Promise((resolve, reject) => { const child = spawn(ffmpeg, ["-y","-loglevel","error","-framerate","30","-i",path.join(frameDir,"frame-%05d.jpg"),"-vf","scale=in_range=full:out_range=tv,format=yuv420p","-c:v","libx264","-preset","medium","-crf","20","-pix_fmt","yuv420p","-movflags","+faststart",outputFile], { stdio: "inherit" }); child.once("error", reject); child.once("exit", (code) => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))); });
}

async function record({ name, width, height, action }) {
  const page = await openPage(width, height); const frameDir = await mkdtemp(path.join(os.tmpdir(), `1118-${name}-`)); const writes = []; let frame = 0;
  const still = async (count = 24) => { const shot = await page.send("Page.captureScreenshot", { format: "jpeg", quality: 88, fromSurface: true }); for (let i = 0; i < count; i++) { const current = frame++; writes.push(writeFile(path.join(frameDir, `frame-${String(current).padStart(5,"0")}.jpg`), Buffer.from(shot.data,"base64"))); } };
  page.on("Page.screencastFrame", ({ data, sessionId }) => { const current = frame++; writes.push(writeFile(path.join(frameDir, `frame-${String(current).padStart(5,"0")}.jpg`), Buffer.from(data,"base64"))); void page.send("Page.screencastFrameAck", { sessionId }); });
  await still(); await page.send("Page.startScreencast", { format: "jpeg", quality: 88, maxWidth: width, maxHeight: height, everyNthFrame: 2 }); await action(page, still); await page.send("Page.stopScreencast"); await still(); await Promise.all(writes); await page.close();
  const outputFile = path.join(outputDir, `${name}.mp4`); await encode(frameDir, outputFile); return { name, frames: frame, outputFile };
}

async function walkthrough(page) {
  await page.eval(`new Promise(resolve=>{const start=performance.now(),duration=14000,max=document.documentElement.scrollHeight-innerHeight;const tick=now=>{const p=Math.min(1,(now-start)/duration);scrollTo(0,Math.round(max*(p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2)));p<1?requestAnimationFrame(tick):setTimeout(resolve,500)};requestAnimationFrame(tick)})`);
}

async function products(page, still) {
  await page.eval(`document.querySelector(".products").scrollIntoView({block:"start"})`); await sleep(600); await still();
  for (const index of [1,2,0]) { const point = await page.eval(`(()=>{const r=document.querySelectorAll(".product-selector button")[${index}].getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`); await page.send("Input.dispatchMouseEvent", { type:"mousePressed", x:point.x, y:point.y, button:"left", clickCount:1 }); await page.send("Input.dispatchMouseEvent", { type:"mouseReleased", x:point.x, y:point.y, button:"left", clickCount:1 }); await sleep(800); await still(28); }
}

async function keyboard(page, still) {
  await page.eval(`scrollTo(0,0);document.activeElement.blur()`); await sleep(250);
  for (let i=0;i<5;i++) { await page.send("Input.dispatchKeyEvent",{type:"keyDown",key:"Tab"}); await page.send("Input.dispatchKeyEvent",{type:"keyUp",key:"Tab"}); await sleep(350); }
  await page.eval(`document.querySelector(".comparison-divider").focus()`); await still(20);
  for (const key of ["End","Home","ArrowRight","ArrowRight"]) { await page.send("Input.dispatchKeyEvent",{type:"keyDown",key}); await page.send("Input.dispatchKeyEvent",{type:"keyUp",key}); await sleep(380); }
  await page.eval(`document.querySelector(".product-selector").scrollIntoView({block:"center"});document.querySelector(".product-selector button").focus()`); await sleep(500);
  for (const key of ["ArrowRight","ArrowRight","Home"]) { await page.send("Input.dispatchKeyEvent",{type:"keyDown",key}); await page.send("Input.dispatchKeyEvent",{type:"keyUp",key}); await sleep(700); }
  await page.eval(`document.querySelector(".contact-form").scrollIntoView({block:"center"});document.querySelector(".submit-button").focus()`); await sleep(400); await page.send("Input.dispatchKeyEvent",{type:"keyDown",key:"Enter"}); await page.send("Input.dispatchKeyEvent",{type:"keyUp",key:"Enter"}); await sleep(900); await still(30);
}

await mkdir(outputDir, { recursive: true });
const results = [];
results.push(await record({ name:"desktop-founder-review", width:1440, height:900, action:walkthrough }));
results.push(await record({ name:"mobile-founder-review", width:390, height:844, action:walkthrough }));
results.push(await record({ name:"products-interaction", width:1440, height:900, action:products }));
results.push(await record({ name:"accessibility-keyboard-review", width:1440, height:900, action:keyboard }));
await writeFile(path.join(outputDir,"recordings-report.json"), JSON.stringify(results,null,2)); console.log(JSON.stringify(results,null,2));
