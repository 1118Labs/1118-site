# 1118 Company Website

Launch-candidate implementation of the 1118 company website. The site is a
Next.js App Router project built from the recovered, founder-reviewed
Shipyard-foundation visual direction.

## Public positioning

- Public company name: `1118`
- Legal reference: `1118 LLC`
- Founder reference: `Steve`
- Company contact: `hello@1118.io`
- Featured live product: [Etchr Portraits](https://etchr.ai)
- Verified App Store listing:
  [Etchr Portraits](https://apps.apple.com/us/app/etchr-portraits/id6785615752)

## Information architecture

1. Company statement
2. Etchr featured product
3. Product portfolio with public status labels
4. Founder-led, supervised-AI operating model
5. About
6. Meaning behind 1118
7. Contact
8. Privacy, terms, and accessibility

Unannounced products stay unnamed. The site contains no contact form,
analytics, tracking scripts, or customer claims.

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

Preview builds use `noindex, nofollow`. A Vercel production build switches the
metadata and robots route to indexable output.

## Recovered visual sources

| Purpose | Source |
| --- | --- |
| Typography, spacing, editorial composition | `review/1118-shipyard-foundation` at `5a299541e295e3717b9d69040a33615e246baa41` |
| Etchr before/after proof | Recovered canonical pair in `public/brand/` |
| Etchr product composition | Approved assets in `public/etchr/` |
| Escape-velocity chapter | Approved art-directed source in `public/studio/` |

Production deployment, merge, DNS, analytics, Etchr code, and Founder OS code
are outside this branch’s scope.
