import { CONTACT_UNAVAILABLE_MESSAGE } from '../shared/contact-release.mjs';
export function contactUnavailable(request, response) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.statusCode = 503;
  response.end(JSON.stringify({ ok: false, message: CONTACT_UNAVAILABLE_MESSAGE }));
}
