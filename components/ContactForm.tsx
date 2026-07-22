"use client";

import { type FormEvent, useRef, useState } from "react";

type Fields = "name" | "email" | "stage" | "project";
type Errors = Partial<Record<Fields, string>>;

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const next: Errors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const stage = String(data.get("stage") ?? "");
    const project = String(data.get("project") ?? "").trim();
    if (!name) next.name = "Enter your name.";
    if (!email) next.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address.";
    if (!stage) next.stage = "Select the stage of your project.";
    if (!project) next.project = "Tell us what you are building.";
    setErrors(next);
    if (Object.keys(next).length) {
      setStatus("Please correct the fields marked below.");
      const firstField = Object.keys(next)[0] as Fields;
      requestAnimationFrame(() => form.querySelector<HTMLElement>(`#${firstField}`)?.focus());
      return;
    }
    setStatus("This private preview cannot send messages yet. Your entries have been preserved. Email hello@1118.io to start a conversation.");
  };

  const fieldProps = (field: Fields) => ({ "aria-invalid": errors[field] ? true : undefined, "aria-describedby": errors[field] ? `${field}-error` : undefined });
  return <form ref={formRef} className="contact-form" noValidate onSubmit={onSubmit}>
    <div className="field"><label htmlFor="name">Name</label><input id="name" name="name" autoComplete="name" {...fieldProps("name")} />{errors.name && <p className="field-error" id="name-error">{errors.name}</p>}</div>
    <div className="field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" inputMode="email" autoComplete="email" {...fieldProps("email")} />{errors.email && <p className="field-error" id="email-error">{errors.email}</p>}</div>
    <div className="field"><label htmlFor="stage">Stage</label><select id="stage" name="stage" defaultValue="" {...fieldProps("stage")}><option value="" disabled>Select a stage</option><option>Idea</option><option>Prototype</option><option>Launching</option><option>Scaling</option></select>{errors.stage && <p className="field-error" id="stage-error">{errors.stage}</p>}</div>
    <div className="field"><label htmlFor="project">What are you building?</label><textarea id="project" name="project" rows={5} {...fieldProps("project")} />{errors.project && <p className="field-error" id="project-error">{errors.project}</p>}</div>
    <button className="submit-button" type="submit">Send inquiry <span aria-hidden="true">→</span></button>
    <p className="form-status" aria-live="polite">{status}</p>
  </form>;
}
