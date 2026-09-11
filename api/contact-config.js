import { createContactConfigHandler } from '../server/turnstile.mjs';
import { CONTACT_FORM_ENABLED } from '../shared/contact-release.mjs';
import { contactUnavailable } from '../server/contact-release.mjs';

export default CONTACT_FORM_ENABLED ? createContactConfigHandler() : contactUnavailable;
