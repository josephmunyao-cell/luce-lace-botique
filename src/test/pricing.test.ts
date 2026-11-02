import { describe, expect, it } from "vitest";

import { effectivePrice, formatPrice, seedProducts, whatsappUrl } from "@/lib/products";

// Prices are Kenyan Shillings everywhere: cards, bag, WhatsApp messages and admin.
describe("Pricing in KSh", () => {
  it("formats shillings with the KSh prefix and thousands separators", () => {
    expect(formatPrice(8900)).toBe("KSh 8,900");
    expect(formatPrice(12800)).toBe("KSh 12,800");
    expect(formatPrice(7500)).toBe("KSh 7,500");
  });

  it("quotes the active price in shillings inside the WhatsApp order message", () => {
    const gown = seedProducts.find((p) => p.id === "silk-gown")!;
    const url = whatsappUrl(gown, "M", "Champagne");
    expect(decodeURIComponent(url)).toContain(`Price: ${formatPrice(effectivePrice(gown))}`);
    expect(decodeURIComponent(url)).not.toContain("$");
  });

  it("keeps every seeded product priced in shillings, not dollars", () => {
    expect(seedProducts.length).toBeGreaterThan(0);
    for (const p of seedProducts) {
      expect(formatPrice(effectivePrice(p))).toMatch(/^KSh [\d,]+$/);
    }
  });
});
