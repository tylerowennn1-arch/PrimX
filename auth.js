// Firebase-ready user authentication for PrimXCapital.
import { auth, db, serverTimestamp } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export function watchSession(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) return callback(null, null);
    const snap = await getDoc(doc(db, "users", user.uid));
    callback(user, snap.exists() ? snap.data() : null);
  });
}

export async function registerUser({ fullName, email, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", credential.user.uid), {
    uid: credential.user.uid,
    fullName,
    email,
    role: "user",
    status: "active",
    tier: "None",
    balance: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    withdrawalFee: 0,
    taxCharge: 0,
    createdAt: serverTimestamp(),
  });
  await sendEmailVerification(credential.user);
  return credential.user;
}

export async function loginUser(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  if (!credential.user.emailVerified) throw new Error("Please verify your email before login.");
  const snap = await getDoc(doc(db, "users", credential.user.uid));
  if (snap.exists() && snap.data().status === "suspended") throw new Error("Account suspended.");
  return credential.user;
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export function logoutUser() {
  return signOut(auth);
}
