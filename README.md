# youtube-transcript-api

Production-ready REST API for extracting YouTube subtitles/transcripts and basic video metadata with Next.js 16, TypeScript, Redis caching, API key authentication, request logging, rate limiting, OpenAPI, Swagger UI, Docker, Vercel, and RapidAPI support.

## Endpoints

| Method | Path                                  | Auth | Description                                      |
| ------ | ------------------------------------- | ---- | ------------------------------------------------ |
| GET    | `/api/health`                         | No   | Health check                                     |
| GET    | `/api/transcript?id=VIDEO_ID&lang=en` | Yes  | Fetch transcript segments                        |
| GET    | `/api/metadata?id=VIDEO_ID`           | Yes  | Fetch title, description, thumbnail, and channel |
| GET    | `/api/openapi`                        | No   | OpenAPI 3.1 JSON                                 |
| GET    | `/docs`                               | No   | Swagger UI                                       |

Protected endpoints accept either:

- `x-api-key: <key>`
- `Authorization: Bearer <key>`
- `x-rapidapi-proxy-secret: <secret>` when `RAPIDAPI_PROXY_SECRET` is configured

## Example

```bash
curl "http://localhost:3000/api/transcript?id=dQw4w9WgXcQ" \
  -H "x-api-key: dev-api-key-change-me"
```

```json
{
  "success": true,
  "videoId": "dQw4w9WgXcQ",
  "language": "en",
  "transcript": [
    {
      "text": "Hello",
      "offset": 1234,
      "duration": 567
    }
  ]
}
```

## Environment

Copy `.env.example` to `.env` and update values.

```bash
cp .env.example .env
```

Required for production:

- `API_KEYS`: comma-separated API keys.
- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST URL.
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis REST token.

Recommended:

- `RAPIDAPI_PROXY_SECRET`: secret generated/configured in RapidAPI.
- `RATE_LIMIT_REQUESTS`: requests allowed per window per API key.
- `RATE_LIMIT_WINDOW`: duration such as `60s`, `5m`, or `1h`.
- `TRANSCRIPT_CACHE_TTL_SECONDS`: transcript cache TTL.
- `METADATA_CACHE_TTL_SECONDS`: metadata cache TTL.
- `NEXT_PUBLIC_API_BASE_URL`: public base URL used by Swagger/OpenAPI.

In development and test, the app falls back to an in-memory cache/rate limiter when Redis is not configured. In production, Redis is required for rate limiting so limits remain consistent across Vercel instances.

## Local Development

```bash
npm install
npm run dev
```

Open:

- API: `http://localhost:3000/api/health`
- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/api/openapi`

Run checks:

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
```

## Docker Deployment

Create `.env` first, then run:

```bash
docker compose up --build
```

The service listens on `http://localhost:3000`. For production Docker deployments, set Upstash Redis credentials in `.env` or your container platform secrets.

## Vercel Deployment

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Create a new Vercel project and import the repository.
3. Set these environment variables in Vercel:
   - `API_KEYS`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - `NEXT_PUBLIC_API_BASE_URL`
   - optional `RAPIDAPI_PROXY_SECRET`
4. Deploy.

Vercel will detect Next.js automatically. `vercel.json` configures function durations, regions, and API CORS headers.

## RapidAPI Integration

1. Deploy the API to Vercel.
2. In RapidAPI Provider Dashboard, create an API with the Vercel base URL.
3. Add endpoints:
   - `GET /api/health`
   - `GET /api/transcript`
   - `GET /api/metadata`
4. Configure RapidAPI to send `x-rapidapi-proxy-secret` and set the same value as `RAPIDAPI_PROXY_SECRET` in Vercel.
5. Do not expose your internal `API_KEYS` through RapidAPI. Let RapidAPI authenticate consumers and forward only the proxy secret to this service.

## Error Shape

```json
{
  "success": false,
  "error": {
    "code": "invalid_request",
    "message": "Invalid request query parameters",
    "details": {}
  },
  "requestId": "..."
}
```

Common status codes:

- `400`: invalid query parameters.
- `401`: missing or invalid API key.
- `429`: rate limit exceeded.
- `502`: YouTube upstream fetch failed.
- `503`: required production configuration is missing.

## Notes

- The transcript endpoint uses the `youtube-transcript` package, which relies on publicly available YouTube transcript data.
- Private videos, disabled captions, unavailable captions, and some region-restricted videos may not return transcripts.
- Metadata is retrieved from YouTube oEmbed plus the public watch page description meta tag.
# youtube-trascript-api
