import type { Metadata } from "next";

import { PageShell } from "@/app/components/PageShell";
import { siteConfig } from "@/app/components/site-data";

export const metadata: Metadata = {
  title: "Privacy Policy | YouTube Transcript API",
  description: "Privacy policy for the YouTube Transcript API by DTech DevOps.",
  alternates: { canonical: `${siteConfig.website}/privacy` }
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <p className="eyebrow">Privacy</p>
          <h1>Privacy Policy</h1>
          <p>How {siteConfig.company} handles information related to API usage and support.</p>
        </section>
        <section className="legal-content">
          <h2>1. Information we process</h2>
          <p>
            We may process API request metadata such as timestamps, route names, response status,
            rate-limit identifiers, request IDs, and operational logs. We do not require end users
            to submit personal information to retrieve public video transcript data.
          </p>
          <h2>2. Support information</h2>
          <p>
            If you contact us, we may process your name, email address, and message content to
            respond to your request.
          </p>
          <h2>3. API keys and security</h2>
          <p>
            API keys and proxy secrets are treated as confidential credentials. Users are
            responsible for protecting their own RapidAPI credentials.
          </p>
          <h2>4. Logs and analytics</h2>
          <p>
            Logs are used for debugging, security, abuse prevention, performance monitoring, and
            service reliability. Logs may be retained for a reasonable operational period.
          </p>
          <h2>5. Third-party services</h2>
          <p>
            The service may use infrastructure and API marketplace providers such as Vercel,
            RapidAPI, Redis providers, and YouTube-related public data sources.
          </p>
          <h2>6. Data retention</h2>
          <p>
            Cached transcript and metadata responses may be temporarily stored to improve
            performance and reduce repeated upstream requests.
          </p>
          <h2>7. Contact</h2>
          <p>
            Privacy questions can be sent to{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </section>
      </main>
    </PageShell>
  );
}
