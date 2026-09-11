import signalInterface from '../assets/showcase/signal/signal-archival-interface.png';
import environment from '../assets/showcase/signal/signal-workstation-environment.webp';
import './SignalWorkstation.css';

export default function SignalWorkstation() {
  return (
    <figure className="signal-workstation">
      <div className="signal-workstation-scene">
        <div className="signal-workstation-stage">
          <img className="signal-workstation-environment" src={environment} width="1536" height="1024" alt="" loading="lazy" decoding="async" />
          <div className="signal-workstation-plane">
            <img src={signalInterface} width="2167" height="1046" alt="Authentic Signal interface from 2019, showing seasonal commodity data and correlation analysis." loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
      <figcaption><span>Original 2019 interface · Composed workstation environment</span><a href={signalInterface} target="_blank" rel="noreferrer">Explore the original screen ↗</a></figcaption>
    </figure>
  );
}
