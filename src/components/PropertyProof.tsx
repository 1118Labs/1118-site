import house from '../assets/showcase/property-insights/illustrative-house-pixasquare.jpg';
import decision from '../assets/showcase/property-insights/current-synthetic-ready-decision.png';
import './PropertyProof.css';

export default function PropertyProof() {
  return <figure className="pi-proof">
    <div className="pi-property-composition">
      <div className="pi-property-photo"><img src={house} width="1800" height="1800" alt="Illustrative modern white house with mature trees and a landscaped front lawn" loading="lazy" decoding="async" /><span>Property intelligence starts here.</span></div>
      <div className="pi-decision-layer">
        <div className="pi-decision-caption"><span>From property to decision</span><span aria-hidden="true">↘</span></div>
        <div className="pi-proof-window"><img src={decision} width="1024" height="934" alt="Actual Property Insights interface: approved synthetic request ready to quote, with a $150 manual starting point and supporting house facts." loading="lazy" decoding="async" /></div>
      </div>
    </div>
    <div className="pi-outcomes"><p><span>01 / Context</span>Know what you’re walking into.</p><p><span>02 / Preparation</span>Build a better-informed estimate.</p><p><span>03 / Decision</span>Move the work forward.</p></div>
    <figcaption><span>Illustrative property photograph. The actual product screen shows a separate, approved synthetic example.</span><a href={decision} target="_blank" rel="noreferrer">Inspect the product view <span aria-hidden="true">↗</span></a></figcaption>
  </figure>;
}
