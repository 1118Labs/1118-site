import signalInterface from '../assets/showcase/signal/signal-archival-interface.png';
import signalEnvironment from '../assets/showcase/signal/signal-workstation-authentic-composite-20260913.webp';
import './SignalWorkstation.css';
import ResponsiveImage, { wideImageSizes } from './ResponsiveImage';

export default function SignalWorkstation({ archival = false }: { archival?: boolean }) {
  return <figure className="signal-workstation">
    <a className="signal-environment-display" href={archival ? signalInterface : "/work/signal"} aria-label={archival ? "Open the full-size original Signal interface" : "Explore the Signal case study"}>
      <ResponsiveImage sizes={wideImageSizes} src={signalEnvironment} width="1536" height="1024" alt="Signal commodities analytics interface presented in an illustrative trading-workstation environment." loading="lazy" decoding="async" />
    </a>
    {archival && <figcaption><span>Illustrative environment · Authentic 2019 interface</span><a href={signalInterface} target="_blank" rel="noreferrer">Explore the original screen ↗</a></figcaption>}
  </figure>;
}
