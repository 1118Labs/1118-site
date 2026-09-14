import { useEffect, useRef, useState, type RefObject } from 'react';
import ResponsiveImage from './ResponsiveImage';

// Image delivery only. The native carousel's scrolling and pause state are untouched.
export default function ReviewImage({ src, alt, position, viewport }: { src: string; alt: string; position: string; viewport: RefObject<HTMLDivElement | null> }) {
  const marker = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const root = viewport.current;
    const node = marker.current;
    if (!root || !node) return;
    let chapterNear = false;
    let cardNear = false;
    const loadWhenNear = () => { if (chapterNear && cardNear) { setReady(true); chapter.disconnect(); card.disconnect(); } };
    const chapter = new IntersectionObserver(([entry]) => { chapterNear = entry.isIntersecting; loadWhenNear(); }, { rootMargin: '500px 0px' });
    const card = new IntersectionObserver(([entry]) => { cardNear = entry.isIntersecting; loadWhenNear(); }, { root, rootMargin: '0px 600px' });
    chapter.observe(root);
    card.observe(node);
    return () => { chapter.disconnect(); card.disconnect(); };
  }, [viewport]);
  return <div className="review-image" ref={marker}>
    <ResponsiveImage src={ready ? src : undefined} alt={ready ? alt : ""} aria-hidden={!ready} width={900} height={1200} sizes="(max-width: 760px) min(340px, calc(100vw - 40px)), clamp(360px, 29vw, 440px)" loading="lazy" decoding="async" fetchPriority="low" style={{ objectPosition: position }} />
    <noscript><img src={src} alt={alt} width={900} height={1200} loading="lazy" style={{ objectPosition: position }} /></noscript>
  </div>;
}
