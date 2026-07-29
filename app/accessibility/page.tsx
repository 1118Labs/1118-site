import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility information for the 1118 company website.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <main className="policy-page">
      <div className="policy-shell">
        <Link className="text-link" href="/">
          ← Back to 1118
        </Link>
        <p className="eyebrow">Accessibility</p>
        <h1>Accessibility at 1118.</h1>
        <p className="policy-meta">Reviewed July 29, 2026</p>
        <p>
          1118 aims to make this website usable for as many people as
          possible and targets WCAG 2.2 Level AA.
        </p>
        <p>
          The site supports keyboard navigation, visible focus states,
          reduced-motion preferences, responsive text, semantic landmarks, and
          descriptive alternatives for meaningful images.
        </p>
        <p>
          If you encounter an accessibility barrier, email{" "}
          <a href="mailto:hello@1118.io">hello@1118.io</a> with the page and a
          short description of the issue. We will review confirmed barriers
          and work to address them in a reasonable timeframe.
        </p>
      </div>
    </main>
  );
}
