import decision from '../assets/showcase/property-insights/current-synthetic-ready-decision.png';
import recommendation from '../assets/showcase/property-insights/current-synthetic-ready-recommendation.png';
import './PropertyProof.css';

export default function PropertyProof() {
  return <figure className="pi-proof">
    <div className="pi-proof-mobile-detail">
      <span>Approved synthetic example</span>
      <h3>Ready to quote.</h3>
      <p className="pi-proof-starting-point">$150 manual starting point<br />2 people · 2.3–2.9 hours</p>
      <ol>
        <li><strong>Request.</strong> A biweekly house cleaning estimate.</li>
        <li><strong>Context.</strong> 3 beds · 2 baths · 1,800 sqft.</li>
        <li><strong>Signals.</strong> Core house facts support a starting point. Year built and lot size remain unavailable.</li>
        <li><strong>Recommendation.</strong> Use $150 as a manual starting point for the operator to review.</li>
        <li><strong>Decision.</strong> Prepare a draft for review, then finish the quote in Jobber.</li>
      </ol>
      <img src={recommendation} width="975" height="295" alt="Detail from the actual approved synthetic example: Ready, start at $150." loading="lazy" decoding="async" />
      <span>The actual request and supporting facts</span>
    </div>
    <div className="pi-proof-window">
      <img src={decision} width="1024" height="934" alt="Actual Property Insights interface: approved synthetic request ready to quote, with a $150 manual starting point, 2.3 to 2.9 hours with two people, and supporting house facts." loading="lazy" decoding="async" />
    </div>
    <figcaption><span>Actual product interface · Approved synthetic example · Captured September 11, 2026</span><a href={decision} target="_blank" rel="noreferrer">Open original <span aria-hidden="true">↗</span></a></figcaption>
  </figure>;
}
