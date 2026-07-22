# 1118 Flagship Homepage

Private-review implementation of the 1118 flagship homepage. The page uses the canonical Shipyard layout foundation with 1118 identity, copy, product evidence, and legal identity.

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

The contact form intentionally fails closed in review builds: it validates fields, preserves entered values, and does not transmit or store data.

## Source register

| Purpose | Read-only source | Implemented here |
| --- | --- | --- |
| Layout rhythm, container, typography mechanics, project-story, contact, footer, navigation | Shipyard `src/index.css`, `src/App.tsx`, `src/App.css` at `ad9c54d73160024fe9c1d7591acf9b11a763d37b` | Fresh App Router implementation in `app/` and `components/` |
| Etchr framing | Etchr `src/components/etchr/home/HeroStorySection.tsx` and `src/components/etchr/EtchrBeforeAfterCard.tsx` at `3629be325580fc3453aa136e575ab703e339cfa2` | `components/ComparisonSlider.tsx` and Arrival styling |
| MacBook | Licensed `assets/img/macbook-61.png` plus committed Etchr screen proof | `public/etchr/etchr-macbook.png` |
| Reviews Engine | Approved synthetic SkyPups review fixtures | `components/ReviewsEngineProof.tsx` |
| Property Insights | Approved synthetic property fixture | `public/work/property-insights-synthetic-dashboard.png` |
| Manuscript | Neutral synthetic content only | Semantic proof in `components/ProductStories.tsx` |
| Escape Velocity | `/Users/stevehole/Documents/1118/Graphics/earth-space-1.jpg` (1920×1080) | Art-directed native-resolution plates in `public/studio/` |

## Escape crops

The source remains at native 1920×1080 resolution; it is never upscaled. The desktop plate is 1920×1080. Tablet uses the 864×1080 crop beginning at x=1056. Mobile uses the 438×1080 crop beginning at x=1200. The launch light is baked into each image through the desktop master—there is no live SVG trajectory.

All routes carry `noindex, nofollow` metadata until canonical release authorization.
