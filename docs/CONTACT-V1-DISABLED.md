# Production V1 Contact release gate

Founder authorized website release with Contact disabled. `shared/contact-release.mjs` is the single source for the client and API gate. The page shows “Contact form coming online.” and mounts no form or Turnstile. Both public contact endpoints return 503 with `ok: false`, without reading credentials or calling a provider.

First post-launch task: verify real Managed Turnstile at a canonical origin, exact hostname/action and one matching inbox receipt before changing the gate. Activation requires a separately reviewed code change and release. Never activate official testing keys in Production. Existing real Production credentials stay server-side; the destination remains private.
