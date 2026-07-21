import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const chromePort = process.env.CHROME_DEBUG_PORT || "9333";
const baseUrl = process.env.QA_URL || "http://127.0.0.1:3108";
const outputDir = path.resolve("artifacts/cinematic-flagship-homepage");
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

class CdpSession {
  constructor(url, targetId) {
    this.url = url;
    this.targetId = targetId;
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
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
      this.events.push(message);
    });
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
      throw new Error(JSON.stringify(response.exceptionDetails));
    }
    return response.result.value;
  }

  async close() {
    this.socket.close();
    await fetch(`http://127.0.0.1:${chromePort}/json/close/${this.targetId}`).catch(() => null);
  }
}

async function newPage() {
  const target = await fetch(
    `http://127.0.0.1:${chromePort}/json/new?${encodeURIComponent("about:blank")}`,
    { method: "PUT" },
  ).then((response) => response.json());
  const session = new CdpSession(target.webSocketDebuggerUrl, target.id);
  await session.connect();
  await Promise.all([
    session.send("Page.enable"),
    session.send("Runtime.enable"),
    session.send("Network.enable"),
    session.send("Log.enable"),
  ]);
  await session.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__qaLayoutShift = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__qaLayoutShift += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
      window.__qaLcp = 0;
      try {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const latest = entries[entries.length - 1];
          if (latest) window.__qaLcp = latest.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
      } catch {}
    `,
  });
  return session;
}

async function waitForPage(session) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const ready = await session.evaluate(
      `document.readyState === "complete" && document.body.innerText.trim().length > 100`,
    ).catch(() => false);
    if (ready) break;
    await sleep(100);
  }
  await session.evaluate(`
    (async () => {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      document.documentElement.style.scrollBehavior = "auto";
      for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(420, innerHeight * .72)) {
        scrollTo(0, y);
        await delay(100);
      }
      scrollTo(0, 0);
      await document.fonts.ready;
      await Promise.race([
        Promise.all([...document.images].map((image) => image.complete ? Promise.resolve() : new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        }))),
        delay(3000),
      ]);
      document.querySelectorAll("[data-reveal]").forEach((node) => node.classList.add("is-visible"));
      await delay(1100);
    })()
  `);
}

async function configure(session, viewport, reducedMotion = false) {
  await session.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.width <= 480,
    screenWidth: viewport.width,
    screenHeight: viewport.height,
  });
  await session.send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: reducedMotion ? [{ name: "prefers-reduced-motion", value: "reduce" }] : [],
  });
  session.events.length = 0;
  await session.send("Page.navigate", { url: baseUrl });
  await waitForPage(session);
}

async function screenshotFull(session, fileName) {
  const { contentSize } = await session.send("Page.getLayoutMetrics");
  const shot = await session.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    fromSurface: true,
    clip: { x: 0, y: 0, width: Math.ceil(contentSize.width), height: Math.ceil(contentSize.height), scale: 1 },
  });
  await writeFile(path.join(outputDir, fileName), Buffer.from(shot.data, "base64"));
}

async function screenshotElement(session, selector, fileName) {
  await session.evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({ block: "start" })`);
  await sleep(300);
  const bounds = await session.evaluate(`(() => {
    const rect = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();
    return { x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height };
  })()`);
  const shot = await session.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    fromSurface: true,
    clip: {
      x: Math.max(0, Math.floor(bounds.x)),
      y: Math.max(0, Math.floor(bounds.y)),
      width: Math.ceil(bounds.width),
      height: Math.ceil(bounds.height),
      scale: 1,
    },
  });
  await writeFile(path.join(outputDir, fileName), Buffer.from(shot.data, "base64"));
}

async function testSlider(session) {
  await session.evaluate(`document.querySelector(".comparison-divider").focus()`);
  const key = async (value) => {
    await session.send("Input.dispatchKeyEvent", { type: "keyDown", key: value });
    await session.send("Input.dispatchKeyEvent", { type: "keyUp", key: value });
    await sleep(30);
    return session.evaluate(`Number(document.querySelector(".comparison-divider").getAttribute("aria-valuenow"))`);
  };
  const initial = await session.evaluate(`Number(document.querySelector(".comparison-divider").getAttribute("aria-valuenow"))`);
  const end = await key("End");
  const home = await key("Home");
  const arrow = await key("ArrowRight");
  const bounds = await session.evaluate(`(() => {
    const rect = document.querySelector(".comparison").getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  })()`);
  const y = bounds.y + bounds.height / 2;
  await session.send("Input.dispatchMouseEvent", { type: "mousePressed", x: bounds.x + bounds.width * .25, y, button: "left", clickCount: 1 });
  await session.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: bounds.x + bounds.width * .75, y, button: "left" });
  await session.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: bounds.x + bounds.width * .75, y, button: "left", clickCount: 1 });
  const pointer = await session.evaluate(`Number(document.querySelector(".comparison-divider").getAttribute("aria-valuenow"))`);
  await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: bounds.x + bounds.width * .35, y, id: 1, radiusX: 4, radiusY: 4 }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: bounds.x + bounds.width * .65, y, id: 1, radiusX: 4, radiusY: 4 }] });
  await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  const touch = await session.evaluate(`Number(document.querySelector(".comparison-divider").getAttribute("aria-valuenow"))`);
  return { initial, end, home, arrow, pointer, touch };
}

async function testWorks(session) {
  const labels = await session.evaluate(`[...document.querySelectorAll(".works-rail button")].map((button) => button.textContent.trim().replace(/\\s+/g, " "))`);
  await session.evaluate(`document.querySelectorAll(".works-rail button")[1].click()`);
  await sleep(700);
  const clicked = await session.evaluate(`document.querySelector(".works-copy h3").textContent.trim()`);
  await session.evaluate(`document.querySelector(".works-gallery").focus?.(); document.querySelectorAll(".works-rail button")[1].focus()`);
  await session.send("Input.dispatchKeyEvent", { type: "keyDown", key: "ArrowRight" });
  await session.send("Input.dispatchKeyEvent", { type: "keyUp", key: "ArrowRight" });
  await sleep(700);
  const keyboard = await session.evaluate(`document.querySelector(".works-copy h3").textContent.trim()`);
  await session.evaluate(`(() => {
    const target = document.querySelector(".works-gallery");
    const rect = target.getBoundingClientRect();
    const start = new Touch({ identifier: 9, target, clientX: rect.left + rect.width * .75, clientY: Math.max(10, rect.top + 180) });
    const end = new Touch({ identifier: 9, target, clientX: rect.left + rect.width * .25, clientY: Math.max(10, rect.top + 180) });
    target.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, cancelable: true, changedTouches: [start], touches: [start] }));
    target.dispatchEvent(new TouchEvent("touchmove", { bubbles: true, cancelable: true, changedTouches: [end], touches: [end] }));
    target.dispatchEvent(new TouchEvent("touchend", { bubbles: true, cancelable: true, changedTouches: [end], touches: [] }));
  })()`);
  await sleep(700);
  const swipe = await session.evaluate(`document.querySelector(".works-copy h3").textContent.trim()`);
  return { labels, clicked, keyboard, swipe };
}

async function testContact(session) {
  return session.evaluate(`(() => {
    const form = document.querySelector(".contact-form");
    const before = {
      initiallyValid: form.checkValidity(),
      labels: [...form.querySelectorAll("label > span")].map((node) => node.textContent.trim()),
      required: [...form.querySelectorAll("input, textarea")].filter((field) => field.required).length,
    };
    const values = { name: "Cinematic QA", email: "qa@example.com", project: "A preview-only test message." };
    for (const [name, value] of Object.entries(values)) {
      const field = form.elements.namedItem(name);
      field.value = value;
      field.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const submitEvent = new SubmitEvent("submit", { bubbles: true, cancelable: true, submitter: form.querySelector('button[type="submit"]') });
    form.dispatchEvent(submitEvent);
    return new Promise((resolve) => requestAnimationFrame(() => resolve({
      ...before,
      validAfterFill: form.checkValidity(),
      submitPrevented: submitEvent.defaultPrevented,
      retained: Object.entries(values).every(([name, value]) => form.elements.namedItem(name).value === value),
      status: form.querySelector('[role="status"]')?.textContent.trim() || null,
    })));
  })()`);
}

async function inspect(session, viewport) {
  console.log(`inspect ${viewport.name}: layout`);
  await session.evaluate(`scrollTo(0, 0)`);
  await sleep(100);
  const layout = await session.evaluate(`(() => {
    const images = [...document.images];
    const resources = performance.getEntriesByType("resource");
    const sections = [...document.querySelectorAll("main > section")];
    const header = document.querySelector(".site-header");
    return {
      viewport: { width: innerWidth, height: innerHeight },
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      chapters: sections.map((section) => ({ id: section.id, height: Math.round(section.getBoundingClientRect().height) })),
      brokenImages: images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc),
      missingAlt: images.filter((image) => !image.hasAttribute("alt")).length,
      unlabeledControls: [...document.querySelectorAll("button, input, textarea, [role=slider]")].filter((node) => !node.getAttribute("aria-label") && !node.labels?.length && !node.textContent.trim()).length,
      headerThemeAtTop: header.className,
      cls: window.__qaLayoutShift,
      lcp: Math.round(window.__qaLcp),
      resourceCount: resources.length,
      transferBytes: resources.reduce((sum, resource) => sum + (resource.encodedBodySize || 0), 0),
      initialJsBytes: resources.filter((resource) => resource.name.includes("/_next/static") && resource.name.includes(".js")).reduce((sum, resource) => sum + (resource.encodedBodySize || 0), 0),
      errorOverlay: Boolean(document.querySelector("[data-nextjs-dialog], .vite-error-overlay")),
    };
  })()`);
  await session.evaluate(`scrollTo(0, document.querySelector("#work").offsetTop + 120)`);
  await sleep(100);
  layout.headerThemeAtEtchr = await session.evaluate(`document.querySelector(".site-header").className`);
  await session.evaluate(`scrollTo(0, document.querySelector("#works").offsetTop + 120)`);
  await sleep(100);
  layout.headerThemeAtWorks = await session.evaluate(`document.querySelector(".site-header").className`);
  await session.evaluate(`scrollTo(0,0)`);
  await sleep(100);

  console.log(`inspect ${viewport.name}: slider`);
  const slider = await testSlider(session);
  await session.evaluate(`document.querySelector("#works").scrollIntoView({ behavior: "instant" })`);
  console.log(`inspect ${viewport.name}: works`);
  const works = await testWorks(session);
  console.log(`inspect ${viewport.name}: contact`);
  const contact = await testContact(session);
  const eventErrors = session.events.filter((event) =>
    event.method === "Runtime.exceptionThrown" ||
    event.method === "Network.loadingFailed" ||
    (event.method === "Log.entryAdded" && event.params.entry.level === "error"),
  );
  return { ...layout, slider, works, contact, eventErrors: eventErrors.length, viewport };
}

async function selectProduct(session, index) {
  await session.evaluate(`document.querySelectorAll(".works-rail button")[${index}].click()`);
  await sleep(750);
}

await mkdir(outputDir, { recursive: true });
const viewports = [
  { name: "1600", width: 1600, height: 1000 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1024", width: 1024, height: 768 },
  { name: "768", width: 768, height: 1024 },
  { name: "430", width: 430, height: 932 },
  { name: "390", width: 390, height: 844 },
  { name: "320", width: 320, height: 720 },
];

const report = [];
for (const viewport of viewports) {
  console.log(`configure ${viewport.name}`);
  const session = await newPage();
  await configure(session, viewport);
  if (viewport.name === "1440") {
    await screenshotFull(session, "full-page-1440.png");
    await screenshotElement(session, ".arrival", "arrival-1440.png");
    await screenshotElement(session, ".etchr", "etchr-1440.png");
    await screenshotElement(session, ".belief", "belief-1440.png");
    await selectProduct(session, 0);
    await screenshotElement(session, ".works", "works-reviews-1440.png");
    await selectProduct(session, 1);
    await screenshotElement(session, ".works", "works-property-insights-1440.png");
    await selectProduct(session, 2);
    await screenshotElement(session, ".works", "works-manuscript-1440.png");
    await screenshotElement(session, ".escape", "escape-1440.png");
    await screenshotElement(session, ".invitation", "invitation-1440.png");
  }
  if (viewport.name === "390") {
    await screenshotFull(session, "full-page-390.png");
    await screenshotElement(session, ".arrival", "arrival-390.png");
    await screenshotElement(session, ".etchr", "etchr-390.png");
    await screenshotElement(session, ".works", "works-390.png");
    await screenshotElement(session, ".escape", "escape-390.png");
    await screenshotElement(session, ".invitation", "invitation-390.png");
  }
  report.push(await inspect(session, viewport));
  await session.close();
}

const session = await newPage();
await configure(session, { width: 390, height: 844 }, true);
const reducedMotion = await session.evaluate(`(() => {
  document.getElementById("1118").scrollIntoView({ behavior: "instant" });
  const path = [...document.querySelectorAll(".escape-trajectory-core")].find((node) => getComputedStyle(node.closest(".escape-route")).display !== "none");
  const point = [...document.querySelectorAll(".escape-endpoint-core")].find((node) => getComputedStyle(node.closest(".escape-route")).display !== "none");
  return {
    media: matchMedia("(prefers-reduced-motion: reduce)").matches,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    pathOffset: path ? getComputedStyle(path).strokeDashoffset : null,
    endpointOpacity: point ? getComputedStyle(point).opacity : null,
    arrivalOpacity: getComputedStyle(document.querySelector(".arrival-line")).opacity,
  };
})()`);

await writeFile(path.join(outputDir, "browser-qa.json"), `${JSON.stringify({ report, reducedMotion }, null, 2)}\n`);
await session.close();
console.log(JSON.stringify({ report, reducedMotion }, null, 2));
