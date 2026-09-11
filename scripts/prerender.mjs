import { build } from 'vite';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const output = join(root, 'dist');
const serverOutput = await mkdtemp(join(root, '.1118-prerender-'));
const origin = 'https://1118.io';
const organization = { '@id': `${origin}/#organization` };
const routes = {
  '/': ['1118 — AI-First Product Studio', '1118 designs, builds, launches, and operates original software.'],
  '/work': ['Selected Work | 1118', 'Explore Portrait and Signal: products designed, built, and launched by 1118.'],
  '/work/portrait': ['Portrait — From Photograph to Editorial Portrait | 1118', 'How 1118 built Portrait: an image-to-portrait experience, finished outputs, and an app distributed through the App Store.'],
  '/work/signal': ['Signal — Quantitative Commodities Analytics | 1118', 'Signal was designed, built, and launched by 1118, used in live markets, licensed commercially, and later acquired.'],
  '/privacy': ['Privacy | 1118', 'How 1118 handles information on this website.'],
  '/terms': ['Terms | 1118', 'Terms for using the 1118 company website.'],
  '/accessibility': ['Accessibility | 1118', 'The 1118 accessibility commitment and contact method.'],
  '/support': ['Support | 1118', 'How to contact 1118 for company and product support.'],
  '/security': ['Security | 1118', 'How to report a security concern to 1118.'],
};
const products = [
  {
    '@type': 'SoftwareApplication', '@id': `${origin}/#portrait`, name: 'Portrait',
    description: 'Portrait turns one clear photograph into a refined editorial portrait, ready for profiles, websites, social media, and print.',
    applicationCategory: 'MultimediaApplication', url: 'https://getportrait.ai/',
    downloadUrl: 'https://apps.apple.com/us/app/etchr-portraits/id6785615752',
    creator: organization, creativeWorkStatus: 'Live',
  },
  {
    '@type': 'SoftwareApplication', '@id': `${origin}/#reviews-engine`, name: 'Reviews Engine',
    description: 'A live platform for collecting, moderating, and publishing customer reviews.',
    applicationCategory: 'BusinessApplication', url: `${origin}/#reviews-engine`,
    creator: organization, creativeWorkStatus: 'Live',
  },
  {
    '@type': 'SoftwareApplication', '@id': `${origin}/#property-insights`, name: 'Property Insights',
    description: 'Property context, risk, and recommendations assembled before the estimate begins.',
    applicationCategory: 'BusinessApplication', url: `${origin}/#property-insights`,
    creator: organization, creativeWorkStatus: 'Early access',
  },
  {
    '@type': 'CreativeWork', '@id': `${origin}/#signal`, name: 'Signal',
    description: '1118 designed, built, and launched Signal, a quantitative commodities analytics platform created to uncover compelling trade ideas using data, quantitative analysis, and machine learning. Signal was used in live markets, licensed commercially, and later acquired.',
    url: `${origin}/work/signal`, creator: organization, creativeWorkStatus: 'Built, licensed, and acquired',
  },
];
function schema(pathname, title, description) {
  const url = `${origin}${pathname}`;
  const pageProducts = pathname === '/' ? products : pathname === '/work' ? [products[0], products[3]] : pathname === '/work/portrait' ? [products[0]] : pathname === '/work/signal' ? [products[3]] : [];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization', ...organization, name: '1118', legalName: '1118, LLC',
        url: `${origin}/`, logo: `${origin}/brand/1118-restored-dark.svg`,
        description: '1118 designs, builds, launches, and operates original software.',
      },
      {
        '@type': 'WebSite', '@id': `${origin}/#website`, name: '1118', url: `${origin}/`,
        publisher: organization, inLanguage: 'en-US',
      },
      {
        '@type': pathname === '/work' ? 'CollectionPage' : 'WebPage', '@id': `${url}#webpage`, name: title, description, url,
        isPartOf: { '@id': `${origin}/#website` }, publisher: organization, inLanguage: 'en-US',
        ...(pageProducts.length ? { about: pageProducts.map(({ '@id': id }) => ({ '@id': id })) } : {}),
      },
      ...pageProducts,
    ],
  };
}
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
function withMetadata(template, pathname, title, description) {
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(title)}</title>`);
  for (const [key, value] of Object.entries({
    description, 'og:title': title, 'og:description': description, 'og:url': `${origin}${pathname}`,
    'twitter:title': title, 'twitter:description': description,
  })) {
    const attribute = key.startsWith('og:') ? 'property' : 'name';
    const pattern = new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*\\/>`);
    if (!pattern.test(html)) throw new Error(`Missing metadata field: ${key}`);
    html = html.replace(pattern, `<meta ${attribute}="${key}" content="${escape(value)}" />`);
  }
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${origin}${pathname}" />`);
  const json = JSON.stringify(schema(pathname, title, description)).replaceAll('<', '\\u003c');
  return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${json}</script>`);
}

try {
  await build({
    configFile: join(root, 'vite.app.config.ts'), root,
    build: { ssr: 'src/entry-server.tsx', outDir: serverOutput, emptyOutDir: true, copyPublicDir: false, ssrEmitAssets: true },
  });
  const { render } = await import(pathToFileURL(join(serverOutput, 'entry-server.js')).href);
  const template = await readFile(join(output, 'index.html'), 'utf8');
  for (const [pathname, [title, description]] of Object.entries(routes)) {
    const destination = pathname === '/' ? output : join(output, pathname.slice(1));
    const markup = render(pathname);
    if (!markup.includes('<h1') || !markup.includes('<main')) throw new Error(`Missing semantic page content: ${pathname}`);
    const html = withMetadata(template, pathname, title, description)
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
    if (!html.includes('noindex,nofollow,noarchive')) throw new Error(`Missing noindex protection: ${pathname}`);
    await mkdir(destination, { recursive: true });
    await writeFile(join(destination, 'index.html'), html);
  }
  // Vite's server output uses the same content-hashed asset URLs as the client build.
  if ((await readdir(serverOutput)).includes('assets')) {
    await cp(join(serverOutput, 'assets'), join(output, 'assets'), { recursive: true });
  }
  console.log(`Prerendered ${Object.keys(routes).length} protected pages with initial HTML, metadata, and structured data.`);
} finally {
  await rm(serverOutput, { recursive: true, force: true });
}
