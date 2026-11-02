import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { DAY, daysLeft, formatPrice, isJustLanded, seedProducts, type Category, type Product } from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Luxe & Lace" },
      { name: "description", content: "Demo admin panel to upload and manage boutique products." },
      { property: "og:title", content: "Admin Dashboard — Luxe & Lace" },
      { property: "og:description", content: "Demo admin panel for boutique products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const tabs = ["Upload Product", "Inventory"] as const;
const empty = { name: "", price: "", salePrice: "", description: "", category: "Clothing" as Category, main: "", gallery: "", sizes: "S, M, L, XL", colors: "Black:#1a1a1a, Ivory:#efe7d6", days: "30" };

function Admin() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Upload Product");
  const [f, setF] = useState(empty);
  const { products, addProduct, removeProduct } = useStore();
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const isUrl = (u: string) => /^https?:\/\/\S+$/i.test(u);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(f.price);
    const gallery = f.gallery.split(/[\n,]/).map((s) => s.trim()).filter(Boolean);
    if (!f.name.trim() || f.name.length > 100) { toast.error("Product name is required (max 100 chars)"); return; }
    if (!(price > 0)) { toast.error("Enter a valid price"); return; }
    if (!isUrl(f.main) || gallery.some((g) => !isUrl(g))) { toast.error("Image links must start with http(s)://"); return; }
    const colors = f.colors.split(",").map((c) => { const [name, hex] = c.split(":").map((s) => s.trim()); return { name: name ?? "", hex: hex && /^#[0-9a-f]{3,8}$/i.test(hex) ? hex : "#cccccc" }; }).filter((c) => c.name);
    const p: Product = {
      id: `custom-${Date.now()}`, name: f.name.trim(), price, salePrice: Number(f.salePrice) > 0 ? Number(f.salePrice) : undefined,
      description: f.description.trim().slice(0, 1000), category: f.category, images: [f.main, ...gallery],
      sizes: f.sizes.split(",").map((s) => s.trim()).filter(Boolean), colors: colors.length ? colors : [{ name: "Default", hex: "#cccccc" }],
      addedAt: Date.now(), displayDays: Math.max(1, Math.min(365, Number(f.days) || 30)),
    };
    addProduct(p); setF(empty); toast.success("Product published to the store"); setTab("Inventory");
    return undefined;
  };

  const L = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <label className="block text-xs uppercase tracking-widest">{label}<div className="mt-1 normal-case tracking-normal">{children}</div></label>
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-10">
      <p className="eyebrow">Demo · changes are saved in this browser only</p>
      <h1 className="mt-2 text-3xl">Admin Dashboard</h1>
      <div className="mt-8 flex gap-6 border-b">
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 pb-3 text-xs uppercase tracking-widest ${tab === t ? "border-primary" : "border-transparent text-muted-foreground"}`}>{t}</button>
        ))}
      </div>

      {tab === "Upload Product" ? (
        <form onSubmit={submit} className="mt-8 grid gap-5 md:grid-cols-2">
          <L label="Product Name"><input className="field" value={f.name} onChange={set("name")} maxLength={100} /></L>
          <L label="Category"><select className="field" value={f.category} onChange={set("category")}><option>Clothing</option><option>Shoes</option><option>Accessories</option></select></L>
          <L label="Price (KSh)"><input className="field" type="number" min="0" step="1" value={f.price} onChange={set("price")} /></L>
          <L label="Sale Price (KSh, optional)"><input className="field" type="number" min="0" step="1" value={f.salePrice} onChange={set("salePrice")} /></L>
          <div className="md:col-span-2"><L label="Main Photo URL"><input className="field" placeholder="https://…" value={f.main} onChange={set("main")} /></L></div>
          <div className="md:col-span-2"><L label="Additional Gallery Photo URLs (one per line)"><textarea className="field h-24" value={f.gallery} onChange={set("gallery")} /></L></div>
          <div className="md:col-span-2"><L label="Description"><textarea className="field h-24" maxLength={1000} value={f.description} onChange={set("description")} /></L></div>
          <L label="Sizes (comma separated)"><input className="field" value={f.sizes} onChange={set("sizes")} /></L>
          <L label="Colors (Name:#hex, comma separated)"><input className="field" value={f.colors} onChange={set("colors")} /></L>
          <div className="md:col-span-2 bg-muted p-4">
            <L label="Display Duration / Expiry Timeline">
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <select className="field max-w-40" value={f.days} onChange={set("days")}>
                  {["7", "14", "30", "60", "90"].map((d) => <option key={d} value={d}>{d} days</option>)}
                </select>
                <span className="text-muted-foreground">in "Just Landed", then auto-moves to "All Products" on {new Date(Date.now() + Number(f.days) * DAY).toLocaleDateString()}.</span>
              </div>
            </L>
          </div>
          {f.main && isUrl(f.main) && <img src={f.main} alt="Preview" className="h-40 w-32 object-cover" />}
          <button className="btn-primary md:col-span-2">Publish Product</button>
        </form>
      ) : (
        <div className="mt-8 divide-y">
          {products.map((p) => {
            const custom = !seedProducts.includes(p);
            return (
              <div key={p.id} className="flex items-center gap-4 py-3">
                <img src={p.images[0]} alt="" className="h-16 w-12 object-cover" />
                <div className="flex-1">
                  <p className="font-display text-lg">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category} · {formatPrice(p.salePrice ?? p.price)} · {isJustLanded(p) ? `Just Landed (${daysLeft(p)} days left)` : "All Products"}</p>
                </div>
                {custom && <button onClick={() => removeProduct(p.id)} aria-label="Delete" className="text-destructive"><Trash2 className="h-4 w-4" /></button>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
