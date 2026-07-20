"use client";

import { type FormEvent, useState } from "react";

export function ContactForm() {
  const [showPreviewNotice, setShowPreviewNotice] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowPreviewNotice(true);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-field-row">
        <label className="contact-field" htmlFor="contact-name">
          <span>Name</span>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
          />
        </label>

        <label className="contact-field" htmlFor="contact-email">
          <span>Email</span>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
      </div>

      <label className="contact-field" htmlFor="contact-project">
        <span>What are you building?</span>
        <textarea id="contact-project" name="project" rows={5} required />
      </label>

      <div className="contact-actions">
        <button type="submit">
          Send message <span aria-hidden="true">→</span>
        </button>
        <a href="mailto:hello@1118.io">hello@1118.io</a>
      </div>

      {showPreviewNotice ? (
        <p className="contact-status" role="status">
          Preview only—nothing was sent. Email{" "}
          <a href="mailto:hello@1118.io">hello@1118.io</a> to start a
          conversation.
        </p>
      ) : null}
    </form>
  );
}
