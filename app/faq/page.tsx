import type { Metadata } from "next";

import { PageShell } from "@/app/components/PageShell";
import { faqs, siteConfig } from "@/app/components/site-data";

export const metadata: Metadata = {
  title: "FAQ | YouTube Transcript API",
  description:
    "Frequently asked questions about transcripts, authentication, rate limits, languages, and response times.",
  alternates: { canonical: `${siteConfig.website}/faq` }
};

export default function FaqPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <p className="eyebrow">FAQ</p>
          <h1>Frequently asked questions</h1>
          <p>
            Answers for common implementation, authentication, and transcript availability
            questions.
          </p>
        </section>
        <section className="page-section">
          <div className="faq-list large">
            {faqs.map((faq) => (
              <article key={faq.question}>
                <h2>{faq.question}</h2>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
