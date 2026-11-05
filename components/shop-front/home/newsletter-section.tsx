"use client";

import { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    // Simulating subscription
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success("Welcome to the KOA Tribe. Check your inbox for your 10% code.");
    }, 600);
  };

  return (
    <section className="w-full border-t border-border bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-card to-muted/40 p-8 md:p-14 text-center">
          <div className="mx-auto max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-1 text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
              <Mail className="size-3.5 text-primary" />
              VIP Access · Drop Roster
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Never Miss A Drop.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Our small-batch releases sell out quickly. Join the VIP roster for 24-hour early access to new releases, private archive sales, and 10% off your first order.
            </p>

            {isSubmitted ? (
              <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-5 shrink-0" />
                <span>You&apos;re on the roster. Check your email for your 10% code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
                  className="flex-1 rounded-full border border-border bg-background px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-background hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Joining..." : "Get Access"}
                </button>
              </form>
            )}

            <p className="mt-4 text-[11px] text-muted-foreground">
              By subscribing, you agree to our Privacy Policy. Zero spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
