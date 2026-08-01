import { describe, expect, it } from "vitest";

import { parseDurationMs, parseVideoRequest } from "./validation";

describe("validation", () => {
  it("parses valid YouTube video id query", () => {
    const parsed = parseVideoRequest(new URLSearchParams({ id: "dQw4w9WgXcQ", lang: "en" }));

    expect(parsed).toEqual({ id: "dQw4w9WgXcQ", lang: "en" });
  });

  it("rejects invalid video ids", () => {
    expect(() => parseVideoRequest(new URLSearchParams({ id: "bad" }))).toThrow(
      "Invalid request query parameters"
    );
  });

  it("parses duration windows", () => {
    expect(parseDurationMs("60s")).toBe(60_000);
    expect(parseDurationMs("5m")).toBe(300_000);
  });
});
