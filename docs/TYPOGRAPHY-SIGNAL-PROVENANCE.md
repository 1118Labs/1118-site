# 1118 typography and Signal art direction

Copy authority: `95c4152e23126445502a357da9355219b55692ae`. Marketing prose is unchanged. This visual pass is for protected Preview and requires founder approval before Production.

## Typography

Use existing self-hosted Manrope variable Latin WOFF2, licensed under the SIL Open Font License retained in `public/fonts/Manrope-OFL.txt`. No new font download or Apple SF Pro installation.

- Hero: Manrope 780.
- Product headlines: Manrope 720, including Signal.
- Section headlines: Manrope 700.
- Work/case hero: Manrope 750; Work product headlines 720.
- Body: Manrope 400–500, with marketing chapter copy 450.
- Labels: Manrope 600, while existing native product wordmarks remain unchanged.
- Navigation: Manrope 600.
- Footer: Manrope 500; utility headings 550.

Hero tracking is -0.055em with 1.06 desktop line height. Major headings use -0.045em with approximately 1.1 line height. Supporting hero copy is 24–30px desktop/23px mobile, weight 500. Existing native product proof stays scoped to its own styles. How We Build is a 2×2 sequence above 700px and a single-column progression below it. Studio uses a large thesis and separate supporting column on desktop.

## Signal provenance

**Environment:** generated supporting marketing environment, not an archival photograph or historical trader.

**Signal screen:** authentic 2019 Signal interface from the existing project archive. The screenshot was composited deterministically into the display plane; it was never given to image generation for reconstruction. Full aspect ratio preserved, no crop, no UI drawing, no content replacement or source color edits. Perspective resampling and WebP compression apply only to the marketing derivative.

Original source: `src/assets/showcase/signal/signal-archival-interface.png`, 2167×1046.

Source SHA-256: `64fc6ea1ac12ffc21aaa3ba8749a424d2096633a98dba34b04f84784db102968`.

Selected derivative: `src/assets/showcase/signal/signal-workstation-authentic-composite-20260913.webp`, 1536×1024. The screen occupies about 70% of image width; the person never obscures it. Selected screen corners, clockwise from top left: (216,133), (1297,132), (1297,694), (216,694). Dark letterboxing preserves the original aspect ratio.

Three generated directions were reviewed after inserting the authentic screenshot:

| Direction | Finding |
| --- | --- |
| A — clean institutional desk | Credible runner-up; initial monitor too panoramic, corrected before review. |
| B — modern quantitative workstation | Restrained setting, but panoramic monitor diminishes authentic UI scale. |
| C — human-in-context research environment | Selected: strong near-frontal screen, quiet human presence, credible daylight, no neon or branding imitation. |

All generation used the built-in image tool. No stock assets were purchased. Prompts requested a blank screen plane, unbranded professional monitor, restrained workstation, soft daylight, and no generated charts or interface. The complete prompts, environment originals, three composites, master PNG, transform coefficients and reproducible compositor are retained in the September 13 visual-review artifacts.

Alt text: “Signal commodities analytics interface presented in an illustrative trading-workstation environment.” Visible caption identifies the environment as illustrative and the interface as authentic. The untouched overview screenshot is displayed deeper in the Signal case study, alongside the unchanged historical-data and Manage Structures archives. All three original files remain downloadable at full resolution.

Limitations: small historical labels are not readable at phone-sized marketing scale; the original-image links provide full-resolution inspection. Generated keyboard legends are soft at enlarged scale. No obvious anatomy, logo, or screen-content artifacts were found in the selected image.
