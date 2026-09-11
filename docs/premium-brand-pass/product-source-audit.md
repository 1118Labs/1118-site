# Product source audit — D/E, with B/M findings

Audit: 2026-09-11. Phase 1 read-only inspection; no website implementation in this pass. All neighboring products, databases, account settings, and Production left unchanged.

## Source identity and verification

- Reviews Engine current local HEAD: `e2baf5952e52c930d5efad220480c5bfb2dbb7ab`, `/Users/stevehole/reviewengine`. Live homepage opened at `https://reviewengine.goshipyard.ai/`; real SkyPups installation opened at `https://www.skypupstreats.com/reviews`. Native paw SVG and visible customer quotes verified from rendered widget Shadow DOM on September 11.
- Property Insights inspected at `https://insights.1118.io/` and its approved existing synthetic reviewer route. Newer source checkout: `/Users/stevehole/.codex/.chatgpt-projects/g-p-69e0c6e2c86c8191be599fa9f4b90225/property-insights-liam-demo-pass1`, current local HEAD `9694e2f3e9ce77811486f3cbcf6c9674dd4ceb48`. Public marketing page last source commit `e565c087adde66bee54264c1afed2f3af97c71ad`, September 9, 19:16 EDT. A local HEAD is not an independently verified live deployment SHA.
- Source fixture: `lib/jobber/marketplaceReviewFixtures.ts`. API source: `app/api/jobber/review-fixtures/route.ts`. Manager-only `/dashboard/requests/review` GET validates the three persisted fixture identities, applies approved synthetic presentation, and fails closed if fixtures are incomplete. It does not substitute normal customer queue data.
- Opened only that existing review route, selected Show test history, then Avery Brooks Test. No refresh, force refresh, sync, draft quote, account action, or create request was used. The visible page explicitly states three approved synthetic reviewer scenarios and that the normal queue remains unchanged.

## KEEP

- Public order and names: Portrait, Reviews Engine, Property Insights, Signal. Statuses LIVE / LIVE / EARLY ACCESS / BUILT · LICENSED · ACQUIRED. Parent positioning: AI-FIRST PRODUCT STUDIO; “We build the software we keep looking for.”
- Existing four SkyPups customer images and exact quotes in `worktrees/1118-final-launch-candidate/src/content/reviews.ts`, with files below `src/assets/showcase/reviews-engine/current/`. Current live widget reconfirms all four. They are customer reviews of SkyPups pet treats, not testimonials about 1118 or Reviews Engine software. Keep explicit SkyPups attribution and link to the live installation.
- Four authentic public images: `ernestine-jennifer.jpg` 900×1200; `lola-aj.jpg` 480×640; `griffey-skyler.jpg` 640×480 stored dimensions with orientation metadata; `pippin-bill.jpg` 1200×900 stored dimensions with orientation metadata. Retain original proportional crops and correct EXIF orientation. These were sourced from the current public installation in the prior launch pass; provenance is in `artifacts/1118-final-launch-sprint/product-proof-source-audit.md`.
- The product facts→operator next step→Jobber handoff story. Current public PI says it reads supported Jobber requests; teams still create and send the final quote in Jobber.
- Contact email-draft behavior and clear non-submission disclosure from the recovered candidate. Do not imply website submission or response SLAs.

## IMPROVE

- Reviews should explain the actual workflow alongside live proof: collect/import → approve → publish. One dominant photographic card plus two or three visible adjacent panels communicates both quality and a working system. Five paw icons must remain clear at ordinary desktop size, with names and locations readable.
- Retain slow autoplay only while visible and not hovered/focused, pause after manual control, preserve previous/next, swipe, keyboard and stable reduced-motion mode. The founder recording must visibly show at least one real transition. Code inspection is not evidence of visible motion.
- PI should inherit the current product's actual visual language, not the obsolete brand-guide examples. `app/globals.css` currently sets Manrope with SF Pro/system fallbacks, ink `#0D1A5B`, deep navy `#071A32`, cyan `#14D8FF`, panel white, border `#E0E4EB`, muted `#6F7487`. Current actual drawer uses dense navy headings, white factual sections, disciplined separators, a strong navy recommendation block, and small uppercase tracked labels. It prioritizes an actionable next step over imagery. The older brand guide recommends Inter/Sora, glass and gradients; those are not authoritative for the current page and conflict with this user's website brief.
- One actual positive drawer crop can show request title, property identity, READY recommendation, explicit manual starting point, next action, and fact grid. Prefer native width around 1024 px, preserving aspect ratio. An enlarged recommendation detail may accompany it; never rebuild the UI in website HTML.

## REPLACE

### Replace generic stars with the native paw

Exact matching native source:
`/Users/stevehole/reviewengine/src/components/ReviewCard.tsx:145` (`PawGlyph`) and `/Users/stevehole/reviewengine/public/embed.js:319` (`createRatingIconSvg`). Live DOM matches this geometry:

```svg
<svg viewBox="0 0 64 64" aria-hidden="true" fill="currentColor" stroke="none">
  <circle cx="18" cy="19" r="6" />
  <circle cx="32" cy="13.5" r="6.4" />
  <circle cx="46" cy="19" r="6" />
  <path d="M31.95 27.25c-10.6 0-19.2 8.02-19.2 16.97 0 5.52 4.28 9.53 10.3 9.53 3.64 0 6.08-1.38 8.9-3.15 2.4 1.56 5.02 3.15 8.84 3.15 6.08 0 10.46-4.01 10.46-9.53 0-8.95-8.63-16.97-19.3-16.97Z" />
</svg>
```

Current public icon color `rgb(61,123,247)` / `#3D7BF7`; native full size26px (compact18px). Use five, with one accessible “5 out of 5 paws” label and decorative SVGs. These are three-toe native paws; do not substitute a generic four-toe icon or Unicode stars.

### Replace HOLD-only PI with current approved READY view

Current live source:
`https://insights.1118.io/dashboard/requests/review?request=Z2lkOi8vSm9iYmVyL1JlcXVlc3QvMzE4MjUyNzc%3D`

Avery Brooks Test; 270 Opechee Avenue, Southold, NY11971; Biweekly house cleaning. Actual September11 rendered recommendation: “Ready: start at $150”; “Use this as a manual starting point: 2.3 hrs - 2.9 hrs with 2 people.” Next: “Draft quote below.” House facts3beds/2baths/1800sqft/singlefamily. Missing panel: “No quote-critical house facts are missing.” The page keeps year and lot unavailable; estimated home value is visibly labeled estimated. No final quote was created.

This is **current rendered approved synthetic reviewer presentation**, not a newly enriched property or a verified current customer quote. The underlying fact timestamp remains “Updated Aug25,2:31PM.” The source fixture applies approved presentation; normal queue output can differ. Caption should say “Actual product interface · Approved synthetic example” and preserve “manual starting point” inside the image. Do not call the example a live customer result, freshly verified price, calibrated final quote, or Marketplace approval.

At capture the native browser viewport was2560×1209; drawer startsx1536 and is1024px wide. Safe dominant crop includes top request/recommendation/facts; avoid dragging unrelated queue chrome into marketing. Full synthetic queue is safe for evidence, but ordinary real customer queue is prohibited. Street/aerial context below is not needed to make the positive decision legible; do not replace it with an unrelated house image.

At the initial Phase 1 audit, screenshot export was unresolved. The Phase 2 capture below now resolves it with exact native screenshot bytes. Chrome rejects supported `tab.content.export()` with `Chrome does not support command "tab_content_export"`. Root is handling a supported screenshot-to-disk path. A capture export limitation is not permission to reconstruct UI.

## REMOVE

- Generic stars labeled as paws.
- HOLD as the sole main PI proof now that a current approved positive view exists.
- Distorted `current-submitted-verify.png` and composited old submitted-gallery panels as dominant actual-product proof. They visibly squash text and clip actions.
- Old READY screenshots presented as current: Aug25 `tmp-full-check.png` and old phase9 $281 example do not establish today's normal queue outcome.
- Any claim that SkyPups customers reviewed the software, any invented growth/conversion statistics, any universal automatic quote claim, any co-founded Signal claim.
- Customer contact data, normal tenant queue screenshots, auth exports, access tokens, or unapproved genuine addresses from other customer contexts. Approved Avery fixture identity is specifically permitted by the reviewed source.

## ADD

- Actual current positive PI source capture and enlarged recommendation detail with source date, URL, crop coordinates, pixel dimensions, file hash, and precise synthetic boundary in the asset ledger.
- Readable plain-English explanatory copy around it: “Understand the house. Know the next step.” The page can describe facts and scope before the team completes its quote in Jobber; avoid guaranteeing every request is READY.
- Current native paw treatment and visual motion evidence for Reviews.
- Work/case-study links only when real pages exist. Optional PI/Reviews case studies should follow demonstrated workflows, not fabricated outcomes.

## Older candidate comparison

- `.../property-insights-liam-demo-pass1/artifacts/overnight-showroom/public-after-desktop.png`,1440×1000: actual captured older marketing showroom page, explicitly illustrative synthetic workspace/property image. Positive$150,but NOT actual operator drawer and visually differs from current live public page. Rejected as main actualUI proof.
- `.../artifacts/property-insights-founder-visual-review-2026-08-25/tmp-full-check.png`,2560×1265: authentic old AveryREADY drawer, exact captureSHA unrecorded, oldername/address/economics. Useful archival fallback only.
- `.../outputs/jobber-review-deck-source-package-2026-09-08/screenshots/04_ready_quote_intelligence.png` and05verify: submitted gallery-derived compositions, not new raw sessions. Rejected where text distortion compromises legibility.
- `actual-synthetic-hold-decision.png`1024×630 currently integrated in1118: authentic Aug25 factualcrop and safe, but now weaker than the current positive reviewer view.

## B/M launch judgment for this phase

This is an audit, not a final launch vote. The preserved headline gives a clear product-studio point of view; explicit AI-first positioning and four real product chapters establish breadth. Portrait remains flagship. Reviews needs real paw/motion treatment to feel alive; PI's current positive drawer is the biggest source upgrade available. Signal's approved history and substantive Portrait/Signal case studies can establish depth. Avoid claiming broad commercial traction from a single live installation or synthetic demonstration.

P0: Preserve source/privacy boundaries and correct unsupported Signal founding attribution before any public release. Final rendered review and protected Preview evidence remain release gates, not assumed passes.
P1: Replace stars with native paws; deliver3–4visible desktop panels with dominant review; record actual movement; replace stale HOLD-only main PI proof with current approved positive capture; keep manual/synthetic disclosure and actualUI legibility.
P2: Additional PI/Reviews case studies, extra live customer proof, and a fuller PI request-to-context walkthrough can follow when authentic assets and consent support them. They should not delay strong Portrait/Signal V1 case studies.

## Capture follow-up at Phase 1 handoff

The current positive synthetic page is retained as Chrome tab1293535362 for the unfinished capture workflow. Native DevTools opened on this exact tab, but the user switched Chrome focus during capture setup; CUA subsequently reported the user changed the app. Native actions stopped to avoid interfering. No screenshot command or quote action was submitted. The tab may have DevTools open and should be restored after capture. Screenshot bytes are available from the supported tab screenshot method, but no filesystem export method was exposed. `agent.documentation.get('screenshots')` only documents displaying screenshots, not writing them. `/api/version` navigation was blocked by the browser (`ERR_BLOCKED_BY_CLIENT`); no bypass was attempted. These are evidence export limits, not product failures.


## Phase 2 implementation and capture — September 11, 2026

Implementation was explicitly authorized after the root Phase 1 audit completed. New self-contained `ReviewsProof.tsx/.css` and `PropertyProof.tsx/.css` were written only in the isolated 1118 candidate. Neighboring product repositories and live product records remain unchanged. No App.tsx/App.css edits were made by this specialist.

Reviews now uses the exact native PawGlyph geometry and #3D7BF7 blue. The desktop strip contains a 44% dominant card and two 26% adjacent cards with 2% gaps; mobile uses a 96% card and swipe affordance. Original exact quotes, names, locations, and five-paw ratings remain unchanged. Hover, focus, viewport visibility, page visibility, manual pause, keyboard arrows/Home/End, touch swipe, and reduced-motion behavior are preserved. Pointer cancellation releases capture without advancing a review. Duplicate cards are hidden from assistive technology. Automatic movement remains 5.2 seconds; manual interaction pauses it. Root owns integrated visual and motion recording checks.

**Current PI capture is complete and replaces the old HOLD image.** The supported CUA screenshot call captured only the approved synthetic reviewer drawer. Its exact image bytes were recovered from that same agent's own recorded CUA tool-output image block, identified by exact call ID. No browser profile, authentication material, cookies, or other session history was exported. No base64 reconstruction or textual UI recreation occurred.

- Native source: `artifacts/1118-premium-brand-pass/pi-current-ready-cua-source.jpg`, 1024×1050, 79,719 bytes, SHA256 `1b50fbc0845566e576c1988f9788481787ae82d1e94ad8afef03edda0db648a6`.
- Main factual crop: candidate `src/assets/showcase/property-insights/current-synthetic-ready-decision.png`, 1024×934, crop rectangle [0,116,1024,1050], SHA256 `fd0e90bd5a797cfd928879c9dd80d7821eb9836d7faefc5630b1731f9c698836`.
- Optional recommendation detail: `current-synthetic-ready-recommendation.png`, 975×295, crop [25,254,1000,549], SHA256 `14f8b65a4ae64bf9b3f212de121d028023cf1d4f82f041b796454fbbe875e472`.
- Machine-readable source, crop, safety, and SHA ledger: `artifacts/1118-premium-brand-pass/pi-current-ready-provenance.json`.

The captured browser viewport was 2005×1209 with the drawer at x981 and width1024, after Chrome's docked tools changed its width. The native screenshot includes blank space above the drawer; the main crop removes only that blank band and retains the request, positive recommendation, manual-starting-point qualifier, team/time guidance, company defaults, house context, and facts. Source crop includes honestly unavailable year/lot and visibly estimated home value. No imagery, numbers, or labels were altered. No final quote, fresh property enrichment, or normal customer outcome is claimed.

`PropertyProof` displays the current capture with the caption “Actual product interface · Approved synthetic example · Captured September 11, 2026” and an original-image link. The underlying example's cached fact timestamp remains August25, so September11 denotes capture/render date only. On narrow screens the current recommendation crop is shown first with a readable explanatory paragraph outside the image, followed by the complete native decision crop at its preserved aspect ratio. No horizontal scrolling or minimum850px image remains. The full image's alternative text describes the request, manual$150 starting point, two-person range, and supporting facts.

Validation at this handoff: candidate TypeScript check and ESLint pass. Integrated desktop/mobile visual checks and actual motion recording remain root QA work. These checks do not grant Production publication or replace founder acceptance.


### Integrated QA adjustments

Native blue paw SVGs remain exact; numeric rating text is now navy at14px for contrast and readability. Controls and product captions have a14px minimum. Mobile review cards use natural content height with their footers directly after the exact quotes, avoiding a large internal white gap while the track retains space for the longest card. The mobile PI explanation identifies the approved synthetic example and repeats the manual nature of the starting price outside the untouched screenshot. No fake UI panels were composed. A browser-wide mobile viewport override was avoided because the browser includes the user's active surface; parent handles integrated viewport QA. React best-practices review found cleanup present for the observer, visibility listener, and rotation timer, with transient pointer state in refs and no network dependency. TypeScript and ESLint passed again after these changes.


### Final D/E and B/M handoff votes

**D / Reviews Engine:** source and implementation PASS for the protected candidate. The four authentic SkyPups reviews, photographs, quotes, names, locations, and native paws are retained. The live installation is explicitly identified, avoiding an implication that dog owners reviewed the software itself. The 44/26/26 desktop arrangement and natural mobile cards satisfy the intended hierarchy in code; root's final rendered sequence and motion recording determine final visual acceptance.

**E / Property Insights:** source and truthful demonstration PASS for the protected candidate. The current approved positive native screenshot is stronger than the old HOLD-only proof. Its strongest quality is a visible next action with a manual starting price and concrete team/time guidance. Its limitation is deliberate: it is approved synthetic reviewer presentation over an existing fixture, not a newly enriched real job or a guarantee that all requests become quote-ready. The complete capture preserves unavailable facts and estimated value rather than hiding uncertainty. Desktop display is capped at1024px. Mobile has an ordinary editorial explanation at18–26px, including request → house context → signals → recommendation → operator decision, alongside untouched current native crops. It does not construct a replacement product UI.

**B / Product marketing:** current integrated local accessibility inspection confirms clear 1118 AI-first product-studio positioning and Portrait → Reviews Engine → Property Insights → Signal order. Product names and status distinctions are plain: Live, Live, Early Access, historical Built/Licensed/Acquired. Headlines state product outcomes in a few seconds. The public narrative connects software to actual evidence; it does not depend on fabricated revenue, customers, performance claims, or automatic quoting. Vote: PASS within inspected source/copy scope, final visual approval owned by root/founder.

**M / Conversion and trust:** local integrated inspection confirms a live SkyPups destination, current Property Insights public destination, working case-study links present for Portrait and Signal, and a contact flow that explicitly prepares an email rather than pretending to submit. Synthetic PI and historical Signal captions establish the appropriate evidence boundaries. Vote: PASS within inspected source/copy scope; protected Preview and Production remain distinct gates.

P0 remaining within this specialist's edits: none identified. This is not Production authorization. P1: final combined desktop/mobile QA, actual Reviews motion evidence, and founder visual acceptance of the protected candidate. Those checks are material because source/code checks cannot prove displayed scale and movement. P2: further authenticated customer case studies or PI walkthroughs only when genuine evidence and rights support them; no invented proof is needed for V1.
