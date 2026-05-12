// Two-way live support: user <-> admin. Stored in localStorage and synced via
// the storage event so a tab open on /admin sees user messages instantly.

import { notify } from "./notifications";

export type SupportMessage = {
  id: string;
  from: "user" | "admin";
  text: string;
  time: string;
};

export type SupportThread = {
  id: string; // visitor id or user email
  email: string; // best-effort contact email
  name: string;
  messages: SupportMessage[];
  unreadByAdmin: number;
  unreadByUser: number;
  updatedAt: string;
};

const THREADS_KEY = "px_support_threads";
const VISITOR_KEY = "px_visitor_id";
const EVT = "px-support-change";

function read(): Record<string, SupportThread> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(THREADS_KEY) || "{}");
  } catch {
    return {};
  }
}
function write(map: Record<string, SupportThread>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(THREADS_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function visitorId(): string {
  if (typeof window === "undefined") return "anon";
  let v = localStorage.getItem(VISITOR_KEY);
  if (!v) {
    v = "guest-" + crypto.randomUUID().slice(0, 8);
    localStorage.setItem(VISITOR_KEY, v);
  }
  return v;
}

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const support = {
  threads(): SupportThread[] {
    return Object.values(read()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  thread(id: string): SupportThread | null {
    return read()[id] ?? null;
  },
  subscribe(fn: () => void) {
    if (typeof window === "undefined") return () => undefined;
    window.addEventListener(EVT, fn);
    window.addEventListener("storage", fn);
    return () => {
      window.removeEventListener(EVT, fn);
      window.removeEventListener("storage", fn);
    };
  },
  ensure(id: string, email: string, name: string): SupportThread {
    const map = read();
    if (!map[id]) {
      map[id] = {
        id,
        email,
        name,
        messages: [],
        unreadByAdmin: 0,
        unreadByUser: 0,
        updatedAt: new Date().toISOString(),
      };
      write(map);
    } else if (map[id].email !== email || map[id].name !== name) {
      map[id] = { ...map[id], email, name };
      write(map);
    }
    return map[id];
  },
  sendFromUser(id: string, email: string, name: string, text: string) {
    const map = read();
    const t = map[id] ?? {
      id,
      email,
      name,
      messages: [],
      unreadByAdmin: 0,
      unreadByUser: 0,
      updatedAt: new Date().toISOString(),
    };
    t.messages.push({ id: crypto.randomUUID(), from: "user", text, time: nowTime() });
    t.unreadByAdmin += 1;
    t.email = email;
    t.name = name;
    t.updatedAt = new Date().toISOString();
    map[id] = t;
    write(map);
    notify(
      "tylerowennn1@gmail.com",
      "support_message",
      `New support message from ${name || email}`,
      text,
    );
  },
  sendFromAdmin(id: string, text: string) {
    const map = read();
    const t = map[id];
    if (!t) return;
    t.messages.push({ id: crypto.randomUUID(), from: "admin", text, time: nowTime() });
    t.unreadByUser += 1;
    t.updatedAt = new Date().toISOString();
    map[id] = t;
    write(map);
    if (t.email) notify(t.email, "support_reply", "PrimXCapital support replied", text);
  },
  markReadByUser(id: string) {
    const map = read();
    if (!map[id]) return;
    map[id].unreadByUser = 0;
    write(map);
  },
  markReadByAdmin(id: string) {
    const map = read();
    if (!map[id]) return;
    map[id].unreadByAdmin = 0;
    write(map);
  },
};
