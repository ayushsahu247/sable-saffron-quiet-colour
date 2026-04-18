import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import FadeIn from "@/components/FadeIn";

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  if (items.length === 0 && !submitted) {
    return (
      <main className="py-20 text-center container mx-auto px-6">
        <p className="text-muted-foreground">Your cart is empty.</p>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="py-20 text-center container mx-auto px-6 space-y-4">
        <h1 className="font-heading text-3xl text-foreground">Thank you!</h1>
        <p className="text-muted-foreground text-sm">Your order has been placed. We'll be in touch soon.</p>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      user_id: user.id,
      full_name: String(fd.get("full_name") || ""),
      email: String(fd.get("email") || ""),
      address_line1: String(fd.get("address_line1") || ""),
      address_line2: String(fd.get("address_line2") || "") || null,
      city: String(fd.get("city") || ""),
      postcode: String(fd.get("postcode") || ""),
      items: items.map((i) => ({
        id: i.product.id,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
      subtotal,
    };

    const orderId = crypto.randomUUID();
    const { error } = await supabase.from("orders").insert({ ...payload, id: orderId });
    if (error) {
      setSubmitting(false);
      toast.error("Couldn't place your order. Please try again.");
      return;
    }

    // Fire-and-forget order confirmation email — don't block the user if email is slow.
    // Customize the template at: supabase/functions/_shared/transactional-email-templates/order-confirmation.tsx
    supabase.functions
      .invoke("send-transactional-email", {
        body: {
          templateName: "order-confirmation",
          recipientEmail: payload.email,
          idempotencyKey: `order-confirm-${orderId}`,
          templateData: {
            customerName: payload.full_name,
            orderId,
            items: payload.items.map((i) => ({
              name: i.name,
              quantity: i.quantity,
              price: i.price,
            })),
            subtotal: payload.subtotal,
            shippingAddress: {
              line1: payload.address_line1,
              line2: payload.address_line2 ?? undefined,
              city: payload.city,
              postcode: payload.postcode,
            },
          },
        },
      })
      .catch((err) => console.error("Order confirmation email failed", err));

    setSubmitting(false);
    await clearCart();
    setSubmitted(true);
  };

  return (
    <main className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-12">
          <h1 className="font-heading text-4xl font-light text-foreground">Checkout</h1>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <FadeIn className="space-y-6">
            <h2 className="font-heading text-xl text-foreground">Delivery Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="full_name" type="text" placeholder="Full name" required maxLength={100} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input name="email" type="email" defaultValue={user.email ?? ""} placeholder="Email address" required maxLength={255} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input name="address_line1" type="text" placeholder="Address line 1" required maxLength={200} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input name="address_line2" type="text" placeholder="Address line 2" maxLength={200} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" type="text" placeholder="City" required maxLength={100} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input name="postcode" type="text" placeholder="Postcode" required maxLength={10} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div className="pt-4 border-t border-border">
                <h2 className="font-heading text-xl text-foreground mb-4">Payment</h2>
                <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground text-center">
                  Stripe payment integration coming soon. Orders are currently processed manually.
                </div>
              </div>

              <button type="submit" disabled={submitting} className="w-full bg-accent text-accent-foreground py-3.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mt-4">
                {submitting ? "Placing order…" : "Place Order"}
              </button>
            </form>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h2 className="font-heading text-xl text-foreground mb-6">Order Summary</h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-20 rounded-lg object-cover" />
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
