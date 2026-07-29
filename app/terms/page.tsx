import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using the 1118 company website.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="policy-page">
      <div className="policy-shell">
        <Link className="text-link" href="/">
          ← Back to 1118
        </Link>
        <p className="eyebrow">Terms</p>
        <h1>Website terms.</h1>
        <p className="policy-meta">Effective July 29, 2026</p>
        <p>
          These terms govern use of the 1118 company website. Product-specific
          services, including Etchr, may have separate terms.
        </p>

        <h2>Informational purpose</h2>
        <p>
          This website describes 1118 and selected products. Product status
          and availability may change. Nothing on this website is an offer of
          investment, employment, or professional advice.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The website, its design, copy, product names, and original media are
          owned by 1118 LLC or used with permission. You may link to the
          website, but may not reproduce or commercially exploit its content
          without permission.
        </p>

        <h2>Third-party links</h2>
        <p>
          Links to third-party services are provided for convenience. 1118 is
          not responsible for third-party content, availability, or terms.
        </p>

        <h2>Disclaimers</h2>
        <p>
          The website is provided on an “as available” basis. To the extent
          permitted by law, 1118 LLC disclaims implied warranties and is not
          liable for indirect or consequential loss arising from use of this
          informational website.
        </p>

        <h2>Changes and governing law</h2>
        <p>
          We may update these terms by posting a revised version. These terms
          are governed by the laws of the State of New York, without regard to
          conflict-of-law rules.
        </p>

        <h2>Contact</h2>
        <p>
          Questions may be sent to{" "}
          <a href="mailto:hello@1118.io">hello@1118.io</a>.
        </p>
      </div>
    </main>
  );
}
