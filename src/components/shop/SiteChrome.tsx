import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Menu, X, Headphones, ChevronRight, Sparkles, Shirt, Footprints, Handbag, Tag, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const categoryLinks = [
  { label: "New Arrivals", cat: "new", icon: Sparkles },
  { label: "Clothing", cat: "Clothing", icon: Shirt },
  { label: "Shoes", cat: "Shoes", icon: Footprints },
  { label: "Accessories", cat: "Accessories", icon: Handbag },
  { label: "Sale", cat: "sale", icon: Tag },
] as const;

export function Header() {
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-40 bg-background shadow-luxe">
      <div className="bg-accent px-3 py-2 text-center text-xs font-medium text-accent-foreground">
        The fashion edit is here. <span className="hidden sm:inline">Your next favourite, for less.</span> Use code <strong>SAVE20</strong> for 20% off
      </div>
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-4 md:gap-8">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenu(true)} aria-label="Open menu"><Menu /></Button>
          <Link to="/" className="shrink-0 text-2xl font-bold">Luxe <span className="text-accent">&</span> Lace<span className="ml-1 text-accent">.</span></Link>
          <form className="order-3 flex w-full gap-2 md:order-none md:flex-1" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/shop", search: { cat: "all", q } }); }}>
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input aria-label="Search products" className="field h-10 pl-10" placeholder="Search fashion, shoes and accessories" value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
            <Button variant="marketplace" type="submit" className="h-10" aria-label="Search"><Search className="sm:hidden" /><span className="hidden sm:inline">Search</span></Button>
          </form>
          <Button variant="ghost" asChild className="ml-auto px-2 md:ml-0"><Link to="/contact"><Headphones /><span className="hidden sm:inline">Help & contact</span></Link></Button>
        </div>
      </header>
      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-1.5" aria-label="Shop categories">
        <Link to="/shop" search={{ cat: "all" }} className="hidden items-center gap-2 border-r pr-6 text-sm font-medium md:flex"><Menu className="h-4 w-4" /> All categories</Link>
        {categoryLinks.map((l) => <Link key={l.cat} to="/shop" search={{ cat: l.cat }} className={`shrink-0 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent-soft hover:text-accent ${l.cat === "sale" ? "font-semibold text-accent" : ""}`}>{l.label}</Link>)}
      </nav>
      {menu && <div className="fixed inset-0 z-[60] md:hidden">
        <div onClick={() => setMenu(false)} className="absolute inset-0 bg-overlay" />
        <aside className="absolute left-0 top-0 h-full w-72 bg-background p-5">
          <div className="mb-6 flex items-center justify-between"><span className="text-lg font-bold">Shop categories</span><Button variant="ghost" size="icon" onClick={() => setMenu(false)} aria-label="Close menu"><X /></Button></div>
          <nav className="flex flex-col gap-2">{categoryLinks.map(({ cat, label, icon: Icon }) => <Link key={cat} to="/shop" search={{ cat }} onClick={() => setMenu(false)} className="flex items-center gap-3 rounded-md p-3 hover:bg-muted"><Icon className="h-5 w-5 text-accent" />{label}<ChevronRight className="ml-auto h-4 w-4" /></Link>)}</nav>
        </aside>
      </div>}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t bg-muted pb-24 pt-10">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-3">
        <div><p className="text-2xl font-bold">Luxe <span className="text-accent">&</span> Lace</p><p className="mt-3 text-sm text-muted-foreground">A little style. A lot of you.</p></div>
        <div className="flex flex-col gap-3 text-sm"><Link to="/shop" search={{ cat: "all" }}>Shop all</Link><Link to="/contact">Contact us</Link><Link to="/admin" className="text-muted-foreground">Admin</Link></div>
        <div><p className="flex items-center gap-2 text-sm font-medium"><MessageCircle className="h-4 w-4 text-whatsapp" /> Order with us on WhatsApp</p><p className="mt-4 text-xs text-muted-foreground">© {new Date().getFullYear()} Luxe & Lace Boutique</p></div>
      </div>
    </footer>
  );
}
