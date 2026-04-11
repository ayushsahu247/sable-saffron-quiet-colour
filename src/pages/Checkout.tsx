import { useState } from "react";
import { useCart } from "@/context/CartContext";
import FadeIn from "@/components/FadeIn";

const Checkout = () => {
  const { items, subtotal } = useCart();
  const [submitted, setSubmitted] = useState(false);

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

  return (
    <main className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <FadeIn className="text-center mb-12">
          <h1 className="font-heading text-4xl font-light text-foreground">Checkout</h1>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <FadeIn className="space-y-6">
            <h2 className="font-heading text-xl text-foreground">Delivery Details</h2>
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="space-y-4"
            >
              <input type="text" placeholder="Full name" required maxLength={100} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="email" placeholder="Email address" required maxLength={255} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="text" placeholder="Address line 1" required maxLength={200} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <input type="text" placeholder="Address line 2" maxLength={200} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" required maxLength={100} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <input type="text" placeholder="Postcode" required maxLength={10} className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div className="pt-4 border-t border-border">
                <h2 className="font-heading text-xl text-foreground mb-4">Payment</h2>
                <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground text-center">
                  Stripe payment integration coming soon. Orders are currently processed manually.
                </div>
              </div>

              <button type="submit" className="w-full bg-accent text-accent-foreground py-3.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity mt-4">
                Place Order
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
