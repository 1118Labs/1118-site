"use client";

import {
  type KeyboardEvent,
  type TouchEvent,
  useRef,
  useState,
} from "react";
import { ManuscriptProof } from "@/components/ManuscriptProof";
import { PropertyInsightsProof } from "@/components/PropertyInsightsProof";
import { ReviewsEngineProof } from "@/components/ReviewsEngineProof";

const products = [
  {
    id: "reviews",
    number: "01",
    name: "Reviews Engine",
    description:
      "A reputation platform that turns customer feedback into measurable growth.",
    support: null,
  },
  {
    id: "property",
    number: "02",
    name: "Property Insights",
    description: "Turn service requests into quote-ready property intelligence.",
    support: "Built for home-service teams working inside leading CRMs.",
  },
  {
    id: "manuscript",
    number: "03",
    name: "Manuscript",
    description:
      "A living archive for your writing, ideas, and intellectual life.",
    support: null,
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
        <div className="works-copy" key={`${activeProduct.id}-copy`}>
          <p className="works-number">{activeProduct.number} / 03</p>
          <h3>{activeProduct.name}</h3>
          <p>{activeProduct.description}</p>
          {activeProduct.support ? (
            <p className="works-support">{activeProduct.support}</p>
          ) : null}

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

        <div className="works-proof" key={activeProduct.id}>
          {activeProduct.id === "reviews" ? <ReviewsEngineProof /> : null}
          {activeProduct.id === "property" ? <PropertyInsightsProof /> : null}
          {activeProduct.id === "manuscript" ? <ManuscriptProof /> : null}
        </div>
      </div>
    </div>
  );
}
