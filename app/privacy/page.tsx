import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy information for the 1118 company website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="policy-page">
      <div className="policy-shell">
        <Link className="text-link" href="/">
          ← Back to 1118
        </Link>
        <p className="eyebrow">Privacy</p>
        <h1>Privacy at 1118.</h1>
        <p className="policy-meta">Effective July 29, 2026</p>
        <p>
          This policy covers the 1118 company website at 1118.io. Individual
          1118 products have their own privacy notices where appropriate.
        </p>

        <h2>Information this website collects</h2>
        <p>
          The 1118 company website does not offer accounts or a contact form
          and does not intentionally use advertising trackers. Standard
          technical logs may be processed by our hosting provider to deliver,
          secure, and diagnose the website.
        </p>

        <h2>When you contact us</h2>
        <p>
          If you email 1118, we receive the information you choose to include,
          such as your email address, name, and message. We use it to respond
          to your inquiry and maintain relevant business records.
        </p>

        <h2>Links to other services</h2>
        <p>
          This website links to Etchr, Apple’s App Store, and other third-party
          services. Their privacy practices apply when you visit them. Etchr’s
          product privacy policy is available at{" "}
          <a href="https://etchr.ai/privacy">etchr.ai/privacy</a>.
        </p>

        <h2>Your choices</h2>
        <p>
          To ask a privacy question or request access, correction, or deletion
          of information you sent directly to 1118, email{" "}
          <a href="mailto:hello@1118.io">hello@1118.io</a>. Legal requirements
          may limit some requests.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this notice as the website changes. The effective date
          above identifies the current version.
        </p>
      </div>
    </main>
  );
}
