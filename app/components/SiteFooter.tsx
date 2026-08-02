import Link from "next/link";

import { navLinks, siteConfig } from "@/app/components/site-data";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link className="site-logo" href="/">
          <span>YT</span>
          {siteConfig.name}
        </Link>
        <p>{siteConfig.description}</p>
      </div>
      <nav aria-label="Footer navigation">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="footer-meta">
        © {new Date().getFullYear()} {siteConfig.company}. All rights reserved.
      </p>
    </footer>
  );
}
