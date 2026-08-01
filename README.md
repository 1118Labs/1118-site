# 1118 Company Website

Launch-candidate website for 1118, LLC: an AI-first product studio that designs, builds, launches, and operates original software.

## Stack

- React 19
- Vite 8
- TypeScript
- Framer Motion
- Vercel Preview deployment

The site is deliberately static and self-contained. Public product claims and media are recorded in the launch evidence and legal-review checklist; no external CMS or runtime data source is required.

## Local development

```bash
npm ci
npm run dev
```

Quality checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Launch boundary

The committed configuration is a protected launch candidate, not a Production release:

- `noindex,nofollow,noarchive` is set in HTML, `robots.txt`, and Vercel response headers.
- Production, custom-domain, DNS, analytics, and public indexing changes require a separate founder approval.
- Before Production, follow [docs/production-launch-checklist.md](docs/production-launch-checklist.md) and complete [docs/legal-review-checklist.md](docs/legal-review-checklist.md).

## Historical case studies

Signal is included in V1 as a completed historical 1118 product. A dedicated Signal route and Playbook—the first approved post-launch historical case study—are preserved in the internal roadmap at `src/content/historical-roadmap.ts`. That file is intentionally not imported by the public application.
