import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";
import { getProductById, getWeightLabel, getProductDescription, getProductWashInstructions, getProductImages } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useFavourites } from "@/context/FavouritesContext";
import FadeIn from "@/components/FadeIn";
import Seo, { SITE_URL } from "@/components/Seo";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { addToCart } = useCart();
  const { toggleFavourite, isFavourite } = useFavourites();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <p className="text-muted-foreground">Product not found.</p>
        <Link to="/shop" className="text-accent text-sm mt-4 inline-block hover:underline">← Back to shop</Link>
      </div>
    );
  }

  const fav = isFavourite(product.id);
  const images = getProductImages(product);
  const description = getProductDescription(product.weight, product.colourRef);
  const weightWord = product.weight === "winter" ? "winter" : "lightweight";
  const productUrl = `${SITE_URL}/product/${product.id}`;
  const ogImage = `${SITE_URL}${product.image}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    image: images.map((src) => `${SITE_URL}${src}`),
    sku: product.id,
    brand: { "@type": "Brand", name: "Sable & Saffron" },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "GBP",
      price: product.price.toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop the Collection", item: `${SITE_URL}/shop` },
      { "@type": "ListItem", position: 3, name: product.name, item: productUrl },
    ],
  };

  return (
    <main className="py-8 md:py-16">
      <Seo
        title={`${product.name} | Women's Scarf UK | Sable & Saffron`}
        description={`${product.name} — a soft, feminine scarf in ${product.colourRef} with a beautiful woven pattern. Lightweight and elegant, perfect for summer outfits or as a gift for her. Shop now at Sable & Saffron.`}
        path={`/product/${product.id}`}
        ogImage={ogImage}
        ogType="product"
        jsonLd={[productSchema, breadcrumbSchema]}
      />
      <div className="container mx-auto px-6">
        <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to collection
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <FadeIn>
            <div className="space-y-3">
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {images.map((src, i) => (
                    <CarouselItem key={i}>
                      <div className="overflow-hidden rounded-xl bg-muted aspect-[4/5]">
                        <img
                          src={src}
                          alt={`${product.name} — soft floral scarf for women in ${product.colourRef} | Sable & Saffron UK${images.length > 1 ? ` (view ${i + 1})` : ""}`}
                          width={800}
                          height={1000}
                          loading={i === 0 ? "eager" : "lazy"}
                          decoding={i === 0 ? "sync" : "async"}
                          fetchPriority={i === 0 ? "high" : "auto"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-3" />
                    <CarouselNext className="right-3" />
                  </>
                )}
              </Carousel>
              {images.length > 1 && (
                <div className="flex gap-2 justify-center">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => api?.scrollTo(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        current === i ? "w-6 bg-foreground" : "w-1.5 bg-muted-foreground/40"
                      }`}
                    />
                  ))}
                </div>
              )}
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
