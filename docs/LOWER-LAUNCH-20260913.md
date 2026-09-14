# 1118 lower-half candidate — September 13, 2026

Protected Preview review only. Baseline: 18698b9c4f5566df76e73a4f2c8d424545e2163f. Production remains 8e49e28f72017d4fe68e0558bb2019e021624b3e; no merge, Production deployment, DNS or indexing mutation in this run.

## Scope
Navy Studio; white, aligned four-column process (two at tablet, one on mobile); light #F6F8FA Contact and restored white form; existing compact navy footer. Frozen product visuals, content, interactions and case studies unchanged. A measured cold-mobile performance defect is the sole product-source exception: Reviews/PI brand images now use lazy/low-priority loading so their combined 950KB no longer competes with the hero during initial load. Image files and rendered appearance are unchanged. Exact founder copy preserved. Privacy provider disclosure now Resend. Machine index includes exact hero canon. Fonts retain their files and use bounded cache freshness; hashed assets remain immutable.

## Contact contract
POST /api/contact uses strict bounded JSON; normalized strings, valid email/stage, optional HTTP(S) URL without credentials (never fetched), honeypot and UUID. Source never includes destination inbox. Every otherwise-valid submission passes Cloudflare Siteverify before any provider request, including retries. Production verifies exact origin hostname 1118.io or www.1118.io and action contact. Invalid, expired, spent or unavailable verification rejects safely.

Turnstile mode: existing dedicated `1118 Contact Form — Production`, Managed, approved hosts `1118.io`, `www.1118.io`. Live read-only Cloudflare dashboard verification confirmed this dedicated widget, Managed selected, exactly these two hostnames and no pre-clearance. No settings were saved or changed. Production accepts only real server-configured keys, rejects official test keys/test mode. Unknown environments reject. Preview/development are forcibly mapped to Cloudflare's official public test pair and require the official testing metadata in Siteverify. Preview never uses real Production credentials.

Delivery is Resend only; legacy Formspree env variables cannot select a fallback. Production requires server-only RESEND_API_KEY, CONTACT_FROM (approved @1118.io sender), CONTACT_TO (approved private inbox). Preview requires distinct CONTACT_PREVIEW_RESEND_API_KEY and CONTACT_PREVIEW_FROM; recipient is pinned server-side to Resend's official delivered@resend.dev test sink. Production configuration cannot enable Preview delivery. Missing configuration returns 503, not a fabricated success.

Retry UUID is retained for unchanged values; Resend receives deterministic Idempotency-Key with 24-hour provider deduplication. Warm-process coalescing suppresses concurrent duplicates; changed payload with same ID is rejected. Siteverify never skipped for duplicate submissions. Token is refreshed after attempts/expiry and sizing changes without clearing the draft. Exact success and failure text supplied by founder.

## Infrastructure inventory (read-only)
Scoped Vercel project env names show Production Turnstile, legacy Formspree and indexing configuration; older branch-scoped test configuration. No Resend sending key/envelope or Redis/KV store credentials attached. Connected Resend inventory has no 1118.io sending domain. Other businesses' domains/credentials were not reused. No account configuration or email sends performed.

## Open register
- P0 before publication: configure/verify a dedicated 1118 Resend sending domain, approved sender/private recipient and domain-scoped sending key. Add separate Preview testing key/sender for real provider test-sink acceptance. Then verify one controlled real Managed submission on approved hostname, provider receipt, exactly one inbox message and matching fields. No email delivery success is claimed from mocks.
- P1: distributed serverless rate limiter is not provisioned. Approved conservative fallback is five requests/IP/hour and thirty total/hour per warm instance, bounded memory, ephemeral hashed IP keys. Cold starts and separate instances can exceed these limits. No paid service was created. Add approved shared store before broad traffic or explicitly accept this residual risk.
- P1 evidence: final hosted browser, axe, zoom, route/header and frozen-product checks must be recorded for this commit; manual assistive-technology verification must be distinguished from semantics/automated checks.
- P2: below-fold logo loading and offscreen carousel work are inherited performance opportunities; product freeze preserved. Search Console property/index state is unverified; read-only sitemap/index inspection recommended after a separately approved release.

Minimal CSP covers objects, base URL, native form targets and frame ancestors; it is not a full script-source allowlist. No WCAG certification or field Core Web Vitals claim.

Detailed independent audits and rendered evidence are kept in the project artifact directory `artifacts/1118-lower-launch-20260913` outside this repository.
