import decision from '../assets/showcase/property-insights/current-synthetic-ready-decision.png';
import recommendation from '../assets/showcase/property-insights/current-synthetic-ready-recommendation.png';
import './PropertyProof.css';

export default function PropertyProof() {
  return <figure className="pi-proof">
    <div className="pi-proof-composition">
      <div className="pi-proof-explainer">
        <p className="pi-proof-kicker">Inside the operator workflow</p>
        <h3>From request<br />to ready.</h3>
        <p className="pi-proof-intro">The property, the scope, and a starting point—before the estimate is finished in Jobber.</p>
        <ol>
          <li><span>01</span><div><strong>Know the context.</strong><p>A biweekly cleaning request. Three beds, two baths, 1,800 square feet.</p></div></li>
          <li><span>02</span><div><strong>See what needs review.</strong><p>Core facts support an estimate. Year built and lot size remain unavailable.</p></div></li>
          <li><span>03</span><div><strong>Make the next decision.</strong><p>A $150 manual starting point, with the operator in control of the final quote.</p></div></li>
        </ol>
      </div>
      <div className="pi-proof-window"><img src={decision} width="1024" height="934" alt="Actual Property Insights interface: approved synthetic request ready to quote, with a $150 manual starting point, 2.3 to 2.9 hours with two people, and supporting house facts." loading="lazy" decoding="async" /></div>
    </div>
    <div className="pi-proof-recommendation"><p>The recommendation, <br /><strong>ready for operator review.</strong></p><img src={recommendation} width="975" height="295" alt="Enlarged detail from the actual approved synthetic example: Ready, start at $150." loading="lazy" decoding="async" /></div>
    <figcaption><span>Actual product interface · Approved synthetic example · Captured September 11, 2026</span><a href={decision} target="_blank" rel="noreferrer">Inspect the product view <span aria-hidden="true">↗</span></a></figcaption>
  </figure>;
}
