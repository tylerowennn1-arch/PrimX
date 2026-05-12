// Mock email-notification layer. Stores an "outbox" in localStorage and
// dispatches a toast confirming delivery. Swap the `deliver()` body with a
// real API call (Resend, Lovable Cloud, etc.) when wiring a backend.

import { toast } from "sonner";

export type NotifyKind =
  | "deposit_submitted" | "deposit_approved" | "deposit_rejected"
  | "withdrawal_submitted" | "withdrawal_approved" | "withdrawal_rejected"
  | "balance_credited" | "balance_debited" | "account_suspended" | "account_activated"
  | "support_reply" | "support_message";

export type EmailRecord = {
  id: string;
  to: string;
  subject: string;
  body: string;
  kind: NotifyKind;
  sentAt: string;
};

const KEY = "px_email_outbox";
const EVT = "px-email-sent";

function read(): EmailRecord[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
function write(list: EmailRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function notify(to: string, kind: NotifyKind, subject: string, body: string) {
  const rec: EmailRecord = { id: crypto.randomUUID(), to, subject, body, kind, sentAt: new Date().toISOString() };
  const list = read();
  list.unshift(rec);
  write(list.slice(0, 200));
  toast.success(`Notification email sent to ${to}`);
  return rec;
}

export const outbox = {
  all: read,
  subscribe(fn: () => void) {
    if (typeof window === "undefined") return () => undefined;
    window.addEventListener(EVT, fn);
    window.addEventListener("storage", fn);
    return () => { window.removeEventListener(EVT, fn); window.removeEventListener("storage", fn); };
  },
};
