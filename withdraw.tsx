import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { auth, data } from "@/lib/auth";
import { notify } from "@/lib/notifications";
import { toast } from "sonner";

export const Route = createFileRoute("/withdraw")({
  head: () => ({ meta: [{ title: "Withdraw — PrimXCapital" }] }),
  component: () => (
    <AppShell>
      <WithdrawPage />
    </AppShell>
  ),
});

function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [method, setMethod] = useState("BTC");
  const u = auth.current();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!u) return;
    if (u.accountStatus === "suspended")
      return toast.error("Your account is currently suspended. Contact support.");
    if (u.withdrawalFee + u.taxCharge > 0)
      return toast.error("Outstanding admin charges must be cleared before withdrawal");
    const amt = parseFloat(amount);
    if (!amt || amt < 10) return toast.error("Minimum withdrawal is $10");
    if (amt > u.balance) return toast.error("Insufficient balance");
    if (!wallet.trim()) return toast.error("Wallet address required");
    data.addTx({
      userEmail: u.email,
      type: "withdrawal",
      amount: amt,
      method,
      reference: wallet.trim(),
    });
    notify(
      u.email,
      "withdrawal_submitted",
      "Withdrawal request received",
      `Hi ${u.fullName}, your withdrawal of $${amt.toLocaleString()} via ${method} to ${wallet.trim()} is pending admin approval.`,
    );
    toast.success("Withdrawal request submitted");
    setAmount("");
    setWallet("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Withdraw Funds</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Request a withdrawal to your external wallet.
        </p>
      </div>
      <div className="glass rounded-2xl p-5 flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">
          Available balance
        </div>
        <div className="text-2xl font-bold gradient-text">${u?.balance.toLocaleString() ?? 0}</div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Interest wallet
          </div>
          <div className="mt-2 text-xl font-bold">
            ${(u?.interestBalance ?? 0).toLocaleString()}
          </div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Total invest
          </div>
          <div className="mt-2 text-xl font-bold">${(u?.totalInvested ?? 0).toLocaleString()}</div>
        </div>
      </div>
      {u?.withdrawalFee || u?.taxCharge ? (
        <div className="gold-border rounded-2xl p-5">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Required admin charges
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Withdrawal fee:{" "}
            <span className="text-foreground font-medium">${u.withdrawalFee.toLocaleString()}</span>{" "}
            · Tax charge:{" "}
            <span className="text-foreground font-medium">${u.taxCharge.toLocaleString()}</span>
          </div>
          <p className="mt-2 text-xs text-[var(--warning)]">
            These charges are controlled by admin and must be cleared before withdrawal approval.
          </p>
        </div>
      ) : null}
      <form onSubmit={submit} className="glass rounded-2xl p-6 space-y-4">
        <label className="block">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
            Amount (USD)
          </div>
          <input
            type="number"
            min="10"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-input border border-border rounded-xl px-3.5 py-3 outline-none focus:border-[var(--gold)]"
            placeholder="100"
          />
        </label>
        <label className="block">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
            Method
          </div>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full bg-input border border-border rounded-xl px-3.5 py-3 outline-none focus:border-[var(--gold)]"
          >
            <option>BTC</option>
            <option>ETH</option>
            <option>USDT (ERC-20)</option>
            <option>USDT (TRC-20)</option>
          </select>
        </label>
        <label className="block">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
            Destination wallet address
          </div>
          <input
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            className="w-full bg-input border border-border rounded-xl px-3.5 py-3 outline-none focus:border-[var(--gold)] font-mono text-sm"
            placeholder="Your wallet address"
          />
        </label>
        <button
          className="w-full py-3 rounded-xl gradient-gold text-[var(--primary-foreground)] font-semibold"
          style={{ boxShadow: "var(--shadow-gold)" }}
        >
          Request Withdrawal
        </button>
      </form>
    </div>
  );
}
