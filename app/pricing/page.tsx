import type { Metadata } from "next";
import Link from "next/link";

import { PageShell } from "@/app/components/PageShell";
import { SectionHeader } from "@/app/components/SectionHeader";
import { pricingPlans, siteConfig } from "@/app/components/site-data";

export const metadata: Metadata = {
  title: "Pricing | YouTube Transcript API",
  description:
    "Choose a YouTube Transcript API plan for testing, production, and enterprise usage.",
  alternates: { canonical: `${siteConfig.website}/pricing` }
};

export default function PricingPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <p className="eyebrow">Pricing</p>
          <h1>Plans for every transcript workload</h1>
          <p>
            Start with a small plan for testing and upgrade when your product needs more volume.
          </p>
        </section>
        <section className="page-section">
          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <article
                className={plan.featured ? "pricing-card featured" : "pricing-card"}
                key={plan.name}
              >
                <h2>{plan.name}</h2>
                <p className="price">{plan.price}</p>
                <ul>
                  <li>{plan.requests}</li>
                  <li>{plan.support}</li>
                  <li>JSON responses</li>
                  <li>REST API access</li>
                </ul>
                {plan.name === "Enterprise" ? (
                  <Link href="/contact">Contact sales</Link>
                ) : (
                  <a href={siteConfig.rapidApiMarketplaceUrl}>Get started</a>
                )}
              </article>
            ))}
          </div>
        </section>
        <section className="page-section alt-section">
          <SectionHeader
            title="Need custom volume?"
            description="Enterprise customers can request custom quotas, dedicated support, and integration guidance."
          />
          <Link className="button-link" href="/contact">
            Contact sales
          </Link>
        </section>
      </main>
    </PageShell>
  );
}
