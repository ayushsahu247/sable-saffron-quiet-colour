import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import Seo from "@/components/Seo";

const faqs = [
  {
    q: "How long do I have to return a scarf?",
    a: "You can return any scarf within 30 days of delivery for a full refund or a replacement, whichever you prefer. Items must be unworn and in their original condition.",
  },
  {
    q: "Who pays for return shipping?",
    a: "Buyers are responsible for return shipping costs. We recommend using a tracked service so your parcel is covered in transit.",
  },
  {
    q: "How long do refunds take to process?",
    a: "Once we receive your parcel, your refund or replacement will be processed within 3 to 5 working days. Refunds appear on your original payment method within a few days after that.",
  },
  {
    q: "What condition do returned scarves need to be in?",
    a: "Scarves must be unworn, unwashed and in their original packaging with any tags attached. We can't accept items that show signs of wear or damage.",
  },
];

const Returns = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="py-12 md:py-24">
      <Seo
        title="Returns & Exchanges | Sable & Saffron"
        description="Easy 30-day returns on all scarves. Full refund or replacement guaranteed. Shop women's scarves online UK with confidence."
        path="/returns"
        ogType="website"
        jsonLd={faqSchema}
      />
      <div className="container mx-auto px-6 max-w-2xl">
        <FadeIn className="space-y-8">
          <h1 className="font-heading text-4xl md:text-5xl font-light text-foreground leading-tight text-center">
            Easy Returns. No Fuss.
          </h1>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              We want you to love what you receive. If for any reason you don&apos;t, we&apos;ll make it right.
            </p>
            <p>
              Return your item within 30 days of delivery for a full refund or a replacement - whichever you
              prefer. Items must be unworn and in their original condition.
            </p>
            <p>To return, simply wrap your scarf securely and send it to:</p>
            <p className="whitespace-pre-line">
              Sable &amp; Saffron Returns
              {"\n"}
              Post Office, 189-193 High Street
              {"\n"}
              Orpington, Kent
              {"\n"}
              BR6 0PF
            </p>
            <p>
              Buyers are responsible for return shipping costs. Once we receive your parcel, your refund or
              replacement will be processed within 3-5 working days.
            </p>
            <p>
              Any questions? <Link to="/contact" className="underline hover:text-foreground">Get in touch</Link>{" "}
              and we&apos;ll get back to you promptly.
            </p>
          </div>

          <section aria-labelledby="returns-faq" className="pt-8 border-t border-border">
            <h2 id="returns-faq" className="font-heading text-2xl text-foreground text-center mb-6">
              Frequently asked questions
            </h2>
            <dl className="space-y-6">
              {faqs.map((f) => (
                <div key={f.q}>
                  <dt className="font-medium text-foreground mb-1">{f.q}</dt>
                  <dd className="text-sm text-muted-foreground leading-relaxed">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </FadeIn>
      </div>
    </main>
  );
};

export default Returns;
