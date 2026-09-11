# Portrait App Store follow-up — read-only audit

Inspected September 11, 2026. Role C / Image Director I. No App Store Connect account was opened or edited; no native build, product repository, price, IAP, submission, or listing was changed. Public observations are from Chrome's rendered US listing and Portrait website. Local materials are references, not proof of a processed or released build.

## Public listing register

Verified destination: https://apps.apple.com/us/app/etchr-portraits/id6785615752 . Keep this numeric app ID and working URL for 1118's badge; its legacy slug is not an instruction to rename the company chapter.

| Field | Observed public state | Follow-up |
| --- | --- | --- |
| Name | **Etchr Portraits** | Replace with **Portrait**, subject to name availability in each supported locale. Do not silently substitute historical **Portrait Editorial** without founder choice. |
| Icon | Black rounded square, silver serif **E** | Replace released icon with the approved **P** asset through the appropriate native release workflow. |
| Subtitle | **Look like you belong in print.** | Retain this current public line; it matches the live product voice. |
| Promotional copy | Separate introductory paragraph says “Look like you belong in print. Create a refined editorial portrait you'll be proud to use everywhere you show up online.” | This paragraph is visibly separate above the main description. Exact App Store Connect field attribution is not authenticated; proposed concise replacement below. |
| Main description | Describes professional profile use, transforming one photo into a refined editorial portrait, high-resolution export and crop formats. Contains **Etchr** twice and a Portrait Promise. | Replace consumer-facing Etchr with Portrait, reconcile portrait/pack terminology against the current shipping entitlement, and verify the promise remains an approved policy. |
| Screenshot order | Three iPhone screenshots: source / before-after / completed portrait with Save and Share. | Keep this clear three-step order; refresh only from a validated current app capture. |
| Screenshot branding | No visible Etchr wordmark in the inspected three screenshot images. | Do not falsely report embedded old name in screenshots. The old icon/name mismatch is in the listing header. |
| Screenshot wording | First two: **Turn a photo into an editorial portrait.**, **Create My Portrait**, **Choose Photo**, **Take Photo**. Third: **Portrait ready**, **Save it. Share it.**, **Save / Save to Photos**, **Share / Open share sheet**, **Portrait Tools / Pack, crops, gallery, link. / OPEN**, **Your portrait is ready.** | Strong reusable concept. Current public third screenshot has a centered, complete face. |
| Marketing URL | Public **Developer Website** link points to https://etchr.ai/ | Future intended value https://getportrait.ai . Old homepage redirects to current Portrait. |
| Support URL | No distinct developer-support URL was visible in this public listing. Apple's footer Support link is Apple billing support, not app support. | Local plan specifies https://getportrait.ai/support . Verify authenticated current value and destination before future edit. |
| Privacy URL | Public link https://etchr.ai/privacy | Future intended value https://getportrait.ai/privacy . Verify destination and consistency with current policy before future edit. |
| Developer / seller | **1118, LLC** | Keep. |
| Category | **Photo & Video** | Keep unless product classification changes. Secondary category not publicly established. |
| Platform / age | Only for iPhone; Free · In-App Purchases; Designed for iPhone; 4+ | No price/IAP/platform change authorized by this sprint. |
| Other public fields | English; 164.5 MB; requires iOS 15.0 or later; too few ratings for an overview | Recorded only; not launch marketing claims. |
| Not publicly established | Authenticated metadata locales, reserved name availability, current editable version/build, submission status, review notes, keyword field, distinct support field, processed icon in next build | Remain unknown. Never infer them from local files or past checklists. |

## Public screenshot source identifiers

The following are exact image URLs observed in the listing DOM, rendered at 230×498. They identify the published images; the local filenames below do not establish byte equivalence.

1. https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/85/23/9d/85239d24-41de-b9da-5c93-7f6a5966551a/launch-screen.png/230x498bb.webp
2. https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/3c/a0/cb/3ca0cb8d-d635-f562-3257-4890ecffacf4/hero-before-after.png/230x498bb.webp
3. https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/57/43/39/57433918-6590-6c6e-e9c1-2adbddce4908/portrait-complete.png/230x498bb.webp

## Local materials and conflicts

Current reference root (read-only): `/Users/stevehole/.codex/.chatgpt-projects/g-p-69f328f7768c819180128324b15b15f4/portrait-build23-payment-forensics`.

- `ios/App/App/Info.plist` and Xcode project both currently say **Portrait Editorial**. Permission prompts say Portrait. This is a local implementation state, not the public listing name.
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png` is the current local metallic P icon, visually inspected. SHA-256 `20df70b53afbe61fed519630a627fc27f3b095e8973a9ec56e5bb4b887caa3d0`. The catalog marks it `ios-marketing`, 1024×1024.
- `public/brand/portrait-app-icon-header-256.png` is the exact currently loaded website P icon. Keep this approved variant on 1118; no recreation is needed.
- `artifacts/portrait-launch-execution/app-store-sync-checklist.md` is an **uncompleted historical checklist**, proposing Portrait Editorial and subtitle Editorial portraits, one photo. It is not an authenticated state or current naming authorization. The new brief's Portrait naming controls this follow-up.
- Both this root and `/Users/stevehole/Etchr` contain `artifacts/app-store/listing/01-launch-screen.png` through `08-purchase-screen.png`. The listing README proposes five images, while Apple currently shows three. Its dimensions claim is not reliable for all copies: main Etchr 01–05 are 1284×2778; the newer root's inspected 05 is 1290×2796.
- **Do not reuse local 05 by filename:** both inspected `05-portrait-complete.png` files show a badly left-cropped face and a PORTRAIT CROP badge. The current public Apple third image instead shows a centered full face without that badge. These local captures are stale relative to the published composition.
- `/Users/stevehole/Etchr/docs/etchr-app-store-metadata.md` is dated July 6 and proposes subtitle Portraits from your photos and old URLs. It also includes legacy pack submission guidance. It is superseded by newer product material and must not be copied wholesale.
- Newer synchronization checklist says `portrait_single` is the launch product and `portrait_pack` is excluded. This audit does not verify Apple's current IAP configuration and does not authorize any IAP edit.

## Exact future rename package — proposal only

Public product name: **Portrait**. Native display name: **Portrait**. Retain bundle identifier `com.1118.etchr`, numeric Apple ID `6785615752`, and existing entitlement identifiers; a public rename does not require inventing a new app record.

Proposed subtitle: **Look like you belong in print.**

Proposed promotional text: **Turn one clear photo into a refined editorial portrait. Save the finished image and profile-ready formats for the places people find you.**

Proposed concise description, subject to current shipped-flow verification:

> Portrait turns one clear photograph into a refined editorial portrait you can use on LinkedIn, speaker bios, team pages, personal sites, and social profiles.
>
> Choose a photo or take one, create your portrait, then save or share the finished image. Profile-ready crop formats help you use it wherever you show up online.
>
> Use a photograph you have the right to upload. Portraits are private by default. Public gallery participation is optional and reviewed before publication.
>
> Portrait is operated by 1118, LLC.

Screenshot sequence remains **photo → transformation → save/share**. Prefer current validated native captures with full-face framing and unchanged real controls. Optional fourth screenshot may demonstrate actual export formats only after checking the shipped interface. Do not use the stale local crop or fabricate an app screen.

Future separately authorized task: inspect App Store Connect locales/name availability and current version; reconcile the exact shipping native build; prepare the Portrait name/P icon/copy/URLs; visually validate screenshot captures and native save/share; show the complete proposed package; save or submit only within that future authorization. This audit performs none of those external actions.

## 1118 implications

1118 should say Portrait now, use the current P icon, link getportrait.ai and the verified generic App Store badge. A small factual follow-up register is sufficient; the company experience should not inherit the Etchr header. The App Store mismatch is a product-side follow-up, not permission to change that product during this brand pass.
