import avif96 from '../assets/responsive/signal-portfolio/icon-96.avif';
import avif192 from '../assets/responsive/signal-portfolio/icon-192.avif';
import avif288 from '../assets/responsive/signal-portfolio/icon-288.avif';
import webp96 from '../assets/responsive/signal-portfolio/icon-96.webp';
import webp192 from '../assets/responsive/signal-portfolio/icon-192.webp';
import webp288 from '../assets/responsive/signal-portfolio/icon-288.webp';

// Founder-approved 2026 portfolio identity; not an original historical Signal icon.
export default function SignalIdentity() {
  const sizes = '(max-width: 720px) 64px, (max-width: 1000px) 75px, 86px';
  return <div className="signal-product-lockup">
    <picture>
      <source type="image/avif" srcSet={`${avif96} 96w, ${avif192} 192w, ${avif288} 288w`} sizes={sizes} />
      <source type="image/webp" srcSet={`${webp96} 96w, ${webp192} 192w, ${webp288} 288w`} sizes={sizes} />
      <img src={webp96} width="96" height="96" alt="" loading="lazy" decoding="async" fetchPriority="low" />
    </picture>
    <p className="fleet-showcase-name">Signal</p>
  </div>;
}
