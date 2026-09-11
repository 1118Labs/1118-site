import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { currentSkyPupsReviews as skyPupsReviews } from '../content/reviews';
import './ReviewsProof.css';

// A second full cycle keeps the longest exact review present during every transition.
const reviewCarouselItems = [...skyPupsReviews, ...skyPupsReviews];
function capturePointer(node: HTMLElement, pointerId: number) {
  try { node.setPointerCapture(pointerId); } catch { /* Pointer may have already ended. */ }
}

// Native Reviews Engine PawGlyph: ReviewCard.tsx, verified 2026-09-11.
function NativePaw() {
  return <svg viewBox="0 0 64 64" aria-hidden="true" fill="currentColor" stroke="none">
    <circle cx="18" cy="19" r="6" />
    <circle cx="32" cy="13.5" r="6.4" />
    <circle cx="46" cy="19" r="6" />
    <path d="M31.95 27.25c-10.6 0-19.2 8.02-19.2 16.97 0 5.52 4.28 9.53 10.3 9.53 3.64 0 6.08-1.38 8.9-3.15 2.4 1.56 5.02 3.15 8.84 3.15 6.08 0 10.46-4.01 10.46-9.53 0-8.95-8.63-16.97-19.3-16.97Z" />
  </svg>;
}

const subscribeToHydration = () => () => {};

export default function ReviewsProof() {
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const motionPreference = useReducedMotion();
  const reduceMotion = hydrated && Boolean(motionPreference);
  const frameRef = useRef<HTMLElement>(null);
  const swipeRef = useRef<{ active: boolean; pointerId: number; startX: number; startY: number } | null>(null);
  const [activeView, setActiveView] = useState(0);
  const [focusPaused, setFocusPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
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
    onVisibilityChange();
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
    if (event.type !== "pointercancel" && swipe.active && Math.abs(deltaX) >= 42) move(deltaX < 0 ? 1 : -1);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    swipeRef.current = null;
  };

  return (
    <figure
      aria-label="Reviews Engine customer review carousel"
      aria-roledescription="carousel"
      className="re-proof"
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
        className="re-proof-window"
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        tabIndex={0}
      >
        <ul
          className="re-proof-track"
          style={{ "--re-position": activeView } as React.CSSProperties}
        >
          {reviewCarouselItems.map((review, index) => {
            const duplicate = index >= skyPupsReviews.length;
            return (
            <li
              aria-hidden={duplicate || undefined}
              aria-label={duplicate ? undefined : `Review ${index + 1} of ${skyPupsReviews.length}`}
              className={`re-card-card ${index === activeView ? "is-primary" : ""} ${duplicate ? "is-duplicate" : ""}`}
              key={`${review.id}-${index}`}
            >
              <img
                alt={`${review.name} from the live SkyPups review collection`}
                decoding="async"
                height="1200"
                loading="lazy"
                src={review.image}
                style={{ objectPosition: review.imagePosition }}
                width="900"
              />
              <div className="re-card-copy">
                <p aria-label={`${review.paws} out of 5 paws`} className="re-paw-rating" role="img">
                  <span aria-hidden="true" className="re-paws">
                    {Array.from({ length: review.paws }, (_, paw) => <NativePaw key={paw} />)}
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
      <div className="re-proof-controls" aria-label="Review sequence controls">
        <button aria-label="Show previous review" onClick={() => move(-1)} type="button">
          <span aria-hidden="true">←</span>
        </button>
        {reduceMotion ? (
          <span className="re-proof-status">Review {activeView + 1} of {skyPupsReviews.length}</span>
        ) : (
          <button
            aria-label={userPaused ? "Resume reviews" : "Pause reviews"}
            className="re-proof-pause"
            onClick={() => setUserPaused((value) => !value)}
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
