import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const port = process.env.CHROME_DEBUG_PORT || "9333";
const baseUrl = process.env.QA_URL || "http://localhost:3000";
const outputDir = path.resolve("artifacts/shipyard-foundation-rebuild");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Cdp {
  constructor(url, id) { this.url = url; this.targetId = id; this.next = 1; this.pending = new Map(); this.events = []; }
  async connect() {
    this.ws = new WebSocket(this.url);
    await new Promise((resolve, reject) => { this.ws.addEventListener("open", resolve, { once: true }); this.ws.addEventListener("error", reject, { once: true }); });
    this.ws.addEventListener("message", ({ data }) => { const message = JSON.parse(data); if (message.id) { const pending = this.pending.get(message.id); if (!pending) return; this.pending.delete(message.id); if (message.error) pending.reject(new Error(message.error.message)); else pending.resolve(message.result); } else this.events.push(message); });
  }
  send(method, params = {}) { return new Promise((resolve, reject) => { const id = this.next++; this.pending.set(id, { resolve, reject }); this.ws.send(JSON.stringify({ id, method, params })); }); }
  async eval(expression) { const response = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true }); if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails)); return response.result.value; }
  async close() { this.ws.close(); await fetch(`http://127.0.0.1:${port}/json/close/${this.targetId}`).catch(() => null); }
}

async function openPage({ width, height, reduced = false }) {
  const target = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`, { method: "PUT" }).then((response) => response.json());
  const page = new Cdp(target.webSocketDebuggerUrl, target.id); await page.connect();
  await Promise.all([page.send("Page.enable"), page.send("Runtime.enable"), page.send("Network.enable"), page.send("Log.enable")]);
  await page.send("Page.addScriptToEvaluateOnNewDocument", { source: `window.__qaCLS=0;new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.__qaCLS+=e.value}).observe({type:"layout-shift",buffered:true});` });
  await page.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width <= 480, screenWidth: width, screenHeight: height });
  await page.send("Emulation.setEmulatedMedia", { media: "screen", features: reduced ? [{ name: "prefers-reduced-motion", value: "reduce" }] : [] });
  await page.send("Page.navigate", { url: baseUrl });
  for (let attempt = 0; attempt < 80; attempt++) { if (await page.eval(`document.readyState === "complete" && document.body.innerText.length > 800`).catch(() => false)) break; await sleep(100); }
  await page.eval(`(async()=>{document.documentElement.style.scrollBehavior="auto";for(let y=0;y<document.documentElement.scrollHeight;y+=Math.max(400,innerHeight*.75)){scrollTo(0,y);await new Promise(r=>setTimeout(r,60))}scrollTo(0,0);await document.fonts.ready;await Promise.race([Promise.all([...document.images].map(i=>i.complete?Promise.resolve():new Promise(r=>{i.addEventListener("load",r,{once:true});i.addEventListener("error",r,{once:true})}))),new Promise(r=>setTimeout(r,3500))]);await new Promise(r=>setTimeout(r,250))})()`);
  page.events.length = 0;
  return page;
}

async function screenshotFull(page, name) {
  await page.eval(`scrollTo(0,0)`); await sleep(100);
  const { contentSize } = await page.send("Page.getLayoutMetrics");
  const shot = await page.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, fromSurface: true, clip: { x: 0, y: 0, width: Math.ceil(contentSize.width), height: Math.ceil(contentSize.height), scale: 1 } });
  await writeFile(path.join(outputDir, name), Buffer.from(shot.data, "base64"));
}

async function screenshotElement(page, selector, name) {
  await page.eval(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:"start"})`); await sleep(120);
  const rect = await page.eval(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height}})()`);
  const shot = await page.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, fromSurface: true, clip: { x: Math.max(0, Math.floor(rect.x)), y: Math.max(0, Math.floor(rect.y)), width: Math.ceil(rect.width), height: Math.ceil(rect.height), scale: 1 } });
  await writeFile(path.join(outputDir, name), Buffer.from(shot.data, "base64"));
}

async function pointerClick(page, selector, index = 0) {
  await page.eval(`document.querySelectorAll(${JSON.stringify(selector)})[${index}].scrollIntoView({block:"center"})`); await sleep(80);
  const point = await page.eval(`(()=>{const r=document.querySelectorAll(${JSON.stringify(selector)})[${index}].getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`);
  await page.send("Input.dispatchMouseEvent", { type: "mousePressed", x: point.x, y: point.y, button: "left", clickCount: 1 });
  await page.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: point.x, y: point.y, button: "left", clickCount: 1 });
  await sleep(620);
}

async function testSlider(page) {
  await page.eval(`document.querySelector(".comparison-divider").focus()`);
  const key = async (value) => { await page.send("Input.dispatchKeyEvent", { type: "keyDown", key: value }); await page.send("Input.dispatchKeyEvent", { type: "keyUp", key: value }); await sleep(20); return page.eval(`Number(document.querySelector(".comparison-divider").getAttribute("aria-valuenow"))`); };
  const initial = await page.eval(`Number(document.querySelector(".comparison-divider").getAttribute("aria-valuenow"))`);
  const end = await key("End"), home = await key("Home"), arrow = await key("ArrowRight");
  const rect = await page.eval(`(()=>{const r=document.querySelector(".comparison").getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}})()`);
  const y = rect.y + rect.height / 2;
  await page.send("Input.dispatchMouseEvent", { type: "mousePressed", x: rect.x + rect.width * .25, y, button: "left", clickCount: 1 });
  await page.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: rect.x + rect.width * .75, y, button: "left" });
  await page.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: rect.x + rect.width * .75, y, button: "left", clickCount: 1 });
  const pointer = await page.eval(`Number(document.querySelector(".comparison-divider").getAttribute("aria-valuenow"))`);
  return { initial, end, home, arrow, pointer, pass: initial === 50 && end === 100 && home === 0 && arrow === 2 && pointer >= 70 };
}

async function testProducts(page) {
  await pointerClick(page, ".product-selector button", 1);
  const pointer = await page.eval(`document.querySelector(".product-selector [aria-selected='true']").textContent.trim()`);
  await page.eval(`document.querySelector(".product-selector [aria-selected='true']").focus()`);
  await page.send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight" }); await page.send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight" }); await sleep(620);
  const keyboard = await page.eval(`({selected:document.querySelector(".product-selector [aria-selected='true']").textContent.trim(),focus:document.activeElement.textContent.trim()})`);
  const swipe = await page.eval(`(()=>{const target=document.querySelector(".product-story");const r=target.getBoundingClientRect();const a=new Touch({identifier:7,target,clientX:r.left+r.width*.2,clientY:Math.max(10,r.top+100)});const b=new Touch({identifier:7,target,clientX:r.left+r.width*.8,clientY:Math.max(10,r.top+100)});target.dispatchEvent(new TouchEvent("touchstart",{bubbles:true,changedTouches:[a],touches:[a]}));target.dispatchEvent(new TouchEvent("touchend",{bubbles:true,changedTouches:[b],touches:[]}));return true})()`); await sleep(620);
  const afterSwipe = await page.eval(`document.querySelector(".product-selector [aria-selected='true']").textContent.trim()`);
  return { pointer, keyboard, swipe, afterSwipe, pass: pointer.includes("Property") && keyboard.selected.includes("Manuscript") && keyboard.focus.includes("Manuscript") && afterSwipe.includes("Property") };
}

async function testMenu(page) {
  await pointerClick(page, ".menu-trigger");
  const opened = await page.eval(`({dialog:document.querySelector("#mobile-menu")?.getAttribute("role"),modal:document.querySelector("#mobile-menu")?.getAttribute("aria-modal"),focus:document.activeElement.className})`);
  await page.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape" }); await page.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape" }); await sleep(120);
  const closed = await page.eval(`({dialog:!!document.querySelector("#mobile-menu"),focus:document.activeElement.className})`);
  return { opened, closed, pass: opened.dialog === "dialog" && opened.modal === "true" && opened.focus === "menu-close" && !closed.dialog && closed.focus === "menu-trigger" };
}

async function testContact(page) {
  await page.eval(`document.querySelector(".contact-form").scrollIntoView({block:"center"})`); await sleep(80);
  await pointerClick(page, ".submit-button");
  const invalid = await page.eval(`({count:document.querySelectorAll("[aria-invalid='true']").length,focus:document.activeElement.id,status:document.querySelector(".form-status").textContent.trim()})`);
  const submitted = await page.eval(`(()=>{const f=document.querySelector(".contact-form");const values={name:"QA Founder",email:"qa@example.com",stage:"Prototype",project:"A private preview check."};for(const [name,value] of Object.entries(values)){const field=f.elements.namedItem(name);field.value=value;field.dispatchEvent(new Event(name==="stage"?"change":"input",{bubbles:true}))}f.requestSubmit();return new Promise(resolve=>requestAnimationFrame(()=>resolve({values:Object.fromEntries(Object.entries(values).map(([name])=>[name,f.elements.namedItem(name).value])),status:f.querySelector(".form-status").textContent.trim()})))})()`);
  return { invalid, submitted, pass: invalid.count === 4 && invalid.focus === "name" && submitted.status.includes("cannot send") && submitted.values.project === "A private preview check." };
}

async function testKeyboardFlow(page) {
  await page.eval(`scrollTo(0,0);document.activeElement.blur()`); const stops = [];
  for (let i = 0; i < 12; i++) { await page.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab" }); await page.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab" }); stops.push(await page.eval(`({tag:document.activeElement.tagName,text:(document.activeElement.textContent||document.activeElement.getAttribute("aria-label")||"").trim().slice(0,40)})`)); }
  return { stops, pass: stops.some((s) => s.text.includes("Skip")) && stops.some((s) => s.text.includes("Work")) && stops.some((s) => s.text.includes("comparison slider")) };
}

async function inspect(page, viewport) {
  const structure = await page.eval(`(()=>{const images=[...document.images];const focusable=[...document.querySelectorAll("a,button,input,select,textarea,[tabindex]")];return{viewport:{width:innerWidth,height:innerHeight},scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,chapters:document.querySelectorAll("main > section").length,landmarks:{header:!!document.querySelector("header"),main:!!document.querySelector("main"),footer:!!document.querySelector("footer"),nav:document.querySelectorAll("nav").length},headingOrder:[...document.querySelectorAll("h1,h2,h3")].map(h=>h.tagName+":"+h.textContent.trim().replace(/\\s+/g," ")),brokenImages:images.filter(i=>!i.complete||!i.naturalWidth).map(i=>i.currentSrc),missingAlt:images.filter(i=>!i.hasAttribute("alt")).length,unlabeled:focusable.filter(n=>!n.textContent.trim()&&!n.getAttribute("aria-label")&&!n.labels?.length).length,cls:window.__qaCLS||0,reduced:matchMedia("(prefers-reduced-motion: reduce)").matches,animations:[...document.querySelectorAll(".entrance-text,.image-settle,.device-entrance")].map(n=>getComputedStyle(n).animationDuration)}})()`);
  const errors = page.events.filter((event) => event.method === "Runtime.exceptionThrown" || event.method === "Log.entryAdded" && event.params.entry.level === "error" || event.method === "Network.loadingFailed" && !event.params.canceled || event.method === "Network.responseReceived" && event.params.response.status >= 400).map((event) => ({ method: event.method, params: event.params }));
  return { name: viewport.name, ...structure, overflow: structure.scrollWidth > structure.clientWidth, consoleNetworkErrors: errors };
}

await mkdir(outputDir, { recursive: true });
const viewports = [{ name: "1600x1000", width: 1600, height: 1000 }, { name: "1440x900", width: 1440, height: 900 }, { name: "1280x800", width: 1280, height: 800 }, { name: "1024x768", width: 1024, height: 768 }, { name: "768x1024", width: 768, height: 1024 }, { name: "430x932", width: 430, height: 932 }, { name: "390x844", width: 390, height: 844 }, { name: "320x720", width: 320, height: 720 }];
const report = { generatedAt: new Date().toISOString(), baseUrl, viewports: [], interactions: {}, zoom: {} };
for (const viewport of viewports) { const page = await openPage(viewport); report.viewports.push(await inspect(page, viewport)); if (viewport.name === "1440x900") { report.interactions.keyboard = await testKeyboardFlow(page); report.interactions.slider = await testSlider(page); report.interactions.products = await testProducts(page); report.interactions.contact = await testContact(page); } if (viewport.name === "390x844") report.interactions.menu = await testMenu(page); await page.close(); }

for (const [label, width] of [["200%", 720], ["400%", 360]]) { const page = await openPage({ width, height: 900 }); report.zoom[label] = await page.eval(`({cssViewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth})`); await page.close(); }
const reduced = await openPage({ width: 390, height: 844, reduced: true }); report.reducedMotion = await inspect(reduced, { name: "390x844-reduced" }); await reduced.close();

const desktop = await openPage({ width: 1440, height: 900 });
await screenshotFull(desktop, "full-page-1440.png");
for (const [selector, name] of [[".arrival","arrival-1440.png"],[".etchr-section","etchr-1440.png"],[".philosophy","philosophy-1440.png"],[".products","reviews-1440.png"],[".escape","escape-1440.png"],[".contact","contact-1440.png"]]) await screenshotElement(desktop, selector, name);
await pointerClick(desktop, ".product-selector button", 1); await screenshotElement(desktop, ".products", "property-1440.png");
await pointerClick(desktop, ".product-selector button", 2); await screenshotElement(desktop, ".products", "manuscript-1440.png"); await desktop.close();
const mobile = await openPage({ width: 390, height: 844 });
await screenshotFull(mobile, "full-page-390.png");
for (const [selector, name] of [[".arrival","arrival-390.png"],[".etchr-section","etchr-390.png"],[".products","products-390.png"],[".escape","escape-390.png"],[".contact","contact-390.png"]]) await screenshotElement(mobile, selector, name); await mobile.close();

report.pass = report.viewports.every((item) => !item.overflow && item.chapters === 7 && item.brokenImages.length === 0 && item.missingAlt === 0 && item.unlabeled === 0 && item.consoleNetworkErrors.length === 0 && item.cls < .1) && Object.values(report.interactions).every((item) => item.pass) && !report.zoom["200%"].overflow && !report.zoom["400%"].overflow && report.reducedMotion.animations.every((value) => Number.parseFloat(value) < .01);
await writeFile(path.join(outputDir, "validation-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2)); if (!report.pass) process.exitCode = 1;
