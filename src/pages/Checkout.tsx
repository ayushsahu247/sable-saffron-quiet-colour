import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FadeIn from "@/components/FadeIn";

// UK phone: accepts +44 7xxx xxxxxx, 07xxxxxxxxx, with optional spaces/dashes/parens.
// Strips formatting then matches UK formats. Accepts mobile and landline.
const isValidUKPhone = (raw: string) => {
  const cleaned = raw.replace(/[\s\-()]/g, "");
  // +44 followed by 9-10 digits, or 0 followed by 9-10 digits, or 44 followed by 9-10 digits
  return /^(?:\+?44|0)[1-9]\d{8,9}$/.test(cleaned);
};

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const cancelled = params.get("cancelled") === "1";

  // Clear cart if user returned from a cancelled/abandoned payment attempt
  useEffect(() => {
    if (cancelled) {
      clearCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cancelled]);

  if (!user) {
    return (
      <main className="py-20 text-center container mx-auto px-6 space-y-4">
        <h1 className="font-heading text-3xl text-foreground">Sign in to checkout</h1>
        <p className="text-muted-foreground text-sm">Create an account or sign in to place your order.</p>
        <Link to="/auth" className="inline-block bg-accent text-accent-foreground px-8 py-3 rounded-lg text-sm font-medium">
          Sign in
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="py-20 text-center container mx-auto px-6">
        <p className="text-muted-foreground">Your cart is empty.</p>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPhoneError(null);
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);
    const phone = String(fd.get("phone") || "").trim();
    if (!isValidUKPhone(phone)) {
      setPhoneError("Please enter a valid UK phone number (e.g. 07123 456789 or +44 7123 456789).");
      setSubmitting(false);
      return;
    }

    const shipping = {
      full_name: String(fd.get("full_name") || ""),
      email: String(fd.get("email") || ""),
      phone,
      address_line1: String(fd.get("address_line1") || ""),
      address_line2: String(fd.get("address_line2") || "") || null,
      city: String(fd.get("city") || ""),
      postcode: String(fd.get("postcode") || ""),
    };

    const cartItems = items.map((i) => ({
      id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    }));

    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: { items: cartItems, shipping },
    });

    if (error || !data?.url) {
      console.error(error);
      toast.error("Couldn't start payment. Please try again.");
      setSubmitting(false);
      return;
    }

    // Redirect to Stripe-hosted payment page
    window.location.href = data.url;
  };

  return (
    <main className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-12">
          <h1 className="font-heading text-4xl font-light text-foreground">Checkout</h1>
          {cancelled && (
            <p className="mt-3 text-sm text-[hsl(var(--accent))]">
              Payment was cancelled. Your cart has been cleared — feel free to browse and start again.
            </p>
          )}
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <FadeIn className="space-y-6">
            <h2 className="font-heading text-xl text-foreground">Delivery Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="full_name" type="text" placeholder="Full name" required maxLength={100} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input name="email" type="email" defaultValue={user.email ?? ""} placeholder="Email address" required maxLength={255} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <div>
                <input
                  name="phone"
                  type="tel"
                  placeholder="UK phone number (e.g. 07123 456789)"
                  required
                  maxLength={20}
                  autoComplete="tel"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {phoneError && (
                  <p className="mt-1.5 text-xs text-destructive">{phoneError}</p>
                )}
              </div>
              <input name="address_line1" type="text" placeholder="Address line 1" required maxLength={200} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input name="address_line2" type="text" placeholder="Address line 2" maxLength={200} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" type="text" placeholder="City" required maxLength={100} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input name="postcode" type="text" placeholder="Postcode" required maxLength={10} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <button type="submit" disabled={submitting} className="w-full bg-accent text-accent-foreground py-3.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mt-4">
                {submitting ? "Redirecting to secure payment…" : `Pay £${subtotal.toFixed(2)}`}
              </button>
              <p className="text-xs text-muted-foreground text-center">
                You'll be redirected to a secure payment page to complete your order.
              </p>
            </form>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h2 className="font-heading text-xl text-foreground mb-6">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img src={item.product.image} alt={item.product.name} width={64} height={80} loading="lazy" decoding="async" className="w-16 h-20 rounded-lg object-cover bg-muted" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm text-foreground">£{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t border-border pt-4 flex justify-between font-medium text-foreground">
                <span>Total</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
