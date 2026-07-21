"use client";

import Image from "next/image";
import {
  type KeyboardEvent,
  type TouchEvent,
  useRef,
  useState,
} from "react";

const products = [
  {
    id: "reviews",
    number: "01",
    name: "Reviews Engine",
    description:
      "A reputation platform that turns customer feedback into measurable growth.",
    support: null,
    image: "/work/reviews-engine-public-widget.png",
    alt: "Published Reviews Engine testimonial widget for SkyPups dog training",
  },
  {
    id: "property",
    number: "02",
    name: "Property Insights",
    description: "Turn service requests into quote-ready property intelligence.",
    support: "Built for home-service teams working inside leading CRMs.",
    image: "/work/property-insights-synthetic-dashboard.png",
    alt: "Property Insights request detail using an approved synthetic product fixture",
  },
  {
    id: "manuscript",
    number: "03",
    name: "Manuscript",
    description:
      "A living archive for your writing, ideas, and intellectual life.",
    support: null,
    image: "/work/manuscript-empty-editor.png",
    alt: "Manuscript empty writing workspace",
  },
] as const;

export function WorksGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"back" | "forward">("forward");
  const touchStartRef = useRef<number | null>(null);
  const touchCurrentRef = useRef<number | null>(null);
  const activeProduct = products[activeIndex];

  const selectProduct = (nextIndex: number) => {
    const normalized = (nextIndex + products.length) % products.length;
    setDirection(normalized < activeIndex ? "back" : "forward");
    setActiveIndex(normalized);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      selectProduct(activeIndex + 1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      selectProduct(activeIndex - 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectProduct(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectProduct(products.length - 1);
    }
  };

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartRef.current = event.changedTouches[0]?.clientX ?? null;
    touchCurrentRef.current = touchStartRef.current;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    touchCurrentRef.current = event.touches[0]?.clientX ?? touchCurrentRef.current;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const end = event.changedTouches[0]?.clientX ?? touchCurrentRef.current;
    touchStartRef.current = null;
    touchCurrentRef.current = null;
    if (start === null || end === undefined || Math.abs(end - start) < 42) return;
    selectProduct(activeIndex + (end < start ? 1 : -1));
  };

  return (
    <div
      className={`works-gallery is-${direction} reveal`}
      data-reveal
      onKeyDown={handleKeyDown}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchStart={handleTouchStart}
    >
      <div className="works-scene" aria-live="polite">
        <div className="works-proof" key={activeProduct.id}>
          <Image
            src={activeProduct.image}
            alt={activeProduct.alt}
            fill
            sizes="(max-width: 800px) 100vw, 68vw"
            priority={activeIndex === 0}
          />
        </div>
        <div className="works-copy" key={`${activeProduct.id}-copy`}>
          <p className="works-number">{activeProduct.number} / 03</p>
          <h3>{activeProduct.name}</h3>
          <p>{activeProduct.description}</p>
          {activeProduct.support ? (
            <p className="works-support">{activeProduct.support}</p>
          ) : null}
          <div className="works-arrows" aria-label="Product controls">
            <button
              type="button"
              aria-label="Previous product"
              onClick={() => selectProduct(activeIndex - 1)}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next product"
              onClick={() => selectProduct(activeIndex + 1)}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <nav className="works-rail" aria-label="Select a product">
        {products.map((product, index) => (
          <button
            type="button"
            key={product.id}
            className={index === activeIndex ? "is-active" : ""}
            aria-pressed={index === activeIndex}
            onClick={() => selectProduct(index)}
          >
            <span>{product.number}</span>
            {product.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
