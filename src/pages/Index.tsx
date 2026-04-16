import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import giftImage from "@/assets/gift-section.jpg";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import { useState } from "react";

interface Review {
  name: string;
  text: string;
}

const Index = () => {
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem("sable-reviews");
    return saved ? JSON.parse(saved) : [
      { name: "Sophie M.", text: "The softest scarf I've ever owned. The colour goes with absolutely everything in my wardrobe." },
      { name: "Claire W.", text: "Bought as a gift for my mum. She hasn't taken it off since. Beautifully packaged too." },
      { name: "Priya K.", text: "Finally, scarves with real colour that still feel intentional. I've bought two, will be ordering more." },
    ];
  });
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;
    const updated = [...reviews, { name: reviewName.trim(), text: reviewText.trim() }];
    setReviews(updated);
    localStorage.setItem("sable-reviews", JSON.stringify(updated));
    setReviewName("");
    setReviewText("");
  };

  const featuredProducts = products.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <img src={heroImage} alt="Woman wearing a Sable & Saffron scarf in autumn" width={1920} height={1080} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-lg space-y-6">
              <h1 className="font-heading text-5xl md:text-6xl font-light text-background leading-tight">
                Colour, quietly.
              </h1>
              <p className="text-background/90 text-lg font-light leading-relaxed">
                For every mood. For every coat. For every season. For every day.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Shop the Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Strip */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10 md:gap-16">
          {[
            { icon: "✦", title: "Chosen, not catalogued", desc: "Every piece is handpicked for its colour, pattern and quality. Nothing generic, nothing bulk-bought." },
            { icon: "🌿", title: "Built to collect, made to stay", desc: "Not fast fashion. Not a trend. The kind of piece you'll still be reaching for three years from now." },
            { icon: "🎁", title: "Lovely to give", desc: "The loveliest thing you'll buy this season - for her, or for yourself." },
          ].map((item) => (
            <FadeIn key={item.title} className="text-center space-y-3">
              <span className="text-2xl">{item.icon}</span>
              <h3 className="font-heading text-xl font-medium text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground">
              Soft colour for a grey winter.
            </h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.1}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop" className="text-sm text-accent font-medium hover:underline underline-offset-4 transition-colors">
              View all scarves →
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground mb-8">
              Colour doesn't have to be a statement. Sometimes it's just the finishing touch.
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>There's a particular kind of dressing that never goes out of style. A great coat. A clean jumper. Shoes that work with everything. Neutrals, done well.</p>
              <p>Sable & Saffron exists for what comes next.</p>
              <p>We curate scarves in soft, considered colour. Think florals, woven patterns, shades that sit beautifully alongside everything you already own. Never clashing. Never loud. Just a quiet pop that makes the whole outfit feel intentional.</p>
              <p>Every piece is chosen for its colour, its pattern, and the way it sits on the shoulder. Lightweight silks for the in-between days. Richly woven jacquards for the cold ones. Each one beautiful. Each one worth keeping.</p>
              <p>One for Monday. One for the weekend. One for the coat you wear everywhere.</p>
              <p>Collect them. Layer them. Gift them. Wear them on a Tuesday like it's nothing.</p>
              <p className="font-heading text-lg text-foreground italic">Not fast fashion. Not a trend. Just colour, quietly.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Gift Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-6 text-center max-w-xl">
          <FadeIn className="space-y-6">
            <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground">
              The easiest gift for the woman who already has everything. And the loveliest thing you'll buy yourself this season.
            </h2>
            <p className="text-sm text-muted-foreground">Beautifully packaged. Arrives ready to gift.</p>
            <Link
              to="/shop"
              className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Shop Gifts
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground">What our customers say</h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {reviews.map((review, i) => (
              <FadeIn key={i} delay={i * 0.1} className="bg-popover rounded-xl p-6 shadow-sm border border-border">
                <p className="text-sm text-muted-foreground leading-relaxed italic mb-4">"{review.text}"</p>
                <p className="text-sm font-medium text-foreground">— {review.name}</p>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="max-w-md mx-auto">
            <form onSubmit={submitReview} className="space-y-4">
              <h3 className="font-heading text-lg text-center text-foreground">Leave a review</h3>
              <input
                type="text"
                placeholder="Your name"
                value={reviewName}
                onChange={(e) => setReviewName(e.target.value)}
                maxLength={50}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <textarea
                placeholder="Your review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              <button type="submit" className="w-full bg-accent text-accent-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Submit Review
              </button>
            </form>
          </FadeIn>
        </div>
      </section>
    </main>
  );
};

export default Index;
