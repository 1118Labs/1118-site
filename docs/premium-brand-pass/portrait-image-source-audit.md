# Portrait and chapter imagery audit — Phase 1

September 11, 2026 · Roles C and I · Read-only source/product audit. No site or neighboring repository edits. This assessment uses current rendered Portrait homepage/gallery/App Store, local authentic assets, and the corrected 1118 candidate at starting SHA `5359c88`. It is a new premium-design audit, not a restatement of the prior functional launch vote.

## Decision

**KEEP Laurie as the flagship company hero. REPLACE the Portrait chapter's mixed Elise/Avery output arrangement with a single-subject source → finished portrait → usable formats composition. Sloane is the strongest available high-resolution complete family.** Avery is the fallback with the clearest current homepage workflow evidence but a small 288×433 source. No new portrait generation is needed.

Current candidate has a good result image and authentic exports but omits the photo step and juxtaposes different people. It illustrates outputs; it does not clearly demonstrate one transformation. The chapter needs to answer what went in, what Portrait made, and what the person can save/share/use.

## Source root and authority

Reference root **P** below is `/Users/stevehole/.codex/.chatgpt-projects/g-p-69f328f7768c819180128324b15b15f4/portrait-build23-payment-forensics`.

Public evidence: https://getportrait.ai/ and https://getportrait.ai/gallery . The homepage displays Laurie hero, Avery workflow/exports, selected Rowan/Theo/Graham/Mei, and Nadia pricing comparison. Gallery explicitly says **8 studio examples** and lists Laurie, Rowan, Julian, Elise, Sloane, Graham, Theo, Mei. These are studio/demo examples, not customer outcome claims.

Local authority: `P/src/data/etchrGalleryManifest.ts`, `P/src/components/etchr/home/homeContent.ts`, and `P/src/lib/etchr/comparisonAlignment.ts`. Manifest records approve studio assets; homepage code explicitly excludes or demotes some other legacy families. Presence under public/ alone does not make every old file suitable for this chapter.

## Approved current public families

All paths in this table are relative to `P/public/etchr/demo-portraits/`. These are the exact image paths loaded by the inspected public pages, including optimized derivatives. Other local variants remain masters/reference alternatives.

| Subject / current use | Source / result | Assessment |
| --- | --- | --- |
| Laurie V. — hero, gallery | `laurie-v-21/source.jpg` / `laurie-v-21/etchr-lossless.webp` | **KEEP** hero. 768×1024 source, 1024² result. Manifest explicitly house-owned marketing, approved public/homepage/workflow/hero. Avoid repeating it as the chapter's whole story. |
| Rowan — homepage selection, gallery | `female-creative-05/source-lossless.webp` / `female-creative-05/etchr-lossless.webp` | **KEEP** as optional case-study breadth. Approved seeded studio demo. |
| Julian — gallery | `male-doctor-10/source-lossless.webp` / `male-doctor-10/etchr-lossless.webp` | **KEEP** optional case-study breadth, not needed in main chapter. |
| Elise — gallery | `female-older-07/source-lossless.webp` / `female-older-07/etchr-lossless.webp` | **IMPROVE** current candidate use: valid high-res pair1122×1402/1024², but finished image alone misses the transformation. No same-subject export family found in inspected export directory. |
| Sloane — gallery | `female-artist-09/source-lossless.webp` / `female-artist-09/etchr-lossless.webp` | **ADD** as recommended chapter family. Source1122×1402, result1024², complete preexisting export set. Manifest approved seeded_demo, not customer. |
| Graham — homepage selection, gallery | `male-founder-06/source-aligned-1024-lossless.webp` / `male-founder-06/etchr-lossless.webp` | **KEEP** optional breadth. Use aligned source, not an arbitrary raw variant. |
| Theo — homepage selection, gallery | `male-student-08/source-lossless.webp` / `male-student-08/etchr-lossless.webp` | **KEEP** optional breadth. |
| Mei — homepage selection, gallery | `asian-creative-12/source.jpg` / `asian-creative-12/etchr.png` | **KEEP** optional breadth; preserve authentic result. |
| Avery — homepage workflow and exports | `windowlight-female-15/source.jpg` / `windowlight-female-15/etchr-lossless.webp` | **KEEP** fallback workflow. Source288×433 visibly soft at large size; limit to small input tile, never full-size premium comparison. |
| Nadia — homepage pricing | `glasses-reflection-16/source.jpg` / `glasses-reflection-16/etchr-lossless.webp` | **KEEP** product-side pricing proof; unnecessary additional subject for company chapter. |

Local approved status plus current public use establishes marketing provenance here. It does not constitute a newly obtained model release or new customer consent. No private customer output is proposed. Do not use Steve/Mira/Marilyn/other dormant seed imagery merely because a file or an old manifest approved flag exists; current public curation intentionally excludes/demotes those families.

## Complete export families

Directory `P/public/etchr/home/export-examples/` contains:

| Family | Exact files | Evidence and treatment |
| --- | --- | --- |
| Avery | `avery-square-1024.webp`, `avery-profile-640x800.webp`, `avery-circle-640.webp`, `avery-story-540x960.webp` | Exact current public homepage images, same subject as live workflow. Strong finished-output assets. |
| Sloane | `sloane-square-1024.png`, `sloane-profile-640x800.png`, `sloane-circle-640.png`, `sloane-story-540x960.png` | Preexisting local product exports, same approved public gallery subject. Visually inspected source, result, profile and circle files. Currently homepage selects Avery, so do not call Sloane exports the current live homepage example. |

Sloane source, result and exports preserve the same identity and crisp linework. The circle asset is a square raster intended for a circular frame; use the existing square framing with a circle mask if displayed as an avatar, without editing facial content. Keep the profile crop at4:5 and story at9:16. If derived web formats are later produced, record original hashes and dimensions; optimization may change encoding, not image content.

## Exact identity assets

- **KEEP** `P/public/brand/portrait-app-icon-header-256.png`: exact live P icon,256², SHA256 `845c1e025de077ad983e6122a32af48ca72fd9eda1cff3c9c71fc921d5d645d3`. Candidate `src/assets/showcase/portrait/portrait-app-icon.png` already copies it.
- **KEEP** `P/public/brand/portrait-wordmark.png`:1580×375; SHA256 `84baeb2306c7038a85ac14fadd1acdc4a754db9e1bde56f86b8c328302980e5c`. Use at an honest size; do not recreate with a guessed font.
- **KEEP** `P/public/brand/download-on-the-app-store.svg`, official badge120×40; verified Apple destination in companion report.
- **REMOVE from visible use** legacy `showcase/etchr/etchr-app-icon-512.png` E asset. Historical paths need not be deleted.
- Native1024 P master at `P/ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png` is visually verified. It is local native preparation, while Apple still publicly shows E.

## Composition direction

Homepage: title **Portrait** with restrained P icon; headline **One photo. A portrait you can use everywhere.** Supporting sentence may say **Create a finished editorial portrait, then save and share profile-ready formats.** Use label **Studio example** unobtrusively so images are never mistaken for a named customer endorsement.

Desktop media area: a small source photograph left (about20% of composition), a dominant finished result center (about50%), and an organized pair of profile/circle exports right (remaining30%). Label the three steps **01 / Your photo**, **02 / Editorial portrait**, **03 / Save. Share. Use.** Labels are HTML text outside the imagery, legible at16px or larger. A restrained alignment line can connect the steps. Keep faces unobscured and image edges crisp. Avoid nested mini-browser chrome, stacked indistinct cards, random rotations, or giant decorative whitespace.

Mobile: source/result appear as a clear two-column pair, followed by profile/circle exports. The result can be dominant while the original remains plainly visible. Do not turn the entire workflow into a swipe-only image; the core story must fit and read directly. A genuine comparison interaction can live on `/work/portrait`, but the company hero already provides it; duplication is unnecessary.

Case study `/work/portrait`: explain the problem, the one-photo workflow, authentic before/after, real formats, privacy/optional sharing, and external app link. Use Sloane for the primary story; Elise/Rowan/other approved examples can provide a concise supporting strip. The App Store's source→split→save/share concept is useful, but **do not copy stale local app screenshot05**: it has a severe off-center crop unlike the current published screenshot. Do not manufacture an app UI around Sloane.

Hero registration must remain unchanged: stage4:5, images full-size with cover/center, source Laurie translate(-.837%,3.078%) rotate(.215deg) scale(1.0339), result identity. Clip the full-stage result; never size it to the exposed portion. The current tested comparison component already implements these corrections.

## Other chapter imagery — Image Director decisions

| Chapter | Current issue | Direction / source |
| --- | --- | --- |
| Reviews Engine | Current candidate uses real current photos but renders stars beside PAWS wording. Composition needs multiple readable cards with one dominant. | **KEEP** four actual photos in candidate `src/assets/showcase/reviews-engine/current/` (`pippin-bill.jpg`, `ernestine-jennifer.jpg`, `griffey-skyler.jpg`, `lola-aj.jpg`) and exact current quote data. **REPLACE** star glyphs with actual product paw SVG from reviewengine source. Product proof specialist verified `src/components/ReviewCard.tsx:145`, `public/embed.js:319`. Keep photo→quote→name hierarchy,3–4 desktop panels, slow reversible motion with all pause modes. Do not substitute old fictional/demo names. |
| Property Insights | Hold-only screenshot communicates failure, and small full-screen text forces inspection instead of explaining value. | **REPLACE** dominant hold image with authentic current READY/quote-ready fixture captured from actual product UI. Product specialist found current reviewer Avery synthetic request, ready$150,2.3–2.9hours/2people,3beds/2baths1800sqft. Keep explicit **Synthetic example** and no customer outcome claim. Lead with legible navy recommendation, then request/property/signals context. Do not recreate arbitrary dashboard chrome. Product specialist owns capture/provenance. |
| Signal | Authentic archival screenshot is visually flat. | **IMPROVE** presentation with a restrained, single front-facing matte monitor environment; overlay exact screenshot as a separate untouched image plane. Preserve full2167×1046 ratio, no perspective distortion or generated UI. User permits a generated environment, not generated facts. Source `/Users/stevehole/Documents/1118/Signal/Signal Screenshots Platform/Screen Shot 2019-05-24 at 10.27.00 AM.png`, SHA256 `64fc6ea1ac12ffc21aaa3ba8749a424d2096633a98dba34b04f84784db102968`, verified by recovery specialist. No existing approved workstation environment found. Keep original link and authentic detail gallery on case study. |
| Playbook | No current public product proof supplied | **RESERVE** visual space/routing only; no fabricated product UI, traction, or launch claim. |

Signal case-study supporting assets, verified by recovery specialist: Aug15 `10.11.32 AM`2329×984 historical charts, `10.11.57 AM`1211×843 Manage Structures modal, `10.12.33 AM`2294×907 correlations. Exclude the two July24 Elephant template/audience-analytics files as unrelated. Use the user's approved designed/built/launched/licensed/later-acquired story; remove co-founded wording.

## Phase 1 vote and acceptance conditions

**Would I launch the starting candidate tomorrow as the requested premium brand pass? NO.** Its corrected functionality passed prior QA, but the new visual brief is not yet fulfilled: Portrait needs the complete consistent-subject story, Reviews needs genuine paws and readable multi-panel hierarchy, PI needs a positive readable operating decision, and Signal needs a premium factual workstation treatment.

P0 for this pass: preserve factual image integrity, public/source provenance, authentic Portrait identity and calibrated Laurie hero; no fabricated reviews, UI, charts, property outcomes or unauthorized product/App Store mutations.

P1: implement the stronger chapter composition, true paw artwork, positive PI proof, Signal environment, and case-study routes; verify real rendered media on desktop/mobile before voting again.

P2: separate future App Store rename synchronization in companion report. No factual portrait generation is recommended. No implementation or generation has been performed during this audit.

Memory was used only to locate prior rebrand/App Store context (`MEMORY.md:316–338`, `852–880`). Current conclusions above were checked in public browser/source or explicitly attributed to collaborating specialists.

## Authorized Phase 2 implementation

After root confirmed the global Phase 1 gate, added only `src/components/PortraitStory.tsx`, `src/components/PortraitStory.css`, and five `src/assets/showcase/portrait/sloane-*.webp` assets in the 1118 candidate. No neighboring product or Laurie comparison was changed. Default `PortraitStory` export accepts optional `className` and `variant: 'chapter' | 'case-study'`; no required props or interactive dependencies.

The figure uses a semantic three-step ordered flow with real source/result and profile/circle/story exports. At container widths above660px, three stages sit together; below660px source/result remain visible together and all three formats occupy the next full-width row. All explanatory labels are14–15px, images retain their own dimensions, and no crop, generated imagery, UI simulation, motion, or swipe requirement was introduced.

Original and optimized file hashes/dimensions are recorded in `portrait-image-optimization-provenance.json`. Optimized assets total653,330bytes: source900×1125, result1024², profile360×450, circle320², story270×480. Encoding uses WebP quality94 for the large source/result and92 for smaller exports; only proportional resizing. No facial or factual content was altered.

TypeScript project check, component ESLint, and repository whitespace/diff validation passed. These source checks do not establish the integrated visual result. Root integration and rendered Image Director review remain next.
