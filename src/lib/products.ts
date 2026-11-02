import p1a from "@/assets/p1a.jpg";
import p1b from "@/assets/p1b.jpg";
import p2a from "@/assets/p2a.jpg";
import p2b from "@/assets/p2b.jpg";
import p3a from "@/assets/p3a.jpg";
import p4a from "@/assets/p4a.jpg";
import hero from "@/assets/hero.jpg";

export type Category = "Clothing" | "Shoes" | "Accessories";
export type Color = { name: string; hex: string };
export type Product = {
  id: string;
  name: string;
  price: number;
  salePrice?: number | undefined;
  description: string;
  category: Category;
  images: string[];
  sizes: string[];
  colors: Color[];
  addedAt: number; // ms timestamp
  displayDays: number; // days in "Just Landed"
};

export const WHATSAPP_NUMBER = "254700000000";
export const DAY = 86_400_000;

export const CURRENCY = "KSh";

// All prices are stored in Kenyan Shillings and shown with thousands separators,
// e.g. 8900 -> "KSh 8,900".
export const formatPrice = (n: number) =>
  `${CURRENCY} ${Math.round(n).toLocaleString("en-US")}`;

const now = Date.now();
export const seedProducts: Product[] = [
  { id: "satin-wrap", name: "Noir Satin Wrap Dress", price: 8900, description: "Fluid satin midi with a tie waist, bishop sleeves and a soft wrap skirt. Dry clean only.", category: "Clothing", images: [p1a, p1b, p1a, p1b], sizes: ["S", "M", "L", "XL"], colors: [{ name: "Noir", hex: "#1a1a1a" }, { name: "Champagne", hex: "#d9c3a0" }], addedAt: now - 3 * DAY, displayDays: 30 },
  { id: "linen-suit", name: "Ivory Linen Suit", price: 12500, description: "Single-button blazer and high-waisted wide-leg trousers in breathable European linen.", category: "Clothing", images: [p2a, p2b, p2a, p2b], sizes: ["S", "M", "L", "XL"], colors: [{ name: "Ivory", hex: "#efe7d6" }, { name: "Sand", hex: "#c9b08a" }], addedAt: now - 10 * DAY, displayDays: 30 },
  { id: "silk-gown", name: "Champagne Silk Gown", price: 16000, salePrice: 12800, description: "Floor-length draped silk gown with long sleeves and a gathered waist.", category: "Clothing", images: [hero, hero], sizes: ["S", "M", "L"], colors: [{ name: "Champagne", hex: "#d9c3a0" }], addedAt: now - 40 * DAY, displayDays: 30 },
  { id: "nude-pumps", name: "Nude Leather Pumps", price: 7500, description: "Pointed-toe pumps in soft nappa leather with a 10cm stiletto heel.", category: "Shoes", images: [p3a, p3a], sizes: ["37", "38", "39", "40"], colors: [{ name: "Nude", hex: "#d4b394" }, { name: "Black", hex: "#1a1a1a" }], addedAt: now - 1 * DAY, displayDays: 30 },
  { id: "mini-bag", name: "Cognac Mini Top-Handle", price: 9800, salePrice: 7800, description: "Structured calf leather mini bag with polished gold turn-lock.", category: "Accessories", images: [p4a, p4a], sizes: ["One Size"], colors: [{ name: "Cognac", hex: "#a8642e" }], addedAt: now - 50 * DAY, displayDays: 30 },
];

export const daysLeft = (p: Product, at = Date.now()) =>
  Math.ceil((p.addedAt + p.displayDays * DAY - at) / DAY);
export const isJustLanded = (p: Product, at = Date.now()) => daysLeft(p, at) > 0;
export const effectivePrice = (p: Product) => p.salePrice ?? p.price;

export function whatsappUrl(p: Product, size: string, color: string, qty = 1) {
  const msg = `Hi Luxe & Lace! I'd like to order:\n• ${p.name}\n• Size: ${size}\n• Color: ${color}\n• Qty: ${qty}\n• Price: ${formatPrice(effectivePrice(p))}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}
