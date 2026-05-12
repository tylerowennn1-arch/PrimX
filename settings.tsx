import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { auth, type User } from "@/lib/auth";
import { getLanguage, setLanguage, type Language } from "@/lib/i18n";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — PrimXCapital" }] }),
  component: () => (
    <AppShell>
      <SettingsPage />
    </AppShell>
  ),
});

function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [twoFa, setTwoFa] = useState(false);
  const [lang, setLangState] = useState<Language>("EN");

  useEffect(() => {
    const u = auth.current();
    if (u) {
      setUser(u);
      setFullName(u.fullName);
    }
    setLangState(getLanguage());
  }, []);
  if (!user) return null;

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    auth.updateCurrent({ fullName });
    toast.success("Profile updated");
  };
  const changePw = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPw !== user.password) return toast.error("Current password incorrect");
    if (newPw.length < 6) return toast.error("New password too short");
    auth.updateCurrent({ password: newPw });
    setOldPw("");
    setNewPw("");
    toast.success("Password updated");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile and preferences.</p>
      </div>

      <Section title="Profile">
        <form onSubmit={saveProfile} className="space-y-4">
          <Row label="Full name">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="settings-input"
            />
          </Row>
          <Row label="Email">
            <input value={user.email} disabled className="settings-input opacity-60" />
          </Row>
          <button className="px-5 py-2.5 rounded-lg gradient-gold text-[var(--primary-foreground)] font-medium text-sm">
            Save changes
          </button>
        </form>
      </Section>

      <Section title="Security">
        <form onSubmit={changePw} className="space-y-4">
          <Row label="Current password">
            <input
              type="password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              className="settings-input"
            />
          </Row>
          <Row label="New password">
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="settings-input"
            />
          </Row>
          <button className="px-5 py-2.5 rounded-lg gradient-gold text-[var(--primary-foreground)] font-medium text-sm">
            Update password
          </button>
        </form>
        <div className="mt-6 pt-6 border-t border-border">
          <Toggle
            label="Two-factor authentication"
            desc="Add an extra layer of security at sign-in."
            val={twoFa}
            set={setTwoFa}
          />
        </div>
      </Section>

      <Section title="Notifications">
        <Toggle
          label="Email notifications"
          desc="Receive deposits, withdrawals and security alerts via email."
          val={emailNotif}
          set={setEmailNotif}
        />
        <Toggle
          label="SMS notifications"
          desc="Get text alerts for high-priority events."
          val={smsNotif}
          set={setSmsNotif}
        />
      </Section>

      <Section title="Language">
        <Row label="Display language">
          <select
            value={lang}
            onChange={(e) => {
              const next = e.target.value as Language;
              setLanguage(next);
              setLangState(next);
              toast.success("Language updated");
            }}
            className="settings-input"
          >
            <option value="EN">English</option>
            <option value="ES">Español</option>
            <option value="FR">Français</option>
          </select>
        </Row>
      </Section>

      <style>{`.settings-input{width:100%;background:var(--input);border:1px solid oklch(0.3 0.02 70 / 0.5);border-radius:0.65rem;padding:0.6rem 0.85rem;color:var(--foreground);outline:none}.settings-input:focus{border-color:var(--gold)}`}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-semibold mb-5">{title}</h3>
      {children}
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid sm:grid-cols-3 items-center gap-3">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  );
}
function Toggle({
  label,
  desc,
  val,
  set,
}: {
  label: string;
  desc: string;
  val: boolean;
  set: (b: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <button
        onClick={() => set(!val)}
        className={`shrink-0 w-11 h-6 rounded-full p-0.5 transition-colors ${val ? "bg-[var(--gold)]" : "bg-muted"}`}
      >
        <div
          className={`w-5 h-5 rounded-full bg-background transition-transform ${val ? "translate-x-5" : ""}`}
        />
      </button>
    </div>
  );
}
