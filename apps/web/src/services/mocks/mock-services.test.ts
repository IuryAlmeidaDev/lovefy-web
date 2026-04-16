import { describe, expect, it, vi } from "vitest";
import { emptySurprise } from "@lovefy/shared";
import { approveMockPayment } from "./mock-payment-service";
import { createMockQrCode } from "./mock-qr-code-service";
import { publishMockLovePage } from "./mock-published-page-service";

describe("mock services", () => {
  it("approves the simulated payment", async () => {
    vi.useFakeTimers();
    const promise = approveMockPayment();
    await vi.advanceTimersByTimeAsync(900);

    await expect(promise).resolves.toMatchObject({
      status: "approved",
      amount: 4.99
    });
    vi.useRealTimers();
  });

  it("publishes a fictitious love page", async () => {
    vi.useFakeTimers();
    const promise = publishMockLovePage({
      ...emptySurprise,
      senderName: "Iury",
      recipientName: "Ana",
      message: "Te amo"
    });
    await vi.advanceTimersByTimeAsync(600);
    const page = await promise;

    expect(page.publishedUrl).toContain("https://lovefy.local/s/iury-ana-");
    expect(page.qrCodeValue).toBe(page.publishedUrl);
    vi.useRealTimers();
  });

  it("creates a stable local QR representation", async () => {
    vi.useFakeTimers();
    const promise = createMockQrCode("https://lovefy.local/s/demo");
    await vi.advanceTimersByTimeAsync(400);
    const qr = await promise;

    expect(qr.cells).toHaveLength(81);
    expect(qr.cells.some(Boolean)).toBe(true);
    vi.useRealTimers();
  });
});
