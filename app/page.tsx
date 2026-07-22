import Image from "next/image";
import Link from "next/link";
import { ComparisonSlider } from "@/components/ComparisonSlider";
import { ContactForm } from "@/components/ContactForm";
import { ProductStories } from "@/components/ProductStories";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <SiteHeader />
      <main id="main">
        <section className="arrival" aria-labelledby="arrival-title">
          <div className="shell arrival-grid">
            <div className="arrival-copy entrance-text">
              <h1 id="arrival-title">We build the software<br />we keep looking for.</h1>
              <p className="body-lg">Original products. Built with conviction.</p>
              <a className="text-link" href="#work">Explore our work <span aria-hidden="true">→</span></a>
            </div>
            <div className="arrival-proof image-settle"><ComparisonSlider /></div>
          </div>
        </section>

        <section className="etchr-section section-dark" aria-labelledby="etchr-title">
          <div className="shell etchr-grid">
            <div className="etchr-copy entrance-text">
              <p className="eyebrow">Etchr</p>
              <h2 id="etchr-title">Premium editorial portraits<br />from real photographs.</h2>
              <p className="body-lg">One photograph becomes a complete visual identity—refined for every platform that matters.</p>
              <a className="text-link text-link-light" href="https://etchr.ai">Explore Etchr <span aria-hidden="true">→</span></a>
            </div>
            <div className="etchr-composition device-entrance">
              <Image className="etchr-device" src="/etchr/etchr-macbook.png" alt="Etchr portrait editor shown on a MacBook" width={2088} height={1204} sizes="(max-width: 900px) 100vw, 66vw" />
              <Image className="etchr-output etchr-output-square" src="/etchr/portrait-square.png" alt="Square Etchr editorial portrait output" width={1024} height={1024} sizes="180px" />
              <Image className="etchr-output etchr-output-vertical" src="/etchr/portrait-vertical.png" alt="Vertical Etchr editorial portrait output" width={1024} height={1024} sizes="170px" />
            </div>
          </div>
        </section>

        <section className="philosophy" id="philosophy" aria-labelledby="philosophy-title">
          <div className="philosophy-field" aria-hidden="true" />
          <div className="shell philosophy-inner entrance-text">
            <h2 id="philosophy-title">We build things<br />that deserve to exist.</h2>
            <ul className="principles">
              <li>Fewer things. Deeper work.</li>
              <li>Delete before adding.</li>
              <li>The product is the proof.</li>
            </ul>
          </div>
        </section>

        <section className="products" id="work" aria-labelledby="products-title">
          <div className="shell">
            <h2 id="products-title" className="products-heading">Original products.<br />Real companies.</h2>
            <ProductStories />
          </div>
        </section>

        <section className="lineage" aria-labelledby="lineage-title">
          <div className="shell lineage-grid">
            <h2 id="lineage-title">Built before.<br />Building still.</h2>
            <div className="lineage-positions" aria-label="Future work"><p>Signal</p><p>Playbook</p></div>
          </div>
        </section>

        <section className="escape" aria-labelledby="escape-title">
          <picture className="escape-plate">
            <source media="(max-width: 600px)" srcSet="/studio/earth-escape-mobile.jpg" />
            <source media="(max-width: 1024px)" srcSet="/studio/earth-escape-tablet.jpg" />
            <img src="/studio/earth-escape-desktop.jpg" alt="" />
          </picture>
          <div className="escape-shade" aria-hidden="true" />
          <div className="shell escape-inner entrance-text">
            <p className="eyebrow">The meaning behind our name</p>
            <p className="escape-number">11.18 km/s</p>
            <h2 id="escape-title">Escape velocity.</h2>
            <p className="escape-copy">Every meaningful idea reaches a point<br className="desktop-only" /> where momentum compounds and possibility<br className="desktop-only" /> becomes progress.</p>
          </div>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-title">
          <div className="shell contact-grid">
            <div className="contact-copy entrance-text">
              <h2 id="contact-title">Start a conversation.</h2>
              <p className="body-lg">Most of what we build is our own.</p>
              <p className="body-lg">We partner selectively—when the idea is strong, the problem is meaningful and the fit is right.</p>
              <a className="contact-email" href="mailto:hello@1118.io">hello@1118.io</a>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <Image src="/brand/1118-logo-transparent.png" alt="1118" width={116} height={74} />
            <p>1118, LLC<br />New York</p>
            <a href="mailto:hello@1118.io">hello@1118.io</a>
          </div>
          <nav aria-label="Legal"><Link href="/accessibility">Accessibility</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></nav>
          <p className="footer-legal">© {new Date().getFullYear()} 1118, LLC</p>
        </div>
      </footer>
    </>
  );
}
