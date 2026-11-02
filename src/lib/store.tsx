import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { seedProducts, type Product, effectivePrice } from "./products";

export type CartItem = { key: string; product: Product; size: string; color: string; qty: number };

type Store = {
  products: Product[];
  addProduct: (p: Product) => void;
  removeProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (p: Product, size: string, color: string) => void;
  updateQty: (key: string, qty: number) => void;
  cartOpen: boolean;
  setCartOpen: (o: boolean) => void;
  quickView: Product | null;
  setQuickView: (p: Product | null) => void;
  subtotal: number;
  count: number;
};

const Ctx = createContext<Store | null>(null);
const PKEY = "ll-custom-products";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [custom, setCustom] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState<Product | null>(null);

  useEffect(() => {
    try { setCustom(JSON.parse(localStorage.getItem(PKEY) || "[]")); } catch { /* ignore */ }
  }, []);
  const persist = (list: Product[]) => { setCustom(list); localStorage.setItem(PKEY, JSON.stringify(list)); };

  const addToCart: Store["addToCart"] = (product, size, color) => {
    const key = `${product.id}-${size}-${color}`;
    setCart((c) => {
      const ex = c.find((i) => i.key === key);
      return ex ? c.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i)) : [...c, { key, product, size, color, qty: 1 }];
    });
    setCartOpen(true);
  };

  const value: Store = {
    products: [...custom, ...seedProducts],
    addProduct: (p) => persist([p, ...custom]),
    removeProduct: (id) => persist(custom.filter((p) => p.id !== id)),
    cart,
    addToCart,
    updateQty: (key, qty) => setCart((c) => (qty <= 0 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty } : i)))),
    cartOpen, setCartOpen, quickView, setQuickView,
    subtotal: cart.reduce((s, i) => s + effectivePrice(i.product) * i.qty, 0),
    count: cart.reduce((s, i) => s + i.qty, 0),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside provider");
  return s;
};
