"use client";

import Image from "next/image";
import Link from "next/link";
import { type KeyboardEvent, useRef } from "react";

const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const menuRef = useRef<HTMLDetailsElement>(null);

  const closeMenu = () => {
    menuRef.current?.removeAttribute("open");
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLDetailsElement>) => {
    if (event.key === "Escape") {
      closeMenu();
      menuRef.current?.querySelector("summary")?.focus();
    }
  };

  return (
    <header className="site-header">
      <div className="page-shell nav-pill">
        <Link className="brand-link" href="/" aria-label="1118 home">
          <Image src="/1118-mark.png" alt="" width={31} height={31} priority />
          <span>1118</span>
        </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <details
          className="mobile-menu"
          ref={menuRef}
          onKeyDown={handleMenuKeyDown}
        >
          <summary>Menu</summary>
          <nav className="mobile-menu-panel" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={closeMenu}>
                {link.label}
              </a>
            ))}
          </nav>
        </details>

        <a
          className="nav-cta"
          href="https://etchr.ai"
          target="_blank"
          rel="noreferrer"
        >
          See Etchr <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  );
}
