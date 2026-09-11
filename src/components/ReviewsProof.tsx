import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useReducedMotion } from 'framer-motion';
import { currentSkyPupsReviews as reviews } from '../content/reviews';
import './ReviewsProof.css';

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
const pixelsPerSecond = 32;

export default function ReviewsProof() {
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const motionPreference = useReducedMotion();
  const reduceMotion = hydrated && Boolean(motionPreference);
  const windowRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef<HTMLUListElement>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);

  useEffect(() => {
    const viewport = windowRef.current;
    const cycle = cycleRef.current;
    if (!hydrated || reduceMotion || userPaused || hoverPaused || focusPaused || !viewport || !cycle) return;
    let frame = 0;
    let previousTime = 0;
    let position = viewport.scrollLeft;
    let cycleWidth = cycle.getBoundingClientRect().width;
    const observer = new ResizeObserver(() => {
      cycleWidth = cycle.getBoundingClientRect().width;
      position = viewport.scrollLeft;
    });
    observer.observe(cycle);
    const advance = (time: number) => {
      if (previousTime && cycleWidth > 0) {
        // Bound elapsed time so a background tab cannot jump when it returns.
        position = (position + Math.min(time - previousTime, 64) * pixelsPerSecond / 1000) % cycleWidth;
        viewport.scrollLeft = position;
      }
      previousTime = time;
      frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [hydrated, reduceMotion, userPaused, hoverPaused, focusPaused]);

  return (
    <figure className="re-proof" aria-label="Reviews Engine customer stories">
      <div
        className="re-proof-window"
        ref={windowRef}
        tabIndex={0}
        aria-label="Customer review strip. Scroll horizontally to explore the reviews."
        onFocus={() => setFocusPaused(true)}
        onBlur={() => setFocusPaused(false)}
        onPointerDown={(event) => {
          if (event.pointerType === 'touch' || event.pointerType === 'pen') setUserPaused(true);
        }}
      >
        <div className="re-proof-track">
          {[0, 1, 2].map((copy) => (
            <ul
              className={`re-proof-cycle ${copy ? 'is-duplicate' : ''}`}
              aria-hidden={copy ? true : undefined}
              aria-label={copy ? undefined : 'Customer reviews'}
              key={copy}
              ref={copy === 0 ? cycleRef : undefined}
            >
              {reviews.map((review) => (
                <li
                  className="re-card-card"
                  key={review.id}
                  onPointerMove={(event) => {
                    // A stationary pointer over a moving strip is not reading intent.
                    if (event.pointerType === 'mouse') setHoverPaused(true);
                  }}
                  onPointerLeave={() => setHoverPaused(false)}
                >
                  <img
                    alt={`${review.name} from the SkyPups review collection`}
                    decoding="async"
                    height="1200"
                    loading={copy === 0 ? 'eager' : 'lazy'}
                    src={review.image}
                    style={{ objectPosition: review.imagePosition }}
                    width="900"
                  />
                  <div className="re-card-copy">
                    <p aria-label={`${review.paws} out of 5 paws`} className="re-paw-rating" role="img">
                      <span aria-hidden="true" className="re-paws">
                        {Array.from({ length: review.paws }, (_, paw) => <NativePaw key={paw} />)}
                      </span>
                      <span aria-hidden="true">{review.paws}.0 PAWS</span>
                    </p>
                    <blockquote>“{review.quote}”</blockquote>
                    <footer><strong>{review.name}</strong><span>{review.location}</span></footer>
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <div className="re-proof-controls">
        {!reduceMotion && (
          <button
            aria-label={userPaused ? 'Resume reviews' : 'Pause reviews'}
            className="re-proof-pause"
            onClick={() => {
              setUserPaused((paused) => !paused);
              if (userPaused) { setFocusPaused(false); setHoverPaused(false); }
            }}
            type="button"
          >{userPaused ? 'Resume motion' : 'Pause motion'}</button>
        )}
      </div>
    </figure>
  );
}
