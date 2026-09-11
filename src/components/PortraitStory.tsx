import sourceScreen from '../assets/showcase/portrait/app-store-source.webp';
import transformationScreen from '../assets/showcase/portrait/app-store-transformation.webp';
import finishedScreen from '../assets/showcase/portrait/app-store-finished.webp';
import './PortraitStory.css';

type PortraitStoryProps = {
  className?: string;
  variant?: 'chapter' | 'case-study';
};

/** Published App Store screenshots, preserved in full without simulated controls. */
export default function PortraitStory({ className = '', variant = 'chapter' }: PortraitStoryProps) {
  return (
    <figure className={`portrait-story portrait-story--${variant} ${className}`}>
      <div className="portrait-story-screens">
        <figure className="portrait-story-screen portrait-story-screen-source">
          <figcaption><span>01</span> Source photograph</figcaption>
          <a href={sourceScreen} target="_blank" rel="noreferrer" aria-label="View full-size source photograph App Store screenshot">
            <img src={sourceScreen} alt="Published Portrait App Store screen: Laurie's original photograph above the real Choose Photo and Take Photo controls" width={1284} height={2778} loading="lazy" decoding="async" />
          </a>
        </figure>
        <figure className="portrait-story-screen portrait-story-screen-transformation">
          <figcaption><span>02</span> Transformation</figcaption>
          <a href={transformationScreen} target="_blank" rel="noreferrer" aria-label="View full-size transformation App Store screenshot">
            <img src={transformationScreen} alt="Published Portrait App Store screen: the same photograph compared with its editorial portrait" width={1284} height={2778} loading="lazy" decoding="async" />
          </a>
        </figure>
        <figure className="portrait-story-screen portrait-story-screen-finished">
          <figcaption><span>03</span> Finished portrait</figcaption>
          <a href={finishedScreen} target="_blank" rel="noreferrer" aria-label="View full-size finished portrait and Save and Share App Store screenshot">
            <img src={finishedScreen} alt="Published Portrait App Store screen: the complete finished portrait with actual Save to Photos, Share, and Portrait Tools controls" width={1284} height={2778} loading="lazy" decoding="async" />
          </a>
        </figure>
      </div>
      <figcaption className="portrait-story-caption">App Store screenshots · Laurie · Studio example</figcaption>
    </figure>
  );
}
