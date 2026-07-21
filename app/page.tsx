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
    description:
      "A reputation platform that turns customer feedback into measurable growth.",
    support: null,
    image: "/work/reviews-engine-public-widget.png",
    imageAlt:
      "Published Reviews Engine testimonial widget for SkyPups dog training",
    visualClass: "is-reviews-engine",
  },
  {
    name: "Property Insights",
    description:
      "Turn service requests into quote-ready property intelligence.",
    support: "Built for home-service teams working inside leading CRMs.",
    image: "/work/property-insights-synthetic-dashboard.png",
    imageAlt:
      "Property Insights request detail using a synthetic product fixture",
    visualClass: "is-property-insights",
  },
  {
    name: "Manuscript",
    description:
      "A living archive for your writing, ideas, and intellectual life.",
    support: null,
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
        <div className="header-inner">
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
          <div className="hero-layout">
            <div className="hero-copy">
              <h1 id="hero-title">
                <span>We build</span>
                <span>the software</span>
                <em>we keep</em>
                <em>looking for.</em>
              </h1>
              <p className="hero-belief">
                We build things that deserve to exist.
              </p>
              <a className="text-link" href="#work">
                Explore our work <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="hero-proof">
              <ComparisonSlider />
            </div>
          </div>
        </section>

        <section className="etchr-section" id="work" aria-labelledby="etchr-title">
          <div className="etchr-layout">
            <div className="etchr-copy">
              <p className="kicker">First work</p>
              <h2 id="etchr-title">Etchr</h2>
              <p className="etchr-statement">
                Premium editorial portraits from real photographs.
              </p>
              <p className="etchr-support">
                One photo. Multiple formats. Made for every platform that
                matters.
              </p>
              <a
                className="text-link text-link-light"
                href="https://etchr.ai"
                target="_blank"
                rel="noreferrer"
              >
                Explore Etchr <span aria-hidden="true">→</span>
              </a>
            </div>

            <figure className="etchr-campaign-portrait">
              <Image
                src="/brand/hero-etchr-aligned.png"
                alt="Finished Etchr engraved editorial portrait"
                fill
                sizes="(max-width: 820px) 100vw, 34vw"
              />
            </figure>

            <div className="format-composition" aria-label="Etchr platform formats">
              <p className="format-heading">One portrait. Every platform.</p>
              <div className="format-grid">
                {formats.map((format) => (
                  <figure className={`format-item ${format.className}`} key={format.name}>
                    <div className="format-crop">
                      <Image
                        src="/brand/hero-etchr-aligned.png"
                        alt=""
                        fill
                        sizes="(max-width: 520px) 78vw, 20vw"
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
          <div className="belief-layout">
            <h2 id="belief-title">
              We build things
              <br />
              that deserve to exist.
            </h2>
            <div className="belief-copy">
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
              <p>
                We build fewer things.
                <br />
                We go deeper.
                <br />
                We delete before adding.
              </p>
              <p className="belief-proof">The product is the proof.</p>
            </div>
          </div>
        </section>

        <section className="works-section" aria-labelledby="works-title">
          <div className="works-layout">
            <header className="works-head">
              <h2 id="works-title">
                <span>Original products.</span>
                <span>Real companies.</span>
              </h2>
            </header>

            <div className="works-composition">
              {works.map((work) => (
                <article className={`work-proof ${work.visualClass}`} key={work.name}>
                  <div className="work-proof-copy">
                    <h3>{work.name}</h3>
                    <p>{work.description}</p>
                    {work.support ? <p className="work-support">{work.support}</p> : null}
                  </div>
                  <div className="work-proof-visual">
                    <Image
                      src={work.image}
                      alt={work.imageAlt}
                      fill
                      sizes="(max-width: 820px) 100vw, 27vw"
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
            <div className="escape-overlay">
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
          <div className="invitation-grid">
            <div className="invitation-copy">
              <h2 id="invitation-title">Have a good idea?</h2>
              <p>
                We usually build our own products. But when an idea is unusually
                strong—and the fit is right—we are always open to a conversation.
              </p>
              <a className="invitation-email" href="mailto:hello@1118.io">
                hello@1118.io
              </a>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <a className="footer-brand" href="#top" aria-label="1118 home">
            <Logo />
          </a>
          <div className="footer-meta">
            <p>1118, LLC</p>
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
