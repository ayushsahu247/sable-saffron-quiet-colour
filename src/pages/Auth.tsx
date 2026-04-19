import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import FadeIn from "@/components/FadeIn";

const Auth = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate("/");
  }, [session, navigate]);

  // Live password requirement checks (signup only)
  const checks = useMemo(
    () => ({
      length: password.length >= 8,
      letter: /[A-Za-z]/.test(password),
      number: /\d/.test(password),
    }),
    [password],
  );
  const passwordValid = checks.length && checks.letter && checks.number;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !passwordValid) {
      toast.error("Please meet all password requirements.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        // Trigger welcome email server-side (fire-and-forget)
        if (data.user?.id) {
          supabase.functions
            .invoke("send-welcome-email", { body: { user_id: data.user.id } })
            .catch((err) => console.error("Welcome email failed", err));
        }
        toast.success("Welcome! You're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Sign-in failed. Please try again.");
      setBusy(false);
    }
  };

  const Requirement = ({ ok, label }: { ok: boolean; label: string }) => (
    <li className={`flex items-center gap-2 text-xs ${ok ? "text-[hsl(var(--accent))]" : "text-muted-foreground"}`}>
      <span aria-hidden className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold ${ok ? "bg-[hsl(var(--accent))] text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
        {ok ? "✓" : "•"}
      </span>
      <span>{label}</span>
    </li>
  );

  return (
    <main className="py-16 md:py-24">
      <div className="container mx-auto px-6 max-w-md">
        <FadeIn className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-heading text-4xl font-light text-foreground">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Save your wishlist and review history.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleOAuth("google")}
              disabled={busy}
              className="w-full bg-popover border border-border text-foreground py-3 rounded-lg text-sm font-medium hover:bg-secondary/40 transition-colors disabled:opacity-50"
            >
              Continue with Google
            </button>
            <button
              onClick={() => handleOAuth("apple")}
              disabled={busy}
              className="w-full bg-popover border border-border text-foreground py-3 rounded-lg text-sm font-medium hover:bg-secondary/40 transition-colors disabled:opacity-50"
            >
              Continue with Apple
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            <span>or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="space-y-2">
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-popover text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                aria-describedby={mode === "signup" ? "password-requirements" : undefined}
              />
              {mode === "signup" && (
                <ul id="password-requirements" className="space-y-1 pl-1" aria-live="polite">
                  <Requirement ok={checks.length} label="At least 8 characters" />
                  <Requirement ok={checks.letter} label="At least one letter" />
                  <Requirement ok={checks.number} label="At least one number" />
                </ul>
              )}
            </div>
            <button
              type="submit"
              disabled={busy || (mode === "signup" && !passwordValid)}
              className="w-full bg-accent text-accent-foreground py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-accent font-medium hover:underline"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </FadeIn>
      </div>
    </main>
  );
};

export default Auth;
