import { useEffect, useState } from "react";
import { X, Minus, Plus, MessageCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { WHATSAPP_NUMBER, effectivePrice, formatPrice, whatsappUrl } from "@/lib/products";
import { Price, Swatches, SizeChips } from "./Variants";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, subtotal } = useStore();
  const orderMsg = `Hi Luxe & Lace! I'd like to order:\n${cart.map((i) => `• ${i.product.name} (${i.size}, ${i.color}) x${i.qty} — ${formatPrice(effectivePrice(i.product) * i.qty)}`).join("\n")}\nTotal: ${formatPrice(subtotal)}`;
  return (
    <div className={`fixed inset-0 z-[60] ${cartOpen ? "" : "pointer-events-none"}`}>
      <div onClick={() => setCartOpen(false)} className={`absolute inset-0 bg-overlay transition-opacity ${cartOpen ? "opacity-100" : "opacity-0"}`} />
      <aside className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <header className="flex items-center justify-between border-b p-5">
          <h2 className="text-2xl">Your Bag</h2>
          <button onClick={() => setCartOpen(false)} aria-label="Close cart"><X /></button>
        </header>
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {cart.length === 0 && <p className="py-20 text-center text-muted-foreground">Your bag is empty.</p>}
          {cart.map((i) => (
            <div key={i.key} className="flex gap-3">
              <img src={i.product.images[0]} alt={i.product.name} className="h-24 w-20 object-cover" />
              <div className="flex flex-1 flex-col">
                <p className="font-display text-lg leading-tight">{i.product.name}</p>
                <p className="text-xs text-muted-foreground">{i.size} · {i.color}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center border">
                    <button className="p-1.5" onClick={() => updateQty(i.key, i.qty - 1)} aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                    <span className="w-6 text-center text-sm">{i.qty}</span>
                    <button className="p-1.5" onClick={() => updateQty(i.key, i.qty + 1)} aria-label="Increase"><Plus className="h-3 w-3" /></button>
                  </div>
                  <span className="text-sm">{formatPrice(effectivePrice(i.product) * i.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <footer className="space-y-3 border-t p-5">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <p className="text-xs text-muted-foreground">Use code SAVE20 at checkout for 20% off.</p>
            <a className="btn-whatsapp w-full" target="_blank" rel="noreferrer" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(orderMsg)}`}>
              <MessageCircle className="h-4 w-4" /> Order via WhatsApp
            </a>
          </footer>
        )}
      </aside>
    </div>
  );
}

const sizeGuide = [["S", "82", "64", "90"], ["M", "86", "68", "94"], ["L", "92", "74", "100"], ["XL", "98", "80", "106"]];

export function QuickView() {
  const { quickView: p, setQuickView } = useStore();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  useEffect(() => { if (p) { setImg(0); setSize(p.sizes[0] ?? ""); setColor(p.colors[0]?.name ?? ""); } }, [p]);
  if (!p) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-overlay animate-in fade-in" onClick={() => setQuickView(null)} />
      <div role="dialog" aria-modal="true" aria-labelledby="quick-view-title" className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-lg bg-background sm:rounded-lg animate-in slide-in-from-bottom-8 sm:grid-cols-2">
        <Button variant="outline" size="icon" className="absolute right-3 top-3 z-10 bg-card" onClick={() => setQuickView(null)} aria-label="Close"><X className="h-5 w-5" /></Button>
        <div className="p-3">
          <img src={p.images[img]} alt={p.name} className="aspect-[3/4] w-full rounded-md object-cover" />
          <div className="mt-2 flex gap-2">
            {p.images.map((src, i) => (
              <Button variant="ghost" key={i} aria-label={`View photo ${i + 1}`} onClick={() => setImg(i)} className={`h-auto overflow-hidden rounded-md border-2 p-0 ${i === img ? "border-primary" : "border-transparent"}`}>
                <img src={src} alt="" className="h-16 w-12 rounded-lg object-cover" />
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4 p-6">
          <p className="eyebrow">{p.category}</p>
          <h2 id="quick-view-title" className="text-2xl">{p.name}</h2>
          <Price product={p} />
          <p className="text-sm leading-relaxed text-muted-foreground">{p.description}</p>
          <div><p className="mb-2 text-xs uppercase tracking-widest">Color</p><Swatches colors={p.colors} value={color} onChange={setColor} /></div>
          <div><p className="mb-2 text-xs uppercase tracking-widest">Size</p><SizeChips sizes={p.sizes} value={size} onChange={setSize} /></div>
          <Button variant="whatsapp" asChild className="h-11 w-full"><a href={whatsappUrl(p, size, color)} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4" /> Order via WhatsApp</a></Button>
          <details className="border-t pt-3 text-sm">
            <summary className="cursor-pointer text-xs uppercase tracking-widest">Size Guide (cm)</summary>
            <table className="mt-3 w-full text-left text-xs">
              <thead><tr className="text-muted-foreground"><th>Size</th><th>Bust</th><th>Waist</th><th>Hips</th></tr></thead>
              <tbody>{sizeGuide.map((r) => <tr key={r[0]} className="border-t">{r.map((c) => <td key={c} className="py-1.5">{c}</td>)}</tr>)}</tbody>
            </table>
          </details>
        </div>
      </div>
    </div>
  );
}

export function WhatsAppFab() {
  return (
    <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Luxe & Lace! I have a question.")}`} target="_blank" rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-luxe transition hover:scale-105">
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
