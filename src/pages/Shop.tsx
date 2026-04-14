import { useState } from "react";
import { products, type ProductWeight } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";

type Filter = "all" | ProductWeight;

const Shop = () => {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = filter === "all" ? products : products.filter((p) => p.weight === filter);

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Lightweight", value: "lightweight" },
    { label: "Winter", value: "winter" },
  ];

  return (
    <main className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-12 space-y-3">
          <h1 className="font-heading text-4xl md:text-5xl font-light text-foreground">The Collection</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Lightweight for summer and autumn. Warm for winter. Beautiful for both.
          </p>
        </FadeIn>

        <div className="flex justify-center gap-3 mb-10">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-5 py-2 rounded-full text-sm transition-colors ${
                filter === f.value
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {filtered.map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.05}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Shop;
