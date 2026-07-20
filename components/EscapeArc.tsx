"use client";

import { useEffect, useRef, useState } from "react";

export function EscapeArc() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (media.matches) {
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`escape-arc ${isVisible ? "is-visible" : ""}`}
      ref={rootRef}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1600 1000" preserveAspectRatio="none">
        <g className="escape-route escape-route-wide">
          <path
            className="escape-trajectory-halo"
            d="M 690 645 C 880 700, 910 340, 1250 110"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="escape-trajectory-core"
            d="M 690 645 C 880 700, 910 340, 1250 110"
            vectorEffect="non-scaling-stroke"
          />
        </g>
        <g className="escape-route escape-route-narrow">
          <path
            className="escape-trajectory-halo"
            d="M 900 710 C 1350 650, 1510 380, 1460 120"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="escape-trajectory-core"
            d="M 900 710 C 1350 650, 1510 380, 1460 120"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}
