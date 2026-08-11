import type { NextRequest } from "next/server";

import {
  formattedTranscriptCacheKey,
  readCache,
  transcriptCacheKey,
  writeTranscriptCache
} from "@/lib/cache/cache";
import { withApiHandler } from "@/lib/api-handler";
import { corsPreflightResponse, jsonResponse } from "@/lib/utils/http";
import { batchRequestSchema, parseJsonBody } from "@/lib/utils/validation";
import { getTranscript, transcriptToText, type TranscriptItem } from "@/lib/youtube/transcript";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "global";

type BatchTranscriptResult =
  | {
      success: true;
      videoId: string;
      language: string;
      transcript: TranscriptItem[];
    }
  | {
      success: true;
      videoId: string;
      language: string;
      format: "text";
      text: string;
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
  const format = body.format;
  const results = await Promise.all(
    body.videos.map(async (videoId): Promise<BatchTranscriptResult> => {
      const cacheKey = formattedTranscriptCacheKey(videoId, language, format);
      const segmentCacheKey = transcriptCacheKey(videoId, language);
      const cached = await readCache<Extract<BatchTranscriptResult, { success: true }>>(cacheKey);

      if (cached) {
        return cached;
      }

      try {
        const cachedSegments = await readCache<
          Extract<BatchTranscriptResult, { success: true; transcript: TranscriptItem[] }>
        >(segmentCacheKey);
        const transcript = cachedSegments?.transcript ?? (await getTranscript(videoId, language));
        const result: BatchTranscriptResult =
          format === "text"
            ? {
                success: true,
                videoId,
                language,
                format,
                text: transcriptToText(transcript)
              }
            : {
                success: true,
                videoId,
                language,
                transcript
              };

        if (!cachedSegments) {
          await writeTranscriptCache(segmentCacheKey, {
            success: true,
            videoId,
            language,
            transcript
          });
        }

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
  const successful = results.filter((result) => result.success).length;
  const failed = results.length - successful;

  return jsonResponse({
    success: true,
    count: results.length,
    successful,
    failed,
    results
  });
});
