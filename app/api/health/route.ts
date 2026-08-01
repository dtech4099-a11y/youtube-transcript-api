import { randomUUID } from "node:crypto";
import type { NextRequest } from "next/server";

import { publicJson } from "@/lib/api-handler";
import { corsPreflightResponse } from "@/lib/utils/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS() {
  return corsPreflightResponse();
}

export async function GET(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") ?? randomUUID();

  return publicJson({ status: "ok" }, requestId);
}
