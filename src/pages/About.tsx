import FadeIn from "@/components/FadeIn";

const About = () => (
  <main className="py-12 md:py-24">
    <div className="container mx-auto px-6 max-w-2xl text-center">
      <FadeIn className="space-y-8">
        <h1 className="font-heading text-4xl md:text-5xl font-light text-foreground leading-tight">
          Most wardrobes are one scarf away from perfect.
        </h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
          <p>I moved to the UK and fell in love with how people dress here — the long coats, the clean jumpers, the effortless neutrals. But every winter, standing on the platform waiting for my train, I'd look around and think: everyone looks lovely. And everyone looks the same.</p>
          <p>In India, colour isn't a statement. It's just Tuesday. Soft florals, woven patterns, shades that sit quietly alongside everything else — never clashing, always completing.</p>
          <p>Sable & Saffron exists because of that gap. Every scarf here is something I would wear, or have worn. Chosen for the woman who already has her style figured out — and just wants one piece that makes it feel finished.</p>
          <p className="font-heading text-xl text-foreground italic pt-4">Not fast fashion. Not a trend. Just colour, quietly.</p>
        </div>
      </FadeIn>
    </div>

    <div className="mt-16 md:mt-24 py-16 border-t border-border">
      <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10 md:gap-16">
        {[
          { icon: "✦", title: "Chosen with care", desc: "Every piece is handpicked for its colour, pattern and quality." },
          { icon: "🌿", title: "Made to stay", desc: "These scarves are made to live in your wardrobe for years." },
          { icon: "🎁", title: "Lovely to give", desc: "The easiest thoughtful gift — beautifully packaged." },
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
