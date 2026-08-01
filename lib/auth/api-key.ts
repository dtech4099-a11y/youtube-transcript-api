import { createHash, timingSafeEqual } from "node:crypto";

import { config } from "@/lib/config";
import { ApiError } from "@/lib/utils/errors";

export type AuthContext = {
  subject: string;
  type: "api-key" | "rapidapi";
};

function sha256(value: string) {
  return createHash("sha256").update(value).digest();
}

function constantTimeIncludes(candidates: string[], supplied: string) {
  const suppliedHash = sha256(supplied);

  return candidates.some((candidate) => timingSafeEqual(sha256(candidate), suppliedHash));
}

function extractBearer(headers: Headers) {
  const authorization = headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  return authorization.slice("Bearer ".length).trim();
}

export function hashIdentity(value: string) {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

export function authenticateRequest(request: Request): AuthContext {
  const rapidApiSecret = request.headers.get("x-rapidapi-proxy-secret");

  if (
    config.RAPIDAPI_PROXY_SECRET &&
    rapidApiSecret &&
    constantTimeIncludes([config.RAPIDAPI_PROXY_SECRET], rapidApiSecret)
  ) {
    return { subject: `rapidapi:${hashIdentity(rapidApiSecret)}`, type: "rapidapi" };
  }

  const apiKey = request.headers.get("x-api-key") ?? extractBearer(request.headers);

  if (!apiKey) {
    throw new ApiError(401, "missing_api_key", "Provide an API key with x-api-key or Bearer auth");
  }

  if (config.API_KEYS.length === 0) {
    throw new ApiError(503, "auth_not_configured", "API key authentication is not configured");
  }

  if (!constantTimeIncludes(config.API_KEYS, apiKey)) {
    throw new ApiError(401, "invalid_api_key", "Invalid API key");
  }

  return { subject: `key:${hashIdentity(apiKey)}`, type: "api-key" };
}
