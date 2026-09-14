import { useEffect, useRef, useState } from 'react';
import ResponsiveImage, { portraitImageSizes, portraitSourceSizes } from './ResponsiveImage';
import { PlatformIconBadge } from './PortraitPlatformIcon';
import PortraitComparison from './PortraitComparison';
import source from '../assets/showcase/portrait/sloane-source.webp';
import square from '../assets/showcase/portrait/sloane-square-1024.webp';
import profile from '../assets/showcase/portrait/sloane-profile-640x800.webp';
import circle from '../assets/showcase/portrait/sloane-circle-640.webp';
import './PortraitStory.css';

// Port of Portrait WorkflowStorySection / PortraitImage / PortraitPack / CropPreview.
// Uses the original Sloane export family, not reconstructed App Store screenshots.
export default function PortraitStory({ variant = 'homepage' }: { variant?: 'homepage' | 'case-study' }) {
  const photo = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [decoded, setDecoded] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const node = photo.current;
    if (!node) return;
    let inView = false;
    const sync = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); }, { threshold: .25 });
    observer.observe(node);
    document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);
  return <div className={`portrait-story portrait-story-${variant}`} data-subject="sloane">
    <div className="portrait-story-panels">
      <section className="portrait-workflow-panel">
        <div className="portrait-workflow-heading photo-heading"><h3>Photo</h3><button className="photo-motion-toggle" type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? "Resume photo motion" : "Pause photo motion"}</button></div>
        <div className="portrait-native-plate" ref={photo}><div className="photo-drift" data-running={visible && decoded && !paused}><ResponsiveImage sizes={portraitSourceSizes} deferUntilNear={variant === 'homepage' ? 1000 : undefined} onLoad={event => { const image = event.currentTarget; image.decode().then(() => setDecoded(true)).catch(() => setDecoded(false)); }} src={source} width="1122" height="1402" alt="Sloane, original photograph from Portrait’s approved studio gallery" loading="lazy" decoding="async" fetchPriority="auto" style={{transform:'translate(0.339%, 9.223%) rotate(0.278deg) scale(1.2674)'}} /></div></div>
      </section>
      <section className="portrait-workflow-panel">
        <div className="portrait-workflow-heading"><h3>Portrait</h3></div>
        <PortraitComparison subject="sloane" gallery={variant === 'homepage'} className="portrait-workflow-comparison" />
      </section>
      <section className="portrait-workflow-panel portrait-pack-panel">
        <div className="portrait-workflow-heading"><h3>Use it</h3></div>
        <div className="portrait-pack-master"><ResponsiveImage sizes={portraitImageSizes} deferUntilNear={variant === 'homepage' ? 800 : undefined} src={square} width="1024" height="1024" alt="Sloane, finished editorial portrait" loading="lazy" decoding="async" fetchPriority="low" /></div>
        <div className="portrait-native-formats">
          {[{src:profile,label:'Profile',width:640,height:800},{src:circle,label:'Circle',width:640,height:640}].map(item=><figure key={item.label} className={`portrait-format portrait-format-${item.label.toLowerCase()}`}><ResponsiveImage deferUntilNear={variant === 'homepage' ? 250 : undefined} sizes={item.label === 'Profile' ? '137px' : '170px'} src={item.src} width={item.width} height={item.height} alt={`Sloane’s original Portrait ${item.label.toLowerCase()} export`} loading="lazy" decoding="async" fetchPriority="low"/><figcaption>{item.label}</figcaption></figure>)}
        </div>
        <div className="portrait-platforms">{([{platform:'linkedin',label:'LinkedIn'},{platform:'instagram',label:'Instagram'},{platform:'tiktok',label:'TikTok'},{platform:'facebook',label:'Facebook'},{platform:'x',label:'X'},{platform:'youtube',label:'YouTube'},{platform:'slack',label:'Slack'},{platform:'discord',label:'Discord'}] as const).map(({platform,label})=><span className="portrait-destination" key={platform}><PlatformIconBadge platform={platform} /><span className="portrait-destination-label" aria-hidden="true">{label}</span></span>)}</div>
      </section>
    </div>
    <p className="portrait-story-caption">{variant === 'case-study' && 'Sloane · Studio example '}<a href="https://getportrait.ai/gallery" target="_blank" rel="noreferrer" className="product-action product-action-secondary">View the gallery →</a></p>
  </div>;
}
