import { z } from "zod";

import { ApiError } from "@/lib/utils/errors";

export const videoIdSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z0-9_-]{11}$/, "YouTube video id must be exactly 11 URL-safe characters");

export const languageSchema = z
  .string()
  .trim()
  .regex(/^[a-z]{2,3}(-[A-Z]{2})?$/, "Language must be a BCP-47-like code such as en or en-US")
  .optional();

export const transcriptFormatSchema = z.enum(["segments", "text"]).default("segments");

export function parseVideoRequest(searchParams: URLSearchParams) {
  const result = z
    .object({
      id: videoIdSchema,
      lang: languageSchema,
      format: transcriptFormatSchema
    })
    .safeParse({
      id: searchParams.get("id"),
      lang: searchParams.get("lang") ?? undefined,
      format: searchParams.get("format") ?? undefined
    });

  if (!result.success) {
    throw new ApiError(
      400,
      "invalid_request",
      "Invalid request query parameters",
      result.error.flatten()
    );
  }

  return result.data;
}

export const batchRequestSchema = z.object({
  videos: z
    .array(videoIdSchema)
    .min(1, "Provide at least one video id")
    .max(10, "Batch requests support up to 10 videos"),
  lang: languageSchema,
  format: transcriptFormatSchema
});

export type BatchRequest = z.infer<typeof batchRequestSchema>;

export async function parseJsonBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw new ApiError(400, "invalid_json", "Request body must be valid JSON");
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    throw new ApiError(400, "invalid_request", "Invalid request body", result.error.flatten());
  }

  return result.data;
}

export function parseDurationMs(value: string): number {
  const match = value.match(/^(\d+)(ms|s|m|h|d)$/);

  if (!match) {
    throw new ApiError(500, "invalid_rate_limit_window", "Invalid RATE_LIMIT_WINDOW value");
  }

  const amount = Number(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000
  };

  return amount * multipliers[unit];
}
