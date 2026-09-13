import type { ReactNode } from 'react';
import rowanPortrait from '../assets/showcase/portrait/rowan-result.webp';
import theoPortrait from '../assets/showcase/portrait/theo-result.webp';
import grahamPortrait from '../assets/showcase/portrait/graham-result.webp';
import PortraitStory from './PortraitStory';
import SignalWorkstation from './SignalWorkstation';
import portraitResult from '../assets/showcase/portrait/elise-result.webp';
import portraitIcon from '../assets/showcase/portrait/portrait-native-icon.png';
import signalOverview from '../assets/showcase/signal/signal-archival-interface.png';
import signalHistory from '../assets/showcase/signal/signal-historical-data-2019.png';
import signalStructures from '../assets/showcase/signal/signal-manage-structures-2019.png';
import appStoreBadge from '../assets/showcase/etchr/download-on-the-app-store.svg';
import { productStatus } from '../content/product-status';
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
      <h1>What we’ve built.</h1>
      <p className="case-intro">Each began with an idea for something we thought should exist.</p>
    </header>
    <div className="work-features">
      <article className="work-feature work-feature-portrait">
        <a className="work-feature-link case-shell" href="/work/portrait">
          <div className="work-feature-copy">
            <p className="case-kicker">Portrait / {productStatus.portrait}</p>
            <h2>We made AI portraits<br />feel worthy of print.</h2>
            <p>Most AI-generated portraits still look unmistakably generated. Portrait starts with one real photograph and turns it into a refined editorial portrait designed to look like you—and look good enough to publish.</p>
            <span className="case-text-link">Explore Portrait <span aria-hidden="true">→</span></span>
          </div>
          <div className="work-feature-image"><img src={portraitResult} width="1024" height="1024" alt="Elise shown as a finished Portrait editorial illustration" loading="lazy" decoding="async" /></div>
        </a>
      </article>
      <article className="work-feature work-feature-signal">
        <a className="work-feature-link case-shell" href="/work/signal">
          <div className="work-feature-copy">
            <p className="case-kicker">Signal / {productStatus.signal}</p>
            <h2>We built a better way<br />to uncover commodities trade&nbsp;ideas.</h2>
            <p>Signal began with a sophisticated quantitative trading process and a question: could that way of analyzing markets be turned into a visual software product?</p>
            <span className="case-text-link">Explore Signal <span aria-hidden="true">→</span></span>
          </div>
          <div className="work-feature-image"><img src={signalOverview} width="2167" height="1046" alt="Authentic Signal seasonal and correlation analysis interface from 2019" loading="lazy" decoding="async" /></div>
        </a>
      </article>
    </div>
    <section className="work-more case-shell" aria-labelledby="work-more-title">
      <h2 id="work-more-title">More from 1118.</h2>
      <div><a href="/#reviews-engine">Reviews Engine <span aria-hidden="true">↗</span></a><p>A platform that turns scattered customer feedback into clean, controlled, embeddable proof.</p></div>
      <div><p className="case-product-status">{productStatus["property-insights"]}</p><a href="/#property-insights">Property Insights <span aria-hidden="true">↗</span></a><p>Better quoting starts with better context.</p></div>
    </section>
  </article>;
}

function PortraitCase() {
  return <article className="case-page case-portrait">
    <header className="case-hero case-shell">
      <a className="case-back" href="/work">← Selected work</a>
      <p className="case-kicker">{productStatus.portrait}</p>
      <div className="case-product-name"><img src={portraitIcon} width="64" height="64" alt="" /><span>Portrait</span></div>
      <h1>We made AI portraits<br />feel worthy of print.</h1>
      <p className="case-intro">Most AI-generated portraits still look unmistakably generated. Portrait starts with one real photograph and turns it into a refined editorial portrait designed to look like you—and look good enough to publish.</p>
    </header>
    <figure className="case-portrait-hero case-shell">
      <img src={portraitResult} alt="A finished Portrait of Elise, with detailed editorial line work" width="1024" height="1024" decoding="async" fetchPriority="high" />
      <figcaption>Finished Portrait output · Elise · Studio example</figcaption>
    </figure>
    <div className="case-shell">
      <CaseSection number="02" label="Portrait" title="The gap.">
        <p>Most AI-generated portraits still look unmistakably generated—too synthetic, too stylized, or too far from the person in the original photograph.</p>
      </CaseSection>
      <CaseSection number="03" label="Portrait" title="The idea.">
        <p>Create an editorial portrait from one real photograph while preserving the person, expression, and character that made the photograph theirs.</p>
      </CaseSection>
      <CaseSection number="04" label="Portrait" title="What we built.">
        <p>Portrait takes users from source photograph to finished editorial portrait, then prepares that portrait for the places people actually use it—profiles, websites, social media, and print.</p>
      </CaseSection>
    </div>
    <section className="case-experience case-shell" aria-labelledby="portrait-experience-title">
      <p className="case-kicker">05 / Product experience</p>
      <h2 id="portrait-experience-title">Product experience.</h2>
      <p className="case-intro">The source photograph, transformation, and finished profile formats from Portrait.</p>
      <PortraitStory variant="case-study" />
      <div className="case-portrait-gallery">{[{name:'Rowan',src:rowanPortrait},{name:'Theo',src:theoPortrait},{name:'Graham',src:grahamPortrait}].map(item=><figure key={item.name}><a href="https://getportrait.ai/gallery" target="_blank" rel="noreferrer"><img src={item.src} width="1024" height="1024" alt={`${item.name}, approved Portrait studio example`} loading="lazy" decoding="async" /></a><figcaption>{item.name} · Studio example</figcaption></figure>)}</div>
    </section>
    <div className="case-shell">
      <CaseSection number="06" label="Portrait" title="Product outcome.">
        <p>A finished portrait that feels composed enough to publish and familiar enough to still feel like you.</p>
      </CaseSection>
      <CaseSection number="07" label="Status" title="App Store.">
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
      <p className="case-kicker">Signal · {productStatus.signal}</p>
      <h1>We built a better way<br />to uncover commodities trade&nbsp;ideas.</h1>
      <p className="case-intro">Signal began with a sophisticated quantitative trading process and a question: could that way of analyzing markets be turned into a visual software product?</p><p className="case-intro">Signal was used in live markets, licensed commercially, and later acquired.</p>
    </header>
    <div className="case-signal-hero"><SignalWorkstation /></div>
    <div className="case-shell">
      <CaseSection number="02" label="Signal" title="The gap.">
        <p>Sophisticated commodities analysis often lived inside spreadsheets, models, and the expertise of the people using them.</p>
      </CaseSection>
      <CaseSection number="03" label="Signal" title="The idea.">
        <p>Turn a quantitative way of analyzing markets into a visual product that made relationships, structures, and opportunities easier to explore.</p>
      </CaseSection>
      <CaseSection number="04" label="Signal" title="What we built.">
        <p>1118 designed and built Signal, combining market data, quantitative analysis, visualization, and machine learning in one commodities research platform.</p>
      </CaseSection>
    </div>
    <section className="case-experience case-shell" aria-labelledby="signal-experience-title">
      <p className="case-kicker">05 / Product experience</p>
      <h2 id="signal-experience-title">Authentic archival UI.</h2>
      <div className="case-workflow"><div><span>01</span><h3>Define the structure.</h3><p>Choose the contract, metric, expiration, and time shift.</p></div><div><span>02</span><h3>Explore the history.</h3><p>Set a time window and examine changes across the selected series.</p></div><div><span>03</span><h3>Compare relationships.</h3><p>Move between historical, seasonal, and correlation views.</p></div></div>
      <figure className="case-archive-figure"><a href={signalHistory} target="_blank" rel="noreferrer" aria-label="Open full-size Signal historical data screenshot"><img src={signalHistory} alt="Authentic Signal historical-data screen with selectable analytical structures, time-series charts, and a time-range navigator" width="2329" height="984" loading="lazy" decoding="async" /></a><figcaption>Historical data and time-window exploration · Authentic Signal interface, August 2019 <a href={signalHistory} target="_blank" rel="noreferrer">View full image ↗</a></figcaption></figure>
      <div className="case-archive-detail"><figure className="case-archive-figure"><a href={signalStructures} target="_blank" rel="noreferrer" aria-label="Open full-size Signal Manage Structures screenshot"><img src={signalStructures} alt="Authentic Signal Manage Structures dialog showing contract, expiration, skew, time-shift, and metric controls" width="1211" height="843" loading="lazy" decoding="async" /></a><figcaption>Manage Structures · Authentic Signal interface, August 2019 <a href={signalStructures} target="_blank" rel="noreferrer">View full image ↗</a></figcaption></figure><div><h3>The analytical choices stay visible.</h3><p>The structure editor makes the ingredients of an analysis explicit. Its controls connect the market question to the data shown in the workspace.</p></div></div>
    </section>
    <div className="case-shell">
      <CaseSection number="06" label="Signal" title="Product outcome.">
        <p>Signal was used in live markets, licensed commercially, and later acquired.</p>
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
