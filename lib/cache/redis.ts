import { Redis } from "@upstash/redis";

import { config } from "@/lib/config";
import { logger } from "@/lib/logger/logger";
import { ApiError } from "@/lib/utils/errors";

type CacheRecord = {
  value: string;
  expiresAt: number;
};

const memoryCache = new Map<string, CacheRecord>();

const redis =
  config.UPSTASH_REDIS_REST_URL && config.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: config.UPSTASH_REDIS_REST_URL,
        token: config.UPSTASH_REDIS_REST_TOKEN
      })
    : null;

let redisDisabledReason: string | null = null;

function isRedisEnabled() {
  return Boolean(redis) && !redisDisabledReason;
}

export function redisAvailable() {
  return isRedisEnabled();
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown Redis error";
}

function handleRedisFailure(error: unknown) {
  const reason = getErrorMessage(error);

  if (config.isProduction) {
    throw new ApiError(
      503,
      "redis_unavailable",
      "Redis is not configured correctly for cache or rate limiting",
      { reason }
    );
  }

  redisDisabledReason = reason;
  logger.warn(
    { reason },
    "Redis failed in development; falling back to in-memory cache and rate limiting"
  );
}

export async function getJson<T>(key: string): Promise<T | null> {
  if (redis && isRedisEnabled()) {
    try {
      return await redis.get<T>(key);
    } catch (error) {
      handleRedisFailure(error);
    }
  }

  const cached = memoryCache.get(key);

  if (!cached || cached.expiresAt < Date.now()) {
    memoryCache.delete(key);
    return null;
  }

  return JSON.parse(cached.value) as T;
}

export async function setJson<T>(key: string, value: T, ttlSeconds: number) {
  if (redis && isRedisEnabled()) {
    try {
      await redis.set(key, value, { ex: ttlSeconds });
      return;
    } catch (error) {
      handleRedisFailure(error);
    }
  }

  if (config.isProduction) {
    logger.warn({ key }, "Redis is not configured; skipping production cache write");
    return;
  }

  memoryCache.set(key, {
    value: JSON.stringify(value),
    expiresAt: Date.now() + ttlSeconds * 1000
  });
}

export async function incrementWithTtl(key: string, windowMs: number) {
  if (redis && isRedisEnabled()) {
    try {
      const results = await redis
        .pipeline()
        .incr(key)
        .pexpire(key, windowMs, "NX" as never)
        .pttl(key)
        .exec<[number, number, number]>();

      const count = Number(results[0]);
      const ttl = Number(results[2]);

      return {
        count,
        resetAt: Date.now() + Math.max(ttl, 0)
      };
    } catch (error) {
      handleRedisFailure(error);
    }
  }

  const now = Date.now();
  const cached = memoryCache.get(key);

  if (!cached || cached.expiresAt <= now) {
    memoryCache.set(key, { value: "1", expiresAt: now + windowMs });
    return { count: 1, resetAt: now + windowMs };
  }

  const count = Number(cached.value) + 1;
  memoryCache.set(key, { value: String(count), expiresAt: cached.expiresAt });

  return { count, resetAt: cached.expiresAt };
}
