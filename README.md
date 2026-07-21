# 1118 Site

The flagship homepage for 1118 LLC.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- npm

The homepage is statically rendered as six cinematic chapters. Client-side
behavior is limited to the accessible Etchr comparison slider, header and
entrance-state observers, the Works product selector, the fail-closed preview
form, and the one-time escape-trajectory draw.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
git diff --check
```

Production-mode browser QA is captured by:

```bash
npm run build
npm run start -- -p 3108
node scripts/cinematic-flagship-qa.mjs
node scripts/cinematic-flagship-recordings.mjs
```

The browser scripts expect Chrome DevTools on port `9333` and write ignored
review evidence to `artifacts/cinematic-flagship-homepage/`. The
recording script also expects `ffmpeg` at `/opt/homebrew/bin/ffmpeg` unless
`FFMPEG_PATH` is set.
