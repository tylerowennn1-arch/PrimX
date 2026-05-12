// Firebase-ready admin management module for PrimXCapital.
import { db, serverTimestamp } from "./firebase-config.js";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export function watchUsers(callback) {
  return onSnapshot(query(collection(db, "users"), orderBy("createdAt", "desc")), (snap) => {
    callback(snap.docs.map((item) => ({ id: item.id, ...item.data() })));
  });
}

export function watchTransactions(type, status, callback) {
  const constraints = [orderBy("createdAt", "desc")];
  if (type) constraints.unshift(where("type", "==", type));
  if (status) constraints.unshift(where("status", "==", status));
  return onSnapshot(query(collection(db, "transactions"), ...constraints), (snap) => {
    callback(snap.docs.map((item) => ({ id: item.id, ...item.data() })));
  });
}

export async function approveTransaction(transaction) {
  await updateDoc(doc(db, "transactions", transaction.id), {
    status: "approved",
    reviewedAt: serverTimestamp(),
  });
  const direction = transaction.type === "deposit" ? 1 : -1;
  await updateDoc(doc(db, "users", transaction.userId), {
    balance: increment(direction * Number(transaction.amount)),
    [transaction.type === "deposit" ? "totalDeposits" : "totalWithdrawals"]: increment(
      Number(transaction.amount),
    ),
  });
}

export function rejectTransaction(id) {
  return updateDoc(doc(db, "transactions", id), {
    status: "rejected",
    reviewedAt: serverTimestamp(),
  });
}

export function suspendUser(userId) {
  return updateDoc(doc(db, "users", userId), { status: "suspended" });
}

export function activateUser(userId) {
  return updateDoc(doc(db, "users", userId), { status: "active" });
}

export function adjustUserBalance(userId, amount) {
  return updateDoc(doc(db, "users", userId), { balance: increment(Number(amount)) });
}

export function adjustUserInterest(userId, amount) {
  return updateDoc(doc(db, "users", userId), { interestBalance: increment(Number(amount)) });
}

export function updateInvestmentGoal(userId, investmentGoal) {
  return updateDoc(doc(db, "users", userId), { investmentGoal });
}

export function deleteUserRecord(userId) {
  return deleteDoc(doc(db, "users", userId));
}

export async function loadAdminAnalytics() {
  const [users, deposits, withdrawals, pending] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(
      query(
        collection(db, "transactions"),
        where("type", "==", "deposit"),
        where("status", "==", "approved"),
      ),
    ),
    getDocs(
      query(
        collection(db, "transactions"),
        where("type", "==", "withdrawal"),
        where("status", "==", "approved"),
      ),
    ),
    getDocs(query(collection(db, "transactions"), where("status", "==", "pending"))),
  ]);
  return {
    users: users.size,
    deposits: deposits.size,
    withdrawals: withdrawals.size,
    pending: pending.size,
  };
}
