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
import { parseVideoRequest } from "@/lib/utils/validation";
import { getTranscript, transcriptToText, type TranscriptItem } from "@/lib/youtube/transcript";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "global";

type TranscriptResponse = {
  success: true;
  videoId: string;
  language: string;
  transcript: TranscriptItem[];
  cache?: CacheMetadata;
};

type TextTranscriptResponse = {
  success: true;
  videoId: string;
  language: string;
  format: "text";
  text: string;
  cache?: CacheMetadata;
};

type TranscriptData = Omit<TranscriptResponse, "cache">;
type TextTranscriptData = Omit<TextTranscriptResponse, "cache">;

function withCacheMetadata<T extends TranscriptData | TextTranscriptData>(
  data: T,
  cache: CacheMetadata
) {
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

export const GET = withApiHandler(async (request: NextRequest) => {
  const { id, lang, format } = parseVideoRequest(request.nextUrl.searchParams);
  const language = lang ?? "en";
  const cacheKey = formattedTranscriptCacheKey(id, language, format);
  const segmentCacheKey = transcriptCacheKey(id, language);
  const cached = await readCache<
    CachedValue<TranscriptData | TextTranscriptData> | TranscriptData | TextTranscriptData
  >(cacheKey);

  if (cached) {
    const { data, metadata } = unwrapCached(cached);
    return jsonResponse(withCacheMetadata(data, metadata), 200, { "x-cache": "HIT" });
  }

  const cachedSegments = await readCache<CachedValue<TranscriptData> | TranscriptData>(
    segmentCacheKey
  );
  const unwrappedSegments = cachedSegments ? unwrapCached(cachedSegments) : null;
  const transcript = unwrappedSegments?.data.transcript ?? (await getTranscript(id, language));
  const response: TranscriptData | TextTranscriptData =
    format === "text"
      ? {
          success: true,
          videoId: id,
          language,
          format,
          text: transcriptToText(transcript)
        }
      : {
          success: true,
          videoId: id,
          language,
          transcript
        };

  if (!unwrappedSegments) {
    await writeTranscriptCache(segmentCacheKey, {
      ...createCachedValue({
        success: true,
        videoId: id,
        language,
        transcript
      })
    });
  }

  await writeTranscriptCache(cacheKey, createCachedValue(response));

  const metadata = unwrappedSegments?.metadata ?? cacheMetadata("miss");

  return jsonResponse(withCacheMetadata(response, metadata), 200, {
    "x-cache": unwrappedSegments ? "HIT" : "MISS"
  });
});
