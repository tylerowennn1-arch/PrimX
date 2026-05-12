import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { auth } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — PrimXCapital" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [show, setShow] = useState(false); const [err, setErr] = useState("");
  const [remember, setRemember] = useState(true);

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setErr("");
    const r = auth.login(email, password);
    if (!r.ok) return setErr(r.error || "Login failed");
    const u = auth.current();
    nav({ to: u?.role === "admin" ? "/admin" : u?.emailVerified ? "/dashboard" : "/verify-email" });
  };

  return (
      <AuthShell title="Welcome back" subtitle="Sign in to access your secure dashboard.">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="you@example.com" />
        </Field>
        <Field label="Password">
          <div className="relative">
            <input type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input pr-10" placeholder="••••••••" />
            <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-[var(--gold)]" /> Remember me
        </label>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <div className="flex items-center justify-between text-xs">
          <Link to="/forgot-password" className="text-[var(--gold)] font-medium">Forgot password?</Link>
          <Link to="/admin-login" className="text-muted-foreground hover:text-[var(--gold)]">Admin portal</Link>
        </div>
        <button className="w-full py-3 rounded-xl gradient-gold text-[var(--primary-foreground)] font-semibold" style={{ boxShadow: "var(--shadow-gold)" }}>Sign In</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account? <Link to="/register" className="text-[var(--gold)] font-medium">Create one</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden items-center justify-center p-12" style={{ background: "linear-gradient(135deg, oklch(0.18 0.014 60), oklch(0.13 0.01 60))" }}>
        <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-radial-gold)" }} />
        <div className="relative max-w-md text-center">
          <Logo size={48} />
          <h2 className="mt-10 text-4xl font-bold tracking-tight">Premium digital asset management.</h2>
          <p className="mt-4 text-muted-foreground">Trusted by clients worldwide since 2008.</p>
        </div>
      </div>
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md glass-strong rounded-3xl p-8 md:p-10 animate-fade-up">
          <div className="lg:hidden mb-6"><Logo /></div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="mt-2 text-muted-foreground text-sm">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <style>{`.auth-input{width:100%;background:var(--input);border:1px solid oklch(0.3 0.02 70 / 0.5);border-radius:0.75rem;padding:0.75rem 0.9rem;color:var(--foreground);outline:none;transition:all .2s} .auth-input:focus{border-color:var(--gold);box-shadow:0 0 0 3px oklch(0.82 0.16 85 / 0.15)}`}</style>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}
