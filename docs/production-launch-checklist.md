# Production launch checklist

The protected Preview is not authority to release Production. Complete every item below only after Steve gives the separate Production decision.

## Founder decisions

- Confirm the final `1118.io` domain and DNS owner.
- Confirm the final contact-form delivery method and recipient.
- Confirm analytics and cookie choices; update Privacy accordingly.
- Complete every media and story item in `legal-review-checklist.md`.
- Approve the final desktop and mobile visual evidence.

## Production changes

- Replace the HTML robots value with `index,follow`.
- Replace `public/robots.txt` with `public/robots.production.txt`.
- Remove the Vercel `X-Robots-Tag` launch-candidate header.
- Rebuild and repeat the full browser, accessibility, link, metadata, and status-code matrix.
- Attach the exact deployed commit SHA to the final launch record.
- Assign the custom domain only after all checks are green.

## Explicitly not part of this launch candidate

- Production deployment or Preview promotion
- DNS or custom-domain mutation
- Analytics activation
- Public indexing
- Playbook publication
- Dedicated `/work/signal` or `/work/playbook` routes
