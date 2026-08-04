import type { NextRequest } from "next/server";

import { withApiHandler } from "@/lib/api-handler";
import { corsPreflightResponse, jsonResponse } from "@/lib/utils/http";
import { parseVideoRequest } from "@/lib/utils/validation";
import { getLanguages, type LanguageInfo } from "@/lib/youtube/languages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const preferredRegion = "global";

type LanguagesResponse = {
  success: true;
  videoId: string;
  languages: LanguageInfo[];
};

export function OPTIONS() {
  return corsPreflightResponse();
}

export const GET = withApiHandler(async (request: NextRequest) => {
  const { id } = parseVideoRequest(request.nextUrl.searchParams);
  const response: LanguagesResponse = {
    success: true,
    videoId: id,
    languages: await getLanguages(id)
  };

  return jsonResponse(response);
});
