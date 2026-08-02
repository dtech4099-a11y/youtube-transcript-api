import type { Metadata } from "next";

import { ContactForm } from "@/app/contact/ContactForm";
import { PageShell } from "@/app/components/PageShell";
import { siteConfig } from "@/app/components/site-data";

export const metadata: Metadata = {
  title: "Contact | YouTube Transcript API",
  description: "Contact DTech DevOps for YouTube Transcript API support and enterprise requests.",
  alternates: { canonical: `${siteConfig.website}/contact` }
};

export default function ContactPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <p className="eyebrow">Contact</p>
          <h1>Contact support</h1>
          <p>
            Send a message for support, feature requests, billing questions, or enterprise usage.
          </p>
        </section>
        <section className="page-section contact-layout">
          <ContactForm />
          <aside className="contact-card">
            <h2>{siteConfig.company}</h2>
            <p>
              <strong>Email:</strong> <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </p>
            <p>
              <strong>Website:</strong> <a href={siteConfig.website}>{siteConfig.website}</a>
            </p>
            <p>
              For source code access, partnerships, or enterprise requests, contact support by
              email.
            </p>
          </aside>
        </section>
      </main>
    </PageShell>
  );
}
