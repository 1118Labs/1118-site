import { chromium } from '/Users/stevehole/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const base = process.env.QA_BASE_URL || 'http://localhost:5191';
const out = path.resolve('../../artifacts/1118-system-overhaul/qa', process.env.QA_RUN_NAME || 'development');
await mkdir(out, { recursive: true });
const axe = await readFile('/Users/stevehole/.codex/visualizations/2026/07/28/019faaa5-7903-7532-9530-4166c9f87102/founder-os-strategy-director-v0.4/node_modules/axe-core/axe.min.js', 'utf8');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = { base, started: new Date().toISOString(), checks: [], viewports: [], runtime: [], limitations: ['Headless Chrome automation does not replace the requested visible founder review.', 'Native browser zoom is tested separately in creative-native-zoom.mjs.', 'CLS is measured during this scripted page-loading and scrolling sample, not field telemetry.'] };
const check = (name, pass, evidence) => { report.checks.push({ name, pass: Boolean(pass), evidence }); console.log(`${pass ? 'PASS' : 'FAIL'} ${name}`); };
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function pageFor(viewport, extra = {}) {
  const context = await browser.newContext({ viewport, ...extra });
  const page = await context.newPage();
  const runtime = { viewport, errors: [], console: [], failedRequests: [], httpErrors: [] };
  page.on('pageerror', e => runtime.errors.push(e.message));
  page.on('console', m => { if (['error', 'warning'].includes(m.type())) runtime.console.push({ type: m.type(), text: m.text() }); });
  page.on('requestfailed', r => runtime.failedRequests.push({ url: r.url(), error: r.failure()?.errorText }));
  page.on('response', r => { if (r.status() >= 400) runtime.httpErrors.push({ url: r.url(), status: r.status() }); });
  await page.addInitScript(() => {
    window.__qaShifts = [];
    new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__qaShifts.push({ value: entry.value, time: entry.startTime, sources: entry.sources.map(s=>({node:s.node?.tagName,class:s.node?.className,previous:s.previousRect.toJSON(),current:s.currentRect.toJSON()})) }); }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  report.runtime.push(runtime);
  return { page, context, runtime };
}

async function loadPage(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 700) { await page.evaluate(y => scrollTo({top:y,behavior:'instant'}), y); await wait(80); }
  await page.evaluate(async () => { await Promise.race([Promise.all(Array.from(document.images).map(i => i.decode().catch(() => {}))),new Promise(resolve=>setTimeout(resolve,3000))]); });
  await page.evaluate(() => scrollTo({top:0,behavior:'instant'}));
  await wait(150);
}

async function auditAxe(page, label) {
  await page.addScriptTag({ content: axe });
  const result = await page.evaluate(async () => {
    const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] } });
    return { violations: result.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description, nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary, html: n.html })) })), incomplete: result.incomplete.map(v => ({ id: v.id, count: v.nodes.length })), passes: result.passes.length };
  });
  await writeFile(path.join(out, `axe-${label}.json`), JSON.stringify(result, null, 2));
  check(`axe ${label}`, result.violations.length === 0, result);
}

try {
  if (process.env.QA_MODE === 'policies') {
    const {page,context}=await pageFor({width:390,height:844});
    for(const route of ['/privacy','/terms','/accessibility','/support','/security','/work','/work/portrait','/work/signal']) {
      const response=await page.goto(base+route,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      check(`${route} loads`,response.status()===200&&await page.locator('h1').count()===1,{status:response.status(),h1:await page.locator('h1').innerText()});
      check(`${route} mobile overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})));
      await auditAxe(page,route.slice(1).replaceAll('/','-'));
      await page.screenshot({path:path.join(out,route.slice(1).replaceAll('/','-')+'.png'),fullPage:true});
    }
    await page.goto(base,{waitUntil:'networkidle'});
    await page.getByLabel('Name',{exact:true}).fill('QA Example');
    await page.getByLabel('Email',{exact:true}).fill('qa@example.test');
    await page.getByRole('textbox',{name:'Company (optional)',exact:true}).fill('QA Example Company');
    await page.getByLabel('What are you thinking about?',{exact:true}).fill('An isolated QA check of the form fields.');
    check('contact fields editable',await page.getByLabel('Name',{exact:true}).inputValue()==='QA Example',{});
    await context.close();
  } else if (process.env.QA_MODE === 'keyboard') {
    const {page,context}=await pageFor({width:390,height:844});
    await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
    check('skip link reaches main',await page.evaluate(()=>document.activeElement.id==='main-content'),await page.evaluate(()=>document.activeElement.tagName));
    await page.getByRole('button',{name:'Open navigation menu'}).click();
    const sequence=[];
    for(let i=0;i<12;i++){sequence.push(await page.evaluate(()=>({text:document.activeElement.textContent,inMenu:!!document.activeElement.closest('#mobile-navigation,.mobile-menu-button')})));await page.keyboard.press(i<6?'Tab':'Shift+Tab');}
    check('mobile menu bidirectional loop',sequence.every(x=>x.inMenu),sequence);
    await page.keyboard.press('Escape');
    check('Escape restores menu trigger',await page.getByRole('button',{name:'Open navigation menu'}).evaluate(e=>document.activeElement===e),await page.evaluate(()=>document.activeElement.outerHTML));
    await context.close();
  } else {
  for (const [width, height] of [[1600,1000],[1440,900],[1280,800],[1024,768],[768,1024],[430,932],[390,844],[320,720]]) {
    const { page, context, runtime } = await pageFor({ width, height });
    await loadPage(page);
    const metrics = await page.evaluate(() => {
      const overflow = Array.from(document.querySelectorAll('body *')).filter(e => {
        const r = e.getBoundingClientRect();
        const s = getComputedStyle(e);
        if (s.position === 'absolute' || s.position === 'fixed' || s.visibility === 'hidden' || s.display === 'none' || e.closest('.re-proof-window, .portrait-comparison')) return false;
        return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1);
      }).map(e => ({ tag: e.tagName, class: e.className, text: e.textContent.slice(0, 80), rect: { x: e.getBoundingClientRect().x, width: e.getBoundingClientRect().width } }));
      const relevantImages = Array.from(document.images).filter(i => {
        const rect=i.getBoundingClientRect();
        if (!rect.width || !rect.height) return false;
        const window=i.closest('.re-proof-window');
        if (window) { const clip=window.getBoundingClientRect(); if(rect.right<=clip.left || rect.left>=clip.right) return false; }
        return true;
      });
      const brokenImages = relevantImages.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.currentSrc || i.src);
      const deferredOffscreenImages=Array.from(document.images).filter(i=>!relevantImages.includes(i)&&(!i.complete||!i.naturalWidth)).map(i=>i.currentSrc||i.src);
      const imageSizes = Array.from(document.images).filter(i => i.getBoundingClientRect().width > 0).map(i => ({ src: i.currentSrc, alt: i.alt, source: [i.naturalWidth, i.naturalHeight], rendered: [i.clientWidth, i.clientHeight] }));
      let cls = 0, value = 0, first = 0, last = 0;
      for (const shift of window.__qaShifts) { if (shift.time - last > 1000 || shift.time - first > 5000) { value = 0; first = shift.time; } value += shift.value; cls = Math.max(cls, value); last = shift.time; }
      return { shifts:window.__qaShifts, deferredOffscreenImages, width: innerWidth, scrollWidth: document.documentElement.scrollWidth, overflow, brokenImages, imageSizes, cls, h1: document.querySelectorAll('h1').length, headings: Array.from(document.querySelectorAll('h1,h2,h3')).map(h => ({ level: h.tagName, text: h.textContent })) };
    });
    const label = `${width}x${height}`;
    report.viewports.push({ label, ...metrics });
    check(`horizontal overflow ${label}`, metrics.scrollWidth <= width + 1, { width, scrollWidth: metrics.scrollWidth, overflow: metrics.overflow });
    check(`loaded images ${label}`, metrics.brokenImages.length === 0, metrics.brokenImages);
    check(`one h1 ${label}`, metrics.h1 === 1, metrics.h1);
    check(`sample CLS ${label}`, metrics.cls <= 0.1, {value:metrics.cls,shifts:metrics.shifts});
    await page.screenshot({ path: path.join(out, `full-${label}.png`), fullPage: true });
    if ([1440,390,320].includes(width)) await auditAxe(page, label);
    check(`runtime ${label}`, !runtime.errors.length && !runtime.httpErrors.length && !runtime.failedRequests.length, runtime);
    await context.close();
  }

  const { page, context } = await pageFor({ width: 1440, height: 900 });
  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => ({ text: document.activeElement.textContent, href: document.activeElement.getAttribute('href') }));
  check('skip link first keyboard stop', /skip/i.test(firstFocus.text) && firstFocus.href === '#main-content', firstFocus);
  await page.keyboard.press('Enter');
  check('skip link reaches main', await page.evaluate(() => document.activeElement.id === 'main-content'), await page.evaluate(() => document.activeElement.outerHTML.slice(0,150)));

  const slider = page.getByRole('slider', { name: 'Laurie V. Portrait comparison' });
  await slider.focus();
  const focusStyle = await slider.evaluate(e => ({ outline: getComputedStyle(e).outlineStyle, outlineWidth: getComputedStyle(e).outlineWidth, shadow: getComputedStyle(e).boxShadow }));
  check('slider visible focus style', focusStyle.outline !== 'none' && parseFloat(focusStyle.outlineWidth) >= 2, focusStyle);
  for (const [key, expected] of [['Home',0],['ArrowRight',2],['Shift+ArrowRight',12],['End',100],['ArrowLeft',98]]) {
    await slider.press(key);
    const value = Number(await slider.getAttribute('aria-valuenow'));
    check(`slider ${key}`, value === expected, { value, expected });
  }
  await slider.press('Home');
  await page.locator('.portrait-comparison').first().screenshot({ path: path.join(out, 'portrait-original.png') });
  await slider.press('End');
  await page.locator('.portrait-comparison').first().screenshot({ path: path.join(out, 'portrait-result.png') });
  await slider.press('Home');
  for (let i = 0; i < 25; i++) await slider.press('ArrowRight');
  await page.locator('.portrait-comparison').first().screenshot({ path: path.join(out, 'portrait-50percent-focus.png') });
  const stage = await page.locator('.portrait-comparison').first().boundingBox();
  await page.mouse.move(stage.x + stage.width * .3, stage.y + stage.height * .6);
  await page.mouse.down();
  await page.mouse.move(stage.x + stage.width * .7, stage.y + stage.height * .6, { steps: 10 });
  await page.mouse.up();
  check('slider mouse drag reaches 70%', Math.abs(Number(await slider.getAttribute('aria-valuenow')) - 70) <= 1, await slider.getAttribute('aria-valuenow'));

  await context.close();

  const mobile = await pageFor({ width: 390, height: 844 }, { isMobile: true, hasTouch: true });
  const mp = mobile.page;
  await mp.getByRole('button', { name: 'Open navigation menu' }).click();
  check('mobile menu expands', await mp.getByRole('button', { name: 'Close navigation menu' }).getAttribute('aria-expanded') === 'true', await mp.getByRole('navigation', { name: 'Mobile navigation' }).isVisible());
  const focusEntries = [];
  for (let i = 0; i < 8; i++) { focusEntries.push(await mp.evaluate(() => ({ text: document.activeElement.textContent, inMenu: Boolean(document.activeElement.closest('#mobile-navigation,.mobile-menu-button')) }))); await mp.keyboard.press('Tab'); }
  check('mobile menu keyboard containment', focusEntries.every(f => f.inMenu), focusEntries);
  await mp.keyboard.press('Escape'); await wait(100);
  check('mobile Escape closes and restores focus', await mp.getByRole('button', { name: 'Open navigation menu' }).evaluate(e => document.activeElement === e) && !(await mp.getByRole('navigation', { name: 'Mobile navigation' }).isVisible()), await mp.evaluate(() => document.activeElement.outerHTML));
  const cdp = await mobile.context.newCDPSession(mp);
  const swipe = async (from, to) => {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y }] });
    for (let i = 1; i <= 12; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + (to.x-from.x)*i/12, y: from.y + (to.y-from.y)*i/12 }] }); await wait(20); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await wait(150);
  };
  const mstage = mp.locator('.portrait-comparison').first();
  await mstage.scrollIntoViewIfNeeded();
  let box = await mstage.boundingBox();
  await swipe({ x: box.x + box.width*.25, y: box.y+box.height*.5 }, { x:box.x+box.width*.75,y:box.y+box.height*.5 });
  const touchValue = Number(await mp.getByRole('slider', { name: 'Laurie V. Portrait comparison' }).getAttribute('aria-valuenow'));
  check('slider real touch swipe', Math.abs(touchValue-75) <= 2, touchValue);
  const scrollBefore = await mp.evaluate(() => scrollY);
  box = await mstage.boundingBox();
  await swipe({ x:box.x+box.width*.5,y:box.y+box.height*.7 }, { x:box.x+box.width*.5,y:box.y+box.height*.25 });
  const scrollAfter = await mp.evaluate(() => scrollY);
  check('vertical touch scroll over slider', scrollAfter > scrollBefore+20, { scrollBefore, scrollAfter });
  await mobile.context.close();

  const reduced = await pageFor({ width:1440,height:900 }, { reducedMotion:'reduce' });
  await reduced.page.locator('.re-proof-window').scrollIntoViewIfNeeded();
  const rw = reduced.page.locator('.re-proof-window');
  const rBefore = await rw.evaluate(e => e.scrollLeft);
  await wait(1500);
  check('reduced motion stable marquee', await rw.evaluate(e => e.scrollLeft) === rBefore, {before:rBefore,after:await rw.evaluate(e=>e.scrollLeft)});
  check('no next or previous review controls', await reduced.page.getByRole('button',{name:/next review|previous review/i}).count() === 0, {});
  await rw.focus(); await rw.press('ArrowRight'); await wait(200);
  check('reduced motion manual keyboard scroll', await rw.evaluate(e=>e.scrollLeft)>rBefore, await rw.evaluate(e=>e.scrollLeft));
  await reduced.page.screenshot({path:path.join(out,'reduced-motion-reviews.png')});
  await reduced.context.close();



  }
} catch (error) {
  report.fatal = { message:error.message, stack:error.stack };
  check('QA script completed',false,error.message);
} finally {
  await browser.close();
  report.finished = new Date().toISOString();
  report.summary = { passed:report.checks.filter(c=>c.pass).length, failed:report.checks.filter(c=>!c.pass).length };
  await writeFile(path.join(out,'results.json'),JSON.stringify(report,null,2));
  await writeFile(path.join(out,'report.md'),`# Responsive and accessibility QA\n\n${report.started} → ${report.finished}\n\nTarget: ${base}\n\n${report.summary.passed} passed; ${report.summary.failed} failed.\n\n## Checks\n\n${report.checks.map(c=>`- ${c.pass?'PASS':'FAIL'} — ${c.name}`).join('\n')}\n\n## Failures\n\n${report.checks.filter(c=>!c.pass).map(c=>`### ${c.name}\n\n\`\`\`json\n${JSON.stringify(c.evidence,null,2)}\n\`\`\``).join('\n\n')}\n\n## Limits\n\n${report.limitations.map(l=>`- ${l}`).join('\n')}\n\nDetailed observations, runtime events and image dimensions: results.json.\n`);
  console.log(JSON.stringify(report.summary));
}
