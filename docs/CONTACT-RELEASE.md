# 1118 contact release configuration

Production is not activated by this candidate. The founder authorized and this pass completed the dedicated widget and Production credential configuration. Deployment still requires separate authorization.

## Required widget

Created `1118 Contact Form — Production` (widget ID `0x4AAAAAAEwryKbnGCgAmtV5`) in Managed mode, with configured entries `1118.io` and `www.1118.io`. No wildcard entries, neighboring product entries, localhost, or Vercel host entries. Cloudflare automatically includes subdomains of configured hostnames; the server enforces the exact two allowed Production hostnames. Pre-clearance is unnecessary. The client supplies action `contact`; the server checks that action and the exact request-origin hostname against Siteverify. Production additionally permits only the two canonical hosts.

Production-only sensitive server environment variables are configured: `TURNSTILE_SITE_KEY` (public widget sitekey), `TURNSTILE_SECRET_KEY` (secret), and the existing approved `FORMSPREE_FORM_ID`. Never use `VITE_`/`NEXT_PUBLIC_` for any server configuration. The destination is held in the provider's private email workflow; no inbox appears in client code, HTML, schema, or mailto links. There is no client-selected recipient.

The review branch alone uses official always-pass test keys and `CONTACT_TURNSTILE_TEST_MODE=true` with `VERCEL_ENV=preview`. Production and unknown environments reject this mode and all official test keys. Official dummy responses do not reliably echo hostname/action; only explicit non-Production QA mode permits that difference and requires Cloudflare's `result_with_testing_key` marker. These keys do not provide bot protection. Keep this Preview protected. A separate real Preview widget with exact approved Preview hostnames can be created later with authorization.

## Enforcement

`api/contact.js` -> `server/contact-core.mjs` -> `server/turnstile.mjs` calls Cloudflare Siteverify with POST, secret, response, and trusted Vercel client IP. The token is never stored or forwarded to the email provider. Missing, expired, spent, invalid, wrong-host, and wrong-action tokens fail before email. Network/configuration failures fail closed. Tokens are one-use and expire after five minutes at Cloudflare. No automatic replay is attempted. Each eligible retry needs a fresh check, including a previously accepted submission ID.

Honeypot, strict field/stage validation, header-injection rejection, 12 KB request-body ceiling, JSON-only POST, exact same-site origins, fixed delivery envelope, Formspree Formshield, and duplicate suppression remain. The request limiter permits five attempts per IP per hour and 30 total per warm server instance per hour; rejected attempts consume the limit. Excess returns 429 with Retry-After 3600 and keeps entered values. Limiter storage is bounded to 4096 ephemeral salted IP hashes. It is not a distributed quota: cold starts and multiple instances have separate counters. Monitor initial volume and use a shared store/edge limit if persistent abuse demands a global cap.

Turnstile has an 8-second server timeout, provider delivery 8 seconds, client submission 22 seconds, and function max duration 25 seconds. Upstream failure is never shown as delivery success. Accepted Formspree retries deduplicate per warm instance for 24 hours, bounded to 1024 entries. Provider-side idempotency is unavailable for Formspree, so an ambiguous network failure can still lead to a duplicate on another instance.

## User recovery and accessibility

The widget loads near Contact, uses responsive sizing and keyboard-accessible Cloudflare controls, and announces state through a labelled live region. Expiry/timeout refresh automatically; errors offer a Refresh security check button. Every attempted send resets the widget; entered values remain after recoverable failure. Field errors focus the first invalid field; submission results receive focus. Reduced motion leaves the form functional. Native assistive-technology speech requires a separate manual check; automated accessibility-tree and axe checks are recorded in the release evidence.

## Indexing release gate

Only a build with both `VERCEL_ENV=production` and `PUBLIC_INDEXING_ENABLED=true` emits index,follow and the public robots file. All other builds remain noindex. Noncanonical hosts also receive X-Robots-Tag noindex; APIs always receive it. Set the indexing flag only with an authorized Production release, then verify actual canonical-host responses. No DNS or Production changes are included here.

Sources: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ and https://developers.cloudflare.com/turnstile/troubleshooting/testing/
