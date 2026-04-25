import FadeIn from "@/components/FadeIn";
import Seo from "@/components/Seo";

const Returns = () => (
  <main className="py-12 md:py-24">
    <Seo
      title="Returns & Refunds | Sable & Saffron"
      description="Easy 30-day returns on all Sable & Saffron scarves. Unworn items can be returned for a full refund or replacement. UK returns address included."
      path="/returns"
      ogType="website"
    />
    <div className="container mx-auto px-6 max-w-2xl text-center">
      <FadeIn className="space-y-8">
        <h1 className="font-heading text-4xl md:text-5xl font-light text-foreground leading-tight">
          Easy Returns. No Fuss.
        </h1>
        <div className="space-y-4 text-sm text-muted-foreground leading-relaxed text-left md:text-center">
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
            Any questions? Drop us a message at{" "}
            <a href="mailto:hello@sableandsaffron.co.uk" className="underline hover:text-foreground">
              hello@sableandsaffron.co.uk
            </a>{" "}
            and we&apos;ll get back to you promptly.
          </p>
        </div>
      </FadeIn>
    </div>
  </main>
);

export default Returns;

