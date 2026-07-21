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
            d="M 1015 748 C 1128 646, 1245 421, 1516 167"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="escape-trajectory-core"
            d="M 1015 748 C 1128 646, 1245 421, 1516 167"
            vectorEffect="non-scaling-stroke"
          />
          <circle className="escape-endpoint-halo" cx="1516" cy="167" r="12" />
          <circle className="escape-endpoint-core" cx="1516" cy="167" r="3.5" />
        </g>
        <g className="escape-route escape-route-tablet">
          <path
            className="escape-trajectory-halo"
            d="M 1035 760 C 1225 650, 1395 452, 1510 190"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="escape-trajectory-core"
            d="M 1035 760 C 1225 650, 1395 452, 1510 190"
            vectorEffect="non-scaling-stroke"
          />
          <circle className="escape-endpoint-halo" cx="1510" cy="190" r="13" />
          <circle className="escape-endpoint-core" cx="1510" cy="190" r="3.8" />
        </g>
        <g className="escape-route escape-route-mobile">
          <path
            className="escape-trajectory-halo"
            d="M 1170 830 C 1370 714, 1470 554, 1510 330"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="escape-trajectory-core"
            d="M 1170 830 C 1370 714, 1470 554, 1510 330"
            vectorEffect="non-scaling-stroke"
          />
          <circle className="escape-endpoint-halo" cx="1510" cy="330" r="14" />
          <circle className="escape-endpoint-core" cx="1510" cy="330" r="4" />
        </g>
      </svg>
    </div>
  );
}
