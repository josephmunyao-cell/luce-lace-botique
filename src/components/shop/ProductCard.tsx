import { useState } from "react";
import { MessageCircle, Clock } from "lucide-react";
import { type Product, daysLeft, isJustLanded, whatsappUrl } from "@/lib/products";
import { useStore } from "@/lib/store";
import { Price, Swatches, SizeChips } from "./Variants";
import { Button } from "@/components/ui/button";

export function ProductCard({ product }: { product: Product }) {
  const { setQuickView } = useStore();
  const [img, setImg] = useState(0);
  const [size, setSize] = useState(product.sizes[0] ?? "");
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const fresh = isJustLanded(product);
  const total = product.images.length;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card shadow-luxe transition-shadow hover:shadow-md">
      <Button variant="ghost"
        type="button"
        onClick={() => setQuickView(product)}
        onMouseEnter={() => total > 1 && setImg(1)}
        onMouseLeave={() => setImg(0)}
        onTouchStart={() => setImg((i) => (i + 1) % total)}
        className="relative aspect-[3/4] h-auto w-full overflow-hidden rounded-none bg-muted p-0"
        aria-label={`Quick view ${product.name}`}
      >
        {product.images.map((src, i) => (
          <img key={i} src={src} alt={`${product.name} view ${i + 1}`} loading="lazy" width={768} height={1024}
            className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${i === img ? "opacity-100 scale-100" : "opacity-0 scale-105"}`} />
        ))}
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {fresh && <span className="rounded bg-secondary px-2 py-1 text-[10px] font-semibold text-secondary-foreground">Just landed</span>}
          {fresh && (
            <span className="flex items-center gap-1 rounded bg-card/90 px-2 py-1 text-[10px]">
              <Clock className="h-3 w-3" /> {daysLeft(product)} Days Left
            </span>
          )}
          {product.salePrice && <span className="rounded bg-accent-soft px-2 py-1 text-[10px] text-accent">Sale</span>}
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center gap-1">
          <div className="flex gap-1">
            {product.images.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === img ? "w-4 bg-primary" : "w-1.5 bg-card"}`} />
            ))}
          </div>
          <span className="rounded bg-card/90 px-1.5 text-[10px] text-foreground">Pic {img + 1} of {total}</span>
        </div>
      </Button>

      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <div>
          <p className="mb-1 text-[10px] text-muted-foreground">{product.category}</p>
          <h3 className="min-h-10 text-sm font-normal leading-5">{product.name}</h3>
          <Price product={product} />
        </div>
        <Swatches colors={product.colors} value={color} onChange={setColor} />
        <SizeChips sizes={product.sizes} value={size} onChange={setSize} />
        <Button variant="whatsapp" asChild className="mt-auto h-10 w-full gap-1.5 px-1 text-xs">
          <a href={whatsappUrl(product, size, color)} target="_blank" rel="noreferrer"><MessageCircle className="h-4 w-4 shrink-0" /><span>Order via WhatsApp</span></a>
        </Button>
      </div>
    </article>
  );
}
