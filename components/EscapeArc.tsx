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
            d="M 835 685 C 1030 610, 1150 340, 1505 138"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="escape-trajectory-core"
            d="M 835 685 C 1030 610, 1150 340, 1505 138"
            vectorEffect="non-scaling-stroke"
          />
          <circle className="escape-endpoint-halo" cx="1505" cy="138" r="12" />
          <circle className="escape-endpoint-core" cx="1505" cy="138" r="3.5" />
        </g>
        <g className="escape-route escape-route-narrow">
          <path
            className="escape-trajectory-halo"
            d="M 915 730 C 1260 640, 1460 375, 1480 120"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="escape-trajectory-core"
            d="M 915 730 C 1260 640, 1460 375, 1480 120"
            vectorEffect="non-scaling-stroke"
          />
          <circle className="escape-endpoint-halo" cx="1480" cy="120" r="14" />
          <circle className="escape-endpoint-core" cx="1480" cy="120" r="4" />
        </g>
      </svg>
    </div>
  );
}
