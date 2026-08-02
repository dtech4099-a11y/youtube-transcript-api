import { randomUUID } from "node:crypto";

import { NextRequest } from "next/server";
import { z } from "zod";

import { logger } from "@/lib/logger/logger";
import { ApiError, toApiError } from "@/lib/utils/errors";
import { jsonResponse } from "@/lib/utils/http";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(4000),
  company: z.string().trim().max(0).optional()
});

const resendApiUrl = "https://api.resend.com/emails";

export async function POST(request: NextRequest) {
  const requestId = randomUUID();

  try {
    const body = contactSchema.parse(await request.json());

    if (body.company) {
      logger.warn({ requestId }, "Contact form honeypot triggered");
      return jsonResponse({ success: true, message: "Message received", requestId });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL ?? "dtech4099@gmail.com";
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ?? "YouTube Transcript API <onboarding@resend.dev>";

    if (!resendApiKey) {
      throw new ApiError(503, "email_not_configured", "Contact email service is not configured");
    }

    const response = await fetch(resendApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: body.email,
        subject: `New YouTube Transcript API message from ${body.name}`,
        text: [
          `Name: ${body.name}`,
          `Email: ${body.email}`,
          "",
          "Message:",
          body.message,
          "",
          `Request ID: ${requestId}`
        ].join("\n"),
        html: `
          <h2>New YouTube Transcript API message</h2>
          <p><strong>Name:</strong> ${escapeHtml(body.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(body.email)}</p>
          <p><strong>Request ID:</strong> ${requestId}</p>
          <hr />
          <p>${escapeHtml(body.message).replaceAll("\n", "<br />")}</p>
        `
      })
    });

    if (!response.ok) {
      const details = await response.text();
      logger.error({ requestId, status: response.status, details }, "Resend contact email failed");
      throw new ApiError(502, "email_send_failed", "Message could not be sent");
    }

    logger.info({ requestId, email: body.email }, "Contact message sent");
    return jsonResponse({ success: true, message: "Message sent successfully", requestId });
  } catch (error) {
    const apiError =
      error instanceof z.ZodError
        ? new ApiError(400, "invalid_contact_request", "Invalid contact form input", {
            issues: error.issues
          })
        : toApiError(error);

    logger.error({ requestId, error: apiError }, "Contact request failed");

    return jsonResponse(
      {
        success: false,
        error: {
          code: apiError.code,
          message: apiError.message,
          details: apiError.details
        },
        requestId
      },
      apiError.statusCode
    );
  }
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    }
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
