import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { auth, type User } from "@/lib/auth";
import { LayoutDashboard, ArrowDownToLine, ArrowUpFromLine, Activity, Settings, LogOut, Bell, Menu, X, Users, ShieldCheck } from "lucide-react";

const userNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/deposit", label: "Deposits", icon: ArrowDownToLine },
  { to: "/withdraw", label: "Withdrawals", icon: ArrowUpFromLine },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/settings", label: "Settings", icon: Settings },
];
const adminNav = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const nav = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const u = auth.current();
    if (!u) { nav({ to: admin ? "/admin-login" : "/login" }); return; }
    // Admin-only pages enforce admin role
    if (admin && u.role !== "admin") { nav({ to: "/dashboard" }); return; }
    // Shared pages (Settings) accept either role — no redirect for admins
    if (!admin && u.role !== "admin" && !u.emailVerified) { nav({ to: "/verify-email" }); return; }
    setUser(u);
  }, [nav, admin]);

  if (!user) return null;
  // Auto-detect admin context from current user so admins always see admin nav
  const isAdmin = admin || user.role === "admin";
  const items = isAdmin ? adminNav : userNav;
  const logout = () => { auth.logout(); nav({ to: isAdmin ? "/admin-login" : "/login" }); };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 glass-strong border-r border-[var(--gold)]/10 transform transition-transform ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-5 border-b border-[var(--gold)]/10 flex items-center justify-between">
          <Logo />
          <button className="lg:hidden" onClick={() => setOpen(false)}><X className="w-5 h-5" /></button>
        </div>
        <nav className="p-3 space-y-1">
          {items.map((item) => {
            const active = path === item.to;
            return (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${active ? "bg-[var(--gold)]/15 text-[var(--gold)]" : "text-muted-foreground hover:bg-[var(--gold)]/5 hover:text-foreground"}`}>
                <item.icon className="w-4 h-4" /> {item.label}
              </Link>
            );
          })}
          <button onClick={logout} className="w-full mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </nav>
        {isAdmin && (
          <div className="absolute bottom-5 left-5 right-5 glass rounded-xl p-4 text-xs">
            <div className="flex items-center gap-2 text-[var(--gold)] font-semibold"><ShieldCheck className="w-4 h-4" /> Admin Mode</div>
            <p className="mt-1 text-muted-foreground">Management controls enabled.</p>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 lg:ml-0">
        <header className="sticky top-0 z-30 glass-strong border-b border-[var(--gold)]/10 h-16 flex items-center justify-between px-5">
          <button className="lg:hidden" onClick={() => setOpen(true)}><Menu className="w-5 h-5" /></button>
          <div className="hidden lg:block text-sm text-muted-foreground">
            Welcome back, <span className="text-foreground font-medium">{user.fullName.split(" ")[0]}</span>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative w-10 h-10 rounded-full glass flex items-center justify-center hover:text-[var(--gold)] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--gold)]" />
            </button>
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 glass rounded-full pl-1 pr-3 py-1">
                <div className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center text-xs font-bold text-[var(--primary-foreground)]">
                  {user.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <span className="text-sm hidden sm:inline">{user.fullName.split(" ")[0]}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-56 glass-strong rounded-xl p-2 shadow-elegant">
                  <div className="px-3 py-2 border-b border-[var(--gold)]/10">
                    <div className="text-sm font-medium">{user.fullName}</div>
                    <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                  </div>
                  <Link to="/settings" className="block px-3 py-2 text-sm rounded-lg hover:bg-[var(--gold)]/10">Settings</Link>
                  <button onClick={logout} className="block w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive">Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="p-5 md:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}
