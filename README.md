# 1118 Site

The flagship homepage for 1118 LLC.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- npm

The homepage is statically rendered as six cinematic chapters. Client-side
behavior is limited to the accessible Etchr comparison slider, header and
entrance-state observers, the Works product selector and Reviews Engine proof,
and the fail-closed preview form. The Escape Velocity launch light is baked
into responsive source-controlled plates rather than drawn at runtime.

## Image and crop specification

The dimensions below are intrinsic source pixels. “Minimum” is the intended
smallest review presentation, not an image-download width.

| Visual | Source and dimensions | Display ratio and minimum | Desktop crop | Tablet crop | Mobile crop | Focal point and fit |
| --- | --- | --- | --- | --- | --- | --- |
| Arrival comparison | `public/brand/hero-original-aligned.jpg` and `public/brand/hero-etchr-aligned.png`, both 768×1024 | 4:5; up to 74vh, approximately 344px wide at the 390px review width | Framed in the right 58% column with inset shell and breathing room | Copy first, comparison second | Dedicated Etchr-style framed stack; no edge-to-edge portrait | Face centered at 13% vertical; `object-fit: cover` on the registered pair |
| Etchr MacBook | `public/etchr/etchr-macbook.png`, 2088×1204; shell from licensed Slides `assets/img/macbook-61.png`, screen from Shipyard `src/assets/showcase/etchr/hero.png` (3200×2240) | Native 522:301; 69vw desktop (1190px max), 119vw in the mobile stage | Right-centered, physically large, slight right bleed | Large centered device below copy | Full-width device with the screen retained | Complete transparent device; intrinsic ratio, width-led sizing, no CSS-built hardware |
| Etchr supporting formats | `public/etchr/portrait-professional.png`, `portrait-square.png`, `portrait-vertical.png`, each 1024×1024 | 4:5 at 150px minimum, 1:1 at 132px minimum, 9:16 at 104px minimum | Three staggered outputs around device | Same staggered composition, resized | 31vw, 29vw and 24vw; captions suppressed | Faces at 8–11% vertical; `object-fit: cover`; square output receives a 1.15 crop scale |
| Belief | CSS atmospheric field in `app/globals.css`; no raster source | Full chapter, minimum 760px desktop / 780px mobile | Near-black radial light, structural rings and fine material grain | Repositioned atmosphere | Copy-led field with the same restrained structure | Ring center at approximately 72%/27%; generated CSS fills the chapter, no stock imagery |
| Reviews Engine | Semantic proof in `components/ReviewsEngineProof.tsx`; approved fixtures from Reviews Engine `src/data/sampleReviews.ts` | Active stage, 72% desktop field; approximately 344×478px minimum mobile | One large 360–430px review window with reputation context | Context rail removed when space is constrained | Taller proof with rating, quote and controls legible | No raster crop; HTML cards translate vertically 100% per review |
| Property Insights | `public/work/property-insights-synthetic-dashboard.png`, 1440×1340 | Active stage, 72% desktop field; approximately 344×478px minimum mobile | 1.22 crop focused 72%/20% on request, aerial and quote-ready facts | 1.28 crop focused 75%/19% | 1.45 crop focused 55%/15% | `object-fit: cover`; navigation and low-value chrome fall outside the crop |
| Manuscript | Semantic safe demo in `components/ManuscriptProof.tsx`; no private writing or raster source | Active stage, 72% desktop field; approximately 344×478px minimum mobile | 20/80 archive/editor split | 25/75 archive/editor split | 92px archive rail plus readable editor | HTML layout fills the stage; editor headline and body remain live text |
| Escape Velocity | `public/studio/earth-escape-desktop.jpg` 2400×1350, `earth-escape-tablet.jpg` 1600×2000, `earth-escape-mobile.jpg` 900×1600; derived from `earth-daylight.jpg` 1672×941 | 16:9 desktop, 4:5 tablet, 9:16 mobile; full chapter, 760px minimum desktop / 960px mobile | Earth edge low/right, baked launch path clear of left copy | Dedicated portrait plate | Dedicated portrait plate aligned right so the launch point remains visible | Art-directed sources use `object-fit: cover`; warm point and atmospheric path are baked into each plate |

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
review evidence to `artifacts/founder-visual-correction/`. The
recording script also expects `ffmpeg` at `/opt/homebrew/bin/ffmpeg` unless
`FFMPEG_PATH` is set.
