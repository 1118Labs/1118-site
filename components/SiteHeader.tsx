"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const updateTheme = () => {
      frame = 0;
      const sampleY = Math.min(52, window.innerHeight / 2);
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-header-theme]"),
      );
      const current = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= sampleY && bounds.bottom > sampleY;
      });
      setTheme(current?.dataset.headerTheme === "dark" ? "dark" : "light");
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateTheme);
    };

    updateTheme();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header is-${theme} ${menuOpen ? "menu-open" : ""}`}>
      <a className="brand" href="#top" aria-label="1118 home" onClick={closeMenu}>
        <Image
          src="/brand/1118-logo-transparent.png"
          alt="1118"
          width={273}
          height={175}
          priority
        />
      </a>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="#works">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span>{menuOpen ? "Close" : "Menu"}</span>
      </button>
      <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
        <a href="#works" onClick={closeMenu}>Work</a>
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
      </nav>
    </header>
  );
}
