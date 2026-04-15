// =========================================================
// Firebase Service — Auth + Firestore
// =========================================================

import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { CONFIG } from '../config.js';

// ---- Firebase Config (proyecto: sanae-129fa) ----
const firebaseConfig = {
  apiKey:            'AIzaSyAtH27RXBCmk7oGBe2-JdY-D1n41w2ySdU',
  authDomain:        'sanae-129fa.firebaseapp.com',
  projectId:         'sanae-129fa',
  storageBucket:     'sanae-129fa.firebasestorage.app',
  messagingSenderId: '285761701355',
  appId:             '1:285761701355:web:a332e74b794015e984c5ae',
  measurementId:     'G-RCJDSGW78W',
};

// ---- Initialize Firebase (singleton) ----
export const firebaseApp  = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth         = getAuth(firebaseApp);
export const db           = getFirestore(firebaseApp);   // Firestore DB
export const analytics    = getAnalytics(firebaseApp);   // Google Analytics

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });


// =========================================================
// Google Sign-In — guarda usuario en Firestore
// =========================================================
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user   = result.user;

  const userData = {
    id:        user.uid,
    name:      user.displayName?.split(' ')[0] || '',
    lastname:  user.displayName?.split(' ').slice(1).join(' ') || '',
    email:     user.email,
    phone:     user.phoneNumber || '',
    avatar:    user.photoURL || '',
    role:      CONFIG.ADMIN_EMAILS.includes(user.email) ? 'admin' : 'user',
    provider:  'google',
  };

  // Firebase ID token (used as session token)
  const token = await user.getIdToken();

  // Guardar en Firestore (fire-and-forget)
  saveUserToFirestore(userData).catch(console.warn);

  return { token, user: userData };
}

// Guarda/actualiza el usuario en Firestore
async function saveUserToFirestore(userData) {
  try {
    const { usersDB } = await import('./db.js');
    await usersDB.save(userData);
  } catch (e) {
    console.warn('[Firestore] No se pudo guardar usuario:', e.message);
  }
}

// =========================================================
// Sign Out
// =========================================================
export async function googleSignOut() {
  await firebaseSignOut(auth);
}

// =========================================================
// Auth State Observer
// =========================================================
export function onGoogleAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
