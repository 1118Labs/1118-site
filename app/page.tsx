import Image from "next/image";
import { ComparisonSlider } from "@/components/ComparisonSlider";

const studioSequence = ["Strategy", "Design", "Build", "Launch"] as const;

export default function Home() {
  return (
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="page-shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">AI-first product studio</p>
            <h1 id="hero-title">We build the software we keep looking for.</h1>
            <p className="hero-deck">
              1118 designs, builds, and launches original software products—from
              first principle to finished product.
            </p>
            <div className="button-row">
              <a className="button button-primary" href="#work">
                Explore our work
                <span aria-hidden="true">↓</span>
              </a>
              <a
                className="button button-secondary"
                href="https://etchr.ai"
                target="_blank"
                rel="noreferrer"
              >
                Visit Etchr.ai
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className="hero-proof">
            <ComparisonSlider />
          </div>
        </div>
      </section>

      <section
        className="featured-section section"
        id="work"
        aria-labelledby="featured-title"
      >
        <div className="page-shell featured-grid">
          <div className="featured-copy">
            <p className="eyebrow">Featured product</p>
            <h2 id="featured-title">Etchr.ai</h2>
            <p className="section-lead">
              Premium editorial portraits from real photographs.
            </p>
            <p>
              Turn one strong photo into a polished portrait pack for profiles,
              team pages, speaker bios, and professional identity.
            </p>
            <a
              className="text-link"
              href="https://etchr.ai"
              target="_blank"
              rel="noreferrer"
            >
              Explore Etchr.ai <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div
            className="format-stage"
            role="group"
            aria-label="Etchr portrait export formats"
          >
            <div className="format-note">
              <span>One portrait</span>
              <span>Every profile</span>
            </div>
            <div className="format-circle">
              <Image
                src="/etchr-after.jpg"
                alt="Circular Etchr profile portrait"
                fill
                sizes="(max-width: 700px) 34vw, 180px"
              />
            </div>
            <div className="format-square">
              <Image
                src="/etchr-after.jpg"
                alt="Square Etchr profile portrait"
                fill
                sizes="(max-width: 700px) 42vw, 250px"
              />
            </div>
            <div className="format-portrait">
              <Image
                src="/etchr-after.jpg"
                alt="Portrait-format Etchr profile image"
                fill
                sizes="(max-width: 700px) 44vw, 270px"
              />
              <span className="format-caption">
                The most beautiful version of your identity.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="philosophy-section section"
        aria-labelledby="philosophy-title"
      >
        <div className="page-shell philosophy-grid">
          <div>
            <p className="eyebrow eyebrow-light">How we build</p>
            <h2 id="philosophy-title">Original products. Real companies.</h2>
          </div>
          <div>
            <p className="philosophy-copy">
              We combine product strategy, design, modern AI, and disciplined
              engineering to take focused software products from idea to launch.
            </p>
            <ol className="studio-sequence" aria-label="1118 product process">
              {studioSequence.map((step, index) => (
                <li key={step}>
                  <span className="sequence-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section
        className="about-section section"
        id="about"
        aria-labelledby="about-title"
      >
        <div className="page-shell about-grid">
          <div>
            <p className="eyebrow">About 1118</p>
            <h2 id="about-title">Built from first principles.</h2>
          </div>
          <div className="about-copy">
            <p>
              1118 is an AI-first product studio founded to create the software
              we wish already existed. We identify problems worth solving,
              design the product, build the technology, and take it to market.
            </p>
            <p className="about-note">
              Fewer products. Better products. Real ownership.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
