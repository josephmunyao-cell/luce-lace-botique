import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, MessageCircle, Sparkles, Tag } from "lucide-react";
import hero from "@/assets/hero.jpg";
import clothing from "@/assets/p1a.jpg";
import shoes from "@/assets/p3a.jpg";
import accessories from "@/assets/p4a.jpg";
import { useStore } from "@/lib/store";
import { isJustLanded } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import { categoryLinks } from "@/components/shop/SiteChrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Luxe & Lace — Your Everyday Fashion Edit" },
    { name: "description", content: "Discover new dresses, suits, heels and handbags at Luxe & Lace. Shop your favourites and order via WhatsApp." },
    { property: "og:title", content: "Luxe & Lace — Your Everyday Fashion Edit" },
    { property: "og:description", content: "New fashion finds, standout shoes and beautiful accessories. Order via WhatsApp." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }), component: Index,
});

const categories = [
  { name: "Clothing", image: clothing, caption: "The everyday edit" },
  { name: "Shoes", image: shoes, caption: "Step into something new" },
  { name: "Accessories", image: accessories, caption: "The finishing touch" },
];

function Index() {
  const { products } = useStore();
  const fresh = products.filter((p) => isJustLanded(p));
  return <>
    <section className="mx-auto grid max-w-7xl gap-4 px-4 pt-5 lg:grid-cols-[200px_minmax(0,1fr)]">
      <aside className="hidden border-r pr-4 lg:block">
        <h2 className="mb-3 px-3 text-sm">Shop by category</h2>
        <nav className="space-y-1">{categoryLinks.map(({ cat, label, icon: Icon }) => <Link key={cat} to="/shop" search={{ cat }} className="flex items-center gap-3 rounded-md px-3 py-3 text-sm hover:bg-accent-soft hover:text-accent"><Icon className="h-4 w-4 text-accent" />{label}<ChevronRight className="ml-auto h-3 w-3" /></Link>)}</nav>
        <Link to="/contact" className="mt-7 flex items-center gap-2 border-t px-3 pt-5 text-sm text-muted-foreground"><MessageCircle className="h-4 w-4" /> Let's talk fashion</Link>
      </aside>
      <div className="relative isolate min-h-[360px] overflow-hidden rounded-lg bg-promo md:min-h-[400px]">
        <img src={hero} alt="Luxe & Lace champagne silk gown" width={1024} height={1280} className="absolute inset-0 h-full w-full object-cover object-[center_38%]" />
        <div className="absolute inset-0 hero-shade" />
        <div className="relative flex min-h-[360px] flex-col justify-center px-6 py-10 text-promo-foreground md:min-h-[400px] md:px-10">
          <p className="mb-4 flex items-center gap-2 text-xs font-medium uppercase"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> The new-season edit</p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">Luxe & Lace</h1>
          <p className="mt-3 max-w-64 text-2xl font-medium leading-tight sm:max-w-80 sm:text-3xl">Fresh looks.<br />Everyday confidence.</p>
          <p className="mt-4 max-w-60 text-sm leading-relaxed text-promo-foreground/80 sm:max-w-72">Discover clothing, shoes and accessories that feel like you.</p>
          <Button variant="marketplace" asChild className="mt-6 h-11 w-fit px-5"><Link to="/shop" search={{ cat: "new" }}>Shop new arrivals <ArrowRight /></Link></Button>
        </div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-lg">Shop your favourites</h2><Link to="/shop" search={{ cat: "all" }} className="flex items-center gap-1 text-xs font-medium text-primary">View all <ChevronRight className="h-4 w-4" /></Link></div>
      <div className="grid grid-cols-3 gap-3 md:gap-5">{categories.map((c) => <Link key={c.name} to="/shop" search={{ cat: c.name }} className="group flex min-w-0 flex-col overflow-hidden rounded-lg border bg-card md:flex-row md:items-center">
        <img src={c.image} alt={c.name} className="aspect-[4/3] w-full object-cover object-center transition-transform group-hover:scale-105 md:aspect-square md:w-28" />
        <div className="min-w-0 p-3 md:p-5"><h3 className="text-sm md:text-lg">{c.name}</h3><p className="mt-1 hidden text-xs text-muted-foreground md:block">{c.caption}</p><span className="mt-2 hidden items-center gap-1 text-xs font-medium text-accent md:flex">Shop now <ArrowRight className="h-3 w-3" /></span></div>
      </Link>)}</div>
    </section>
    <Section title="Just landed" icon="new" items={fresh} cat="new" />
    <Section title="All products" icon="all" items={products} cat="all" />
  </>;
}

function Section({ title, icon, items, cat }: { title: string; icon: string; items: ReturnType<typeof useStore>["products"]; cat: string }) {
  if (!items.length) return null;
  return <section className="mx-auto max-w-7xl px-4 pb-8">
    <div className={`mb-4 flex items-center justify-between rounded-md px-4 py-3 ${icon === "new" ? "bg-accent text-accent-foreground" : "bg-secondary"}`}>
      <h2 className="flex items-center gap-2 text-lg">{icon === "new" ? <Sparkles className="h-4 w-4" /> : <Tag className="h-4 w-4 text-primary" />}{title}</h2>
      <Link to="/shop" search={{ cat }} className="flex items-center gap-1 text-xs font-medium">See all <ChevronRight className="h-4 w-4" /></Link>
    </div>
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
  </section>;
}
