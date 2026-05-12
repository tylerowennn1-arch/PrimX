import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { auth, data, type User, type Transaction } from "@/lib/auth";
import {
  Wallet,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  Layers,
  BadgeDollarSign,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — PrimXCapital" }] }),
  component: () => (
    <AppShell>
      <Dash />
    </AppShell>
  ),
});

function Dash() {
  const [user, setUser] = useState<User | null>(null);
  const [txs, setTxs] = useState<Transaction[]>([]);
  useEffect(() => {
    const sync = () => {
      const u = auth.current();
      if (!u) return;
      setUser(u);
      setTxs(data.txForUser(u.email));
    };
    sync();
    return data.subscribe(sync);
  }, []);
  if (!user) return null;

  const cards = [
    {
      label: "Account Balance",
      val: `$${user.balance.toLocaleString()}`,
      icon: Wallet,
      accent: true,
    },
    {
      label: "Interest Wallet",
      val: `$${(user.interestBalance ?? 0).toLocaleString()}`,
      icon: BadgeDollarSign,
    },
    { label: "Total Invest", val: `$${(user.totalInvested ?? 0).toLocaleString()}`, icon: Target },
    { label: "Active Tier", val: user.tier, icon: Layers },
    {
      label: "Total Deposits",
      val: `$${user.totalDeposits.toLocaleString()}`,
      icon: ArrowDownToLine,
    },
    {
      label: "Total Withdrawals",
      val: `$${user.totalWithdrawals.toLocaleString()}`,
      icon: ArrowUpFromLine,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">An overview of your account activity.</p>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-6 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-2xl p-5 ${c.accent ? "gold-border" : "glass"} relative overflow-hidden`}
          >
            {c.accent && (
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30"
                style={{ background: "var(--gradient-gold)" }}
              />
            )}
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {c.label}
              </div>
              <c.icon className="w-4 h-4 text-[var(--gold)]" />
            </div>
            <div className="mt-3 text-2xl font-bold">{c.val}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Activity (last 30 days)</h3>
            <TrendingUp className="w-4 h-4 text-[var(--gold)]" />
          </div>
          <Sparkline txs={txs} />
        </div>
        <div className="glass rounded-2xl p-5">
          <h3 className="font-semibold mb-4">Quick actions</h3>
          <div className="space-y-2">
            <Link
              to="/deposit"
              className="block px-4 py-3 rounded-lg gradient-gold text-[var(--primary-foreground)] font-medium text-sm text-center"
            >
              New Deposit
            </Link>
            <Link
              to="/withdraw"
              className="block px-4 py-3 rounded-lg border border-[var(--gold)]/30 text-sm text-center hover:bg-[var(--gold)]/5"
            >
              Withdraw Funds
            </Link>
            <Link
              to="/settings"
              className="block px-4 py-3 rounded-lg border border-border text-sm text-center hover:bg-[var(--gold)]/5"
            >
              Account Settings
            </Link>
          </div>
        </div>
      </div>

      <div className="gold-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Investment Objective
          </div>
          <div className="mt-2 text-lg font-semibold">
            {user.investmentGoal || "Cryptocurrency portfolio growth"}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          New accounts include a $10 welcome bonus in account balance.
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Recent transactions</h3>
          <span className="text-xs text-muted-foreground">{txs.length} total</span>
        </div>
        {txs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            No transactions yet.{" "}
            <Link to="/deposit" className="text-[var(--gold)]">
              Make your first deposit
            </Link>
            .
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="py-3 font-medium">Type</th>
                  <th className="py-3 font-medium">Amount</th>
                  <th className="py-3 font-medium">Method</th>
                  <th className="py-3 font-medium">Reference</th>
                  <th className="py-3 font-medium">Date</th>
                  <th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {txs.slice(0, 10).map((t) => (
                  <tr key={t.id} className="border-b border-border/50">
                    <td className="py-3 capitalize">{t.type}</td>
                    <td className="py-3 font-medium">${t.amount.toLocaleString()}</td>
                    <td className="py-3 text-muted-foreground">{t.method}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">
                      {t.reference.slice(0, 12)}…
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <StatusBadge s={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <HistoryBlock title="Deposit history" txs={txs.filter((t) => t.type === "deposit")} />
        <HistoryBlock title="Withdrawal history" txs={txs.filter((t) => t.type === "withdrawal")} />
      </div>
    </div>
  );
}

export function StatusBadge({ s }: { s: "pending" | "approved" | "rejected" }) {
  const map = {
    pending: {
      c: "bg-[var(--warning)]/15 text-[var(--warning)] border-[var(--warning)]/30",
      l: "Pending",
    },
    approved: {
      c: "bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30",
      l: "Approved",
    },
    rejected: { c: "bg-destructive/15 text-destructive border-destructive/30", l: "Rejected" },
  } as const;
  return <span className={`text-xs px-2.5 py-1 rounded-full border ${map[s].c}`}>{map[s].l}</span>;
}

function Sparkline({ txs }: { txs: Transaction[] }) {
  const approved = txs
    .filter((t) => t.status === "approved")
    .slice(0, 16)
    .reverse();
  const pts = approved.length
    ? approved.map((t) => Math.max(12, Math.min(95, t.amount / 100)))
    : [18, 22, 20, 28, 24, 34, 30, 42, 38, 50, 46, 58, 54, 66, 62, 70];
  const w = 600,
    h = 180,
    max = 100;
  const step = pts.length > 1 ? w / (pts.length - 1) : w;
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (p / max) * h}`)
    .join(" ");
  const area = path + ` L ${w} ${h} L 0 ${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.16 85)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.82 0.16 85)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#g1)" />
      <path d={path} stroke="oklch(0.82 0.16 85)" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

function HistoryBlock({ title, txs }: { title: string; txs: Transaction[] }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xs text-muted-foreground">{txs.length} records</span>
      </div>
      <div className="space-y-3">
        {txs.slice(0, 5).map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between gap-3 border-b border-border/50 pb-3 text-sm"
          >
            <div className="min-w-0">
              <div className="font-medium truncate">
                ${t.amount.toLocaleString()} · {t.method}
              </div>
              <div className="text-xs text-muted-foreground font-mono truncate">{t.id}</div>
            </div>
            <StatusBadge s={t.status} />
          </div>
        ))}
        {txs.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">No records yet.</div>
        )}
      </div>
    </div>
  );
}
