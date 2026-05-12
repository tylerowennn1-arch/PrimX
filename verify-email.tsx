import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";
import { AuthShell, Field } from "./login";
import { MailCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/verify-email")({
  head: () => ({ meta: [{ title: "Verify Email — PrimXCapital" }] }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const nav = useNavigate();
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const u = auth.current();
    if (!u) { nav({ to: "/login" }); return; }
    if (u.emailVerified) { nav({ to: "/dashboard" }); return; }
    setSentCode(u.emailVerificationCode || "");
  }, [nav]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const r = auth.verifyEmail(code);
    if (!r.ok) return setErr(r.error || "Verification failed");
    toast.success("Email verified");
    nav({ to: "/dashboard" });
  };

  const resend = () => {
    const next = auth.resendVerification();
    if (next) {
      setSentCode(next);
      toast.success("Verification code sent");
    }
  };

  return (
    <AuthShell title="Verify your email" subtitle="Enter the verification code sent to your inbox before entering the dashboard.">
      <form onSubmit={submit} className="space-y-4">
        <div className="gold-border rounded-2xl p-4 flex gap-3 text-sm">
          <MailCheck className="w-5 h-5 text-[var(--gold)] shrink-0" />
          <div className="text-muted-foreground">
            Verification email prepared. Code: <span className="text-[var(--gold)] font-semibold tracking-widest">{sentCode || "------"}</span>
          </div>
        </div>
        <Field label="Verification code">
          <input required value={code} onChange={(e) => setCode(e.target.value)} className="auth-input tracking-[0.3em] text-center" placeholder="000000" maxLength={6} />
        </Field>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button className="w-full py-3 rounded-xl gradient-gold text-[var(--primary-foreground)] font-semibold" style={{ boxShadow: "var(--shadow-gold)" }}>Verify Account</button>
        <button type="button" onClick={resend} className="w-full py-3 rounded-xl border border-[var(--gold)]/30 text-sm hover:bg-[var(--gold)]/10 transition-colors">Resend Code</button>
      </form>
    </AuthShell>
  );
}