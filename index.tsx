import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Logo } from "@/components/Logo";
import { getLanguage, subscribeLanguage, t, type Language } from "@/lib/i18n";
import coin from "@/assets/bitcoin-coin.jpg";
import ceo from "@/assets/people/daniel-reed.jpg";
import coo from "@/assets/people/amelia-clarke.jpg";
import cto from "@/assets/people/victor-hale.jpg";
import compliance from "@/assets/people/naomi-price.jpg";
import markets from "@/assets/people/marcus-bennett.jpg";
import sofia from "@/assets/people/sofia-marin.jpg";
import arjun from "@/assets/people/arjun-patel.jpg";
import elodie from "@/assets/people/elodie-rousseau.jpg";
import {
  Shield,
  Zap,
  HeadphonesIcon,
  Activity,
  BarChart3,
  Globe2,
  UserPlus,
  Layers,
  Wallet,
  LineChart,
  Check,
  ChevronDown,
  Star,
  Award,
  Lock,
  Bitcoin,
  Landmark,
  Smartphone,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PrimXCapital — Advanced Digital Asset Platform" },
      {
        name: "description",
        content:
          "Securely manage and monitor your digital financial activity with a premium fintech-grade dashboard.",
      },
      { property: "og:title", content: "PrimXCapital — Advanced Digital Asset Platform" },
      {
        property: "og:description",
        content:
          "Premium digital asset platform engineered for security, transparency and performance.",
      },
    ],
  }),
  component: HomePage,
});

function useCounter(target: number, duration = 1800) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const start = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / duration);
            setN(Math.floor(p * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { ref, n };
}

function HomePage() {
  const [lang, setLang] = useState<Language>("EN");
  useEffect(() => {
    setLang(getLanguage());
    return subscribeLanguage(setLang);
  }, []);
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <Hero lang={lang} />
      <MarketStrip />
      <HowItWorks lang={lang} />
      <Tiers lang={lang} />
      <Features />
      <Stats />
      <Trust />
      <Team />
      <Testimonials />
      <FAQ />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function Hero({ lang }: { lang: Language }) {
  const copy = t(lang);
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(120deg, oklch(0.12 0.01 60), oklch(0.2 0.018 66) 48%, oklch(0.12 0.01 60)), var(--gradient-radial-gold)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-px gradient-gold opacity-50" />
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-16 md:pt-20 md:pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-xs text-muted-foreground mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            {copy.heroEyebrow}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            {copy.heroTitleStart} <span className="gradient-text">{copy.heroTitleAccent}</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            {copy.heroText}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl gradient-gold text-[var(--primary-foreground)] font-semibold hover:opacity-95 transition-all"
              style={{ boxShadow: "var(--shadow-gold)" }}
            >
              {copy.startInvesting}
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl glass border border-[var(--gold)]/30 hover:border-[var(--gold)] transition-colors"
            >
              {copy.clientLogin}
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--gold)]" /> {copy.bankSecurity}
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[var(--gold)]" /> {copy.encryptedVault}
            </div>
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div
            className="absolute w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
            style={{ background: "var(--gradient-gold)" }}
          />
          <div className="relative animate-float">
            <div
              className="absolute inset-0 rounded-full animate-spin-slow"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent, oklch(0.82 0.16 85 / 0.6), transparent)",
              }}
            />
            <img
              src={coin}
              alt="PrimXCapital coin"
              className="relative w-72 md:w-96 rounded-full animate-pulse-glow"
            />
          </div>
          {/* Floating mini cards */}
          <div
            className="hidden md:block absolute top-6 left-0 glass rounded-xl px-4 py-3 animate-float"
            style={{ animationDelay: "1s" }}
          >
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">BTC</div>
            <div className="text-base font-semibold">$67,420.18</div>
            <div className="text-xs text-[var(--success)]">+2.34%</div>
          </div>
          <div
            className="hidden md:block absolute bottom-6 right-0 glass rounded-xl px-4 py-3 animate-float"
            style={{ animationDelay: "2s" }}
          >
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Portfolio
            </div>
            <div className="text-base font-semibold gradient-text">$248,910</div>
            <div className="text-xs text-[var(--success)]">+12.8%</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MarketStrip() {
  const items = [
    { icon: Bitcoin, label: "Cryptocurrency Funding", value: "Crypto deposits enabled" },
    { icon: Landmark, label: "Global Markets", value: "Crypto · Forex · Stocks" },
    { icon: Smartphone, label: "Mobile Access", value: "Client dashboard 24/7" },
    { icon: Shield, label: "Protected Access", value: "SSL secured client portal" },
    { icon: HeadphonesIcon, label: "Live Admin Support", value: "Direct support inbox" },
    { icon: LineChart, label: "Daily Profit View", value: "Interest wallet tracking" },
  ];
  return (
    <section className="border-y border-[var(--gold)]/10 bg-[oklch(0.13_0.01_60/0.72)]">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 grid md:grid-cols-3 xl:grid-cols-6 gap-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-[var(--primary-foreground)]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {item.label}
              </div>
              <div className="font-semibold truncate">{item.value}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorks({ lang }: { lang: Language }) {
  const copy = t(lang);
  const steps = [
    {
      icon: UserPlus,
      title: "Create Your Account",
      text: "Sign up in under a minute with secure verification.",
    },
    {
      icon: Layers,
      title: "Choose Account Tier",
      text: "Pick the tier that matches your investment scale.",
    },
    {
      icon: Wallet,
      title: "Fund Your Account",
      text: "Deposit via BTC, ETH or USDT to your secure vault.",
    },
    {
      icon: LineChart,
      title: "Monitor Dashboard",
      text: "Track activity in real time with rich analytics.",
    },
  ];
  return (
    <section className="py-24 max-w-7xl mx-auto px-5 md:px-8">
      <SectionHeading eyebrow={copy.howEyebrow} title={copy.howTitle} subtitle={copy.howSubtitle} />
      <div className="grid md:grid-cols-4 gap-5 mt-12">
        {steps.map((s, i) => (
          <div
            key={i}
            className="relative glass rounded-2xl p-6 hover:-translate-y-1 transition-transform group"
          >
            <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-sm font-bold text-[var(--primary-foreground)]">
              {i + 1}
            </div>
            <s.icon className="w-9 h-9 text-[var(--gold)] mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-lg">{s.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const TIERS = [
  {
    name: "Starters Plan",
    range: "$200 – $1,999",
    duration: "48 hours",
    profit: "20% Profit",
    perks: ["20% profit in 48 hours", "Basic dashboard access", "Email support"],
  },
  {
    name: "Basic Plan",
    range: "$2,000 – $5,000",
    duration: "48 hours",
    profit: "40% Profit",
    perks: ["40% profit in 48 hours", "Advanced charts", "Priority email support"],
  },
  {
    name: "Standard Plan",
    range: "$5,000 – $10,000",
    duration: "48 hours",
    profit: "60% Profit",
    perks: ["60% profit in 48 hours", "Real-time analytics", "Live chat support"],
    highlight: true,
  },
  {
    name: "Premium Plan",
    range: "$10,000 – $1,000,000",
    duration: "48 hours",
    profit: "80% Profit",
    perks: ["80% profit in 48 hours", "Dedicated account manager", "24/7 priority support"],
  },
];

const TESTIMONIALS = [
  {
    name: "Marcus Chen",
    role: "Private Investor",
    img: markets,
    text: "PrimXCapital's dashboard is the cleanest I've used. Withdrawals are fast and support actually answers.",
  },
  {
    name: "Sofia Marín",
    role: "Portfolio Member",
    img: sofia,
    text: "The tier system made onboarding effortless. I can finally see all my activity in one place.",
  },
  {
    name: "Arjun Patel",
    role: "Digital Asset Trader",
    img: arjun,
    text: "Security and transparency win for me. The compliance documentation is reassuring.",
  },
  {
    name: "Élodie Rousseau",
    role: "Wealth Partner",
    img: elodie,
    text: "I've tried five platforms. PrimXCapital is the only one that feels truly institutional.",
  },
];

function Tiers({ lang }: { lang: Language }) {
  const copy = t(lang);
  return (
    <section id="tiers" className="py-24 max-w-7xl mx-auto px-5 md:px-8">
      <SectionHeading
        eyebrow={copy.plansEyebrow}
        title={copy.plansTitle}
        subtitle={copy.plansSubtitle}
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className={`relative rounded-2xl p-6 ${t.highlight ? "gold-border" : "glass"} hover:-translate-y-2 transition-all group`}
          >
            {t.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest gradient-gold text-[var(--primary-foreground)] px-3 py-1 rounded-full font-semibold">
                Popular
              </div>
            )}
            <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4">
              <Star className="w-5 h-5 text-[var(--primary-foreground)]" />
            </div>
            <h3 className="text-xl font-bold">{t.name}</h3>
            <div className="mt-3 text-2xl font-bold gradient-text">{t.range}</div>
            <div className="text-xs text-[var(--gold)] mt-1 font-semibold uppercase tracking-widest">{t.profit}</div>
            <div className="text-xs text-muted-foreground mt-1">Term: {t.duration}</div>
            <ul className="mt-5 space-y-2.5">
              {t.perks.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-[var(--gold)] mt-0.5 shrink-0" /> {p}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="mt-6 block text-center py-2.5 rounded-lg border border-[var(--gold)]/40 text-sm font-medium hover:bg-[var(--gold)]/10 transition-colors group-hover:border-[var(--gold)]"
            >
              Get Started
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Shield,
      title: "Secure Infrastructure",
      text: "Cold-storage vaults, multi-sig and 256-bit encryption.",
    },
    {
      icon: Zap,
      title: "Fast Processing",
      text: "Lightning-fast deposits and withdrawals around the clock.",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      text: "A dedicated team is always one message away.",
    },
    {
      icon: Activity,
      title: "Advanced Monitoring",
      text: "Audit-trail logging on every account action.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Dashboard",
      text: "Live balances, charts and transaction streams.",
    },
    {
      icon: Globe2,
      title: "Multi-Language",
      text: "English, Spanish and French for global clients.",
    },
  ];
  return (
    <section className="py-24 max-w-7xl mx-auto px-5 md:px-8">
      <SectionHeading
        eyebrow="Platform"
        title="Everything you need to grow"
        subtitle="A complete toolkit for serious digital asset management."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
        {items.map((f, i) => (
          <div
            key={i}
            className="glass rounded-2xl p-6 hover:border-[var(--gold)]/40 transition-colors"
          >
            <f.icon className="w-8 h-8 text-[var(--gold)] mb-4" />
            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatItem({
  label,
  val,
  prefix = "",
  suffix = "",
}: {
  label: string;
  val: number;
  prefix?: string;
  suffix?: string;
}) {
  const c = useCounter(val);
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text">
        {prefix}
        <span ref={c.ref}>{c.n.toLocaleString()}</span>
        {suffix}+
      </div>
      <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

function Stats() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div
          className="glass-strong rounded-3xl p-10 md:p-14 grid grid-cols-2 lg:grid-cols-4 gap-8"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.22 0.02 70 / 0.7), oklch(0.18 0.014 60 / 0.7))",
          }}
        >
          <StatItem label="Total Users" val={84210} />
          <StatItem label="Total Deposits" val={128} prefix="$" suffix="M" />
          <StatItem label="Total Withdrawals" val={92} prefix="$" suffix="M" />
          <StatItem label="Active Accounts" val={41280} />
        </div>
      </div>
    </section>
  );
}

function CertificateOfRegistration() {
  // Deterministic verification ID derived from a fixed registration date
  const issueDate = new Date("2008-10-12T00:00:00Z");
  const renewalDate = new Date("2026-10-12T00:00:00Z");
  const certId = "FCA-UK-2008-PXC-879987";
  const verifyHash = "0x7A3F" + "C9B2E1D4A6F8" + "0C5B7E";
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  // Faux QR pattern (deterministic) for a verification block
  const cells = Array.from({ length: 12 * 12 }, (_, i) => {
    const x = i % 12;
    const y = Math.floor(i / 12);
    const corner =
      (x < 3 && y < 3) || (x > 8 && y < 3) || (x < 3 && y > 8);
    const on = corner ? (x === 0 || x === 2 || y === 0 || y === 2 || (x === 1 && y === 1)) : ((x * 7 + y * 13 + 11) % 3 === 0);
    return on;
  });

  return (
    <div className="lg:col-span-2 certificate-paper rounded-xl p-6 md:p-12 relative overflow-hidden">
      {/* Watermark */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none flex items-center justify-center select-none"
      >
        <div className="font-display italic text-[18vw] md:text-[10rem] text-[oklch(0.34_0.18_265)] opacity-[0.05] rotate-[-18deg] tracking-tight">
          PrimXCapital
        </div>
      </div>
      {/* Guilloché-like top band */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-2"
        style={{
          background:
            "repeating-linear-gradient(90deg, oklch(0.34 0.18 265) 0 6px, oklch(0.7 0.16 85) 6px 12px)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-2"
        style={{
          background:
            "repeating-linear-gradient(90deg, oklch(0.34 0.18 265) 0 6px, oklch(0.7 0.16 85) 6px 12px)",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-[oklch(0.34_0.18_265)] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[oklch(0.34_0.18_265)]" />
            </div>
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[oklch(0.34_0.18_265)] font-bold">
                Financial Conduct Authority
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[oklch(0.25_0.025_265)] opacity-70">
                United Kingdom · Reg. of Corporations
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest opacity-70">Certificate No.</div>
            <div className="font-mono text-xs md:text-sm font-bold text-[oklch(0.34_0.18_265)]">
              {certId}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-[0.4em] text-[oklch(0.7_0.16_85)] font-bold">
            Official Document
          </div>
          <h3 className="mt-2 text-2xl md:text-4xl font-display text-[oklch(0.34_0.18_265)]">
            Certificate of Registration & Operating Licence
          </h3>
          <div className="mt-2 mx-auto w-24 h-px bg-[oklch(0.34_0.18_265)]" />
        </div>

        {/* Body */}
        <p className="mt-6 text-center text-xs md:text-sm font-semibold max-w-2xl mx-auto text-[oklch(0.25_0.025_265)] leading-relaxed">
          This is to certify that the entity named hereunder has been duly registered, examined and
          authorised under the Financial Services and Markets Act to operate as a regulated digital
          asset service provider within the United Kingdom and affiliated jurisdictions.
        </p>

        <div className="my-6 text-center text-3xl md:text-5xl font-bold text-[oklch(0.34_0.18_265)]">
          Prim<span className="text-[oklch(0.7_0.16_85)]">X</span>Capital Ltd.
        </div>

        <p className="text-center text-[11px] md:text-xs font-semibold max-w-xl mx-auto text-[oklch(0.18_0.02_265)] leading-relaxed">
          authorised to engage in: digital asset management, cryptocurrency custody, managed
          investment plans, and global market access services for retail and institutional clients.
        </p>

        {/* Particulars */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-[10px] uppercase tracking-widest opacity-70">Issued</div>
            <div className="text-xs md:text-sm mt-1 font-semibold">{fmt(issueDate)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest opacity-70">Renewal</div>
            <div className="text-xs md:text-sm mt-1 font-semibold">{fmt(renewalDate)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest opacity-70">Jurisdiction</div>
            <div className="text-xs md:text-sm mt-1 font-semibold">United Kingdom</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest opacity-70">Status</div>
            <div className="text-xs md:text-sm mt-1 font-semibold text-[oklch(0.55_0.16_155)]">
              ● Active
            </div>
          </div>
        </div>

        {/* Verification block */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-center border-t border-b border-[oklch(0.34_0.18_265_/_0.3)] py-6">
          <div className="grid grid-cols-12 gap-px w-[120px] h-[120px] bg-[oklch(0.34_0.18_265)] p-1 mx-auto">
            {cells.map((on, i) => (
              <div
                key={i}
                className={on ? "bg-[oklch(0.18_0.035_265)]" : "bg-[oklch(0.98_0.01_90)]"}
              />
            ))}
          </div>
          <div className="text-center md:text-left">
            <div className="text-[10px] uppercase tracking-widest opacity-70">
              Verification Hash (SHA-256)
            </div>
            <div className="font-mono text-[11px] md:text-xs break-all text-[oklch(0.34_0.18_265)] font-semibold">
              {verifyHash}…a1f9c7
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-widest opacity-70">Verify at</div>
            <div className="text-xs font-semibold">
              primxcapital.com/verify/{certId.toLowerCase()}
            </div>
          </div>
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 rounded-full border-[3px] border-[oklch(0.34_0.18_265)] animate-spin-slow" />
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-[oklch(0.34_0.18_265)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <Award className="w-6 h-6 text-[oklch(0.7_0.16_85)]" />
              <div className="text-[8px] uppercase tracking-widest font-bold text-[oklch(0.34_0.18_265)] mt-0.5">
                Official
              </div>
              <div className="text-[8px] uppercase tracking-widest font-bold text-[oklch(0.34_0.18_265)]">
                Seal
              </div>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-6 grid grid-cols-2 gap-8 text-xs">
          <div className="text-center">
            <div className="font-display italic text-2xl text-[oklch(0.18_0.035_265)] -mb-1">
              J. Russell
            </div>
            <div className="border-t border-[oklch(0.18_0.02_265)] pt-1">
              <div className="font-bold uppercase tracking-widest text-[10px]">James Russell</div>
              <div className="opacity-70 text-[10px]">Registrar of Licence</div>
            </div>
          </div>
          <div className="text-center">
            <div className="font-display italic text-2xl text-[oklch(0.18_0.035_265)] -mb-1">
              S. Sands
            </div>
            <div className="border-t border-[oklch(0.18_0.02_265)] pt-1">
              <div className="font-bold uppercase tracking-widest text-[10px]">Sarah Sands</div>
              <div className="opacity-70 text-[10px]">Registrar of Corporations</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-[10px] uppercase tracking-[0.25em] opacity-60">
          This document is electronically signed and machine-verifiable.
        </div>
      </div>
    </div>
  );
}

function Trust() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-5 md:px-8">
      <SectionHeading
        eyebrow="Trust & Compliance"
        title="Backed by 17 years of experience"
        subtitle="A registered digital asset platform with rigorous compliance standards."
      />
      <div className="grid lg:grid-cols-3 gap-6 mt-12">
        <CertificateOfRegistration />

        <div className="space-y-5">
          {[
            { t: "Established 2008", d: "17 years of operating excellence." },
            { t: "Regulated entity", d: "Registered digital asset service provider." },
            { t: "Insured custody", d: "Client assets held in insured cold storage." },
            { t: "SOC 2 aligned", d: "Independent annual security audits." },
          ].map((c, i) => (
            <div key={i} className="glass rounded-2xl p-5 flex gap-4 items-start">
              <Shield className="w-6 h-6 text-[var(--gold)] mt-0.5" />
              <div>
                <div className="font-semibold">{c.t}</div>
                <div className="text-sm text-muted-foreground mt-1">{c.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  const people = [
    { name: "Daniel Reed", title: "Chief Executive Officer", img: ceo },
    { name: "Amelia Clarke", title: "Chief Operations Officer", img: coo },
    { name: "Victor Hale", title: "Chief Technology Officer", img: cto },
    { name: "Naomi Price", title: "Head of Compliance", img: compliance },
    { name: "Marcus Bennett", title: "Director of Markets", img: markets },
  ];
  return (
    <section className="py-24 max-w-7xl mx-auto px-5 md:px-8">
      <SectionHeading
        eyebrow="Leadership"
        title="People behind PrimXCapital"
        subtitle="A senior team across markets, security, compliance and client operations."
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-12">
        {people.map((person) => (
          <div
            key={person.name}
            className="glass rounded-2xl p-4 text-center hover:-translate-y-1 transition-transform"
          >
            <img
              src={person.img}
              alt={person.name}
              className="w-24 h-24 rounded-full mx-auto object-cover ring-2 ring-[var(--gold)]/40"
            />
            <h3 className="mt-4 font-semibold">{person.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{person.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(id);
  }, []);
  return (
    <section className="py-24 max-w-7xl mx-auto px-5 md:px-8">
      <SectionHeading eyebrow="Testimonials" title="Trusted by clients worldwide" />
      <div className="mt-12 relative overflow-hidden">
        <div
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="min-w-full px-2">
              <div className="glass-strong rounded-3xl p-10 max-w-3xl mx-auto text-center">
                <div className="flex justify-center gap-1 mb-5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-[var(--gold)] text-[var(--gold)]" />
                  ))}
                </div>
                <p className="text-lg md:text-xl leading-relaxed">"{t.text}"</p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-12 h-12 rounded-full ring-2 ring-[var(--gold)]/40"
                  />
                  <div className="text-left">
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, x) => (
            <button
              key={x}
              onClick={() => setI(x)}
              className={`h-1.5 rounded-full transition-all ${x === i ? "w-8 bg-[var(--gold)]" : "w-2 bg-muted"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "How do I create an account?",
      a: "Click 'Get Started', enter your name, email and password, and verify your email. The whole process takes under two minutes.",
    },
    {
      q: "How do I fund my account?",
      a: "From your dashboard, open the Deposit page and choose BTC, ETH or USDT. Send funds to the displayed wallet and submit your transaction reference.",
    },
    {
      q: "How long does processing take?",
      a: "Most deposits confirm within 10–30 minutes. Withdrawals are typically processed within 1 business day.",
    },
    {
      q: "Is the platform secure?",
      a: "Yes. We use cold-storage custody, multi-signature wallets, 256-bit encryption and undergo annual independent security audits.",
    },
    {
      q: "How do I contact support?",
      a: "Use the in-app chat, email support@primxcapital.com, or call our 24/7 hotline listed in your dashboard.",
    },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 max-w-3xl mx-auto px-5 md:px-8">
      <SectionHeading eyebrow="Support" title="Frequently asked questions" />
      <div className="mt-10 space-y-3">
        {items.map((it, i) => (
          <div key={i} className="glass rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between text-left p-5 hover:bg-[var(--gold)]/5"
            >
              <span className="font-semibold">{it.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-[var(--gold)] transition-transform ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{it.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-5 md:px-8">
      <div className="glass-strong rounded-3xl p-12 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{ background: "var(--gradient-radial-gold)" }}
        />
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
          Ready to elevate your portfolio?
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Join thousands of clients who trust PrimXCapital to manage and grow their digital assets.
        </p>
        <Link
          to="/register"
          className="inline-block mt-7 px-8 py-3.5 rounded-xl gradient-gold text-[var(--primary-foreground)] font-semibold"
          style={{ boxShadow: "var(--shadow-gold)" }}
        >
          Open your account
        </Link>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">{eyebrow}</div>
      <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
