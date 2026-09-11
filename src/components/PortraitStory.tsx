import { PlatformIconBadge } from './PortraitPlatformIcon';
import PortraitComparison from './PortraitComparison';
import source from '../assets/showcase/portrait/sloane-source.webp';
import square from '../assets/showcase/portrait/sloane-square-1024.png';
import profile from '../assets/showcase/portrait/sloane-profile-640x800.png';
import circle from '../assets/showcase/portrait/sloane-circle-640.png';
import './PortraitStory.css';

// Port of Portrait WorkflowStorySection / PortraitImage / PortraitPack / CropPreview.
// Uses the original Sloane export family, not reconstructed App Store screenshots.
export default function PortraitStory({ variant = 'homepage' }: { variant?: 'homepage' | 'case-study' }) {
  return <div className={`portrait-story portrait-story-${variant}`} data-subject="sloane">
    <div className="portrait-story-panels">
      <section className="portrait-workflow-panel">
        <div className="portrait-workflow-heading"><h3>Photo</h3></div>
        <div className="portrait-native-plate"><img src={source} width="1122" height="1402" alt="Sloane, original photograph from Portrait’s approved studio gallery" loading="lazy" decoding="async" style={{transform:'translate(0.339%, 9.223%) rotate(0.278deg) scale(1.2674)'}} /></div>
      </section>
      <section className="portrait-workflow-panel">
        <div className="portrait-workflow-heading"><h3>Portrait</h3></div>
        <PortraitComparison subject="sloane" className="portrait-workflow-comparison" />
      </section>
      <section className="portrait-workflow-panel portrait-pack-panel">
        <div className="portrait-workflow-heading"><h3>Use it</h3></div>
        <div className="portrait-pack-master"><img src={square} width="1024" height="1024" alt="Sloane, finished editorial portrait" loading="lazy" decoding="async" /></div>
        <div className="portrait-native-formats">
          {[{src:profile,label:'Profile',width:640,height:800},{src:circle,label:'Circle',width:640,height:640}].map(item=><figure key={item.label} className={`portrait-format portrait-format-${item.label.toLowerCase()}`}><img src={item.src} width={item.width} height={item.height} alt={`Sloane’s original Portrait ${item.label.toLowerCase()} export`} loading="lazy" decoding="async"/><figcaption>{item.label}</figcaption></figure>)}
        </div>
        <div className="portrait-platforms">{(['linkedin','instagram','tiktok','x'] as const).map(platform=><PlatformIconBadge key={platform} platform={platform} />)}</div>
      </section>
    </div>
    <p className="portrait-story-caption">Sloane · Studio example <a href="https://getportrait.ai/gallery" target="_blank" rel="noreferrer">View the gallery →</a></p>
  </div>;
}
