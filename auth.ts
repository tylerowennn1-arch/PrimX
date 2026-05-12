// Lightweight localStorage-backed "auth" + data layer.
// Frontend-only mock prepared for swapping in Firebase later.

export type User = {
  id: string;
  fullName: string;
  email: string;
  password: string; // mock only
  emailVerified: boolean;
  emailVerificationCode?: string;
  passwordResetCode?: string;
  tier: "Starter" | "Basic" | "Standard" | "Premium" | "None";
  balance: number;
  interestBalance: number;
  totalInvested: number;
  investmentGoal: string;
  totalDeposits: number;
  totalWithdrawals: number;
  withdrawalFee: number;
  taxCharge: number;
  accountStatus: "active" | "suspended";
  role: "user" | "admin";
  createdAt: string;
};

export type Transaction = {
  id: string;
  userEmail: string;
  type: "deposit" | "withdrawal";
  amount: number;
  method: string;
  reference: string;
  status: "pending" | "approved" | "rejected";
  date: string;
};

const USERS_KEY = "px_users";
const SESSION_KEY = "px_session";
const TX_KEY = "px_txs";
const DATA_EVENT = "px-data-change";

function read<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    return JSON.parse(localStorage.getItem(k) || "") as T;
  } catch {
    return fallback;
  }
}
function write<T>(k: string, v: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(k, JSON.stringify(v));
  window.dispatchEvent(new CustomEvent(DATA_EVENT, { detail: k }));
}

function code() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function seed() {
  if (typeof window === "undefined") return;
  const ADMIN_EMAIL = "tylerowennn1@gmail.com";
  const ADMIN_PASSWORD = "Password";
  const adminSeed: User = {
    id: "admin-1",
    fullName: "Platform Admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    emailVerified: true,
    tier: "Premium",
    balance: 0,
    interestBalance: 0,
    totalInvested: 0,
    investmentGoal: "Platform management",
    totalDeposits: 0,
    totalWithdrawals: 0,
    withdrawalFee: 0,
    taxCharge: 0,
    accountStatus: "active",
    role: "admin",
    createdAt: new Date().toISOString(),
  };
  if (!localStorage.getItem(USERS_KEY)) {
    write(USERS_KEY, [adminSeed]);
  } else {
    const users = read<User[]>(USERS_KEY, []);
    let changed = false;
    let upgraded = users.map((u) => {
      const next = { ...u };
      if (
        u.withdrawalFee === undefined ||
        u.taxCharge === undefined ||
        u.accountStatus === undefined ||
        u.emailVerified === undefined ||
        u.interestBalance === undefined ||
        u.totalInvested === undefined ||
        u.investmentGoal === undefined
      )
        changed = true;
      next.withdrawalFee = u.withdrawalFee ?? 0;
      next.taxCharge = u.taxCharge ?? 0;
      next.accountStatus = u.accountStatus ?? "active";
      next.emailVerified = u.emailVerified ?? u.role === "admin";
      next.interestBalance = u.interestBalance ?? 0;
      next.totalInvested = u.totalInvested ?? 0;
      next.investmentGoal =
        u.investmentGoal ??
        (u.role === "admin" ? "Platform management" : "Cryptocurrency portfolio growth");
      if (
        u.role === "user" &&
        (u.balance ?? 0) === 0 &&
        (u.totalDeposits ?? 0) === 0 &&
        (u.totalWithdrawals ?? 0) === 0
      )
        next.balance = 10;
      return next;
    });
    // Ensure exactly one admin with the requested credentials
    const adminIdx = upgraded.findIndex((u) => u.role === "admin");
    if (adminIdx < 0) {
      upgraded.push(adminSeed);
      changed = true;
    } else if (
      upgraded[adminIdx].email !== ADMIN_EMAIL ||
      upgraded[adminIdx].password !== ADMIN_PASSWORD
    ) {
      upgraded[adminIdx] = {
        ...upgraded[adminIdx],
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        emailVerified: true,
        accountStatus: "active",
      };
      changed = true;
    }
    // Drop legacy admin emails
    upgraded = upgraded.filter(
      (u, i) =>
        !(u.role === "admin" && i !== upgraded.findIndex((x) => x.role === "admin")) &&
        !(u.role !== "admin" && u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()),
    );
    if (changed) write(USERS_KEY, upgraded);
  }
  if (!localStorage.getItem(TX_KEY)) write(TX_KEY, []);
}

export const auth = {
  init: seed,
  current(): User | null {
    seed();
    const id = read<string | null>(SESSION_KEY, null);
    if (!id) return null;
    return read<User[]>(USERS_KEY, []).find((u) => u.id === id) ?? null;
  },
  register(data: { fullName: string; email: string; password: string; investmentGoal?: string }): {
    ok: boolean;
    error?: string;
  } {
    seed();
    const users = read<User[]>(USERS_KEY, []);
    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase()))
      return { ok: false, error: "Email already registered" };
    const verification = code();
    const u: User = {
      id: crypto.randomUUID(),
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      emailVerified: false,
      emailVerificationCode: verification,
      tier: "None",
      balance: 10,
      interestBalance: 0,
      totalInvested: 0,
      investmentGoal: data.investmentGoal || "Cryptocurrency portfolio growth",
      totalDeposits: 0,
      totalWithdrawals: 0,
      withdrawalFee: 0,
      taxCharge: 0,
      accountStatus: "active",
      role: "user",
      createdAt: new Date().toISOString(),
    };
    users.push(u);
    write(USERS_KEY, users);
    write(SESSION_KEY, u.id);
    return { ok: true };
  },
  login(email: string, password: string): { ok: boolean; error?: string } {
    seed();
    const users = read<User[]>(USERS_KEY, []);
    const matches = users.filter(
      (x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password,
    );
    const u = matches.find((x) => x.role === "admin") ?? matches[0];
    if (!u) return { ok: false, error: "Invalid email or password" };
    write(SESSION_KEY, u.id);
    return { ok: true };
  },
  verifyEmail(input: string): { ok: boolean; error?: string } {
    const u = auth.current();
    if (!u) return { ok: false, error: "No active session" };
    if (u.emailVerified) return { ok: true };
    if (u.emailVerificationCode !== input.trim())
      return { ok: false, error: "Invalid verification code" };
    auth.updateCurrent({ emailVerified: true, emailVerificationCode: undefined });
    return { ok: true };
  },
  resendVerification(): string | null {
    const u = auth.current();
    if (!u) return null;
    const next = code();
    auth.updateCurrent({ emailVerificationCode: next });
    return next;
  },
  requestPasswordReset(email: string): { ok: boolean; code?: string; error?: string } {
    seed();
    const users = read<User[]>(USERS_KEY, []);
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (idx < 0) return { ok: false, error: "No account found for that email" };
    const reset = code();
    users[idx] = { ...users[idx], passwordResetCode: reset };
    write(USERS_KEY, users);
    return { ok: true, code: reset };
  },
  resetPassword(
    email: string,
    resetCode: string,
    password: string,
  ): { ok: boolean; error?: string } {
    const users = read<User[]>(USERS_KEY, []);
    const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
    if (idx < 0 || users[idx].passwordResetCode !== resetCode.trim())
      return { ok: false, error: "Invalid reset code" };
    if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters" };
    users[idx] = { ...users[idx], password, passwordResetCode: undefined };
    write(USERS_KEY, users);
    return { ok: true };
  },
  logout() {
    if (typeof window !== "undefined") localStorage.removeItem(SESSION_KEY);
  },
  updateCurrent(patch: Partial<User>) {
    const u = auth.current();
    if (!u) return;
    const users = read<User[]>(USERS_KEY, []);
    const idx = users.findIndex((x) => x.id === u.id);
    users[idx] = { ...users[idx], ...patch };
    write(USERS_KEY, users);
  },
};

export const data = {
  subscribe(fn: () => void) {
    if (typeof window === "undefined") return () => undefined;
    window.addEventListener(DATA_EVENT, fn);
    window.addEventListener("storage", fn);
    return () => {
      window.removeEventListener(DATA_EVENT, fn);
      window.removeEventListener("storage", fn);
    };
  },
  allUsers: () => read<User[]>(USERS_KEY, []),
  allTx: () => read<Transaction[]>(TX_KEY, []),
  txForUser: (email: string) =>
    read<Transaction[]>(TX_KEY, []).filter((t) => t.userEmail === email),
  updateUser(id: string, patch: Partial<User>) {
    const users = read<User[]>(USERS_KEY, []);
    const idx = users.findIndex((u) => u.id === id);
    if (idx < 0) return;
    users[idx] = { ...users[idx], ...patch };
    write(USERS_KEY, users);
  },
  addTx(tx: Omit<Transaction, "id" | "date" | "status">) {
    const txs = read<Transaction[]>(TX_KEY, []);
    const next: Transaction = {
      ...tx,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      status: "pending",
    };
    txs.unshift(next);
    write(TX_KEY, txs);
    return next;
  },
  setTxStatus(id: string, status: Transaction["status"]) {
    const txs = read<Transaction[]>(TX_KEY, []);
    const tx = txs.find((t) => t.id === id);
    if (!tx) return;
    const prev = tx.status;
    tx.status = status;
    write(TX_KEY, txs);
    // Reflect on user balance when newly approved
    if (status === "approved" && prev !== "approved") {
      const users = read<User[]>(USERS_KEY, []);
      const u = users.find((x) => x.email === tx.userEmail);
      if (u) {
        if (tx.type === "deposit") {
          u.balance += tx.amount;
          u.totalDeposits += tx.amount;
          u.totalInvested = (u.totalInvested ?? 0) + tx.amount;
        } else {
          u.balance = Math.max(0, u.balance - tx.amount);
          u.totalWithdrawals += tx.amount;
        }
        write(USERS_KEY, users);
      }
    }
  },
  deleteTx(id: string) {
    write(
      TX_KEY,
      read<Transaction[]>(TX_KEY, []).filter((t) => t.id !== id),
    );
  },
  deleteUser(id: string) {
    const users = read<User[]>(USERS_KEY, []);
    const user = users.find((u) => u.id === id);
    if (!user || user.role === "admin") return;
    write(
      USERS_KEY,
      users.filter((u) => u.id !== id),
    );
    write(
      TX_KEY,
      read<Transaction[]>(TX_KEY, []).filter((t) => t.userEmail !== user.email),
    );
  },
  adjustBalance(id: string, amount: number) {
    const users = read<User[]>(USERS_KEY, []);
    const user = users.find((u) => u.id === id);
    if (!user) return;
    user.balance = Math.max(0, user.balance + amount);
    if (amount > 0) user.totalDeposits += amount;
    else user.totalWithdrawals += Math.abs(amount);
    write(USERS_KEY, users);
  },
  adjustInterest(id: string, amount: number) {
    const users = read<User[]>(USERS_KEY, []);
    const user = users.find((u) => u.id === id);
    if (!user) return;
    user.interestBalance = Math.max(0, (user.interestBalance ?? 0) + amount);
    write(USERS_KEY, users);
  },
};
