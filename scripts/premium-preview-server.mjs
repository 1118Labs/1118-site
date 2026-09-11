import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

// Local verification of the committed Vercel route mapping. Reads dist only;
// unlike a development SPA fallback, unknown URLs return a real 404.
const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const config = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8'));
const port = Number(process.env.PORT || 5193);
const mime = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm',
};

const server = createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end('Method not allowed');
      return;
    }
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const rewrite = config.rewrites?.find(rule => rule.source === pathname);
    const destination = rewrite?.destination || pathname;
    let file = resolve(dist, `.${destination}`);
    if (file !== dist && !file.startsWith(dist + sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const data = await readFile(file);
    for (const rule of config.headers || []) {
      const matches = rule.source === '/(.*)' ||
        (rule.source === '/assets/(.*)' && pathname.startsWith('/assets/')) ||
        rule.source === pathname;
      if (matches) for (const header of rule.headers) response.setHeader(header.key, header.value);
    }
    response.setHeader('Content-Type', mime[extname(file).toLowerCase()] || 'application/octet-stream');
    response.setHeader('Content-Length', data.length);
    response.writeHead(200).end(request.method === 'HEAD' ? undefined : data);
  } catch (error) {
    const status = error instanceof URIError ? 400 : ['ENOENT', 'ENOTDIR'].includes(error.code) ? 404 : 500;
    response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex, nofollow, noarchive' });
    response.end(status === 404 ? 'Not found' : status === 400 ? 'Bad request' : 'Preview server error');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Static preview with Vercel rewrites: http://127.0.0.1:${port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
