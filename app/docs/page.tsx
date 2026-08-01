import { CopyCommand } from "@/app/docs/CopyCommand";

export default function DocsPage() {
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://your-api-domain.com").replace(
    /\/+$/,
    ""
  );
  const apiKeyPlaceholder = "YOUR_API_KEY";
  const transcriptBasePowerShell = `Invoke-RestMethod "${baseUrl}/api/transcript?id=VIDEO_ID&lang=en" -Headers @{ "x-api-key" = "${apiKeyPlaceholder}" }`;
  const transcriptPowerShell = `Invoke-RestMethod "${baseUrl}/api/transcript?id=dQw4w9WgXcQ" -Headers @{ "x-api-key" = "${apiKeyPlaceholder}" }`;
  const transcriptBaseCurl = `curl "${baseUrl}/api/transcript?id=VIDEO_ID&lang=en" \\
  -H "x-api-key: ${apiKeyPlaceholder}"`;
  const transcriptCurl = `curl "${baseUrl}/api/transcript?id=dQw4w9WgXcQ" \\
  -H "x-api-key: ${apiKeyPlaceholder}"`;
  const languagesCurl = `curl "${baseUrl}/api/languages?id=VIDEO_ID" \\
  -H "x-api-key: ${apiKeyPlaceholder}"`;
  const metadataBasePowerShell = `Invoke-RestMethod "${baseUrl}/api/metadata?id=VIDEO_ID" -Headers @{ "x-api-key" = "${apiKeyPlaceholder}" }`;
  const metadataPowerShell = `Invoke-RestMethod "${baseUrl}/api/metadata?id=dQw4w9WgXcQ" -Headers @{ "x-api-key" = "${apiKeyPlaceholder}" }`;
  const metadataBaseCurl = `curl "${baseUrl}/api/metadata?id=VIDEO_ID" \\
  -H "x-api-key: ${apiKeyPlaceholder}"`;
  const metadataCurl = `curl "${baseUrl}/api/metadata?id=dQw4w9WgXcQ" \\
  -H "x-api-key: ${apiKeyPlaceholder}"`;
  const batchPowerShell = `Invoke-RestMethod "${baseUrl}/api/batch" -Method POST -ContentType "application/json" -Headers @{ "x-api-key" = "${apiKeyPlaceholder}" } -Body '{ "videos": ["dQw4w9WgXcQ", "JbhBdOfMEPs"], "lang": "en" }'`;
  const batchCurl = `curl -X POST "${baseUrl}/api/batch" \\
  -H "content-type: application/json" \\
  -H "x-api-key: ${apiKeyPlaceholder}" \\
  -d '{"videos":["dQw4w9WgXcQ","JbhBdOfMEPs"],"lang":"en"}'`;

  return (
    <main className="docs-page">
      <header className="docs-hero">
        <div className="docs-hero-content">
          <p className="eyebrow">youtube-transcript-api</p>
          <h1>API Documentation</h1>
          <p className="hero-copy">
            Extract YouTube transcripts and metadata through simple REST endpoints with API key
            authentication, Redis-backed rate limiting, and production-ready error responses.
          </p>
          <div className="hero-actions">
            <a href="/api/health">Check health</a>
            <a href="/api/openapi">OpenAPI JSON</a>
          </div>
        </div>
        <div className="hero-panel" aria-label="API summary">
          <div>
            <span>Base URL</span>
            <code>{baseUrl}</code>
          </div>
          <div>
            <span>Authentication</span>
            <code>x-api-key: YOUR_API_KEY</code>
          </div>
          <div>
            <span>Response format</span>
            <code>application/json</code>
          </div>
        </div>
      </header>
      <nav className="docs-tabs" aria-label="Documentation sections">
        <a href="#endpoints">Endpoints</a>
        <a href="#authentication">Authentication</a>
        <a href="#errors">Errors</a>
      </nav>
      <section className="docs-content">
        <section className="info-card" aria-labelledby="how-to-use">
          <h2 id="how-to-use">How to use</h2>
          <ol>
            <li>
              Choose an endpoint and replace <code>VIDEO_ID</code> with a YouTube video ID.
            </li>
            <li>
              Send your API key with the <code>x-api-key</code> header.
            </li>
            <li>Handle unavailable transcripts with the documented error responses.</li>
          </ol>
        </section>

        <section className="info-card" id="authentication" aria-labelledby="authentication-title">
          <h2 id="authentication-title">Authentication</h2>
          <p>
            Protected endpoints require an API key. Direct Vercel users send <code>x-api-key</code>.
            RapidAPI customers should use RapidAPI headers instead.
          </p>
          <pre>{'{\n  "x-api-key": "YOUR_API_KEY"\n}'}</pre>
        </section>

        <section id="endpoints" className="section-anchor" aria-label="Endpoints" />
        <div className="endpoint">
          <div className="endpoint-heading">
            <h2>Health Check</h2>
            <p>Verify that the API deployment is reachable.</p>
          </div>
          <div className="endpoint-title">
            <div>
              <span className="method">GET</span>
              <code>/api/health</code>
            </div>
            <span className="auth-badge public">Public</span>
          </div>
          <p>Public health-check endpoint.</p>
          <h3 className="sample-label">Sample response</h3>
          <pre>{'{\n  "status": "ok"\n}'}</pre>
          <a href="/api/health">Test health</a>
        </div>

        <div className="endpoint">
          <div className="endpoint-heading">
            <h2>Get Transcript</h2>
            <p>Retrieve caption segments with text and timing offsets for a YouTube video.</p>
          </div>
          <div className="endpoint-title">
            <div>
              <span className="method">GET</span>
              <code>/api/transcript?id=VIDEO_ID&amp;lang=en</code>
            </div>
            <span className="auth-badge">API key required</span>
          </div>
          <p>
            Returns dynamic transcript segments for the requested YouTube video ID. Requires{" "}
            <code>x-api-key</code>.
          </p>
          <div className="endpoint-lines">
            <div>
              <span>Base endpoint</span>
              <code>/api/transcript?id=VIDEO_ID&amp;lang=en</code>
            </div>
            <div>
              <span>Example</span>
              <code>/api/transcript?id=dQw4w9WgXcQ&amp;lang=en</code>
            </div>
          </div>
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
                <tr>
                  <td>
                    <code>id</code>
                  </td>
                  <td>Yes</td>
                  <td>11-character YouTube video ID.</td>
                </tr>
                <tr>
                  <td>
                    <code>lang</code>
                  </td>
                  <td>No</td>
                  <td>
                    Transcript language code. Defaults to <code>en</code>.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="sample-label">Sample response</h3>
          <pre>
            {
              '{\n  "success": true,\n  "videoId": "dQw4w9WgXcQ",\n  "language": "en",\n  "transcript": [\n    {\n      "text": "Hello",\n      "offset": 1234,\n      "duration": 567\n    }\n  ]\n}'
            }
          </pre>
          <div className="commands-grid">
            <CopyCommand
              command={transcriptBasePowerShell}
              label="Windows PowerShell base command"
            />
            <CopyCommand command={transcriptPowerShell} label="Windows PowerShell example" />
            <CopyCommand command={transcriptBaseCurl} label="Linux/macOS curl base command" />
            <CopyCommand command={transcriptCurl} label="Linux/macOS curl example" />
          </div>
        </div>

        <div className="endpoint">
          <div className="endpoint-heading">
            <h2>Get Languages</h2>
            <p>Check common transcript language availability for a YouTube video.</p>
          </div>
          <div className="endpoint-title">
            <div>
              <span className="method">GET</span>
              <code>/api/languages?id=VIDEO_ID</code>
            </div>
            <span className="auth-badge">API key required</span>
          </div>
          <p>
            Returns a list of supported language codes and whether each language appears available.
            Requires <code>x-api-key</code>.
          </p>
          <div className="endpoint-lines">
            <div>
              <span>Base endpoint</span>
              <code>/api/languages?id=VIDEO_ID</code>
            </div>
            <div>
              <span>Example</span>
              <code>/api/languages?id=dQw4w9WgXcQ</code>
            </div>
          </div>
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
                <tr>
                  <td>
                    <code>id</code>
                  </td>
                  <td>Yes</td>
                  <td>11-character YouTube video ID.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="sample-label">Sample response</h3>
          <pre>
            {
              '{\n  "success": true,\n  "videoId": "dQw4w9WgXcQ",\n  "languages": [\n    {\n      "code": "en",\n      "name": "English",\n      "available": true\n    }\n  ]\n}'
            }
          </pre>
          <div className="commands-grid">
            <CopyCommand command={languagesCurl} label="Linux/macOS curl base command" />
          </div>
        </div>

        <div className="endpoint">
          <div className="endpoint-heading">
            <h2>Get Metadata</h2>
            <p>Retrieve public title, description, thumbnail, and channel details.</p>
          </div>
          <div className="endpoint-title">
            <div>
              <span className="method">GET</span>
              <code>/api/metadata?id=VIDEO_ID</code>
            </div>
            <span className="auth-badge">API key required</span>
          </div>
          <p>
            Returns dynamic title, description, thumbnail, and channel for the requested video.
            Requires <code>x-api-key</code>.
          </p>
          <div className="endpoint-lines">
            <div>
              <span>Base endpoint</span>
              <code>/api/metadata?id=VIDEO_ID</code>
            </div>
            <div>
              <span>Example</span>
              <code>/api/metadata?id=dQw4w9WgXcQ</code>
            </div>
          </div>
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
                <tr>
                  <td>
                    <code>id</code>
                  </td>
                  <td>Yes</td>
                  <td>11-character YouTube video ID.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h3 className="sample-label">Sample response</h3>
          <pre>
            {'{\n  "title": "",\n  "description": "",\n  "thumbnail": "",\n  "channel": ""\n}'}
          </pre>
          <div className="commands-grid">
            <CopyCommand command={metadataBasePowerShell} label="Windows PowerShell base command" />
            <CopyCommand command={metadataPowerShell} label="Windows PowerShell example" />
            <CopyCommand command={metadataBaseCurl} label="Linux/macOS curl base command" />
            <CopyCommand command={metadataCurl} label="Linux/macOS curl example" />
          </div>
        </div>
        <div className="endpoint">
          <div className="endpoint-heading">
            <h2>Batch Transcripts</h2>
            <p>Fetch transcript results for multiple videos in one request.</p>
          </div>
          <div className="endpoint-title">
            <div>
              <span className="method post">POST</span>
              <code>/api/batch</code>
            </div>
            <span className="auth-badge">API key required</span>
          </div>
          <p>
            Accepts up to 10 video IDs and returns per-video transcript results. Requires{" "}
            <code>x-api-key</code>.
          </p>
          <h3 className="sample-label">Request body</h3>
          <pre>{'{\n  "videos": ["dQw4w9WgXcQ", "JbhBdOfMEPs"],\n  "lang": "en"\n}'}</pre>
          <h3 className="sample-label">Sample response</h3>
          <pre>
            {
              '{\n  "success": true,\n  "count": 2,\n  "results": [\n    {\n      "success": true,\n      "videoId": "dQw4w9WgXcQ",\n      "language": "en",\n      "transcript": []\n    }\n  ]\n}'
            }
          </pre>
          <div className="commands-grid">
            <CopyCommand command={batchPowerShell} label="Windows PowerShell example" />
            <CopyCommand command={batchCurl} label="Linux/macOS curl example" />
          </div>
        </div>
        <section className="info-card" id="errors" aria-labelledby="errors-title">
          <h2 id="errors-title">Error examples</h2>
          <div className="error-grid">
            <div className="error-card">
              <h3>Invalid API key</h3>
              <pre>
                {
                  '{\n  "success": false,\n  "error": {\n    "code": "invalid_api_key",\n    "message": "Invalid API key"\n  },\n  "requestId": "..."\n}'
                }
              </pre>
            </div>
            <div className="error-card">
              <h3>Transcript not found</h3>
              <pre>
                {
                  '{\n  "success": false,\n  "error": {\n    "code": "transcript_not_found",\n    "message": "Transcript is not available for this video"\n  },\n  "requestId": "..."\n}'
                }
              </pre>
            </div>
            <div className="error-card">
              <h3>Rate limit exceeded</h3>
              <pre>
                {
                  '{\n  "success": false,\n  "error": {\n    "code": "rate_limit_exceeded",\n    "message": "Rate limit exceeded"\n  },\n  "requestId": "..."\n}'
                }
              </pre>
            </div>
          </div>
        </section>
      </section>
      <footer className="docs-footer">
        <span>youtube-transcript-api v1.0.0</span>
        <a href="/api/openapi">OpenAPI JSON</a>
      </footer>
    </main>
  );
}
