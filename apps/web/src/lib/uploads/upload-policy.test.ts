import { describe, expect, it, vi } from "vitest";
import { createStoragePath, validateImageForUpload } from "./upload-policy";
import { checkRateLimit } from "./rate-limit";

describe("validateImageForUpload", () => {
  it("accepts valid image files", () => {
    expect(validateImageForUpload({ mimeType: "image/jpeg", sizeBytes: 1024 })).toEqual({
      ok: true
    });
  });

  it("blocks invalid mime types", () => {
    expect(validateImageForUpload({ mimeType: "application/pdf", sizeBytes: 1024 })).toMatchObject({
      ok: false
    });
  });

  it("blocks files larger than the upload policy", () => {
    expect(validateImageForUpload({ mimeType: "image/png", sizeBytes: 6 * 1024 * 1024 })).toMatchObject({
      ok: false
    });
  });
});

describe("createStoragePath", () => {
  it("generates server-controlled WebP paths", () => {
    expect(createStoragePath("draft-1", "photo-1")).toBe("drafts/draft-1/photo-1.webp");
  });
});

describe("checkRateLimit", () => {
  it("blocks requests over the configured limit", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-15T12:00:00Z"));

    expect(checkRateLimit({ key: "ip:test", limit: 2, windowMs: 1000 }).ok).toBe(true);
    expect(checkRateLimit({ key: "ip:test", limit: 2, windowMs: 1000 }).ok).toBe(true);
    expect(checkRateLimit({ key: "ip:test", limit: 2, windowMs: 1000 }).ok).toBe(false);

    vi.useRealTimers();
  });
});
