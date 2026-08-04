import type { NextRequest } from "next/server";

import { readCache, transcriptCacheKey, writeTranscriptCache } from "@/lib/cache/cache";
import { withApiHandler } from "@/lib/api-handler";
import { corsPreflightResponse, jsonResponse } from "@/lib/utils/http";
import { parseVideoRequest } from "@/lib/utils/validation";
import { getTranscript, type TranscriptItem } from "@/lib/youtube/transcript";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "global";

type TranscriptResponse = {
  success: true;
  videoId: string;
  language: string;
  transcript: TranscriptItem[];
};

export function OPTIONS() {
  return corsPreflightResponse();
}

export const GET = withApiHandler(async (request: NextRequest) => {
  const { id, lang } = parseVideoRequest(request.nextUrl.searchParams);
  const language = lang ?? "en";
  const cacheKey = transcriptCacheKey(id, language);
  const cached = await readCache<TranscriptResponse>(cacheKey);

  if (cached) {
    return jsonResponse(cached, 200, { "x-cache": "HIT" });
  }

  const transcript = await getTranscript(id, language);
  const response: TranscriptResponse = {
    success: true,
    videoId: id,
    language,
    transcript
  };

  await writeTranscriptCache(cacheKey, response);

  return jsonResponse(response, 200, { "x-cache": "MISS" });
});
