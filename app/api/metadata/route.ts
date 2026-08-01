import type { NextRequest } from "next/server";

import { withApiHandler } from "@/lib/api-handler";
import { metadataCacheKey, readCache, writeMetadataCache } from "@/lib/cache/cache";
import { corsPreflightResponse, jsonResponse } from "@/lib/utils/http";
import { parseVideoRequest } from "@/lib/utils/validation";
import { getMetadata, type VideoMetadata } from "@/lib/youtube/metadata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS() {
  return corsPreflightResponse();
}

export const GET = withApiHandler(async (request: NextRequest) => {
  const { id } = parseVideoRequest(request.nextUrl.searchParams);
  const cacheKey = metadataCacheKey(id);
  const cached = await readCache<VideoMetadata>(cacheKey);

  if (cached) {
    return jsonResponse(cached, 200, { "x-cache": "HIT" });
  }

  const response = await getMetadata(id);
  await writeMetadataCache(cacheKey, response);

  return jsonResponse(response, 200, { "x-cache": "MISS" });
});
