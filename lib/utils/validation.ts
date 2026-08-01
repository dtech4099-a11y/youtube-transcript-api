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

export function parseVideoRequest(searchParams: URLSearchParams) {
  const result = z
    .object({
      id: videoIdSchema,
      lang: languageSchema
    })
    .safeParse({
      id: searchParams.get("id"),
      lang: searchParams.get("lang") ?? undefined
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
