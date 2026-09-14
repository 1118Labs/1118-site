# Final founder polish — September 14, 2026

Continues `review/1118-editorial-canon-20260913` from `86639f6221f62dfef2fca86571eba95752862f7a`. The approved flagship architecture, hero comparison, company palette, Manrope, header/footer/navigation, editorial descriptions, Reviews interaction state and PI product composition are preserved. Production remains on the prior V1. No recipient, provider setting, DNS record, indexing setting or Production deployment is changed in this pass.

## Founder-directed refinements

Product identities share the existing 64px desktop row, 56px tablet and 48px mobile icon logic with optical accommodation for the authentic PI and Reviews marks. Portrait's desktop name increases from 32px to 38px; Reviews to 36px; PI to 32px. Signal remains a considered Manrope wordmark. Product explanations increase from 16.32px to 18–21px desktop, 18px tablet and 17px mobile. Captions remain subordinate.

One navy text-and-arrow action family replaces blue outlined proof links. Primary actions use stronger weight; gallery and editorial destinations remain quieter. Wording explicitly names Portrait, Reviews Engine, Property Insights and the Signal case study. App Store access remains subordinate to Visit Portrait. All destinations were checked; SkyPups' actual review implementation renders in shadow DOM. The external App Store listing still uses Etchr Portraits, by 1118, LLC; this pass does not rename that listing.

PI's visible synthetic/showroom captions are removed. Its fictional demonstration remains documented in the component comments and existing source provenance; no real-customer or outcome claim is added. Signal's homepage loses the provenance caption/original-screen link; the same provenance and full-size archives remain in its case study. Homepage scene links to the case study.

Process retains exact step copy, removes its redundant support sentence, and uses an unbroken desktop thesis with natural mobile wrapping. Studio supporting copy is enlarged with the descriptor subordinate. Contact keeps white on #F6F8FA, with a modestly wider form, 12px corners, 58px controls, 200px textarea, readable labels and a navy action. Accessible #82909e control borders remain; the outer surface is quieter.

## Signal identity recovery

Read-only search covered `/Users/stevehole/Documents/1118/Signal`, historical website archives/ZIPs and current 1118/Shipyard assets. `Signal/Logos/Signal Graphic.png` is a chart-pattern background, not the interface mark. Other clean marks belong to third-party inspiration such as Alpha Vertex. The authentic 2019 screenshots show a small cyan mark and lowercase Signal wordmark, but no matching usable standalone source was found. No screenshot reconstruction or new logo was generated.

**SIGNAL ICON — POST-LAUNCH BRAND TASK.**

## Image delivery

Original assets remain untouched. `ResponsiveImage` selects AVIF or WebP through `picture` and explicit `srcset`/`sizes`, with approved originals as fallback. Dimensions and existing crop transforms are preserved. Source-photo sizing accounts for the native 1.2674 scale. Browser inspection confirms one request per hero layer, no fallback duplicate and exactly two image preloads. The below-fold App Store badge is lazy/low priority.

The 80-file inventory and rendered-size audit identified lossless-sized photographic WebPs and oversized tiny marks as the main cost. `docs/image-delivery-20260914.json` records original hashes/dimensions/formats/bytes and each derivative. Vite deduplicates identical Sloane result and square derivative content.

| Asset | Original bytes | Reviewed full-size AVIF bytes |
|---|---:|---:|
| Laurie source | 125,919 | 63,682 |
| Laurie result | 356,660 | 222,980 |
| Sloane source | 1,261,470 | 68,725 |
| Sloane result | 1,107,304 | 253,613 |
| PI house | 1,902,818 | 249,102 |
| Signal environment | 147,292 | 114,703 |

Signal's original is retained as the WebP fallback when recompression would be larger. Original full-resolution archives remain the linked references; responsive archival AVIFs were inspected for chart text legibility. Transparent marks are proportional 256px lossless WebPs: Portrait 52,524 bytes, Reviews 58,514, PI 20,660. Pixel comparison confirms identity geometry and transparency against proportional original resizes.

Offline reproduction: install/use Sharp outside the production runtime, then run `node scripts/optimize-images.mjs`; `SHARP_MODULE` optionally supplies an absolute module path. The script uses AVIF quality 72 for photographic/portrait assets, 65 for the quality-reviewed Laurie result, 82 for Signal/chart assets, with 4:4:4 chroma; WebP fallback quality 88 or 94 for Signal. No added production dependency. Native-pixel and rendered-size crops were reviewed: q55 Laurie lost fine texture, so q65 was selected. No visible quality regression was accepted.

Reviews image delivery observes chapter proximity plus visible/next cards; duplicate cycles share browser-cached URLs. The carousel's speed, scroll/pause logic, keyboard and touch mechanics are unchanged. There are no image fetches from the Reviews strip on initial hero load. No-script images remain available. Other proof images retain lazy loading and low priority where appropriate.

## Motion

Only the standalone Sloane PHOTO has photographic motion: a wrapper scales 1 to 1.035 over 16 seconds, alternating with ease-in-out. The original inner image transform is intact. An IntersectionObserver pauses it offscreen; hidden documents pause it too. A keyboard-accessible pause/resume control is provided. Reduced-motion removes animation and transforms. Maximum one cinematic animation per page; comparison layers, output formats, logos and Signal remain static. No new animation loop or layout-changing animation is added.

## Security, contact and release boundaries

The server and contact state machine are unchanged. Independent review passed maintained tests and adversarial assertions; no new P0/P1 issue was found. Preview uses Cloudflare's official test pair and Resend's fixed test sink; its test warning is expected and unstyled. Production rejects test keys and requires the real Managed widget, exact `1118.io`/`www.1118.io` hostname and `contact` action through Siteverify before sending. Honeypot, strict validation, body cap, safe Reply-To, per-instance rate limits and Resend idempotency are preserved. Recipient and credentials remain server-only, with no Formspree/mailto fallback.

Fresh Resend metadata/DNS checks confirm verified 1118 sending and all four existing verification records. Key detail screens independently confirm separate Preview and Production keys, each Sending access and scoped to 1118.io. Production key has no activity; Preview's prior controlled test is the single recorded use. The previous one-message test-sink acceptance remains valid for the unchanged backend. It is not real canonical-host/private-inbox delivery proof.

**Confirm Production contact recipient: ______**

No private recipient is inferred. After recipient confirmation and explicit founder Production authorization, release the reviewed commit via the existing PR, then perform one controlled real Managed canonical-host submission and verify server acceptance, Resend delivery, all field values and exactly one company-inbox message. Smoke public routes, canonical redirects, assets, headers and indexing. Roll back on a critical regression. A Preview artifact must not be directly promoted with its test configuration: Production must be built with its real environment.

Existing rollback: `8e49e28f72017d4fe68e0558bb2019e021624b3e`, deployment `dpl_7jm5DHyYvUWgWHtwytHwVUfNjC59` (V1 with contact disabled). Existing P1: rate limits remain 5/IP/hour and 30 total/hour per warm instance, not distributed; spoken screen-reader real-challenge verification remains pending. Hosted performance and final review evidence are reported against the resulting commit in the founder artifact package.
