import { NextResponse } from "next/server";

import { ApiError } from "@/lib/utils/errors";

export type ApiResponseBody = Record<string, unknown> | unknown[];

export function jsonResponse<T extends ApiResponseBody>(
  body: T,
  status = 200,
  headers?: HeadersInit
) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...headers
    }
  });
}

export function errorResponse(error: ApiError, requestId: string) {
  return jsonResponse(
    {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details
      },
      requestId
    },
    error.statusCode,
    { "x-request-id": requestId }
  );
}

export function corsPreflightResponse() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers":
        "Authorization, Content-Type, X-Api-Key, X-RapidAPI-Proxy-Secret, X-Request-Id",
      "Access-Control-Max-Age": "86400"
    }
  });
}
