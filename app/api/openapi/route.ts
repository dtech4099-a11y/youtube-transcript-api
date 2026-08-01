import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";

import { openApiDocument } from "@/lib/openapi";
import { corsPreflightResponse, jsonResponse } from "@/lib/utils/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS() {
  return corsPreflightResponse();
}

export async function GET(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? randomUUID();

  return jsonResponse(openApiDocument, 200, {
    "x-request-id": requestId,
    "Cache-Control": "public, max-age=300"
  });
}
