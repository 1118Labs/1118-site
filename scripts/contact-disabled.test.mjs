import test from 'node:test';
import assert from 'node:assert/strict';
import contact from '../api/contact.js';
import config from '../api/contact-config.js';
import { CONTACT_FORM_ENABLED } from '../shared/contact-release.mjs';

test('V1 public contact routes fail closed without any outbound request', async () => {
  assert.equal(CONTACT_FORM_ENABLED, false);
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = () => { calls++; throw new Error('No network allowed'); };
  try {
    for (const handler of [contact, config]) {
      for (const method of ['GET', 'POST']) {
        const headers = {};
        let body;
        const res = { setHeader: (k, v) => { headers[k] = v; }, end: v => { body = JSON.parse(v); } };
        await handler({ method, headers: { origin: 'https://1118.io' } }, res);
        assert.equal(res.statusCode, 503);
        assert.equal(body.ok, false);
        assert.equal(body.message, 'Contact form coming online.');
        assert.deepEqual(Object.keys(body).sort(), ['message', 'ok']);
        assert.equal(headers['Cache-Control'], 'no-store');
      }
    }
    assert.equal(calls, 0);
  } finally { globalThis.fetch = original; }
});
