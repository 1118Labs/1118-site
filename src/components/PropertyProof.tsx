import house from '../assets/showcase/property-insights/product-showroom-home.webp';
import propertyMark from '../assets/showcase/property-insights/brand/property-insights-mark.png';
import './PropertyProof.css';

export function PropertyBrand() {
  return <span className="pi-brand" role="img" aria-label="Property Insights">
    <img src={propertyMark} width="1254" height="1254" alt="" aria-hidden="true" loading="lazy" decoding="async" fetchPriority="low" />
    <span className="pi-brand-wordmark" aria-hidden="true"><span>Property</span><span>Insights</span></span>
  </span>;
}

// Ported from the current PI public ProductFrame and property-to-price composition.
// The scenario is synthetic; intentionally omit the example street address.
export default function PropertyProof() {
  return <figure className="pi-proof">
    <div className="pi-product-frame">
      <div className="pi-frame-bar"><span><i aria-hidden="true" />Synthetic example</span><span className="pi-ready">Ready to quote</span></div>
      <div className="pi-product-grid">
        <div className="pi-property"><div className="pi-house"><img src={house} width="1536" height="1024" alt="House image from Property Insights’ public product showroom, used in this synthetic example" loading="lazy" decoding="async" />
          <div className="pi-house-facts"><span>Property found</span><p>3 bed · 2 bath · 1,640 sq ft</p></div>
        </div>
          <dl className="pi-property-stats">{[["Beds","3"],["Baths","2"],["Square feet","1,640"],["Lot size","6,100 sq ft"],["Year built","1989"],["Property type","Single-family"]].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        </div>
        <div className="pi-request">
          <div className="pi-customer-request"><p className="pi-request-label">Customer request</p><h3>Biweekly home cleaning</h3><p>Biweekly clean for primary residence. Golden retriever sheds heavily and there is a tight driveway turnaround.</p></div>
          <div className="pi-decision"><p className="pi-request-label">Recommendation</p>
          <h3>Start at $150</h3>
          <p>The company minimum sets the starting price. The recurring schedule and home details are ready for a final check.</p>
          <dl><div><dt>Estimated work</dt><dd>2.3–3.0 cleaner-hours</dd></div><div><dt>Suggested crew</dt><dd>2 cleaners</dd></div></dl>
          </div>
          <div className="pi-request-context"><strong>Confirm before the first visit</strong><ul><li>Confirm dog can be crated for first visit.</li><li>Confirm whether basement family room is part of recurring scope.</li></ul></div>
          <div className="pi-before-send"><strong>Before you send it</strong><p>Review access and pet notes, then finish the quote in Jobber.</p></div>
        </div>
      </div>
    </div>
    <figcaption><span>Property Insights product showroom · Synthetic example</span><a href="https://insights.1118.io/#product" target="_blank" rel="noreferrer">Explore the product →</a></figcaption>
  </figure>;
}
