import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/app/components/PageShell";
import { SectionHeader } from "@/app/components/SectionHeader";
import { endpoints, faqs, features, pricingPlans, siteConfig } from "@/app/components/site-data";

export const metadata: Metadata = {
  title: "YouTube Transcript API | Fast Captions, Metadata, and Language Detection",
  description: siteConfig.description,
  alternates: { canonical: siteConfig.website }
};

export default function HomePage() {
  return (
    <PageShell>
      <main>
        <section className="hero-section">
          <div className="hero-copy-block">
            <p className="eyebrow">Production-ready REST API</p>
            <h1>YouTube Transcript API</h1>
            <p>{siteConfig.description}</p>
            <div className="hero-actions">
              <Link href="/docs">View documentation</Link>
              <Link href="/pricing">Get started</Link>
            </div>
          </div>
          <div className="hero-code-card" aria-label="Example API request">
            <div className="window-dots">
              <span />
              <span />
              <span />
            </div>
            <pre>{`curl --request GET \\
  --url '${siteConfig.website}/api/transcript?id=dQw4w9WgXcQ&lang=en' \\
  --header 'x-api-key: YOUR_API_KEY'`}</pre>
          </div>
        </section>

        <section className="page-section">
          <SectionHeader
            eyebrow="Features"
            title="Everything needed for transcript-powered products"
            description="Build AI assistants, summarizers, search tools, SEO workflows, educational platforms, and media automation with reliable JSON endpoints."
          />
          <div className="card-grid feature-card-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature}>
                <span aria-hidden="true">✦</span>
                <h3>{feature}</h3>
                <p>Clean API behavior, structured responses, and production-focused defaults.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="page-section alt-section">
          <SectionHeader
            eyebrow="API endpoints"
            title="Simple REST endpoints"
            description="Use one consistent JSON API for transcripts, video metadata, language checks, and batch processing."
          />
          <div className="endpoint-grid">
            {endpoints.map((endpoint) => (
              <article className="endpoint-pill" key={endpoint.path}>
                <span className={endpoint.method === "POST" ? "method post" : "method"}>
                  {endpoint.method}
                </span>
                <code>{endpoint.path}</code>
                <p>{endpoint.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="page-section">
          <SectionHeader
            eyebrow="Pricing"
            title="Plans for testing and production"
            description="Start small, then scale usage as your application grows."
          />
          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <article
                className={plan.featured ? "pricing-card featured" : "pricing-card"}
                key={plan.name}
              >
                <h3>{plan.name}</h3>
                <p className="price">{plan.price}</p>
                <ul>
                  <li>{plan.requests}</li>
                  <li>{plan.support}</li>
                </ul>
                <Link href="/pricing">View plan</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="page-section alt-section">
          <SectionHeader eyebrow="FAQ" title="Common questions" />
          <div className="faq-list">
            {faqs.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="page-section contact-band">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Need help integrating transcripts?</h2>
            <p>Contact {siteConfig.company} for support, feature requests, or enterprise access.</p>
          </div>
          <Link href="/contact">Contact support</Link>
        </section>
      </main>
    </PageShell>
  );
}
