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
        <path
          className="escape-trajectory escape-trajectory-wide"
          d="M 470 900 C 650 720, 805 410, 1310 155"
        />
        <circle className="escape-endpoint escape-endpoint-wide" cx="1310" cy="155" r="7" />
        <path
          className="escape-trajectory escape-trajectory-narrow"
          d="M 470 900 C 1150 750, 1500 500, 1460 155"
        />
        <circle className="escape-endpoint escape-endpoint-narrow" cx="1460" cy="155" r="7" />
      </svg>
    </div>
  );
}
