import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { isJustLanded } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";

type Search = { cat: string; q?: string | undefined };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    cat: typeof s["cat"] === "string" ? s["cat"] : "all",
    q: typeof s["q"] === "string" && s["q"] ? s["q"].slice(0, 80) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop — Luxe & Lace" },
      { name: "description", content: "Browse clothing, shoes, accessories and sale pieces at Luxe & Lace." },
      { property: "og:title", content: "Shop — Luxe & Lace" },
      { property: "og:description", content: "Browse clothing, shoes, accessories and sale pieces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

const titles: Record<string, string> = { all: "All Products", new: "New Arrivals", sale: "Sale" };

function Shop() {
  const { cat, q } = Route.useSearch();
  const { products } = useStore();
  const list = products.filter((p) => {
    if (cat === "new" && !isJustLanded(p)) return false;
    if (cat === "sale" && !p.salePrice) return false;
    if (!["all", "new", "sale"].includes(cat) && p.category !== cat) return false;
    if (q && !`${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });
  return (
    <section className="mx-auto max-w-7xl px-4 py-7">
      <p className="text-xs text-muted-foreground">Luxe & Lace / {titles[cat] ?? cat}</p>
      <div className="mb-6 mt-4 flex flex-wrap items-center justify-between gap-3 border-b pb-4"><h1 className="text-2xl">{q ? `“${q}”` : titles[cat] ?? cat}</h1><p className="text-sm text-muted-foreground">{list.length} products</p></div>
      {list.length === 0 ? <p className="text-muted-foreground">Nothing here yet — check back soon.</p> : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}
