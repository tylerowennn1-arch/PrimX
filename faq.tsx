import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ChevronDown } from "lucide-react";

const items = [
  { q: "How do I create an account?", a: "Click 'Get Started', enter your name, email and password, and verify your email. The whole process takes under two minutes." },
  { q: "How do I fund my account?", a: "From your dashboard, open the Deposit page and choose BTC, ETH or USDT. Send funds to the displayed wallet and submit your transaction reference." },
  { q: "How long does processing take?", a: "Most deposits confirm within 10–30 minutes. Withdrawals are typically processed within 1 business day." },
  { q: "Is the platform secure?", a: "Yes. Cold-storage custody, multi-signature wallets, 256-bit encryption and annual independent security audits." },
  { q: "How do I contact support?", a: "Use the in-app chat, email support@primxcapital.com, or call our 24/7 hotline listed in your dashboard." },
];

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — PrimXCapital" }] }),
  component: FaqPage,
});

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      <SiteHeader />
      <section className="max-w-3xl mx-auto px-5 md:px-8 py-20">
        <div className="text-center">
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">Support</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">Frequently asked questions</h1>
        </div>
        <div className="mt-10 space-y-3">
          {items.map((it, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between text-left p-5 hover:bg-[var(--gold)]/5">
                <span className="font-semibold">{it.q}</span>
                <ChevronDown className={`w-5 h-5 text-[var(--gold)] transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{it.a}</div>}
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
