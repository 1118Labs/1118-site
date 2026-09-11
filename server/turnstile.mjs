// Turnstile secrets are read only by server functions. Never use a VITE_ prefix.
export const CONTACT_ACTION = 'contact';
export const TEST_SITE_KEY = '1x00000000000000000000AA';
export const TEST_SECRET_KEY = '1x0000000000000000000000000000000AA';
const TEST_KEYS = /^[123]x0+/;
const RETRY = 'The security check couldn’t be completed. Please refresh the check and try again. Your details are still here.';

export function turnstileConfig(env = process.env) {
  const sitekey = env.TURNSTILE_SITE_KEY;
  const secret = env.TURNSTILE_SECRET_KEY;
  const test = env.CONTACT_TURNSTILE_TEST_MODE === 'true';
  const nonProduction = ['preview', 'development'].includes(env.VERCEL_ENV);
  if (!sitekey || !secret || !/^[a-zA-Z0-9_-]{20,100}$/.test(sitekey) || !/^[a-zA-Z0-9_-]{20,100}$/.test(secret)) return null;
  if (test) {
    if (!nonProduction || sitekey !== TEST_SITE_KEY || secret !== TEST_SECRET_KEY) return null;
  } else if (TEST_KEYS.test(sitekey) || TEST_KEYS.test(secret)) return null;
  return { sitekey, secret, test };
}

export async function verifyTurnstile({ token, origin, ip, env = process.env, verify = fetch }) {
  const config = turnstileConfig(env);
  if (!config) return { ok: false, status: 503, message: 'The contact form’s security check is temporarily unavailable. Your details are still here. Please try again later.' };
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) return { ok: false, status: 422, message: 'Please complete the security check before sending your message.' };
  try {
    const result = await verify('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: config.secret, response: token, ...(ip && ip !== 'unknown' ? { remoteip: ip } : {}) }),
      signal: AbortSignal.timeout(8000),
    });
    if (!result.ok) return { ok: false, status: 503, message: RETRY };
    const payload = await result.json();
    if (payload?.success !== true) return { ok: false, status: 422, message: RETRY };
    if (config.test) {
      // Official dummy Siteverify responses do not reliably return the requested
      // hostname or action. This narrow QA exception is impossible in Production.
      if (payload.metadata?.result_with_testing_key !== true) return { ok: false, status: 422, message: RETRY };
    } else {
      const hostname = new URL(origin).hostname;
      const production = env.VERCEL_ENV === 'production';
      if ((production && !['1118.io', 'www.1118.io'].includes(hostname)) || payload.hostname !== hostname || payload.action !== CONTACT_ACTION) return { ok: false, status: 422, message: RETRY };
    }
    return { ok: true };
  } catch { return { ok: false, status: 503, message: RETRY }; }
}

export function createContactConfigHandler(env = process.env) {
  return (request, response) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    if (request.method !== 'GET') { response.setHeader('Allow', 'GET'); response.statusCode = 405; response.end(JSON.stringify({ ok: false })); return; }
    const config = turnstileConfig(env);
    response.statusCode = config ? 200 : 503;
    response.end(JSON.stringify(config ? { sitekey: config.sitekey, action: CONTACT_ACTION } : { ok: false }));
  };
}
