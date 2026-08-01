export default function DocsPage() {
  return (
    <main className="docs-page">
      <header className="docs-header">
        <div>
          <p className="eyebrow">youtube-transcript-api</p>
          <h1>API Documentation</h1>
        </div>
        <a href="/api/openapi">OpenAPI JSON</a>
      </header>
      <section className="docs-content">
        <div className="endpoint">
          <div>
            <span className="method">GET</span>
            <code>/api/health</code>
          </div>
          <p>Public health-check endpoint.</p>
          <pre>{'{\n  "status": "ok"\n}'}</pre>
          <a href="/api/health">Test health</a>
        </div>

        <div className="endpoint">
          <div>
            <span className="method">GET</span>
            <code>/api/transcript?id=VIDEO_ID&amp;lang=en</code>
          </div>
          <p>Returns transcript segments for a YouTube video. Requires `x-api-key`.</p>
          <pre>
            {
              '{\n  "success": true,\n  "videoId": "dQw4w9WgXcQ",\n  "language": "en",\n  "transcript": [\n    {\n      "text": "Hello",\n      "offset": 1234,\n      "duration": 567\n    }\n  ]\n}'
            }
          </pre>
          <code className="command">
            Invoke-RestMethod &quot;http://localhost:3001/api/transcript?id=dQw4w9WgXcQ&quot;
            -Headers @{"{"} &quot;x-api-key&quot; = &quot;dev-api-key-change-me&quot; {"}"}
          </code>
        </div>

        <div className="endpoint">
          <div>
            <span className="method">GET</span>
            <code>/api/metadata?id=VIDEO_ID</code>
          </div>
          <p>Returns title, description, thumbnail, and channel. Requires `x-api-key`.</p>
          <pre>
            {'{\n  "title": "",\n  "description": "",\n  "thumbnail": "",\n  "channel": ""\n}'}
          </pre>
          <code className="command">
            Invoke-RestMethod &quot;http://localhost:3001/api/metadata?id=dQw4w9WgXcQ&quot; -Headers
            @{"{"} &quot;x-api-key&quot; = &quot;dev-api-key-change-me&quot; {"}"}
          </code>
        </div>
      </section>
    </main>
  );
}
