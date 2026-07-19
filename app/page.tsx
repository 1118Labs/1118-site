import Image from "next/image";
import { ComparisonSlider } from "@/components/ComparisonSlider";
import { EtchrDevice } from "@/components/EtchrDevice";
import { MotionController } from "@/components/MotionController";

const beliefs = [
  "Original ideas with real potential.",
  "Obsessive care in product, design, and engineering.",
  "Focused products built to become enduring businesses.",
  "Real ownership from first principle to launch.",
] as const;

const products = [
  {
    name: "Etchr",
    status: "Live",
    description: "Premium editorial portraits from real photographs.",
    href: "https://etchr.ai",
  },
  {
    name: "Dispatch",
    status: "In development",
  },
  {
    name: "Property Insights",
    status: "In development",
  },
  {
    name: "Manuscript",
    status: "Coming soon",
  },
] as const;

const outputFormats = [
  { platform: "LinkedIn", className: "output-avatar" },
  { platform: "X", className: "output-square" },
  { platform: "Instagram", className: "output-editorial" },
  { platform: "TikTok", className: "output-portrait" },
] as const;

export default function Home() {
  return (
    <main>
      <MotionController />

      <section className="hero" aria-labelledby="hero-title">
        <div className="page-shell hero-grid">
          <div className="hero-copy" data-reveal>
            <p className="eyebrow">AI-first product studio</p>
            <h1 id="hero-title">
              <span>We build</span>
              <span>the software</span>
              <em>we keep looking for.</em>
            </h1>
            <a className="editorial-link hero-link" href="#work">
              Explore our work <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="hero-proof" data-reveal>
            <ComparisonSlider priority />
          </div>
        </div>
      </section>

      <section
        className="featured-section section"
        id="work"
        aria-labelledby="featured-title"
      >
        <div className="page-shell featured-layout" data-reveal>
          <div className="featured-copy">
            <p className="eyebrow">Featured product</p>
            <h2 id="featured-title">Etchr</h2>
            <p className="featured-statement">
              Premium editorial portraits from real photographs.
            </p>
            <p className="featured-support">
              One photo. Multiple formats. Made for every platform you care
              about.
            </p>
            <a
              className="editorial-link"
              href="https://etchr.ai"
              target="_blank"
              rel="noreferrer"
            >
              Explore Etchr <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="device-stage">
            <EtchrDevice />
          </div>

          <div className="outputs-panel">
            <p className="outputs-kicker">One portrait. Every profile.</p>
            <div
              className="output-formats"
              role="group"
              aria-label="Etchr portrait crops for social platforms"
              tabIndex={0}
            >
              {outputFormats.map((format) => (
                <figure className="output-format" key={format.platform}>
                  <div className={`output-image ${format.className}`}>
                    <Image
                      src="/etchr-after.jpg"
                      alt={`${format.platform} portrait crop created from the Etchr output`}
                      fill
                      sizes="(max-width: 720px) 28vw, 120px"
                    />
                  </div>
                  <figcaption>{format.platform}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="philosophy-section section"
        id="philosophy"
        aria-labelledby="philosophy-title"
      >
        <div className="page-shell philosophy-layout" data-reveal>
          <div className="invitation-copy">
            <p className="eyebrow">Studio philosophy</p>
            <h2 id="philosophy-title">
              Have a good idea?
              <a href="mailto:hello@1118.io">Reach out.</a>
            </h2>
            <p>
              We usually build our own products. But when an idea is unusually
              strong—and the fit is right—we’re always open to a conversation.
            </p>
          </div>

          <div
            className="studio-artifact"
            role="group"
            aria-label="1118 product-making principles"
          >
            <span className="artifact-label">Product memo / 01</span>
            <ol>
              <li>
                <span>Idea</span>
                <strong>Is it worth making?</strong>
              </li>
              <li>
                <span>Proof</span>
                <strong>Can it become real?</strong>
              </li>
              <li>
                <span>Product</span>
                <strong>Will it endure?</strong>
              </li>
            </ol>
            <svg
              className="artifact-line"
              viewBox="0 0 420 180"
              aria-hidden="true"
            >
              <path d="M8 155 C92 150 118 98 186 105 C254 112 266 42 408 22" />
              <circle cx="408" cy="22" r="6" />
            </svg>
          </div>

          <ol className="beliefs-list">
            {beliefs.map((belief, index) => (
              <li key={belief}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{belief}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        className="products-section section"
        aria-labelledby="products-title"
      >
        <div className="page-shell" data-reveal>
          <div className="products-heading">
            <p className="eyebrow">Our products</p>
            <h2 id="products-title">Original products. Real companies.</h2>
          </div>

          <div className="product-index">
            {products.map((product, index) => (
              <article
                className={`product-row${product.name === "Etchr" ? " product-row-live" : ""}`}
                key={product.name}
              >
                <span className="product-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {product.name === "Etchr" && (
                  <div className="product-thumbnail" aria-hidden="true">
                    <Image
                      src="/etchr-after.jpg"
                      alt=""
                      fill
                      sizes="150px"
                    />
                  </div>
                )}
                <h3>{product.name}</h3>
                {"description" in product && (
                  <p className="product-description">{product.description}</p>
                )}
                <span
                  className={`product-status${product.status === "Live" ? " product-status-live" : ""}`}
                >
                  {product.status}
                </span>
                {"href" in product && (
                  <a
                    className="product-link"
                    href={product.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Explore Etchr"
                  >
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="escape-story"
        id="about"
        aria-labelledby="escape-title"
        data-reveal
      >
        <Image
          className="earth-image"
          src="/studio/earth-daylight.jpg"
          alt="Daylight view of Earth’s curved horizon and atmosphere"
          fill
          sizes="100vw"
        />
        <div className="earth-wash" aria-hidden="true" />
        <svg
          className="escape-trajectory"
          viewBox="0 0 1200 640"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="trajectory-path"
            d="M610 595 C720 490 808 370 880 256 C952 142 1038 80 1184 34"
          />
          <circle className="trajectory-origin" cx="610" cy="595" r="7" />
          <circle className="trajectory-tip" cx="1184" cy="34" r="8" />
        </svg>

        <div className="page-shell escape-copy">
          <p className="eyebrow">The meaning behind our name</p>
          <p className="escape-metric">11.18 km/s</p>
          <h2 id="escape-title">Escape velocity from Earth.</h2>
          <p>
            11.18 kilometers per second is approximately the speed required to
            escape Earth’s gravitational pull without further propulsion.
          </p>
          <p className="escape-belief">
            We believe every meaningful idea has an escape velocity—a point
            where momentum compounds and possibility becomes progress.
          </p>
        </div>
      </section>
    </main>
  );
}
