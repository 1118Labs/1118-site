import { verifyTurnstile } from './turnstile.mjs';
import { createHash, createHmac, randomBytes } from 'node:crypto';

export const BODY_LIMIT = 12_000;
const EMAIL = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const CONTROL = /[\u0000-\u001f\u007f]/;
const SESSION_ID = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
const UNAVAILABLE = 'We couldn’t send your note. Please try again.';

export function validateContact(input) {
  const fields = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { fields: { message: 'Please check your message and try again.' } };
  const values = {};
  const allowed = new Set(['name', 'email', 'company', 'stage', 'links', 'message', 'website', 'submissionId', 'turnstileToken']);
  if (Object.keys(input).some(key => !allowed.has(key))) fields.form = 'Please use the contact form to send your note.';
  for (const field of ['name', 'email', 'company', 'message', 'website', 'submissionId', 'stage', 'links']) {
    if (typeof input[field] !== 'string') { values[field] = ''; if (input[field] !== undefined || !['company', 'links', 'website'].includes(field)) fields[field] = 'Enter a valid value.'; }
    else values[field] = input[field].trim();
  }
  if (values.name.length < 2 || values.name.length > 100 || CONTROL.test(values.name)) fields.name = 'Enter your name (2–100 characters).';
  if (!EMAIL.test(values.email) || values.email.length > 254 || CONTROL.test(values.email)) fields.email = 'Enter a valid email address.';
  if (values.company.length > 160 || CONTROL.test(values.company)) fields.company = 'Keep the company name under 160 characters.';
  if (values.message.length < 20 || values.message.length > 5000 || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(values.message)) fields.message = 'Tell us a little more (20–5,000 characters).';
  if (!['Idea', 'Prototype', 'Launching', 'Scaling'].includes(values.stage)) fields.stage = 'Select your stage.';
  if (!SESSION_ID.test(values.submissionId)) fields.form = 'Please refresh this page and try again.';
  if (values.links) {
    try {
      const url = new URL(values.links);
      if (values.links.length > 2048 || CONTROL.test(values.links) || !['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw Error('Invalid URL');
      values.links = url.href;
    } catch { fields.links = 'Enter a complete http or https URL (up to 2,048 characters).'; }
  }
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
  if (['preview', 'development'].includes(env.VERCEL_ENV)) {
    allowed.clear();
    for (const host of [env.VERCEL_URL, env.VERCEL_BRANCH_URL]) if (host) allowed.add(`https://${host}`);
    if (env.VERCEL_ENV === 'development') for (const origin of (env.CONTACT_ALLOWED_ORIGINS || '').split(',').filter(Boolean)) allowed.add(origin.trim());
  }
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
    let allowed;
    try { allowed = await allowRequest(ip); } catch { return reply(503, { ok: false, message: UNAVAILABLE }); }
    if (!allowed) { response.setHeader('Retry-After', '3600'); return reply(429, { ok: false, message: 'Please wait before sending another message. Your details are still here.' }); }
    let data;
    try { data = await readBody(request); }
    catch (error) { return reply(error.status || 400, { ok: false, message: error.status === 413 ? 'Your message is too long. Please shorten it and try again.' : 'Please check your message and try again.' }); }
    const { values, fields } = validateContact(data);
    if (Object.keys(fields).length) return reply(422, { ok: false, message: fields.form || 'Please check the highlighted fields.', fields });
    const security = await verifyTurnstile({ token: data.turnstileToken, origin: header(request, 'origin'), ip, env, verify });
    if (!security.ok) return reply(security.status, { ok: false, message: security.message });
    // Preview is pinned to Resend's official test sink. It cannot deliver to the company inbox.
    const production = env.VERCEL_ENV === 'production';
    const recipient = production ? env.CONTACT_TO : 'delivered@resend.dev';
    const key = production ? env.RESEND_API_KEY : env.CONTACT_PREVIEW_RESEND_API_KEY;
    const sender = production ? env.CONTACT_FROM : env.CONTACT_PREVIEW_FROM;
    if (!key || !EMAIL.test(recipient || '') || !EMAIL.test(sender || '') || CONTROL.test(recipient || '') || CONTROL.test(sender || '') || (production && !sender.toLowerCase().endsWith('@1118.io'))) return reply(503, { ok: false, message: UNAVAILABLE });
    // Coalesce concurrent retries locally; Resend enforces the same key across instances for 24 hours.
    const now = Date.now();
    for (const [key, entry] of deliveries) if (entry.expires <= now) deliveries.delete(key);
    const fingerprint = createHash('sha256').update(JSON.stringify(values)).digest('hex');
    const existing = deliveries.get(values.submissionId);
    if (existing && existing.fingerprint !== fingerprint) return reply(409, { ok: false, message: 'Your message changed. Please edit it and try again.' });
    if (!existing && deliveries.size >= 1024) return reply(503, { ok: false, message: UNAVAILABLE });
    const deliver = async () => {
      try {
        const result = await send('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `1118-contact-${values.submissionId}` },
          body: JSON.stringify({ from: `1118 <${sender}>`, to: [recipient], reply_to: values.email, subject: 'New conversation from 1118', text: `Name: ${values.name}\nEmail: ${values.email}\nCompany: ${values.company || 'Not provided'}\nStage: ${values.stage}\nLinks / attachments URL: ${values.links || 'Not provided'}\n\n${values.message}` }),
          signal: AbortSignal.timeout(8000),
        });
        const payload = await result.json().catch(() => ({}));
        return result.ok && (typeof payload.id === 'string' && Boolean(payload.id));
      } catch { return false; }
    };
    const entry = existing || { fingerprint, expires: now + 86_400_000, promise: deliver() };
    if (!existing) deliveries.set(values.submissionId, entry);
    const accepted = await entry.promise;
    if (!accepted) { deliveries.delete(values.submissionId); return reply(503, { ok: false, message: UNAVAILABLE }); }
    return reply(202, { ok: true, message: 'Thank you. We received your note. We’ll be in touch if there’s a fit.' });
  };
}
