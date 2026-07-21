# 1118 Site

The flagship homepage for 1118 LLC.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- npm

The homepage is statically rendered. Interactive behavior is limited to the
accessible Etchr comparison slider and the one-time escape-trajectory draw.

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
node scripts/flagship-homepage-v2-qa.mjs
node scripts/flagship-overnight-recordings.mjs
```

The browser scripts expect Chrome DevTools on port `9333` and write ignored
review evidence to `artifacts/approved-full-width-composition/`. The
recording script also expects `ffmpeg` at `/opt/homebrew/bin/ffmpeg` unless
`FFMPEG_PATH` is set.
