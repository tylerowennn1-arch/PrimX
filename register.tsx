import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { auth } from "@/lib/auth";
import { AuthShell, Field } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account — PrimXCapital" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [investmentGoal, setInvestmentGoal] = useState("Cryptocurrency portfolio growth");
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (password.length < 6) return setErr("Password must be at least 6 characters");
    if (password !== confirm) return setErr("Passwords do not match");
    const r = auth.register({ fullName, email, password, investmentGoal });
    if (!r.ok) return setErr(r.error || "Registration failed");
    nav({ to: "/verify-email" });
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start managing your digital assets in minutes."
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full Name">
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="auth-input"
            placeholder="John Doe"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            placeholder="you@example.com"
          />
        </Field>
        <Field label="Investment Objective">
          <select
            value={investmentGoal}
            onChange={(e) => setInvestmentGoal(e.target.value)}
            className="auth-input"
          >
            <option>Cryptocurrency portfolio growth</option>
            <option>Forex and global market exposure</option>
            <option>Retirement wealth planning</option>
            <option>Short-term managed trading</option>
            <option>Long-term capital preservation</option>
          </select>
        </Field>
        <Field label="Password">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            placeholder="At least 6 characters"
          />
        </Field>
        <Field label="Confirm Password">
          <input
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="auth-input"
            placeholder="Re-enter password"
          />
        </Field>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button
          className="w-full py-3 rounded-xl gradient-gold text-[var(--primary-foreground)] font-semibold"
          style={{ boxShadow: "var(--shadow-gold)" }}
        >
          Create Account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-[var(--gold)] font-medium">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
