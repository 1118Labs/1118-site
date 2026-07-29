"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const links = [
  { href: "#products", label: "Products" },
  { href: "#model", label: "Model" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    const dialog = dialogRef.current;
    const focusable =
      dialog?.querySelectorAll<HTMLElement>("a, button") ?? [];

    document.body.style.overflow = "hidden";
    focusable[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand-link" href="#main" aria-label="1118 home">
          <Image
            src="/brand/1118-logo-blue.png"
            alt=""
            width={116}
            height={38}
            priority
          />
        </a>
        <nav className="desktop-nav" aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <a
          className="header-product-link"
          href="https://etchr.ai"
          target="_blank"
          rel="noreferrer"
        >
          Etchr <span aria-hidden="true">↗</span>
        </a>
        <button
          ref={triggerRef}
          className="menu-trigger"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? "mobile-menu" : undefined}
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </div>
      {open && (
        <div
          className="menu-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            id="mobile-menu"
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <button
              className="menu-close"
              type="button"
              onClick={close}
              aria-label="Close menu"
            >
              Close
            </button>
            <nav aria-label="Mobile primary">
              {links.map((link) => (
                <a key={link.href} href={link.href} onClick={close}>
                  {link.label}
                </a>
              ))}
              <a
                href="https://etchr.ai"
                target="_blank"
                rel="noreferrer"
                onClick={close}
              >
                Etchr ↗
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
