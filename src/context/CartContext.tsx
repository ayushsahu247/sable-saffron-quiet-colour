import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { products as ALL_PRODUCTS, type Product } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const LS_KEY = "sable-cart";

const findProduct = (id: string) => ALL_PRODUCTS.find((p) => p.id === id);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((i: any) => i?.product?.id && typeof i.quantity === "number");
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  // Persist to localStorage when logged out
  useEffect(() => {
    if (!user) localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items, user]);

  // On login: merge local cart into cloud, then load cloud
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      const local: CartItem[] = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      if (local.length) {
        // Merge: sum quantities for items already in cloud
        const { data: existing } = await supabase
          .from("cart_items")
          .select("product_id,quantity")
          .eq("user_id", user.id);
        const existingMap = new Map(existing?.map((r) => [r.product_id, r.quantity]) ?? []);
        const merged = local.map((item) => ({
          user_id: user.id,
          product_id: item.product.id,
          quantity: (existingMap.get(item.product.id) ?? 0) + item.quantity,
        }));
        if (merged.length) {
          await supabase.from("cart_items").upsert(merged, { onConflict: "user_id,product_id" });
        }
      }
      const { data } = await supabase
        .from("cart_items")
        .select("product_id,quantity")
        .eq("user_id", user.id);
      if (!cancelled && data) {
        const loaded: CartItem[] = data
          .map((r) => {
            const p = findProduct(r.product_id);
            return p ? { product: p, quantity: r.quantity } : null;
          })
          .filter((x): x is CartItem => x !== null);
        setItems(loaded);
        localStorage.removeItem(LS_KEY);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const upsertCloud = async (productId: string, quantity: number) => {
    if (!user) return;
    await supabase
      .from("cart_items")
      .upsert({ user_id: user.id, product_id: productId, quantity }, { onConflict: "user_id,product_id" });
  };

  const deleteCloud = async (productId: string) => {
    if (!user) return;
    await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", productId);
  };

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      const next = existing
        ? prev.map((i) => (i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i))
        : [...prev, { product, quantity: 1 }];
      const newQty = (existing?.quantity ?? 0) + 1;
      upsertCloud(product.id, newQty);
      return next;
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
    deleteCloud(productId);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)));
    upsertCloud(productId, quantity);
  };

  const clearCart = async () => {
    setItems([]);
    if (user) await supabase.from("cart_items").delete().eq("user_id", user.id);
    else localStorage.removeItem(LS_KEY);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, isOpen, setIsOpen, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
