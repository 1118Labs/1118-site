import test from 'node:test';
import assert from 'node:assert/strict';
import { turnstileConfig, verifyTurnstile, createContactConfigHandler, TEST_SITE_KEY, TEST_SECRET_KEY } from '../server/turnstile.mjs';
import { createContactHandler } from '../server/contact-core.mjs';
const env = { VERCEL_ENV: 'production', TURNSTILE_SITE_KEY: 'real-shaped-sitekey-000000', TURNSTILE_SECRET_KEY: 'private-server-secret-000000', RESEND_API_KEY: 'synthetic-key', CONTACT_FROM: 'contact@1118.io', CONTACT_TO: 'recipient@example.test' };
const valid = { name: 'QA Founder', email: 'qa@example.test', company: '', stage: 'Idea', message: 'This is a synthetic verification request.', website: '', submissionId: 'f51fe04c-adb7-4ec2-a82d-19656690919d', turnstileToken: 'opaque-token' };
const good = { success: true, hostname: '1118.io', action: 'contact' };
const mock = payload => async () => ({ ok: true, json: async () => payload });
async function invoke(handler, body = valid) {
  const response = { setHeader() {}, statusCode: 0, end(value) { this.body = JSON.parse(value); } };
  await handler({ method: 'POST', headers: { origin: 'https://1118.io', 'content-type': 'application/json', 'x-vercel-forwarded-for': '192.0.2.2' }, body }, response);
  return response;
}
const check = (verify, extra = {}) => verifyTurnstile({ env, verify, token: 'opaque-token', origin: 'https://1118.io', ip: '192.0.2.2', ...extra });
test('no missing or official QA credentials can enable Production', () => {
  for (const values of [{}, { ...env, TURNSTILE_SECRET_KEY: '' }, { ...env, CONTACT_TURNSTILE_TEST_MODE: 'true' }, { ...env, TURNSTILE_SITE_KEY: TEST_SITE_KEY, TURNSTILE_SECRET_KEY: TEST_SECRET_KEY }, { ...env, TURNSTILE_SITE_KEY: TEST_SITE_KEY, TURNSTILE_SECRET_KEY: TEST_SECRET_KEY, CONTACT_TURNSTILE_TEST_MODE: 'true' }]) assert.equal(turnstileConfig(values), null);
});
test('official test mode requires explicit preview/development environment and both pass keys', async () => {
 const qa = { TURNSTILE_SITE_KEY: TEST_SITE_KEY, TURNSTILE_SECRET_KEY: TEST_SECRET_KEY, CONTACT_TURNSTILE_TEST_MODE: 'true' };
 assert.equal(turnstileConfig(qa), null);
 for (const VERCEL_ENV of ['preview', 'development']) {
  const options = { env: { ...qa, VERCEL_ENV } };
  assert.equal((await check(mock({ success: true, hostname: 'example.com', metadata: { result_with_testing_key: true } }), options)).ok, true);
  assert.equal((await check(mock(good), options)).ok, false);
 }
});
test('Siteverify uses POST, a server-only secret, response token and trusted IP', async () => {
 assert.equal((await check(async (url, options) => {
  assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify'); assert.equal(options.method, 'POST');
  assert.deepEqual(JSON.parse(options.body), { secret: env.TURNSTILE_SECRET_KEY, response: 'opaque-token', remoteip: '192.0.2.2' });
  return { ok: true, json: async () => good };
 })).ok, true);
});
test('missing and oversized tokens reject without contacting Siteverify', async () => {
 for (const token of ['', null, undefined, 12, 'a'.repeat(2049)]) assert.equal((await check(async () => assert.fail('No request'), { token })).status, 422);
});
test('hostname, action, spent, expired, malformed and network failures reject', async () => {
 for (const payload of [{ ...good, hostname: 'evil.example' }, { ...good, action: 'login' }, { success: true }, { success: false, 'error-codes': ['timeout-or-duplicate'] }, { success: false, 'error-codes': ['invalid-input-response'] }, null]) assert.equal((await check(mock(payload))).ok, false);
 for (const verify of [async () => { throw Error('network'); }, async () => ({ ok: false }), async () => ({ ok: true, json: async () => { throw Error('invalid JSON'); } })]) assert.equal((await check(verify)).status, 503);
 assert.equal((await check(mock({ ...good, hostname: 'unapproved.vercel.app' }), { origin: 'https://unapproved.vercel.app' })).ok, false);
});
test('every valid submission verifies before provider delivery, including accepted retries', async () => {
 const calls = [];
 const handler = createContactHandler({ env, allowRequest: () => true, verify: async () => { calls.push('verify'); return { ok: true, json: async () => good }; }, send: async () => { calls.push('send'); return { ok: true, json: async () => ({ id: 'synthetic-id' }) }; } });
 assert.equal((await invoke(handler)).statusCode, 202);
 assert.equal((await invoke(handler, { ...valid, turnstileToken: 'fresh-token' })).statusCode, 202);
 assert.deepEqual(calls, ['verify', 'send', 'verify']);
});
test('failed security never sends email or leaks configuration', async () => {
 for (const verify of [mock({ success: false }), mock({ ...good, action: 'other' }), async () => { throw Error(env.TURNSTILE_SECRET_KEY); }]) {
  const result = await invoke(createContactHandler({ env, verify, send: async () => assert.fail('Email forbidden') }));
  assert.notEqual(result.statusCode, 202); assert.equal(result.body.ok, false); assert.equal(JSON.stringify(result.body).includes(env.TURNSTILE_SECRET_KEY), false);
 }
});
test('public config returns only sitekey and action; unconfigured mode is 503', () => {
 for (const [config, status] of [[env, 200], [{}, 503]]) {
  const response = { setHeader() {}, end(value) { this.body = JSON.parse(value); } };
  createContactConfigHandler(config)({ method: 'GET' }, response);
  assert.equal(response.statusCode, status);
  if (status === 200) assert.deepEqual(response.body, { sitekey: env.TURNSTILE_SITE_KEY, action: 'contact' });
  assert.equal(JSON.stringify(response.body).includes(env.TURNSTILE_SECRET_KEY), false);
 }
});

test('Preview ignores real credentials and unknown environment fails closed',()=>{assert.equal(turnstileConfig({...env,VERCEL_ENV:undefined}),null);for(const VERCEL_ENV of ['preview','development'])assert.deepEqual(turnstileConfig({...env,VERCEL_ENV}),{sitekey:TEST_SITE_KEY,secret:TEST_SECRET_KEY,test:true});});
