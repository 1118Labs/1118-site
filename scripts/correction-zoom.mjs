import {chromium} from '/Users/stevehole/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs';
import {mkdtemp,writeFile,mkdir} from 'node:fs/promises';
const out=new URL('../../../artifacts/1118-correction-pass/zoom',import.meta.url).pathname;await mkdir(out,{recursive:true});
const dir=await mkdtemp('/private/tmp/1118-zoom-');
const context=await chromium.launchPersistentContext(dir,{channel:'chrome',headless:true,viewport:{width:1280,height:800}});
const settings=await context.newPage();await settings.goto('chrome://settings/appearance');await settings.locator('#zoomLevel').waitFor();
const rows=[];
for(const zoom of [2,4]){
 await settings.locator('#zoomLevel').selectOption(String(zoom));
 await settings.screenshot({path:`${out}/chrome-setting-${zoom*100}.png`});
 const page=await context.newPage();await page.goto('http://127.0.0.1:5195/',{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
 for(const route of ['/','/work','/work/portrait','/work/signal']){
  if(route!=='/')await page.goto('http://127.0.0.1:5195'+route,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));});
  const metrics=await page.evaluate(()=>({innerWidth,innerHeight,dpr:devicePixelRatio,cssZoom:getComputedStyle(document.documentElement).zoom,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelector('h1')?.innerText}));
  rows.push({zoom:zoom*100,route,...metrics,pass:metrics.dpr===zoom&&metrics.innerWidth===1280/zoom&&metrics.scrollWidth<=metrics.innerWidth+1});
  await page.screenshot({path:`${out}/${route==='/'?'home':route.slice(1).replaceAll('/','-')}-${zoom*100}.png`,fullPage:true});
 }
 await page.goto('http://127.0.0.1:5195/',{waitUntil:'networkidle'});if(await page.getByRole('button',{name:'Open navigation menu'}).isVisible()){await page.getByRole('button',{name:'Open navigation menu'}).click();await page.keyboard.press('Escape');await page.waitForTimeout(100);rows.push({zoom:zoom*100,check:'menu keyboard',pass:await page.getByRole('button',{name:'Open navigation menu'}).evaluate(e=>document.activeElement===e)});}else{await page.locator('.desktop-nav a').first().focus();rows.push({zoom:zoom*100,check:'desktop navigation keyboard',pass:await page.locator('.desktop-nav a').first().evaluate(e=>document.activeElement===e)});}
 await page.getByLabel('Name',{exact:true}).fill('Zoom QA');await page.getByLabel('What are you building?',{exact:true}).fill('Local zoom check.');rows.push({zoom:zoom*100,check:'contact editable',pass:await page.getByLabel('Name',{exact:true}).inputValue()==='Zoom QA'});
 await page.close();
}
await settings.locator('#zoomLevel').selectOption('1');await context.close();await writeFile(`${out}/results.json`,JSON.stringify({method:'Chrome native Page zoom setting through isolated temporary profile WebUI, no CSS zoom or device emulation',rows},null,2));console.log(JSON.stringify(rows));
