import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#belief", label: "Belief" },
  { href: "mailto:hello@1118.io", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="canon-header">
      <div className="canon-header-inner">
        <Link className="canon-brand-link" href="/" aria-label="1118 home">
          <Image
            src="/brand/1118-logo-blue.png"
            alt=""
            width={273}
            height={175}
            priority
          />
        </Link>

        <nav className="canon-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
