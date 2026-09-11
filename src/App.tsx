import { useReducedMotion } from "framer-motion";
import {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import "./App.css";
import PortraitStory from "./components/PortraitStory";
import ReviewsProof from "./components/ReviewsProof";
import PropertyProof from "./components/PropertyProof";
import SignalWorkstation from "./components/SignalWorkstation";
import CaseStudies from "./components/CaseStudies";
import ContactPanel from "./components/ContactPanel";
import { caseMeta } from "./content/case-studies";
import "./premium.css";

import appStoreBadge from "./assets/showcase/etchr/download-on-the-app-store.svg";
import etchrAppIcon from "./assets/showcase/portrait/portrait-app-icon.png";
import PortraitComparison from "./components/PortraitComparison";

const APP_STORE_URL = "https://apps.apple.com/us/app/etchr-portraits/id6785615752";
const PORTRAIT_URL = "https://getportrait.ai";
const REVIEWS_ENGINE_PUBLIC_PROOF_URL = "https://www.skypupstreats.com/reviews";


type Product = {
  description: string;
  headline: string;
  link?: { href: string; label: string };
  name: string;
  note?: string;
  slug: "portrait" | "reviews-engine" | "property-insights" | "signal";
  status: string;
};

const products: Product[] = [
  {
    slug: "portrait",
    name: "Portrait",
    status: "",
    headline: "One photo.\nA portrait for everywhere.",
    description: "Your photograph, reimagined as an editorial portrait. Made for the profiles, places, and people that know you.",
    link: { href: APP_STORE_URL, label: "View on the App Store" },
  },
  {
    slug: "reviews-engine",
    name: "Reviews Engine",
    status: "LIVE",
    headline: "A great reputation.\nOut in the open.",
    description: "For businesses built on trust. Collect customer stories, review what goes live, and put real experiences where the next customer can see them.",
    link: { href: REVIEWS_ENGINE_PUBLIC_PROOF_URL, label: "See Reviews Engine in use" },
    note: "Reviews from the live SkyPups installation.",
  },
  {
    slug: "property-insights",
    name: "Property Insights",
    status: "EARLY ACCESS",
    link: { href: "https://insights.1118.io", label: "Explore Property Insights" },
    headline: "Know the property.\nWin the job.",
    description: "AI-powered property intelligence for home-service businesses. Arrive prepared, make better-informed estimates, and move from request to quote with a clearer picture of the job.",
  },
  {
    slug: "signal",
    name: "Signal",
    status: "BUILT · LICENSED · ACQUIRED",
    headline: "See the market\ndifferently.",
    description:
      "A quantitative commodities platform for traders working with complex markets. 1118 designed, built, and launched Signal to turn data and machine learning into a clearer view of trading opportunities. Used in live markets, licensed commercially, and later acquired.",
    note: "Authentic product screen · 2019",
  },
];

const buildSteps = [
  {
    step: "01",
    title: "Find the opportunity.",
    body: "Start with a real problem and a point of view about what could be better.",
  },
  {
    step: "02",
    title: "Build the product.",
    body: "Bring product judgment, design, engineering, and AI into the same working process.",
  },
  {
    step: "03",
    title: "Put it to work.",
    body: "Launch, operate, and learn from real use. The work continues after the release.",
  },
] as const;

const policyMeta: Record<string, { description: string; title: string }> = {
  "/": {
    title: "1118 — AI-First Product Studio",
    description: "1118 is an AI-first product studio turning ideas into products people actually use.",
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
  return <span className={`logo ${compact ? "is-compact" : ""}`}>
    <svg className="logo-mark" viewBox="0 0 204 80" aria-hidden="true">
      <path fill="currentColor" d="M4 18 24 4h10v72H20V24L4 34Zm48 0L72 4h10v72H68V24L52 34Zm48 0 20-14h10v72h-14V24l-16 10Z" />
      <path fill="currentColor" fillRule="evenodd" d="M174 2c17 0 27 8 27 21 0 8-4 14-11 17 9 4 14 10 14 18 0 13-12 21-30 21s-30-8-30-21c0-8 5-14 14-18-7-3-11-9-11-17 0-13 10-21 27-21Zm0 12c-8 0-13 4-13 10s5 10 13 10 13-4 13-10-5-10-13-10Zm0 32c-9 0-16 4-16 11s7 11 16 11 16-4 16-11-7-11-16-11Z" />
    </svg><span className="visually-hidden">1118</span>
  </span>;
}

function FloatingNav({ activeHash, pathname }: { activeHash: string; pathname: string }) {
  const [isCompressed, setIsCompressed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const homePrefix = pathname === "/" ? "" : "/";
  const links = [
    { label: "Work", href: "/work", key: "work" },
    { label: "Studio", href: `${homePrefix}#about`, key: "about" },
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
      const current = focusable.indexOf(document.activeElement as HTMLElement);
      const next = (current + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
      event.preventDefault();
      focusable[next].focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className={`floating-nav-shell ${isCompressed ? "is-compressed" : ""}`}>
      <div className={`floating-nav ${isCompressed ? "is-compressed" : ""}`}>
        <a className="brand-link" href={pathname === "/" ? "#top" : "/"} aria-label="1118 home">
          <BrandLockup /><span className="brand-descriptor">Independent<br />product studio</span>
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
          Work with us <span aria-hidden="true">↗</span>
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
          <a href={`${homePrefix}#contact`} onClick={() => setMenuOpen(false)}>Work with us ↗</a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ reduceMotion }: { reduceMotion: boolean }) {
  return <section className={`hero-section ${reduceMotion ? 'motion-reduced' : ''}`} id="top">
    <div className="hero-shell">
      <div className="hero-topline"><Eyebrow>1118 / AI-first product studio</Eyebrow><span className="hero-signal" aria-hidden="true"><i />Ideas into the world</span></div>
      <div className="hero-copy">
        <h1><span className="hero-line"><span>We build companies</span></span><span className="hero-line"><span>and products with <em>AI.</em></span></span></h1>
        <div className="hero-baseline">
          <p className="hero-copy-body">1118 is an AI-first product studio.<br />We build, launch, and operate products we believe should exist.</p>
          <div className="hero-actions"><a className="primary-button" href="#work">Explore our work <span aria-hidden="true">↓</span></a><a className="hero-secondary-link" href="#contact">Work with us <span aria-hidden="true">↗</span></a></div>
        </div>
      </div>
      <div className="hero-bottom"><span>Built with conviction. Made for real use.</span><a href="#work" aria-label="Scroll to selected products"><span aria-hidden="true">↓</span></a></div>
    </div>
  </section>;
}

function ProductVisual({ product }: { product: Product }) {
  if (product.slug === "portrait") return <PortraitStory />;
  if (product.slug === "reviews-engine") return <ReviewsProof />;
  if (product.slug === "property-insights") return <PropertyProof />;
  return <SignalWorkstation />;
}

function ProductSection() {
  return (
    <section className="fleet-section" id="work">
      <div className="portfolio-heading section-shell"><p>Selected products</p><span>Built. Launched. In the world.</span></div>
      <div className="fleet-launch-list">
        {products.map((product, index) => (
          <article className="fleet-launch" data-product={product.slug} id={product.slug} key={product.slug}>
            <div className={`fleet-launch-shell ${index === 0 ? "is-lead" : ""} ${index % 2 === 1 ? "is-reversed" : ""}`}>
              <div className="fleet-launch-copy" data-reveal="rise">
                <div className="fleet-launch-meta"><span className="product-index">0{index + 1}</span>{product.status && <span className="eyebrow-pill">{product.status}</span>}</div>
                {product.slug === "portrait" ? (
                  <div className="etchr-product-lockup">
                    <img alt="" height="512" src={etchrAppIcon} width="512" />
                    <p className="fleet-showcase-name">{product.name}</p>
                  </div>
                ) : (
                  <p className="fleet-showcase-name">{product.name}</p>
                )}
                <h2>
                  {product.headline.split("\n").map((line, lineIndex) => (
                    <span key={line}>
                      {lineIndex ? <><br />{" "}</> : null}
                      {line}
                    </span>
                  ))}
                </h2>
                <p className="fleet-showcase-body">{product.description}</p>
                {product.note ? <p className="fleet-showcase-why">{product.note}</p> : null}
                {product.link ? (
                  <div className="fleet-launch-actions">
                    {product.slug === "portrait" ? (
                      <>
                        <a className="app-store-badge-link" href={product.link.href} rel="noreferrer" target="_blank">
                          <img alt="Download Portrait on the App Store" height="40" src={appStoreBadge} width="120" />
                        </a>
                        <a className="text-link fleet-showcase-link" href={PORTRAIT_URL} rel="noreferrer" target="_blank">
                          Visit Portrait <span aria-hidden="true">↗</span>
                        </a>
                      </>
                    ) : (
                      <a className="text-link fleet-showcase-link" href={product.link.href} rel="noreferrer" target="_blank">
                        {product.link.label} <span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                ) : null}
                {(product.slug === "portrait" || product.slug === "signal") && <a className="case-study-link" href={`/work/${product.slug}`}>Explore the {product.name} case study <span aria-hidden="true">→</span></a>}
              </div>

              {product.slug === "portrait" && <div className="portrait-intro-comparison" data-reveal="rise"><PortraitComparison className="portrait-lead-comparison" /><div className="portrait-lead-caption"><span>A photograph. A new perspective.</span><span>Drag to compare ↔</span></div></div>}
              <div className="fleet-launch-stage" data-reveal="rise">
                <div className="fleet-showcase-media-shell">
                  <div className="fleet-showcase-media media-frame">
                    <ProductVisual product={product} />
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

function AboutSection() {
  return (
    <section className="studio-section" id="about">
      <div className="section-shell studio-shell">
        <div className="studio-intro" data-reveal="rise">
          <Eyebrow>The studio</Eyebrow>
          <h2>From conviction<br />to company.</h2>
          <div className="studio-intro-copy"><p>From a personal portrait to a complex trading decision, our products turn a clear point of view into something useful. AI is part of how we build—and, where it belongs, part of the product itself.</p></div>
        </div>
        <div className="operating-model" id="process">
          {buildSteps.map((item) => (
            <article className="operating-principle" key={item.step}>
              <span className="operating-number">{item.step}</span><h3>{item.title}</h3><p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return <section className="contact-section" id="contact"><div className="section-shell contact-shell">
    <div className="contact-copy" data-reveal="rise"><Eyebrow>Work with us</Eyebrow><h2>Have something<br />worth building?</h2><p>We work selectively with founders and companies on ideas that deserve to become products.</p><a className="contact-start" href="#contact-form">Start a conversation <span aria-hidden="true">↘</span></a></div>
    <ContactPanel />
  </div></section>;
}

function PolicyLayout({ children, eyebrow, title }: { children: ReactNode; eyebrow: string; title: string }) {
  return (
    <article className="policy-page">
      <div className="policy-page-shell">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p className="policy-reviewed">Last reviewed September 11, 2026</p>
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
        <section><h2>Contact</h2><p>When you submit the contact form, the details you provide are processed by our hosting provider and Formspree to deliver and store your inquiry. We use them to respond and maintain relevant business records. Basic request information is used to prevent abuse. Please do not include sensitive personal information.</p></section>
        <section><h2>External services</h2><p>Links to Portrait, the App Store, and other websites are governed by those services’ own privacy practices.</p></section>
        <section><h2>Your questions</h2><p>To ask about privacy or request access, correction, or deletion of information you sent directly to 1118, use the <a href="/#contact">contact form</a>.</p></section>
      </PolicyLayout>
    );
  }

  if (pathname === "/terms") {
    return (
      <PolicyLayout eyebrow="Policy" title="Terms">
        <section><h2>Using this site</h2><p>This website provides information about 1118, its products, and selected historical work. You may use it for lawful, personal, and business-information purposes.</p></section>
        <section><h2>Product information</h2><p>Product descriptions and availability may change. Historical work is presented for context and does not promise current availability, trading performance, or future results.</p></section>
        <section><h2>Ownership</h2><p>The site design and writing are owned by 1118, LLC unless otherwise stated. Product names, screenshots, photographs, and third-party marks may be owned by their respective rights holders.</p></section>
        <section><h2>Disclaimers</h2><p>The site is provided as available without warranties to the extent permitted by law. 1118, LLC is not liable for indirect or consequential losses arising from use of this informational site.</p></section>
        <section><h2>Contact</h2><p>Questions about these terms may be sent through our <a href="/#contact">contact form</a>.</p></section>
      </PolicyLayout>
    );
  }

  if (pathname === "/accessibility") {
    return (
      <PolicyLayout eyebrow="Trust" title="Accessibility">
        <section><h2>Our target</h2><p>1118 aims for this website to conform with the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.</p></section>
        <section><h2>What we support</h2><p>The site is designed with semantic landmarks, keyboard access, visible focus, reduced-motion support, meaningful image alternatives, responsive reflow, and labeled form controls.</p></section>
        <section><h2>Report a barrier</h2><p>If something prevents you from using this site, use the <a href="/#contact">contact form</a> with the page, the problem, and any assistive technology or browser details you choose to share.</p></section>
        <section><h2>Remediation</h2><p>We will review reported barriers, provide a reasonable alternative when possible, and prioritize remediation based on impact.</p></section>
      </PolicyLayout>
    );
  }

  if (pathname === "/support") {
    return (
      <PolicyLayout eyebrow="Help" title="Support">
        <section><h2>1118 inquiries</h2><p>For company, partnership, press, or website questions, use the <a href="/#contact">contact form</a>.</p></section>
        <section><h2>Portrait</h2><p>For Portrait product information and current support options, visit <a href={PORTRAIT_URL} rel="noreferrer" target="_blank">getportrait.ai</a> or the verified <a href={APP_STORE_URL} rel="noreferrer" target="_blank">App Store listing</a>.</p></section>
        <section><h2>Other products</h2><p>Reviews Engine is live. Property Insights is in early access. They do not currently offer public company-site support channels.</p></section>
      </PolicyLayout>
    );
  }

  return (
    <PolicyLayout eyebrow="Trust" title="Security">
      <section><h2>Report a concern</h2><p>Use the <a href="/#contact">contact form</a> and begin your message with “Security report.” Include the affected URL or product and enough detail to reproduce the issue; do not include secrets or sensitive personal information unless requested through a secure channel.</p></section>
      <section><h2>Scope</h2><p>This page is a reporting channel, not a bug-bounty program, safe-harbor promise, certification, service-level agreement, or guarantee that a system is free of vulnerabilities.</p></section>
      <section><h2>Responsible handling</h2><p>Please avoid privacy violations, data destruction, service disruption, and access beyond what is necessary to describe the concern.</p></section>
    </PolicyLayout>
  );
}

function NotFoundPage() {
  return (
    <PolicyLayout eyebrow="404" title="That page is not here.">
      <p>Return to the <a href="/">1118 homepage</a> or use the <a href="/#contact">contact form</a>.</p>
    </PolicyLayout>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-top section-shell"><p>New ventures. Selected collaborations.</p><a className="footer-conversation" href="/#contact">Let’s talk <span aria-hidden="true">↗</span></a></div>
      <div className="site-footer-shell">
        <div className="site-footer-copy">
          <BrandLockup compact />
          <p className="footer-legal">© 2026 1118, LLC</p>
        </div>

        <div className="site-footer-links">
          <div className="footer-link-group">
            <strong>Navigate</strong>
            <nav aria-label="Company links">
              <a href="/work">Work</a>
              <a href="/#about">Studio</a>
              <a href="/#contact">Contact</a>
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
  const meta = caseMeta[pathname] ?? policyMeta[pathname] ?? { title: "Page not found | 1118", description: "The requested page was not found." };
  document.title = meta.title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content", meta.description);
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')?.setAttribute("content", meta.title);
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')?.setAttribute("content", meta.description);
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  canonical?.setAttribute("href", `https://1118.io${pathname === "/" ? "" : pathname}`);
}

const subscribeToHydration = () => () => {};

export default function App({ initialPathname = "/" }: { initialPathname?: string }) {
  const [pathname, setPathname] = useState(initialPathname.replace(/\/$/, "") || "/");
  const [activeHash, setActiveHash] = useState("");
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const motionPreference = useReducedMotion();
  const reduceMotion = hydrated && Boolean(motionPreference);
  const isPublicPolicy = Object.hasOwn(policyMeta, pathname) && pathname !== "/";

  useEffect(() => {
    const onLocationChange = () => {
      setPathname(window.location.pathname.replace(/\/$/, "") || "/");
      setActiveHash(window.location.hash.slice(1));
    };
    onLocationChange();
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

  useEffect(() => {
    if (reduceMotion) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('has-entered'); observer.unobserve(entry.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname, reduceMotion]);

  const mainContent = useMemo(() => {
    if (pathname === "/") {
      return (
        <>
          <Hero reduceMotion={reduceMotion} />
          <ProductSection />
          <AboutSection />
          <ContactSection />
        </>
      );
    }
    if (Object.hasOwn(caseMeta, pathname)) return <CaseStudies pathname={pathname} />;
    if (isPublicPolicy) return <PolicyPage pathname={pathname} />;
    return <NotFoundPage />;
  }, [isPublicPolicy, pathname, reduceMotion]);

  return (
    <div className="page-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <FloatingNav activeHash={activeHash} pathname={pathname} />
      <main id="main-content" tabIndex={-1}>{mainContent}</main>
      <Footer />
    </div>
  );
}
