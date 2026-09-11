import signalInterface from '../assets/showcase/signal/signal-archival-interface.png';
import './SignalWorkstation.css';

export default function SignalWorkstation() {
  return <figure className="signal-workstation">
    <a className="signal-archive-display" href={signalInterface} target="_blank" rel="noreferrer" aria-label="Open the full-size original Signal interface">
      <img src={signalInterface} width="2167" height="1046" alt="Authentic Signal interface from 2019, showing seasonal commodity data and correlation analysis." loading="lazy" decoding="async" />
    </a>
    <figcaption><span>Original Signal interface · 2019</span><a href={signalInterface} target="_blank" rel="noreferrer">Explore the original screen ↗</a></figcaption>
  </figure>;
}
