import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import FadeIn from "@/components/FadeIn";

const CheckoutSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"verifying" | "paid" | "failed">("verifying");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }
    (async () => {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: { session_id: sessionId },
      });
      if (error || !data?.paid) {
        setStatus("failed");
        return;
      }
      setOrderId(data.orderId);
      setStatus("paid");
      await clearCart();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <main className="py-20 container mx-auto px-6 max-w-xl text-center">
      <FadeIn className="space-y-4">
        {status === "verifying" && (
          <>
            <h1 className="font-heading text-3xl text-foreground">Confirming your payment…</h1>
            <p className="text-sm text-muted-foreground">Just a moment.</p>
          </>
        )}
        {status === "paid" && (
          <>
            <h1 className="font-heading text-4xl text-foreground">Thank you!</h1>
            <p className="text-muted-foreground">
              Your payment was successful. We've sent a confirmation email
              {orderId ? ` with reference #${orderId.slice(0, 8).toUpperCase()}` : ""}.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-4 bg-accent text-accent-foreground px-8 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Continue shopping
            </button>
          </>
        )}
        {status === "failed" && (
          <>
            <h1 className="font-heading text-3xl text-foreground">We couldn't confirm your payment</h1>
            <p className="text-sm text-muted-foreground">
              If you were charged, please contact us and we'll sort it out.
            </p>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-4 bg-accent text-accent-foreground px-8 py-3 rounded-lg text-sm font-medium"
            >
              Back to checkout
            </button>
          </>
        )}
      </FadeIn>
    </main>
  );
};

export default CheckoutSuccess;
