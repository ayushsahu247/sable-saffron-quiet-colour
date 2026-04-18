import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import FadeIn from "@/components/FadeIn";

type Status = "loading" | "valid" | "already" | "invalid" | "success" | "error";

const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    fetch(
      `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
      { headers: { apikey: supabaseAnonKey } },
    )
      .then((r) => r.json())
      .then((data) => {
        if (data?.valid === true) setStatus("valid");
        else if (data?.reason === "already_unsubscribed") setStatus("already");
        else setStatus("invalid");
      })
      .catch(() => setStatus("error"));
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke(
      "handle-email-unsubscribe",
      { body: { token } },
    );
    setSubmitting(false);
    if (error) {
      setStatus("error");
      return;
    }
    if (data?.success || data?.reason === "already_unsubscribed") {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  return (
    <main className="py-20 min-h-[60vh]">
      <div className="container mx-auto px-6 max-w-md text-center">
        <FadeIn className="space-y-6">
          <h1 className="font-heading text-3xl font-light text-foreground">
            Email preferences
          </h1>

          {status === "loading" && (
            <p className="text-muted-foreground text-sm">Checking your link…</p>
          )}

          {status === "valid" && (
            <>
              <p className="text-muted-foreground text-sm">
                Click below to unsubscribe from Sable & Saffron emails.
              </p>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="w-full bg-accent text-accent-foreground py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? "Updating…" : "Confirm unsubscribe"}
              </button>
            </>
          )}

          {status === "already" && (
            <p className="text-muted-foreground text-sm">
              You're already unsubscribed. No further emails will be sent.
            </p>
          )}

          {status === "success" && (
            <p className="text-muted-foreground text-sm">
              You've been unsubscribed. We're sorry to see you go.
            </p>
          )}

          {status === "invalid" && (
            <p className="text-muted-foreground text-sm">
              This link is invalid or has expired.
            </p>
          )}

          {status === "error" && (
            <p className="text-muted-foreground text-sm">
              Something went wrong. Please try again later.
            </p>
          )}
        </FadeIn>
      </div>
    </main>
  );
};

export default Unsubscribe;
