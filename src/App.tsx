import { useReducedMotion } from "framer-motion";
import {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import "./brand.css";
import "./App.css";
import PortraitStory from "./components/PortraitStory";
import ReviewsProof from "./components/ReviewsProof";
import PropertyProof, { PropertyBrand } from "./components/PropertyProof";
import SignalWorkstation from "./components/SignalWorkstation";
import SignalIdentity from "./components/SignalIdentity";
import CaseStudies from "./components/CaseStudies";
import ContactPanel from "./components/ContactPanel";
import { caseMeta } from "./content/case-studies";
import "./premium.css";
import "./prelaunch.css";
import "./typography.css";
import "./lower-page.css";
import "./flagship-system.css";

import portraitIcon from "./assets/responsive/portrait-icon.webp";
import reviewsShield from "./assets/responsive/reviews-shield.webp";
import appStoreBadge from "./assets/showcase/etchr/download-on-the-app-store.svg";
import PortraitComparison from "./components/PortraitComparison";

const APP_STORE_URL = "https://apps.apple.com/us/app/etchr-portraits/id6785615752";
const PORTRAIT_URL = "https://getportrait.ai";
const REVIEWS_ENGINE_PUBLIC_PROOF_URL = "https://www.skypupstreats.com/reviews";


type Product = {
  description: string;
  descriptor?: string;
  headline: string;
  link?: { href: string; label: string };
  name: string;
  note?: string;
  slug: "portrait" | "reviews-engine" | "property-insights" | "signal";
};

const products: Product[] = [
  {
    slug: "portrait",
    name: "Portrait",
    headline: "We made AI portraits\nfeel worthy of print.",
    description: "Most AI-generated portraits still look unmistakably generated. Portrait starts with one real photograph and turns it into a refined editorial portrait designed to look like you—and look good enough to publish.",
    link: { href: APP_STORE_URL, label: "View on the App Store" },
  },
  {
    slug: "reviews-engine",
    name: "Reviews Engine",
    headline: "We turned customer reviews\ninto a trust engine.",
    description: "Businesses work hard to earn great reviews, then leave them scattered across platforms or buried where customers rarely see them. Reviews Engine collects, moderates, and publishes that proof where it can actually build trust.",
    link: { href: REVIEWS_ENGINE_PUBLIC_PROOF_URL, label: "See Reviews Engine in use" },
  },
  {
    slug: "property-insights",
    name: "Property Insights",
    link: { href: "https://insights.1118.io", label: "Explore Property Insights" },
    headline: "We brought property intelligence\ninto the service\u00a0workflow.",
    description: "Service businesses often quote jobs with less context than they should have. Property Insights connects incoming requests to property data, physical context, risks, and recommendations so operators can understand the job before the estimate begins.",
  },
  {
    slug: "signal",
    name: "Signal",
    descriptor: "Quantitative intelligence for commodities trading.",
    headline: "We built a better way\nto uncover commodities trade\u00a0ideas.",
    description:
      "1118 designed and built Signal, combining market data, quantitative analysis, visualization, and machine learning to help surface compelling trade ideas.",
    note: "Signal was used in live markets, licensed commercially, and later acquired.",
  },
];

const buildSteps = [
  { step: "01", title: "SEE THE OPENING", body: "Notice what is missing, broken, or harder than it should be." },
  { step: "02", title: "DEFINE THE PRODUCT", body: "Turn the idea into a clear proposition, experience, and operating model." },
  { step: "03", title: "BUILD IT", body: "Bring design, software, AI, and infrastructure together into a working product." },
  { step: "04", title: "PUT IT INTO THE WORLD", body: "Launch, learn quickly, and keep making the product better." },
] as const;

const policyMeta: Record<string, { description: string; title: string }> = {
  "/": {
    title: "1118 — Original Software & Products",
    description: "1118 creates web platforms, apps, and specialized software—mostly our own. Original products, built from ideas we believe should exist.",
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
  return <span className={`logo ${compact ? "is-compact" : ""}`}><span className="logo-mark" role="img" aria-label="1118" /></span>;
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
          Contact <span aria-hidden="true">↗</span>
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
          <a href={`${homePrefix}#contact`} onClick={() => setMenuOpen(false)}>Contact ↗</a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ reduceMotion }: { reduceMotion: boolean }) {
  return <section className={`hero-section ${reduceMotion ? 'motion-reduced' : ''}`} id="top">
    <div className="hero-shell">
      <div className="hero-copy">
        <span className="hero-blue-rule" aria-hidden="true" />
        <h1>We build the products<br />{" "}we keep looking for.</h1>
        <p className="hero-copy-body">Original products, built from ideas we believe should exist.</p>
        <a className="primary-button" href="#work">See what we build <span aria-hidden="true">→</span></a>
      </div>
      <div className="hero-portrait"><PortraitComparison className="portrait-lead-comparison" priority /></div>
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

      <div className="fleet-launch-list">
        {products.map((product, index) => (
          <article className="fleet-launch" data-product={product.slug} id={product.slug} key={product.slug}>
            <div className={`fleet-launch-shell ${index === 0 ? "is-lead" : ""} ${index % 2 === 1 ? "is-reversed" : ""}`}>
              <div className="fleet-launch-copy" data-reveal="rise">

                {product.slug === "portrait" ? (
                  <div className="etchr-product-lockup">
                    <img src={portraitIcon} width="56" height="56" alt="" loading="lazy" decoding="async" />
                    <p className="fleet-showcase-name">{product.name}</p>
                  </div>
                 ) : product.slug === "reviews-engine" ? (
                  <div className="reviews-product-lockup"><img src={reviewsShield} width="470" height="575" alt="" loading="lazy" decoding="async" fetchPriority="low" /><p className="fleet-showcase-name">Reviews <span>Engine</span></p></div>
                ) : product.slug === "property-insights" ? (
                  <div className="property-product-lockup"><PropertyBrand /></div>
                ) : (
                  <SignalIdentity />
                )}
                <h2>{product.headline.replaceAll("\n", " ")}</h2>
                {product.descriptor ? <div className="fleet-showcase-body"><p>{product.descriptor}</p><p>{product.description}</p></div> : <p className="fleet-showcase-body">{product.description}</p>}
                {product.note ? <p className="fleet-showcase-why">{product.note}</p> : null}
                {product.link ? (
                  <div className="fleet-launch-actions">
                    {product.slug === "portrait" ? (
                      <>
                        <a className="app-store-badge-link" href={product.link.href} rel="noreferrer" target="_blank">
                          <img loading="lazy" fetchPriority="low" alt="Download Portrait on the App Store" height="40" src={appStoreBadge} width="120" />
                        </a>
                        <a className="product-action product-action-primary" href={PORTRAIT_URL} rel="noreferrer" target="_blank">
                          Visit Portrait <span aria-hidden="true">→</span>
                        </a>
                      </>
                    ) : (
                      <a className="product-action product-action-primary" href={product.link.href} rel="noreferrer" target="_blank">
                        {product.link.label} <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </div>
                ) : null}
                {(product.slug === "portrait" || product.slug === "signal") && <a className={`case-study-link product-action ${product.slug === "signal" ? "product-action-primary" : "product-action-secondary"}`} href={`/work/${product.slug}`}>Explore the {product.name} case study <span aria-hidden="true">→</span></a>}
              </div>


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
  return <>
    <section className="studio-pause" id="about">
      <div className="section-shell studio-pause-shell">
        <h2>Most of what we build<br />is our own.<span>We partner occasionally.</span></h2>
        <div className="studio-pause-copy"><p>When the idea is sharp, the problem is real, and we believe the product should exist.</p><p>We create web platforms, apps, and specialized software—mostly our own.</p></div>
      </div>
    </section>
    <section className="process-band" id="process" aria-labelledby="process-title">
      <div className="section-shell">
        <div className="process-intro"><h2 id="process-title">From idea to working product.</h2></div>
        <ol className="process-grid" role="list">{buildSteps.map(item => <li className="process-step" key={item.step}><span className="process-number" aria-hidden="true">{item.step}</span><h3>{item.title}</h3><p>{item.body}</p></li>)}</ol>
      </div>
    </section>
  </>;
}

function ContactSection() {
  return <section className="contact-section" id="contact"><div className="section-shell contact-shell">
    <div className="contact-copy" data-reveal="rise"><h2>Start a conversation.</h2><p>Founders, operators, and teams usually come to us because they’ve found a product gap—something they need that doesn’t quite exist.</p><p>Most of what we build is our own. We partner selectively when the problem is real and we believe the product should exist.</p></div>
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
        <section><h2>Contact</h2><p>When you submit the contact form, the details you provide are processed by our hosting provider and Resend to deliver your inquiry. We use them to respond and maintain relevant business records. Cloudflare Turnstile processes basic device and request information to check for automated abuse before a message is sent. Basic request information is also used to limit repeated submissions. Please do not include sensitive personal information.</p></section>
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
        <section><h2>Other products</h2><p>Property Insights is in early access. They do not currently offer public company-site support channels.</p></section>
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
  canonical?.setAttribute("href", `https://1118.io${pathname}`);
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
