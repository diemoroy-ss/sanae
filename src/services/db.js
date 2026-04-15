// =========================================================
// Firebase Firestore — Base de datos principal de Sanae
// =========================================================
// Colecciones: sanae_services, sanae_bookings, sanae_blocks,
//              sanae_users, sanae_config (schedule)
// =========================================================

import {
  getFirestore,
  collection, doc,
  getDocs, getDoc,
  addDoc, setDoc, updateDoc, deleteDoc,
  query, where, orderBy,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';

// Re-use existing app if already initialized
const firebaseConfig = {
  apiKey:            'AIzaSyAtH27RXBCmk7oGBe2-JdY-D1n41w2ySdU',
  authDomain:        'sanae-129fa.firebaseapp.com',
  projectId:         'sanae-129fa',
  storageBucket:     'sanae-129fa.firebasestorage.app',
  messagingSenderId: '285761701355',
  appId:             '1:285761701355:web:a332e74b794015e984c5ae',
  measurementId:     'G-RCJDSGW78W',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// ============================================================
// Helpers
// ============================================================
function snap2arr(snapshot) {
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}
function currentUserEmail() {
  return auth.currentUser?.email || null;
}

// ============================================================
// SERVICES
// ============================================================
const SVC = 'sanae_services';

export const servicesDB = {
  list: async () => {
    const snap = await getDocs(collection(db, SVC));
    return snap2arr(snap);
  },

  create: async (data) => {
    const { id, ...rest } = data;
    const docId = id || `svc-${Date.now()}`;
    await setDoc(doc(db, SVC, docId), { ...rest, updatedAt: new Date().toISOString() });
    return { id: docId, ...rest };
  },

  update: async (data) => {
    const { id, ...rest } = data;
    await setDoc(doc(db, SVC, id), { ...rest, updatedAt: new Date().toISOString() }, { merge: true });
    return data;
  },

  delete: async (id) => {
    await deleteDoc(doc(db, SVC, id));
  },
};

// ============================================================
// BOOKINGS
// ============================================================
const BOOK = 'sanae_bookings';

export const bookingsDB = {
  // All bookings (admin)
  listAll: async () => {
    const snap = await getDocs(query(collection(db, BOOK), orderBy('createdAt', 'desc')));
    return snap2arr(snap);
  },

  // User's own bookings
  listByUser: async (email) => {
    const e = email || currentUserEmail();
    if (!e) return [];
    const snap = await getDocs(query(
      collection(db, BOOK),
      where('userEmail', '==', e),
      orderBy('createdAt', 'desc')
    ));
    return snap2arr(snap);
  },

  create: async (data) => {
    const payload = { ...data, status: 'pending', createdAt: new Date().toISOString() };
    const ref = await addDoc(collection(db, BOOK), payload);
    return { id: ref.id, ...payload };
  },

  updateStatus: async (id, status, note = '') => {
    const upd = { status, updatedAt: new Date().toISOString() };
    if (note) upd.adminNote = note;
    await updateDoc(doc(db, BOOK, id), upd);
  },

  cancel: async (id, refundData = null) => {
    const upd = { status: 'cancelled', updatedAt: new Date().toISOString() };
    if (refundData) {
      upd.status = 'refund_requested';
      upd.refundData = refundData;
    }
    await updateDoc(doc(db, BOOK, id), upd);
  },
};

// ============================================================
// SCHEDULE
// ============================================================
const CFG = 'sanae_config';

export const scheduleDB = {
  get: async () => {
    const snap = await getDoc(doc(db, CFG, 'schedule'));
    return snap.exists() ? snap.data() : null;
  },
  set: async (data) => {
    await setDoc(doc(db, CFG, 'schedule'), { ...data, updatedAt: new Date().toISOString() });
  },

  // Available slots for a date (compute from schedule minus blocks)
  slots: async (dateStr) => {
    const schedule = await scheduleDB.get();
    const dow = new Date(dateStr + 'T12:00:00').getDay(); // 0=Sun
    if (!schedule) return ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00'];
    const dayConf = schedule[dow];
    if (!dayConf?.enabled) return [];

    // Build hourly slots between start and end
    const [startH] = (dayConf.start || '09:00').split(':').map(Number);
    const [endH]   = (dayConf.end   || '19:00').split(':').map(Number);
    const all = [];
    for (let h = startH; h < endH; h++) all.push(`${String(h).padStart(2,'0')}:00`);

    // Remove blocked slots
    const blocksSnap = await getDocs(query(collection(db, BLK), where('date', '==', dateStr)));
    const blocked = new Set();
    blocksSnap.docs.forEach(d => {
      const b = d.data();
      if (b.type === 'fullday') all.length = 0;
      if (b.type === 'slots' && b.hours) b.hours.forEach(h => blocked.add(h));
    });

    return all.filter(s => !blocked.has(s));
  },
};

// ============================================================
// BLOCKS
// ============================================================
const BLK = 'sanae_blocks';

export const blocksDB = {
  list: async () => {
    const snap = await getDocs(collection(db, BLK));
    return snap2arr(snap);
  },
  create: async (data) => {
    const { id, ...rest } = data;
    const docId = id || `blk-${Date.now()}`;
    await setDoc(doc(db, BLK, docId), { ...rest, createdAt: new Date().toISOString() });
    return { id: docId, ...rest };
  },
  delete: async (id) => {
    await deleteDoc(doc(db, BLK, id));
  },
};

// ============================================================
// PAYMENTS
// ============================================================
const PAY = 'sanae_payments';

export const paymentsDB = {
  list: async () => {
    const snap = await getDocs(query(collection(db, PAY), orderBy('createdAt', 'desc')));
    return snap2arr(snap);
  },

  getByBooking: async (bookingId) => {
    const snap = await getDocs(query(collection(db, PAY), where('bookingId', '==', bookingId)));
    return snap.empty ? null : { id: snap.docs[0].id, ...snap.docs[0].data() };
  },

  create: async (data) => {
    const payload = {
      ...data,
      status:    data.status    || 'pending',
      createdAt: new Date().toISOString(),
    };
    const ref = await addDoc(collection(db, PAY), payload);
    return { id: ref.id, ...payload };
  },

  updateStatus: async (id, status, mpData = {}) => {
    await updateDoc(doc(db, PAY, id), {
      status,
      updatedAt: new Date().toISOString(),
      ...mpData,
    });
  },
};

// ============================================================
// USERS
// ============================================================
const USR = 'sanae_users';

export const usersDB = {
  save: async (userData) => {
    const { email } = userData;
    if (!email) return;
    await setDoc(doc(db, USR, email), {
      ...userData,
      lastSeen: new Date().toISOString(),
    }, { merge: true });
  },

  list: async () => {
    const snap = await getDocs(collection(db, USR));
    return snap2arr(snap);
  },
};
