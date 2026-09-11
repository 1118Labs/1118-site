import type { ReactNode } from 'react';
import PortraitStory from './PortraitStory';
import SignalWorkstation from './SignalWorkstation';
import portraitResult from '../assets/showcase/portrait/elise-result.webp';
import portraitIcon from '../assets/showcase/portrait/portrait-app-icon.png';
import signalOverview from '../assets/showcase/signal/signal-archival-interface.png';
import signalHistory from '../assets/showcase/signal/signal-historical-data-2019.png';
import signalStructures from '../assets/showcase/signal/signal-manage-structures-2019.png';
import appStoreBadge from '../assets/showcase/etchr/download-on-the-app-store.svg';
import { signalStory } from '../content/case-studies';
import './CaseStudies.css';

const appStoreUrl = 'https://apps.apple.com/us/app/etchr-portraits/id6785615752';

function CaseSection({ number, label, title, children, className = '' }: {
  number: string; label: string; title: string; children: ReactNode; className?: string;
}) {
  return <section className={`case-section ${className}`} aria-labelledby={`case-heading-${number}`}>
    <div className="case-section-heading">
      <p className="case-kicker">{number} / {label}</p>
      <h2 id={`case-heading-${number}`}>{title}</h2>
    </div>
    <div className="case-section-body">{children}</div>
  </section>;
}

function CaseEnd({ current }: { current: 'portrait' | 'signal' }) {
  return <nav className="case-next" aria-label="More work">
    <a href="/work">All work <span aria-hidden="true">↗</span></a>
    <a href={current === 'portrait' ? '/work/signal' : '/work/portrait'}>
      {current === 'portrait' ? 'Next: Signal' : 'Next: Portrait'} <span aria-hidden="true">→</span>
    </a>
  </nav>;
}

function WorkIndex() {
  return <article className="work-index">
    <header className="work-index-header case-shell">
      <p className="case-kicker">1118 / Selected work</p>
      <h1>The product<br />is the proof.</h1>
      <p className="case-intro">Original software, from consumer products to specialized systems. A closer look at what we built—and why.</p>
    </header>
    <div className="work-features">
      <article className="work-feature work-feature-portrait">
        <a className="work-feature-link case-shell" href="/work/portrait">
          <div className="work-feature-copy">
            <p className="case-kicker">Portrait / Live</p>
            <h2>From a photograph<br />to an editorial portrait.</h2>
            <p>A product built around the transformation—and the finished image you take with you.</p>
            <span className="case-text-link">Explore Portrait <span aria-hidden="true">→</span></span>
          </div>
          <div className="work-feature-image"><img src={portraitResult} width="1024" height="1024" alt="Elise shown as a finished Portrait editorial illustration" loading="lazy" decoding="async" /></div>
        </a>
      </article>
      <article className="work-feature work-feature-signal">
        <a className="work-feature-link case-shell" href="/work/signal">
          <div className="work-feature-copy">
            <p className="case-kicker">Signal / Built · Licensed · Acquired</p>
            <h2>Quantitative workflows,<br />made visual.</h2>
            <p>Domain expertise translated into an analytics platform used in live markets.</p>
            <span className="case-text-link">Explore Signal <span aria-hidden="true">→</span></span>
          </div>
          <div className="work-feature-image"><img src={signalOverview} width="2167" height="1046" alt="Authentic Signal seasonal and correlation analysis interface from 2019" loading="lazy" decoding="async" /></div>
        </a>
      </article>
    </div>
    <section className="work-more case-shell" aria-labelledby="work-more-title">
      <h2 id="work-more-title">More from 1118.</h2>
      <div><a href="/#reviews-engine">Reviews Engine <span aria-hidden="true">↗</span></a><p>Live review collection, moderation, and publishing.</p></div>
      <div><a href="/#property-insights">Property Insights <span aria-hidden="true">↗</span></a><p>Property context and operator decision support.</p></div>
    </section>
  </article>;
}

function PortraitCase() {
  return <article className="case-page case-portrait">
    <header className="case-hero case-shell">
      <a className="case-back" href="/work">← Selected work</a>
      <p className="case-kicker">01 / Project</p>
      <div className="case-product-name"><img src={portraitIcon} width="64" height="64" alt="" /><span>Portrait</span></div>
      <h1>Editorial portraits<br />from real photographs.</h1>
      <p className="case-intro">A photograph is the starting point. The product brings together the transformation, the app experience, and the finished portrait you can save and use.</p>
    </header>
    <figure className="case-portrait-hero case-shell">
      <img src={portraitResult} alt="A finished Portrait of Elise, with detailed editorial line work" width="1024" height="1024" decoding="async" fetchPriority="high" />
      <figcaption>Finished Portrait output · Elise · Studio example</figcaption>
    </figure>
    <div className="case-shell">
      <CaseSection number="02" label="Problem" title="A photograph is only the beginning.">
        <p>A portrait needs to work beyond the moment it is made: in a profile, on a website, or wherever someone chooses to represent themselves.</p>
        <p>The product challenge was to make an editorial transformation feel approachable, then make the result easy to keep and use.</p>
      </CaseSection>
      <CaseSection number="03" label="Product idea" title="Make the transformation the experience.">
        <p>Start with a clear photograph. Turn it into a finished editorial portrait. Keep the journey focused on the image, from the first comparison to the final output.</p>
      </CaseSection>
      <CaseSection number="04" label="What 1118 built" title="The portrait, and the product around it.">
        <p>1118 brought product design, an AI image-generation workflow, and the app experience together in Portrait.</p>
        <p>The work extends beyond producing an image: it includes how someone starts, understands the result, and takes a finished portrait into their own world.</p>
      </CaseSection>
    </div>
    <section className="case-experience case-shell" aria-labelledby="portrait-experience-title">
      <p className="case-kicker">05 / Product experience</p>
      <h2 id="portrait-experience-title">Photo. Portrait.<br />Ready to use.</h2>
      <p className="case-intro">The original photograph, the editorial result, and the finished formats—shown with actual Portrait assets.</p>
      <PortraitStory variant="case-study" />
    </section>
    <div className="case-shell">
      <CaseSection number="06" label="Outcome" title="A live consumer product.">
        <p>Portrait is available through the App Store, with a public product experience at getportrait.ai.</p>
        <p>The result is software people can use, with a complete experience around creating and keeping their portraits.</p>
      </CaseSection>
      <CaseSection number="07" label="Status" title="Live.">
        <p>Explore the current product and its App Store listing.</p>
        <div className="case-actions"><a className="case-button" href="https://getportrait.ai" target="_blank" rel="noreferrer">Visit Portrait <span aria-hidden="true">↗</span></a><a className="case-store-link" href={appStoreUrl} target="_blank" rel="noreferrer"><img src={appStoreBadge} alt="Download Portrait on the App Store" width="150" height="50" /></a></div>
      </CaseSection>
      <CaseEnd current="portrait" />
    </div>
  </article>;
}

function SignalCase() {
  return <article className="case-page case-signal">
    <header className="case-hero case-shell">
      <a className="case-back" href="/work">← Selected work</a>
      <p className="case-kicker">01 / Project · Signal</p>
      <h1>Quantitative workflows,<br />made visual.</h1>
      <p className="case-intro">{signalStory}</p>
    </header>
    <div className="case-signal-hero case-shell"><SignalWorkstation /></div>
    <div className="case-shell">
      <CaseSection number="02" label="Problem" title="Make complex relationships easier to explore.">
        <p>Commodities analysis brings together different contracts, time periods, and market relationships. Signal was built to make those quantitative workflows visual.</p>
        <p>The opportunity was to translate domain expertise into a workspace for exploring the data behind a trade idea.</p>
      </CaseSection>
      <CaseSection number="03" label="Product idea" title="Data as a starting point for investigation.">
        <p>Signal combined data, quantitative analysis, and machine learning to help uncover compelling trade ideas.</p>
        <p>Historical, seasonal, and correlation views gave different perspectives on the same analytical question.</p>
      </CaseSection>
      <CaseSection number="04" label="What 1118 built" title="A visual workspace for quantitative analysis.">
        <p>1118 designed, built, and launched the platform. The interface brought analytical structures, time-window selection, charting, and detailed comparisons into one product.</p>
        <p>The original screens show how a user could define contracts and metrics, adjust expirations and time shifts, and explore the resulting relationships.</p>
      </CaseSection>
    </div>
    <section className="case-experience case-shell" aria-labelledby="signal-experience-title">
      <p className="case-kicker">05 / Product experience</p>
      <h2 id="signal-experience-title">From a structure<br />to a clearer view.</h2>
      <div className="case-workflow"><div><span>01</span><h3>Define the structure.</h3><p>Choose the contract, metric, expiration, and time shift.</p></div><div><span>02</span><h3>Explore the history.</h3><p>Set a time window and examine changes across the selected series.</p></div><div><span>03</span><h3>Compare relationships.</h3><p>Move between historical, seasonal, and correlation views.</p></div></div>
      <figure className="case-archive-figure"><a href={signalHistory} target="_blank" rel="noreferrer" aria-label="Open full-size Signal historical data screenshot"><img src={signalHistory} alt="Authentic Signal historical-data screen with selectable analytical structures, time-series charts, and a time-range navigator" width="2329" height="984" loading="lazy" decoding="async" /></a><figcaption>Historical data and time-window exploration · Authentic Signal interface, August 2019 <a href={signalHistory} target="_blank" rel="noreferrer">View full image ↗</a></figcaption></figure>
      <div className="case-archive-detail"><figure className="case-archive-figure"><a href={signalStructures} target="_blank" rel="noreferrer" aria-label="Open full-size Signal Manage Structures screenshot"><img src={signalStructures} alt="Authentic Signal Manage Structures dialog showing contract, expiration, skew, time-shift, and metric controls" width="1211" height="843" loading="lazy" decoding="async" /></a><figcaption>Manage Structures · Authentic Signal interface, August 2019 <a href={signalStructures} target="_blank" rel="noreferrer">View full image ↗</a></figcaption></figure><div><h3>The analytical choices stay visible.</h3><p>The structure editor makes the ingredients of an analysis explicit. Its controls connect the market question to the data shown in the workspace.</p></div></div>
    </section>
    <div className="case-shell">
      <CaseSection number="06" label="Outcome" title="Used. Licensed. Acquired.">
        <p>The platform was used in live markets, licensed commercially, and later acquired.</p>
        <p>Signal is part of 1118's history of turning specialized expertise into working software and bringing it into commercial use.</p>
      </CaseSection>
      <CaseSection number="07" label="Status" title="Built · Licensed · Acquired.">
        <p>Signal is presented here as historical work. The product screens are authentic archives from 2019.</p>
        <a className="case-text-link" href="/#contact">Start a conversation <span aria-hidden="true">→</span></a>
      </CaseSection>
      <CaseEnd current="signal" />
    </div>
  </article>;
}

export default function CaseStudies({ pathname }: { pathname: string }) {
  if (pathname === '/work/portrait') return <PortraitCase />;
  if (pathname === '/work/signal') return <SignalCase />;
  return <WorkIndex />;
}
