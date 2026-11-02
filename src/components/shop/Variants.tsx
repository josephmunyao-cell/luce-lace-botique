import { effectivePrice, formatPrice, type Color, type Product } from "@/lib/products";
import { Button } from "@/components/ui/button";

export function Price({ product }: { product: Product }) {
  return <p className="mt-1 text-lg font-bold text-foreground">{formatPrice(effectivePrice(product))}</p>;
}

export function Swatches({ colors, value, onChange }: { colors: Color[]; value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {colors.map((c) => (
        <Button variant="ghost" key={c.name} type="button" title={c.name} aria-label={`Color ${c.name}`} aria-pressed={value === c.name} onClick={() => onChange(c.name)}
          className={`h-4 w-4 shrink-0 rounded-full border p-0 ring-offset-2 ring-offset-background transition ${value === c.name ? "ring-1 ring-primary" : ""}`}
          style={{ backgroundColor: c.hex }} />
      ))}
      <span className="text-xs text-muted-foreground">{value}</span>
    </div>
  );
}

export function SizeChips({ sizes, value, onChange }: { sizes: string[]; value: string; onChange: (s: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {sizes.map((s) => (
        <Button variant="ghost" key={s} type="button" aria-pressed={value === s} onClick={() => onChange(s)}
          className={`h-7 min-w-7 rounded border px-2 py-1 text-[11px] transition ${value === s ? "border-primary bg-secondary text-primary hover:bg-secondary hover:text-primary" : "hover:border-primary hover:bg-muted hover:text-foreground"}`}>
          {s}
        </Button>
      ))}
    </div>
  );
}
