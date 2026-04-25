import { Link } from "react-router-dom";
import { useFavourites } from "@/context/FavouritesContext";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { Heart, ShoppingBag } from "lucide-react";
import FadeIn from "@/components/FadeIn";

const Favourites = () => {
  const { favourites, toggleFavourite } = useFavourites();
  const { addToCart } = useCart();
  const favProducts = products.filter((p) => favourites.includes(p.id));

  return (
    <main className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-light text-foreground">Your saved pieces</h1>
        </FadeIn>

        {favProducts.length === 0 ? (
          <FadeIn className="text-center py-16 space-y-4">
            <Heart size={32} className="mx-auto text-muted-foreground" />
            <p className="text-muted-foreground text-sm">Nothing saved yet, but something in the collection will catch your eye.</p>
            <Link to="/shop" className="text-accent text-sm hover:underline underline-offset-4">Browse the collection →</Link>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            {favProducts.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.05}>
                <div className="group relative">
                  <Link to={`/product/${product.id}`}>
                    <div className="overflow-hidden rounded-lg bg-muted aspect-[4/5]">
                      <img src={product.image} alt={`${product.name} — soft floral scarf for women in ${product.colourRef} | Sable & Saffron UK`} width={600} height={750} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 bg-muted" />
                    </div>
                    <div className="mt-3 space-y-1">
                      <h3 className="font-heading text-lg font-medium text-foreground">{product.name}</h3>
                      <p className="text-sm text-foreground">£{product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => addToCart(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-accent text-accent-foreground py-2 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
                    >
                      <ShoppingBag size={14} /> Add to Cart
                    </button>
                    <button
                      onClick={() => toggleFavourite(product.id)}
                      className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-primary hover:bg-muted transition-colors"
                    >
                      <Heart size={14} className="fill-primary" />
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Favourites;
