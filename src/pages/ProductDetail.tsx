import { useParams, Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { getProductById, getWeightLabel, getProductDescription } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useFavourites } from "@/context/FavouritesContext";
import FadeIn from "@/components/FadeIn";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { addToCart } = useCart();
  const { toggleFavourite, isFavourite } = useFavourites();

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/shop" className="text-accent text-sm mt-4 inline-block hover:underline">← Back to shop</Link>
      </div>
    );
  }

  const fav = isFavourite(product.id);

  return (
    <main className="py-8 md:py-16">
      <div className="container mx-auto px-6">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to collection
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <FadeIn>
            <div className="overflow-hidden rounded-xl bg-muted aspect-[4/5]">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="space-y-6 py-4">
            <div>
              <span className="inline-block bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full mb-3">
                {getWeightLabel(product.weight)}
              </span>
              <h1 className="font-heading text-3xl md:text-4xl font-medium text-foreground">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">£{product.originalPrice.toFixed(2)}</span>
              )}
              <span className="text-2xl font-heading font-semibold text-foreground">£{product.price.toFixed(2)}</span>
            </div>

            {product.inHighDemand && (
              <span className="inline-block bg-primary text-primary-foreground text-xs px-3 py-1 rounded-full">
                In High Demand
              </span>
            )}

            <p className="text-sm text-muted-foreground leading-relaxed">
              {getProductDescription(product.weight, product.colourRef)}
            </p>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-accent text-accent-foreground py-3.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Add to Cart
              </button>
              <button
                onClick={() => toggleFavourite(product.id)}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Heart size={16} className={fav ? "fill-primary text-primary" : ""} />
                {fav ? "Saved to Favourites" : "Save to Favourites"}
              </button>
            </div>

            <p className="text-xs text-muted-foreground italic pt-2">
              Makes a beautiful gift. Arrives beautifully packaged.
              <br />
              {getProductWashInstructions(product.weight)}
            </p>
          </FadeIn>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
