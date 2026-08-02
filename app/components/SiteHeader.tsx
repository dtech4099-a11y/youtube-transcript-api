import Link from "next/link";

import { navLinks, siteConfig } from "@/app/components/site-data";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-logo" href="/" aria-label="YouTube Transcript API home">
        <span>YT</span>
        {siteConfig.name}
      </Link>
      <nav className="site-nav" aria-label="Primary navigation">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
