import Image from "next/image";
import { ComparisonSlider } from "@/components/ComparisonSlider";
import { ContactForm } from "@/components/ContactForm";
import { EscapeArc } from "@/components/EscapeArc";

const formats = [
  { name: "LinkedIn", className: "is-linkedin" },
  { name: "X", className: "is-x" },
  { name: "Instagram / Slack", className: "is-social" },
  { name: "TikTok", className: "is-tiktok" },
  { name: "YouTube", className: "is-youtube" },
] as const;

const works = [
  {
    name: "Reviews Engine",
    status: "Private beta",
    description:
      "A system for turning real customer feedback into polished, publishable proof.",
    image: "/work/reviews-engine-public-widget.png",
    imageAlt:
      "Published Reviews Engine testimonial widget for SkyPups dog training",
    visualClass: "is-reviews-engine",
  },
  {
    name: "Property Insights",
    status: "In review",
    description:
      "A decision surface that turns service requests into quote-ready property context.",
    image: "/work/property-insights-synthetic-dashboard.png",
    imageAlt:
      "Property Insights request detail using a synthetic product fixture",
    visualClass: "is-property-insights",
  },
  {
    name: "Manuscript",
    status: "In development",
    description:
      "A private workspace for shaping long-form work without losing its history.",
    image: "/work/manuscript-empty-editor.png",
    imageAlt: "Manuscript empty Add Writing workspace",
    visualClass: "is-manuscript",
  },
] as const;

function Logo({ priority = false }: { priority?: boolean }) {
  return (
    <Image
      src="/brand/1118-logo-blue.png"
      alt="1118"
      width={273}
      height={175}
      priority={priority}
    />
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" aria-label="1118 home">
            <Logo priority />
          </a>
          <nav className="site-nav" aria-label="Primary navigation">
            <a href="#work">Work</a>
            <a href="#belief">Belief</a>
            <a href="#1118">1118</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="shell-wide hero-layout">
            <div className="hero-copy">
              <h1 id="hero-title">
                <span>We build the software</span>
                <span>we keep looking for.</span>
              </h1>
              <div className="hero-intro">
                <p className="hero-belief">
                  We build things that deserve to exist.
                </p>
                <a className="text-link" href="#work">
                  Explore our work <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div className="hero-proof">
              <ComparisonSlider />
              <div className="proof-caption" aria-hidden="true">
                <span>One photograph</span>
                <span>Etchr editorial portrait</span>
              </div>
            </div>
          </div>
        </section>

        <section className="etchr-section" id="work" aria-labelledby="etchr-title">
          <div className="shell">
            <div className="chapter-head etchr-head">
              <div>
                <h2 id="etchr-title">Etchr</h2>
              </div>
              <div className="chapter-copy">
                <p className="chapter-statement">
                  Premium editorial portraits from real photographs.
                </p>
                <p>
                  One photo. Multiple formats. Made for every platform that
                  matters.
                </p>
                <a
                  className="text-link"
                  href="https://etchr.ai"
                  target="_blank"
                  rel="noreferrer"
                >
                  Explore Etchr <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>

            <div className="etchr-portrait">
              <Image
                src="/brand/hero-etchr-aligned.png"
                alt="Finished Etchr engraved editorial portrait"
                fill
                sizes="(max-width: 768px) 100vw, 72vw"
              />
              <span className="portrait-index" aria-hidden="true">
                01
              </span>
            </div>

            <div className="format-proof">
              <div className="format-intro">
                <p className="kicker">One portrait / every platform</p>
                <p>
                  The same finished artwork, composed for the places people
                  actually show up.
                </p>
              </div>

              <div className="format-grid">
                {formats.map((format) => (
                  <figure className={`format-item ${format.className}`} key={format.name}>
                    <div className={`format-crop ${format.className}`}>
                      <Image
                        src="/brand/hero-etchr-aligned.png"
                        alt=""
                        fill
                        sizes="(max-width: 520px) 76vw, 20vw"
                      />
                    </div>
                    <figcaption>{format.name}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="belief-section" id="belief" aria-labelledby="belief-title">
          <div className="shell belief-grid">
            <div className="belief-content">
              <h2 id="belief-title">We build things that deserve to exist.</h2>
              <div className="belief-copy">
                <div>
                  <p>
                    The world does not need more software.
                    <br />
                    It needs better software.
                  </p>
                  <p>
                    Software people trust.
                    <br />
                    Software people enjoy.
                    <br />
                    Software that quietly improves everyday life.
                  </p>
                </div>
                <p>
                  We build fewer things.
                  <br />
                  We go deeper.
                  <br />
                  We delete before adding.
                  <br />
                  The product is the proof.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="works-section" aria-labelledby="works-title">
          <div className="shell">
            <div className="works-head">
              <h2 id="works-title">
                Original products.
                <br />
                Real companies.
              </h2>
            </div>

            <article className="work-feature work-feature-etchr">
              <div className="work-feature-mark" aria-hidden="true">
                Etchr
              </div>
              <div className="work-feature-copy">
                <div>
                  <p className="work-number">01 / Live</p>
                  <h3>Etchr</h3>
                  <p>
                    Premium editorial portraits from real photographs, made
                    for every platform that matters.
                  </p>
                </div>
                <a
                  className="text-link"
                  href="https://etchr.ai"
                  target="_blank"
                  rel="noreferrer"
                >
                  etchr.ai <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>

            <div className="work-list">
              {works.map((work, index) => (
                <article className="work-row" key={work.name}>
                  <div className="work-row-copy">
                    <p className="work-number">
                      {String(index + 2).padStart(2, "0")} / {work.status}
                    </p>
                    <h3>{work.name}</h3>
                    <p>{work.description}</p>
                  </div>
                  <div className={`work-row-visual ${work.visualClass}`}>
                    <Image
                      src={work.image}
                      alt={work.imageAlt}
                      fill
                      sizes="(max-width: 820px) 100vw, 62vw"
                    />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="escape-section" id="1118" aria-labelledby="escape-title">
          <div className="earth-chapter">
            <Image
              src="/studio/earth-daylight.jpg"
              alt="Earth in daylight with a blue atmosphere and white clouds"
              fill
              sizes="100vw"
            />
            <div className="shell escape-overlay">
              <p className="kicker">The meaning behind our name</p>
              <p className="escape-number">
                11.18 <span>km/s</span>
              </p>
              <h2 id="escape-title">Escape velocity.</h2>
              <div className="escape-copy">
                <p>
                  The approximate speed required to escape Earth&apos;s
                  gravitational pull.
                </p>
                <p>
                  Every meaningful idea has an escape velocity—a point where
                  momentum compounds and possibility becomes progress.
                </p>
              </div>
            </div>
            <EscapeArc />
          </div>
        </section>

        <section className="invitation-section" id="contact" aria-labelledby="invitation-title">
          <div className="shell-wide invitation-grid">
            <div className="invitation-copy">
              <h2 id="invitation-title">
                Still looking for software
                <br />
                that does not exist?
              </h2>
              <p className="invitation-note">
                We usually build our own products. But when an idea is unusually
                strong—and the fit is right—we are always open to a conversation.
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <a className="footer-brand" href="#top" aria-label="1118 home">
            <Logo />
          </a>
          <div className="footer-meta">
            <p>1118 LLC</p>
            <p>New York</p>
            <a href="mailto:hello@1118.io">hello@1118.io</a>
            <a href="https://etchr.ai" target="_blank" rel="noreferrer">
              Etchr.ai
            </a>
            <p>© 2026</p>
          </div>
        </div>
      </footer>
    </>
  );
}
