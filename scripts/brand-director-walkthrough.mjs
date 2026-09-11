import {chromium} from '/Users/stevehole/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import sharp from '/Users/stevehole/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.mjs';
const base=process.env.QA_BASE_URL||'http://127.0.0.1:5191';
const out=path.resolve('../../artifacts/1118-brand-director-rebuild/walkthrough',process.env.QA_RUN_NAME||'local');await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});const report={base,started:new Date().toISOString(),runs:[]};
for(const [name,width,height] of [['desktop',1440,900],['mobile',390,844]]){
 const dir=path.join(out,name);await mkdir(dir,{recursive:true});
 const auth=await browser.newContext();if(process.env.QA_ACCESS_FILE){const{url}=JSON.parse(await readFile(process.env.QA_ACCESS_FILE,'utf8'));const p=await auth.newPage();await p.goto(url,{waitUntil:'networkidle'});await p.close();}
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,isMobile:name==='mobile',hasTouch:name==='mobile',storageState:await auth.storageState(),recordVideo:{dir,size:{width,height}}});await auth.close();
 const page=await context.newPage();const video=page.video();let step=0;const run={name,width,height,errors:[],frames:[],reviews:{},routes:[]};page.on('pageerror',e=>run.errors.push(e.message));
 async function frame(label){const file=`${String(step++).padStart(3,'0')}-${label}.png`;await page.screenshot({path:path.join(dir,file)});run.frames.push({file,url:new URL(page.url()).pathname,y:await page.evaluate(()=>scrollY)});}
 async function walk(route){await page.goto(base+route,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);const slug=route==='/'?'home':route.slice(1).replaceAll('/','-');await page.waitForTimeout(1400);await frame(slug);let y=0;
  for(let i=0;i<65;i++){const m=await page.evaluate(()=>({y:scrollY,h:innerHeight,total:document.documentElement.scrollHeight}));if(m.y+m.h>=m.total-2)break;await page.mouse.move(width-6,height/2);await page.mouse.wheel(0,Math.round(height*.68));await page.waitForTimeout(1250);await frame(slug);if(await page.evaluate(()=>scrollY)===y)break;y=await page.evaluate(()=>scrollY);}
  await page.screenshot({path:path.join(dir,`${slug}-full.png`),fullPage:true});run.routes.push({route,scrollWidth:await page.evaluate(()=>document.documentElement.scrollWidth),h1:await page.locator('h1').innerText()});
 }
 await walk('/');
 await page.locator('.portrait-comparison').first().scrollIntoViewIfNeeded();await page.waitForTimeout(700);const box=await page.locator('.portrait-comparison').first().boundingBox();await page.mouse.move(box.x+box.width*.25,box.y+box.height*.45);await page.mouse.down();await page.mouse.move(box.x+box.width*.75,box.y+box.height*.45,{steps:40});await page.mouse.up();await page.waitForTimeout(1000);await frame('portrait-interaction');
 await page.locator('.re-proof-window').scrollIntoViewIfNeeded();await page.mouse.move(width-5,20);await page.waitForTimeout(1200);run.reviews.before=await page.locator('.re-proof-window').evaluate(e=>e.scrollLeft);await frame('reviews-moving-before');await page.waitForTimeout(4000);run.reviews.after=await page.locator('.re-proof-window').evaluate(e=>e.scrollLeft);await frame('reviews-moving-after');run.reviews.delta=run.reviews.after-run.reviews.before;
 await page.getByRole('button',{name:'Pause reviews',exact:true}).click();await page.waitForTimeout(200);const paused=await page.locator('.re-proof-window').evaluate(e=>e.scrollLeft);await page.waitForTimeout(1000);run.reviews.pauseStable=paused===await page.locator('.re-proof-window').evaluate(e=>e.scrollLeft);await page.getByRole('button',{name:/^(Play|Resume) reviews$/}).click();
 if(name==='mobile'){await page.locator('.pi-proof-window').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('End');await page.waitForTimeout(800);await frame('property-detail-pan');await page.locator('.pi-proof-window').evaluate(e=>e.scrollLeft=0);}
 for(const route of ['/work','/work/portrait','/work/signal'])await walk(route);
 const savedState=await context.storageState();await context.close();await video.saveAs(path.join(out,`${name}-walkthrough.webm`));
 const capture=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,storageState:savedState});const cp=await capture.newPage();
 for(const route of ['/','/work','/work/portrait','/work/signal']){await cp.goto(base+route,{waitUntil:'networkidle'});await cp.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});await cp.waitForTimeout(250);
 const slug=route==='/'?'home':route.slice(1).replaceAll('/','-');const full=await cp.screenshot({path:path.join(dir,`${slug}-full.png`),fullPage:true});
 if(route==='/')for(const [label,selector] of [['hero','.hero-section'],['portrait','#portrait'],['reviews','#reviews-engine'],['property-insights','#property-insights'],['signal','#signal'],['about','#about'],['contact','#contact'],['footer','.site-footer']]){const r=await cp.locator(selector).evaluate(e=>{const r=e.getBoundingClientRect();return{x:Math.floor(r.x),y:Math.floor(r.y+scrollY),width:Math.floor(r.width),height:Math.floor(r.height)}});await sharp(full).extract({left:r.x,top:r.y,width:r.width,height:r.height}).png().toFile(path.join(dir,`section-${label}.png`));}
 }await capture.close();report.runs.push(run);console.log(`${name}: ${run.frames.length} frames, ${run.reviews.delta}px reviews movement; ${run.errors.length} page errors`);
}
await browser.close();await writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));
