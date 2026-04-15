// =========================================================
// AUTH VIEW — Login & Registro
// =========================================================

import { authAPI } from '../services/api.js';
import { setAuth } from '../services/auth.js';
import { showToast } from '../utils/helpers.js';
import { router } from '../main.js';
import { signInWithGoogle } from '../services/firebase.js';

export function renderAuth(mode = 'login') {
  const isLogin = mode === 'login';
  return `
  <div class="auth-page">
    <div class="auth-left">
      <div class="auth-left-content">
        <a href="#" data-route="landing" class="auth-back">
          <i class="fas fa-arrow-left"></i> Volver al inicio
        </a>
        <img src="/Logo.jpeg" alt="Sanae" class="auth-logo">
        <h2>Sanae<br><span class="text-gold">Salud y Belleza</span></h2>
        <p>La atención que mereces, en la comodidad de tu hogar.</p>
        <ul class="auth-perks">
          <li><i class="fas fa-check-circle"></i> Agenda en minutos</li>
          <li><i class="fas fa-check-circle"></i> Pago seguro online</li>
          <li><i class="fas fa-check-circle"></i> Confirmación por WhatsApp</li>
          <li><i class="fas fa-check-circle"></i> 15 años de experiencia</li>
        </ul>
      </div>
    </div>
    <div class="auth-right">
      <div class="auth-card">
        <div class="auth-tabs">
          <button class="auth-tab ${isLogin ? 'active' : ''}" data-route="login">Iniciar Sesión</button>
          <button class="auth-tab ${!isLogin ? 'active' : ''}" data-route="register">Registrarse</button>
        </div>

        ${isLogin ? renderLoginForm() : renderRegisterForm()}
      </div>
    </div>
  </div>
  `;
}

function renderLoginForm() {
  return `
  <form class="auth-form" id="login-form">
    <h2 class="auth-title">Bienvenido de vuelta 👋</h2>
    <p class="auth-subtitle">Ingresa tus datos para acceder a tu cuenta.</p>

    <!-- Google Sign-In -->
    <button type="button" class="btn-google" id="google-login-btn">
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20">
      Continuar con Google
    </button>

    <div class="auth-divider"><span>o ingresa con tu email</span></div>
    
    <div class="form-group">
      <label class="form-label">Email</label>
      <div class="input-icon-wrap">
        <i class="fas fa-envelope"></i>
        <input type="email" class="form-control" id="login-email" placeholder="tu@email.com">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Contraseña</label>
      <div class="input-icon-wrap">
        <i class="fas fa-lock"></i>
        <input type="password" class="form-control" id="login-password" placeholder="••••••••">
        <button type="button" class="toggle-password" data-target="login-password">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </div>

    <button type="submit" class="btn btn-primary btn-lg" style="width:100%" id="login-btn">
      <i class="fas fa-sign-in-alt"></i> Ingresar con Email
    </button>

    <p class="auth-footer-text">
      ¿No tienes cuenta? <a href="#" data-route="register" class="text-gold font-bold">Regístrate gratis</a>
    </p>
    <div id="auth-error" class="auth-error-msg" style="display:none"></div>
  </form>
  `;
}

function renderRegisterForm() {
  return `
  <form class="auth-form" id="register-form">
    <h2 class="auth-title">Crear cuenta gratuita ✨</h2>
    <p class="auth-subtitle">Regístrate y comienza a agendar hoy mismo.</p>

    <!-- Google Sign-In -->
    <button type="button" class="btn-google" id="google-register-btn">
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20">
      Registrarse con Google
    </button>

    <div class="auth-divider"><span>o crea una cuenta con email</span></div>
    
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Nombre</label>
        <div class="input-icon-wrap">
          <i class="fas fa-user"></i>
          <input type="text" class="form-control" id="reg-name" placeholder="Tu nombre">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Apellido</label>
        <input type="text" class="form-control" id="reg-lastname" placeholder="Tu apellido">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Email</label>
      <div class="input-icon-wrap">
        <i class="fas fa-envelope"></i>
        <input type="email" class="form-control" id="reg-email" placeholder="tu@email.com">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">WhatsApp / Teléfono</label>
      <div class="input-icon-wrap">
        <i class="fab fa-whatsapp"></i>
        <input type="tel" class="form-control" id="reg-phone" placeholder="+56 9 1234 5678">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Contraseña</label>
      <div class="input-icon-wrap">
        <i class="fas fa-lock"></i>
        <input type="password" class="form-control" id="reg-password" placeholder="Mínimo 6 caracteres" minlength="6">
        <button type="button" class="toggle-password" data-target="reg-password">
          <i class="fas fa-eye"></i>
        </button>
      </div>
    </div>

    <button type="submit" class="btn btn-gold btn-lg" style="width:100%" id="register-btn">
      <i class="fas fa-user-plus"></i> Crear cuenta con Email
    </button>

    <p class="auth-footer-text">
      ¿Ya tienes cuenta? <a href="#" data-route="login" class="text-primary font-bold">Iniciar sesión</a>
    </p>
    <div id="auth-error" class="auth-error-msg" style="display:none"></div>
  </form>
  `;
}

// Shared Google Sign-In handler
async function handleGoogleSignIn(btnId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px"></span> Conectando con Google...';
  btn.disabled = true;
  btn.style.opacity = '0.8';
  try {
    const { token, user } = await signInWithGoogle();
    setAuth(token, user);
    showToast(`¡Bienvenida, ${user.name}! ✨`, 'success');
    router.navigate(user.role === 'admin' ? 'admin' : 'dashboard');
  } catch (err) {
    const code = err.code || '';
    let msg = 'Error al iniciar sesión con Google.';
    if (code === 'auth/popup-closed-by-user')  msg = 'Ventana cerrada. Intenta nuevamente.';
    if (code === 'auth/popup-blocked')         msg = 'El navegador bloqueó el popup. Permite popups para este sitio.';
    if (code === 'auth/invalid-api-key')       msg = 'Firebase no configurado aún. Usa email/contraseña por ahora.';
    const errDiv = document.getElementById('auth-error');
    if (errDiv) { errDiv.textContent = msg; errDiv.style.display = 'block'; }
    else showToast(msg, 'error');
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    btn.style.opacity = '1';
  }
}

export function initAuthScripts(mode) {
  // Google buttons
  const googleBtn = document.getElementById('google-login-btn') || document.getElementById('google-register-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => handleGoogleSignIn(googleBtn.id));
  }

  // Password toggle
  document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      const icon  = btn.querySelector('i');
      if (input.type === 'password') { input.type = 'text'; icon.className = 'fas fa-eye-slash'; }
      else                           { input.type = 'password'; icon.className = 'fas fa-eye'; }
    });
  });

  // Login form
  if (mode === 'login') {
    document.getElementById('login-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('login-btn');
      btn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px"></span> Ingresando...';
      btn.disabled = true;
      try {
        const data = await authAPI.login({
          email:    document.getElementById('login-email').value,
          password: document.getElementById('login-password').value,
        });
        setAuth(data.token, data.user);
        showToast(`Bienvenido, ${data.user.name}!`, 'success');
        router.navigate(data.user.role === 'admin' ? 'admin' : 'dashboard');
      } catch (err) {
        const errDiv = document.getElementById('auth-error');
        errDiv.textContent = err.message || 'Email o contraseña incorrectos.';
        errDiv.style.display = 'block';
        btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Ingresar';
        btn.disabled = false;
      }
    });
  }

  // Register form
  if (mode === 'register') {
    document.getElementById('register-form')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = document.getElementById('register-btn');
      btn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px"></span> Creando cuenta...';
      btn.disabled = true;
      try {
        const data = await authAPI.register({
          name:     document.getElementById('reg-name').value,
          lastname: document.getElementById('reg-lastname').value,
          email:    document.getElementById('reg-email').value,
          phone:    document.getElementById('reg-phone').value,
          password: document.getElementById('reg-password').value,
          role:     'user',
        });
        setAuth(data.token, data.user);
        showToast('¡Cuenta creada! Bienvenida a Sanae 🎉', 'success');
        router.navigate('dashboard');
      } catch (err) {
        const errDiv = document.getElementById('auth-error');
        errDiv.textContent = err.message || 'Error al crear la cuenta.';
        errDiv.style.display = 'block';
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Crear cuenta';
        btn.disabled = false;
      }
    });
  }
}
