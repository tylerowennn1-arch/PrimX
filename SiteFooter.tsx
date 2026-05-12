import { Logo } from "./Logo";
import { Twitter, Linkedin, Facebook, Instagram, Mail, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--gold)]/10 mt-24 bg-[oklch(0.13_0.01_60)]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <Logo />
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            A premium digital asset management platform engineered for security, transparency and performance.
          </p>
          <div className="flex gap-3 mt-5">
            {[Twitter, Linkedin, Facebook, Instagram].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full glass flex items-center justify-center hover:text-[var(--gold)] transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-foreground">Platform</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><a href="/tiers" className="hover:text-[var(--gold)]">Account Tiers</a></li>
            <li><a href="/dashboard" className="hover:text-[var(--gold)]">Dashboard</a></li>
            <li><a href="/deposit" className="hover:text-[var(--gold)]">Deposits</a></li>
            <li><a href="/withdraw" className="hover:text-[var(--gold)]">Withdrawals</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-foreground">Company</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li><a href="/about" className="hover:text-[var(--gold)]">About</a></li>
            <li><a href="/faq" className="hover:text-[var(--gold)]">FAQ</a></li>
            <li><a href="/contact" className="hover:text-[var(--gold)]">Contact</a></li>
            <li><a href="#" className="hover:text-[var(--gold)]">Compliance</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4 text-foreground">Contact</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-[var(--gold)]" /> support@primxcapital.com</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-[var(--gold)]" /> 25 Old Broad St, London EC2N 1HQ</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[var(--gold)]/10 py-5 text-center text-xs text-muted-foreground">
        © 2008–{new Date().getFullYear()} PrimXCapital. All rights reserved. Established 2008.
      </div>
    </footer>
  );
}
