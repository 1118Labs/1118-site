"use client";

import { useEffect, useRef, useState } from "react";

const reviews = [
  { quote: "SkyPups made our shy rescue pup feel like the guest of honor. The staff sent polished updates, the yard was spotless, and Mochi came home calm, tired, and grinning.", name: "Mochi & Erin", place: "Austin, TX", source: "Website" },
  { quote: "We booked one stay and never looked back. Juniper sprinted through the doors on visit two. Around here, pups do not leave star reviews — they leave elite paw reviews.", name: "Juniper & Luis", place: "Nashville, TN", source: "Google" },
  { quote: "Scout came home brushed, calm, and clearly cared for. The team handled pickup, playtime, and the final freshen-up with the kind of consistency that makes you trust them fast.", name: "Scout & Priya", place: "Denver, CO", source: "Facebook" },
];

export function ReviewsEngineProof() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [manual, setManual] = useState(false);
  useEffect(() => { const node = ref.current; if (!node) return; const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.55 }); observer.observe(node); return () => observer.disconnect(); }, []);
  useEffect(() => { if (!visible || manual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; const interval = window.setInterval(() => setActive((current) => (current + 1) % reviews.length), 4500); return () => window.clearInterval(interval); }, [visible, manual]);
  const choose = (index: number) => { setManual(true); setActive(index); };
  return <div className="reviews-proof" ref={ref}>
    <div className="reviews-brand"><span className="paws" aria-label="Five out of five paws">● ● ● ● ●</span><span>SkyPups</span></div>
    <blockquote key={active}><p>“{reviews[active].quote}”</p><footer><strong>{reviews[active].name}</strong><span>{reviews[active].place} · {reviews[active].source}</span></footer></blockquote>
    <div className="review-progress" aria-label="Choose review">{reviews.map((review, index) => <button key={review.name} type="button" aria-label={`Show review ${index + 1}`} aria-pressed={active === index} onClick={() => choose(index)}><span /></button>)}</div>
  </div>;
}
