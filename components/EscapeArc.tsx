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
      { threshold: 0.35 },
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
      <svg viewBox="0 0 1600 900" preserveAspectRatio="none">
        <path d="M 370 790 C 500 565, 720 392, 1060 232" />
        <circle cx="1060" cy="232" r="8" />
      </svg>
    </div>
  );
}
