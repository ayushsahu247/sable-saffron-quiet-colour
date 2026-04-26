import FadeIn from "@/components/FadeIn";
import Seo from "@/components/Seo";
import scarfLifestyle from "@/assets/products/scarf-13-lifestyle.jpg";

const About = () => (
  <main className="py-12 md:py-24">
    <Seo
      title="About Sable & Saffron | Colour, Quietly"
      description="Sable & Saffron curates handpicked scarves in soft, considered colour — lightweight silks and richly woven jacquards designed to layer with neutral wardrobes."
      path="/about"
      ogType="website"
    />
    <div className="container mx-auto px-6 max-w-2xl text-center">
      <FadeIn className="space-y-8">
        <h1 className="font-heading text-4xl md:text-5xl font-light text-foreground leading-tight">
          Colour doesn't have to be a statement. Sometimes it's just the finishing touch.
        </h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>There's a particular kind of dressing that never goes out of style. A great coat. A clean jumper. Shoes that work with everything. Neutrals, done well.</p>
          <p>Sable & Saffron exists for what comes next.</p>
          <p>We curate women's scarves UK-wide in soft, considered colour. Think florals, woven patterns, soft colourful scarves in shades that sit beautifully alongside everything you already own. Never clashing. Never loud. Just a quiet pop that makes the whole outfit feel intentional.</p>
          <p>Every piece is chosen for its colour, its pattern, and the way it sits on the shoulder. Lightweight silks for the in-between days. Richly woven jacquards for the cold ones. Each one beautiful. Each one worth keeping.</p>
          <p>One for Monday. One for the weekend. One for the coat you wear everywhere.</p>
          <p>Collect them. Layer them. Gift them. Wear them on a Tuesday like it's nothing.</p>
          <p className="font-heading text-xl text-foreground italic pt-4">Not fast fashion. Not a trend. Just colour, quietly.</p>
        </div>
      </FadeIn>
    </div>

    <div className="mt-16 md:mt-24 container mx-auto px-6 max-w-5xl">
      <FadeIn>
        <div className="overflow-hidden rounded-xl bg-muted aspect-[16/9]">
          <img
            src={scarfLifestyle}
            alt="Woman wearing a soft blue floral scarf draped at the shoulders — Sable & Saffron"
            width={1600}
            height={900}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      </FadeIn>
    </div>

    <div className="mt-16 md:mt-24 py-16 border-t border-border">
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
    </div>
  </main>
);

export default About;
