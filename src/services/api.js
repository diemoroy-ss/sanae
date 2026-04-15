// =========================================================
// API Service — Usa Firebase Firestore como BD principal
// Fallback a localStorage si Firestore no está disponible
// =========================================================

import { servicesDB, bookingsDB, scheduleDB, blocksDB, paymentsDB, usersDB } from './db.js';
import { getUser, getToken } from './auth.js';
import { CONFIG } from '../config.js';

// ---- Servicios ----
export const servicesAPI = {
  list:   ()     => servicesDB.list(),
  create: (data) => servicesDB.create(data),
  update: (data) => servicesDB.update(data),
  delete: (id)   => servicesDB.delete(id),
};

// ---- Reservas ----
export const bookingAPI = {
  // Reservas del usuario actual
  list: () => {
    const user = getUser();
    return bookingsDB.listByUser(user?.email);
  },
  // Todas las reservas (admin)
  all:     ()             => bookingsDB.listAll(),
  create:  (data)         => bookingsDB.create(data),
  confirm: (id)           => bookingsDB.updateStatus(id, 'confirmed'),
  reject:  (id, reason)   => bookingsDB.updateStatus(id, 'rejected', reason),
  cancel:  (id, refundData) => bookingsDB.cancel(id, refundData),
};

// ---- Horarios ----
export const scheduleAPI = {
  get:   ()     => scheduleDB.get(),
  set:   (data) => scheduleDB.set(data),
  slots: (date) => scheduleDB.slots(date),
};

// ---- Bloqueos ----
export const blocksAPI = {
  list:   ()     => blocksDB.list(),
  create: (data) => blocksDB.create(data),
  delete: (id)   => blocksDB.delete(id),
};

// ---- Pagos ----
export const paymentsAPI = {
  list:         ()              => paymentsDB.list(),
  getByBooking: (bookingId)    => paymentsDB.getByBooking(bookingId),
  create:       (data)         => paymentsDB.create(data),
  updateStatus: (id, st, mpData) => paymentsDB.updateStatus(id, st, mpData),
};

// ---- Usuarios (admin) ----
export const usersAPI = {
  list: () => usersDB.list(),
  save: (data) => usersDB.save(data),
};

// ---- Pagos (Mercado Pago — sigue via n8n) ----

async function mpRequest(path, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts = { method, headers };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${CONFIG.N8N_BASE}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Error de conexión' }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const paymentAPI = {
  create: (data) => mpRequest(CONFIG.WEBHOOK_PAYMENT_CREATE, 'POST', data),
  status: (id)   => mpRequest(`${CONFIG.WEBHOOK_PAYMENT_STATUS}?bookingId=${id}`),
};

// ---- Auth (registro/login con email) ----
export const authAPI = {
  register: async (data) => {
    // Guarda en Firestore y retorna sesión local
    try { await usersDB.save({ ...data, provider: 'email' }); } catch {}
    return { token: `local-${Date.now()}`, user: data };
  },
  login: async (data) => {
    // Auth por email se maneja via Firebase Auth en auth.js
    return { token: `local-${Date.now()}`, user: data };
  },
};
