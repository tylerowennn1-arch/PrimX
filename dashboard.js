// Firebase-ready dashboard module for PrimXCapital users.
import { db, serverTimestamp } from "./firebase-config.js";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export function watchUserTransactions(userId, callback) {
  return onSnapshot(
    query(collection(db, "transactions"), where("userId", "==", userId), orderBy("createdAt", "desc")),
    (snap) => callback(snap.docs.map((item) => ({ id: item.id, ...item.data() }))),
  );
}

export function watchUserDeposits(userId, callback) {
  return onSnapshot(
    query(collection(db, "transactions"), where("userId", "==", userId), where("type", "==", "deposit"), orderBy("createdAt", "desc")),
    (snap) => callback(snap.docs.map((item) => ({ id: item.id, ...item.data() }))),
  );
}

export function watchUserWithdrawals(userId, callback) {
  return onSnapshot(
    query(collection(db, "transactions"), where("userId", "==", userId), where("type", "==", "withdrawal"), orderBy("createdAt", "desc")),
    (snap) => callback(snap.docs.map((item) => ({ id: item.id, ...item.data() }))),
  );
}

export function createDeposit({ userId, userEmail, amount, method, transactionHash }) {
  return addDoc(collection(db, "transactions"), {
    userId,
    userEmail,
    type: "deposit",
    amount: Number(amount),
    method,
    reference: transactionHash,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

export function createWithdrawal({ userId, userEmail, amount, method, walletAddress }) {
  return addDoc(collection(db, "transactions"), {
    userId,
    userEmail,
    type: "withdrawal",
    amount: Number(amount),
    method,
    reference: walletAddress,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}
