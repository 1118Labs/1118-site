"use client";

import Image from "next/image";
import { type ChangeEvent, type CSSProperties, useState } from "react";

export function ComparisonSlider() {
  const [position, setPosition] = useState(52);
  const sliderStyle = {
    "--slider-position": `${position}%`,
  } as CSSProperties;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPosition(Number(event.target.value));
  };

  return (
    <figure className="comparison-figure">
      <div className="comparison-frame" style={sliderStyle}>
        <Image
          className="comparison-image comparison-before"
          src="/etchr-before.jpg"
          alt="Original studio photograph before Etchr portrait treatment"
          fill
          loading="eager"
          sizes="(max-width: 980px) 90vw, 42vw"
        />
        <div className="comparison-after-layer" aria-hidden="true">
          <Image
            className="comparison-image"
            src="/etchr-after.jpg"
            alt=""
            fill
            loading="eager"
            sizes="(max-width: 980px) 90vw, 42vw"
          />
        </div>

        <span className="comparison-label comparison-label-before">Before</span>
        <span className="comparison-label comparison-label-after">Etchr</span>

        <div className="comparison-divider" aria-hidden="true">
          <div className="comparison-handle">
            <span>‹ ›</span>
          </div>
        </div>

        <input
          className="comparison-range"
          type="range"
          min="0"
          max="100"
          value={position}
          onChange={handleChange}
          aria-label="Compare the original photograph with the finished Etchr portrait"
          aria-valuetext={`${position}% of the original photograph visible`}
        />
      </div>
      <figcaption className="comparison-caption">
        <strong>Drag to compare</strong>
        <span>Real photo → finished portrait</span>
      </figcaption>
    </figure>
  );
}
