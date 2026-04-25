import { useState } from "react";
import { products, type ProductWeight } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import Seo, { SITE_URL } from "@/components/Seo";

type Filter = "all" | ProductWeight;

const Shop = () => {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? products : products.filter((p) => p.weight === filter);

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Lightweight", value: "lightweight" },
    { label: "Winter", value: "winter" },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Shop Women's Scarves", item: `${SITE_URL}/shop` },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sable & Saffron Women's Scarves",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/product/${p.id}`,
      name: p.name,
    })),
  };

  return (
    <main className="py-12 md:py-20">
      <Seo
        title="Shop Women's Scarves UK | Lightweight & Winter Styles | Sable & Saffron"
        description="Browse our collection of soft floral and woven scarves for women. Lightweight summer styles and warm winter wraps - beautiful colour that pairs with everything."
        path="/shop"
        ogType="website"
        jsonLd={[breadcrumbSchema, itemListSchema]}
      />
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-8 space-y-3">
          <h1 className="font-heading text-4xl md:text-5xl font-light text-foreground">The Collection</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Lightweight for summer and autumn. Warm for winter. Beautiful for both.
          </p>
        </FadeIn>

        <FadeIn className="max-w-2xl mx-auto text-center mb-10">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Whether you're after a lightweight scarf for summer outfits, a soft floral wrap for cooler
            evenings, or a thoughtful gift for her — you'll find it here. Every piece is chosen for its
            colour, its pattern, and the way it sits on the shoulder.
          </p>
        </FadeIn>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2.5 min-h-11 rounded-full text-sm transition-colors ${
                filter === f.value
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filtered.map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.05}>
              <ProductCard product={product} priority={i < 3} />
            </FadeIn>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Shop;
