import fs from 'node:fs';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const paths=['','work','work/portrait','work/signal','privacy','terms','accessibility','support','security'];
const env={...process.env,VERCEL_ENV:'production',PUBLIC_INDEXING_ENABLED:'true'};
try {
 execFileSync('npm',['run','build'],{env,stdio:'pipe'});
 for(const path of paths){const html=fs.readFileSync(`dist/${path ? path+'/' : ''}index.html`,'utf8');assert.match(html, /name="robots" content="index,follow"/);assert.equal((html.match(/<h1[ >]/g)||[]).length,1);assert.doesNotMatch(html,/A live platform/);}
 assert.match(fs.readFileSync('dist/robots.txt','utf8'),/Allow: \//);
 console.log('PASS: explicit Production gate makes 9 routes indexable.');
} finally {
 execFileSync('npm',['run','build'],{env:{...process.env,VERCEL_ENV:'preview',PUBLIC_INDEXING_ENABLED:'true'},stdio:'pipe'});
}
for(const path of paths)assert.match(fs.readFileSync(`dist/${path ? path+'/' : ''}index.html`,'utf8'),/name="robots" content="noindex,nofollow,noarchive"/);
assert.match(fs.readFileSync('dist/robots.txt','utf8'),/Disallow: \//);
console.log('PASS: Preview remains noindex even with indexing flag. Default build restored.');
