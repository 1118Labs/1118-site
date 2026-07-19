export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="page-shell">
        <div className="footer-panel">
          <h2>Building something worth obsessing over?</h2>
          <a className="button footer-cta" href="mailto:hello@1118.io">
            Get in touch <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="footer-meta">
          <div className="footer-meta-left">
            <span>1118</span>
            <span>New York</span>
            <span>© {new Date().getFullYear()} 1118</span>
          </div>
          <nav className="footer-meta-nav" aria-label="Footer navigation">
            <a href="#work">Work</a>
            <a href="#about">About</a>
            <a href="https://etchr.ai" target="_blank" rel="noreferrer">
              Etchr.ai ↗
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
