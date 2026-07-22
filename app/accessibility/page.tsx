import Link from "next/link";

export default function AccessibilityPage() {
  return <main className="policy-page"><div className="policy-shell">
    <Link className="text-link" href="/">← Back to 1118</Link>
    <p className="eyebrow">Accessibility</p><h1>Accessibility at 1118.</h1>
    <p>1118 targets WCAG 2.2 Level AA for this website.</p>
    <p>If you encounter an accessibility barrier, email <a href="mailto:hello@1118.io">hello@1118.io</a> with the page and a short description of the issue.</p>
    <p>Review date: Pending founder review.</p>
    <p>We will review reported barriers promptly and commit to remediating confirmed issues in a reasonable timeframe.</p>
  </div></main>;
}
