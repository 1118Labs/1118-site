import { useEffect, useRef, useState } from 'react';

type TurnstileAPI = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: TurnstileAPI } }
let scriptReady: Promise<TurnstileAPI> | undefined;
function loadTurnstile(): Promise<TurnstileAPI> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptReady) return scriptReady;
  scriptReady = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    const timer = window.setTimeout(() => failed(), 12000);
    function failed() { window.clearTimeout(timer); script.remove(); scriptReady = undefined; reject(new Error('Security check unavailable')); }
    script.onerror = failed;
    script.onload = () => { window.clearTimeout(timer); if (window.turnstile) resolve(window.turnstile); else failed(); };
    document.head.appendChild(script);
  });
  return scriptReady;
}

export default function ContactTurnstile({ onToken, resetVersion }: { onToken: (token: string) => void; resetVersion: number }) {
  const region = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const [retry, setRetry] = useState(0);
  const [message, setMessage] = useState('The security check will load when you reach the form.');
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false;
    let widget: string | undefined;
    let api: TurnstileAPI | undefined;
    let started = false;
    const controller = new AbortController();
    const error = () => { if (!disposed) { onToken(''); setFailed(true); setMessage('The security check couldn’t load. Check your connection, then refresh the check. Your details will stay here.'); } };
    const start = async () => {
      if (started || disposed) return;
      started = true;
      setFailed(false); setMessage('Loading security check…'); onToken('');
      try {
        const configResponse = await fetch('/api/contact-config', { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]), cache: 'no-store' });
        if (!configResponse.ok) throw new Error('Unavailable');
        const config: { sitekey: string; action: string } = await configResponse.json();
        api = await loadTurnstile();
        if (disposed || !mount.current) return;
        widget = api.render(mount.current, {
          sitekey: config.sitekey, action: config.action, theme: 'light', size: mount.current.getBoundingClientRect().width < 300 ? 'compact' : 'flexible',
          'response-field': false, 'refresh-expired': 'auto', 'refresh-timeout': 'auto',
          callback: (token: string) => { if (!disposed) { onToken(token); setFailed(false); setMessage('Security check complete. You can send your message.'); } },
          'expired-callback': () => { if (!disposed) { onToken(''); setMessage('The security check expired. Refreshing it now…'); } },
          'timeout-callback': () => { if (!disposed) { onToken(''); setMessage('The security check timed out. Refreshing it now…'); } },
          'error-callback': () => { error(); return true; },
        });
      } catch { error(); }
    };
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); void start(); } }, { rootMargin: '500px' });
    if (region.current) observer.observe(region.current);
    return () => { disposed = true; controller.abort(); observer.disconnect(); if (widget && api) api.remove(widget); };
  }, [onToken, resetVersion, retry]);
  return <div ref={region} className="contact-security" role="group" aria-labelledby="contact-security-label">
    <span id="contact-security-label">Security check</span>
    <div ref={mount} className="contact-security-widget" />
    <p className="contact-security-status" role="status" aria-live="polite">{message}</p>
    {failed && <button type="button" className="contact-security-retry" onClick={() => setRetry(value => value + 1)}>Refresh security check</button>}
  </div>;
}
