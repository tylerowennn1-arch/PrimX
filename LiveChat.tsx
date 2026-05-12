import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Headset } from "lucide-react";
import { auth } from "@/lib/auth";
import { support, visitorId, type SupportThread } from "@/lib/support";

const AGENT_NAME = "PrimXCapital Support";

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState<SupportThread | null>(null);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Identify the visitor (logged-in or guest)
  useEffect(() => {
    const u = auth.current();
    const id = u ? `user-${u.id}` : visitorId();
    const e = u?.email ?? "";
    const n = u?.fullName ?? "";
    setEmail(e);
    setName(n);
    const t = support.ensure(id, e, n || "Guest");
    setThread(t);
    const unsub = support.subscribe(() => {
      const next = support.thread(id);
      if (next) setThread({ ...next });
    });
    return unsub;
  }, []);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
    if (open && thread) support.markReadByUser(thread.id);
  }, [thread, open]);

  if (!thread) return null;

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const t = text.trim();
    if (!t) return;
    if (!email.trim()) return;
    support.sendFromUser(thread.id, email.trim(), name.trim() || "Guest", t);
    setText("");
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open live chat"
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full gradient-gold flex items-center justify-center shadow-elegant hover:scale-105 transition-transform"
        style={{ boxShadow: "var(--shadow-gold)" }}
      >
        {open ? (
          <X className="w-6 h-6 text-[var(--primary-foreground)]" />
        ) : (
          <MessageCircle className="w-6 h-6 text-[var(--primary-foreground)]" />
        )}
        {!open && thread.unreadByUser > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-background">
            {thread.unreadByUser}
          </span>
        )}
        {!open && thread.unreadByUser === 0 && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[var(--success)] rounded-full ring-2 ring-background animate-pulse" />
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[560px] glass-strong rounded-2xl flex flex-col overflow-hidden shadow-elegant animate-fade-up">
          <div className="px-4 py-3 flex items-center gap-3 border-b border-[var(--gold)]/20 bg-[oklch(0.18_0.014_60/0.9)]">
            <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center">
              <Headset className="w-5 h-5 text-[var(--primary-foreground)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{AGENT_NAME}</div>
              <div className="text-[11px] text-[var(--success)] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" /> An admin will
                reply shortly
              </div>
            </div>
          </div>

          {!auth.current() && (
            <div className="px-3 pt-3 grid grid-cols-2 gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-input border border-border rounded-lg px-2.5 py-2 text-xs outline-none focus:border-[var(--gold)]"
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                type="email"
                className="bg-input border border-border rounded-lg px-2.5 py-2 text-xs outline-none focus:border-[var(--gold)]"
              />
            </div>
          )}

          <div ref={scrollerRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
            {thread.messages.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-8">
                Send us a message — our admin team replies from the support panel.
              </div>
            )}
            {thread.messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm leading-snug ${
                    m.from === "user"
                      ? "gradient-gold text-[var(--primary-foreground)] rounded-br-sm"
                      : "bg-[oklch(0.24_0.014_60)] text-foreground rounded-bl-sm border border-[var(--gold)]/10"
                  }`}
                >
                  <div>{m.text}</div>
                  <div
                    className={`text-[10px] mt-1 ${m.from === "user" ? "text-[var(--primary-foreground)]/70" : "text-muted-foreground"}`}
                  >
                    {m.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={send}
            className="p-2.5 border-t border-[var(--gold)]/15 bg-[oklch(0.18_0.014_60/0.9)] flex gap-2"
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={email ? "Type your message..." : "Add your email above first"}
              disabled={!email.trim()}
              className="flex-1 bg-input border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[var(--gold)] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!text.trim() || !email.trim()}
              className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shrink-0 disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-[var(--primary-foreground)]" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
