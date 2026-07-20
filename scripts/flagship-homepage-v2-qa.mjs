import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const chromePort = process.env.CHROME_DEBUG_PORT || "9333";
const baseUrl = process.env.QA_URL || "http://127.0.0.1:3108";
const outputDir = path.resolve("artifacts/flagship-overnight-launch-readiness");

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

class CdpSession {
  constructor(url) {
    this.url = url;
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
      throw new Error(response.exceptionDetails.text || "Runtime evaluation failed");
    }
    return response.result.value;
  }

  close() {
    this.socket.close();
  }
}

async function newPage() {
  const target = await fetch(
    `http://127.0.0.1:${chromePort}/json/new?${encodeURIComponent("about:blank")}`,
    { method: "PUT" },
  ).then((response) => response.json());
  const session = new CdpSession(target.webSocketDebuggerUrl);
  await session.connect();
  await Promise.all([
    session.send("Page.enable"),
    session.send("Runtime.enable"),
    session.send("Network.enable"),
    session.send("Log.enable"),
    session.send("Accessibility.enable"),
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
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const ready = await session
      .evaluate(
        `document.readyState === "complete" && document.body.innerText.trim().length > 100`,
      )
      .catch(() => false);
    if (ready) break;
    await sleep(100);
  }

  await session.evaluate(`
    (async () => {
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      document.documentElement.style.scrollBehavior = "auto";
      Array.from(document.images).forEach((image) => {
        image.loading = "eager";
      });
      const step = Math.max(420, Math.floor(window.innerHeight * 0.72));
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await delay(90);
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
        delay(2500)
      ]);
      await delay(1250);
      document.documentElement.style.scrollBehavior = "";
    })()
  `);
}

async function captureFullPage(session, fileName) {
  const { contentSize } = await session.send("Page.getLayoutMetrics");
  const screenshot = await session.send("Page.captureScreenshot", {
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
  await writeFile(path.join(outputDir, fileName), Buffer.from(screenshot.data, "base64"));
}

async function captureRegion(session, fileName, boundsExpression) {
  const bounds = await session.evaluate(boundsExpression);
  const screenshot = await session.send("Page.captureScreenshot", {
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
  await writeFile(path.join(outputDir, fileName), Buffer.from(screenshot.data, "base64"));
}

async function testSlider(session) {
  const initial = await session.evaluate(`
    (() => {
      const slider = document.querySelector(".comparison");
      slider.focus();
      return Number(slider.getAttribute("aria-valuenow"));
    })()
  `);

  const press = async (key) => {
    await session.send("Input.dispatchKeyEvent", { type: "keyDown", key });
    await session.send("Input.dispatchKeyEvent", { type: "keyUp", key });
    await sleep(30);
    return session.evaluate(
      `Number(document.querySelector(".comparison").getAttribute("aria-valuenow"))`,
    );
  };

  const end = await press("End");
  const home = await press("Home");
  const arrow = await press("ArrowRight");

  await session.evaluate(
    `document.querySelector(".comparison").scrollIntoView({ block: "center", behavior: "instant" })`,
  );
  await sleep(80);
  const bounds = await session.evaluate(`
    (() => {
      const rect = document.querySelector(".comparison").getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    })()
  `);
  const y = bounds.y + bounds.height / 2;
  await session.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: bounds.x + bounds.width * 0.25,
    y,
    button: "left",
    clickCount: 1,
  });
  await session.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x: bounds.x + bounds.width * 0.75,
    y,
    button: "left",
  });
  await session.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: bounds.x + bounds.width * 0.75,
    y,
    button: "left",
    clickCount: 1,
  });
  await sleep(40);
  const pointer = await session.evaluate(
    `Number(document.querySelector(".comparison").getAttribute("aria-valuenow"))`,
  );

  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [
      { x: bounds.x + bounds.width * 0.35, y, id: 1, radiusX: 4, radiusY: 4 },
    ],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [
      { x: bounds.x + bounds.width * 0.65, y, id: 1, radiusX: 4, radiusY: 4 },
    ],
  });
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await sleep(40);
  const touch = await session.evaluate(
    `Number(document.querySelector(".comparison").getAttribute("aria-valuenow"))`,
  );

  return { initial, end, home, arrow, pointer, touch };
}

async function testContactForm(session) {
  const before = await session.evaluate(`
    (() => {
      const form = document.querySelector(".contact-form");
      const fields = [...form.elements].filter((field) => ["INPUT", "TEXTAREA"].includes(field.tagName));
      return {
        exists: Boolean(form),
        initiallyValid: form.checkValidity(),
        labels: [...form.querySelectorAll("label > span")].map((label) => label.textContent.trim()),
        requiredCount: fields.filter((field) => field.required).length,
        emailType: form.querySelector('[name="email"]').type,
        mailto: form.querySelector('a[href="mailto:hello@1118.io"]')?.href || null,
      };
    })()
  `);

  const after = await session.evaluate(`
    (() => {
      const form = document.querySelector(".contact-form");
      const values = {
        name: "Launch QA",
        email: "launch-qa@example.com",
        project: "A browser validation message that must not be sent.",
      };
      for (const [name, value] of Object.entries(values)) {
        const field = form.elements.namedItem(name);
        field.value = value;
        field.dispatchEvent(new Event("input", { bubbles: true }));
      }
      form.requestSubmit();
      return new Promise((resolve) => requestAnimationFrame(() => {
        resolve({
          validAfterFill: form.checkValidity(),
          valuesRetained: Object.entries(values).every(([name, value]) => form.elements.namedItem(name).value === value),
          status: form.querySelector('[role="status"]')?.textContent.trim() || null,
        });
      }));
    })()
  `);

  return { ...before, ...after };
}

async function inspectViewport(session, viewport) {
  await session.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: viewport.width <= 520,
    screenWidth: viewport.width,
    screenHeight: viewport.height,
  });
  await session.send("Emulation.setEmulatedMedia", {
    media: "screen",
    features: viewport.reducedMotion
      ? [{ name: "prefers-reduced-motion", value: "reduce" }]
      : [],
  });
  session.events.length = 0;
  await session.send("Page.navigate", { url: baseUrl });
  await waitForPage(session);

  const report = await session.evaluate(`
    (() => {
      const sections = [".hero", ".etchr-section", ".belief-section", ".works-section", ".escape-section", ".invitation-section"];
      const images = Array.from(document.images);
      const headings = Array.from(document.querySelectorAll("h1, h2, h3"));
      const interactive = Array.from(document.querySelectorAll("a, button, input, textarea, [role='slider']"));
      const formatGrid = document.querySelector(".format-grid");
      const formatItems = Array.from(document.querySelectorAll(".format-item"));
      const workRows = Array.from(document.querySelectorAll(".work-row"));
      const escapePath = [...document.querySelectorAll(".escape-trajectory-core")].find(
        (path) => getComputedStyle(path.closest(".escape-route")).display !== "none",
      );
      const navigation = performance.getEntriesByType("navigation")[0];
      const resources = performance.getEntriesByType("resource");
      const paints = Object.fromEntries(
        performance.getEntriesByType("paint").map((entry) => [entry.name, Math.round(entry.startTime)])
      );
      return {
        title: document.title,
        bodyTextLength: document.body.innerText.trim().length,
        viewport: { width: innerWidth, height: innerHeight },
        document: {
          clientWidth: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          scrollHeight: document.documentElement.scrollHeight
        },
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        headings: headings.map((node) => ({ level: node.tagName, text: node.textContent.trim() })),
        sections: sections.map((selector) => {
          const node = document.querySelector(selector);
          const rect = node.getBoundingClientRect();
          return { selector, height: Math.round(rect.height), width: Math.round(rect.width) };
        }),
        images: images.map((image) => ({
          src: new URL(image.currentSrc || image.src).pathname,
          alt: image.alt,
          complete: image.complete,
          naturalWidth: image.naturalWidth,
          renderedWidth: Math.round(image.getBoundingClientRect().width),
        })),
        missingAlt: images.filter((image) => !image.hasAttribute("alt")).length,
        brokenImages: images.filter((image) => image.naturalWidth === 0).length,
        interactiveCount: interactive.length,
        unlabeledInteractive: interactive.filter((node) => {
          const name = node.getAttribute("aria-label") || node.labels?.[0]?.textContent.trim() || node.textContent.trim();
          return !name;
        }).length,
        navTargets: Array.from(document.querySelectorAll(".site-nav a")).map((link) => ({
          text: link.textContent.trim(),
          href: link.getAttribute("href"),
          targetExists: Boolean(document.getElementById(link.getAttribute("href").slice(1)))
        })),
        formatProof: {
          count: formatItems.length,
          labels: formatItems.map((item) => item.querySelector("figcaption").textContent.trim()),
          clientWidth: formatGrid.clientWidth,
          scrollWidth: formatGrid.scrollWidth,
          overflowX: getComputedStyle(formatGrid).overflowX,
          scrollSnapType: getComputedStyle(formatGrid).scrollSnapType,
          itemWidths: formatItems.map((item) => Math.round(item.getBoundingClientRect().width))
        },
        works: {
          rowCount: workRows.length,
          rowLinkCount: workRows.filter((row) => row.matches("a") || row.querySelector("a")).length,
          featuredLink: document.querySelector(".work-feature a")?.href || null
        },
        escapeMotion: {
          decorative: document.querySelector(".escape-arc").getAttribute("aria-hidden") === "true",
          animationName: getComputedStyle(escapePath).animationName,
          animationDuration: getComputedStyle(escapePath).animationDuration,
          animationIterationCount: getComputedStyle(escapePath).animationIterationCount,
          strokeDashoffset: getComputedStyle(escapePath).strokeDashoffset
        },
        layoutShift: Number((window.__qaLayoutShift || 0).toFixed(4)),
        performance: {
          firstContentfulPaint: paints["first-contentful-paint"] || null,
          largestContentfulPaint: Math.round(window.__qaLcp || 0) || null,
          domContentLoaded: navigation ? Math.round(navigation.domContentLoadedEventEnd) : null,
          loadEvent: navigation ? Math.round(navigation.loadEventEnd) : null,
          requestCount: resources.length,
          transferredBytes: Math.round(resources.reduce((sum, entry) => sum + (entry.transferSize || 0), 0)),
          encodedBytes: Math.round(resources.reduce((sum, entry) => sum + (entry.encodedBodySize || 0), 0)),
          initialJavaScript: {
            requestCount: resources.filter((entry) => entry.initiatorType === "script").length,
            transferredBytes: Math.round(resources.filter((entry) => entry.initiatorType === "script").reduce((sum, entry) => sum + (entry.transferSize || 0), 0)),
            encodedBytes: Math.round(resources.filter((entry) => entry.initiatorType === "script").reduce((sum, entry) => sum + (entry.encodedBodySize || 0), 0))
          },
          imageResources: resources.filter((entry) => entry.initiatorType === "img").map((entry) => ({
            path: new URL(entry.name).pathname,
            transferredBytes: Math.round(entry.transferSize || 0),
            encodedBytes: Math.round(entry.encodedBodySize || 0)
          }))
        },
        reducedMotion: {
          media: matchMedia("(prefers-reduced-motion: reduce)").matches,
          scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
          arcAnimation: getComputedStyle(escapePath).animationName,
          arcOffset: getComputedStyle(escapePath).strokeDashoffset
        }
      };
    })()
  `);

  report.slider = await testSlider(session);
  report.contactForm = await testContactForm(session);
  report.consoleErrors = session.events
    .filter(
      (event) =>
        event.method === "Runtime.exceptionThrown" ||
        (event.method === "Log.entryAdded" &&
          ["error", "warning"].includes(event.params.entry.level)) ||
        (event.method === "Runtime.consoleAPICalled" &&
          ["error", "warning"].includes(event.params.type)),
    )
    .map((event) => ({ method: event.method, params: event.params }));
  report.failedRequests = session.events
    .filter((event) => event.method === "Network.loadingFailed")
    .map((event) => event.params);

  const axTree = await session.send("Accessibility.getFullAXTree");
  report.accessibility = {
    nodeCount: axTree.nodes.length,
    headingCount: axTree.nodes.filter((node) => node.role?.value === "heading").length,
    linkCount: axTree.nodes.filter((node) => node.role?.value === "link").length,
    sliderCount: axTree.nodes.filter((node) => node.role?.value === "slider").length,
  };

  return report;
}

await mkdir(outputDir, { recursive: true });

const viewports = [
  { width: 1440, height: 1000 },
  { width: 1280, height: 900 },
  { width: 1024, height: 900 },
  { width: 768, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 720 },
];

const report = { url: baseUrl, generatedAt: new Date().toISOString(), viewports: {} };

for (const viewport of viewports) {
  const session = await newPage();
  const key = `${viewport.width}x${viewport.height}`;
  report.viewports[key] = await inspectViewport(session, viewport);
  console.log(`Validated ${key}`);

  if (viewport.width === 1440 || viewport.width === 390) {
    await session.send("Page.navigate", { url: baseUrl });
    await waitForPage(session);
    await session.evaluate(`
      document.activeElement?.blur();
      window.scrollTo({ top: 0, behavior: "instant" });
    `);
  }

  if (viewport.width === 1440) {
    await captureFullPage(session, "full-page-1440.png");
    await captureRegion(
      session,
      "hero-1440.png",
      `(() => {
        const header = document.querySelector(".site-header").getBoundingClientRect();
        const hero = document.querySelector(".hero").getBoundingClientRect();
        return { x: 0, y: 0, width: document.documentElement.clientWidth, height: hero.bottom + scrollY };
      })()`,
    );
    await captureRegion(
      session,
      "etchr-1440.png",
      `(() => {
        const rect = document.querySelector(".etchr-section").getBoundingClientRect();
        return { x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height };
      })()`,
    );
    await captureRegion(
      session,
      "formats-1440.png",
      `(() => {
        const rect = document.querySelector(".format-proof").getBoundingClientRect();
        return { x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height };
      })()`,
    );
    await captureRegion(
      session,
      "belief-1440.png",
      `(() => {
        const rect = document.querySelector(".belief-section").getBoundingClientRect();
        return { x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height };
      })()`,
    );
    await captureRegion(
      session,
      "works-1440.png",
      `(() => {
        const rect = document.querySelector(".works-section").getBoundingClientRect();
        return { x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height };
      })()`,
    );
    await captureRegion(
      session,
      "escape-1440.png",
      `(() => {
        const rect = document.querySelector(".escape-section").getBoundingClientRect();
        return { x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height };
      })()`,
    );
    await captureRegion(
      session,
      "contact-1440.png",
      `(() => {
        const rect = document.querySelector(".invitation-section").getBoundingClientRect();
        return { x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height };
      })()`,
    );
  }

  if (viewport.width === 390) {
    await captureFullPage(session, "full-page-390.png");
    await captureRegion(
      session,
      "hero-390.png",
      `(() => {
        const hero = document.querySelector(".hero").getBoundingClientRect();
        return { x: 0, y: 0, width: document.documentElement.clientWidth, height: hero.bottom + scrollY };
      })()`,
    );
    await captureRegion(
      session,
      "works-390.png",
      `(() => {
        const rect = document.querySelector(".works-section").getBoundingClientRect();
        return { x: rect.x, y: rect.y + scrollY, width: rect.width, height: rect.height };
      })()`,
    );
    await captureRegion(
      session,
      "escape-contact-390.png",
      `(() => {
        const start = document.querySelector(".escape-section").getBoundingClientRect();
        const end = document.querySelector(".invitation-section").getBoundingClientRect();
        return { x: 0, y: start.y + scrollY, width: document.documentElement.clientWidth, height: end.bottom - start.top };
      })()`,
    );
  }

  session.close();
}

const reducedMotionSession = await newPage();
report.reducedMotion = await inspectViewport(reducedMotionSession, {
  width: 390,
  height: 844,
  reducedMotion: true,
});
reducedMotionSession.close();

await writeFile(
  path.join(outputDir, "browser-qa.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

console.log(JSON.stringify({
  outputDir,
  viewports: Object.keys(report.viewports),
  reducedMotion: report.reducedMotion.reducedMotion,
}, null, 2));
