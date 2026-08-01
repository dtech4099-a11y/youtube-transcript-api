import { z } from "zod";

const durationSchema = z.string().regex(/^\d+(ms|s|m|h|d)$/);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_KEYS: z.string().default(""),
  RAPIDAPI_PROXY_SECRET: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal("")),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  RATE_LIMIT_REQUESTS: z.coerce.number().int().positive().default(60),
  RATE_LIMIT_WINDOW: durationSchema.default("60s"),
  TRANSCRIPT_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(86400),
  METADATA_CACHE_TTL_SECONDS: z.coerce.number().int().positive().default(21600),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:3000")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
}

const apiKeys = parsed.data.API_KEYS.split(",")
  .map((key) => key.trim())
  .filter(Boolean);

export const config = {
  ...parsed.data,
  API_KEYS: apiKeys,
  isProduction: parsed.data.NODE_ENV === "production",
  hasRedis:
    Boolean(parsed.data.UPSTASH_REDIS_REST_URL) && Boolean(parsed.data.UPSTASH_REDIS_REST_TOKEN)
};
