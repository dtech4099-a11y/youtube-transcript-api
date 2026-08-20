import type { Metadata } from "next";

import { CopyCommand } from "@/app/docs/CopyCommand";
import { PageShell } from "@/app/components/PageShell";
import { SectionHeader } from "@/app/components/SectionHeader";
import { siteConfig } from "@/app/components/site-data";

export const metadata: Metadata = {
  title: "API Documentation | YouTube Transcript API",
  description:
    "Request examples, response examples, authentication headers, and error codes for the YouTube Transcript API.",
  alternates: { canonical: `${siteConfig.website}/docs` }
};

const vercelTranscriptCurl = `curl --request GET \\
  --url '${siteConfig.website}/api/transcript?id=dQw4w9WgXcQ&lang=en&format=segments' \\
  --header 'x-api-key: YOUR_API_KEY'`;

const vercelTextTranscriptCurl = `curl --request GET \\
  --url '${siteConfig.website}/api/transcript?id=dQw4w9WgXcQ&lang=en&format=text' \\
  --header 'x-api-key: YOUR_API_KEY'`;

const vercelMetadataCurl = `curl --request GET \\
  --url '${siteConfig.website}/api/metadata?id=dQw4w9WgXcQ' \\
  --header 'x-api-key: YOUR_API_KEY'`;

const vercelLanguagesCurl = `curl --request GET \\
  --url '${siteConfig.website}/api/languages?id=dQw4w9WgXcQ' \\
  --header 'x-api-key: YOUR_API_KEY'`;

const vercelBatchCurl = `curl --request POST \\
  --url '${siteConfig.website}/api/batch' \\
  --header 'content-type: application/json' \\
  --header 'x-api-key: YOUR_API_KEY' \\
  --data '{"videos":["dQw4w9WgXcQ","JbhBdOfMEPs"],"lang":"en","format":"text"}'`;

const rapidApiTranscriptCurl = `curl --request GET \\
  --url '${siteConfig.rapidApiBaseUrl}/api/transcript?id=dQw4w9WgXcQ&lang=en&format=segments' \\
  --header 'x-rapidapi-host: youtube-transcript27.p.rapidapi.com' \\
  --header 'x-rapidapi-key: YOUR_RAPIDAPI_KEY'`;

const rapidApiTextTranscriptCurl = `curl --request GET \\
  --url '${siteConfig.rapidApiBaseUrl}/api/transcript?id=dQw4w9WgXcQ&lang=en&format=text' \\
  --header 'x-rapidapi-host: youtube-transcript27.p.rapidapi.com' \\
  --header 'x-rapidapi-key: YOUR_RAPIDAPI_KEY'`;

const rapidApiMetadataCurl = `curl --request GET \\
  --url '${siteConfig.rapidApiBaseUrl}/api/metadata?id=dQw4w9WgXcQ' \\
  --header 'x-rapidapi-host: youtube-transcript27.p.rapidapi.com' \\
  --header 'x-rapidapi-key: YOUR_RAPIDAPI_KEY'`;

const rapidApiLanguagesCurl = `curl --request GET \\
  --url '${siteConfig.rapidApiBaseUrl}/api/languages?id=dQw4w9WgXcQ' \\
  --header 'x-rapidapi-host: youtube-transcript27.p.rapidapi.com' \\
  --header 'x-rapidapi-key: YOUR_RAPIDAPI_KEY'`;

const rapidApiBatchCurl = `curl --request POST \\
  --url '${siteConfig.rapidApiBaseUrl}/api/batch' \\
  --header 'content-type: application/json' \\
  --header 'x-rapidapi-host: youtube-transcript27.p.rapidapi.com' \\
  --header 'x-rapidapi-key: YOUR_RAPIDAPI_KEY' \\
  --data '{"videos":["dQw4w9WgXcQ","JbhBdOfMEPs"],"lang":"en","format":"text"}'`;

export default function DocsPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <p className="eyebrow">Documentation</p>
          <h1>Complete API documentation</h1>
          <p>
            Request examples, response formats, authentication headers, parameters, and common error
            responses for transcript-powered applications.
          </p>
        </section>

        <section className="page-section">
          <SectionHeader
            eyebrow="Authentication"
            title="API authentication"
            description="Protected endpoints require authentication. Use x-api-key for direct API access, or RapidAPI headers when calling through the RapidAPI marketplace."
          />
          <div className="doc-grid">
            <article className="doc-card">
              <h3>Direct API access</h3>
              <pre>{`Base URL: ${siteConfig.website}
x-api-key: YOUR_API_KEY`}</pre>
            </article>
            <article className="doc-card">
              <h3>RapidAPI marketplace access</h3>
              <pre>{`Base URL: ${siteConfig.rapidApiBaseUrl}
x-rapidapi-key: YOUR_RAPIDAPI_KEY
x-rapidapi-host: youtube-transcript27.p.rapidapi.com`}</pre>
            </article>
          </div>
        </section>

        <section className="page-section alt-section">
          <SectionHeader
            eyebrow="Usage model"
            title="Usage is measured by videos processed"
            description="A single transcript request counts as 1 video processed. A single metadata request counts as 1 video processed. A single languages request counts as 1 video processed. A batch request with 10 video IDs counts as 10 videos processed."
          />
          <div className="info-panel">
            <ul>
              <li>Single transcript request = 1 video processed</li>
              <li>Single metadata request = 1 video processed</li>
              <li>Single languages request = 1 video processed</li>
              <li>Batch request with 10 video IDs = 10 videos processed</li>
            </ul>
            <p>
              This makes pricing easier to estimate for batch workflows like podcast analysis,
              YouTube channel processing, AI summarization, and search indexing.
            </p>
          </div>
        </section>

        <section className="page-section alt-section">
          <SectionHeader
            eyebrow="Endpoints"
            title="Batch-first API routes"
            description="Batch processing is the main workflow for AI summarizers, channel analysis, research tools, and content pipelines."
          />
          <div className="docs-endpoints">
            <EndpointDoc
              method="POST"
              path="/api/batch"
              title="Batch Transcripts"
              description="Processes multiple YouTube video IDs in one request. Use format=text for AI summarization pipelines, or format=segments for timestamps."
              params={[
                ["videos", "Yes", "Array of 1–10 YouTube video IDs."],
                ["lang", "No", "Transcript language code. Defaults to en."],
                ["format", "No", "segments or text. Defaults to segments."]
              ]}
              response={`{
  "success": true,
  "count": 2,
  "successful": 2,
  "failed": 0,
  "results": [
    {
      "success": true,
      "videoId": "dQw4w9WgXcQ",
      "language": "en",
      "format": "text",
      "text": "Full clean transcript text..."
    }
  ]
}`}
            />
            <EndpointDoc
              method="GET"
              path="/api/transcript?id=VIDEO_ID&lang=en&format=segments"
              title="Get Transcript"
              description="Returns transcript data for a YouTube video. Use format=text for clean joined text, or format=segments for timestamped segments."
              params={[
                ["id", "Yes", "11-character YouTube video ID."],
                ["lang", "No", "Transcript language code. Defaults to en."],
                ["format", "No", "segments or text. Defaults to segments."]
              ]}
              response={`{
  "success": true,
  "videoId": "dQw4w9WgXcQ",
  "language": "en",
  "transcript": [
    {
      "text": "Hello everyone",
      "offset": 1200,
      "duration": 800
    }
  ]
}`}
            />
            <EndpointDoc
              method="GET"
              path="/api/transcript?id=VIDEO_ID&lang=en&format=text"
              title="Get Clean Text"
              description="Returns a clean plain-text transcript for summarization and search pipelines."
              params={[
                ["id", "Yes", "11-character YouTube video ID."],
                ["lang", "No", "Transcript language code. Defaults to en."],
                ["format", "No", "Set to text."]
              ]}
              response={`{
  "success": true,
  "videoId": "dQw4w9WgXcQ",
  "language": "en",
  "format": "text",
  "text": "Full clean transcript text..."
}`}
            />
            <EndpointDoc
              method="GET"
              path="/api/metadata?id=VIDEO_ID"
              title="Get Metadata"
              description="Returns public title, description, thumbnail, and channel details."
              params={[["id", "Yes", "11-character YouTube video ID."]]}
              response={`{
  "title": "Example Video Title",
  "description": "Example description",
  "thumbnail": "https://...",
  "channel": "Example Channel"
}`}
            />
            <EndpointDoc
              method="GET"
              path="/api/languages?id=VIDEO_ID"
              title="Get Languages"
              description="Checks common transcript language availability."
              params={[["id", "Yes", "11-character YouTube video ID."]]}
              response={`{
  "success": true,
  "videoId": "dQw4w9WgXcQ",
  "languages": [
    {
      "code": "en",
      "name": "English",
      "available": true
    }
  ]
}`}
            />
            <EndpointDoc
              method="GET"
              path="/api/health"
              title="Health Check"
              description="Checks whether the API deployment is reachable."
              response={`{
  "status": "ok"
}`}
            />
          </div>
        </section>

        <section className="page-section">
          <SectionHeader eyebrow="Request examples" title="Copy-ready examples" />
          <div className="commands-grid">
            <CopyCommand command={vercelBatchCurl} label="POST /api/batch" />
            <CopyCommand command={vercelTranscriptCurl} label="GET /api/transcript" />
            <CopyCommand command={vercelTextTranscriptCurl} label="GET /api/transcript format=text" />
            <CopyCommand command={vercelMetadataCurl} label="GET /api/metadata" />
            <CopyCommand command={vercelLanguagesCurl} label="GET /api/languages" />
            <CopyCommand command={rapidApiBatchCurl} label="RapidAPI POST /api/batch" />
            <CopyCommand command={rapidApiTranscriptCurl} label="RapidAPI GET /api/transcript" />
            <CopyCommand
              command={rapidApiTextTranscriptCurl}
              label="RapidAPI GET /api/transcript format=text"
            />
            <CopyCommand command={rapidApiMetadataCurl} label="RapidAPI GET /api/metadata" />
            <CopyCommand command={rapidApiLanguagesCurl} label="RapidAPI GET /api/languages" />
          </div>
        </section>

        <section className="page-section alt-section">
          <SectionHeader eyebrow="Errors" title="Error codes" />
          <div className="error-grid">
            <ErrorExample code="missing_api_key" message="Missing API key" />
            <ErrorExample code="invalid_api_key" message="Invalid API key" />
            <ErrorExample code="invalid_request" message="Invalid request parameters" />
            <ErrorExample
              code="transcript_not_found"
              message="Transcript is not available for this video"
            />
            <ErrorExample code="rate_limit_exceeded" message="Rate limit exceeded" />
            <ErrorExample code="redis_unavailable" message="Redis is not configured correctly" />
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function EndpointDoc({
  method,
  path,
  title,
  description,
  params = [],
  response
}: {
  method: "GET" | "POST";
  path: string;
  title: string;
  description: string;
  params?: Array<[string, string, string]>;
  response: string;
}) {
  return (
    <article className="endpoint doc-endpoint">
      <div className="endpoint-heading">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="endpoint-title">
        <div>
          <span className={method === "POST" ? "method post" : "method"}>{method}</span>
          <code>{path}</code>
        </div>
      </div>
      {params.length > 0 ? (
        <div className="params">
          <h3>Parameters</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Required</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {params.map(([name, required, detail]) => (
                <tr key={name}>
                  <td>
                    <code>{name}</code>
                  </td>
                  <td>{required}</td>
                  <td>{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <h3 className="sample-label">Sample response</h3>
      <pre>{response}</pre>
    </article>
  );
}

function ErrorExample({ code, message }: { code: string; message: string }) {
  return (
    <article className="error-card">
      <h3>{code}</h3>
      <pre>{`{
  "success": false,
  "error": {
    "code": "${code}",
    "message": "${message}"
  },
  "requestId": "..."
}`}</pre>
    </article>
  );
}
