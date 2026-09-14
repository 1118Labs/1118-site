# Founder corrections — September 14, 2026

Base: c270567650283ddaf8561b8be509640e58dbff4d. Preview-only surgical pass; no merge or Production release.

## Changes

- Hero CTA explicitly uses the existing `--navy` (#192E43) for text and rule, including hover/focus. No opacity wash on hover.
- Locked supporting statement retains its exact copy. Above 1000px: 18–20px Manrope, weight 550, line-height 1.5, natural wrapping and no narrow character-width cap. No headline, font-file, grid or image changes.
- Signal homepage chapter uses existing `--mist` (#F6F8FA). Its text, CTA and focus indication use `--navy`. The approved icon files/component, copy, environmental proof and case-study treatment remain unchanged.
- Remove the unlinked platform-icon row only from the homepage Portrait proof. Case-study composition is frozen. Gallery images, loading boundaries, formats, CTA hierarchy and motion remain unchanged.

## Live Portrait destination audit

Source inspected in the actual rendered https://getportrait.ai/ page on September 14, 2026. Its Formats panel contains eight `[data-platform-icon-badge]` elements. Each is a span with an inline SVG and no anchor ancestor. The full rendered anchor inventory contains product/navigation/trust URLs and Apple's App Store URL, with no social/community destination URLs. These symbols describe export use cases; they do not provide actual destination links. No platform home URL or account URL was invented to justify retaining them.

| Visible mark | Implied destination | Actual linked URL in current Portrait page | Source asset | Homepage decision |
|---|---|---|---|---|
| LinkedIn | LinkedIn | None | Current page inline SVG; local PortraitPlatformIcon.tsx, linkedin glyph | Remove |
| Instagram | Instagram | None | Current page inline SVG; local PortraitPlatformIcon.tsx, instagram glyph | Remove |
| TikTok | TikTok | None | Current page inline SVG; local PortraitPlatformIcon.tsx, tiktok glyph | Remove |
| Facebook | Facebook | None | Current page inline SVG; local PortraitPlatformIcon.tsx, facebook glyph | Remove |
| X | X | None | Current page inline SVG; local PortraitPlatformIcon.tsx, x glyph | Remove |
| YouTube | YouTube | None | Current page inline SVG; local PortraitPlatformIcon.tsx, youtube glyph | Remove |
| Slack | Slack | None | Current page inline SVG; local PortraitPlatformIcon.tsx, slack glyph | Remove |
| Discord | Discord | None | Current page inline SVG; local PortraitPlatformIcon.tsx, discord glyph | Remove |
| Apple App Store badge | Portrait Editorial App Store listing | https://apps.apple.com/us/app/etchr-portraits/id6785615752 | src/assets/showcase/etchr/download-on-the-app-store.svg | Retain unchanged |

No social icons remain on the 1118 homepage. The authentic Apple badge is the sole retained third-party destination graphic and stays native black. Existing text links remain https://getportrait.ai, https://getportrait.ai/gallery and /work/portrait. This audit makes no new claim about integrations, account ownership or export compatibility. No Portrait repository/deployment was modified.

Hosted computed-color inventory, five-width statement dimensions, DPR checks, screenshots and performance delta are provided in the task's review artifacts and PR evidence after deployment.
