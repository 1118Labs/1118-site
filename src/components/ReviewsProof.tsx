import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { currentSkyPupsReviews as skyPupsReviews } from '../content/reviews';
import './ReviewsProof.css';

// Three cycles allow the visible sequence to wrap without sweeping backward.
// Every cycle includes the longest quote, so movement cannot change track height.
const reviewCount = skyPupsReviews.length;
const reviewCarouselItems = [...skyPupsReviews, ...skyPupsReviews, ...skyPupsReviews];
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
  const visibilityRef = useRef<HTMLSpanElement>(null);
  const swipeRef = useRef<{ active: boolean; pointerId: number; startX: number; startY: number } | null>(null);
  const [trackPosition, setTrackPosition] = useState<number>(reviewCount);
  const activeView = trackPosition % reviewCount;
  const [isRebasing, setIsRebasing] = useState(false);
  const [autoAdvanceCount, setAutoAdvanceCount] = useState(0);
  const [focusPaused, setFocusPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [pageHidden, setPageHidden] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [userAnnouncement, setUserAnnouncement] = useState("");

  useEffect(() => {
    const node = visibilityRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.15),
      { threshold: [0, 0.15], rootMargin: '-80px 0px 0px 0px' },
    );
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
    if (!hydrated || reduceMotion || !isVisible || focusPaused || hoverPaused || pageHidden || userPaused) return;
    const timeout = window.setTimeout(() => {
      setTrackPosition((position) => position + 1);
      setAutoAdvanceCount((count) => count + 1);
    }, autoAdvanceCount === 0 ? 1800 : 4000);
    return () => window.clearTimeout(timeout);
  }, [autoAdvanceCount, focusPaused, hoverPaused, hydrated, isVisible, pageHidden, reduceMotion, userPaused]);

  useEffect(() => {
    if (!isRebasing) return;
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setIsRebasing(false));
    });
    return () => { cancelAnimationFrame(firstFrame); cancelAnimationFrame(secondFrame); };
  }, [isRebasing]);

  const settleLoop = () => {
    if (trackPosition >= reviewCount && trackPosition < reviewCount * 2) return;
    setIsRebasing(true);
    setTrackPosition(reviewCount + ((trackPosition % reviewCount) + reviewCount) % reviewCount);
  };

  const selectReview = (nextView: number) => {
    const wrappedView = ((nextView % reviewCount) + reviewCount) % reviewCount;
    setUserPaused(true);
    setTrackPosition(reviewCount + wrappedView);
    setUserAnnouncement(`Review ${wrappedView + 1} of ${reviewCount}: ${skyPupsReviews[wrappedView].name}`);
  };

  const move = (direction: -1 | 1) => {
    const wrappedView = (activeView + direction + reviewCount) % reviewCount;
    setUserPaused(true);
    setTrackPosition((position) => {
      const nextPosition = position + direction;
      return reduceMotion || nextPosition < 1 || nextPosition > reviewCount * 3 - 3
        ? reviewCount + wrappedView
        : nextPosition;
    });
    setUserAnnouncement(`Review ${wrappedView + 1} of ${reviewCount}: ${skyPupsReviews[wrappedView].name}`);
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
        <span aria-hidden="true" className="re-proof-visibility" ref={visibilityRef} />
        <ul
          className={`re-proof-track ${isRebasing ? 'is-rebasing' : ''}`}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && event.propertyName === 'transform') settleLoop();
          }}
          style={{ "--re-position": trackPosition } as React.CSSProperties}
        >
          {reviewCarouselItems.map((review, index) => {
            const duplicate = index < reviewCount || index >= reviewCount * 2;
            return (
            <li
              aria-hidden={duplicate || undefined}
              aria-label={duplicate ? undefined : `Review ${index % reviewCount + 1} of ${reviewCount}`}
              className={`re-card-card ${index === trackPosition ? "is-primary" : ""} ${duplicate ? "is-duplicate" : ""}`}
              key={`${review.id}-${index}`}
              onPointerMove={(event) => {
                // Scrolling a card beneath a stationary pointer is not reading intent.
                if (event.pointerType === 'mouse' && (event.movementX || event.movementY)) setHoverPaused(true);
              }}
              onPointerLeave={() => setHoverPaused(false)}
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
            onClick={() => {
              setUserPaused((value) => !value);
              if (userPaused) { setFocusPaused(false); setHoverPaused(false); }
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
