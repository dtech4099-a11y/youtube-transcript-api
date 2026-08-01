import { config } from "@/lib/config";
import { incrementWithTtl, redisAvailable } from "@/lib/cache/redis";
import { ApiError } from "@/lib/utils/errors";
import { parseDurationMs } from "@/lib/utils/validation";

export async function enforceRateLimit(subject: string) {
  if (config.isProduction && !redisAvailable()) {
    throw new ApiError(
      503,
      "rate_limit_unavailable",
      "Redis is required for production rate limiting"
    );
  }

  const windowMs = parseDurationMs(config.RATE_LIMIT_WINDOW);
  const key = `rate-limit:${subject}`;
  const result = await incrementWithTtl(key, windowMs);
  const remaining = Math.max(config.RATE_LIMIT_REQUESTS - result.count, 0);

  if (result.count > config.RATE_LIMIT_REQUESTS) {
    throw new ApiError(429, "rate_limit_exceeded", "Rate limit exceeded", {
      limit: config.RATE_LIMIT_REQUESTS,
      remaining,
      resetAt: new Date(result.resetAt).toISOString()
    });
  }

  return {
    limit: config.RATE_LIMIT_REQUESTS,
    remaining,
    resetAt: result.resetAt
  };
}
