import { config } from "@/lib/config";

const security = [{ ApiKeyAuth: [] }, { BearerAuth: [] }, { RapidApiProxySecret: [] }];

const videoIdParameter = {
  name: "id",
  in: "query",
  required: true,
  schema: { type: "string", pattern: "^[a-zA-Z0-9_-]{11}$" },
  example: "dQw4w9WgXcQ"
};

const languageParameter = {
  name: "lang",
  in: "query",
  required: false,
  schema: { type: "string", example: "en" }
};

const errorResponses = {
  "400": { description: "Invalid request" },
  "401": { description: "Unauthorized" },
  "429": { description: "Rate limited" },
  "502": { description: "YouTube upstream failure" },
  "503": { description: "Service dependency unavailable" }
};

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "YouTube Transcript API",
    version: "1.0.0",
    description:
      "REST API for retrieving YouTube transcripts, available language checks, video metadata, and batch transcript results."
  },
  servers: [{ url: config.NEXT_PUBLIC_API_BASE_URL }],
  components: {
    securitySchemes: {
      ApiKeyAuth: { type: "apiKey", in: "header", name: "x-api-key" },
      BearerAuth: { type: "http", scheme: "bearer" },
      RapidApiProxySecret: {
        type: "apiKey",
        in: "header",
        name: "x-rapidapi-proxy-secret"
      }
    },
    schemas: {
      TranscriptItem: {
        type: "object",
        properties: {
          text: { type: "string" },
          offset: { type: "number" },
          duration: { type: "number" }
        },
        required: ["text", "offset", "duration"]
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", enum: [false] },
          error: {
            type: "object",
            properties: {
              code: { type: "string" },
              message: { type: "string" },
              details: {}
            }
          },
          requestId: { type: "string" }
        }
      }
    }
  },
  paths: {
    "/api/health": {
      get: {
        summary: "Health check",
        security: [],
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { status: { type: "string", enum: ["ok"] } },
                  required: ["status"]
                }
              }
            }
          }
        }
      }
    },
    "/api/transcript": {
      get: {
        summary: "Get transcript",
        security,
        parameters: [videoIdParameter, languageParameter],
        responses: {
          "200": {
            description: "Transcript response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [true] },
                    videoId: { type: "string" },
                    language: { type: "string" },
                    transcript: {
                      type: "array",
                      items: { $ref: "#/components/schemas/TranscriptItem" }
                    }
                  },
                  required: ["success", "videoId", "language", "transcript"]
                }
              }
            }
          },
          ...errorResponses
        }
      }
    },
    "/api/languages": {
      get: {
        summary: "Get available transcript languages",
        security,
        parameters: [videoIdParameter],
        responses: {
          "200": {
            description: "Language availability response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", enum: [true] },
                    videoId: { type: "string" },
                    languages: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          code: { type: "string" },
                          name: { type: "string" },
                          available: { type: "boolean" }
                        },
                        required: ["code", "name", "available"]
                      }
                    }
                  },
                  required: ["success", "videoId", "languages"]
                }
              }
            }
          },
          ...errorResponses
        }
      }
    },
    "/api/metadata": {
      get: {
        summary: "Get video metadata",
        security,
        parameters: [videoIdParameter],
        responses: {
          "200": {
            description: "Metadata response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    thumbnail: { type: "string" },
                    channel: { type: "string" }
                  },
                  required: ["title", "description", "thumbnail", "channel"]
                }
              }
            }
          },
          ...errorResponses
        }
      }
    },
    "/api/batch": {
      post: {
        summary: "Fetch transcripts for multiple videos",
        security,
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  videos: {
                    type: "array",
                    minItems: 1,
                    maxItems: 10,
                    items: { type: "string", pattern: "^[a-zA-Z0-9_-]{11}$" }
                  },
                  lang: { type: "string", example: "en" }
                },
                required: ["videos"]
              },
              example: {
                videos: ["dQw4w9WgXcQ", "JbhBdOfMEPs"],
                lang: "en"
              }
            }
          }
        },
        responses: {
          "200": { description: "Batch transcript response" },
          ...errorResponses
        }
      }
    }
  }
} as const;
