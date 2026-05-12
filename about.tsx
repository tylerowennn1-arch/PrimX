import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Award, Shield, Globe2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — PrimXCapital" }, { name: "description", content: "Established 2008. Premium digital asset management platform." }] }),
  component: () => (
    <div>
      <SiteHeader />
      <section className="max-w-5xl mx-auto px-5 md:px-8 py-20">
        <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">Our Story</div>
        <h1 className="mt-3 text-4xl md:text-6xl font-bold tracking-tight">A platform built on trust since 2008.</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-3xl leading-relaxed">
          PrimXCapital was founded in London with a single mission: build a digital asset platform that combines institutional-grade security with the intuitive experience modern investors deserve. Today we serve clients in over 60 countries with multilingual support and a 24/7 operations desk.
        </p>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {[
            { icon: Award, t: "17 Years", d: "Operating across multiple market cycles." },
            { icon: Shield, t: "Insured Custody", d: "Cold-storage assets backed by industry-leading insurance." },
            { icon: Globe2, t: "Global Reach", d: "60+ countries, 3 languages, one premium experience." },
          ].map((x, i) => (
            <div key={i} className="glass rounded-2xl p-6">
              <x.icon className="w-8 h-8 text-[var(--gold)] mb-3" />
              <div className="font-semibold">{x.t}</div>
              <div className="text-sm text-muted-foreground mt-1">{x.d}</div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  ),
});
