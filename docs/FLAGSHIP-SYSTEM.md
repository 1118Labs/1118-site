# 1118 flagship system — September 13, 2026

Continues review/1118-editorial-canon-20260913 from ecdba20f50c63ac0b39026576cbe7e1ac1343d94. Product assets, proof interfaces, motion, comparison state machines and approved copy remain intact. Production publication remains a separate founder gate.

## Typography provenance

Read-only source: 1118Labs/shipyard, /Users/stevehole/shipyard/src/App.css, main ad9c54d73160024fe9c1d7591acf9b11a763d37b (Finalize Shipyard homepage design system). Remote main and live www.goshipyard.ai/assets/index-aEZ1XZZ9.css matched. Its public homepage applies Manrope only. Instrument Serif is an unused import; internal pitch-builder fonts are unrelated. Neither is ported. Newsreader registration, binary and unused license removed from the shipped site. Existing licensed variable Manrope400–800 retained and preloaded.

Exact source mechanics: hero800/-.067em/.94 and clamp(4rem,5.35vw,5.8rem); product700/-.04em/.9 and clamp(2.9rem,4.35vw,5rem); company chapters780/-.055em/.92–.96; hero support1.08rem/1.55; product support1.02rem/1.7; nav11.5px/700/.11em; links.92rem/700/.01em; labels.78rem/700/.08em. Hero responsive960/720px breakpoints and product720px scale follow source. Source ranges: App.css188–199,255–269,358–369,428–472,730–783,905–944,1046–1065,1125–1222,1284–1314,1436–1439,1513–1547,1719–1995.

Necessary1118 adaptations: wider hero measure for its locked two-line phrase; natural balanced product wrapping instead of old forced line breaks; Studio calibrated below hero to fit CONTENT; case heading uses the source Work scale for1118's longer case titles; Contact mobile retains readable2rem–2.8rem rather than Shipyard's small compact contact heading. Native logos/screenshots/product UI retain their typography.

## Shared composition

CONTENT max1160px, gutter clamp(20px,4vw,48px). WIDE max1440px, gutter clamp(12px,2vw,32px). BLEED100% of viewport-wide parent avoids scrollbar overflow. Explicit tokens in flagship-system.css govern chapter layout. Hero/headerWIDE; product introductionsCONTENT; Portrait/PI/Signal proofWIDE; ReviewsBLEED; lower chapters/footerCONTENT. Cases useCONTENT narrative/WIDE proof. Shared chapter64–104px, intro-to-proof36–64px, proof-to-caption24px. Identity64px desktop/52px mobile with optical exceptions inside canonical mark containers. Radius24px outerproof/18px surface/8px field; native circles and UI unchanged.

Signal's existing component moves to the normal sibling proof stage; no new scene, crop, hardware or claim. Portrait's equal first two columns now share bottom edges without changing crops/transforms. Process uses a continuous horizontal rule, aligned4/2/1 sequence, and a vertical mobile rule. Contact stays#F6F8FA; footer deep navy with Navigate/Policy groups. Dark chapter focus outlines are white; form control borders#82909e exceed3:1 on white.404 now loadsManrope and uses company palette. llms policy links completed; unusedOG source title updated without regenerating artwork.

## Resend setup and DNS ledger

Founder authorized dedicated1118 setup and exact requiredDNS only. Before mutations: connected account had two verified domains, no1118 domain; Free transactional plan$0/month,35/3000 monthly,0/100 daily,2/3 domain slots; no payment method, pay-as-you-go disabled. Adding1118 consumes the third included slot; no purchase/upgrade. Low-volume sending shares account100/day and3000/month quota.

Created1118.io domain fdc170d2-9851-4377-abf9-a56ad01244de, us-east-1, sending enabled, receiving disabled, tracking off. Resend returned and verified these exact additions, allTTL Auto/DNS only:

| Type | Name | Value | Priority |
|---|---|---|---|
| TXT | resend._domainkey | p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBJDLOBrcBrnpCOLP07+pbECm1fQzuKWUt44sSDSubT25Z1i0Wx5FtT2KqYPcS5s8LCf4GRR/GBb+3tkBghLaBl4IaKIn0qWrrkAuzUit2yvsGciGCCN9FXspbJD0V8dmaecWxgsw11XGr+Efo/Tdu/LY77Wfztxl4YlaLdjBFOQIDAQAB | — |
| MX | send | feedback-smtp.us-east-1.amazonses.com |10|
| TXT | send | v=spf1 include:amazonses.com ~all | — |
| CNAME | rsend | send.forge.rmta.net | — |

Existing apex Google MX/SPF, Google DKIM, DMARC, websiteA/CNAME, Vercel and neighboring records were not edited. SPF is isolated tosend; no conflicting duplicate apexSPF. Production senderwebsite@1118.io. Separate1118-only sending-access keys created forProduction andPreview. Keys stored only as VercelSecret values. ProductionRESEND_API_KEY/CONTACT_FROM andPreviewCONTACT_PREVIEW_RESEND_API_KEY/CONTACT_PREVIEW_FROM. CONTACT_TO remains pending exact-recipient approval: automatic review rejected transferring the address inferred from the existing1118 Formspree workflow. No destination address is published here. No Formspree/mailto fallback exists.

## Delivery and remaining release gates

Preview uses officialCloudflare test keys and server-pinned delivered@resend.dev. Production requires realManaged credentials; exact1118.io/www.1118.io hostname and contact action checked bySiteverify beforeResend. Every attempt validates; reject expired/reused/invalid tokens. Honeypot, strictJSON/fields,12KB body cap, plaintext fixed envelope, no URL fetch, stable24-hourResend idempotency, concurrent retry coalescing and draft-preserving errors remain.

Rate limit remains5/IP/hour and30 total/hour per warm instance,429/Retry-After3600. Fresh scopedVercelStorage inventory found no attached or available existing team store; source/env inventory has no sharedKV/Redis facility. No service provisioned. Distributed limit remainsP1.

Twelve read-only specialist roles completed before final integration review: Shipyard archaeology, creative direction, grid, product proof, typography, contact, security, SEO, AEO, accessibility, performance, founder adversary. Root is the only source integrator. Baseline29tests and27 additional security assertions passed; npm audit0known advisories. Final build/hosted evidence belongs in artifacts/1118-flagship-system-20260913; do not interpret baseline or synthetic checks as real delivery.

Before publication: confirm privateCONTACT_TO; complete controlled realManaged submission on canonicalhostname, server success, Resend acceptance and exactlyone matching inbox message/no duplicate. No safe canonical-host test is configured without publishing the candidate. Manual spoken screen-reader completion of realManaged flow remainsP1. Hosted mobile performance must be reported separately from local lab evidence.

Release sequence after explicit founder authorization: recordcurrentProduction rollback identity; verifyserverenv/realwidget; release exact reviewedSHA through existingPR; first action controlled canonical submission/inbox/dedupe verification; smoke9routes/assets/canonicalredirect/headers/indexing; roll back on deliveryorcriticalregression. Never claim deployment or founderapproval fromREADYPreview.

## Controlled Preview acceptance

On protected87f345c Preview, one actual official-test Siteverify + Resend test-sink submission returned202. A deliberately simulated lost browser success response preserved the draft/UUID; the unchanged retry with a refreshed widget returned202. Resend email e1769f49-3e57-481c-859c-eb15ec6192c7 was delivered to its official test sink at2026-09-13T23:38:33.415Z; all six submitted field values matched. Provider listing after both requests contained exactlyone1118 message, no duplicate. Seventeen browser assertions passed. This is not realManaged/canonical-host/private-inbox verification.

First hosted slow-mobile lab measuredLCP3.208s but the hero result finished at10.63s while five large proof images competed. The narrow follow-up gives both hero images high priority and lower proof-image priority. Files, crops and interactions unchanged. Final measurement is reported with its ownSHA in the artifact evidence.
