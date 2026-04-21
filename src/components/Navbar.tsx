import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Menu, X, User, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useFavourites } from "@/context/FavouritesContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { totalItems, setIsOpen } = useCart();
  const { favourites } = useFavourites();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const fullName =
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    "";
  const firstName = fullName.trim().split(/\s+/)[0] || "";
  const greetingLabel = firstName || user?.email || "";

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-heading text-2xl font-semibold tracking-wide text-foreground">
          Sable & Saffron
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/shop" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
            Shop
          </Link>
          <Link to="/about" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/favourites" className="relative text-muted-foreground hover:text-foreground transition-colors">
            <Heart size={20} />
            {favourites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {favourites.length}
              </span>
            )}
          </Link>
          <button onClick={() => setIsOpen(true)} className="relative text-muted-foreground hover:text-foreground transition-colors">
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          {user ? (
            <button
              onClick={signOut}
              title="Sign out"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut size={20} />
            </button>
          ) : (
            <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors" title="Sign in">
              <User size={20} />
            </Link>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-4 space-y-4">
          <Link to="/shop" onClick={() => setMobileOpen(false)} className="block text-sm tracking-wide text-muted-foreground">Shop</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)} className="block text-sm tracking-wide text-muted-foreground">About</Link>
          <Link to="/favourites" onClick={() => setMobileOpen(false)} className="block text-sm tracking-wide text-muted-foreground">Favourites ({favourites.length})</Link>
          <button onClick={() => { setIsOpen(true); setMobileOpen(false); }} className="block text-sm tracking-wide text-muted-foreground">Cart ({totalItems})</button>
          {user ? (
            <button onClick={() => { signOut(); setMobileOpen(false); }} className="block text-sm tracking-wide text-muted-foreground">Sign out</button>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="block text-sm tracking-wide text-muted-foreground">Sign in</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
