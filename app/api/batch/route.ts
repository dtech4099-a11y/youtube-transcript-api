import type { NextRequest } from "next/server";

import {
  cacheMetadata,
  createCachedValue,
  formattedTranscriptCacheKey,
  isCachedValue,
  readCache,
  transcriptCacheKey,
  type CacheMetadata,
  type CachedValue,
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
      cache?: CacheMetadata;
    }
  | {
      success: true;
      videoId: string;
      language: string;
      format: "text";
      text: string;
      cache?: CacheMetadata;
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

type BatchSegmentData = {
  success: true;
  videoId: string;
  language: string;
  transcript: TranscriptItem[];
};

type BatchTextData = {
  success: true;
  videoId: string;
  language: string;
  format: "text";
  text: string;
};

type BatchTranscriptData = BatchSegmentData | BatchTextData;

function withCacheMetadata(data: BatchTranscriptData, cache: CacheMetadata): BatchTranscriptResult {
  return { ...data, cache };
}

function unwrapCached<T>(cached: CachedValue<T> | T) {
  if (isCachedValue<T>(cached)) {
    return {
      data: cached.data,
      metadata: cacheMetadata("hit", cached)
    };
  }

  return {
    data: cached,
    metadata: cacheMetadata("hit")
  };
}

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
      const cached = await readCache<CachedValue<BatchTranscriptData> | BatchTranscriptData>(
        cacheKey
      );

      if (cached) {
        const { data, metadata } = unwrapCached(cached);
        return withCacheMetadata(data, metadata);
      }

      try {
        const cachedSegments = await readCache<CachedValue<BatchSegmentData> | BatchSegmentData>(
          segmentCacheKey
        );
        const unwrappedSegments = cachedSegments ? unwrapCached(cachedSegments) : null;
        const transcript =
          unwrappedSegments?.data.transcript ?? (await getTranscript(videoId, language));
        const result: BatchTranscriptData =
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

        if (!unwrappedSegments) {
          await writeTranscriptCache(segmentCacheKey, {
            ...createCachedValue({
              success: true,
              videoId,
              language,
              transcript
            })
          });
        }

        await writeTranscriptCache(cacheKey, createCachedValue(result));
        return withCacheMetadata(result, unwrappedSegments?.metadata ?? cacheMetadata("miss"));
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
