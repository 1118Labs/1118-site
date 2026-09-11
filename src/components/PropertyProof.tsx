import decision from '../assets/showcase/property-insights/current-synthetic-ready-context.png';
import propertyMark from '../assets/showcase/property-insights/brand/property-insights-mark.png';
import './PropertyProof.css';

export function PropertyBrand() {
  return <span className="pi-brand" role="img" aria-label="Property Insights">
    <img src={propertyMark} width="1254" height="1254" alt="" aria-hidden="true" />
    <span className="pi-brand-wordmark" aria-hidden="true"><span>Property</span><span>Insights</span></span>
  </span>;
}

export default function PropertyProof() {
  return <figure className="pi-proof">
    <div className="pi-proof-heading"><PropertyBrand /><span>Actual product interface</span></div>
    <p className="pi-proof-scroll-hint">Scroll horizontally to inspect the product view.</p>
    <div className="pi-proof-window" role="region" tabIndex={0} aria-label="Property Insights product screenshot" aria-describedby="pi-proof-description">
      <img src={decision} width="1024" height="1068" alt="Actual Property Insights approved synthetic request: biweekly house cleaning, a $150 manual starting recommendation, next action, house facts, fields marked Needs review, and signals to confirm scope and access before quoting." loading="lazy" decoding="async" />
    </div>
    <figcaption id="pi-proof-description"><span>Actual product interface · Approved synthetic example</span><a href={decision} target="_blank" rel="noreferrer">Inspect the product view <span aria-hidden="true">↗</span></a></figcaption>
  </figure>;
}
