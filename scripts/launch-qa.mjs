import { chromium } from "/Users/stevehole/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseURL = (process.argv.find((argument) => argument.startsWith("--base="))?.split("=")[1] || "http://127.0.0.1:5173").replace(/\/$/, "");
const recordVideos = process.argv.includes("--videos");
const artifactRoot = path.resolve("artifacts/1118-shipyard-launch-candidate");
const finalDir = path.join(artifactRoot, "05-final");
const rawVideoDir = path.join(artifactRoot, "raw-video");

await mkdir(finalDir, { recursive: true });
await mkdir(rawVideoDir, { recursive: true });

const viewports = [
  { width: 1600, height: 1000 },
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 320, height: 720 },
];

const report = {
  baseURL,
  generatedAt: new Date().toISOString(),
  browser: {},
  checks: {},
  viewports: [],
};

async function primePage(page) {
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y < total; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(200);
}

async function captureEvidence(browser) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  await primePage(page);
  await page.screenshot({ fullPage: true, path: path.join(artifactRoot, "full-page-1600.png") });

  await page.setViewportSize({ width: 1440, height: 900 });
  await primePage(page);
  await page.screenshot({ fullPage: true, path: path.join(artifactRoot, "full-page-1440.png") });
  await page.locator(".hero-section").screenshot({ path: path.join(artifactRoot, "hero-1440.png") });
  await page.locator("#etchr").screenshot({ path: path.join(artifactRoot, "etchr-1440.png") });
  await page.locator("#reviews-engine").screenshot({ path: path.join(artifactRoot, "reviews-engine-1440.png") });
  await page.locator("#property-insights").screenshot({ path: path.join(artifactRoot, "property-insights-1440.png") });
  await page.locator("#signal").screenshot({ path: path.join(artifactRoot, "signal-1440.png") });
  await page.locator(".process-section").screenshot({ path: path.join(artifactRoot, "operating-model-1440.png") });
  await page.locator(".studio-section").screenshot({ path: path.join(artifactRoot, "about-1440.png") });
  await page.locator(".contact-section").screenshot({ path: path.join(finalDir, "contact-section-1440.png") });
  await page.locator(".site-footer").screenshot({ path: path.join(finalDir, "footer-1440.png") });

  await page.setViewportSize({ width: 390, height: 844 });
  await primePage(page);
  await page.screenshot({ fullPage: true, path: path.join(artifactRoot, "full-page-390.png") });
  await page.locator(".hero-section").screenshot({ path: path.join(artifactRoot, "hero-390.png") });
  await page.locator("#etchr").screenshot({ path: path.join(artifactRoot, "etchr-390.png") });
  await page.locator(".fleet-section").screenshot({ path: path.join(artifactRoot, "products-390.png") });
  await page.locator(".contact-section").screenshot({ path: path.join(artifactRoot, "contact-390.png") });

  for (const route of ["privacy", "terms", "accessibility", "support", "security"]) {
    await page.setViewportSize({ width: 900, height: 900 });
    await page.goto(`${baseURL}/${route}`, { waitUntil: "networkidle" });
    await page.screenshot({ fullPage: true, path: path.join(finalDir, `policy-${route}.png`) });
  }
  await page.close();
}

async function runViewportMatrix(browser) {
  for (const viewport of viewports) {
    const consoleErrors = [];
    const pageErrors = [];
    const failedRequests = [];
    const badResponses = [];
    const page = await browser.newPage({ viewport });
    await page.addInitScript(() => {
      window.__launchCls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__launchCls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("requestfailed", (request) => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || "failed"}`));
    page.on("response", (response) => {
      if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`);
    });
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(350);
    const metrics = await page.evaluate(() => ({
      bodyHeight: document.body.scrollHeight,
      clientWidth: document.documentElement.clientWidth,
      cls: window.__launchCls || 0,
      failedImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
      h1Count: document.querySelectorAll("h1").length,
      scrollWidth: document.documentElement.scrollWidth,
      shipyardPublicText: /shipyard|goshipyard/i.test(document.body.innerText),
      privatePlaybookText: /playbook/i.test(document.body.innerText),
    }));
    report.viewports.push({
      ...viewport,
      ...metrics,
      badResponses,
      consoleErrors,
      failedRequests,
      overflow: metrics.scrollWidth > metrics.clientWidth + 1,
      pageErrors,
    });
    await page.close();
  }
}

async function runFunctionalChecks(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });

  report.browser = {
    name: await browser.browserType().name(),
    version: browser.version(),
  };

  report.checks.publicContent = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent?.trim(),
    landmarks: {
      footer: document.querySelectorAll("footer").length,
      header: document.querySelectorAll("header").length,
      main: document.querySelectorAll("main").length,
      nav: document.querySelectorAll("nav").length,
    },
    headings: [...document.querySelectorAll("h1,h2,h3")].map((heading) => ({
      level: heading.tagName,
      text: heading.textContent?.replace(/\s+/g, " ").trim(),
    })),
    imageAltFailures: [...document.images].filter((image) => !image.hasAttribute("alt")).map((image) => image.currentSrc || image.src),
    internalTargetsMissing: [...document.querySelectorAll('a[href^="#"],a[href^="/#"]')]
      .map((anchor) => anchor.getAttribute("href"))
      .filter((href) => href && href.includes("#") && !document.getElementById(href.split("#")[1])),
    productNames: [...document.querySelectorAll(".fleet-showcase-name")].map((element) => element.textContent?.trim()),
    statuses: [...document.querySelectorAll(".eyebrow-pill")].map((element) => element.textContent?.trim()),
  }));

  const jsonLd = await page.locator('script[type="application/ld+json"]').textContent();
  const schema = JSON.parse(jsonLd || "{}");
  const serializedSchema = JSON.stringify(schema);
  report.checks.structuredData = {
    graphTypes: schema["@graph"]?.map((entry) => entry["@type"]) || [],
    hasFakeCommercialFields: /aggregateRating|reviewCount|offers/.test(serializedSchema),
    softwareApplications: schema["@graph"]?.filter((entry) => entry["@type"] === "SoftwareApplication").map((entry) => entry.name) || [],
    validJson: true,
  };

  await page.locator("#reviews-engine").scrollIntoViewIfNeeded();
  const reviewBefore = await page.locator(".reviews-proof-status").textContent();
  await page.getByRole("button", { name: "Show next review cards" }).click();
  const reviewAfter = await page.locator(".reviews-proof-status").textContent();
  await page.waitForTimeout(5100);
  const reviewAfterWait = await page.locator(".reviews-proof-status").textContent();
  report.checks.reviewSequence = { reviewAfter, reviewAfterWait, reviewBefore, manualOverrideStopsAutoplay: reviewAfter === reviewAfterWait };

  await page.goto(`${baseURL}/#contact`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start the conversation" }).click();
  const invalidFocusName = await page.evaluate(() => document.activeElement?.getAttribute("name"));
  await page.getByLabel("Name").fill("Launch QA");
  await page.getByLabel("Email").fill("launch-qa@example.com");
  await page.getByLabel("Stage").selectOption("prototype");
  await page.getByLabel("What are you building?").fill("Fail-closed launch validation.");
  await page.getByRole("button", { name: "Start the conversation" }).click();
  report.checks.contact = {
    emptySubmitFocusesFirstInvalid: invalidFocusName === "name",
    formAction: await page.locator("form").getAttribute("action"),
    formMethod: await page.locator("form").getAttribute("method"),
    status: await page.locator('[role="status"]').textContent(),
  };

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const firstMobileFocus = await page.evaluate(() => document.activeElement?.textContent?.trim());
  await page.getByRole("button", { name: "Close navigation menu" }).press("Escape");
  report.checks.mobileMenu = {
    escapeCloses: (await page.getByRole("button", { name: "Open navigation menu" }).getAttribute("aria-expanded")) === "false",
    firstFocus: firstMobileFocus,
    focusReturned: await page.evaluate(() => document.activeElement?.getAttribute("aria-label")),
  };

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  const focusOrder = [];
  for (let index = 0; index < 14; index += 1) {
    await page.keyboard.press("Tab");
    focusOrder.push(await page.evaluate(() => {
      const active = document.activeElement;
      return {
        ariaLabel: active?.getAttribute("aria-label"),
        href: active?.getAttribute("href"),
        tag: active?.tagName,
        text: active?.textContent?.replace(/\s+/g, " ").trim().slice(0, 80),
      };
    }));
  }
  report.checks.keyboardFocusOrder = focusOrder;

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#reviews-engine").scrollIntoViewIfNeeded();
  const reducedBefore = await page.locator(".reviews-proof-status").textContent();
  await page.waitForTimeout(5100);
  const reducedAfter = await page.locator(".reviews-proof-status").textContent();
  report.checks.reducedMotion = {
    carouselStable: reducedBefore === reducedAfter,
    mediaQuery: await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
  };

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  const zoomChecks = [];
  for (const zoom of [2, 4]) {
    zoomChecks.push(await page.evaluate((value) => {
      document.documentElement.style.zoom = String(value);
      return {
        clientWidth: document.documentElement.clientWidth,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        scrollWidth: document.documentElement.scrollWidth,
        zoom: value,
      };
    }, zoom));
  }
  report.checks.zoom = zoomChecks;

  await page.close();
}

async function recordReview(browser, name, viewport, action) {
  const context = await browser.newContext({
    recordVideo: { dir: rawVideoDir, size: viewport },
    reducedMotion: "reduce",
    viewport,
  });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  const video = page.video();
  await action(page);
  await page.close();
  if (video) await video.saveAs(path.join(rawVideoDir, `${name}.webm`));
  await context.close();
}

async function recordAllVideos(browser) {
  await recordReview(browser, "desktop-founder-review", { width: 1440, height: 900 }, async (page) => {
    const height = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let y = 0; y <= height; y += 520) {
      await page.evaluate((position) => window.scrollTo({ top: position, behavior: "smooth" }), y);
      await page.waitForTimeout(240);
    }
  });
  await recordReview(browser, "mobile-founder-review", { width: 390, height: 844 }, async (page) => {
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Close navigation menu" }).press("Escape");
    const height = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let y = 0; y <= height; y += 430) {
      await page.evaluate((position) => window.scrollTo({ top: position, behavior: "smooth" }), y);
      await page.waitForTimeout(180);
    }
  });
  await recordReview(browser, "products-review", { width: 1440, height: 900 }, async (page) => {
    for (const product of ["etchr", "reviews-engine", "property-insights", "signal"]) {
      await page.locator(`#${product}`).scrollIntoViewIfNeeded();
      await page.waitForTimeout(750);
      if (product === "reviews-engine") {
        await page.getByRole("button", { name: "Show next review cards" }).click();
        await page.waitForTimeout(500);
        await page.getByRole("button", { name: "Show previous review cards" }).click();
      }
    }
  });
  await recordReview(browser, "keyboard-accessibility-review", { width: 1440, height: 900 }, async (page) => {
    for (let index = 0; index < 18; index += 1) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(180);
    }
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await page.getByLabel("Name").focus();
    await page.waitForTimeout(400);
    await page.keyboard.press("Tab");
    await page.waitForTimeout(400);
  });
}

const browser = await chromium.launch({
  executablePath: "/Users/stevehole/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell",
  headless: true,
});
try {
  await captureEvidence(browser);
  await runViewportMatrix(browser);
  await runFunctionalChecks(browser);
  if (recordVideos) await recordAllVideos(browser);
  await writeFile(path.join(finalDir, "browser-qa.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({
    artifactRoot,
    failedViewports: report.viewports.filter((entry) => entry.overflow || entry.consoleErrors.length || entry.pageErrors.length || entry.failedImages.length),
    report: path.join(finalDir, "browser-qa.json"),
    videos: recordVideos,
  }, null, 2));
} finally {
  await browser.close();
}
