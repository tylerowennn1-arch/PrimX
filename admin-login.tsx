import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { auth } from "@/lib/auth";
import { AuthShell, Field } from "./login";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin-login")({
  head: () => ({ meta: [{ title: "Admin Login — PrimXCapital" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const r = auth.login(email, password);
    if (!r.ok) return setErr(r.error || "Login failed");
    const u = auth.current();
    if (u?.role !== "admin") {
      auth.logout();
      return setErr("This portal is restricted to authorized administrators.");
    }
    nav({ to: "/admin" });
  };

  return (
    <AuthShell title="Admin portal" subtitle="Secure management access for authorized operators.">
      <form onSubmit={submit} className="space-y-4">
        <div className="gold-border rounded-2xl p-4 flex items-center gap-3 text-sm">
          <ShieldCheck className="w-5 h-5 text-[var(--gold)]" />
          <span className="text-muted-foreground">Role validation is enforced before entering the management panel.</span>
        </div>
        <Field label="Admin Email">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="admin@company.com" />
        </Field>
        <Field label="Admin Password">
          <div className="relative">
            <input type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input pr-10" placeholder="••••••••" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button className="w-full py-3 rounded-xl gradient-gold text-[var(--primary-foreground)] font-semibold" style={{ boxShadow: "var(--shadow-gold)" }}>Enter Admin Panel</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Not an administrator? <Link to="/login" className="text-[var(--gold)] font-medium">Return to sign in</Link>
      </p>
    </AuthShell>
  );
}