import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import giftImage from "@/assets/gift-section.jpg";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import FadeIn from "@/components/FadeIn";
import Seo, { SITE_URL } from "@/components/Seo";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Review {
  id: string;
  name: string;
  text: string;
}

const Index = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("reviews")
        .select("id,name,text")
        .eq("approved", true)
        .order("created_at", { ascending: false })
        .limit(9);
      if (data) setReviews(data);
    })();
  }, []);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;
    if (!user) {
      toast.error("Please sign in to leave a review.");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      name: reviewName.trim(),
      text: reviewText.trim(),
      approved: false,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't submit your review.");
      return;
    }
    toast.success("Thank you! Your review will appear once approved.");
    setReviewName("");
    setReviewText("");
  };

  const featuredProducts = products.slice(0, 3);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sable & Saffron",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    description:
      "Handpicked scarves in soft, feminine colour. Lightweight and winter styles for women who dress in neutrals.",
  };

  return (
    <main>
      <Seo
        title="Elegant Lightweight Scarves for Women in the UK | Sable & Saffron"
        description="Soft, breathable scarves UK — lightweight summer scarves and warm winter styles for women. Designed for transitional UK weather and quiet, considered dressing."
        path="/"
        ogImage={`${SITE_URL}${heroImage}`}
        ogType="website"
        jsonLd={organizationSchema}
      />
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <img
          src={heroImage}
          alt="Woman wearing a soft, lightweight Sable & Saffron scarf for transitional UK weather"
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-lg space-y-6">
              <h1 className="font-heading text-5xl md:text-6xl font-light text-background leading-tight">
                Elegant Lightweight Scarves for Women in the UK
              </h1>
              <p className="text-background/90 text-lg font-light leading-relaxed">
                Designed for days that shift between warmth and cool. Soft, breathable scarves that move easily through a British summer and beyond.
              </p>
              <p className="text-background/80 text-sm font-light leading-relaxed italic">
                A quiet approach to dressing, shaped by softness, balance and ease.
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

      {/* Intro / SEO H2 */}
      <section className="py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-6 max-w-3xl text-center space-y-4">
          <h2 className="font-heading text-2xl md:text-3xl font-light text-foreground leading-relaxed">
            At Sable &amp; Saffron, scarves are designed to sit naturally within your wardrobe.
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Gentle fabrics, considered tones, and a fluid drape. Created for women in the UK who dress with intention, and adapt subtly to changing weather.
          </p>
        </div>
      </section>

      {/* Brand Strip */}
      <section className="py-16 md:py-20 border-b border-border">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10 md:gap-16">
          {[
            { icon: "✦", title: "Chosen with intention", desc: "Each scarf is selected for its colour, fabric and drape. Pieces meant to stay, not to follow a trend." },
            { icon: "🌿", title: "Made for transitional weather", desc: "Lightweight scarves UK women can wear from warm afternoons into cooler evenings, layered with ease." },
            { icon: "🎁", title: "Quietly giftable", desc: "A considered piece for her, or for yourself — wrapped softly, ready to arrive." },
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
          <FadeIn className="text-center mb-12 space-y-3 max-w-2xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground">
              Made for moments when the day doesn’t stay the same.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Lightweight scarves for warmer afternoons, easy to carry into cooler evenings. Alongside them, softer, warmer pieces that extend the same ease into colder months.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {featuredProducts.map((product, i) => (
              <FadeIn key={product.id} delay={i * 0.1}>
                <ProductCard product={product} priority />
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
              Nothing excessive. Only softness that settles.
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>Colours that remain wearable, and pieces that return easily into daily life.</p>
              <p>Scarves that feel right, whether the air is warm, cool, or somewhere in between — designed for the quiet rhythm of British days.</p>
              <p>Lightweight scarves UK women can wear over summer dresses and linen shirts, alongside warmer styles for autumn coats and winter knitwear. One wardrobe, continuous across the seasons.</p>
              <p className="font-heading text-lg text-foreground italic">Quiet intention. Considered colour. Softness that stays.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Gift Section */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-6 text-center max-w-xl">
          <FadeIn className="space-y-6">
            <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground">
              Explore the collection
            </h2>
            <p className="text-sm text-muted-foreground">
              A considered range of summer and winter scarves for women in the UK.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Shop the Collection
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
              <FadeIn key={review.id} delay={i * 0.1} className="bg-popover rounded-xl p-6 shadow-sm border border-border">
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
              <button type="submit" disabled={submitting} className="w-full bg-accent text-accent-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
              {!user && (
                <p className="text-xs text-center text-muted-foreground">
                  <Link to="/auth" className="text-accent hover:underline">Sign in</Link> to leave a review.
                </p>
              )}
              <p className="text-xs text-center text-muted-foreground">Reviews are visible after approval.</p>
            </form>
          </FadeIn>
        </div>
      </section>
    </main>
  );
};

export default Index;
