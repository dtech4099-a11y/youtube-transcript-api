import type { NextRequest } from "next/server";

import {
  formattedTranscriptCacheKey,
  readCache,
  transcriptCacheKey,
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
};

type TextTranscriptResponse = {
  success: true;
  videoId: string;
  language: string;
  format: "text";
  text: string;
};

export function OPTIONS() {
  return corsPreflightResponse();
}

export const GET = withApiHandler(async (request: NextRequest) => {
  const { id, lang, format } = parseVideoRequest(request.nextUrl.searchParams);
  const language = lang ?? "en";
  const cacheKey = formattedTranscriptCacheKey(id, language, format);
  const segmentCacheKey = transcriptCacheKey(id, language);
  const cached = await readCache<TranscriptResponse | TextTranscriptResponse>(cacheKey);

  if (cached) {
    return jsonResponse(cached, 200, { "x-cache": "HIT" });
  }

  const cachedSegments = await readCache<TranscriptResponse>(segmentCacheKey);
  const transcript = cachedSegments?.transcript ?? (await getTranscript(id, language));
  const response =
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

  if (!cachedSegments) {
    await writeTranscriptCache(segmentCacheKey, {
      success: true,
      videoId: id,
      language,
      transcript
    });
  }

  await writeTranscriptCache(cacheKey, response);

  return jsonResponse(response, 200, { "x-cache": cachedSegments ? "DERIVED" : "MISS" });
});
