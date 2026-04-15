// =========================================================
// Auth Service — JWT management en localStorage
// =========================================================

import { CONFIG } from '../config.js';

const TOKEN_KEY = 'sanae_token';
const USER_KEY  = 'sanae_user';

export function setAuth(token, user) {
  // Si el email está en la lista de admins, forzar role=admin
  // independiente de lo que responda el backend
  if (user?.email && CONFIG.ADMIN_EMAILS.includes(user.email)) {
    user = { ...user, role: 'admin' };
  }
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch { return null; }
}

export function isLoggedIn() {
  return !!getToken();
}

export function isAdmin() {
  const user = getUser();
  // Doble verificación: por rol guardado O por email en lista de admins
  return user?.role === 'admin' || CONFIG.ADMIN_EMAILS.includes(user?.email);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
