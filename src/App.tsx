import { motion, useReducedMotion } from "framer-motion";
import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import brandMark from "./assets/brand/1118-mark-blue.png";
import etchrResult from "./assets/showcase/etchr/hero-result-1118.png";
import etchrSource from "./assets/showcase/etchr/hero-source-1118.png";
import propertyRecommendation from "./assets/showcase/property-insights/synthetic-recommendation-card.png";
import reviewsProof from "./assets/showcase/reviews-engine/skypups-public-widget.png";
import signalInterface from "./assets/showcase/signal/signal-archival-interface.png";

const APP_STORE_URL = "https://apps.apple.com/us/app/etchr-portraits/id6785615752";
const ETCHR_URL = "https://etchr.ai";
const COMPANY_EMAIL = "hello@1118.io";

type Product = {
  description: string;
  headline: string;
  link?: { href: string; label: string };
  name: string;
  note?: string;
  slug: "etchr" | "reviews-engine" | "property-insights" | "signal";
  status: string;
};

const products: Product[] = [
  {
    slug: "etchr",
    name: "Etchr",
    status: "LIVE · AVAILABLE ON THE APP STORE",
    headline: "Editorial portraits\nfrom real photographs.",
    description:
      "Etchr transforms one clear photograph into a refined editorial portrait designed for profiles, websites, social media, and print.",
    note: "A public product from 1118.",
    link: { href: APP_STORE_URL, label: "View on the App Store" },
  },
  {
    slug: "reviews-engine",
    name: "Reviews Engine",
    status: "IN DEVELOPMENT",
    headline: "Turn customer reviews\ninto a better reputation.",
    description: "Software for collecting, moderating, and publishing customer reviews.",
    note: "Public SkyPups installation shown.",
  },
  {
    slug: "property-insights",
    name: "Property Insights",
    status: "IN DEVELOPMENT",
    headline: "Turn service requests\ninto quote-ready property intelligence.",
    description: "Property context, risk, and recommendations assembled before the estimate begins.",
    note: "Synthetic product fixture.",
  },
  {
    slug: "signal",
    name: "Signal",
    status: "BUILT · LICENSED · ACQUIRED",
    headline: "Quantitative intelligence\nfor commodities trading.",
    description:
      "1118 co-founded, designed, built, and launched Signal—an enterprise commodities analytics platform used in live markets, licensed by a major trading firm, and later acquired.",
    note: "Archival product screen.",
  },
];

const buildSteps = [
  {
    step: "01",
    title: "Direction",
    body: "Product priorities, standards, and final decisions remain founder-led.",
  },
  {
    step: "02",
    title: "Execution",
    body: "AI systems and specialist tools help turn clear briefs into visible work.",
  },
  {
    step: "03",
    title: "Review",
    body: "Evidence is checked, releases are gated, and accountability remains with us.",
  },
] as const;

const policyMeta: Record<string, { description: string; title: string }> = {
  "/": {
    title: "1118 — AI-First Product Studio",
    description: "1118 designs, builds, launches, and operates original software.",
  },
  "/privacy": {
    title: "Privacy | 1118",
    description: "How 1118 handles information on this website.",
  },
  "/terms": {
    title: "Terms | 1118",
    description: "Terms for using the 1118 company website.",
  },
  "/accessibility": {
    title: "Accessibility | 1118",
    description: "The 1118 accessibility commitment and contact method.",
  },
  "/support": {
    title: "Support | 1118",
    description: "How to contact 1118 for company and product support.",
  },
  "/security": {
    title: "Security | 1118",
    description: "How to report a security concern to 1118.",
  },
};

function Eyebrow({ children }: { children: string }) {
  return <p className="section-eyebrow">{children}</p>;
}

function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`logo ${compact ? "is-compact" : ""}`}>
      <img className="logo-mark logo-mark-1118" src={brandMark} alt="" width="272" height="175" />
      <span className="visually-hidden">1118</span>
    </span>
  );
}

function PairProof({ className = "", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <div className={`hero-media-slot-frame is-pair is-ready ${className}`}>
      <div className="hero-media-slot-pair">
        <div className="hero-media-slot-pane">
          <img
            alt="Original photograph used for an Etchr portrait"
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : "auto"}
            height="1024"
            loading={priority ? "eager" : "lazy"}
            src={etchrSource}
            width="768"
          />
          <span className="hero-media-slot-pane-label">Photograph</span>
        </div>
        <div className="hero-media-slot-pane">
          <img
            alt="Finished Etchr editorial portrait"
            decoding={priority ? "sync" : "async"}
            fetchPriority={priority ? "high" : "auto"}
            height="1024"
            loading={priority ? "eager" : "lazy"}
            src={etchrResult}
            width="768"
          />
          <span className="hero-media-slot-pane-label">Etchr</span>
        </div>
      </div>
    </div>
  );
}

function FloatingNav({ activeHash, pathname }: { activeHash: string; pathname: string }) {
  const [isCompressed, setIsCompressed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const homePrefix = pathname === "/" ? "" : "/";
  const links = [
    { label: "Work", href: `${homePrefix}#work`, key: "work" },
    { label: "How We Build", href: `${homePrefix}#process`, key: "process" },
    { label: "About", href: `${homePrefix}#about`, key: "about" },
    { label: "Contact", href: `${homePrefix}#contact`, key: "contact" },
  ];

  useEffect(() => {
    const onScroll = () => setIsCompressed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const firstLink = mobileNavRef.current?.querySelector<HTMLAnchorElement>("a");
    firstLink?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = [
        ...(mobileNavRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? []),
        menuButtonRef.current,
      ].filter(Boolean) as HTMLElement[];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className={`floating-nav-shell ${isCompressed ? "is-compressed" : ""}`}>
      <div className={`floating-nav ${isCompressed ? "is-compressed" : ""}`}>
        <a className="brand-link" href={pathname === "/" ? "#top" : "/"} aria-label="1118 home">
          <BrandLockup />
        </a>

        <nav className="site-nav desktop-nav" aria-label="Primary navigation">
          {links.map((item) => (
            <a
              aria-current={activeHash === item.key ? "location" : undefined}
              className={activeHash === item.key ? "active" : undefined}
              href={item.href}
              key={item.key}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="nav-cta" href={`${homePrefix}#contact`}>
          Start a conversation
        </a>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="mobile-menu-button"
          onClick={() => setMenuOpen((value) => !value)}
          ref={menuButtonRef}
          type="button"
        >
          <span aria-hidden="true">{menuOpen ? "Close" : "Menu"}</span>
        </button>

        <nav
          aria-label="Mobile navigation"
          className={`site-nav mobile-nav ${menuOpen ? "is-open" : ""}`}
          hidden={!menuOpen}
          id="mobile-navigation"
          ref={mobileNavRef}
        >
          {links.map((item) => (
            <a href={item.href} key={item.key} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Hero({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="hero-section" id="top">
      <div className="hero-shell">
        <motion.div
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          className="hero-copy"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
        >
          <Eyebrow>1118 — AI-First Product Studio</Eyebrow>
          <h1>We build the software we keep looking for.</h1>
          <p className="hero-copy-body">1118 designs, builds, launches, and operates original software.</p>
          <p className="hero-copy-secondary">
            Most of what we build is our own. We partner selectively when the idea is strong, the problem is meaningful, and the fit is right.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#work">
              See what we build <span aria-hidden="true">→</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          className="hero-visual-stage"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          transition={{ duration: 0.64, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <a aria-label="See Etchr, a live 1118 product" className="hero-visual-card" href="#etchr">
            <div className="hero-visual-media media-frame">
              <PairProof className="hero-media-slot" priority />
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

function ReviewsProof({ reduceMotion }: { reduceMotion: boolean }) {
  const frameRef = useRef<HTMLElement>(null);
  const [activeView, setActiveView] = useState(reduceMotion ? 1 : 0);
  const [isVisible, setIsVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [manualOverride, setManualOverride] = useState(false);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || !isVisible || paused || manualOverride) return;
    const interval = window.setInterval(() => setActiveView((view) => (view + 1) % 3), 4800);
    return () => window.clearInterval(interval);
  }, [isVisible, manualOverride, paused, reduceMotion]);

  const move = (direction: -1 | 1) => {
    setManualOverride(true);
    setActiveView((view) => (view + direction + 3) % 3);
  };

  const handleKeyboard = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  };

  return (
    <figure
      className="reviews-proof"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
      onFocusCapture={() => setPaused(true)}
      onKeyDown={handleKeyboard}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      ref={frameRef}
    >
      <div className="reviews-proof-window">
        <img
          alt="Public SkyPups installation showing published review cards"
          className="reviews-proof-image"
          decoding="async"
          height="620"
          loading="lazy"
          src={reviewsProof}
          style={{ "--review-position": activeView } as React.CSSProperties}
          width="1360"
        />
      </div>
      <div className="reviews-proof-controls" aria-label="Review sequence controls">
        <button aria-label="Show previous review cards" onClick={() => move(-1)} type="button">
          <span aria-hidden="true">←</span>
        </button>
        <span aria-live="polite" className="reviews-proof-status">View {activeView + 1} of 3</span>
        <button aria-label="Show next review cards" onClick={() => move(1)} type="button">
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </figure>
  );
}

function ProductVisual({ product, reduceMotion }: { product: Product; reduceMotion: boolean }) {
  if (product.slug === "etchr") {
    return <PairProof className="product-pair-proof" />;
  }

  if (product.slug === "reviews-engine") {
    return <ReviewsProof reduceMotion={reduceMotion} />;
  }

  if (product.slug === "property-insights") {
    return (
      <figure className="product-proof-figure property-proof">
        <img
          alt="Synthetic Property Insights recommendation card showing a starting point, labor estimate, crew, complexity, confidence, and risk"
          decoding="async"
          height="310"
          loading="lazy"
          src={propertyRecommendation}
          width="932"
        />
        <figcaption>Synthetic product fixture</figcaption>
      </figure>
    );
  }

  return (
    <figure className="product-proof-figure signal-proof">
      <img
        alt="Authentic 2019 Signal interface showing seasonal and correlation analytics"
        decoding="async"
        height="1046"
        loading="lazy"
        src={signalInterface}
        width="2167"
      />
      <figcaption>Archival product screen · 2019</figcaption>
    </figure>
  );
}

function ProductSection({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="fleet-section" id="work">
      <div className="section-shell fleet-section-intro">
        <div className="section-header">
          <Eyebrow>Our Work</Eyebrow>
          <h2>We build the products we keep looking for.</h2>
          <p>Each began with a missing tool, workflow, or experience that deserved to exist.</p>
        </div>
      </div>

      <div className="fleet-launch-list">
        {products.map((product, index) => (
          <article className="fleet-launch" data-product={product.slug} id={product.slug} key={product.slug}>
            <div className={`fleet-launch-shell ${index === 0 ? "is-lead" : ""} ${index % 2 === 1 ? "is-reversed" : ""}`}>
              <div className="fleet-launch-copy">
                <div className="fleet-launch-meta">
                  <span className="eyebrow-pill">{product.status}</span>
                </div>
                <p className="fleet-showcase-name">{product.name}</p>
                <h3>
                  {product.headline.split("\n").map((line, lineIndex) => (
                    <span key={line}>
                      {lineIndex ? <><br />{" "}</> : null}
                      {line}
                    </span>
                  ))}
                </h3>
                <p className="fleet-showcase-body">{product.description}</p>
                {product.note ? <p className="fleet-showcase-why">{product.note}</p> : null}
                {product.link ? (
                  <div className="fleet-launch-actions">
                    <a className="text-link fleet-showcase-link" href={product.link.href} rel="noreferrer" target="_blank">
                      {product.link.label} <span aria-hidden="true">↗</span>
                    </a>
                    {product.slug === "etchr" ? (
                      <a className="text-link fleet-showcase-link" href={ETCHR_URL} rel="noreferrer" target="_blank">
                        Visit Etchr <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="fleet-launch-stage">
                <div className="fleet-showcase-media-shell">
                  <div className="fleet-showcase-media media-frame">
                    <ProductVisual product={product} reduceMotion={reduceMotion} />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="process-section" id="process">
      <div className="section-shell process-shell">
        <div className="section-header process-header">
          <Eyebrow>How We Build</Eyebrow>
          <h2>Clear direction. Visible execution. Deliberate review.</h2>
          <p>We use AI to compress the path from a strong brief to working software without removing founder judgment or release gates.</p>
        </div>

        <div className="process-grid">
          {buildSteps.map((item) => (
            <article className="process-card" key={item.step}>
              <span className="process-step-index">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="studio-section" id="about">
      <div className="section-shell studio-shell">
        <div className="studio-quote">
          <Eyebrow>About</Eyebrow>
          <div className="studio-thesis-lockup">
            <h2>1118 is an AI-first product studio founded by Steve Hole in New York.</h2>
            <p className="studio-manifesto-secondary">We build things that deserve to exist.</p>
            <p className="studio-manifesto-support">
              It creates and operates original software—from public consumer products to specialized systems built around hard-won expertise. Most of what we build is our own. We partner selectively when the idea, problem, and fit are unusually strong.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const [pitchStatus, setPitchStatus] = useState<"idle" | "unwired">("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPitchStatus("unwired");
  };

  return (
    <section className="contact-section" id="contact">
      <div className="section-shell contact-shell">
        <div className="contact-copy">
          <Eyebrow>Contact</Eyebrow>
          <h2>Start a conversation.</h2>
          <p>Most of what we build is our own.</p>
          <p>We partner selectively—when the idea is strong, the problem is meaningful, and the fit is right.</p>
          <a className="contact-email" href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
        </div>

        <form className="pitch-form" onChange={() => setPitchStatus("idle")} onSubmit={handleSubmit}>
          <p className="form-instructions">All fields are required. This Preview does not transmit form entries.</p>
          <div className="pitch-form-grid">
            <label className="field">
              <span>Name</span>
              <input autoComplete="name" name="name" required type="text" />
            </label>
            <label className="field">
              <span>Email</span>
              <input autoComplete="email" name="email" required type="email" />
            </label>
            <label className="field field-full">
              <span>Stage</span>
              <select defaultValue="" name="stage" required>
                <option disabled value="">Select stage</option>
                <option value="idea">Idea</option>
                <option value="prototype">Prototype</option>
                <option value="launching">Launching</option>
                <option value="scaling">Scaling</option>
              </select>
            </label>
            <label className="field field-full">
              <span>What are you building?</span>
              <textarea
                name="idea"
                placeholder="Tell us what you are building, what exists today, and why the problem matters."
                required
              />
            </label>
          </div>

          <div className="pitch-form-actions">
            <button className="primary-button" type="submit">Start the conversation</button>
            {pitchStatus === "unwired" ? (
              <p className="pitch-form-status" id="form-status" role="status">
                This Preview does not send form entries. Email <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a> instead.
              </p>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}

function PolicyLayout({ children, eyebrow, title }: { children: ReactNode; eyebrow: string; title: string }) {
  return (
    <article className="policy-page">
      <div className="policy-page-shell">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p className="policy-reviewed">Last reviewed August 1, 2026</p>
        <div className="policy-content">{children}</div>
      </div>
    </article>
  );
}

function PolicyPage({ pathname }: { pathname: string }) {
  if (pathname === "/privacy") {
    return (
      <PolicyLayout eyebrow="Policy" title="Privacy">
        <section><h2>What this site collects</h2><p>1118 does not intentionally use advertising cookies or analytics on this website. Our hosting provider may process standard request information—such as IP address, browser details, requested URL, and time of access—to deliver and protect the site.</p></section>
        <section><h2>Contact and forms</h2><p>The form displayed on this Preview is fail-closed: entries are not transmitted or stored. If you email {COMPANY_EMAIL}, your message is handled by the email services used by 1118 and retained as needed to respond and maintain business records.</p></section>
        <section><h2>External services</h2><p>Links to Etchr, the App Store, and other websites are governed by those services’ own privacy practices.</p></section>
        <section><h2>Your questions</h2><p>To ask about privacy or request access, correction, or deletion of information you sent directly to 1118, email <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.</p></section>
      </PolicyLayout>
    );
  }

  if (pathname === "/terms") {
    return (
      <PolicyLayout eyebrow="Policy" title="Terms">
        <section><h2>Using this site</h2><p>This website provides information about 1118, its products, and selected historical work. You may use it for lawful, personal, and business-information purposes.</p></section>
        <section><h2>Product information</h2><p>Product descriptions and availability may change. Historical work is presented for context and does not promise current availability, trading performance, or future results.</p></section>
        <section><h2>Ownership</h2><p>Unless otherwise stated, the site design, writing, and original media are owned by 1118, LLC or used with permission. Third-party names and marks remain the property of their respective owners.</p></section>
        <section><h2>Disclaimers</h2><p>The site is provided as available without warranties to the extent permitted by law. 1118, LLC is not liable for indirect or consequential losses arising from use of this informational site.</p></section>
        <section><h2>Contact</h2><p>Questions about these terms may be sent to <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.</p></section>
      </PolicyLayout>
    );
  }

  if (pathname === "/accessibility") {
    return (
      <PolicyLayout eyebrow="Trust" title="Accessibility">
        <section><h2>Our target</h2><p>1118 aims for this website to conform with the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.</p></section>
        <section><h2>What we support</h2><p>The site is designed with semantic landmarks, keyboard access, visible focus, reduced-motion support, meaningful image alternatives, responsive reflow, and labeled form controls.</p></section>
        <section><h2>Report a barrier</h2><p>If something prevents you from using this site, email <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a> with the page, the problem, and any assistive technology or browser details you choose to share.</p></section>
        <section><h2>Remediation</h2><p>We will review reported barriers, provide a reasonable alternative when possible, and prioritize remediation based on impact.</p></section>
      </PolicyLayout>
    );
  }

  if (pathname === "/support") {
    return (
      <PolicyLayout eyebrow="Help" title="Support">
        <section><h2>1118 inquiries</h2><p>For company, partnership, press, or website questions, email <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.</p></section>
        <section><h2>Etchr</h2><p>For Etchr product information and current support options, visit <a href={ETCHR_URL} rel="noreferrer" target="_blank">etchr.ai</a> or the verified <a href={APP_STORE_URL} rel="noreferrer" target="_blank">App Store listing</a>.</p></section>
        <section><h2>Other products</h2><p>Reviews Engine and Property Insights are in development. They do not currently offer public company-site support channels.</p></section>
      </PolicyLayout>
    );
  }

  return (
    <PolicyLayout eyebrow="Trust" title="Security">
      <section><h2>Report a concern</h2><p>Email <a href={`mailto:${COMPANY_EMAIL}?subject=Security%20report`}>{COMPANY_EMAIL}</a> with “Security report” in the subject. Include the affected URL or product and enough detail to reproduce the issue; do not include secrets or sensitive personal information unless requested through a secure channel.</p></section>
      <section><h2>Scope</h2><p>This page is a reporting channel, not a bug-bounty program, safe-harbor promise, certification, service-level agreement, or guarantee that a system is free of vulnerabilities.</p></section>
      <section><h2>Responsible handling</h2><p>Please avoid privacy violations, data destruction, service disruption, and access beyond what is necessary to describe the concern.</p></section>
    </PolicyLayout>
  );
}

function NotFoundPage() {
  return (
    <PolicyLayout eyebrow="404" title="That page is not here.">
      <p>Return to the <a href="/">1118 homepage</a> or email <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>.</p>
    </PolicyLayout>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-shell">
        <div className="site-footer-copy">
          <BrandLockup compact />
          <p>AI-first product studio.</p>
          <p className="footer-legal">© 2026 1118, LLC · New York</p>
        </div>

        <div className="site-footer-links">
          <div className="footer-link-group">
            <strong>Products</strong>
            <nav aria-label="Product links">
              <a href={`/#etchr`}>Etchr</a>
              <a href="/#reviews-engine">Reviews Engine</a>
              <a href="/#property-insights">Property Insights</a>
              <a href="/#signal">Signal</a>
            </nav>
          </div>
          <div className="footer-link-group">
            <strong>Company</strong>
            <nav aria-label="Company links">
              <a href="/#about">About</a>
              <a href="/#process">How We Build</a>
              <a href="/#contact">Contact</a>
              <a href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
            </nav>
          </div>
          <div className="footer-link-group">
            <strong>Policy</strong>
            <nav aria-label="Policy links">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
              <a href="/accessibility">Accessibility</a>
              <a href="/support">Support</a>
              <a href="/security">Security</a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}

function updateMetadata(pathname: string) {
  const meta = policyMeta[pathname] ?? { title: "Page not found | 1118", description: "The requested page was not found." };
  document.title = meta.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", meta.description);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute("content", meta.title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute("content", meta.description);
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  canonical?.setAttribute("href", `https://1118.io${pathname === "/" ? "" : pathname}`);
}

export default function App() {
  const [pathname, setPathname] = useState(window.location.pathname.replace(/\/$/, "") || "/");
  const [activeHash, setActiveHash] = useState(window.location.hash.slice(1));
  const reduceMotion = Boolean(useReducedMotion());
  const isPublicPolicy = Object.hasOwn(policyMeta, pathname) && pathname !== "/";

  useEffect(() => {
    const onLocationChange = () => {
      setPathname(window.location.pathname.replace(/\/$/, "") || "/");
      setActiveHash(window.location.hash.slice(1));
    };
    window.addEventListener("hashchange", onLocationChange);
    window.addEventListener("popstate", onLocationChange);
    return () => {
      window.removeEventListener("hashchange", onLocationChange);
      window.removeEventListener("popstate", onLocationChange);
    };
  }, []);

  useEffect(() => {
    updateMetadata(pathname);
    if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useEffect(() => {
    if (!activeHash) return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(activeHash)?.scrollIntoView({ block: "start", behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeHash, pathname]);

  const mainContent = useMemo(() => {
    if (pathname === "/") {
      return (
        <>
          <Hero reduceMotion={reduceMotion} />
          <ProductSection reduceMotion={reduceMotion} />
          <ProcessSection />
          <AboutSection />
          <ContactSection />
        </>
      );
    }
    if (isPublicPolicy) return <PolicyPage pathname={pathname} />;
    return <NotFoundPage />;
  }, [isPublicPolicy, pathname, reduceMotion]);

  return (
    <div className="page-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <FloatingNav activeHash={activeHash} pathname={pathname} />
      <main id="main-content">{mainContent}</main>
      <Footer />
    </div>
  );
}
