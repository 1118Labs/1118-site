import { motion, useReducedMotion } from "framer-motion";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./App.css";
import brandMark from "./assets/brand/1118-mark-blue.png";
import appStoreBadge from "./assets/showcase/etchr/download-on-the-app-store.svg";
import etchrAppIcon from "./assets/showcase/etchr/etchr-app-icon-512.png";
import etchrExport from "./assets/showcase/etchr/export-avery.webp";
import etchrResult from "./assets/showcase/etchr/hero-result-1118.png";
import etchrSource from "./assets/showcase/etchr/hero-source-1118.png";
import etchrPortrait from "./assets/showcase/etchr/portrait-elise.webp";
import propertyDecision from "./assets/showcase/property-insights/operator-decision-current-head.jpg";
import propertyDecisionMobile from "./assets/showcase/property-insights/operator-decision-current-head-mobile.jpg";
import propertyFacts from "./assets/showcase/property-insights/property-facts-current-head.jpg";
import propertyFactsMobile from "./assets/showcase/property-insights/property-facts-current-head-mobile.jpg";
import bearChelsea from "./assets/showcase/reviews-engine/cards/bear-chelsea.jpg";
import juniperLuis from "./assets/showcase/reviews-engine/cards/juniper-luis.jpg";
import mochiErin from "./assets/showcase/reviews-engine/cards/mochi-erin.jpg";
import scoutPriya from "./assets/showcase/reviews-engine/cards/scout-priya.jpg";
import signalInterface from "./assets/showcase/signal/signal-archival-interface.png";

const APP_STORE_URL = "https://apps.apple.com/us/app/etchr-portraits/id6785615752";
const ETCHR_URL = "https://etchr.ai";
const REVIEWS_ENGINE_PUBLIC_PROOF_URL = "https://www.skypupstreats.com/reviews";
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
    status: "LIVE",
    headline: "Editorial portraits\nfrom real photographs.",
    description: "One clear photograph becomes a finished editorial portrait pack.",
    link: { href: APP_STORE_URL, label: "View on the App Store" },
  },
  {
    slug: "reviews-engine",
    name: "Reviews Engine",
    status: "LIVE",
    headline: "Collect, moderate,\nand publish customer reviews.",
    description: "A live system for keeping customer proof current across client sites.",
    link: { href: REVIEWS_ENGINE_PUBLIC_PROOF_URL, label: "See Reviews Engine in use" },
    note: "Live product shown with demonstration reviews.",
  },
  {
    slug: "property-insights",
    name: "Property Insights",
    status: "IN DEVELOPMENT",
    headline: "Turn service requests\ninto quote-ready property intelligence.",
    description: "An incoming service request, property context, risk, and a recommendation assembled before the estimate begins.",
  },
  {
    slug: "signal",
    name: "Signal",
    status: "BUILT · LICENSED · ACQUIRED",
    headline: "Quantitative intelligence\nfor commodities trading.",
    description:
      "1118 co-founded, designed, built, and launched Signal—an enterprise commodities analytics platform used in live markets, licensed by a major trading firm, and later acquired.",
    note: "Authentic product screen · 2019",
  },
];

const skyPupsReviews = [
  {
    id: "skypups-1",
    image: mochiErin,
    imagePosition: "50% 30%",
    name: "Mochi & Erin",
    location: "Austin, TX",
    paws: 5,
    quote:
      "SkyPups made our shy rescue pup feel like the guest of honor. The staff sent polished updates, the yard was spotless, and Mochi came home calm, tired, and grinning.",
  },
  {
    id: "skypups-2",
    image: juniperLuis,
    imagePosition: "50% 42%",
    name: "Juniper & Luis",
    location: "Nashville, TN",
    paws: 5,
    quote:
      "We booked one stay and never looked back. Juniper sprinted through the doors on visit two. Around here, pups do not leave star reviews — they leave elite paw reviews.",
  },
  {
    id: "skypups-3",
    image: scoutPriya,
    imagePosition: "50% 36%",
    name: "Scout & Priya",
    location: "Denver, CO",
    paws: 5,
    quote:
      "Scout came home brushed, calm, and clearly cared for. The team handled pickup, playtime, and the final freshen-up with the kind of consistency that makes you trust them fast.",
  },
  {
    id: "skypups-4",
    image: bearChelsea,
    imagePosition: "50% 32%",
    name: "Bear & Chelsea",
    location: "Seattle, WA",
    paws: 4,
    quote:
      "You can feel the standard the minute you walk in. Bear had a full play day, a warm bath, and a handwritten note waiting when I picked him up.",
  },
] as const;

const reviewCarouselItems = [...skyPupsReviews, ...skyPupsReviews.slice(0, 3)];

const buildSteps = [
  {
    step: "01",
    title: "Direction",
    body: "Product priorities, standards, and final decisions remain with 1118.",
  },
  {
    step: "02",
    title: "Execution",
    body: "AI accelerates research, design, and production while 1118 owns the product decisions.",
  },
  {
    step: "03",
    title: "Review",
    body: "Evidence is checked, releases are gated, and responsibility remains with us.",
  },
] as const;

function capturePointer(node: HTMLElement, pointerId: number) {
  try {
    node.setPointerCapture(pointerId);
    return true;
  } catch {
    return false;
  }
}

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

type EtchrDragState = {
  active: boolean;
  pointerId: number;
  pointerType: string;
  startX: number;
  startY: number;
};

function EtchrComparison({
  className = "",
  interactive = true,
  priority = false,
}: {
  className?: string;
  interactive?: boolean;
  priority?: boolean;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<EtchrDragState | null>(null);
  const [position, setPosition] = useState(50);

  const updateFromClientX = (clientX: number) => {
    const bounds = frameRef.current?.getBoundingClientRect();
    if (!bounds?.width) return;
    const nextPosition = ((clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.min(100, Math.max(0, nextPosition)));
  };

  const releasePointer = () => {
    const state = dragRef.current;
    const node = frameRef.current;
    if (state && node?.hasPointerCapture(state.pointerId)) node.releasePointerCapture(state.pointerId);
    dragRef.current = null;
  };

  useEffect(() => {
    if (!interactive) return;
    const stopOnBlur = () => releasePointer();
    window.addEventListener("blur", stopOnBlur);
    return () => {
      window.removeEventListener("blur", stopOnBlur);
      releasePointer();
    };
  }, [interactive]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactive || (event.pointerType === "mouse" && event.button !== 0)) return;
    const active = event.pointerType !== "touch";
    dragRef.current = {
      active,
      pointerId: event.pointerId,
      pointerType: event.pointerType,
      startX: event.clientX,
      startY: event.clientY,
    };
    if (active) {
      capturePointer(event.currentTarget, event.pointerId);
      updateFromClientX(event.clientX);
      event.preventDefault();
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragRef.current;
    if (!interactive || !state || state.pointerId !== event.pointerId) return;

    if (!state.active && state.pointerType === "touch") {
      const deltaX = event.clientX - state.startX;
      const deltaY = event.clientY - state.startY;
      if (Math.max(Math.abs(deltaX), Math.abs(deltaY)) < 8) return;
      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        dragRef.current = null;
        return;
      }
      state.active = true;
      capturePointer(event.currentTarget, event.pointerId);
    }

    if (!state.active) return;
    event.preventDefault();
    updateFromClientX(event.clientX);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = dragRef.current;
    if (!interactive || !state || state.pointerId !== event.pointerId) return;
    if (!state.active && state.pointerType === "touch") updateFromClientX(event.clientX);
    releasePointer();
  };

  const handleKeyboard = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const increment = event.shiftKey ? 10 : 2;
    if (event.key === "ArrowLeft") setPosition((value) => Math.max(0, value - increment));
    else if (event.key === "ArrowRight") setPosition((value) => Math.min(100, value + increment));
    else if (event.key === "Home") setPosition(0);
    else if (event.key === "End") setPosition(100);
    else return;
    event.preventDefault();
  };

  const roundedPosition = Math.round(position);

  return (
    <div
      className={`etchr-comparison hero-media-slot-frame is-ready ${interactive ? "is-interactive" : "is-static"} ${className}`}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      ref={frameRef}
      style={{ "--etchr-position": `${position}%` } as React.CSSProperties}
    >
      <img
        alt="Original photograph used for an Etchr portrait"
        className="etchr-comparison-image etchr-comparison-original"
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        height="1024"
        loading={priority ? "eager" : "lazy"}
        src={etchrSource}
        width="768"
      />
      <div aria-hidden="true" className="etchr-comparison-result">
        <img
          alt=""
          className="etchr-comparison-image"
          decoding={priority ? "sync" : "async"}
          fetchPriority={priority ? "high" : "auto"}
          height="1024"
          loading={priority ? "eager" : "lazy"}
          src={etchrResult}
          width="768"
        />
      </div>
      <div aria-hidden="true" className="etchr-comparison-labels">
        <span>Finished portrait</span>
        <span>Original photo</span>
      </div>
      <div aria-hidden={!interactive} className="etchr-comparison-divider">
        <div
          aria-label="Etchr portrait comparison"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={roundedPosition}
          aria-valuetext={`${roundedPosition}% Etchr, ${100 - roundedPosition}% Original`}
          className="etchr-comparison-handle"
          onBlur={releasePointer}
          onKeyDown={handleKeyboard}
          role={interactive ? "slider" : undefined}
          tabIndex={interactive ? 0 : -1}
        >
          <span aria-hidden="true"><i /> <i /></span>
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
          Start a conversation <span aria-hidden="true">→</span>
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
          <Eyebrow>1118 is an AI-first product studio.</Eyebrow>
          <h1>We build the software we keep looking for.</h1>
          <p className="hero-copy-body">1118 designs, builds, launches, and operates original software.</p>
          <p className="hero-copy-secondary">Most of what we build is our own.</p>

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
          <div className="hero-visual-card">
            <div className="hero-visual-media media-frame">
              <EtchrComparison className="hero-media-slot" priority />
            </div>
            <a aria-label="See Etchr, a live product built by 1118" className="hero-product-label" href="#etchr">
              Etchr <span aria-hidden="true">·</span> Built by 1118
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ReviewsProof({ reduceMotion }: { reduceMotion: boolean }) {
  const frameRef = useRef<HTMLElement>(null);
  const swipeRef = useRef<{ active: boolean; pointerId: number; startX: number; startY: number } | null>(null);
  const [activeView, setActiveView] = useState(0);
  const [focusPaused, setFocusPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pageHidden, setPageHidden] = useState(document.hidden);
  const [userPaused, setUserPaused] = useState(false);
  const [userAnnouncement, setUserAnnouncement] = useState("");

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (reduceMotion || !isVisible || focusPaused || hoverPaused || pageHidden || userPaused) return;
    const interval = window.setInterval(
      () => setActiveView((view) => (view + 1) % skyPupsReviews.length),
      5200,
    );
    return () => window.clearInterval(interval);
  }, [focusPaused, hoverPaused, isVisible, pageHidden, reduceMotion, userPaused]);

  const selectReview = (nextView: number) => {
    const wrappedView = (nextView + skyPupsReviews.length) % skyPupsReviews.length;
    setUserPaused(true);
    setActiveView(wrappedView);
    setUserAnnouncement(`Review ${wrappedView + 1} of ${skyPupsReviews.length}: ${skyPupsReviews[wrappedView].name}`);
  };

  const move = (direction: -1 | 1) => {
    selectReview(activeView + direction);
  };

  const handleKeyboard = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowLeft") move(-1);
    else if (event.key === "ArrowRight") move(1);
    else if (event.key === "Home") selectReview(0);
    else if (event.key === "End") selectReview(skyPupsReviews.length - 1);
    else return;
    event.preventDefault();
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "touch") return;
    swipeRef.current = {
      active: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const swipe = swipeRef.current;
    if (!swipe || swipe.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - swipe.startX;
    const deltaY = event.clientY - swipe.startY;
    if (!swipe.active && Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 8) {
      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        swipeRef.current = null;
        return;
      }
      swipe.active = true;
      capturePointer(event.currentTarget, event.pointerId);
    }
    if (swipe.active) event.preventDefault();
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const swipe = swipeRef.current;
    if (!swipe || swipe.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - swipe.startX;
    if (swipe.active && Math.abs(deltaX) >= 42) move(deltaX < 0 ? 1 : -1);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    swipeRef.current = null;
  };

  return (
    <figure
      aria-label="Reviews Engine demonstration review carousel"
      aria-roledescription="carousel"
      className="reviews-proof"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false);
      }}
      onFocusCapture={() => setFocusPaused(true)}
      onKeyDown={handleKeyboard}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      ref={frameRef}
      role="region"
    >
      <div
        className="reviews-proof-window"
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        tabIndex={0}
      >
        <ul
          className="reviews-proof-track"
          style={{ "--review-position": activeView } as React.CSSProperties}
        >
          {reviewCarouselItems.map((review, index) => {
            const duplicate = index >= skyPupsReviews.length;
            return (
            <li
              aria-hidden={duplicate || undefined}
              aria-label={duplicate ? undefined : `Review ${index + 1} of ${skyPupsReviews.length}`}
              className={`review-fixture-card ${index === activeView ? "is-primary" : ""} ${duplicate ? "is-duplicate" : ""}`}
              key={`${review.id}-${index}`}
            >
              <img
                alt={`${review.name} demonstration review`}
                decoding="async"
                height="720"
                loading="lazy"
                src={review.image}
                style={{ objectPosition: review.imagePosition }}
                width="900"
              />
              <div className="review-fixture-copy">
                <p aria-label={`${review.paws} out of 5 paws`} className="review-paw-rating" role="img">
                  <span aria-hidden="true" className="review-stars">
                    {"★".repeat(review.paws)}{"☆".repeat(5 - review.paws)}
                  </span>
                  <span aria-hidden="true"> {review.paws}.0 PAWS</span>
                </p>
                <blockquote>“{review.quote}”</blockquote>
                <footer>
                  <strong>{review.name}</strong>
                  <span>{review.location}</span>
                </footer>
              </div>
            </li>
            );
          })}
        </ul>
      </div>
      <div className="reviews-proof-controls" aria-label="Review sequence controls">
        <button aria-label="Show previous review" onClick={() => move(-1)} type="button">
          <span aria-hidden="true">←</span>
        </button>
        {reduceMotion ? (
          <span className="reviews-proof-status">Review {activeView + 1} of {skyPupsReviews.length}</span>
        ) : (
          <button
            aria-label={userPaused ? "Resume reviews" : "Pause reviews"}
            className="reviews-proof-pause"
            onClick={(event) => {
              setUserPaused((value) => !value);
              event.currentTarget.blur();
            }}
            type="button"
          >
            {userPaused ? "Resume" : "Pause"} · {activeView + 1}/{skyPupsReviews.length}
          </button>
        )}
        <button aria-label="Show next review" onClick={() => move(1)} type="button">
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <span aria-live="polite" className="visually-hidden">{userAnnouncement}</span>
    </figure>
  );
}

function ProductVisual({ product, reduceMotion }: { product: Product; reduceMotion: boolean }) {
  if (product.slug === "etchr") {
    return (
      <figure className="etchr-product-proof">
        <div className="etchr-product-portrait">
          <img
            alt="Elise shown as an Etchr editorial portrait"
            decoding="async"
            height="1024"
            loading="lazy"
            src={etchrPortrait}
            width="1024"
          />
          <span>Etchr portrait</span>
        </div>
        <div className="etchr-export-proof">
          <img
            alt="Avery shown as an Etchr profile-ready export"
            decoding="async"
            height="1024"
            loading="lazy"
            src={etchrExport}
            width="1024"
          />
          <span>Profile-ready export</span>
        </div>
      </figure>
    );
  }

  if (product.slug === "reviews-engine") {
    return <ReviewsProof reduceMotion={reduceMotion} />;
  }

  if (product.slug === "property-insights") {
    return (
      <figure
        aria-label="Authentic Property Insights interface showing an incoming request, property facts, risk, recommendation, quote readiness, and next action"
        className="product-proof-figure property-proof"
      >
        <div className="property-proof-overview">
          <picture>
            <source media="(max-width: 760px)" srcSet={propertyDecisionMobile} />
            <img
              alt="Property Insights local demo request with a quote-ready $281 recommendation, draft-quote action, labor plan, risk, and high confidence"
              decoding="async"
              height="700"
              loading="lazy"
              src={propertyDecision}
              width="1024"
            />
          </picture>
        </div>
        <div className="property-proof-detail">
          <picture>
            <source media="(max-width: 760px)" srcSet={propertyFactsMobile} />
            <img
              alt="Property Insights local demo property facts for a Southold single-family home"
              decoding="async"
              height="600"
              loading="lazy"
              src={propertyFacts}
              width="1024"
            />
          </picture>
          <span aria-hidden="true">Property facts</span>
        </div>
        <figcaption>Authentic product interface <span aria-hidden="true">· Demonstration data</span></figcaption>
      </figure>
    );
  }

  return (
    <figure className="product-proof-figure signal-proof">
      <div className="signal-display-stage">
        <div className="signal-display-screen">
          <img
            alt="Authentic 2019 Signal interface showing seasonal and correlation analytics"
            decoding="async"
            height="1046"
            loading="lazy"
            src={signalInterface}
            width="2167"
          />
        </div>
      </div>
    </figure>
  );
}

function ProductSection({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <section className="fleet-section" id="work">
      <div className="fleet-launch-list">
        {products.map((product, index) => (
          <article className="fleet-launch" data-product={product.slug} id={product.slug} key={product.slug}>
            <div className={`fleet-launch-shell ${index === 0 ? "is-lead" : ""} ${index % 2 === 1 ? "is-reversed" : ""}`}>
              <div className="fleet-launch-copy">
                <div className="fleet-launch-meta">
                  <span className="eyebrow-pill">{product.status}</span>
                </div>
                {product.slug === "etchr" ? (
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
                    {product.slug === "etchr" ? (
                      <>
                        <a className="app-store-badge-link" href={product.link.href} rel="noreferrer" target="_blank">
                          <img alt="Download Etchr Portraits on the App Store" height="40" src={appStoreBadge} width="120" />
                        </a>
                        <a className="text-link fleet-showcase-link" href={ETCHR_URL} rel="noreferrer" target="_blank">
                          Visit Etchr <span aria-hidden="true">↗</span>
                        </a>
                      </>
                    ) : (
                      <a className="text-link fleet-showcase-link" href={product.link.href} rel="noreferrer" target="_blank">
                        {product.link.label} <span aria-hidden="true">↗</span>
                      </a>
                    )}
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

function AboutSection() {
  return (
    <section className="studio-section" id="about">
      <div className="section-shell studio-shell">
        <div className="studio-intro">
          <Eyebrow>About</Eyebrow>
          <h2>An AI-first<br />product studio.</h2>
          <div className="studio-intro-copy">
            <p>1118 creates and operates original software—from public consumer products to specialized systems built around hard-won expertise.</p>
            <p>The portfolio includes live products, systems in development, and completed software with a commercial history.</p>
          </div>
        </div>

        <div className="operating-model" id="process">
          {buildSteps.map((item) => (
            <article className="operating-principle" key={item.step}>
              <span>{item.title}</span>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <p className="studio-closing">We translate specialized knowledge into products people can actually use.</p>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <div className="section-shell contact-shell">
        <div className="contact-copy">
          <Eyebrow>Contact</Eyebrow>
          <h2>Start a conversation.</h2>
          <p>We partner selectively when the idea, problem, and fit are unusually strong.</p>
          <a className="contact-email" href={`mailto:${COMPANY_EMAIL}`}>{COMPANY_EMAIL}</a>
        </div>

        <div className="contact-direct">
          <Eyebrow>Direct contact</Eyebrow>
          <h3>Tell us what you’re building.</h3>
          <p>Share the problem, what exists today, and why it matters.</p>
          <a className="contact-direct-action" href={`mailto:${COMPANY_EMAIL}`}>Email 1118 <span aria-hidden="true">→</span></a>
        </div>
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
        <section><h2>Contact</h2><p>This website does not currently offer a contact form. If you email {COMPANY_EMAIL}, your message is handled by the email services used by 1118 and retained as needed to respond and maintain business records.</p></section>
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
        <section><h2>Ownership</h2><p>The site design and writing are owned by 1118, LLC unless otherwise stated. Product names, screenshots, photographs, and third-party marks may be owned by their respective rights holders.</p></section>
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
        <section><h2>Other products</h2><p>Reviews Engine is live. Property Insights is in development. They do not currently offer public company-site support channels.</p></section>
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
          <p className="footer-legal">© 2026 1118, LLC</p>
        </div>

        <div className="site-footer-links">
          <div className="footer-link-group">
            <strong>Navigate</strong>
            <nav aria-label="Company links">
              <a href="/#work">Work</a>
              <a href="/#process">How We Build</a>
              <a href="/#about">About</a>
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
