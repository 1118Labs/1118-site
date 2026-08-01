import { chromium } from "/Users/stevehole/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const baseURL = (process.argv.find((argument) => argument.startsWith("--base="))?.split("=")[1] || "http://127.0.0.1:5173").replace(/\/$/, "");
const recordVideos = process.argv.includes("--videos");
const skipCaptures = process.argv.includes("--skip-captures");
const artifactRoot = path.resolve("artifacts/1118-editorial-polish-v1");
const policyDir = path.join(artifactRoot, "policy-pages-source");
const rawVideoDir = path.join(artifactRoot, "raw-video");

await Promise.all([
  mkdir(artifactRoot, { recursive: true }),
  mkdir(policyDir, { recursive: true }),
  mkdir(rawVideoDir, { recursive: true }),
]);

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
  assertions: [],
  baseURL,
  browser: {},
  checks: {},
  generatedAt: new Date().toISOString(),
  viewports: [],
};

function assert(name, pass, details = null) {
  report.assertions.push({ details, name, pass: Boolean(pass) });
}

async function primePage(page, { reducedMotion = "reduce", route = "/" } = {}) {
  await page.emulateMedia({ reducedMotion });
  await page.goto(`${baseURL}${route}`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    [...document.images].forEach((image) => { image.loading = "eager"; });
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y < total; y += 640) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 24));
    }
    await Promise.race([
      Promise.all([...document.images].map((image) => image.decode?.().catch(() => undefined))),
      new Promise((resolve) => setTimeout(resolve, 1200)),
    ]);
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(180);
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
  await page.locator("#etchr .etchr-comparison").screenshot({ path: path.join(artifactRoot, "etchr-slider-50-1440.png") });
  await page.locator("#reviews-engine").screenshot({ path: path.join(artifactRoot, "reviews-engine-1440.png") });
  await page.locator("#property-insights").screenshot({ path: path.join(artifactRoot, "property-insights-1440.png") });
  await page.locator("#signal").screenshot({ path: path.join(artifactRoot, "signal-1440.png") });
  await page.locator(".studio-section").screenshot({ path: path.join(artifactRoot, "about-1440.png") });
  await page.locator(".contact-section").screenshot({ path: path.join(artifactRoot, "contact-section-source.png") });
  await page.locator(".site-footer").screenshot({ path: path.join(artifactRoot, "footer-source.png") });

  await page.setViewportSize({ width: 390, height: 844 });
  await primePage(page);
  await page.screenshot({ fullPage: true, path: path.join(artifactRoot, "full-page-390.png") });
  await page.locator("#etchr").screenshot({ path: path.join(artifactRoot, "etchr-390.png") });
  await page.locator("#reviews-engine").screenshot({ path: path.join(artifactRoot, "reviews-engine-390.png") });
  await page.locator("#property-insights").screenshot({ path: path.join(artifactRoot, "property-insights-390.png") });
  await page.locator("#signal").screenshot({ path: path.join(artifactRoot, "signal-390.png") });

  for (const route of ["privacy", "terms", "accessibility", "support", "security"]) {
    await page.setViewportSize({ width: 900, height: 900 });
    await primePage(page, { route: `/${route}` });
    await page.screenshot({ fullPage: true, path: path.join(policyDir, `${route}.png`) });
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
      window.__editorialCls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__editorialCls += entry.value;
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
    await primePage(page);
    const metrics = await page.evaluate(() => ({
      bodyHeight: document.body.scrollHeight,
      clientWidth: document.documentElement.clientWidth,
      cls: window.__editorialCls || 0,
      failedImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc || image.src),
      h1Count: document.querySelectorAll("h1").length,
      privatePlaybookText: /playbook/i.test(document.body.innerText),
      scrollWidth: document.documentElement.scrollWidth,
      shipyardPublicText: /shipyard|goshipyard/i.test(document.body.innerText),
    }));
    const result = {
      ...viewport,
      ...metrics,
      badResponses,
      consoleErrors,
      failedRequests,
      overflow: metrics.scrollWidth > metrics.clientWidth + 1,
      pageErrors,
    };
    report.viewports.push(result);
    assert(`viewport-${viewport.width}x${viewport.height}`, !result.overflow && !consoleErrors.length && !pageErrors.length && !badResponses.length && !metrics.failedImages.length && metrics.h1Count === 1 && !metrics.privatePlaybookText && !metrics.shipyardPublicText, result);
    await page.close();
  }
}

async function runEtchrChecks(page) {
  const slider = page.getByRole("slider", { name: "Etchr portrait comparison" });
  await slider.scrollIntoViewIfNeeded();
  const attributes = await slider.evaluate((element) => ({
    max: element.getAttribute("aria-valuemax"),
    min: element.getAttribute("aria-valuemin"),
    now: element.getAttribute("aria-valuenow"),
    text: element.getAttribute("aria-valuetext"),
  }));
  await slider.press("End");
  const end = await slider.getAttribute("aria-valuenow");
  await slider.press("Home");
  const home = await slider.getAttribute("aria-valuenow");
  await slider.press("ArrowRight");
  const arrow = await slider.getAttribute("aria-valuenow");
  const frame = page.locator("#etchr .etchr-comparison");
  const bounds = await frame.boundingBox();
  if (!bounds) throw new Error("Etchr comparison is not visible");
  await page.mouse.click(bounds.x + bounds.width * 0.25, bounds.y + bounds.height * 0.5);
  const click = await slider.getAttribute("aria-valuenow");
  await page.mouse.move(bounds.x + bounds.width * 0.25, bounds.y + bounds.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width * 0.78, bounds.y + bounds.height * 0.5, { steps: 7 });
  await page.mouse.up();
  const drag = await slider.getAttribute("aria-valuenow");
  const appStore = page.locator('a[href="https://apps.apple.com/us/app/etchr-portraits/id6785615752"]');
  const badge = appStore.locator("img");
  const appStoreProof = {
    badgeLoaded: await badge.evaluate((image) => image.complete && image.naturalWidth > 0),
    badgeHeight: await badge.evaluate((image) => getComputedStyle(image).height),
    href: await appStore.getAttribute("href"),
  };
  const results = { appStoreProof, arrow, attributes, click, drag, end, home };
  report.checks.etchr = results;
  assert("etchr-keyboard-and-aria", attributes.min === "0" && attributes.max === "100" && Boolean(attributes.text) && end === "100" && home === "0" && arrow === "2", results);
  assert("etchr-mouse-click-and-drag", Number(click) >= 23 && Number(click) <= 27 && Number(drag) >= 75 && Number(drag) <= 81, results);
  assert("etchr-app-store-proof", appStoreProof.href === "https://apps.apple.com/us/app/etchr-portraits/id6785615752" && appStoreProof.badgeLoaded && appStoreProof.badgeHeight === "40px", appStoreProof);
}

async function runTouchChecks(browser) {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  const slider = page.getByRole("slider", { name: "Etchr portrait comparison" });
  await slider.scrollIntoViewIfNeeded();
  const frame = page.locator("#etchr .etchr-comparison");
  const sliderBounds = await frame.boundingBox();
  if (!sliderBounds) throw new Error("Mobile Etchr comparison is not visible");
  await page.touchscreen.tap(sliderBounds.x + sliderBounds.width * 0.2, sliderBounds.y + sliderBounds.height * 0.5);
  const tapPosition = await slider.getAttribute("aria-valuenow");

  const reviewWindow = page.locator(".reviews-proof-window");
  await reviewWindow.scrollIntoViewIfNeeded();
  const reviewBounds = await reviewWindow.boundingBox();
  if (!reviewBounds) throw new Error("Mobile reviews carousel is not visible");
  const beforeSwipe = await page.locator(".reviews-proof-status").textContent();
  const swipeResult = await reviewWindow.evaluate((element, bounds) => {
    const dispatch = (type, x, y) => element.dispatchEvent(new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      pointerId: 41,
      pointerType: "touch",
    }));
    dispatch("pointerdown", bounds.x + bounds.width * 0.8, bounds.y + bounds.height * 0.5);
    dispatch("pointermove", bounds.x + bounds.width * 0.35, bounds.y + bounds.height * 0.51);
    dispatch("pointerup", bounds.x + bounds.width * 0.25, bounds.y + bounds.height * 0.51);
    return true;
  }, reviewBounds).catch((error) => error.message);
  const afterSwipe = await page.locator(".reviews-proof-status").textContent();
  const results = { afterSwipe, beforeSwipe, swipeResult, tapPosition };
  report.checks.touch = results;
  assert("etchr-touch-tap", Number(tapPosition) >= 17 && Number(tapPosition) <= 23, results);
  assert("reviews-touch-swipe", beforeSwipe !== afterSwipe && /2 of 4/.test(afterSwipe || ""), results);
  await context.close();
}

async function runReviewChecks(page) {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#reviews-engine").scrollIntoViewIfNeeded();
  const before = await page.locator(".reviews-proof-pause").textContent();
  await page.getByRole("button", { name: "Show next review" }).click();
  const afterManual = await page.locator(".reviews-proof-pause").textContent();
  await page.waitForTimeout(5400);
  const afterManualWait = await page.locator(".reviews-proof-pause").textContent();
  await page.getByRole("button", { name: "Resume reviews" }).click();
  await page.mouse.move(4, 4);
  await page.waitForTimeout(5400);
  const afterResume = await page.locator(".reviews-proof-pause").textContent();
  await page.locator(".reviews-proof").hover();
  const beforeHoverWait = await page.locator(".reviews-proof-pause").textContent();
  await page.waitForTimeout(5400);
  const afterHoverWait = await page.locator(".reviews-proof-pause").textContent();
  const semanticCards = await page.locator(".review-fixture-card").count();
  const results = { afterHoverWait, afterManual, afterManualWait, afterResume, before, beforeHoverWait, semanticCards };
  report.checks.reviews = results;
  assert("reviews-manual-stops-and-resume-works", afterManual === afterManualWait && afterResume !== afterManual && semanticCards === 4, results);
  assert("reviews-hover-pauses", beforeHoverWait === afterHoverWait, results);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#reviews-engine").scrollIntoViewIfNeeded();
  const reducedBefore = await page.locator(".reviews-proof-status").textContent();
  await page.waitForTimeout(5400);
  const reducedAfter = await page.locator(".reviews-proof-status").textContent();
  const reduced = { after: reducedAfter, before: reducedBefore, pauseButtonCount: await page.locator(".reviews-proof-pause").count() };
  report.checks.reducedMotion = reduced;
  assert("reduced-motion-stable", reducedBefore === reducedAfter && reduced.pauseButtonCount === 0, reduced);
}

async function runPageChecks(browser) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await primePage(page);
  report.browser = { name: await browser.browserType().name(), version: browser.version() };

  const publicContent = await page.evaluate(() => ({
    about: document.querySelector("#about")?.textContent?.replace(/\s+/g, " ").trim(),
    founderOrLocation: /Steve Hole|founded by|New York/i.test(document.body.innerText),
    h1: document.querySelector("h1")?.textContent?.trim(),
    imageAltFailures: [...document.images].filter((image) => !image.hasAttribute("alt")).map((image) => image.currentSrc || image.src),
    internalTargetsMissing: [...document.querySelectorAll('a[href^="#"],a[href^="/#"]')]
      .map((anchor) => anchor.getAttribute("href"))
      .filter((href) => href?.includes("#") && !document.getElementById(href.split("#")[1])),
    landmarks: {
      footer: document.querySelectorAll("footer.site-footer").length,
      header: document.querySelectorAll("header").length,
      main: document.querySelectorAll("main").length,
    },
    productNames: [...document.querySelectorAll(".fleet-showcase-name")].map((element) => element.textContent?.trim()),
    statuses: [...document.querySelectorAll(".eyebrow-pill")].map((element) => element.textContent?.trim()),
  }));
  report.checks.publicContent = publicContent;
  assert("public-content-contract", JSON.stringify(publicContent.productNames) === JSON.stringify(["Etchr", "Reviews Engine", "Property Insights", "Signal"]) && publicContent.statuses.at(-1) === "BUILT · LICENSED · ACQUIRED" && !publicContent.founderOrLocation && !publicContent.imageAltFailures.length && !publicContent.internalTargetsMissing.length && Object.values(publicContent.landmarks).every((value) => value === 1), publicContent);

  const schema = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) || "{}");
  const serializedSchema = JSON.stringify(schema);
  const structuredData = {
    graphTypes: schema["@graph"]?.map((entry) => entry["@type"]) || [],
    hasFounderBiography: /Steve Hole|#steve-hole|"founder"|addressLocality/.test(serializedSchema),
    hasFakeCommercialFields: /aggregateRating|reviewCount|offers/.test(serializedSchema),
    softwareApplications: schema["@graph"]?.filter((entry) => entry["@type"] === "SoftwareApplication").map((entry) => entry.name) || [],
  };
  report.checks.structuredData = structuredData;
  assert("structured-data", structuredData.graphTypes.includes("Organization") && structuredData.graphTypes.includes("WebSite") && structuredData.softwareApplications.includes("Etchr Portraits") && !structuredData.hasFounderBiography && !structuredData.hasFakeCommercialFields, structuredData);

  await runEtchrChecks(page);
  await runReviewChecks(page);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open navigation menu" }).click();
  const firstMobileFocus = await page.evaluate(() => document.activeElement?.textContent?.trim());
  await page.getByRole("button", { name: "Close navigation menu" }).press("Escape");
  const mobileMenu = {
    escapeCloses: (await page.getByRole("button", { name: "Open navigation menu" }).getAttribute("aria-expanded")) === "false",
    firstFocus: firstMobileFocus,
    focusReturned: await page.evaluate(() => document.activeElement?.getAttribute("aria-label")),
  };
  report.checks.mobileMenu = mobileMenu;
  assert("mobile-menu-focus", mobileMenu.escapeCloses && mobileMenu.firstFocus === "Work" && mobileMenu.focusReturned === "Open navigation menu", mobileMenu);

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}/#contact`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start the conversation" }).click();
  const invalidFocusName = await page.evaluate(() => document.activeElement?.getAttribute("name"));
  await page.getByLabel("Name").fill("Launch QA");
  await page.getByLabel("Email").fill("launch-qa@example.com");
  await page.getByLabel("Stage").selectOption("prototype");
  await page.getByLabel("What are you building?").fill("Fail-closed launch validation.");
  await page.getByRole("button", { name: "Start the conversation" }).click();
  const contact = {
    emptySubmitFocusesFirstInvalid: invalidFocusName === "name",
    formAction: await page.locator("form").getAttribute("action"),
    formMethod: await page.locator("form").getAttribute("method"),
    status: await page.locator('[role="status"]').textContent(),
  };
  report.checks.contact = contact;
  assert("contact-fails-closed", contact.emptySubmitFocusesFirstInvalid && contact.formAction === null && contact.formMethod === null && /(not connected|does not send)/i.test(contact.status || ""), contact);

  const policyResults = [];
  for (const route of ["privacy", "terms", "accessibility", "support", "security"]) {
    const response = await page.goto(`${baseURL}/${route}`, { waitUntil: "networkidle" });
    policyResults.push({ h1: await page.locator("h1").textContent(), route, status: response?.status() });
  }
  report.checks.policyRoutes = policyResults;
  assert("policy-routes", policyResults.every((entry) => entry.status === 200 && entry.h1), policyResults);

  const reflow = [];
  for (const width of [640, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    reflow.push(await page.evaluate((currentWidth) => ({
      clientWidth: document.documentElement.clientWidth,
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      representedZoom: `${Math.round(1280 / currentWidth * 100)}%`,
      scrollWidth: document.documentElement.scrollWidth,
    }), width));
  }
  report.checks.reflow = reflow;
  assert("reflow-200-and-400-percent", reflow.every((entry) => !entry.overflow), reflow);

  await page.close();
  await runTouchChecks(browser);
}

async function recordReview(browser, name, viewport, action, reducedMotion = "reduce") {
  const context = await browser.newContext({
    recordVideo: { dir: rawVideoDir, size: viewport },
    reducedMotion,
    viewport,
  });
  const page = await context.newPage();
  await primePage(page, { reducedMotion });
  const video = page.video();
  await action(page);
  await page.close();
  if (video) await video.saveAs(path.join(rawVideoDir, `${name}.webm`));
  await context.close();
}

async function recordAllVideos(browser) {
  await recordReview(browser, "desktop-founder-review", { width: 1440, height: 900 }, async (page) => {
    const height = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let y = 0; y <= height; y += 540) {
      await page.evaluate((position) => window.scrollTo({ top: position, behavior: "smooth" }), y);
      await page.waitForTimeout(220);
    }
  });
  await recordReview(browser, "mobile-founder-review", { width: 390, height: 844 }, async (page) => {
    await page.getByRole("button", { name: "Open navigation menu" }).click();
    await page.waitForTimeout(450);
    await page.getByRole("button", { name: "Close navigation menu" }).press("Escape");
    const height = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
    for (let y = 0; y <= height; y += 430) {
      await page.evaluate((position) => window.scrollTo({ top: position, behavior: "smooth" }), y);
      await page.waitForTimeout(170);
    }
  });
  await recordReview(browser, "etchr-slider-interaction", { width: 1440, height: 900 }, async (page) => {
    const slider = page.getByRole("slider", { name: "Etchr portrait comparison" });
    await slider.scrollIntoViewIfNeeded();
    const frame = page.locator("#etchr .etchr-comparison");
    const bounds = await frame.boundingBox();
    if (!bounds) return;
    await page.waitForTimeout(500);
    await page.mouse.move(bounds.x + bounds.width * 0.5, bounds.y + bounds.height * 0.5);
    await page.mouse.down();
    await page.mouse.move(bounds.x + bounds.width * 0.18, bounds.y + bounds.height * 0.5, { steps: 12 });
    await page.mouse.move(bounds.x + bounds.width * 0.82, bounds.y + bounds.height * 0.5, { steps: 18 });
    await page.mouse.up();
    await slider.press("Home");
    await page.waitForTimeout(350);
    await slider.press("End");
    await page.waitForTimeout(350);
  });
  await recordReview(browser, "reviews-engine-carousel", { width: 1440, height: 900 }, async (page) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.reload({ waitUntil: "networkidle" });
    await page.locator("#reviews-engine").scrollIntoViewIfNeeded();
    await page.waitForTimeout(5400);
    await page.getByRole("button", { name: "Pause reviews" }).click();
    await page.waitForTimeout(500);
    await page.getByRole("button", { name: "Show next review" }).click();
    await page.waitForTimeout(650);
    await page.getByRole("button", { name: "Show previous review" }).click();
    await page.waitForTimeout(650);
  }, "no-preference");
  await recordReview(browser, "keyboard-accessibility-review", { width: 1440, height: 900 }, async (page) => {
    for (let index = 0; index < 13; index += 1) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(170);
    }
    const slider = page.getByRole("slider", { name: "Etchr portrait comparison" });
    await slider.press("Home");
    await slider.press("ArrowRight");
    await slider.press("End");
    await page.waitForTimeout(450);
    await page.locator(".reviews-proof-window").press("End");
    await page.waitForTimeout(450);
  });
}

const browser = await chromium.launch({
  executablePath: "/Users/stevehole/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell",
  headless: true,
});

try {
  if (!skipCaptures) await captureEvidence(browser);
  await runViewportMatrix(browser);
  await runPageChecks(browser);
  if (recordVideos) await recordAllVideos(browser);
  const failedAssertions = report.assertions.filter((entry) => !entry.pass);
  report.summary = { failed: failedAssertions.length, passed: report.assertions.length - failedAssertions.length, total: report.assertions.length };
  await writeFile(path.join(artifactRoot, "browser-qa.json"), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ artifactRoot, failedAssertions, summary: report.summary, videos: recordVideos }, null, 2));
  if (failedAssertions.length) process.exitCode = 1;
} finally {
  await browser.close();
}
