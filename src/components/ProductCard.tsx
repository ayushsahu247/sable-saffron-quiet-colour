import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { useFavourites } from "@/context/FavouritesContext";

const ProductCard = ({ product }: { product: Product }) => {
  const { toggleFavourite, isFavourite } = useFavourites();
  const fav = isFavourite(product.id);

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-muted aspect-[4/5]">
          <img
            src={product.image}
            alt={`${product.name} — ${product.weight === "winter" ? "winter" : "lightweight"} scarf in ${product.colourRef} | Sable & Saffron`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.inHighDemand && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium">
              In High Demand
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-heading text-lg font-medium text-foreground">{product.name}</h3>
          <div className="flex items-center gap-2">
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">£{product.originalPrice.toFixed(2)}</span>
            )}
            <span className="text-sm font-medium text-foreground">£{product.price.toFixed(2)}</span>
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); toggleFavourite(product.id); }}
        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-background"
        aria-label={fav ? "Remove from favourites" : "Add to favourites"}
      >
        <Heart size={16} className={fav ? "fill-primary text-primary" : "text-foreground"} />
      </button>
    </div>
  );
};

export default ProductCard;
