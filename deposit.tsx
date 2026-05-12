import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { auth, data } from "@/lib/auth";
import { notify } from "@/lib/notifications";
import { Bitcoin, Coins, Copy, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/deposit")({
  head: () => ({ meta: [{ title: "Deposit — PrimXCapital" }] }),
  component: () => <AppShell><DepositPage /></AppShell>,
});

const WALLETS = [
  { id: "btc", name: "Bitcoin (BTC)", icon: Bitcoin, address: "18AgkNKBj6UdMGv4wPBQk1jPu3BTor7M9N", network: "Bitcoin Network" },
  { id: "eth", name: "Ethereum / USDT", icon: Coins, address: "0x08c9e7a836f371c31d2523445bf7efe8b0cdf39e", network: "ERC-20 Network" },
];

function DepositPage() {
  const [method, setMethod] = useState(WALLETS[0].id);
  const [amount, setAmount] = useState(""); const [ref, setRef] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const wallet = WALLETS.find((w) => w.id === method)!;

  const copy = (a: string) => {
    navigator.clipboard.writeText(a); setCopied(a);
    toast.success("Wallet address copied");
    setTimeout(() => setCopied(null), 2000);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const u = auth.current(); if (!u) return;
    const amt = parseFloat(amount);
    if (!amt || amt < 1) return toast.error("Enter a valid amount");
    if (!ref.trim()) return toast.error("Transaction reference required");
    data.addTx({ userEmail: u.email, type: "deposit", amount: amt, method: wallet.name, reference: ref.trim() });
    notify(u.email, "deposit_submitted", "Deposit received — under review",
      `Hi ${u.fullName}, we have received your deposit request of $${amt.toLocaleString()} via ${wallet.name}. It is now pending verification.`);
    toast.success("Deposit submitted for review");
    setAmount(""); setRef("");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">New Deposit</h1>
        <p className="text-sm text-muted-foreground mt-1">Fund your account using crypto. Submit your transaction reference for verification.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">Choose payment method</h3>
          <div className="grid grid-cols-2 gap-3">
            {WALLETS.map((w) => (
              <button key={w.id} onClick={() => setMethod(w.id)}
                className={`p-4 rounded-xl border text-left transition-all ${method === w.id ? "border-[var(--gold)] bg-[var(--gold)]/10" : "border-border hover:border-[var(--gold)]/40"}`}>
                <w.icon className="w-6 h-6 text-[var(--gold)] mb-2" />
                <div className="font-medium text-sm">{w.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{w.network}</div>
              </button>
            ))}
          </div>
          <div className="pt-2">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Wallet address</div>
            <div className="glass rounded-xl p-3 flex items-center gap-2">
              <code className="text-xs flex-1 break-all font-mono text-[var(--gold)]">{wallet.address}</code>
              <button onClick={() => copy(wallet.address)} className="shrink-0 p-2 rounded-lg gradient-gold text-[var(--primary-foreground)]">
                {copied === wallet.address ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Only send {wallet.name} to this address on the {wallet.network}.</p>
          </div>
        </div>

        <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold">Deposit details</h3>
          <label className="block">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Amount (USD)</div>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" min="1" step="any" placeholder="200" className="w-full bg-input border border-border rounded-xl px-3.5 py-3 outline-none focus:border-[var(--gold)]" />
          </label>
          <label className="block">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Transaction reference / hash</div>
            <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder="0x..." className="w-full bg-input border border-border rounded-xl px-3.5 py-3 outline-none focus:border-[var(--gold)] font-mono text-sm" />
          </label>
          <div className="text-xs text-muted-foreground">Your deposit will appear as <span className="text-[var(--warning)]">Pending</span> until confirmed by our team.</div>
          <button className="w-full py-3 rounded-xl gradient-gold text-[var(--primary-foreground)] font-semibold" style={{ boxShadow: "var(--shadow-gold)" }}>
            Submit Deposit
          </button>
        </form>
      </div>
    </div>
  );
}
