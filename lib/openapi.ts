import { config } from "@/lib/config";

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "YouTube Transcript API",
    version: "1.0.0",
    description:
      "REST API for retrieving YouTube transcripts and basic video metadata. Protected endpoints accept x-api-key, Bearer auth, or a configured RapidAPI proxy secret."
  },
  servers: [
    {
      url: config.NEXT_PUBLIC_API_BASE_URL
    }
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-api-key"
      },
      BearerAuth: {
        type: "http",
        scheme: "bearer"
      },
      RapidApiProxySecret: {
        type: "apiKey",
        in: "header",
        name: "x-rapidapi-proxy-secret"
      }
    },
    schemas: {
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
                  properties: {
                    status: { type: "string", enum: ["ok"] }
                  },
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
        security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }, { RapidApiProxySecret: [] }],
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            schema: { type: "string", pattern: "^[a-zA-Z0-9_-]{11}$" },
            example: "dQw4w9WgXcQ"
          },
          {
            name: "lang",
            in: "query",
            required: false,
            schema: { type: "string", example: "en" }
          }
        ],
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
                      items: {
                        type: "object",
                        properties: {
                          text: { type: "string" },
                          offset: { type: "number" },
                          duration: { type: "number" }
                        },
                        required: ["text", "offset", "duration"]
                      }
                    }
                  },
                  required: ["success", "videoId", "language", "transcript"]
                }
              }
            }
          },
          "400": {
            description: "Invalid query",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": { description: "Unauthorized" },
          "429": { description: "Rate limited" },
          "502": { description: "YouTube upstream failure" }
        }
      }
    },
    "/api/metadata": {
      get: {
        summary: "Get video metadata",
        security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }, { RapidApiProxySecret: [] }],
        parameters: [
          {
            name: "id",
            in: "query",
            required: true,
            schema: { type: "string", pattern: "^[a-zA-Z0-9_-]{11}$" },
            example: "dQw4w9WgXcQ"
          }
        ],
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
          "400": {
            description: "Invalid query",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "401": { description: "Unauthorized" },
          "429": { description: "Rate limited" },
          "502": { description: "YouTube upstream failure" }
        }
      }
    }
  }
} as const;
