import type { Metadata } from "next";

import { PageShell } from "@/app/components/PageShell";
import { siteConfig } from "@/app/components/site-data";

export const metadata: Metadata = {
  title: "Terms and Conditions | YouTube Transcript API",
  description: "Terms and conditions for using the YouTube Transcript API.",
  alternates: { canonical: `${siteConfig.website}/terms` }
};

export default function TermsPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <p className="eyebrow">Legal</p>
          <h1>Terms and Conditions</h1>
          <p>These terms govern access to and use of the YouTube Transcript API.</p>
        </section>
        <section className="legal-content">
          <h2>1. Acceptance of terms</h2>
          <p>
            By accessing or using the API, you agree to these terms. If you do not agree, do not use
            the service.
          </p>
          <h2>2. API usage</h2>
          <p>
            You are responsible for using the API lawfully and for complying with all applicable
            platform, copyright, privacy, and data protection requirements.
          </p>
          <h2>3. Authentication and accounts</h2>
          <p>
            You must keep API credentials confidential. You are responsible for all activity made
            using your credentials.
          </p>
          <h2>4. Availability and limitations</h2>
          <p>
            Transcript availability depends on third-party video caption availability. Some videos
            may be unavailable, private, restricted, or blocked from transcript access.
          </p>
          <h2>5. Prohibited use</h2>
          <p>
            You may not abuse, overload, reverse engineer, resell unauthorized access, or use the
            API for unlawful, infringing, or harmful activity.
          </p>
          <h2>6. Disclaimer</h2>
          <p>
            The service is provided on an as-is and as-available basis without warranties of
            uninterrupted availability, accuracy, or fitness for a specific purpose.
          </p>
          <h2>7. Contact</h2>
          <p>
            Questions about these terms can be sent to{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </section>
      </main>
    </PageShell>
  );
}
