import Image from "next/image";
import { ComparisonSlider } from "@/components/ComparisonSlider";
import { ContactForm } from "@/components/ContactForm";
import { MotionController } from "@/components/MotionController";
import { SiteHeader } from "@/components/SiteHeader";
import { WorksGallery } from "@/components/WorksGallery";

function Logo({ priority = false }: { priority?: boolean }) {
  return (
    <Image
      src="/brand/1118-logo-transparent.png"
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
      <MotionController />
      <SiteHeader />

      <main id="main-content">
        <section
          className="chapter arrival"
          id="top"
          aria-labelledby="arrival-title"
          data-header-theme="light"
        >
          <div className="arrival-copy">
            <h1 id="arrival-title">
              <span className="arrival-line arrival-line-one">We build</span>
              <span className="arrival-line arrival-line-two">the software</span>
              <span className="arrival-line arrival-line-three">
                we keep looking for.
              </span>
            </h1>
            <div className="arrival-aftercopy">
              <p>Original products. Built with conviction.</p>
              <a className="editorial-link" href="#works">
                Explore our work <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          <div className="arrival-visual">
            <ComparisonSlider />
          </div>
        </section>

        <section
          className="chapter etchr"
          id="work"
          aria-labelledby="etchr-title"
          data-header-theme="dark"
        >
          <div className="etchr-atmosphere scene-settle" aria-hidden="true" />
          <div className="etchr-copy reveal" data-reveal>
            <h2 id="etchr-title">Etchr</h2>
            <p className="etchr-lede">
              Premium editorial portraits
              <br />
              from real photographs.
            </p>
            <p className="etchr-body">
              One photograph becomes a complete visual identity—refined for
              every platform that matters.
            </p>
            <a
              className="editorial-link editorial-link-light"
              href="https://etchr.ai"
              target="_blank"
              rel="noreferrer"
            >
              Explore Etchr <span aria-hidden="true">→</span>
            </a>
          </div>

          <div className="etchr-stage" aria-label="Etchr portrait formats">
            <figure className="etchr-device product-object" data-reveal>
              <Image
                src="/etchr/etchr-macbook.png"
                alt="Etchr homepage and editorial portrait experience displayed on a MacBook Pro"
                width={2088}
                height={1204}
                sizes="(max-width: 800px) 118vw, 68vw"
              />
            </figure>

            <figure className="etchr-output etchr-output-professional product-object" data-reveal>
              <Image
                src="/etchr/portrait-professional.png"
                alt="Etchr professional portrait format"
                fill
                sizes="(max-width: 780px) 34vw, 14vw"
              />
              <figcaption>Professional</figcaption>
            </figure>
            <figure className="etchr-output etchr-output-square product-object" data-reveal>
              <Image
                src="/etchr/portrait-square.png"
                alt="Etchr square social portrait format"
                fill
                sizes="(max-width: 780px) 32vw, 12vw"
              />
              <figcaption>Square</figcaption>
            </figure>
            <figure className="etchr-output etchr-output-vertical product-object" data-reveal>
              <Image
                src="/etchr/portrait-vertical.png"
                alt="Etchr vertical portrait format"
                fill
                sizes="(max-width: 780px) 30vw, 10vw"
              />
              <figcaption>Vertical</figcaption>
            </figure>
          </div>
        </section>

        <section
          className="chapter belief"
          id="about"
          aria-labelledby="belief-title"
          data-header-theme="dark"
        >
          <div className="belief-field scene-settle" aria-hidden="true" />
          <div className="belief-shade" aria-hidden="true" />
          <div className="belief-copy reveal" data-reveal>
            <h2 id="belief-title">
              We build things
              <br />
              that deserve to exist.
            </h2>
            <div className="belief-principles">
              <p>Fewer things.</p>
              <p>Deeper work.</p>
              <p>Delete before adding.</p>
              <p>The product is the proof.</p>
            </div>
          </div>
        </section>

        <section
          className="chapter works"
          id="works"
          aria-labelledby="works-title"
          data-header-theme="light"
        >
          <header className="works-heading reveal" data-reveal>
            <h2 id="works-title">
              <span>Original products.</span>
              <span>Real companies.</span>
            </h2>
          </header>
          <WorksGallery />
        </section>

        <section
          className="chapter escape"
          id="1118"
          aria-labelledby="escape-title"
          data-header-theme="dark"
        >
          <Image
            className="escape-image escape-image-desktop scene-settle"
            src="/studio/earth-escape-desktop.jpg"
            alt="The enormous curve of Earth meeting open space"
            fill
            sizes="100vw"
          />
          <Image
            className="escape-image escape-image-tablet scene-settle"
            src="/studio/earth-escape-tablet.jpg"
            alt=""
            fill
            sizes="(max-width: 1120px) 100vw, 0px"
          />
          <Image
            className="escape-image escape-image-mobile scene-settle"
            src="/studio/earth-escape-mobile.jpg"
            alt=""
            fill
            sizes="(max-width: 800px) 100vw, 0px"
          />
          <div className="escape-shade" aria-hidden="true" />
          <div className="escape-copy reveal" data-reveal>
            <p className="chapter-index">The meaning behind our name</p>
            <p className="escape-number">
              11.18 <span>km/s</span>
            </p>
            <h2 id="escape-title">Escape velocity.</h2>
            <p className="escape-definition">
              The approximate speed required to escape Earth&apos;s gravitational
              pull.
            </p>
            <p className="escape-meaning">
              Every meaningful idea has an escape velocity—a point where
              momentum compounds and possibility becomes progress.
            </p>
          </div>
        </section>

        <section
          className="chapter invitation"
          id="contact"
          aria-labelledby="invitation-title"
          data-header-theme="light"
        >
          <div className="invitation-copy reveal" data-reveal>
            <h2 id="invitation-title">Have a good idea?</h2>
            <p>
              We usually build our own products. But when an idea is unusually
              strong—and the fit is right—we are always open to a conversation.
            </p>
            <a className="invitation-email" href="mailto:hello@1118.io">
              hello@1118.io
            </a>
          </div>
          <div className="invitation-form reveal" data-reveal>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="site-footer" data-header-theme="dark">
        <a className="footer-brand" href="#top" aria-label="1118 home">
          <Logo />
        </a>
        <div className="footer-meta">
          <span>1118, LLC</span>
          <span>New York</span>
          <a href="mailto:hello@1118.io">hello@1118.io</a>
          <span>© 2026</span>
        </div>
      </footer>
    </>
  );
}
