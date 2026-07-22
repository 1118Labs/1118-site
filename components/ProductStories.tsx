"use client";

import Image from "next/image";
import { type KeyboardEvent, type TouchEvent, useRef, useState } from "react";
import { ReviewsEngineProof } from "./ReviewsEngineProof";

const products = [
  { id: "reviews", number: "01", name: "Reviews Engine", headline: <>We turned customer reviews<br />into a better reputation.</>, copy: <>A reputation platform that turns customer feedback<br className="desktop-only" /> into measurable growth.</> },
  { id: "property", number: "02", name: "Property Insights", headline: <>We turned service requests<br />into quote-ready intelligence.</>, copy: <>Property context, risk and recommendations—<br className="desktop-only" />assembled before the estimate begins.</> },
  { id: "manuscript", number: "03", name: "Manuscript", headline: <>We made a lifetime of writing<br />feel possible to navigate.</>, copy: <>A living archive for writing, ideas<br />and intellectual life.</> },
];

function PropertyProof() {
  return <figure className="property-proof"><Image src="/work/property-insights-synthetic-dashboard.png" alt="Synthetic property-intelligence brief showing a request, property context, recommendation, and quote-ready next action" fill sizes="(max-width: 900px) 100vw, 62vw" /><figcaption>Prepared before the estimate begins.</figcaption></figure>;
}

function ManuscriptProof() {
  return <div className="manuscript-proof" aria-label="Synthetic Manuscript writing archive">
    <aside><p>Archive</p><ul><li className="active">The Long View</li><li>Field Notes</li><li>Fragments</li><li>Letters</li></ul></aside>
    <article><p className="manuscript-kicker">Notebook · 1987–2026</p><h4>The Long View</h4><p>Some ideas arrive complete. Others gather meaning over decades, returning in letters, margins and conversations.</p><p>A living archive keeps those threads visible—close enough to follow, quiet enough to let the writing speak.</p></article>
  </div>;
}

export function ProductStories() {
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);
  const select = (index: number) => setActive(Math.min(products.length - 1, Math.max(0, index)));
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next = active;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (active + 1) % products.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key)) next = (active - 1 + products.length) % products.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = products.length - 1;
    else return;
    event.preventDefault();
    select(next);
    event.currentTarget.querySelectorAll<HTMLButtonElement>("[role='tab']")[next]?.focus();
  };
  const onTouchStart = (event: TouchEvent) => { touchStart.current = event.changedTouches[0]?.clientX ?? null; };
  const onTouchEnd = (event: TouchEvent) => { const end = event.changedTouches[0]?.clientX; if (touchStart.current === null || end === undefined) return; const delta = end - touchStart.current; if (Math.abs(delta) > 48) select(active + (delta < 0 ? 1 : -1)); touchStart.current = null; };
  const product = products[active];
  return <div className="product-stories">
    <div className="product-selector" role="tablist" aria-label="Products" onKeyDown={onKeyDown}>{products.map((item, index) => <button key={item.id} id={`${item.id}-tab`} role="tab" aria-selected={active === index} aria-controls={`${item.id}-panel`} tabIndex={active === index ? 0 : -1} onClick={() => select(index)}><span>{item.number}</span>{item.name}</button>)}</div>
    <div key={product.id} className="product-story" id={`${product.id}-panel`} role="tabpanel" aria-labelledby={`${product.id}-tab`} tabIndex={0} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="product-copy"><p className="eyebrow">{product.name}</p><h3>{product.headline}</h3><p className="body-lg">{product.copy}</p></div>
      <div className="product-proof">{active === 0 ? <ReviewsEngineProof /> : active === 1 ? <PropertyProof /> : <ManuscriptProof />}</div>
    </div>
  </div>;
}
