import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Star, Check } from "lucide-react";

const T = [
  { name: "Starters Plan", range: "$200 – $1,999", duration: "48 hours", profit: "20% Profit", perks: ["20% profit in 48 hours", "Basic dashboard access", "Email support"] },
  { name: "Basic Plan", range: "$2,000 – $5,000", duration: "48 hours", profit: "40% Profit", perks: ["40% profit in 48 hours", "Advanced charts", "Priority email support"] },
  { name: "Standard Plan", range: "$5,000 – $10,000", duration: "48 hours", profit: "60% Profit", perks: ["60% profit in 48 hours", "Real-time analytics", "Live chat support"], highlight: true },
  { name: "Premium Plan", range: "$10,000 – $1,000,000", duration: "48 hours", profit: "80% Profit", perks: ["80% profit in 48 hours", "Dedicated account manager", "24/7 priority support"] },
];

export const Route = createFileRoute("/tiers")({
  head: () => ({ meta: [{ title: "Account Tiers — PrimXCapital" }] }),
  component: () => (
    <div>
      <SiteHeader />
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">Investment Tiers</div>
          <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">Pick your tier</h1>
          <p className="mt-4 text-muted-foreground">From first-time investors to high-net-worth clients, there's a tier built for you.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">
          {T.map((t) => (
            <div key={t.name} className={`relative rounded-2xl p-6 ${t.highlight ? "gold-border" : "glass"} hover:-translate-y-2 transition-all`}>
              {t.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest gradient-gold text-[var(--primary-foreground)] px-3 py-1 rounded-full font-semibold">Popular</div>}
              <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4"><Star className="w-5 h-5 text-[var(--primary-foreground)]" /></div>
              <h3 className="text-xl font-bold">{t.name}</h3>
              <div className="mt-3 text-2xl font-bold gradient-text">{t.range}</div>
              <div className="text-xs text-[var(--gold)] mt-1 font-semibold uppercase tracking-widest">{t.profit}</div>
              <div className="text-xs text-muted-foreground mt-1">Term: {t.duration}</div>
              <ul className="mt-5 space-y-2.5">
                {t.perks.map((p) => <li key={p} className="flex items-start gap-2 text-sm"><Check className="w-4 h-4 text-[var(--gold)] mt-0.5 shrink-0" /> {p}</li>)}
              </ul>
              <Link to="/register" className="mt-6 block text-center py-2.5 rounded-lg border border-[var(--gold)]/40 text-sm font-medium hover:bg-[var(--gold)]/10">Get Started</Link>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  ),
});
