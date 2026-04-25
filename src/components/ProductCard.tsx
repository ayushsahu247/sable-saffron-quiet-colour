import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import type { Product } from "@/data/products";
import { useFavourites } from "@/context/FavouritesContext";
import LazyImage from "@/components/LazyImage";

interface ProductCardProps {
  product: Product;
  /** Set to true for above-the-fold images (e.g. first row) */
  priority?: boolean;
}

const ProductCard = ({ product, priority = false }: ProductCardProps) => {
  const { toggleFavourite, isFavourite } = useFavourites();
  const fav = isFavourite(product.id);

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          <LazyImage
            src={product.image}
            alt={`${product.name} — soft floral scarf for women in ${product.colourRef} | Sable & Saffron UK`}
            width={600}
            height={750}
            aspect="4/5"
            eager={priority}
            containerClassName="rounded-lg"
            className="transition-transform duration-500 group-hover:scale-105"
          />
          {product.inHighDemand && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full font-medium z-10">
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
        className="absolute top-3 right-3 min-w-11 min-h-11 w-11 h-11 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-background z-10"
        aria-label={fav ? "Remove from favourites" : "Add to favourites"}
      >
        <Heart size={16} className={fav ? "fill-primary text-primary" : "text-foreground"} />
      </button>
    </div>
  );
};

export default ProductCard;
