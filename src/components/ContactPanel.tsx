import { CONTACT_FORM_ENABLED, CONTACT_UNAVAILABLE_MESSAGE } from '../../shared/contact-release.mjs';
import ContactTurnstile from './ContactTurnstile';
import { useCallback, useRef, useState, type FormEvent } from 'react';
import './ContactPanel.css';

type ContactDraft = { name: string; email: string; company: string; stage: string; message: string; website: string };
type Errors = Partial<Record<keyof ContactDraft, string>>;
const emptyDraft: ContactDraft = { name: '', email: '', company: '', stage: '', message: '', website: '' };

export default function ContactPanel() {
  if (!CONTACT_FORM_ENABLED) return <div className="contact-panel contact-panel-unavailable"><p role="status">{CONTACT_UNAVAILABLE_MESSAGE}</p></div>;
  return <ActiveContactPanel />;
}

function ActiveContactPanel() {
  const [draft, setDraft] = useState<ContactDraft>(emptyDraft);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'sent'>('idle');
  const [notice, setNotice] = useState('');
  const submission = useRef('');
  const token = useRef('');
  const [securityReset, setSecurityReset] = useState(0);
  const onToken = useCallback((value: string) => { token.current = value; }, []);
  const formRef = useRef<HTMLFormElement>(null);
  const noticeRef = useRef<HTMLParagraphElement>(null);
  const update = (field: keyof ContactDraft, value: string) => {
    setDraft(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
    if (status !== 'sending') { setStatus('idle'); setNotice(''); submission.current = ''; }
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending' || status === 'sent') return;
    const next: Errors = {};
    if (draft.name.trim().length < 2) next.name = 'Enter your name.';
    if (!/^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(draft.email.trim())) next.email = 'Enter a valid email address.';
    if (!['Idea', 'Prototype', 'Launching', 'Scaling'].includes(draft.stage)) next.stage = 'Select your stage.';
    if (draft.message.trim().length < 20) next.message = 'Tell us a little more (at least 20 characters).';
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus('error'); setNotice('Please check the highlighted fields.');
      const first = Object.keys(next)[0]; formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (!token.current) { setStatus('error'); setNotice('Please complete the security check before sending your message.'); requestAnimationFrame(() => noticeRef.current?.focus()); return; }
    setStatus('sending'); setNotice('Sending your message…');
    submission.current ||= crypto.randomUUID();
    try {
      const response = await fetch('/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, turnstileToken: token.current, submissionId: submission.current }),
        signal: AbortSignal.timeout(22000),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || data?.ok !== true) {
        setStatus('error');
        setErrors(data?.fields && typeof data.fields === 'object' ? data.fields : {});
        setNotice(typeof data?.message === 'string' ? data.message : 'We couldn’t send your message right now. Your details are still here. Please try again later.');
      } else { setStatus('sent'); setNotice('Thank you. Your message is on its way. We’ll be in touch.'); }
    } catch { setStatus('error'); setNotice('We couldn’t confirm your message was sent. Your details are still here. Please try again.'); }
    token.current = ''; setSecurityReset(value => value + 1);
    requestAnimationFrame(() => noticeRef.current?.focus());
  };
  return <div className="contact-panel">
    <form id="contact-form" ref={formRef} onSubmit={submit} noValidate aria-label="Start a conversation" aria-busy={status === 'sending'}>
      <div className="contact-panel-grid">
        <div className="contact-panel-field"><label htmlFor="contact-name">Name</label><input id="contact-name" name="name" autoComplete="name" maxLength={100} required value={draft.name} onChange={event => update('name', event.target.value)} disabled={status === 'sending' || status === 'sent'} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'contact-name-error' : undefined} />{errors.name && <span id="contact-name-error" className="contact-field-error">{errors.name}</span>}</div>
        <div className="contact-panel-field"><label htmlFor="contact-email">Email</label><input id="contact-email" name="email" type="email" inputMode="email" autoComplete="email" maxLength={254} required value={draft.email} onChange={event => update('email', event.target.value)} disabled={status === 'sending' || status === 'sent'} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'contact-email-error' : undefined} />{errors.email && <span id="contact-email-error" className="contact-field-error">{errors.email}</span>}</div>
        <div className="contact-panel-field"><label htmlFor="contact-company">Company <span>(optional)</span></label><input id="contact-company" name="company" autoComplete="organization" maxLength={160} value={draft.company} onChange={event => update('company', event.target.value)} disabled={status === 'sending' || status === 'sent'} aria-invalid={Boolean(errors.company)} aria-describedby={errors.company ? 'contact-company-error' : undefined} />{errors.company && <span id="contact-company-error" className="contact-field-error">{errors.company}</span>}</div>
        <div className="contact-panel-field"><label htmlFor="contact-stage">Stage</label><select id="contact-stage" name="stage" required value={draft.stage} onChange={event => update('stage', event.target.value)} disabled={status === 'sending' || status === 'sent'} aria-invalid={Boolean(errors.stage)} aria-describedby={errors.stage ? 'contact-stage-error' : undefined}><option value="" disabled>Select stage</option>{['Idea', 'Prototype', 'Launching', 'Scaling'].map(stage => <option key={stage} value={stage}>{stage}</option>)}</select>{errors.stage && <span id="contact-stage-error" className="contact-field-error">{errors.stage}</span>}</div>
        <div className="contact-panel-field contact-panel-wide"><label htmlFor="contact-message">What are you building?</label><textarea id="contact-message" name="message" rows={5} minLength={20} maxLength={5000} required value={draft.message} onChange={event => update('message', event.target.value)} disabled={status === 'sending' || status === 'sent'} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? 'contact-message-error' : undefined} />{errors.message && <span id="contact-message-error" className="contact-field-error">{errors.message}</span>}</div>
      </div>
      <div className="contact-panel-trap" aria-hidden="true"><label htmlFor="contact-website">Website</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={draft.website} onChange={event => update('website', event.target.value)} /></div>
      {status !== 'sent' && <ContactTurnstile onToken={onToken} resetVersion={securityReset} />}
      <div className="contact-panel-bottom">
        {status === 'sent' ? <button type="button" onClick={event => { event.preventDefault(); setDraft(emptyDraft); setErrors({}); setStatus('idle'); setNotice(''); submission.current = ''; requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>('#contact-name')?.focus()); }}>Send another message <span aria-hidden="true">→</span></button> : <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send'} <span aria-hidden="true">→</span></button>}
        <p className="contact-panel-privacy">We’ll use your details to respond to your inquiry. <a href="/privacy">Privacy</a></p>
      </div>
      <p ref={noticeRef} tabIndex={-1} className={`contact-panel-notice ${status === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">{notice}</p>
      <noscript><p className="contact-panel-notice">Please enable JavaScript to use this contact form.</p></noscript>
    </form>
  </div>;
}
