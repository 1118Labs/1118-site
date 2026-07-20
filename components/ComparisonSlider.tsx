"use client";

import Image from "next/image";
import { type ChangeEvent, type CSSProperties, useState } from "react";

interface ComparisonSliderProps {
  compact?: boolean;
  initialPosition?: number;
  priority?: boolean;
}

export function ComparisonSlider({
  compact = false,
  initialPosition = 43,
  priority = false,
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(initialPosition);
  const sliderStyle = {
    "--slider-position": `${position}%`,
  } as CSSProperties;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPosition(Number(event.target.value));
  };

  return (
    <figure
      className={`canon-comparison${compact ? " canon-comparison-compact" : ""}`}
      aria-label="Before and after Etchr portrait comparison"
    >
      <div className="canon-comparison-frame" style={sliderStyle}>
        <Image
          className="canon-comparison-image canon-comparison-before"
          src="/etchr-before.jpg"
          alt="Original portrait photograph of a woman in a black blazer before Etchr treatment"
          fill
          priority={priority}
          sizes={
            compact
              ? "(max-width: 768px) 72vw, 300px"
              : "(max-width: 768px) 100vw, 46vw"
          }
        />

        <div className="canon-comparison-after-layer" aria-hidden="true">
          <Image
            className="canon-comparison-image"
            src="/etchr-after.jpg"
            alt=""
            fill
            priority={priority}
            sizes={
              compact
                ? "(max-width: 768px) 72vw, 300px"
                : "(max-width: 768px) 100vw, 46vw"
            }
          />
        </div>

        <span className="canon-comparison-label canon-comparison-label-before">
          Before
        </span>
        <span className="canon-comparison-label canon-comparison-label-after">
          Etchr
        </span>

        <div className="canon-comparison-divider" aria-hidden="true">
          <span className="canon-comparison-handle">
            <span>‹</span>
            <span>›</span>
          </span>
        </div>

        <input
          className="canon-comparison-range"
          type="range"
          min="0"
          max="100"
          step="1"
          value={position}
          onChange={handleChange}
          aria-label="Compare the original portrait with the Etchr portrait"
          aria-valuetext={`${position}% Before, ${100 - position}% Etchr`}
        />
      </div>
    </figure>
  );
}
