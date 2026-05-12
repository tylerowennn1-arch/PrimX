import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { auth } from "@/lib/auth";
import { AuthShell, Field } from "./login";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset Password — PrimXCapital" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const request = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const r = auth.requestPasswordReset(email);
    if (!r.ok) return setErr(r.error || "Unable to send reset code");
    setSentCode(r.code || "");
    toast.success("Password reset code sent");
  };

  const reset = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const r = auth.resetPassword(email, resetCode, password);
    if (!r.ok) return setErr(r.error || "Password reset failed");
    toast.success("Password updated. You can sign in now.");
    setResetCode(""); setPassword(""); setSentCode("");
  };

  return (
    <AuthShell title="Reset password" subtitle="Request a secure code and create a new password.">
      <div className="space-y-5">
        <form onSubmit={request} className="space-y-4">
          <Field label="Account email">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="you@example.com" />
          </Field>
          <button className="w-full py-3 rounded-xl gradient-gold text-[var(--primary-foreground)] font-semibold" style={{ boxShadow: "var(--shadow-gold)" }}>Send Reset Code</button>
        </form>
        {sentCode && (
          <div className="gold-border rounded-2xl p-4 flex gap-3 text-sm">
            <KeyRound className="w-5 h-5 text-[var(--gold)] shrink-0" />
            <div className="text-muted-foreground">Reset code: <span className="text-[var(--gold)] font-semibold tracking-widest">{sentCode}</span></div>
          </div>
        )}
        <form onSubmit={reset} className="space-y-4 pt-4 border-t border-[var(--gold)]/10">
          <Field label="Reset code">
            <input required value={resetCode} onChange={(e) => setResetCode(e.target.value)} className="auth-input tracking-[0.3em] text-center" placeholder="000000" maxLength={6} />
          </Field>
          <Field label="New password">
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input" placeholder="At least 6 characters" />
          </Field>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <button className="w-full py-3 rounded-xl border border-[var(--gold)]/30 text-sm hover:bg-[var(--gold)]/10 transition-colors">Update Password</button>
        </form>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground"><Link to="/login" className="text-[var(--gold)] font-medium">Back to sign in</Link></p>
    </AuthShell>
  );
}