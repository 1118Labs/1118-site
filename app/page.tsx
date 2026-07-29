import Image from "next/image";
import Link from "next/link";
import { ComparisonSlider } from "@/components/ComparisonSlider";
import { ProductPortfolio } from "@/components/ProductPortfolio";
import { SiteHeader } from "@/components/SiteHeader";

const appStoreUrl =
  "https://apps.apple.com/us/app/etchr-portraits/id6785615752";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "1118",
  legalName: "1118 LLC",
  url: "https://1118.io",
  email: "hello@1118.io",
  founder: {
    "@type": "Person",
    name: "Steve",
  },
};

const etchrSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Etchr Portraits",
  applicationCategory: "PhotoApplication",
  operatingSystem: "iOS",
  url: "https://etchr.ai",
  downloadUrl: appStoreUrl,
  description:
    "Etchr transforms a photo into a refined editorial portrait.",
  author: {
    "@type": "Organization",
    name: "1118",
  },
};

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main">
        <section className="arrival" aria-labelledby="arrival-title">
          <div className="shell arrival-grid">
            <div className="arrival-copy entrance-text">
              <p className="eyebrow">1118 · Product company</p>
              <h1 id="arrival-title">
                1118 builds and operates original digital products.
              </h1>
              <p className="body-lg">
                Public software, internal systems, and new products built for
                the long term.
              </p>
              <a className="text-link" href="#etchr">
                See what is live <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="arrival-proof image-settle">
              <ComparisonSlider />
            </div>
          </div>
        </section>

        <section
          className="etchr-section section-dark"
          id="etchr"
          aria-labelledby="etchr-title"
        >
          <div className="shell etchr-grid">
            <div className="etchr-copy entrance-text">
              <p className="eyebrow eyebrow-live">
                <span aria-hidden="true" />
                Featured product · Live
              </p>
              <h2 id="etchr-title">
                Etchr Portraits is live on the App Store.
              </h2>
              <p className="etchr-promise">
                Look like you belong in print.
              </p>
              <p className="body-lg">
                Etchr transforms a single photo into a refined editorial
                portrait—ready for profiles, websites, speaker bios, and the
                places your image represents you.
              </p>
              <div className="etchr-actions">
                <a
                  className="button-link button-link-primary"
                  href={appStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Download on the App Store
                  <span aria-hidden="true">↗</span>
                </a>
                <a
                  className="button-link button-link-secondary"
                  href="https://etchr.ai"
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit etchr.ai
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
            <div className="etchr-composition device-entrance">
              <Image
                className="etchr-device"
                src="/etchr/etchr-macbook.png"
                alt="Etchr portrait experience shown on a MacBook"
                width={2088}
                height={1204}
                sizes="(max-width: 900px) 100vw, 66vw"
              />
              <Image
                className="etchr-output etchr-output-square"
                src="/etchr/portrait-square.png"
                alt="Square Etchr editorial portrait"
                width={1024}
                height={1024}
                sizes="(max-width: 700px) 24vw, 180px"
              />
              <Image
                className="etchr-output etchr-output-vertical"
                src="/etchr/portrait-vertical.png"
                alt="Vertical Etchr editorial portrait"
                width={1024}
                height={1024}
                sizes="(max-width: 700px) 22vw, 170px"
              />
            </div>
          </div>
        </section>

        <section
          className="products"
          id="products"
          aria-labelledby="products-title"
        >
          <div className="shell">
            <div className="section-heading">
              <p className="eyebrow">What 1118 builds</p>
              <h2 id="products-title">
                A portfolio with honest edges.
              </h2>
              <p className="body-lg">
                Every product is labeled by its public status today. Work that
                is not ready to announce stays private.
              </p>
            </div>
            <ProductPortfolio />
          </div>
        </section>

        <section
          className="operating-model section-dark"
          id="model"
          aria-labelledby="model-title"
        >
          <div className="shell model-grid">
            <div className="model-intro entrance-text">
              <p className="eyebrow">Operating model</p>
              <h2 id="model-title">
                Founder-led.
                <br />
                AI-assisted.
                <br />
                Humanly accountable.
              </h2>
            </div>
            <div className="model-copy">
              <p className="body-lg">
                Steve sets direction and holds final review. AI systems help
                move research, design, engineering, and operations from brief
                to working software. Important claims and releases remain
                supervised.
              </p>
              <ol className="model-steps">
                <li>
                  <span>01</span>
                  <div>
                    <h3>Direction</h3>
                    <p>
                      Product priorities, standards, and final calls stay
                      founder-led.
                    </p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <h3>Execution</h3>
                    <p>
                      Specialized AI systems help turn clear briefs into
                      reviewable work.
                    </p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <h3>Review</h3>
                    <p>
                      Evidence is checked, releases are gated, and
                      accountability stays human.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </section>

        <section className="about" id="about" aria-labelledby="about-title">
          <div className="shell about-grid">
            <div>
              <p className="eyebrow">About</p>
              <h2 id="about-title">Built by 1118. Operated by 1118.</h2>
            </div>
            <div className="about-copy">
              <p className="body-lg">
                1118 is a product company founded by Steve in New York. It
                creates and operates its own digital products, from public
                consumer software to the internal systems behind the work.
              </p>
              <p>
                The aim is not to ship more things. It is to build fewer
                products, operate them seriously, and keep improving them after
                launch.
              </p>
            </div>
          </div>
        </section>

        <section className="escape" aria-labelledby="escape-title">
          <Image
            className="escape-image"
            src="/studio/earth-escape-desktop.jpg"
            alt="The curve of Earth meeting open space"
            fill
            sizes="100vw"
          />
          <div className="escape-shade" aria-hidden="true" />
          <div className="shell escape-inner entrance-text">
            <p className="eyebrow">The meaning behind the name</p>
            <p className="escape-number">
              11.18 <span>km/s</span>
            </p>
            <h2 id="escape-title">Escape velocity.</h2>
            <p className="escape-copy">
              The point where momentum becomes enough to break free.
            </p>
          </div>
        </section>

        <section
          className="contact"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="shell contact-grid">
            <div className="contact-copy entrance-text">
              <p className="eyebrow">Contact</p>
              <h2 id="contact-title">Contact 1118.</h2>
              <p className="body-lg">
                For company, partnership, press, or developer inquiries, write
                to:
              </p>
              <a className="contact-email" href="mailto:hello@1118.io">
                hello@1118.io
              </a>
            </div>
            <div className="contact-aside">
              <p className="eyebrow">Etchr support</p>
              <p>
                Need help with an Etchr portrait or the iPhone app? Use Etchr’s
                product support page.
              </p>
              <a
                className="text-link"
                href="https://etchr.ai/support"
                target="_blank"
                rel="noreferrer"
              >
                Visit Etchr support <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-grid">
          <div className="footer-brand">
            <Image
              src="/brand/1118-logo-transparent.png"
              alt="1118"
              width={116}
              height={74}
            />
            <p>
              1118 LLC
              <br />
              New York
            </p>
          </div>
          <div className="footer-links">
            <nav aria-label="Products">
              <a href="https://etchr.ai">Etchr</a>
              <a href={appStoreUrl}>App Store</a>
            </nav>
            <nav aria-label="Company">
              <a href="#model">Operating model</a>
              <a href="#about">About</a>
              <a href="mailto:hello@1118.io">Contact</a>
            </nav>
            <nav aria-label="Legal">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/accessibility">Accessibility</Link>
            </nav>
          </div>
          <p className="footer-legal">
            © {new Date().getFullYear()} 1118 LLC
          </p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, etchrSchema]),
        }}
      />
    </>
  );
}
