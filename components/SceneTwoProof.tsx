import Image from "next/image";
import { ComparisonSlider } from "@/components/ComparisonSlider";

const proofPoints = [
  {
    number: "01",
    title: "Real photographs",
    copy: "Start with what’s real.",
  },
  {
    number: "02",
    title: "Editorial quality",
    copy: "Portraits that look considered.",
  },
  {
    number: "03",
    title: "Immediate impact",
    copy: "From upload to finished in minutes.",
  },
  {
    number: "04",
    title: "Private by design",
    copy: "Your photos. Your data.",
  },
] as const;

const exportFormats = [
  {
    platform: "LinkedIn",
    ratio: "4:5",
    className: "scene-two-export-linkedin",
    alt: "Etchr portrait cropped to a 4:5 LinkedIn format",
  },
  {
    platform: "X / Twitter",
    ratio: "1:1",
    className: "scene-two-export-square-one",
    alt: "Etchr portrait cropped to a square X or Twitter format",
  },
  {
    platform: "Instagram / Slack",
    ratio: "1:1",
    className: "scene-two-export-square-two",
    alt: "Etchr portrait cropped to a square Instagram or Slack format",
  },
  {
    platform: "TikTok",
    ratio: "9:16",
    className: "scene-two-export-tiktok",
    alt: "Etchr portrait cropped to a vertical 9:16 TikTok format",
  },
  {
    platform: "YouTube",
    ratio: "16:9",
    className: "scene-two-export-youtube",
    alt: "Etchr portrait cropped to a horizontal 16:9 YouTube format",
  },
] as const;

export function SceneTwoProof() {
  return (
    <section
      className="scene-two"
      aria-labelledby="scene-two-title"
      id="proof"
    >
      <div className="scene-two-inner">
        <header className="scene-two-index" aria-label="Section 02, The Proof">
          <span>02</span>
          <span>The Proof</span>
        </header>

        <div className="scene-two-primary">
          <div className="scene-two-copy">
            <p className="scene-two-eyebrow">First Work</p>
            <h2 id="scene-two-title">
              Etchr turns a real photo into a portrait that feels inevitable.
            </h2>
            <p className="scene-two-support">
              Real photographs. Editorial quality. Immediate impact.
              <br />
              Built for how you show up.
            </p>
            <a className="scene-two-link" href="https://etchr.ai">
              Explore Etchr
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="scene-two-device-stage">
            <div
              className="scene-two-device"
              role="group"
              aria-label="Etchr before and after portrait experience in a phone frame"
            >
              <ComparisonSlider initialPosition={50} />
            </div>
          </div>
        </div>

        <ol className="scene-two-proof-points">
          {proofPoints.map((point) => (
            <li key={point.number}>
              <span className="scene-two-proof-number" aria-hidden="true">
                {point.number}
              </span>
              <h3>{point.title}</h3>
              <p>{point.copy}</p>
            </li>
          ))}
        </ol>

        <div
          className="scene-two-exports"
          aria-labelledby="scene-two-exports-title"
        >
          <header
            className="scene-two-index scene-two-exports-index"
            aria-label="Section 03, Made for Every Platform"
          >
            <span>03</span>
            <span>Made for Every Platform</span>
          </header>

          <div className="scene-two-exports-heading">
            <h2 id="scene-two-exports-title">
              <span>One portrait.</span>
              <span>Everywhere it matters.</span>
            </h2>
            <p>
              Etchr prepares the formats where presence drives opportunity.
            </p>
          </div>

          <div
            className="scene-two-export-rail"
            role="region"
            aria-label="Five Etchr portrait export formats. Scroll horizontally to view all formats."
            tabIndex={0}
          >
            <div className="scene-two-export-list">
              {exportFormats.map((format) => (
                <figure
                  className={`scene-two-export ${format.className}`}
                  key={format.platform}
                >
                  <div className="scene-two-export-image">
                    <Image
                      src="/etchr-after.jpg"
                      alt={format.alt}
                      fill
                      sizes="(max-width: 768px) 70vw, 30vw"
                    />
                  </div>
                  <figcaption>
                    <span>{format.platform}</span>
                    <span>{format.ratio}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
