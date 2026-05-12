import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { getLanguage, setLanguage, subscribeLanguage, t, type Language } from "@/lib/i18n";
import { Menu, X, Globe } from "lucide-react";

const nav = [
  { to: "/", key: "home" },
  { to: "/about", key: "about" },
  { to: "/tiers", key: "tiers" },
  { to: "/faq", key: "faq" },
  { to: "/contact", key: "contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Language>("EN");
  useEffect(() => {
    setLang(getLanguage());
    return subscribeLanguage(setLang);
  }, []);
  const copy = t(lang);
  const changeLanguage = (value: Language) => {
    setLanguage(value);
    setLang(value);
  };
  return (
    <header className="sticky top-0 z-50 glass-strong border-b border-[var(--gold)]/10">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="hover:text-[var(--gold)] transition-colors"
              activeProps={{ className: "text-[var(--gold)]" }}
              activeOptions={{ exact: true }}
            >
              {copy[n.key]}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[var(--gold)] transition-colors">
            <Globe className="w-4 h-4" />
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value as Language)}
              className="bg-transparent outline-none text-xs cursor-pointer"
            >
              <option value="EN">EN</option>
              <option value="ES">ES</option>
              <option value="FR">FR</option>
            </select>
          </label>
          <Link
            to="/login"
            className="text-sm text-foreground/80 hover:text-[var(--gold)] transition-colors"
          >
            {copy.login}
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium px-4 py-2 rounded-lg gradient-gold text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
            style={{ boxShadow: "var(--shadow-gold)" }}
          >
            {copy.getStarted}
          </Link>
        </div>
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden glass-strong border-t border-[var(--gold)]/10 px-5 py-4 flex flex-col gap-3">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm" onClick={() => setOpen(false)}>
              {copy[n.key]}
            </Link>
          ))}
          <label className="flex items-center justify-between text-sm text-muted-foreground py-2 border-t border-[var(--gold)]/10">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4" /> Language
            </span>
            <select
              value={lang}
              onChange={(e) => changeLanguage(e.target.value as Language)}
              className="bg-input rounded-md px-2 py-1 outline-none"
            >
              <option value="EN">English</option>
              <option value="ES">Español</option>
              <option value="FR">Français</option>
            </select>
          </label>
          <div className="flex gap-2 pt-2 border-t border-[var(--gold)]/10">
            <Link
              to="/login"
              className="flex-1 text-center py-2 rounded-lg border border-[var(--gold)]/30 text-sm"
            >
              {copy.login}
            </Link>
            <Link
              to="/register"
              className="flex-1 text-center py-2 rounded-lg gradient-gold text-[var(--primary-foreground)] text-sm font-medium"
            >
              {copy.getStarted}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
