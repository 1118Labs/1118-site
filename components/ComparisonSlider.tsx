"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useState,
} from "react";

type SliderStyle = CSSProperties & {
  "--comparison-position": `${number}%`;
};

const clamp = (value: number) => Math.min(100, Math.max(0, value));

export function ComparisonSlider() {
  const [position, setPosition] = useState(50);

  const updateFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = ((event.clientX - bounds.left) / bounds.width) * 100;
    setPosition(Math.round(clamp(next)));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromPointer(event);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      updateFromPointer(event);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next = position;

    if (event.key === "ArrowLeft" || event.key === "ArrowDown") next -= 2;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next += 2;
    if (event.key === "PageDown") next -= 10;
    if (event.key === "PageUp") next += 10;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = 100;

    if (next !== position) {
      event.preventDefault();
      setPosition(clamp(next));
    }
  };

  const style = {
    "--comparison-position": `${position}%`,
  } as SliderStyle;

  return (
    <div
      className="comparison"
      role="slider"
      tabIndex={0}
      aria-label="Compare the original photograph with the Etchr editorial portrait"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={position}
      aria-valuetext={`Divider ${position}% across; original photograph on the left and Etchr portrait on the right`}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      style={style}
    >
      <div className="comparison-image comparison-after" aria-hidden="true">
        <Image
          src="/brand/hero-etchr-aligned.png"
          alt=""
          fill
          priority
          draggable={false}
          sizes="(max-width: 768px) 100vw, 82vw"
        />
      </div>
      <div className="comparison-image comparison-before">
        <Image
          src="/brand/hero-original-aligned.jpg"
          alt="Original portrait photograph"
          fill
          priority
          draggable={false}
          sizes="(max-width: 768px) 100vw, 82vw"
        />
      </div>
      <span className="comparison-label comparison-label-before">
        Original
      </span>
      <span className="comparison-label comparison-label-after">Etchr</span>
      <span className="comparison-divider" aria-hidden="true">
        <span className="comparison-handle">
          <span className="comparison-grip" />
        </span>
      </span>
    </div>
  );
}
