import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const port = process.env.CHROME_DEBUG_PORT || "9333";
const baseUrl = process.env.QA_URL || "http://127.0.0.1:3118";
const outputDir = path.resolve(
  process.env.QA_OUTPUT_DIR || "artifacts/1118-company-website-launch",
);
const axeSource = await readFile(
  path.resolve("node_modules/axe-core/axe.min.js"),
  "utf8",
);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Cdp {
  constructor(url, id) {
    this.url = url;
    this.targetId = id;
    this.next = 1;
    this.pending = new Map();
    this.events = [];
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
        this.events.push(message);
      }
    });
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

async function openPage({ width, height, reduced = false }) {
  const target = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent("about:blank")}`,
    { method: "PUT" },
  ).then((response) => response.json());
  const page = new Cdp(target.webSocketDebuggerUrl, target.id);
  await page.connect();
  await Promise.all([
    page.send("Page.enable"),
    page.send("Runtime.enable"),
    page.send("Network.enable"),
    page.send("Log.enable"),
    page.send("Performance.enable"),
  ]);
  await page.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `
      window.__qaCLS = 0;
      window.__qaLCP = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__qaCLS += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        window.__qaLCP = entries[entries.length - 1]?.startTime || 0;
      }).observe({ type: "largest-contentful-paint", buffered: true });
    `,
  });
  await page.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: width <= 480,
    screenWidth: width,
    screenHeight: height,
  });
  await page.send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: reduced
      ? [{ name: "prefers-reduced-motion", value: "reduce" }]
      : [],
  });
  await page.send("Page.navigate", { url: baseUrl });
  for (let attempt = 0; attempt < 100; attempt++) {
    const ready = await page
      .eval(
        `document.readyState === "complete" && document.querySelectorAll("main > section").length === 7`,
      )
      .catch(() => false);
    if (ready) break;
    await sleep(100);
  }
  await page.eval(`(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    for (
      let y = 0;
      y < document.documentElement.scrollHeight;
      y += Math.max(400, innerHeight * 0.75)
    ) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    scrollTo(0, 0);
    await document.fonts.ready;
    await Promise.race([
      Promise.all(
        [...document.images].map((image) =>
          image.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                image.addEventListener("load", resolve, { once: true });
                image.addEventListener("error", resolve, { once: true });
              }),
        ),
      ),
      new Promise((resolve) => setTimeout(resolve, 4000)),
    ]);
    await new Promise((resolve) => setTimeout(resolve, 300));
  })()`);
  return page;
}

async function screenshotFull(page, name) {
  await page.eval("scrollTo(0, 0)");
  await sleep(100);
  const { contentSize } = await page.send("Page.getLayoutMetrics");
  const shot = await page.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    fromSurface: true,
    clip: {
      x: 0,
      y: 0,
      width: Math.ceil(contentSize.width),
      height: Math.ceil(contentSize.height),
      scale: 1,
    },
  });
  await writeFile(path.join(outputDir, name), Buffer.from(shot.data, "base64"));
}

async function screenshotElement(page, selector, name) {
  await page.eval(
    `document.querySelector(${JSON.stringify(selector)}).scrollIntoView({ block: "start" })`,
  );
  await sleep(140);
  const rect = await page.eval(`(() => {
    const bounds = document
      .querySelector(${JSON.stringify(selector)})
      .getBoundingClientRect();
    return {
      x: bounds.x + scrollX,
      y: bounds.y + scrollY,
      width: bounds.width,
      height: bounds.height,
    };
  })()`);
  const shot = await page.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
    fromSurface: true,
    clip: {
      x: Math.max(0, Math.floor(rect.x)),
      y: Math.max(0, Math.floor(rect.y)),
      width: Math.ceil(rect.width),
      height: Math.ceil(rect.height),
      scale: 1,
    },
  });
  await writeFile(path.join(outputDir, name), Buffer.from(shot.data, "base64"));
}

async function pointerClick(page, selector, index = 0) {
  await page.eval(
    `document.querySelectorAll(${JSON.stringify(selector)})[${index}].scrollIntoView({ block: "center" })`,
  );
  await sleep(80);
  const point = await page.eval(`(() => {
    const bounds = document
      .querySelectorAll(${JSON.stringify(selector)})[${index}]
      .getBoundingClientRect();
    return {
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2,
    };
  })()`);
  await page.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: point.x,
    y: point.y,
    button: "left",
    clickCount: 1,
  });
  await page.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: point.x,
    y: point.y,
    button: "left",
    clickCount: 1,
  });
  await sleep(160);
}

async function testSlider(page) {
  await page.eval('document.querySelector(".comparison-divider").focus()');
  const press = async (key) => {
    await page.send("Input.dispatchKeyEvent", { type: "keyDown", key });
    await page.send("Input.dispatchKeyEvent", { type: "keyUp", key });
    await sleep(20);
    return page.eval(
      'Number(document.querySelector(".comparison-divider").getAttribute("aria-valuenow"))',
    );
  };
  const initial = await page.eval(
    'Number(document.querySelector(".comparison-divider").getAttribute("aria-valuenow"))',
  );
  const end = await press("End");
  const home = await press("Home");
  const arrow = await press("ArrowRight");
  const rect = await page.eval(`(() => {
    const bounds = document.querySelector(".comparison").getBoundingClientRect();
    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    };
  })()`);
  const y = rect.y + rect.height / 2;
  await page.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: rect.x + rect.width * 0.25,
    y,
    button: "left",
    clickCount: 1,
  });
  await page.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: rect.x + rect.width * 0.75,
    y,
    button: "left",
  });
  await page.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: rect.x + rect.width * 0.75,
    y,
    button: "left",
    clickCount: 1,
  });
  const pointer = await page.eval(
    'Number(document.querySelector(".comparison-divider").getAttribute("aria-valuenow"))',
  );
  return {
    initial,
    end,
    home,
    arrow,
    pointer,
    pass:
      initial === 50 &&
      end === 100 &&
      home === 0 &&
      arrow === 2 &&
      pointer >= 70,
  };
}

async function testMenu(page) {
  await pointerClick(page, ".menu-trigger");
  const opened = await page.eval(`({
    dialog: document.querySelector("#mobile-menu")?.getAttribute("role"),
    modal: document.querySelector("#mobile-menu")?.getAttribute("aria-modal"),
    focus: document.activeElement.className,
  })`);
  await page.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key: "Escape",
  });
  await page.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape" });
  await sleep(120);
  const closed = await page.eval(`({
    dialog: Boolean(document.querySelector("#mobile-menu")),
    focus: document.activeElement.className,
  })`);
  return {
    opened,
    closed,
    pass:
      opened.dialog === "dialog" &&
      opened.modal === "true" &&
      opened.focus === "menu-close" &&
      !closed.dialog &&
      closed.focus === "menu-trigger",
  };
}

async function testKeyboardFlow(page) {
  await page.eval("scrollTo(0, 0); document.activeElement.blur()");
  const stops = [];
  for (let index = 0; index < 12; index++) {
    await page.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab" });
    await page.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab" });
    stops.push(
      await page.eval(`({
        tag: document.activeElement.tagName,
        text: (
          document.activeElement.textContent ||
          document.activeElement.getAttribute("aria-label") ||
          ""
        ).trim().replace(/\\s+/g, " ").slice(0, 60),
      })`),
    );
  }
  return {
    stops,
    pass:
      stops.some((stop) => stop.text.includes("Skip to main")) &&
      stops.some((stop) => stop.text.includes("Products")) &&
      stops.some((stop) => stop.text.includes("Download on the App Store")),
  };
}

async function runAxe(page) {
  await page.eval(axeSource);
  return page.eval(`axe.run(document, {
    resultTypes: ["violations", "incomplete"],
  }).then((results) => ({
    violations: results.violations.map((item) => ({
      id: item.id,
      impact: item.impact,
      description: item.description,
      nodes: item.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
    incomplete: results.incomplete.map((item) => ({
      id: item.id,
      impact: item.impact,
      nodes: item.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
  }))`);
}

function pageErrors(events) {
  return events
    .filter(
      (event) =>
        event.method === "Runtime.exceptionThrown" ||
        (event.method === "Log.entryAdded" &&
          event.params.entry.level === "error") ||
        (event.method === "Network.loadingFailed" &&
          !event.params.canceled) ||
        (event.method === "Network.responseReceived" &&
          event.params.response.status >= 400),
    )
    .map((event) => ({
      method: event.method,
      url:
        event.params.response?.url ||
        event.params.entry?.url ||
        event.params.requestId,
      status: event.params.response?.status,
      text:
        event.params.entry?.text ||
        event.params.exceptionDetails?.text ||
        event.params.errorText,
    }));
}

async function inspect(page, viewport) {
  const structure = await page.eval(`(() => {
    const images = [...document.images];
    const focusable = [
      ...document.querySelectorAll(
        "a, button, input, select, textarea, [tabindex]",
      ),
    ];
    const navigation = performance.getEntriesByType("navigation")[0];
    const paints = Object.fromEntries(
      performance
        .getEntriesByType("paint")
        .map((entry) => [entry.name, Math.round(entry.startTime)]),
    );
    return {
      viewport: { width: innerWidth, height: innerHeight },
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      sections: document.querySelectorAll("main > section").length,
      landmarks: {
        header: Boolean(document.querySelector("header")),
        main: Boolean(document.querySelector("main")),
        footer: Boolean(document.querySelector("footer")),
        nav: document.querySelectorAll("nav").length,
      },
      h1: document.querySelector("h1")?.textContent.trim(),
      headingOrder: [...document.querySelectorAll("h1, h2, h3")].map(
        (heading) =>
          heading.tagName +
          ":" +
          heading.textContent.trim().replace(/\\s+/g, " "),
      ),
      brokenImages: images
        .filter((image) => !image.complete || !image.naturalWidth)
        .map((image) => image.currentSrc),
      missingAlt: images.filter((image) => !image.hasAttribute("alt")).length,
      unlabeled: focusable.filter(
        (node) =>
          !node.textContent.trim() &&
          !node.getAttribute("aria-label") &&
          !node.labels?.length,
      ).length,
      cls: window.__qaCLS || 0,
      lcpMs: Math.round(window.__qaLCP || 0),
      domContentLoadedMs: Math.round(
        navigation?.domContentLoadedEventEnd || 0,
      ),
      loadMs: Math.round(navigation?.loadEventEnd || 0),
      paints,
      reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
      animations: [
        ...document.querySelectorAll(
          ".entrance-text, .image-settle, .device-entrance",
        ),
      ].map((node) => getComputedStyle(node).animationDuration),
      links: [...document.querySelectorAll("a[href]")].map((link) => ({
        label: link.textContent.trim().replace(/\\s+/g, " "),
        href: link.href,
      })),
    };
  })()`);
  const accessibility =
    viewport.name === "1440x900" || viewport.name === "390x844"
      ? await runAxe(page)
      : null;
  return {
    name: viewport.name,
    ...structure,
    overflow: structure.scrollWidth > structure.clientWidth,
    consoleNetworkErrors: pageErrors(page.events),
    accessibility,
  };
}

async function fetchAsset(route, fileName) {
  const url = new URL(route, baseUrl);
  const response = await fetch(url, { redirect: "follow" });
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(outputDir, fileName), buffer);
  return {
    route,
    finalUrl: response.url,
    status: response.status,
    contentType: response.headers.get("content-type"),
    xRobotsTag: response.headers.get("x-robots-tag"),
    bytes: buffer.length,
  };
}

async function checkExternal(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "1118-launch-verification/1.0" },
    });
    return {
      url,
      status: response.status,
      finalUrl: response.url,
      pass: response.ok,
    };
  } catch (error) {
    return { url, error: String(error), pass: false };
  }
}

await mkdir(outputDir, { recursive: true });
const viewports = [
  { name: "1600x1000", width: 1600, height: 1000 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1280x800", width: 1280, height: 800 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "430x932", width: 430, height: 932 },
  { name: "390x844", width: 390, height: 844 },
  { name: "320x720", width: 320, height: 720 },
];
const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  method:
    "Visible Chromium controlled through the Chrome DevTools Protocol; lab timings are directional, not production field data.",
  viewports: [],
  interactions: {},
  zoom: {},
  metadata: [],
  externalLinks: [],
};

for (const viewport of viewports) {
  const page = await openPage(viewport);
  report.viewports.push(await inspect(page, viewport));
  if (viewport.name === "1440x900") {
    report.interactions.keyboard = await testKeyboardFlow(page);
    report.interactions.slider = await testSlider(page);
  }
  if (viewport.name === "390x844") {
    report.interactions.menu = await testMenu(page);
  }
  await page.close();
}

for (const [label, width] of [
  ["200%", 720],
  ["400%", 360],
]) {
  const page = await openPage({ width, height: 900 });
  report.zoom[label] = await page.eval(`({
    cssViewport: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    overflow:
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  })`);
  await page.close();
}

const reduced = await openPage({
  width: 390,
  height: 844,
  reduced: true,
});
report.reducedMotion = await inspect(reduced, {
  name: "390x844-reduced",
});
await reduced.close();

const desktop = await openPage({ width: 1440, height: 900 });
await screenshotFull(desktop, "full-page-1440.png");
for (const [selector, name] of [
  [".arrival", "hero-1440.png"],
  [".etchr-section", "etchr-1440.png"],
  [".products", "portfolio-1440.png"],
  [".operating-model", "model-1440.png"],
  [".about", "about-1440.png"],
  [".escape", "escape-1440.png"],
  [".contact", "contact-1440.png"],
]) {
  await screenshotElement(desktop, selector, name);
}
await desktop.close();

const mobile = await openPage({ width: 390, height: 844 });
await screenshotFull(mobile, "full-page-390.png");
for (const [selector, name] of [
  [".arrival", "hero-390.png"],
  [".etchr-section", "etchr-390.png"],
  [".products", "portfolio-390.png"],
  [".operating-model", "model-390.png"],
  [".about", "about-390.png"],
  [".escape", "escape-390.png"],
  [".contact", "contact-390.png"],
]) {
  await screenshotElement(mobile, selector, name);
}
await mobile.close();

report.metadata.push(
  await fetchAsset("/", "homepage.html"),
  await fetchAsset("/robots.txt", "robots.txt"),
  await fetchAsset("/sitemap.xml", "sitemap.xml"),
  await fetchAsset("/manifest.webmanifest", "manifest.webmanifest"),
  await fetchAsset("/opengraph-image", "opengraph-image.png"),
  await fetchAsset("/privacy", "privacy.html"),
  await fetchAsset("/terms", "terms.html"),
  await fetchAsset("/accessibility", "accessibility.html"),
);

report.externalLinks = await Promise.all([
  checkExternal(
    "https://apps.apple.com/us/app/etchr-portraits/id6785615752",
  ),
  checkExternal("https://etchr.ai"),
  checkExternal("https://etchr.ai/support"),
]);

report.pass =
  report.viewports.every(
    (item) =>
      !item.overflow &&
      item.sections === 7 &&
      item.brokenImages.length === 0 &&
      item.missingAlt === 0 &&
      item.unlabeled === 0 &&
      item.consoleNetworkErrors.length === 0 &&
      item.cls < 0.1 &&
      (!item.accessibility || item.accessibility.violations.length === 0),
  ) &&
  Object.values(report.interactions).every((item) => item.pass) &&
  !report.zoom["200%"].overflow &&
  !report.zoom["400%"].overflow &&
  report.reducedMotion.animations.every(
    (value) => Number.parseFloat(value) < 0.01,
  ) &&
  report.metadata.every((item) => item.status === 200) &&
  report.externalLinks.every((item) => item.pass);

await writeFile(
  path.join(outputDir, "validation-report.json"),
  JSON.stringify(report, null, 2),
);
console.log(
  JSON.stringify(
    {
      pass: report.pass,
      viewports: report.viewports.map((item) => ({
        name: item.name,
        overflow: item.overflow,
        brokenImages: item.brokenImages.length,
        errors: item.consoleNetworkErrors.length,
        cls: item.cls,
        accessibilityViolations:
          item.accessibility?.violations.length ?? null,
        accessibilityIncomplete:
          item.accessibility?.incomplete.length ?? null,
      })),
      interactions: Object.fromEntries(
        Object.entries(report.interactions).map(([key, value]) => [
          key,
          value.pass,
        ]),
      ),
      zoom: report.zoom,
      reducedMotion: report.reducedMotion.animations,
      metadata: report.metadata.map((item) => ({
        route: item.route,
        status: item.status,
      })),
      externalLinks: report.externalLinks.map((item) => ({
        url: item.url,
        status: item.status,
        pass: item.pass,
      })),
    },
    null,
    2,
  ),
);
if (!report.pass) process.exitCode = 1;
