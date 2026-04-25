import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import FadeIn from "@/components/FadeIn";
import Seo from "@/components/Seo";
import { toast } from "sonner";

const SUBJECTS = ["Order enquiry", "Product question", "Returns", "General"] as const;

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.enum(SUBJECTS, { errorMap: () => ({ message: "Please choose a subject" }) }),
  message: z.string().trim().min(1, "Please enter a message").max(2000),
});

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ name, email, subject, message });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const idempotencyKey = `contact-${crypto.randomUUID()}`;
    const { error } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "contact-enquiry",
        recipientEmail: "hello@sableandsaffron.xyz",
        idempotencyKey,
        purpose: "transactional",
        templateData: parsed.data,
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error("Sorry — we couldn't send your message. Please try again.");
      return;
    }
    setDone(true);
  };

  return (
    <main className="py-12 md:py-24">
      <Seo
        title="Contact Us | Sable & Saffron"
        description="Get in touch with Sable & Saffron. Questions about your order, a product, or returns - we're here to help."
        path="/contact"
        ogType="website"
      />
      <div className="container mx-auto px-6 max-w-xl">
        <FadeIn className="space-y-8">
          <header className="text-center space-y-3">
            <h1 className="font-heading text-4xl md:text-5xl font-light text-foreground leading-tight">
              Get in touch
            </h1>
            <p className="text-sm text-muted-foreground">
              Questions about your order, a product, or returns — we're here to help.
            </p>
          </header>

          {done ? (
            <div className="rounded-xl border border-border bg-muted/30 p-8 text-center space-y-3">
              <h2 className="font-heading text-2xl text-foreground">Message received</h2>
              <p className="text-sm text-muted-foreground">
                Thank you for reaching out. We'll get back to you within 1–2 working days.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <label htmlFor="contact-name" className="text-sm text-foreground">Full name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-3 min-h-11 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-email" className="text-sm text-foreground">Email address</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  className="w-full px-4 py-3 min-h-11 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-subject" className="text-sm text-foreground">Subject</label>
                <select
                  id="contact-subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 min-h-11 rounded-lg border border-border bg-popover text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="" disabled>Choose a subject…</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-sm text-foreground">Message</label>
                <textarea
                  id="contact-message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={2000}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent text-accent-foreground py-3.5 min-h-11 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </FadeIn>
      </div>
    </main>
  );
};

export default Contact;
