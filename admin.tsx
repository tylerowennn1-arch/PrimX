import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { auth, data, type User } from "@/lib/auth";
import { notify } from "@/lib/notifications";
import { support } from "@/lib/support";
import { StatusBadge } from "./dashboard";
import {
  Users,
  ArrowDownToLine,
  Clock,
  Search,
  Check,
  X,
  Eye,
  Ban,
  CreditCard,
  UserCog,
  Trash2,
  MessageCircle,
  Send,
  BadgeDollarSign,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — PrimXCapital" }] }),
  component: () => (
    <AppShell admin>
      <Admin />
    </AppShell>
  ),
});

function Admin() {
  const [tick, setTick] = useState(0);
  const [tab, setTab] = useState<"all" | "deposit" | "withdrawal">("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    auth.init();
    const unsub = [data.subscribe(refresh), support.subscribe(refresh)];
    return () => unsub.forEach((f) => f());
  }, []);
  const refresh = () => setTick((t) => t + 1);
  void tick;

  const users = data.allUsers().filter((u) => u.role !== "admin");
  const txs = data
    .allTx()
    .filter((t) => tab === "all" || t.type === tab)
    .filter((t) => !q || t.userEmail.toLowerCase().includes(q.toLowerCase()));
  const pending = data.allTx().filter((t) => t.status === "pending").length;
  const totalDeposits = data
    .allTx()
    .filter((t) => t.type === "deposit" && t.status === "approved")
    .reduce((s, t) => s + t.amount, 0);
  const totalWithdrawals = data
    .allTx()
    .filter((t) => t.type === "withdrawal" && t.status === "approved")
    .reduce((s, t) => s + t.amount, 0);
  const totalCharges = users.reduce((s, u) => s + u.withdrawalFee + u.taxCharge, 0);
  const totalInterest = users.reduce((s, u) => s + (u.interestBalance ?? 0), 0);
  const searchedUsers = users.filter((u) => !q || u.email.toLowerCase().includes(q.toLowerCase()));

  const cards = [
    { label: "Total Users", val: users.length.toLocaleString(), icon: Users },
    { label: "Total Deposits", val: `$${totalDeposits.toLocaleString()}`, icon: ArrowDownToLine },
    { label: "Pending Requests", val: pending.toString(), icon: Clock },
    { label: "Total Withdrawals", val: `$${totalWithdrawals.toLocaleString()}`, icon: CreditCard },
    { label: "Client Charges", val: `$${totalCharges.toLocaleString()}`, icon: UserCog },
    { label: "Interest Wallets", val: `$${totalInterest.toLocaleString()}`, icon: BadgeDollarSign },
  ];

  const setStatus = (id: string, s: "approved" | "rejected") => {
    const tx = data.allTx().find((t) => t.id === id);
    data.setTxStatus(id, s);
    if (tx) {
      const subject = `${tx.type === "deposit" ? "Deposit" : "Withdrawal"} ${s}`;
      notify(
        tx.userEmail,
        `${tx.type}_${s}` as never,
        subject,
        `Your ${tx.type} of $${tx.amount.toLocaleString()} has been ${s} by our admin team.`,
      );
    }
    toast.success(`Transaction ${s}`);
    refresh();
  };

  const setCharge = (u: User, field: "withdrawalFee" | "taxCharge") => {
    const label = field === "withdrawalFee" ? "withdrawal fee" : "tax charge";
    const value = window.prompt(`Set ${label} for ${u.fullName}`, String(u[field]));
    if (value === null) return;
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount < 0) return toast.error("Enter a valid amount");
    data.updateUser(u.id, { [field]: amount });
    toast.success("Client charge updated");
    refresh();
  };

  const toggleStatus = (u: User) => {
    const next = u.accountStatus === "active" ? "suspended" : "active";
    data.updateUser(u.id, { accountStatus: next });
    notify(
      u.email,
      next === "suspended" ? "account_suspended" : "account_activated",
      `Account ${next}`,
      `Hi ${u.fullName}, your PrimXCapital account has been ${next} by our admin team.`,
    );
    toast.success(`Client ${next === "suspended" ? "suspended" : "activated"}`);
    refresh();
  };

  const userByEmail = (email: string) => users.find((u) => u.email === email);
  const viewUser = (email: string) => {
    const u = userByEmail(email);
    if (!u) return toast.error("User not found");
    toast.info(
      `${u.fullName} · ${u.email} · Balance $${u.balance.toLocaleString()} · ${u.accountStatus}`,
    );
  };
  const suspendByEmail = (email: string) => {
    const u = userByEmail(email);
    if (!u) return toast.error("User not found");
    data.updateUser(u.id, { accountStatus: "suspended" });
    toast.success("User suspended");
    refresh();
  };
  const adjustBalance = (u: User) => {
    const value = window.prompt(
      `Add or reduce balance for ${u.fullName}. Use negative numbers to reduce.`,
      "100",
    );
    if (value === null) return;
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount === 0)
      return toast.error("Enter a valid positive or negative amount");
    data.adjustBalance(u.id, amount);
    notify(
      u.email,
      amount > 0 ? "balance_credited" : "balance_debited",
      amount > 0 ? "Funds added to your account" : "Balance adjustment",
      `An admin has ${amount > 0 ? "credited" : "debited"} $${Math.abs(amount).toLocaleString()} ${amount > 0 ? "to" : "from"} your PrimXCapital account.`,
    );
    toast.success(amount > 0 ? "Balance increased" : "Balance reduced");
    refresh();
  };
  const adjustInterest = (u: User) => {
    const value = window.prompt(
      `Increase or reduce interest wallet for ${u.fullName}. Use negative numbers to reduce.`,
      "25",
    );
    if (value === null) return;
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount === 0)
      return toast.error("Enter a valid positive or negative amount");
    data.adjustInterest(u.id, amount);
    notify(
      u.email,
      amount > 0 ? "balance_credited" : "balance_debited",
      amount > 0 ? "Interest credited" : "Interest adjusted",
      `An admin has ${amount > 0 ? "credited" : "debited"} $${Math.abs(amount).toLocaleString()} ${amount > 0 ? "to" : "from"} your interest wallet.`,
    );
    toast.success(amount > 0 ? "Interest increased" : "Interest reduced");
    refresh();
  };
  const deleteTransaction = (id: string) => {
    data.deleteTx(id);
    toast.success("Transaction deleted");
    refresh();
  };
  const deleteUser = (u: User) => {
    data.deleteUser(u.id);
    toast.success("User deleted");
    refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Admin Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Approve or reject pending transactions and manage users.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((c, i) => (
          <div key={c.label} className={`rounded-2xl p-5 ${i === 0 ? "gold-border" : "glass"}`}>
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

      <div className="glass rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex gap-2">
            {(["all", "deposit", "withdrawal"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-widest transition-colors ${tab === t ? "gradient-gold text-[var(--primary-foreground)]" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by email"
              className="bg-input border border-border rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="py-3 font-medium">User Email</th>
                <th className="py-3 font-medium">Deposit Amount</th>
                <th className="py-3 font-medium">Withdrawal Amount</th>
                <th className="py-3 font-medium">Transaction ID</th>
                <th className="py-3 font-medium">Date</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {txs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    No transactions yet.
                  </td>
                </tr>
              ) : (
                txs.map((t) => (
                  <tr key={t.id} className="border-b border-border/50">
                    <td className="py-3">{t.userEmail}</td>
                    <td className="py-3 font-medium">
                      {t.type === "deposit" ? `$${t.amount.toLocaleString()}` : "—"}
                    </td>
                    <td className="py-3 font-medium">
                      {t.type === "withdrawal" ? `$${t.amount.toLocaleString()}` : "—"}
                    </td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">
                      {t.id.slice(0, 16)}…
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <StatusBadge s={t.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <IconBtn title="View User" onClick={() => viewUser(t.userEmail)}>
                          <Eye className="w-3.5 h-3.5" />
                        </IconBtn>
                        {t.status === "pending" && (
                          <>
                            <IconBtn
                              title="Approve"
                              tone="success"
                              onClick={() => setStatus(t.id, "approved")}
                            >
                              <Check className="w-3.5 h-3.5" />
                            </IconBtn>
                            <IconBtn
                              title="Reject"
                              tone="danger"
                              onClick={() => setStatus(t.id, "rejected")}
                            >
                              <X className="w-3.5 h-3.5" />
                            </IconBtn>
                          </>
                        )}
                        <IconBtn
                          title="Suspend"
                          tone="danger"
                          onClick={() => suspendByEmail(t.userEmail)}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </IconBtn>
                        <IconBtn
                          title="Delete"
                          tone="danger"
                          onClick={() => deleteTransaction(t.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-semibold mb-4">Client Accounts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                <th className="py-3 font-medium">Name</th>
                <th className="py-3 font-medium">Email</th>
                <th className="py-3 font-medium">Tier</th>
                <th className="py-3 font-medium">Balance</th>
                <th className="py-3 font-medium">Interest</th>
                <th className="py-3 font-medium">Total Invest</th>
                <th className="py-3 font-medium">Investing For</th>
                <th className="py-3 font-medium">Charges</th>
                <th className="py-3 font-medium">Status</th>
                <th className="py-3 font-medium text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchedUsers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-muted-foreground">
                    No clients yet.
                  </td>
                </tr>
              ) : (
                searchedUsers.map((u) => (
                  <tr key={u.id} className="border-b border-border/50">
                    <td className="py-3">{u.fullName}</td>
                    <td className="py-3 text-muted-foreground">{u.email}</td>
                    <td className="py-3">
                      <span className="text-xs px-2 py-1 rounded-full glass">{u.tier}</span>
                    </td>
                    <td className="py-3 font-medium">${u.balance.toLocaleString()}</td>
                    <td className="py-3 font-medium text-[var(--gold)]">
                      ${(u.interestBalance ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 font-medium">${(u.totalInvested ?? 0).toLocaleString()}</td>
                    <td
                      className="py-3 text-muted-foreground max-w-[180px] truncate"
                      title={u.investmentGoal}
                    >
                      {u.investmentGoal || "Cryptocurrency portfolio growth"}
                    </td>
                    <td className="py-3 text-muted-foreground">
                      Fee ${u.withdrawalFee.toLocaleString()} · Tax ${u.taxCharge.toLocaleString()}
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${u.accountStatus === "active" ? "bg-[var(--success)]/15 text-[var(--success)] border-[var(--success)]/30" : "bg-destructive/15 text-destructive border-destructive/30"}`}
                      >
                        {u.accountStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <IconBtn title="View User" onClick={() => viewUser(u.email)}>
                          <Eye className="w-3.5 h-3.5" />
                        </IconBtn>
                        <IconBtn
                          title="Increase or reduce balance"
                          onClick={() => adjustBalance(u)}
                        >
                          <WalletCards className="w-3.5 h-3.5" />
                        </IconBtn>
                        <IconBtn
                          title="Increase or reduce interest wallet"
                          onClick={() => adjustInterest(u)}
                        >
                          <BadgeDollarSign className="w-3.5 h-3.5" />
                        </IconBtn>
                        <IconBtn
                          title="Set withdrawal fee"
                          onClick={() => setCharge(u, "withdrawalFee")}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </IconBtn>
                        <IconBtn title="Set tax charge" onClick={() => setCharge(u, "taxCharge")}>
                          <UserCog className="w-3.5 h-3.5" />
                        </IconBtn>
                        <IconBtn
                          title={
                            u.accountStatus === "active" ? "Suspend client" : "Activate client"
                          }
                          tone={u.accountStatus === "active" ? "danger" : "success"}
                          onClick={() => toggleStatus(u)}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </IconBtn>
                        <IconBtn title="Delete user" tone="danger" onClick={() => deleteUser(u)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <SupportInbox />
    </div>
  );
}

function SupportInbox() {
  const [tick, setTick] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  useEffect(() => support.subscribe(() => setTick((t) => t + 1)), []);
  void tick;
  const threads = support.threads();
  const current = active ? support.thread(active) : null;
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!current || !reply.trim()) return;
    support.sendFromAdmin(current.id, reply.trim());
    setReply("");
  };
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[var(--gold)]" /> Support Inbox
        </h3>
        <span className="text-xs text-muted-foreground">
          {threads.length} {threads.length === 1 ? "thread" : "threads"}
        </span>
      </div>
      <div className="grid md:grid-cols-[260px_1fr] gap-4">
        <div className="border border-border rounded-xl overflow-hidden divide-y divide-border max-h-[400px] overflow-y-auto">
          {threads.length === 0 && (
            <div className="p-4 text-xs text-muted-foreground">No conversations yet.</div>
          )}
          {threads.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActive(t.id);
                support.markReadByAdmin(t.id);
              }}
              className={`w-full text-left p-3 hover:bg-[var(--gold)]/5 transition-colors ${active === t.id ? "bg-[var(--gold)]/10" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium truncate">{t.name || "Guest"}</div>
                {t.unreadByAdmin > 0 && (
                  <span className="text-[10px] px-1.5 rounded-full bg-destructive text-white font-bold">
                    {t.unreadByAdmin}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">{t.email || t.id}</div>
              <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                {t.messages[t.messages.length - 1]?.text ?? "No messages yet"}
              </div>
            </button>
          ))}
        </div>
        <div className="border border-border rounded-xl flex flex-col min-h-[320px]">
          {!current ? (
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground p-8">
              Select a conversation to reply
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-border">
                <div className="text-sm font-medium">{current.name || "Guest"}</div>
                <div className="text-[11px] text-muted-foreground">{current.email}</div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[300px]">
                {current.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.from === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-1.5 rounded-2xl text-sm ${m.from === "admin" ? "gradient-gold text-[var(--primary-foreground)] rounded-br-sm" : "bg-[oklch(0.24_0.014_60)] border border-[var(--gold)]/10 rounded-bl-sm"}`}
                    >
                      <div>{m.text}</div>
                      <div
                        className={`text-[10px] mt-0.5 ${m.from === "admin" ? "text-[var(--primary-foreground)]/70" : "text-muted-foreground"}`}
                      >
                        {m.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={send} className="p-2 border-t border-border flex gap-2">
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply…"
                  className="flex-1 bg-input border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--gold)]"
                />
                <button
                  type="submit"
                  disabled={!reply.trim()}
                  className="px-3 rounded-lg gradient-gold text-[var(--primary-foreground)] disabled:opacity-50 flex items-center gap-1.5 text-sm font-medium"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  tone,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  tone?: "success" | "danger";
}) {
  const cls =
    tone === "success"
      ? "bg-[var(--success)]/15 text-[var(--success)] hover:bg-[var(--success)]/25"
      : tone === "danger"
        ? "bg-destructive/15 text-destructive hover:bg-destructive/25"
        : "glass hover:bg-[var(--gold)]/10";
  return (
    <button title={title} onClick={onClick} className={`p-1.5 rounded-md transition-colors ${cls}`}>
      {children}
    </button>
  );
}
