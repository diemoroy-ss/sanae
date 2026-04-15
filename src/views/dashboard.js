// =========================================================
// USER DASHBOARD VIEW
// =========================================================

import { bookingAPI, servicesAPI, paymentsAPI, usersAPI } from '../services/api.js';
import { getUser, logout } from '../services/auth.js';
import { showToast, formatDate, formatTime, statusBadge, createModal, closeModal } from '../utils/helpers.js';
import { router } from '../main.js';

export function renderDashboard() {
  const user = getUser();
  return `
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar" id="user-sidebar">
      <div class="sidebar-header">
        <img src="/Logo.jpeg" alt="Sanae" class="sidebar-logo">
        <div class="sidebar-brand">
          <span class="sidebar-brand-name">Sanae</span>
          <span class="sidebar-brand-role">Portal Paciente</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <a class="sidebar-link active" data-panel="home">
          <i class="fas fa-home"></i> Mi Panel
        </a>
        <a class="sidebar-link" data-panel="new-booking">
          <i class="fas fa-calendar-plus"></i> Nueva Reserva
        </a>
        <a class="sidebar-link" data-panel="my-bookings">
          <i class="fas fa-calendar-check"></i> Mis Citas
        </a>
        <a class="sidebar-link" data-panel="profile">
          <i class="fas fa-user-circle"></i> Mi Perfil
        </a>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-avatar">${user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div>
            <div class="sidebar-user-name">${user?.name || 'Usuario'} ${user?.lastname || ''}</div>
            <div class="sidebar-user-email">${user?.email || ''}</div>
          </div>
        </div>
        <button class="sidebar-logout" id="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Salir
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="app-main">
      <header class="app-topbar">
        <button class="topbar-toggle hide-desktop" id="sidebar-toggle">
          <i class="fas fa-bars"></i>
        </button>
        <div class="topbar-title" id="topbar-title">Mi Panel</div>
        <div class="topbar-actions">
          <a href="https://wa.me/56972715562" target="_blank" class="btn btn-whatsapp btn-sm">
            <i class="fab fa-whatsapp"></i> <span class="hide-mobile">Consultar</span>
          </a>
        </div>
      </header>
      <div class="app-content" id="dashboard-content">
        <!-- Content injected dynamically -->
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    </main>
  </div>
  `;
}

// ---- Panel Sections ----
async function loadHome() {
  const user = getUser();
  const content = document.getElementById('dashboard-content');
  content.innerHTML = `<div class="loading-container"><div class="spinner"></div></div>`;
  
  let bookings = [];
  try { bookings = await bookingAPI.list(); } catch {}
  
  const upcoming = bookings.filter(b => ['pending','confirmed'].includes(b.status)).slice(0, 3);
  
  content.innerHTML = `
  <div class="animate-slide-up">
    <div class="dashboard-welcome">
      <div>
        <h2>¡Hola, ${user?.name || 'bienvenida'}! 👋</h2>
        <p>Aquí puedes gestionar tus citas y servicios con Sanae.</p>
      </div>
      <button class="btn btn-gold" data-panel="new-booking">
        <i class="fas fa-plus"></i> Nueva Reserva
      </button>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#e3edfd; color:#1a56db"><i class="fas fa-calendar-check"></i></div>
        <div>
          <div class="stat-card-num">${bookings.filter(b=>b.status==='confirmed').length}</div>
          <div class="stat-card-label">Citas Confirmadas</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#fef9c3; color:#854d0e"><i class="fas fa-clock"></i></div>
        <div>
          <div class="stat-card-num">${bookings.filter(b=>b.status==='pending').length}</div>
          <div class="stat-card-label">Pendientes</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#dcfce7; color:#166534"><i class="fas fa-check-double"></i></div>
        <div>
          <div class="stat-card-num">${bookings.filter(b=>b.status==='completed').length}</div>
          <div class="stat-card-label">Completadas</div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:30px;">
      <div class="card-header">
        <i class="fas fa-calendar-alt" style="color:var(--primary)"></i> Próximas Citas
      </div>
      <div class="card-body">
        ${upcoming.length > 0 ? upcoming.map(renderBookingRow).join('') : `
          <div class="empty-state">
            <i class="fas fa-calendar-plus empty-icon"></i>
            <h3>Sin citas próximas</h3>
            <p>Agenda tu primer sesión de bienestar hoy mismo.</p>
            <button class="btn btn-gold" data-panel="new-booking">
              <i class="fas fa-plus"></i> Reservar ahora
            </button>
          </div>
        `}
      </div>
      ${upcoming.length > 0 ? `<div class="card-footer"><a href="#" data-panel="my-bookings" class="text-primary font-bold">Ver todas mis citas →</a></div>` : ''}
    </div>
  </div>
  `;
  
  bindPanelLinks(content);
}

async function loadMyBookings() {
  const content = document.getElementById('dashboard-content');
  content.innerHTML = `<div class="loading-container"><div class="spinner"></div></div>`;
  
  let bookings = [];
  try { bookings = await bookingAPI.list(); } catch {}
  
  content.innerHTML = `
  <div class="animate-slide-up">
    <h2 style="margin-bottom:24px;"><i class="fas fa-calendar-check" style="color:var(--primary)"></i> Mis Citas</h2>
    ${bookings.length === 0 ? `
      <div class="empty-state card card-body">
        <i class="fas fa-calendar empty-icon"></i>
        <h3>Sin citas registradas</h3>
        <p>Aún no tienes citas. ¡Agenda la primera ahora!</p>
        <button class="btn btn-gold" data-panel="new-booking"><i class="fas fa-plus"></i> Reservar</button>
      </div>
    ` : `
      <div class="card">
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr>
              <th>Servicio</th><th>Fecha</th><th>Hora</th><th>Estado</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              ${bookings.map(b => `
              <tr>
                <td><strong>${b.serviceName || b.service}</strong></td>
                <td>${formatDate(b.date)}</td>
                <td>${formatTime(b.time)}</td>
                <td>${statusBadge(b.status)}</td>
                <td>
                  ${['pending', 'confirmed', 'paid'].includes(b.status) ? `<button class="btn btn-sm btn-danger" data-cancel-id="${b.id}" data-status="${b.status}"><i class="fas fa-times"></i> Cancelar</button>` : ''}
                </td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `}
  </div>
  `;
  
  // Cancel buttons
  document.querySelectorAll('[data-cancel-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const bId = btn.dataset.cancelId;
      
      const body = `
        <p style="margin-bottom:16px; font-size:var(--text-sm); color:var(--text-secondary);">
          Si realizaste el pago y deseas solicitar la devolución enviándonos tus datos bancarios, completa este formulario. Si no has pagado, simplemente haz clic en "Solo anular".
        </p>
        <div class="form-group">
          <label class="form-label">Nombre Completo Titular</label>
          <input type="text" id="refund-name" class="form-control" placeholder="Ej: Maria Perez">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">RUT</label>
            <input type="text" id="refund-rut" class="form-control" placeholder="Ej: 12.345.678-9">
          </div>
          <div class="form-group">
            <label class="form-label">Banco</label>
            <select id="refund-bank" class="form-control">
              <option value="">Selecciona tu banco...</option>
              <option value="BancoEstado">BancoEstado</option>
              <option value="Banco de Chile">Banco de Chile</option>
              <option value="Santander">Santander</option>
              <option value="BCI">BCI</option>
              <option value="Itaú">Itaú</option>
              <option value="Scotiabank">Scotiabank</option>
              <option value="Falabella">Banco Falabella</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Tipo de Cuenta</label>
            <select id="refund-acc-type" class="form-control">
              <option value="Cuenta RUT">Cuenta RUT</option>
              <option value="Cuenta Corriente">Cuenta Corriente</option>
              <option value="Cuenta Vista">Cuenta Vista</option>
              <option value="Cuenta de Ahorro">Cuenta de Ahorro</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Número de Cuenta</label>
            <input type="number" id="refund-acc-num" class="form-control">
          </div>
        </div>
      `;

      const footer = `
        <button class="btn btn-outline-blue" id="cancel-no-refund">Solo anular</button>
        <button class="btn btn-danger" id="cancel-with-refund">Solicitar devolución</button>
      `;

      createModal('Cancelar Cita y Devolución', body, footer);

      document.getElementById('cancel-no-refund').onclick = async () => {
        try {
          await bookingAPI.cancel(bId);
          showToast('Cita cancelada correctamente.', 'success');
          closeModal();
          loadMyBookings();
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      };

      document.getElementById('cancel-with-refund').onclick = async () => {
        const name = document.getElementById('refund-name').value;
        const rut  = document.getElementById('refund-rut').value;
        const bank = document.getElementById('refund-bank').value;
        const type = document.getElementById('refund-acc-type').value;
        const num  = document.getElementById('refund-acc-num').value;

        if (!name || !rut || !bank || !num) {
          return showToast('Completa todos los datos bancarios.', 'error');
        }

        try {
          await bookingAPI.cancel(bId, { name, rut, bank, type, num });
          showToast('Cita cancelada y devolución solicitada.', 'success');
          closeModal();
          loadMyBookings();
        } catch (e) { showToast('Error: ' + e.message, 'error'); }
      };
    });
  });
  
  bindPanelLinks(content);
}

async function loadNewBooking() {
  const content = document.getElementById('dashboard-content');
  content.innerHTML = `<div class="loading-container"><div class="spinner"></div></div>`;

  // Try API first, fall back to localStorage (same source as admin panel)
  let services = [];
  try {
    const all = await servicesAPI.list();
    services = (all || []).filter(s => s.active !== false);
    if (!services.length) throw new Error('empty');
  } catch {
    try {
      const local = JSON.parse(localStorage.getItem('sanae_services') || '[]');
      services = local.filter(s => s.active !== false);
    } catch { services = []; }
  }

  content.innerHTML = `
  <div class="animate-slide-up">
    <h2 style="margin-bottom:8px;"><i class="fas fa-calendar-plus" style="color:var(--primary)"></i> Nueva Reserva</h2>
    <p style="margin-bottom:32px; color:var(--text-muted);">Completa los pasos para agendar tu sesión.</p>
    
    <!-- Wizard Steps -->
    <div class="wizard-steps">
      <div class="wizard-step active" id="step-indicator-1">
        <div class="wizard-step-num">1</div>
        <span>Servicio</span>
      </div>
      <div class="wizard-connector"></div>
      <div class="wizard-step" id="step-indicator-2">
        <div class="wizard-step-num">2</div>
        <span>Fecha y Hora</span>
      </div>
      <div class="wizard-connector"></div>
      <div class="wizard-step" id="step-indicator-3">
        <div class="wizard-step-num">3</div>
        <span>Confirmar</span>
      </div>
    </div>

    <div id="booking-step-1" class="booking-step">
      <h3>¿Qué servicio necesitas?</h3>
      <div class="service-select-grid" id="service-grid">
        ${services.length > 0 ? services.map(s => `
          <div class="service-select-card" data-service-id="${s.id}" data-service-name="${s.name}" data-service-price="${s.price}">
            <div class="svc-card-emoji">${s.emoji || serviceEmoji(s.name)}</div>
            <h4>${s.name}</h4>
            <p>${s.description || ''}</p>
            <div class="service-price">$${Number(s.price).toLocaleString('es-CL')} CLP</div>
          </div>
        `).join('') : renderDefaultServices()}
      </div>
      <div class="form-group" style="margin-top:24px;">
        <label class="form-label">Notas adicionales (opcional)</label>
        <textarea class="form-control" id="booking-notes" rows="3" placeholder="Cuéntanos sobre tu condición, alergias, zonas a tratar, etc."></textarea>
      </div>
      <div style="text-align:right; margin-top:20px;">
        <button class="btn btn-primary btn-lg" id="step1-next" disabled>
          Siguiente <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>

    <div id="booking-step-2" class="booking-step" style="display:none;">
      <h3>¿Cuándo te acomoda?</h3>
      <div class="date-time-grid">
        <div>
          <label class="form-label">Fecha</label>
          <input type="date" class="form-control" id="booking-date" min="${new Date().toISOString().split('T')[0]}">
        </div>
        <div>
          <label class="form-label">Dirección de atención</label>
          <input type="text" class="form-control" id="booking-address" placeholder="Calle, número, depto, ciudad">
        </div>
      </div>
      <div id="slots-container" style="margin-top:24px;">
        <p class="text-muted"><i class="fas fa-info-circle"></i> Selecciona una fecha para ver los horarios disponibles.</p>
      </div>
      <div style="display:flex; gap:12px; margin-top:24px; justify-content:flex-end;">
        <button class="btn btn-outline-blue btn-lg" id="step2-back">
          <i class="fas fa-arrow-left"></i> Atrás
        </button>
        <button class="btn btn-primary btn-lg" id="step2-next" disabled>
          Siguiente <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>

    <div id="booking-step-3" class="booking-step" style="display:none;">
      <h3>Confirma tu reserva</h3>
      <div class="booking-summary card card-body" id="booking-summary">
        <!-- Filled by JS -->
      </div>
      <div class="payment-info card card-body" style="margin-top:16px; border-left:4px solid var(--gold-500);">
        <h4><i class="fas fa-credit-card" style="color:var(--gold-500)"></i> Pago seguro con Mercado Pago</h4>
        <p style="margin-top:8px; color:var(--text-muted);">Al confirmar serás redirigida al portal de pago de Mercado Pago. Acepta tarjetas de débito, crédito y transferencia bancaria.</p>
      </div>
      <div style="display:flex; gap:12px; margin-top:24px; justify-content:flex-end;">
        <button class="btn btn-outline-blue btn-lg" id="step3-back">
          <i class="fas fa-arrow-left"></i> Atrás
        </button>
        <button class="btn btn-gold btn-lg" id="confirm-booking-btn">
          <i class="fas fa-lock"></i> Confirmar y Pagar
        </button>
      </div>
    </div>
  </div>
  `;
  
  initBookingWizard(services);
}

// Maps service name keywords to emojis
function serviceEmoji(name = '') {
  const n = name.toLowerCase();
  if (n.includes('masaj') || n.includes('relaj') || n.includes('descontrac')) return '💆‍♀️';
  if (n.includes('facial') || n.includes('limpieza')) return '✨';
  if (n.includes('espalda')) return '🙆‍♀️';
  if (n.includes('sueroterapia') || n.includes('suero') || n.includes('endovenosa') || n.includes('vitamina')) return '💉';
  if (n.includes('linfático') || n.includes('linfatico') || n.includes('drenaje')) return '🌿';
  if (n.includes('enfermer') || n.includes('enfemería') || n.includes('cuidado')) return '🏥';
  if (n.includes('post') || n.includes('operatorio') || n.includes('cirugía')) return '🩺';
  if (n.includes('deportivo')) return '🏃‍♀️';
  if (n.includes('piedra') || n.includes('caliente')) return '🔥';
  return '💙';
}

function renderDefaultServices() {
  const defaults = [
    { id:'mas', emoji:'💆‍♀️', name:'Masajoterapia',           price:35000, description:'Masajes relajantes, descontracturantes y deportivos.' },
    { id:'fac', emoji:'✨',   name:'Limpieza Facial y Espalda', price:45000, description:'Limpieza profunda con aparatología moderna.' },
    { id:'sue', emoji:'💉',   name:'Sueroterapia',              price:55000, description:'Vitaminas y terapias endovenosas a domicilio.' },
    { id:'dre', emoji:'🌿',   name:'Drenaje Linfático',         price:38000, description:'Masajes linfáticos y cuidados post operatorios.' },
    { id:'enf', emoji:'🏥',   name:'Cuidados de Enfermería',    price:30000, description:'Curaciones, controles y medicamentos a domicilio.' },
    { id:'pop', emoji:'🩺',   name:'Post Operatorio',           price:50000, description:'Protocolo integral de recuperación post cirugía.' },
  ];
  return defaults.map(s => `
    <div class="service-select-card" data-service-id="${s.id}" data-service-name="${s.name}" data-service-price="${s.price}">
      <div class="svc-card-emoji">${s.emoji}</div>
      <h4>${s.name}</h4>
      <p>${s.description}</p>
      <div class="service-price">$${Number(s.price).toLocaleString('es-CL')} CLP</div>
    </div>
  `).join('');
}

function initBookingWizard(services) {
  let selected = { service: null, date: null, time: null, address: '', notes: '' };
  let currentStep = 1;

  function goTo(step) {
    document.querySelectorAll('.booking-step').forEach(s => s.style.display = 'none');
    document.getElementById(`booking-step-${step}`).style.display = 'block';
    document.querySelectorAll('.wizard-step').forEach((s, i) => {
      s.classList.toggle('active', i < step);
      s.classList.toggle('done', i < step - 1);
    });
    currentStep = step;
  }

  // Service selection
  document.querySelectorAll('.service-select-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.service-select-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selected.service = {
        id:    card.dataset.serviceId,
        name:  card.dataset.serviceName,
        price: card.dataset.servicePrice,
      };
      document.getElementById('step1-next').disabled = false;
    });
  });

  document.getElementById('step1-next')?.addEventListener('click', () => {
    selected.notes = document.getElementById('booking-notes').value;
    goTo(2);
  });

  // Date selection + slots
  document.getElementById('booking-date')?.addEventListener('change', async (e) => {
    selected.date = e.target.value;
    const container = document.getElementById('slots-container');
    container.innerHTML = `<div class="loading-container" style="padding:20px"><div class="spinner"></div></div>`;
    
    let slots = [];
    try {
      const res = await import('../services/api.js');
      slots = await res.scheduleAPI.slots(selected.date);
    } catch {
      // Fallback demo slots
      slots = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00'];
    }
    
    container.innerHTML = `
      <label class="form-label">Horarios disponibles</label>
      <div class="slots-grid">
        ${slots.map(slot => `
          <button class="slot-btn" data-time="${slot}">${slot}</button>
        `).join('')}
      </div>
    `;
    
    document.querySelectorAll('.slot-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selected.time = btn.dataset.time;
        checkStep2();
      });
    });
  });

  document.getElementById('booking-address')?.addEventListener('input', (e) => {
    selected.address = e.target.value;
    checkStep2();
  });

  function checkStep2() {
    const btn = document.getElementById('step2-next');
    if (btn) btn.disabled = !(selected.date && selected.time && selected.address.trim().length > 5);
  }

  document.getElementById('step2-next')?.addEventListener('click', () => {
    // Fill summary
    const summary = document.getElementById('booking-summary');
    summary.innerHTML = `
      <h4 style="margin-bottom:16px; color:var(--primary)"><i class="fas fa-receipt"></i> Resumen de tu reserva</h4>
      <div class="summary-row"><span><i class="fas fa-spa"></i> Servicio</span><strong>${selected.service?.name}</strong></div>
      <div class="summary-row"><span><i class="fas fa-calendar"></i> Fecha</span><strong>${new Date(selected.date + 'T12:00:00').toLocaleDateString('es-CL', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</strong></div>
      <div class="summary-row"><span><i class="fas fa-clock"></i> Hora</span><strong>${selected.time} hrs</strong></div>
      <div class="summary-row"><span><i class="fas fa-map-marker-alt"></i> Dirección</span><strong>${selected.address}</strong></div>
      ${selected.notes ? `<div class="summary-row"><span><i class="fas fa-sticky-note"></i> Notas</span><strong>${selected.notes}</strong></div>` : ''}
      <div class="summary-total"><span>Total a pagar</span><span class="summary-price">$${Number(selected.service?.price).toLocaleString('es-CL')} CLP</span></div>
    `;
    goTo(3);
  });

  document.getElementById('step2-back')?.addEventListener('click', () => goTo(1));
  document.getElementById('step3-back')?.addEventListener('click', () => goTo(2));

  document.getElementById('confirm-booking-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('confirm-booking-btn');
    btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px"></span> Procesando...';
    btn.disabled = true;
    
    try {
      const user = getUser();

      // Guardar/actualizar usuario en Firestore
      try { await usersAPI.save({ ...user, lastBookingAt: new Date().toISOString() }); } catch {}

      const result = await bookingAPI.create({
        serviceId:    selected.service.id,
        serviceName:  selected.service.name,
        servicePrice: selected.service.price,
        date:         selected.date,
        time:         selected.time,
        address:      selected.address,
        notes:        selected.notes,
        userId:       user.id,
        userName:     `${user.name} ${user.lastname}`,
        userEmail:    user.email,
        userPhone:    user.phone,
      });

      // Crear registro de pago pendiente en Firestore
      try {
        await paymentsAPI.create({
          bookingId:   result.id,
          userId:      user.id,
          userName:    `${user.name} ${user.lastname}`,
          userEmail:   user.email,
          serviceName: selected.service.name,
          amount:      Number(selected.service.price),
          method:      'Mercado Pago',
          status:      'pending',
        });
      } catch {}

      // Redirect to MP payment URL
      if (result.paymentUrl) {
        showToast('Redirigiendo a Mercado Pago...', 'info');
        setTimeout(() => { window.location.href = result.paymentUrl; }, 1000);
      } else {
        showToast('¡Reserva creada! Te contactaremos pronto.', 'success');
        loadPanel('my-bookings');
      }
    } catch (err) {
      showToast(err.message || 'Error al crear la reserva.', 'error');
      btn.innerHTML = '<i class="fas fa-lock"></i> Confirmar y Pagar';
      btn.disabled = false;
    }
  });
}

function renderBookingRow(b) {
  return `
  <div class="booking-row">
    <div class="booking-row-icon"><i class="fas fa-spa"></i></div>
    <div class="booking-row-info">
      <strong>${b.serviceName || b.service}</strong>
      <span>${formatDate(b.date)} — ${formatTime(b.time)} hrs</span>
    </div>
    ${statusBadge(b.status)}
  </div>
  `;
}

function bindPanelLinks(container) {
  container.querySelectorAll('[data-panel]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      loadPanel(el.dataset.panel);
    });
  });
}

export async function loadPanel(panel) {
  // Update sidebar active
  document.querySelectorAll('.sidebar-link').forEach(l => {
    l.classList.toggle('active', l.dataset.panel === panel);
  });
  const titles = { home:'Mi Panel', 'new-booking':'Nueva Reserva', 'my-bookings':'Mis Citas', profile:'Mi Perfil' };
  const title = document.getElementById('topbar-title');
  if (title) title.textContent = titles[panel] || '';

  switch (panel) {
    case 'home':        await loadHome(); break;
    case 'my-bookings': await loadMyBookings(); break;
    case 'new-booking': await loadNewBooking(); break;
    case 'profile':     loadProfile(); break;
    default:            await loadHome();
  }
}

function loadProfile() {
  const user = getUser();
  const content = document.getElementById('dashboard-content');
  content.innerHTML = `
  <div class="animate-slide-up">
    <h2 style="margin-bottom:24px;"><i class="fas fa-user-circle" style="color:var(--primary)"></i> Mi Perfil</h2>
    <div class="card" style="max-width:600px;">
      <div class="card-body">
        <div class="profile-avatar-section">
          <div class="profile-avatar">${user?.name?.[0]?.toUpperCase()}${user?.lastname?.[0]?.toUpperCase() || ''}</div>
          <div>
            <h3>${user?.name} ${user?.lastname}</h3>
            <span class="badge badge-blue">Paciente</span>
          </div>
        </div>
        <div class="profile-info">
          <div class="profile-field"><i class="fas fa-envelope"></i><div><label>Email</label><span>${user?.email}</span></div></div>
          <div class="profile-field"><i class="fab fa-whatsapp"></i><div><label>Teléfono</label><span>${user?.phone || '—'}</span></div></div>
        </div>
        <div style="margin-top:20px; padding-top:20px; border-top:1px solid var(--border-color);">
          <p class="text-muted" style="font-size:var(--text-sm)">Para actualizar tu información, contáctanos por WhatsApp.</p>
        </div>
      </div>
    </div>
  </div>
  `;
}

export function initDashboardScripts() {
  // Load default panel
  loadPanel('home');
  
  // Sidebar links
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      loadPanel(link.dataset.panel);
    });
  });
  
  // Mobile sidebar toggle
  document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('user-sidebar')?.classList.toggle('open');
  });
  
  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => {
    logout();
    router.navigate('landing');
  });
}
