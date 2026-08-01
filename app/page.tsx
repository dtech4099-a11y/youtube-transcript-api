import Link from "next/link";

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div>
          <p className="eyebrow">youtube-transcript-api</p>
          <h1>YouTube transcripts through one production-ready API.</h1>
          <p>
            Fetch transcripts, language availability, metadata, and batch transcript results from
            YouTube videos with clean REST endpoints built for Vercel and RapidAPI.
          </p>
          <div className="hero-actions">
            <Link href="/docs">View documentation</Link>
            <a href="/api/health">Check API status</a>
          </div>
        </div>
        <pre>
          {
            'curl "https://youtube-trascript-api.vercel.app/api/transcript?id=VIDEO_ID" \\\n  -H "x-api-key: YOUR_API_KEY"'
          }
        </pre>
      </section>

      <section className="landing-section">
        <h2>Features</h2>
        <div className="feature-grid">
          <div>
            <h3>Transcript extraction</h3>
            <p>Retrieve timed caption segments with text, offset, and duration fields.</p>
          </div>
          <div>
            <h3>Metadata endpoint</h3>
            <p>Fetch title, description, thumbnail, and channel information.</p>
          </div>
          <div>
            <h3>Batch support</h3>
            <p>Request transcripts for up to 10 videos in one API call.</p>
          </div>
          <div>
            <h3>Production controls</h3>
            <p>API key authentication, Redis caching, rate limiting, and structured errors.</p>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <h2>Pricing</h2>
        <p>
          Pricing is managed through RapidAPI plans. Start with a free or trial tier, then add paid
          quotas based on request volume.
        </p>
      </section>

      <section className="landing-section">
        <h2>Documentation</h2>
        <p>
          Use the public docs for examples, parameters, error responses, and OpenAPI import links.
        </p>
        <Link href="/docs">Open API docs</Link>
      </section>

      <section className="landing-section">
        <h2>Contact</h2>
        <p>For access, support, or RapidAPI partnership setup, contact the API owner.</p>
        <a href="mailto:support@example.com">support@example.com</a>
      </section>
    </main>
  );
}
