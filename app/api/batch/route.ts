import type { NextRequest } from "next/server";

import { readCache, transcriptCacheKey, writeTranscriptCache } from "@/lib/cache/cache";
import { withApiHandler } from "@/lib/api-handler";
import { corsPreflightResponse, jsonResponse } from "@/lib/utils/http";
import { batchRequestSchema, parseJsonBody } from "@/lib/utils/validation";
import { getTranscript, type TranscriptItem } from "@/lib/youtube/transcript";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "bom1";

type BatchTranscriptResult =
  | {
      success: true;
      videoId: string;
      language: string;
      transcript: TranscriptItem[];
    }
  | {
      success: false;
      videoId: string;
      language: string;
      error: {
        code: string;
        message: string;
      };
    };

export function OPTIONS() {
  return corsPreflightResponse();
}

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await parseJsonBody(request, batchRequestSchema);
  const language = body.lang ?? "en";
  const results = await Promise.all(
    body.videos.map(async (videoId): Promise<BatchTranscriptResult> => {
      const cacheKey = transcriptCacheKey(videoId, language);
      const cached = await readCache<Extract<BatchTranscriptResult, { success: true }>>(cacheKey);

      if (cached) {
        return cached;
      }

      try {
        const transcript = await getTranscript(videoId, language);
        const result: BatchTranscriptResult = {
          success: true,
          videoId,
          language,
          transcript
        };

        await writeTranscriptCache(cacheKey, result);
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to fetch transcript";

        return {
          success: false,
          videoId,
          language,
          error: {
            code: "transcript_fetch_failed",
            message
          }
        };
      }
    })
  );

  return jsonResponse({
    success: true,
    count: results.length,
    results
  });
});
