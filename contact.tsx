import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — PrimXCapital" }] }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return toast.error("Fill all fields");
    toast.success("Message sent. We'll be in touch shortly.");
    setForm({ name: "", email: "", message: "" });
  };
  return (
    <div>
      <SiteHeader />
      <section className="max-w-6xl mx-auto px-5 md:px-8 py-20 grid lg:grid-cols-2 gap-10">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-[var(--gold)]">Get in touch</div>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight">We're here to help.</h1>
          <p className="mt-4 text-muted-foreground">Reach our team through any channel below — we typically reply within an hour.</p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 glass rounded-xl p-4"><Mail className="w-5 h-5 text-[var(--gold)]" /> support@primxcapital.com</div>
            <div className="flex items-center gap-3 glass rounded-xl p-4"><Phone className="w-5 h-5 text-[var(--gold)]" /> +44 20 7946 0001</div>
            <div className="flex items-center gap-3 glass rounded-xl p-4"><MapPin className="w-5 h-5 text-[var(--gold)]" /> 25 Old Broad St, London EC2N 1HQ</div>
          </div>
        </div>
        <form onSubmit={submit} className="glass-strong rounded-3xl p-8 space-y-4 self-start">
          {(["name", "email"] as const).map((k) => (
            <label key={k} className="block">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5 capitalize">{k}</div>
              <input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="w-full bg-input border border-border rounded-xl px-3.5 py-3 outline-none focus:border-[var(--gold)]" />
            </label>
          ))}
          <label className="block">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">Message</div>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="w-full bg-input border border-border rounded-xl px-3.5 py-3 outline-none focus:border-[var(--gold)]" />
          </label>
          <button className="w-full py-3 rounded-xl gradient-gold text-[var(--primary-foreground)] font-semibold">Send Message</button>
        </form>
      </section>
      <SiteFooter />
    </div>
  );
}
