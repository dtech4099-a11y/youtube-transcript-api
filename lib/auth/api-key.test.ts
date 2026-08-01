import { describe, expect, it, vi } from "vitest";

describe("api key auth", () => {
  it("accepts x-api-key credentials", async () => {
    vi.resetModules();
    vi.stubEnv("API_KEYS", "alpha,beta");
    vi.stubEnv("NODE_ENV", "test");

    const { authenticateRequest } = await import("./api-key");
    const request = new Request("http://localhost/api/transcript?id=dQw4w9WgXcQ", {
      headers: { "x-api-key": "beta" }
    });

    expect(authenticateRequest(request).type).toBe("api-key");
  });

  it("rejects missing credentials", async () => {
    vi.resetModules();
    vi.stubEnv("API_KEYS", "alpha");
    vi.stubEnv("NODE_ENV", "test");

    const { authenticateRequest } = await import("./api-key");
    const request = new Request("http://localhost/api/transcript?id=dQw4w9WgXcQ");

    expect(() => authenticateRequest(request)).toThrow("Provide an API key");
  });
});
