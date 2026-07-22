"use client";

import { useEffect, useRef, useState } from "react";

const reviews = [
  {
    id: "skypups-1",
    customer: "Mochi & Erin",
    location: "Austin, TX",
    source: "Website",
    quote:
      "SkyPups made our shy rescue pup feel like the guest of honor. The staff sent polished updates, the yard was spotless, and Mochi came home calm, tired, and grinning.",
    rating: 5,
  },
  {
    id: "skypups-2",
    customer: "Juniper & Luis",
    location: "Nashville, TN",
    source: "Google",
    quote:
      "We booked one stay and never looked back. Juniper sprinted through the doors on visit two. Around here, pups do not leave star reviews — they leave elite paw reviews.",
    rating: 5,
  },
  {
    id: "skypups-3",
    customer: "Scout & Priya",
    location: "Denver, CO",
    source: "Facebook",
    quote:
      "Scout came home brushed, calm, and clearly cared for. The team handled pickup, playtime, and the final freshen-up with the kind of consistency that makes you trust them fast.",
    rating: 5,
  },
] as const;

export function ReviewsEngineProof() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [manual, setManual] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motion.matches);
    syncMotion();
    motion.addEventListener("change", syncMotion);

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(root);

    return () => {
      motion.removeEventListener("change", syncMotion);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible || reducedMotion || manual) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % reviews.length);
    }, 4600);
    return () => window.clearInterval(timer);
  }, [isVisible, manual, reducedMotion]);

  const selectReview = (index: number) => {
    setManual(true);
    setActiveIndex((index + reviews.length) % reviews.length);
  };

  return (
    <div
      className="reviews-proof"
      ref={rootRef}
      onPointerDown={() => setManual(true)}
      onTouchStart={() => setManual(true)}
      onWheel={() => setManual(true)}
    >
      <header className="reviews-proof-header">
        <div>
          <span className="reviews-live-dot" aria-hidden="true" />
          Published proof
        </div>
        <strong>SkyPups</strong>
        <span>4.8 average</span>
      </header>

      <div className="reviews-proof-body">
        <aside aria-label="Reviews Engine publishing status">
          <span>Approved</span>
          <strong>10</strong>
          <span>Published</span>
          <strong>10</strong>
          <span>Rating style</span>
          <strong>Paws</strong>
        </aside>

        <div className="reviews-review-window">
          <div
            className="reviews-review-track"
            style={{ transform: `translateY(-${activeIndex * 100}%)` }}
          >
            {reviews.map((review) => (
              <article className="reviews-review-card" key={review.id}>
                <div
                  className="reviews-paws"
                  aria-label={`${review.rating} out of 5 paws`}
                >
                  <span aria-hidden="true">🐾 🐾 🐾 🐾 🐾</span>
                </div>
                <blockquote>“{review.quote}”</blockquote>
                <footer>
                  <div>
                    <strong>{review.customer}</strong>
                    <span>{review.location}</span>
                  </div>
                  <span>{review.source}</span>
                </footer>
              </article>
            ))}
          </div>
        </div>

        <div className="reviews-proof-controls" aria-label="Review controls">
          <button
            type="button"
            aria-label="Previous review"
            onClick={() => selectReview(activeIndex - 1)}
          >
            ↑
          </button>
          <span>{String(activeIndex + 1).padStart(2, "0")} / 03</span>
          <button
            type="button"
            aria-label="Next review"
            onClick={() => selectReview(activeIndex + 1)}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
}
