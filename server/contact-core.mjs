import { verifyTurnstile } from './turnstile.mjs';
import { createHash, createHmac, randomBytes } from 'node:crypto';

export const BODY_LIMIT = 12_000;
const EMAIL = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const CONTROL = /[\u0000-\u001f\u007f]/;
const SESSION_ID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const UNAVAILABLE = 'We couldn’t send your message right now. Your details are still here. Please try again later.';

export function validateContact(input) {
  const fields = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { fields: { message: 'Please check your message and try again.' } };
  const values = {};
  for (const field of ['name', 'email', 'company', 'message', 'website', 'submissionId', 'stage']) {
    if (typeof input[field] !== 'string') values[field] = '';
    else values[field] = input[field].trim();
  }
  if (values.name.length < 2 || values.name.length > 100 || CONTROL.test(values.name)) fields.name = 'Enter your name (2–100 characters).';
  if (!EMAIL.test(values.email) || values.email.length > 254 || CONTROL.test(values.email)) fields.email = 'Enter a valid email address.';
  if (values.company.length > 160 || CONTROL.test(values.company)) fields.company = 'Keep the company name under 160 characters.';
  if (values.message.length < 20 || values.message.length > 5000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(values.message)) fields.message = 'Tell us a little more (20–5,000 characters).';
  if (!['Idea', 'Prototype', 'Launching', 'Scaling'].includes(values.stage)) fields.stage = 'Select your stage.';
  if (!SESSION_ID.test(values.submissionId)) fields.form = 'Please refresh this page and try again.';
  if (values.website) fields.form = 'We couldn’t accept this submission. Please try again.';
  return { values, fields };
}

// A bounded warm-instance guard, not a distributed/public-launch rate limiter.
// Entries contain only ephemeral HMACs and expire after one hour.
export function createLimiter({ now = Date.now, maxEntries = 4096 } = {}) {
  const entries = new Map();
  const salt = randomBytes(32);
  let globalWindow = { count: 0, reset: 0 };
  return (ip) => {
    const time = now();
    if (globalWindow.reset <= time) globalWindow = { count: 0, reset: time + 3_600_000 };
    const key = createHmac('sha256', salt).update(String(ip)).digest('hex');
    let entry = entries.get(key);
    if (entry && entry.reset <= time) { entries.delete(key); entry = undefined; }
    if (!entry && entries.size >= maxEntries) {
      for (const [id, value] of entries) if (value.reset <= time) entries.delete(id);
      if (entries.size >= maxEntries) return false;
    }
    if (!entry) { entry = { count: 0, reset: time + 3_600_000 }; entries.set(key, entry); }
    if (entry.count >= 5 || globalWindow.count >= 30) return false;
    entry.count += 1; globalWindow.count += 1;
    return true;
  };
}

function header(request, key) {
  const value = request.headers[key];
  return Array.isArray(value) ? value[0] : value || '';
}
function originAllowed(request, env) {
  const allowed = new Set(['https://1118.io', 'https://www.1118.io']);
  for (const host of [env.VERCEL_URL, env.VERCEL_BRANCH_URL, env.VERCEL_PROJECT_PRODUCTION_URL]) if (host) allowed.add(`https://${host}`);
  for (const origin of (env.CONTACT_ALLOWED_ORIGINS || '').split(',').filter(Boolean)) allowed.add(origin.trim());
  return allowed.has(header(request, 'origin')) && header(request, 'sec-fetch-site') !== 'cross-site';
}
async function readBody(request) {
  const declared = Number(header(request, 'content-length'));
  if (declared > BODY_LIMIT) throw Object.assign(new Error('Large body'), { status: 413 });
  let body = request.body;
  if (body === undefined) {
    let size = 0; const chunks = [];
    for await (const chunk of request) {
      size += Buffer.byteLength(chunk);
      if (size > BODY_LIMIT) throw Object.assign(new Error('Large body'), { status: 413 });
      chunks.push(Buffer.from(chunk));
    }
    body = Buffer.concat(chunks).toString('utf8');
  }
  const text = typeof body === 'string' ? body : Buffer.isBuffer(body) ? body.toString('utf8') : JSON.stringify(body);
  if (!text || Buffer.byteLength(text) > BODY_LIMIT) throw Object.assign(new Error('Invalid body'), { status: text ? 413 : 400 });
  try { return JSON.parse(text); } catch { throw Object.assign(new Error('Invalid JSON'), { status: 400 }); }
}

export function createContactHandler({ env = process.env, send = fetch, verify = fetch, allowRequest = createLimiter() } = {}) {
  const deliveries = new Map();
  return async function contact(request, response) {
    const reply = (status, payload) => {
      response.setHeader('Content-Type', 'application/json; charset=utf-8');
      response.setHeader('Cache-Control', 'no-store');
      response.setHeader('X-Content-Type-Options', 'nosniff');
      response.statusCode = status;
      response.end(JSON.stringify(payload));
    };
    if (request.method !== 'POST') { response.setHeader('Allow', 'POST'); return reply(405, { ok: false, message: 'Use the contact form to send a message.' }); }
    if (!originAllowed(request, env)) return reply(403, { ok: false, message: 'Please open the contact form on this website and try again.' });
    if (!/^application\/json(?:\s*;|$)/i.test(header(request, 'content-type'))) return reply(415, { ok: false, message: 'Please use the contact form to send your message.' });
    const ip = header(request, 'x-vercel-forwarded-for').split(',')[0].trim() || request.socket?.remoteAddress || 'unknown';
    if (!allowRequest(ip)) { response.setHeader('Retry-After', '3600'); return reply(429, { ok: false, message: 'Please wait before sending another message. Your details are still here.' }); }
    let data;
    try { data = await readBody(request); }
    catch (error) { return reply(error.status || 400, { ok: false, message: error.status === 413 ? 'Your message is too long. Please shorten it and try again.' : 'Please check your message and try again.' }); }
    const { values, fields } = validateContact(data);
    if (Object.keys(fields).length) return reply(422, { ok: false, message: fields.form || 'Please check the highlighted fields.', fields });
    const formspree = env.FORMSPREE_FORM_ID;
    const useFormspree = typeof formspree === 'string' && /^[a-z]{8}$/.test(formspree);
    if (formspree && !useFormspree) return reply(503, { ok: false, message: UNAVAILABLE });
    if (!useFormspree && (!env.RESEND_API_KEY || !EMAIL.test(env.CONTACT_TO || '') || !EMAIL.test(env.CONTACT_FROM || '') || CONTROL.test(env.CONTACT_TO || '') || CONTROL.test(env.CONTACT_FROM || ''))) return reply(503, { ok: false, message: UNAVAILABLE });
    const security = await verifyTurnstile({ token: data.turnstileToken, origin: header(request, 'origin'), ip, env, verify });
    if (!security.ok) return reply(security.status, { ok: false, message: security.message });
    // Prevent concurrent/accepted duplicate sends on this warm instance. Resend
    // also enforces the key remotely; Formspree has no equivalent guarantee.
    const now = Date.now();
    for (const [key, entry] of deliveries) if (entry.expires <= now) deliveries.delete(key);
    const fingerprint = createHash('sha256').update(JSON.stringify(values)).digest('hex');
    const existing = deliveries.get(values.submissionId);
    if (existing && existing.fingerprint !== fingerprint) return reply(409, { ok: false, message: 'Your message changed. Please edit it and try again.' });
    if (!existing && deliveries.size >= 1024) return reply(503, { ok: false, message: UNAVAILABLE });
    const deliver = async () => {
      try {
        const result = await send(useFormspree ? `https://formspree.io/f/${formspree}` : 'https://api.resend.com/emails', {
          method: 'POST',
          headers: useFormspree ? { Accept: 'application/json', 'Content-Type': 'application/json' } : { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `1118-contact-${values.submissionId}` },
          body: JSON.stringify(useFormspree ? { name: values.name, email: values.email, company: values.company, stage: values.stage, message: values.message, _subject: 'New conversation from 1118', submissionId: values.submissionId } : { from: `1118 <${env.CONTACT_FROM}>`, to: [env.CONTACT_TO], reply_to: values.email, subject: 'New conversation from 1118', text: `Name: ${values.name}\nEmail: ${values.email}\nCompany: ${values.company || 'Not provided'}\nStage: ${values.stage}\n\n${values.message}` }),
          signal: AbortSignal.timeout(8000),
        });
        const payload = await result.json().catch(() => ({}));
        return result.ok && (useFormspree ? payload.ok === true : typeof payload.id === 'string' && Boolean(payload.id));
      } catch { return false; }
    };
    const entry = existing || { fingerprint, expires: now + 86_400_000, promise: deliver() };
    if (!existing) deliveries.set(values.submissionId, entry);
    const accepted = await entry.promise;
    if (!accepted) { deliveries.delete(values.submissionId); return reply(503, { ok: false, message: UNAVAILABLE }); }
    return reply(202, { ok: true, message: 'Thank you. Your message is on its way. We’ll be in touch.' });
  };
}
