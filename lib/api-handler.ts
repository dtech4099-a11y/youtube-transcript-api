import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";

import { authenticateRequest, type AuthContext } from "@/lib/auth/api-key";
import { logger } from "@/lib/logger/logger";
import { enforceRateLimit } from "@/lib/rate-limit";
import { toApiError } from "@/lib/utils/errors";
import { errorResponse, jsonResponse } from "@/lib/utils/http";

type HandlerContext = {
  auth: AuthContext;
  requestId: string;
};

type Handler = (request: NextRequest, context: HandlerContext) => Promise<Response>;

export function withApiHandler(handler: Handler) {
  return async function routeHandler(request: NextRequest) {
    const requestId = request.headers.get("x-request-id") ?? randomUUID();
    const startedAt = Date.now();
    let status = 500;

    try {
      const auth = authenticateRequest(request);
      const rateLimit = await enforceRateLimit(auth.subject);
      const response = await handler(request, { auth, requestId });
      status = response.status;
      response.headers.set("x-request-id", requestId);
      response.headers.set("x-ratelimit-limit", String(rateLimit.limit));
      response.headers.set("x-ratelimit-remaining", String(rateLimit.remaining));
      response.headers.set("x-ratelimit-reset", String(Math.ceil(rateLimit.resetAt / 1000)));

      return response;
    } catch (error) {
      const apiError = toApiError(error);
      status = apiError.statusCode;

      return errorResponse(apiError, requestId);
    } finally {
      logger.info(
        {
          requestId,
          method: request.method,
          path: request.nextUrl.pathname,
          status,
          durationMs: Date.now() - startedAt
        },
        "request completed"
      );
    }
  };
}

export function publicJson(body: Record<string, unknown>, requestId?: string) {
  return jsonResponse(body, 200, requestId ? { "x-request-id": requestId } : undefined);
}
