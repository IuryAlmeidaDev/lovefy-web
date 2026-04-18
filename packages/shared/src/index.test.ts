import { describe, expect, it } from "vitest";
import {
  buildPublishedPageUrl,
  createSlug,
  generateMessage,
  getDaysSince
} from "./index";

describe("generateMessage", () => {
  it("creates a message for each tone using the couple data", () => {
    const data = {
      senderName: "Iury",
      recipientName: "Ana",
      specialDate: "2024-06-12",
      title: "Nossa historia"
    };

    expect(generateMessage("romantico", data)).toContain("Ana");
    expect(generateMessage("fofo", data)).toContain("Iury");
    expect(generateMessage("emocionante", data)).toContain("12 de junho de 2024");
    expect(generateMessage("divertido", data)).toContain("Nossa historia");
  });
});

describe("getDaysSince", () => {
  it("counts complete days since the special date", () => {
    expect(getDaysSince("2024-06-12", new Date("2024-06-15T10:00:00"))).toBe(3);
  });

  it("does not return negative values", () => {
    expect(getDaysSince("2024-06-20", new Date("2024-06-15T10:00:00"))).toBe(0);
  });
});

describe("published page helpers", () => {
  it("builds a fictitious page URL", () => {
    expect(buildPublishedPageUrl("ana-iury", "https://lovefy.test/")).toBe(
      "https://lovefy.test/s/ana-iury"
    );
  });

  it("creates a clean slug", () => {
    expect(createSlug({ senderName: "Iury Coração", recipientName: "Ana Maria" })).toBe(
      "iury-coracao-ana-maria"
    );
  });
});
