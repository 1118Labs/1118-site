import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="page-shell footer-grid">
        <Link className="footer-brand" href="/" aria-label="1118 home">
          <Image
            src="/brand/1118-logo-blue.png"
            alt=""
            width={273}
            height={175}
          />
        </Link>

        <div className="footer-legal">
          <strong>1118, LLC</strong>
          <span>New York</span>
          <span>© {new Date().getFullYear()} 1118, LLC</span>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <a href="mailto:hello@1118.io">hello@1118.io</a>
          <a href="https://etchr.ai" target="_blank" rel="noreferrer">
            Etchr.ai <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
