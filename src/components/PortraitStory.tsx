import sourcePhoto from "../assets/showcase/portrait/sloane-source.webp";
import finishedPortrait from "../assets/showcase/portrait/sloane-result.webp";
import profilePortrait from "../assets/showcase/portrait/sloane-profile.webp";
import circlePortrait from "../assets/showcase/portrait/sloane-circle.webp";
import storyPortrait from "../assets/showcase/portrait/sloane-story.webp";
import "./PortraitStory.css";

type PortraitStoryProps = {
  className?: string;
  variant?: "chapter" | "case-study";
};

/** Authentic studio source, result and exports from one approved subject. */
export default function PortraitStory({ className = "", variant = "chapter" }: PortraitStoryProps) {
  return (
    <figure className={`portrait-story portrait-story--${variant} ${className}`}>
      <ol className="portrait-story-steps" aria-label="From your photo to a finished portrait and usable formats">
        <li className="portrait-story-step portrait-story-input">
          <div className="portrait-story-step-label"><span>01</span> Your photo</div>
          <div className="portrait-story-source-frame">
            <img src={sourcePhoto} alt="Sloane's original color studio photograph" width={900} height={1125} loading="lazy" decoding="async" />
          </div>
          <p className="portrait-story-note">Start with one clear photo.</p>
        </li>
        <li className="portrait-story-step portrait-story-result">
          <div className="portrait-story-step-label"><span>02</span> Editorial portrait</div>
          <div className="portrait-story-result-frame">
            <img src={finishedPortrait} alt="The same Sloane photograph transformed into a finished black-and-white editorial portrait" width={1024} height={1024} loading="lazy" decoding="async" />
          </div>
          <p className="portrait-story-note">A finished portrait, ready to use.</p>
        </li>
        <li className="portrait-story-step portrait-story-outputs">
          <div className="portrait-story-step-label"><span>03</span> Save. Share. Use.</div>
          <div className="portrait-story-formats">
            <figure className="portrait-story-format portrait-story-format-profile">
              <img src={profilePortrait} alt="Sloane's finished portrait in a vertical profile format" width={360} height={450} loading="lazy" decoding="async" />
              <figcaption>Profile</figcaption>
            </figure>
            <figure className="portrait-story-format portrait-story-format-circle">
              <img src={circlePortrait} alt="Sloane's finished portrait as a circular avatar" width={320} height={320} loading="lazy" decoding="async" />
              <figcaption>Circle</figcaption>
            </figure>
            <figure className="portrait-story-format portrait-story-format-story">
              <img src={storyPortrait} alt="Sloane's finished portrait in a tall story format" width={270} height={480} loading="lazy" decoding="async" />
              <figcaption>Story</figcaption>
            </figure>
          </div>
          <p className="portrait-story-note">For profiles, bios and social posts.</p>
        </li>
      </ol>
      <figcaption className="portrait-story-caption">Sloane · Studio example <span>One photo, one portrait, multiple formats.</span></figcaption>
    </figure>
  );
}
