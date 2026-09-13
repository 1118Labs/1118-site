import signalInterface from '../assets/showcase/signal/signal-archival-interface.png';
import signalEnvironment from '../assets/showcase/signal/signal-workstation-authentic-composite-20260913.webp';
import './SignalWorkstation.css';

export default function SignalWorkstation() {
  return <figure className="signal-workstation">
    <a className="signal-environment-display" href={signalInterface} target="_blank" rel="noreferrer" aria-label="Open the full-size original Signal interface">
      <img src={signalEnvironment} width="1536" height="1024" alt="Signal commodities analytics interface presented in an illustrative trading-workstation environment." loading="lazy" decoding="async" />
    </a>
    <figcaption><span>Illustrative environment · Authentic 2019 interface</span><a href={signalInterface} target="_blank" rel="noreferrer">Explore the original screen ↗</a></figcaption>
  </figure>;
}
