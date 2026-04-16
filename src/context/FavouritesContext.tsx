import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface FavouritesContextType {
  favourites: string[];
  toggleFavourite: (productId: string) => void;
  isFavourite: (productId: string) => boolean;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);
const LS_KEY = "sable-favourites";

export const FavouritesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [favourites, setFavourites] = useState<string[]>(() => {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to localStorage when logged out
  useEffect(() => {
    if (!user) localStorage.setItem(LS_KEY, JSON.stringify(favourites));
  }, [favourites, user]);

  // On login: merge localStorage into cloud, then load cloud
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    (async () => {
      const local: string[] = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      if (local.length) {
        await supabase
          .from("favourites")
          .upsert(local.map((product_id) => ({ user_id: user.id, product_id })), {
            onConflict: "user_id,product_id",
          });
      }
      const { data } = await supabase
        .from("favourites")
        .select("product_id")
        .eq("user_id", user.id);
      if (!cancelled && data) {
        setFavourites(data.map((r) => r.product_id));
        localStorage.removeItem(LS_KEY);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  const toggleFavourite = async (productId: string) => {
    const isFav = favourites.includes(productId);
    setFavourites((prev) =>
      isFav ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    if (user) {
      if (isFav) {
        await supabase.from("favourites").delete().eq("user_id", user.id).eq("product_id", productId);
      } else {
        await supabase.from("favourites").insert({ user_id: user.id, product_id: productId });
      }
    }
  };

  const isFavourite = (productId: string) => favourites.includes(productId);

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, isFavourite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

export const useFavourites = () => {
  const context = useContext(FavouritesContext);
  if (!context) throw new Error("useFavourites must be used within FavouritesProvider");
  return context;
};
