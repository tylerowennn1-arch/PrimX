import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { auth, data, type Transaction } from "@/lib/auth";
import { StatusBadge } from "./dashboard";

export const Route = createFileRoute("/activity")({
  head: () => ({ meta: [{ title: "Activity — PrimXCapital" }] }),
  component: () => <AppShell><Activity /></AppShell>,
});

function Activity() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  useEffect(() => { const u = auth.current(); if (u) setTxs(data.txForUser(u.email)); }, []);
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Activity</h1>
        <p className="text-sm text-muted-foreground mt-1">Full history of your account transactions.</p>
      </div>
      <div className="glass rounded-2xl p-5">
        {txs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No activity yet. <Link to="/deposit" className="text-[var(--gold)]">Get started with a deposit</Link>.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                  <th className="py-3 font-medium">Type</th><th className="py-3 font-medium">Amount</th>
                  <th className="py-3 font-medium">Method</th><th className="py-3 font-medium">Reference</th>
                  <th className="py-3 font-medium">Date</th><th className="py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {txs.map((t) => (
                  <tr key={t.id} className="border-b border-border/50">
                    <td className="py-3 capitalize">{t.type}</td>
                    <td className="py-3 font-medium">${t.amount.toLocaleString()}</td>
                    <td className="py-3 text-muted-foreground">{t.method}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{t.reference.slice(0, 18)}…</td>
                    <td className="py-3 text-muted-foreground">{new Date(t.date).toLocaleString()}</td>
                    <td className="py-3"><StatusBadge s={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
