"use client";

import Image from "next/image";
import { type ChangeEvent, type CSSProperties, useState } from "react";

interface ComparisonSliderProps {
  compact?: boolean;
  priority?: boolean;
}

export function ComparisonSlider({
  compact = false,
  priority = false,
}: ComparisonSliderProps) {
  const [position, setPosition] = useState(50);
  const sliderStyle = {
    "--slider-position": `${position}%`,
  } as CSSProperties;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPosition(Number(event.target.value));
  };

  return (
    <figure
      className={`comparison-figure${compact ? " comparison-figure-compact" : ""}`}
    >
      <div className="comparison-frame" style={sliderStyle}>
        <Image
          className="comparison-image comparison-before"
          src="/etchr-before.jpg"
          alt="Original photograph supplied to Etchr"
          fill
          priority={priority}
          sizes={
            compact
              ? "(max-width: 760px) 72vw, 300px"
              : "(max-width: 900px) 92vw, 46vw"
          }
        />
        <div className="comparison-after-layer" aria-hidden="true">
          <Image
            className="comparison-image"
            src="/etchr-after.jpg"
            alt=""
            fill
            priority={priority}
            sizes={
              compact
                ? "(max-width: 760px) 72vw, 300px"
                : "(max-width: 900px) 92vw, 46vw"
            }
          />
        </div>

        <span className="comparison-label comparison-label-before">
          Source photo
        </span>
        <span className="comparison-label comparison-label-after">
          Etchr portrait
        </span>

        <div className="comparison-divider" aria-hidden="true">
          <div className="comparison-handle">
            <span>← →</span>
          </div>
        </div>

        <input
          className="comparison-range"
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={handleChange}
          aria-label="Compare the source photograph with the finished Etchr portrait"
          aria-valuetext={`${position}% source photograph and ${100 - position}% finished Etchr portrait visible`}
        />
      </div>
      {!compact && (
        <figcaption className="comparison-caption">
          <strong>Drag to compare</strong>
          <span>Source photograph → finished Etchr portrait</span>
        </figcaption>
      )}
    </figure>
  );
}
