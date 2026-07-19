"use client";

import Image from "next/image";
import Link from "next/link";
import { type KeyboardEvent, useRef } from "react";

const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#philosophy", label: "Philosophy" },
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
      <div className="page-shell header-inner">
        <Link className="brand-link" href="/" aria-label="1118 home">
          <Image
            src="/brand/1118-logo-blue.png"
            alt=""
            width={273}
            height={175}
            priority
          />
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
      </div>
    </header>
  );
}
