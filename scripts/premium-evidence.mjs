import {chromium} from '/Users/stevehole/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {mkdir,writeFile,rename} from 'node:fs/promises';
import path from 'node:path';
const base=process.env.QA_BASE||'http://127.0.0.1:5191';
const out=path.resolve('../../artifacts/1118-premium-brand-pass');
for(const d of ['screenshots','raw-video']) await mkdir(path.join(out,d),{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const sections=[['hero','#top'],['portrait','#portrait'],['reviews-engine','#reviews-engine'],['property-insights','#property-insights'],['signal','#signal'],['operating-model','#about'],['contact-footer','#contact'],['footer','.site-footer']];
const errors=[],motion=[];
async function settle(page){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});}
async function capture(page,label,route='/'){
 await page.goto(base+route,{waitUntil:'networkidle'});await settle(page);await page.emulateMedia({reducedMotion:'reduce'});
 await page.screenshot({fullPage:true,path:path.join(out,'screenshots',`${label}.png`)});
 if(route==='/'){
  const boxes={};for(const [name,selector] of sections) boxes[name]=await page.locator(selector).boundingBox();
  await writeFile(path.join(out,'screenshots',`${label}-boxes.json`),JSON.stringify(boxes,null,2));
 }await page.emulateMedia({reducedMotion:'no-preference'});
}
async function scrollAll(page,pause=650){
 const h=await page.evaluate(()=>document.documentElement.scrollHeight);const step=await page.evaluate(()=>innerHeight*.65);
 for(let y=0;y<h;y+=step){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(pause);}
}
async function showMotion(page,label){
 const carousel=page.locator('.re-proof');await carousel.scrollIntoViewIfNeeded();await page.mouse.move(0,0);
 const read=()=>page.locator('.re-proof-track').evaluate(e=>e.style.getPropertyValue('--re-position'));
 const before=await read();await page.waitForTimeout(6200);const after=await read();motion.push({label,before,after,visiblyAdvanced:before!==after});
}
async function record(name,viewport,fn,mobile=false){
 if(process.env.QA_ONLY&&!process.env.QA_ONLY.split(',').includes(name))return;
 const context=await browser.newContext({viewport,isMobile:mobile,hasTouch:mobile,recordVideo:{dir:path.join(out,'raw-video'),size:viewport},reducedMotion:'no-preference'});
 const page=await context.newPage();page.on('pageerror',e=>errors.push({name,error:e.message}));await page.goto(base,{waitUntil:'networkidle'});await settle(page);await fn(page);const video=page.video();await context.close();await rename(await video.path(),path.join(out,'raw-video',`${name}.webm`));
}
if(!process.env.QA_ONLY){
 for(const[label,viewport]of [['desktop',{width:1440,height:900}],['tablet',{width:768,height:1024}],['mobile',{width:390,height:844}]]){
  const page=await browser.newPage({viewport});await capture(page,`full-page-${label}`);
  for(const route of ['/work','/work/portrait','/work/signal']) await capture(page,`${route.slice(1).replaceAll('/','-')}-${label}`,route);
  if(label==='mobile')for(const route of ['/privacy','/terms','/accessibility','/support','/security'])await capture(page,`policy-${route.slice(1)}`,route);
  await page.close();
 }
}
for(const[label,viewport]of [['desktop',{width:1440,height:900}],['mobile',{width:390,height:844}]])await record(`${label}-founder-review`,viewport,async page=>{await page.waitForTimeout(1600);await scrollAll(page,700);await showMotion(page,`${label}-founder-review`);await page.locator('.site-footer').scrollIntoViewIfNeeded();await page.waitForTimeout(1200);},label==='mobile');
await record('products-review',{width:1440,height:900},async page=>{for(const[name,selector]of sections.slice(1,5)){const box=await page.locator(selector).boundingBox();const y=await page.evaluate(()=>scrollY);await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),box.y+y-90);await page.waitForTimeout(1500);const end=box.y+y+box.height;for(let p=box.y+y;p<end;p+=520){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),p);await page.waitForTimeout(1000);}if(name==='reviews-engine')await showMotion(page,'products-review');}});
await record('case-studies-review',{width:1440,height:900},async page=>{for(const route of ['/work','/work/portrait','/work/signal']){await page.goto(base+route,{waitUntil:'networkidle'});await settle(page);await page.waitForTimeout(1500);await scrollAll(page,850);}});
await record('interaction-review',{width:1280,height:800},async page=>{
 const slider=page.getByRole('slider');await slider.press('Home');await page.waitForTimeout(1000);await slider.press('End');await page.waitForTimeout(1000);await slider.press('ArrowLeft');const box=await page.locator('.portrait-comparison').boundingBox();await page.mouse.move(box.x+box.width*.8,box.y+box.height*.5);await page.mouse.down();await page.mouse.move(box.x+box.width*.3,box.y+box.height*.5,{steps:35});await page.mouse.up();await page.waitForTimeout(1000);
 await showMotion(page,'interaction-review');await page.getByRole('button',{name:'Show next review'}).click();await page.waitForTimeout(1300);await page.getByRole('button',{name:'Show previous review'}).click();await page.waitForTimeout(1300);await page.locator('.re-proof-window').focus();await page.keyboard.press('End');await page.waitForTimeout(1200);await page.keyboard.press('Home');await page.waitForTimeout(1200);
 await page.locator('#contact').scrollIntoViewIfNeeded();await page.getByLabel('Name',{exact:true}).fill('Founder review example');await page.getByLabel('Email',{exact:true}).fill('example@example.test');await page.locator('select[name=stage]').selectOption('Prototype');await page.getByLabel('What are you building?',{exact:true}).fill('A local demonstration note. No message is sent.');await page.waitForTimeout(1600);
});
await writeFile(path.join(out,'recording-results.json'),JSON.stringify({base,generatedAt:new Date().toISOString(),errors,motion,recordings:5},null,2));await browser.close();console.log(JSON.stringify({errors,motion,output:out}));
