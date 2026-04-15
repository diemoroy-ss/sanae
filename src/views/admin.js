// =========================================================
// ADMIN PANEL VIEW
// =========================================================

import { bookingAPI, servicesAPI, scheduleAPI, blocksAPI, paymentsAPI, usersAPI } from '../services/api.js';
import { getUser, logout } from '../services/auth.js';
import { showToast, formatDate, formatTime, statusBadge, createModal, closeModal } from '../utils/helpers.js';
import { router } from '../main.js';

export function renderAdmin() {
  const user = getUser();
  return `
  <div class="app-layout">
    <aside class="sidebar sidebar-admin" id="admin-sidebar">
      <div class="sidebar-header">
        <img src="/Logo.jpeg" alt="Sanae" class="sidebar-logo">
        <div class="sidebar-brand">
          <span class="sidebar-brand-name">Sanae</span>
          <span class="sidebar-brand-role admin-role">Panel Admin</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <a class="sidebar-link active" data-admin-panel="overview">
          <i class="fas fa-chart-line"></i> Resumen
        </a>
        <a class="sidebar-link" data-admin-panel="agenda">
          <i class="fas fa-calendar-week"></i> Agenda
        </a>
        <a class="sidebar-link" data-admin-panel="bookings">
          <i class="fas fa-list-check"></i> Todas las Citas
        </a>
        <a class="sidebar-link" data-admin-panel="services">
          <i class="fas fa-spa"></i> Servicios
        </a>
        <a class="sidebar-link" data-admin-panel="schedule">
          <i class="fas fa-clock"></i> Horarios
        </a>
        <a class="sidebar-link" data-admin-panel="blocks">
          <i class="fas fa-ban"></i> Bloquear Agenda
        </a>
        <a class="sidebar-link" data-admin-panel="clients">
          <i class="fas fa-users"></i> Pacientes
        </a>
        <a class="sidebar-link" data-admin-panel="users">
          <i class="fas fa-address-book"></i> Usuarios
        </a>
        <a class="sidebar-link" data-admin-panel="payments">
          <i class="fas fa-credit-card"></i> Pagos
        </a>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-avatar admin-avatar">${user?.name?.[0]?.toUpperCase() || 'A'}</div>
          <div>
            <div class="sidebar-user-name">${user?.name || 'Admin'}</div>
            <div class="sidebar-user-email">Administrador</div>
          </div>
        </div>
        <button class="sidebar-logout" id="admin-logout-btn">
          <i class="fas fa-sign-out-alt"></i> Salir
        </button>
      </div>
    </aside>

    <main class="app-main">
      <header class="app-topbar admin-topbar">
        <button class="topbar-toggle hide-desktop" id="admin-sidebar-toggle">
          <i class="fas fa-bars"></i>
        </button>
        <div class="topbar-title" id="admin-topbar-title">Resumen</div>
        <div class="topbar-actions">
          <button class="btn btn-primary btn-sm" data-admin-panel="agenda">
            <i class="fas fa-calendar-week"></i> Ver Agenda
          </button>
        </div>
      </header>
      <div class="app-content" id="admin-content">
        <div class="loading-container"><div class="spinner"></div></div>
      </div>
    </main>
  </div>
  `;
}

// ---- Admin Panels ----

async function loadOverview() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `<div class="loading-container"><div class="spinner"></div></div>`;
  
  let bookings = [];
  try { bookings = await bookingAPI.all(); } catch {}
  
  const today = new Date().toISOString().split('T')[0];
  const todayBookings  = bookings.filter(b => b.date === today);
  const pendingCount   = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const totalRevenue   = bookings.filter(b => ['confirmed','completed'].includes(b.status))
                                 .reduce((sum, b) => sum + Number(b.servicePrice || 0), 0);

  content.innerHTML = `
  <div class="animate-slide-up">
    <div class="admin-welcome">
      <h2>Bienvenida, ${getUser()?.name} 👋</h2>
      <p>${new Date().toLocaleDateString('es-CL', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</p>
    </div>

    <div class="admin-stats">
      <div class="admin-stat-card primary">
        <div class="admin-stat-icon"><i class="fas fa-calendar-day"></i></div>
        <div class="admin-stat-info">
          <div class="admin-stat-num">${todayBookings.length}</div>
          <div class="admin-stat-label">Citas de Hoy</div>
        </div>
      </div>
      <div class="admin-stat-card warning">
        <div class="admin-stat-icon"><i class="fas fa-clock"></i></div>
        <div class="admin-stat-info">
          <div class="admin-stat-num">${pendingCount}</div>
          <div class="admin-stat-label">Por Confirmar</div>
        </div>
      </div>
      <div class="admin-stat-card success">
        <div class="admin-stat-icon"><i class="fas fa-check-circle"></i></div>
        <div class="admin-stat-info">
          <div class="admin-stat-num">${confirmedCount}</div>
          <div class="admin-stat-label">Confirmadas</div>
        </div>
      </div>
      <div class="admin-stat-card gold">
        <div class="admin-stat-icon"><i class="fas fa-dollar-sign"></i></div>
        <div class="admin-stat-info">
          <div class="admin-stat-num">$${totalRevenue.toLocaleString('es-CL')}</div>
          <div class="admin-stat-label">Ingresos totales</div>
        </div>
      </div>
    </div>

    <!-- Citas Pendientes de Confirmar -->
    <div class="card" style="margin-top:30px;">
      <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
        <span><i class="fas fa-bell" style="color:var(--warning)"></i> Citas por Confirmar</span>
        <span class="badge badge-warning">${pendingCount}</span>
      </div>
      <div class="card-body">
        ${bookings.filter(b => b.status === 'pending').slice(0, 5).map(b => renderAdminBookingRow(b)).join('') || 
          '<p class="text-muted text-center" style="padding:20px;">No hay citas pendientes 🎉</p>'}
      </div>
      ${pendingCount > 5 ? `<div class="card-footer"><a href="#" data-admin-panel="bookings" class="text-primary font-bold">Ver todas (${pendingCount}) →</a></div>` : ''}
    </div>

    <!-- Citas de hoy -->
    <div class="card" style="margin-top:24px;">
      <div class="card-header"><i class="fas fa-calendar-day" style="color:var(--primary)"></i> Agenda de Hoy</div>
      <div class="card-body">
        ${todayBookings.length > 0 ? todayBookings.map(b => renderAdminBookingRow(b, false)).join('') 
          : '<p class="text-muted text-center" style="padding:20px;">No hay citas para hoy.</p>'}
      </div>
    </div>
  </div>
  `;
  
  bindAdminActions(content);
}

async function loadAllBookings() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `<div class="loading-container"><div class="spinner"></div></div>`;
  
  let bookings = [];
  try { bookings = await bookingAPI.all(); } catch {}
  
  // Filter controls
  content.innerHTML = `
  <div class="animate-slide-up">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
      <h2><i class="fas fa-list-check" style="color:var(--primary)"></i> Todas las Citas</h2>
      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        <select class="form-control form-select" id="filter-status" style="width:auto;">
          <option value="">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="confirmed">Confirmadas</option>
          <option value="completed">Completadas</option>
          <option value="cancelled">Canceladas</option>
          <option value="rejected">Rechazadas</option>
        </select>
        <input type="date" class="form-control" id="filter-date" style="width:auto;">
      </div>
    </div>
    <div class="card">
      <div class="table-responsive">
        <table class="data-table" id="bookings-table">
          <thead><tr>
            <th>Paciente</th><th>Servicio</th><th>Fecha</th><th>Hora</th><th>Dirección</th><th>Estado</th><th>Acciones</th>
          </tr></thead>
          <tbody id="bookings-tbody">
            ${renderBookingsRows(bookings)}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `;
  
  // Live filter
  let filteredBookings = [...bookings];
  function applyFilters() {
    const status = document.getElementById('filter-status').value;
    const date   = document.getElementById('filter-date').value;
    filteredBookings = bookings.filter(b => 
      (!status || b.status === status) && (!date || b.date === date)
    );
    document.getElementById('bookings-tbody').innerHTML = renderBookingsRows(filteredBookings);
    bindAdminActions(content);
  }
  document.getElementById('filter-status')?.addEventListener('change', applyFilters);
  document.getElementById('filter-date')?.addEventListener('change', applyFilters);
  
  bindAdminActions(content);
}

function renderBookingsRows(bookings) {
  if (!bookings.length) return `<tr><td colspan="7" class="text-center text-muted" style="padding:30px;">Sin citas encontradas.</td></tr>`;
  return bookings.map(b => `
  <tr>
    <td><strong>${b.userName || 'N/A'}</strong><br><small class="text-muted">${b.userPhone || ''}</small></td>
    <td>${b.serviceName || b.service || '—'}</td>
    <td>${formatDate(b.date)}</td>
    <td>${formatTime(b.time)}</td>
    <td style="max-width:180px; overflow:hidden; text-overflow:ellipsis;">${b.address || '—'}</td>
    <td>${statusBadge(b.status)}</td>
    <td>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        ${b.status === 'pending' ? `
          <button class="btn btn-sm btn-success" data-confirm-id="${b.id}" title="Confirmar"><i class="fas fa-check"></i></button>
          <button class="btn btn-sm btn-danger" data-reject-id="${b.id}" title="Rechazar"><i class="fas fa-times"></i></button>
        ` : ''}
        <button class="btn btn-sm" style="background:var(--blue-100); color:var(--primary);" data-detail-id="${b.id}" data-detail-json='${JSON.stringify(b).replace(/'/g,"&#39;")}' title="Ver detalle"><i class="fas fa-eye"></i></button>
      </div>
    </td>
  </tr>`).join('');
}

async function loadAgenda() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `<div class="loading-container"><div class="spinner"></div></div>`;
  
  let bookings = [];
  try { bookings = await bookingAPI.all(); } catch {}
  
  // Week calendar
  const today = new Date();
  const monday = new Date(today);
  const day = monday.getDay();
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  
  const weekDays = Array.from({length: 7}, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });

  const hours = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];

  function bookingForSlot(date, hour) {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => b.date === dateStr && b.time?.startsWith(hour.split(':')[0]));
  }

  content.innerHTML = `
  <div class="animate-slide-up">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
      <h2><i class="fas fa-calendar-week" style="color:var(--primary)"></i> Agenda Semanal</h2>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-outline-blue btn-sm" id="prev-week"><i class="fas fa-chevron-left"></i></button>
        <span class="btn btn-sm" style="background:var(--blue-50); border:1px solid var(--border-color);">
          ${monday.toLocaleDateString('es-CL', {day:'numeric', month:'short'})} — ${weekDays[6].toLocaleDateString('es-CL', {day:'numeric', month:'short', year:'numeric'})}
        </span>
        <button class="btn btn-outline-blue btn-sm" id="next-week"><i class="fas fa-chevron-right"></i></button>
      </div>
    </div>

    <div class="card">
      <div class="agenda-wrapper">
        <table class="agenda-table">
          <thead>
            <tr>
              <th class="agenda-time-col"></th>
              ${weekDays.map(d => {
                const isToday = d.toISOString().split('T')[0] === today.toISOString().split('T')[0];
                return `<th class="agenda-day-col ${isToday ? 'today' : ''}">
                  <div class="agenda-day-name">${d.toLocaleDateString('es-CL', {weekday:'short'})}</div>
                  <div class="agenda-day-num ${isToday ? 'today-circle' : ''}">${d.getDate()}</div>
                </th>`;
              }).join('')}
            </tr>
          </thead>
          <tbody>
            ${hours.map(hour => `
            <tr>
              <td class="agenda-time">${hour}</td>
              ${weekDays.map(d => {
                const slots = bookingForSlot(d, hour);
                const isToday = d.toISOString().split('T')[0] === today.toISOString().split('T')[0];
                return `<td class="agenda-cell ${isToday ? 'today-col' : ''}">
                  ${slots.map(b => `
                    <div class="agenda-event status-${b.status}" data-detail-json='${JSON.stringify(b).replace(/'/g,"&#39;")}' data-detail-id="${b.id}">
                      <div class="agenda-event-name">${b.serviceName || b.service}</div>
                      <div class="agenda-event-client">${b.userName || ''}</div>
                    </div>
                  `).join('')}
                </td>`;
              }).join('')}
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="agenda-legend">
      <span><span class="legend-dot status-pending"></span> Pendiente</span>
      <span><span class="legend-dot status-confirmed"></span> Confirmada</span>
      <span><span class="legend-dot status-completed"></span> Completada</span>
      <span><span class="legend-dot status-cancelled"></span> Cancelada</span>
    </div>
  </div>
  `;
  
  bindAdminActions(content);
}

// Default services seed (pre-loaded if backend is empty)
const DEFAULT_SERVICES = [
  { id:'svc-1', emoji:'💆‍♀️', name:'Masajoterapia',              price:35000, duration:60,  active:true,  description:'Masajes relajantes, descontracturantes y deportivos adaptados a tus necesidades musculares y de bienestar.' },
  { id:'svc-2', emoji:'✨',   name:'Limpieza Facial y Espalda',  price:45000, duration:60,  active:true,  description:'Limpiezas faciales profundas y tratamientos de espalda utilizando aparatología moderna y productos premium.' },
  { id:'svc-3', emoji:'💉',   name:'Sueroterapia',               price:55000, duration:45,  active:true,  description:'Terapias endovenosas y administración de vitaminas y sueros para potenciar tu salud desde adentro.' },
  { id:'svc-4', emoji:'🌿',   name:'Drenaje Linfático',          price:38000, duration:60,  active:true,  description:'Masajes linfáticos para mejorar circulación, reducir inflamación y cuidados post operatorios.' },
  { id:'svc-5', emoji:'🏥',   name:'Cuidados de Enfermería',     price:30000, duration:60,  active:true,  description:'Visitas, curaciones, controles, sondas, suturas, control de PA y medicamentos a domicilio.' },
  { id:'svc-6', emoji:'🩺',   name:'Post Operatorio',            price:50000, duration:90,  active:true,  description:'Protocolo integral de recuperación post cirugía: lipo, abdominoplastia, mamoplastia y más.' },
];

function getLocalServices() {
  try {
    const s = JSON.parse(localStorage.getItem('sanae_services') || 'null');
    if (s && s.length) return s;
  } catch {}
  // Auto-seed defaults on first load
  localStorage.setItem('sanae_services', JSON.stringify(DEFAULT_SERVICES));
  return DEFAULT_SERVICES;
}

function saveLocalServices(services) {
  localStorage.setItem('sanae_services', JSON.stringify(services));
}

async function loadServices() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `<div class="loading-container"><div class="spinner"></div></div>`;

  let services = [];
  let usingLocal = false;
  let firestoreOk = true;

  try {
    services = await servicesAPI.list();

    // Firestore está vacío — sembrar con servicios por defecto
    if (!services?.length) {
      const seeds = DEFAULT_SERVICES;
      await Promise.all(seeds.map(s => servicesAPI.create(s))).catch(() => {});
      services = seeds;
    }
  } catch {
    firestoreOk = false;
    services = getLocalServices();
    usingLocal = true;
  }

  const activeCount   = services.filter(s => s.active !== false).length;
  const inactiveCount = services.filter(s => s.active === false).length;

  content.innerHTML = `
  <div class="animate-slide-up">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
      <div>
        <h2><i class="fas fa-spa" style="color:var(--primary)"></i> Gestión de Servicios</h2>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <span class="badge badge-green"><i class="fas fa-check-circle"></i> ${activeCount} activos</span>
          ${inactiveCount ? `<span class="badge" style="background:#f1f5f9;color:#64748b;">${inactiveCount} inactivos</span>` : ''}
          ${usingLocal
            ? `<span class="badge" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;"><i class="fas fa-exclamation-circle"></i> Sin conexión a Firestore — modo local</span>`
            : `<span class="badge" style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;"><i class="fas fa-database"></i> Firestore conectado</span>`
          }
        </div>
      </div>
      <button class="btn btn-gold" id="add-service-btn">
        <i class="fas fa-plus"></i> Nuevo Servicio
      </button>
    </div>

    <div class="services-admin-grid" id="services-admin-grid">
      ${renderServicesAdminCards(services)}
    </div>
  </div>
  `;

  bindServicesAdminEvents(services, usingLocal);
}

function renderServicesAdminCards(services) {
  if (!services.length) return `<div class="empty-state"><i class="fas fa-spa empty-icon"></i><h3>Sin servicios</h3><p>Agrega el primero con el botón "Nuevo Servicio".</p></div>`;

  return services.map(s => {
    const isActive = s.active !== false;
    return `
    <div class="svc-admin-card ${isActive ? '' : 'svc-inactive'}" data-service-id="${s.id}">
      <div class="svc-admin-card-header">
        <div class="svc-admin-emoji">${s.emoji || '💙'}</div>
        <div class="svc-admin-meta">
          <div class="svc-admin-name">${s.name}</div>
          <div class="svc-admin-price">$${Number(s.price).toLocaleString('es-CL')} CLP</div>
        </div>
        <label class="toggle-switch" title="${isActive ? 'Servicio activo' : 'Servicio inactivo (no visible para clientes)'}">
          <input type="checkbox" class="svc-active-toggle" data-svc-id="${s.id}" ${isActive ? 'checked' : ''}>
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="svc-admin-desc">${s.description || '<em style="color:var(--text-muted)">Sin descripción</em>'}</div>
      <div class="svc-admin-footer">
        <span class="svc-admin-duration"><i class="fas fa-clock"></i> ${s.duration || 60} min</span>
        <span class="svc-status-badge ${isActive ? 'active' : 'inactive'}">${isActive ? '✅ Visible' : '⛔ Oculto'}</span>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-sm btn-outline-blue" data-edit-service='${JSON.stringify(s).replace(/'/g,"&#39;")}'>
            <i class="fas fa-edit"></i> Editar
          </button>
          <button class="btn btn-sm btn-danger" data-delete-service="${s.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function bindServicesAdminEvents(services, usingLocal) {
  const addBtn = document.getElementById('add-service-btn');
  addBtn?.addEventListener('click', () => showServiceModal(null, services, usingLocal));

  document.querySelectorAll('[data-edit-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      try {
        const svc = JSON.parse(btn.dataset.editService);
        showServiceModal(svc, services, usingLocal);
      } catch {}
    });
  });

  document.querySelectorAll('[data-delete-service]').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar este servicio?')) return;
      const id = btn.dataset.deleteService;
      try {
        await servicesAPI.delete(id);
      } catch {
        if (usingLocal) {
          saveLocalServices(services.filter(s => s.id !== id));
        }
      }
      showToast('Servicio eliminado.', 'success');
      loadServices();
    });
  });

  // Active/inactive toggle
  document.querySelectorAll('.svc-active-toggle').forEach(cb => {
    cb.addEventListener('change', async () => {
      const id      = cb.dataset.svcId;
      const active  = cb.checked;
      const svc     = services.find(s => s.id === id);
      if (!svc) return;
      const updated = { ...svc, active };

      try {
        await servicesAPI.update(updated);
      } catch {
        if (usingLocal) {
          const list = services.map(s => s.id === id ? updated : s);
          saveLocalServices(list);
        }
      }

      // Visual update without full reload
      const card   = document.querySelector(`.svc-admin-card[data-service-id="${id}"]`);
      const badge  = card?.querySelector('.svc-status-badge');
      if (card)  card.classList.toggle('svc-inactive', !active);
      if (badge) { badge.className = `svc-status-badge ${active ? 'active' : 'inactive'}`; badge.textContent = active ? '✅ Visible' : '⛔ Oculto'; }
      showToast(active ? 'Servicio activado. Visible para clientes.' : 'Servicio ocultado. No aparecerá en reservas.', active ? 'success' : 'info');
    });
  });
}

function showServiceModal(service = null, currentServices = [], usingLocal = false) {
  const isEdit = !!service;
  const EMOJI_OPTIONS = ['💆‍♀️','✨','💉','🌿','🏥','🩺','🏃‍♀️','🔥','💅','🫀','🦷','💊','🩹','🧘‍♀️','💙','⭐','🌸','🩻'];
  const selectedEmoji = service?.emoji || '💙';

  const body = `
  <form id="service-form">
    <div class="form-row">
      <div class="form-group" style="flex:0 0 auto;">
        <label class="form-label">Emoji</label>
        <div class="emoji-picker-wrap">
          <div class="emoji-selected" id="emoji-display">${selectedEmoji}</div>
          <div class="emoji-grid">
            ${EMOJI_OPTIONS.map(e => `<button type="button" class="emoji-opt ${e === selectedEmoji ? 'selected' : ''}" data-emoji="${e}">${e}</button>`).join('')}
          </div>
          <input type="hidden" id="srv-emoji" value="${selectedEmoji}">
        </div>
      </div>
      <div class="form-group" style="flex:1;">
        <label class="form-label">Nombre del Servicio *</label>
        <input type="text" class="form-control" id="srv-name" value="${service?.name || ''}" required>
        <div class="form-group" style="margin-top:16px;">
          <label class="form-label" style="display:block; margin-bottom:8px;">Estado del servicio</label>
          <div style="display:flex; align-items:center; gap:12px; padding:10px 14px; background:var(--neutral-50); border:1.5px solid var(--border-color); border-radius:var(--radius-md);">
            <label class="toggle-switch" style="flex-shrink:0; margin:0;">
              <input type="checkbox" id="srv-active" ${service?.active !== false ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
            <span id="srv-active-label" style="font-size:var(--text-sm); color:var(--text-secondary); font-weight:500;">${service?.active !== false ? '✅ Activo — visible para clientes' : '⛔ Inactivo — oculto en reservas'}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Descripción breve</label>
      <textarea class="form-control" id="srv-desc" rows="3" placeholder="Describe el servicio para que la clienta sepa qué esperar...">${service?.description || ''}</textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Precio (CLP) *</label>
        <input type="number" class="form-control" id="srv-price" value="${service?.price || ''}" required min="0" placeholder="35000">
      </div>
      <div class="form-group">
        <label class="form-label">Duración (min)</label>
        <input type="number" class="form-control" id="srv-duration" value="${service?.duration || 60}" min="15" step="15">
      </div>
    </div>
  </form>
  `;

  const footer = `
    <button class="btn btn-outline-blue" id="srv-cancel-btn">Cancelar</button>
    <button class="btn btn-gold" id="srv-save-btn">${isEdit ? 'Guardar cambios' : 'Crear servicio'}</button>
  `;

  createModal(isEdit ? `Editar: ${service.name}` : 'Nuevo Servicio', body, footer);

  // Emoji picker logic
  document.querySelectorAll('.emoji-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.emoji-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('srv-emoji').value   = btn.dataset.emoji;
      document.getElementById('emoji-display').textContent = btn.dataset.emoji;
    });
  });

  // Active label live update
  document.getElementById('srv-active')?.addEventListener('change', e => {
    document.getElementById('srv-active-label').textContent = e.target.checked
      ? 'Activo (visible para clientes)'
      : 'Inactivo (oculto)';
  });

  document.getElementById('srv-cancel-btn')?.addEventListener('click', closeModal);

  document.getElementById('srv-save-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('srv-save-btn');
    btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px"></span>';
    btn.disabled = true;

    const data = {
      id:          service?.id || `svc-${Date.now()}`,
      emoji:       document.getElementById('srv-emoji').value,
      name:        document.getElementById('srv-name').value.trim(),
      description: document.getElementById('srv-desc').value.trim(),
      price:       Number(document.getElementById('srv-price').value),
      duration:    Number(document.getElementById('srv-duration').value),
      active:      document.getElementById('srv-active').checked,
    };

    if (!data.name || !data.price) {
      showToast('Nombre y precio son obligatorios.', 'error');
      btn.innerHTML = isEdit ? 'Guardar cambios' : 'Crear servicio';
      btn.disabled = false;
      return;
    }

    try {
      if (isEdit) await servicesAPI.update(data);
      else        await servicesAPI.create(data);
    } catch {
      // localStorage fallback
      if (isEdit) {
        saveLocalServices(currentServices.map(s => s.id === data.id ? data : s));
      } else {
        saveLocalServices([...currentServices, data]);
      }
    }

    closeModal();
    showToast(`Servicio ${isEdit ? 'actualizado' : 'creado'} correctamente.`, 'success');
    loadServices();
  });
}


async function loadSchedule() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `<div class="loading-container"><div class="spinner"></div></div>`;
  
  let schedule = null;
  try { schedule = await scheduleAPI.get(); } catch {}
  
  const defaultSchedule = {
    0: { enabled: false, start: '09:00', end: '19:00' },
    1: { enabled: true,  start: '09:00', end: '19:00' },
    2: { enabled: true,  start: '09:00', end: '19:00' },
    3: { enabled: true,  start: '09:00', end: '19:00' },
    4: { enabled: true,  start: '09:00', end: '19:00' },
    5: { enabled: true,  start: '09:00', end: '19:00' },
    6: { enabled: true,  start: '09:00', end: '14:00' },
  };
  const sch = schedule || defaultSchedule;
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  content.innerHTML = `
  <div class="animate-slide-up">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
      <h2><i class="fas fa-clock" style="color:var(--primary)"></i> Configuración de Horarios</h2>
      <button class="btn btn-gold" id="save-schedule-btn">
        <i class="fas fa-save"></i> Guardar Horarios
      </button>
    </div>
    <div class="card" style="max-width:680px;">
      <div class="card-body">
        <p class="text-muted" style="margin-bottom:24px; padding:12px; background:var(--blue-50); border-radius:var(--radius-md); border-left:4px solid var(--primary);">
          <i class="fas fa-info-circle" style="color:var(--primary)"></i>
          Como la atención es a domicilio, puedes configurar horarios flexibles para cada día de la semana.
        </p>
        <div class="schedule-grid">
          ${Object.entries(sch).map(([day, config]) => `
          <div class="schedule-row">
            <div class="schedule-day-toggle">
              <label class="toggle-switch">
                <input type="checkbox" id="day-enabled-${day}" ${config.enabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
              <span class="schedule-day-name">${dayNames[day]}</span>
            </div>
            <div class="schedule-times ${config.enabled ? '' : 'disabled'}" id="schedule-times-${day}">
              <div style="display:flex; align-items:center; gap:8px;">
                <input type="time" class="form-control" id="day-start-${day}" value="${config.start}" style="width:120px">
                <span>a</span>
                <input type="time" class="form-control" id="day-end-${day}" value="${config.end}" style="width:120px">
              </div>
            </div>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
  `;

  // Toggle day enabled
  Object.keys(sch).forEach(day => {
    document.getElementById(`day-enabled-${day}`)?.addEventListener('change', (e) => {
      const timesDiv = document.getElementById(`schedule-times-${day}`);
      timesDiv?.classList.toggle('disabled', !e.target.checked);
    });
  });

  document.getElementById('save-schedule-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('save-schedule-btn');
    btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px"></span> Guardando...';
    btn.disabled = true;
    const newSchedule = {};
    Object.keys(sch).forEach(day => {
      newSchedule[day] = {
        enabled: document.getElementById(`day-enabled-${day}`)?.checked || false,
        start:   document.getElementById(`day-start-${day}`)?.value || '09:00',
        end:     document.getElementById(`day-end-${day}`)?.value || '19:00',
      };
    });
    try {
      await scheduleAPI.set(newSchedule);
      showToast('Horarios guardados correctamente.', 'success');
    } catch (err) {
      showToast(err.message || 'Error al guardar. Los horarios se guardarán cuando conectes n8n.', 'warning');
    }
    btn.innerHTML = '<i class="fas fa-save"></i> Guardar Horarios';
    btn.disabled = false;
  });
}

async function loadBlocks() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `<div class="loading-container"><div class="spinner"></div></div>`;

  // Load from backend OR localStorage fallback while n8n is pending
  let blocks = [];
  try {
    blocks = await blocksAPI.list();
  } catch {
    try { blocks = JSON.parse(localStorage.getItem('sanae_blocks') || '[]'); } catch { blocks = []; }
  }

  const HOURS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];

  content.innerHTML = `
  <div class="animate-slide-up">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
      <h2><i class="fas fa-ban" style="color:var(--danger)"></i> Bloqueos de Agenda</h2>
    </div>

    <div class="blocks-layout">
      <!-- Formulario de nuevo bloqueo -->
      <div class="card">
        <div class="card-header">
          <i class="fas fa-plus-circle" style="color:var(--primary)"></i> Nuevo Bloqueo
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="form-label">Tipo de bloqueo</label>
            <div class="block-type-toggle" id="block-type-toggle">
              <button class="block-type-btn active" data-type="slots" id="btn-type-slots">
                <i class="fas fa-clock"></i> Horarios específicos
              </button>
              <button class="block-type-btn" data-type="fullday" id="btn-type-fullday">
                <i class="fas fa-calendar-times"></i> Día completo
              </button>
              <button class="block-type-btn" data-type="range" id="btn-type-range">
                <i class="fas fa-calendar-week"></i> Rango de fechas
              </button>
            </div>
          </div>

          <!-- Fecha (siempre visible) -->
          <div class="block-dates-row">
            <div class="form-group">
              <label class="form-label">Fecha <span id="start-date-label">de bloqueo</span></label>
              <input type="date" class="form-control" id="block-date"
                min="${new Date().toISOString().split('T')[0]}"
                value="${new Date().toISOString().split('T')[0]}">
            </div>
            <div class="form-group" id="end-date-group" style="display:none;">
              <label class="form-label">Fecha de fin</label>
              <input type="date" class="form-control" id="block-date-end"
                min="${new Date().toISOString().split('T')[0]}">
            </div>
          </div>

          <!-- Horarios (solo para tipo 'slots') -->
          <div class="form-group" id="slots-selector">
            <label class="form-label">Horarios a bloquear <small style="color:var(--text-muted);">(selecciona uno o más)</small></label>
            <div class="time-slots-grid">
              ${HOURS.map(h => `
              <label class="time-slot-check">
                <input type="checkbox" value="${h}" class="block-hour-cb">
                <span>${h}</span>
              </label>`).join('')}
            </div>
            <div style="margin-top:8px; display:flex; gap:8px;">
              <button class="btn btn-sm" style="background:var(--blue-50);color:var(--primary);border:1px solid var(--blue-200);" id="select-all-hours">
                Seleccionar todos
              </button>
              <button class="btn btn-sm" style="background:var(--neutral-100);color:var(--text-muted);border:1px solid var(--border-color);" id="clear-hours">
                Limpiar
              </button>
            </div>
          </div>

          <!-- Motivo -->
          <div class="form-group">
            <label class="form-label">Motivo <small style="color:var(--text-muted);">(opcional)</small></label>
            <input type="text" class="form-control" id="block-reason"
              placeholder="Ej: Vacaciones, capacitación, cita personal...">
          </div>

          <button class="btn btn-danger" style="width:100%;" id="save-block-btn">
            <i class="fas fa-ban"></i> Guardar Bloqueo
          </button>
        </div>
      </div>

      <!-- Lista de bloqueos activos -->
      <div>
        <div class="card">
          <div class="card-header" style="display:flex; justify-content:space-between; align-items:center;">
            <span><i class="fas fa-list" style="color:var(--danger)"></i> Bloqueos activos</span>
            <span class="badge badge-danger" id="blocks-count">${blocks.length}</span>
          </div>
          <div class="card-body" id="blocks-list" style="padding:0;">
            ${renderBlocksList(blocks)}
          </div>
        </div>

        <!-- Mini calendario visual -->
        <div class="card" style="margin-top:16px;">
          <div class="card-header"><i class="fas fa-calendar-alt" style="color:var(--primary)"></i> Vista del mes</div>
          <div class="card-body" id="blocks-calendar">
            ${renderBlocksCalendar(blocks)}
          </div>
        </div>
      </div>
    </div>
  </div>
  `;

  let currentBlockType = 'slots';

  // Type toggle
  document.querySelectorAll('.block-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.block-type-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBlockType = btn.dataset.type;

      const slotsSelector  = document.getElementById('slots-selector');
      const endDateGroup   = document.getElementById('end-date-group');
      const startDateLabel = document.getElementById('start-date-label');

      slotsSelector.style.display  = currentBlockType === 'slots'   ? '' : 'none';
      endDateGroup.style.display   = currentBlockType === 'range'  ? '' : 'none';
      startDateLabel.textContent   = currentBlockType === 'range'  ? 'de inicio' : 'de bloqueo';
    });
  });

  // Select/clear all hours
  document.getElementById('select-all-hours')?.addEventListener('click', () => {
    document.querySelectorAll('.block-hour-cb').forEach(cb => cb.checked = true);
  });
  document.getElementById('clear-hours')?.addEventListener('click', () => {
    document.querySelectorAll('.block-hour-cb').forEach(cb => cb.checked = false);
  });

  // Save block
  document.getElementById('save-block-btn')?.addEventListener('click', async () => {
    const btn    = document.getElementById('save-block-btn');
    const date   = document.getElementById('block-date').value;
    const reason = document.getElementById('block-reason').value.trim();

    if (!date) { showToast('Selecciona una fecha de bloqueo.', 'error'); return; }

    let blockData = { id: Date.now().toString(), type: currentBlockType, date, reason, createdAt: new Date().toISOString() };

    if (currentBlockType === 'slots') {
      const hours = [...document.querySelectorAll('.block-hour-cb:checked')].map(cb => cb.value);
      if (!hours.length) { showToast('Selecciona al menos un horario.', 'error'); return; }
      blockData.hours = hours;
    }

    if (currentBlockType === 'range') {
      const dateEnd = document.getElementById('block-date-end').value;
      if (!dateEnd || dateEnd < date) { showToast('La fecha de fin debe ser posterior a la de inicio.', 'error'); return; }
      blockData.dateEnd = dateEnd;
    }

    btn.innerHTML = '<span class="spinner" style="width:16px;height:16px;border-width:2px"></span> Guardando...';
    btn.disabled = true;

    try {
      await blocksAPI.create(blockData);
    } catch {
      // Fallback: save locally while n8n not configured
      const existing = JSON.parse(localStorage.getItem('sanae_blocks') || '[]');
      existing.push(blockData);
      localStorage.setItem('sanae_blocks', JSON.stringify(existing));
    }

    showToast('Bloqueo guardado correctamente.', 'success');
    loadBlocks(); // Reload
  });

  // Delete blocks
  bindDeleteBlocks();
}

function renderBlocksList(blocks) {
  if (!blocks.length) {
    return `<div class="empty-state" style="padding:32px;">
      <div class="empty-icon"><i class="fas fa-check-circle" style="color:var(--success);"></i></div>
      <p style="color:var(--text-muted);">Sin bloqueos activos. <br>La agenda está completamente disponible.</p>
    </div>`;
  }

  // Sort by date
  const sorted = [...blocks].sort((a, b) => a.date.localeCompare(b.date));
  const today  = new Date().toISOString().split('T')[0];

  return sorted.map(b => {
    const isPast   = b.type !== 'range' ? b.date < today : (b.dateEnd || b.date) < today;
    const typeIcon = { slots:'fa-clock', fullday:'fa-calendar-times', range:'fa-calendar-week' }[b.type] || 'fa-ban';
    const typeLabel = { slots:'Horarios específicos', fullday:'Día completo', range:'Rango de fechas' }[b.type] || b.type;

    let dateText = formatDate(b.date);
    if (b.type === 'range' && b.dateEnd) dateText = `${formatDate(b.date)} → ${formatDate(b.dateEnd)}`;

    let hoursText = '';
    if (b.type === 'slots' && b.hours?.length) {
      hoursText = `<div class="block-hours-chips">${b.hours.map(h => `<span class="hour-chip">${h}</span>`).join('')}</div>`;
    }

    return `
    <div class="block-item ${isPast ? 'block-past' : ''}">
      <div class="block-item-icon">
        <i class="fas ${typeIcon}"></i>
      </div>
      <div class="block-item-info">
        <div class="block-item-date">${dateText}</div>
        <div class="block-item-meta">
          <span class="block-type-tag">${typeLabel}</span>
          ${b.reason ? `<span>· ${b.reason}</span>` : ''}
          ${isPast ? '<span class="block-past-badge">Pasado</span>' : ''}
        </div>
        ${hoursText}
      </div>
      <button class="block-delete-btn" data-block-id="${b.id}" title="Eliminar bloqueo">
        <i class="fas fa-trash"></i>
      </button>
    </div>`;
  }).join('');
}

function renderBlocksCalendar(blocks) {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();
  const today = now.toISOString().split('T')[0];

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const first = new Date(year, month, 1);
  const last  = new Date(year, month + 1, 0);
  const startDow = (first.getDay() + 6) % 7; // Monday-based

  // Build blocked date set
  const blockedDates = new Set();
  blocks.forEach(b => {
    if (b.type === 'fullday' || b.type === 'slots') { blockedDates.add(b.date); }
    if (b.type === 'range' && b.dateEnd) {
      let d = new Date(b.date + 'T12:00:00');
      const end = new Date(b.dateEnd + 'T12:00:00');
      while (d <= end) {
        blockedDates.add(d.toISOString().split('T')[0]);
        d.setDate(d.getDate() + 1);
      }
    }
  });

  let html = `
  <div class="mini-cal-header">${monthNames[month]} ${year}</div>
  <div class="mini-cal-grid">
    <span class="mini-cal-dow">Lun</span><span class="mini-cal-dow">Mar</span>
    <span class="mini-cal-dow">Mié</span><span class="mini-cal-dow">Jue</span>
    <span class="mini-cal-dow">Vie</span><span class="mini-cal-dow">Sáb</span>
    <span class="mini-cal-dow">Dom</span>
  `;

  // Empty cells before 1st
  for (let i = 0; i < startDow; i++) html += `<span></span>`;

  for (let d = 1; d <= last.getDate(); d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday   = dateStr === today;
    const isBlocked = blockedDates.has(dateStr);
    const cls = [isToday ? 'mini-cal-today' : '', isBlocked ? 'mini-cal-blocked' : ''].filter(Boolean).join(' ');
    html += `<span class="mini-cal-day ${cls}" title="${isBlocked ? 'Bloqueado' : ''}">${d}</span>`;
  }

  html += `</div>
  <div class="mini-cal-legend">
    <span><span class="mini-cal-blocked" style="display:inline-block;width:14px;height:14px;border-radius:4px;"></span> Bloqueado</span>
    <span><span class="mini-cal-today" style="display:inline-block;width:14px;height:14px;border-radius:50%;"></span> Hoy</span>
  </div>`;

  return html;
}

function bindDeleteBlocks() {
  document.querySelectorAll('.block-delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('¿Eliminar este bloqueo?')) return;
      const id = btn.dataset.blockId;

      try {
        await blocksAPI.delete(id);
      } catch {
        // Fallback local
        const existing = JSON.parse(localStorage.getItem('sanae_blocks') || '[]');
        localStorage.setItem('sanae_blocks', JSON.stringify(existing.filter(b => b.id !== id)));
      }

      showToast('Bloqueo eliminado.', 'success');
      loadBlocks();
    });
  });
}

async function loadUsers() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `<div class="loading-container"><div class="spinner"></div></div>`;

  // Read directly from Firestore users collection + cross with bookings
  let registeredUsers = [];
  let bookings = [];
  try { [registeredUsers, bookings] = await Promise.all([usersAPI.list(), bookingAPI.all()]); } catch {}

  // Build booking stats per email
  const bookingStats = {};
  bookings.forEach(b => {
    if (!b.userEmail) return;
    if (!bookingStats[b.userEmail]) bookingStats[b.userEmail] = { bookings:0, completed:0, totalSpent:0, lastDate:null };
    const s = bookingStats[b.userEmail];
    s.bookings++;
    if (b.status === 'completed') { s.completed++; s.totalSpent += Number(b.servicePrice || 0); }
    if (!s.lastDate || b.date > s.lastDate) s.lastDate = b.date;
  });

  // Merge: registered users (from Firestore) + unregistered users found only in bookings
  const emailsSeen = new Set(registeredUsers.map(u => u.email));
  const unregisteredFromBookings = Object.keys(bookingStats)
    .filter(e => !emailsSeen.has(e))
    .map(e => ({ email: e, name: bookings.find(b => b.userEmail===e)?.userName || e, phone: bookings.find(b => b.userEmail===e)?.userPhone || '—', provider: 'booking' }));

  const allUsers = [...registeredUsers, ...unregisteredFromBookings].map(u => ({
    ...u,
    ...(bookingStats[u.email] || { bookings:0, completed:0, totalSpent:0, lastDate:null }),
  })).sort((a,b) => b.bookings - a.bookings);

  const total       = allUsers.length;
  const withBooking = allUsers.filter(u => u.bookings > 0).length;
  const noBooking   = total - withBooking;
  const ago60 = new Date(Date.now() - 60*24*60*60*1000).toISOString().split('T')[0];

  function exportCSV() {
    const rows = [['Nombre','Email','Teléfono','Proveedor','Total Citas','Completadas','Total Gastado','Última Cita']];
    allUsers.forEach(u => rows.push([u.name, u.email, u.phone||'—', u.provider||'email', u.bookings, u.completed, `$${u.totalSpent.toLocaleString('es-CL')}`, u.lastDate||'—']));
    const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `sanae-usuarios-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    showToast('CSV descargado correctamente.', 'success');
  }

  content.innerHTML = `
  <div class="animate-slide-up">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
      <div>
        <h2><i class="fas fa-address-book" style="color:var(--primary)"></i> Usuarios Registrados</h2>
        <div style="display:flex; gap:8px; margin-top:8px;">
          <span class="badge" style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;"><i class="fas fa-database"></i> ${registeredUsers.length} en Firestore</span>
          ${noBooking ? `<span class="badge" style="background:#fef9c3;color:#854d0e;"><i class="fas fa-info-circle"></i> ${noBooking} sin citas aún</span>` : ''}
        </div>
      </div>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-outline-blue btn-sm" id="filter-all-btn"><i class="fas fa-list"></i> Todos (${total})</button>
        <button class="btn btn-sm" style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;" id="filter-active-btn"><i class="fas fa-check-circle"></i> Con citas (${withBooking})</button>
        <button class="btn btn-sm" style="background:#f1f5f9;color:#64748b;border:1px solid #e2e8f0;" id="filter-no-booking-btn"><i class="fas fa-clock"></i> Sin citas (${noBooking})</button>
        <button class="btn btn-gold btn-sm" id="export-csv-btn"><i class="fas fa-file-csv"></i> Exportar CSV</button>
      </div>
    </div>

    <div class="stats-row" style="margin-bottom:24px;">
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#e3edfd;color:#1a56db;"><i class="fas fa-users"></i></div>
        <div><div class="stat-card-num">${total}</div><div class="stat-card-label">Total usuarios</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#dcfce7;color:#166534;"><i class="fas fa-calendar-check"></i></div>
        <div><div class="stat-card-num">${withBooking}</div><div class="stat-card-label">Han agendado</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#fdf6e3;color:#854d0e;"><i class="fas fa-coins"></i></div>
        <div><div class="stat-card-num">$${allUsers.reduce((s,u)=>s+u.totalSpent,0).toLocaleString('es-CL')}</div><div class="stat-card-label">Ingresos totales</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#fdf0ff;color:#a855f7;"><i class="fas fa-star"></i></div>
        <div><div class="stat-card-num">${allUsers.filter(u=>u.bookings>=3).length}</div><div class="stat-card-label">Frecuentes (3+)</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-body" style="padding:0;">
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr>
              <th>Usuaria</th><th>Email</th><th>Teléfono</th><th>Citas</th><th>Completadas</th><th>Total</th><th>Última cita</th><th>Estado</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              ${allUsers.length > 0 ? allUsers.map(u => {
                const isFrequent = u.bookings >= 3;
                const isNew      = u.bookings === 1 && u.registeredAt;
                const isInactive = u.lastDate && u.lastDate < ago60;
                const hasNone    = u.bookings === 0;
                let badge = '';
                if (isFrequent)     badge = '<span class="user-badge frequent">Frecuente ⭐</span>';
                else if (hasNone)   badge = '<span class="user-badge inactive">Sin citas</span>';
                else if (isNew)     badge = '<span class="user-badge new-user">Nueva 🌱</span>';
                if (isInactive && !hasNone) badge += '<span class="user-badge inactive">Inactiva 😴</span>';
                return `
                <tr class="user-row" data-has-booking="${u.bookings > 0}">
                  <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                      <div class="user-mini-avatar">${u.name?.[0]?.toUpperCase()||'?'}</div>
                      <div><strong>${u.name}</strong><div>${badge}</div></div>
                    </div>
                  </td>
                  <td>${u.email}</td>
                  <td>${u.phone||'—'}</td>
                  <td><strong>${u.bookings}</strong></td>
                  <td><span class="badge badge-green">${u.completed}</span></td>
                  <td><strong>$${u.totalSpent.toLocaleString('es-CL')}</strong></td>
                  <td>${u.lastDate ? formatDate(u.lastDate) : '—'}</td>
                  <td>
                    ${u.bookings > 0
                      ? '<span class="badge" style="background:#dcfce7;color:#166534;"><i class="fas fa-check"></i> Ha agendado</span>'
                      : '<span class="badge" style="background:#fef9c3;color:#854d0e;"><i class="fas fa-clock"></i> Sin reservas</span>'
                    }
                  </td>
                  <td>
                    <div style="display:flex;gap:6px;">
                      ${u.phone ? `<a href="https://wa.me/${u.phone.replace(/\D/g,'')}" target="_blank" class="btn btn-sm btn-whatsapp" style="animation:none;padding:6px 10px;"><i class="fab fa-whatsapp"></i></a>` : ''}
                      <a href="mailto:${u.email}" class="btn btn-sm btn-outline-blue" style="padding:6px 10px;"><i class="fas fa-envelope"></i></a>
                    </div>
                  </td>
                </tr>`;
              }).join('') : '<tr><td colspan="9" class="text-center text-muted" style="padding:40px;">Sin usuarios registrados aún.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top:16px;">
      <div class="card-header"><i class="fas fa-envelope" style="color:var(--primary)"></i> Segmentos para Email Marketing</div>
      <div class="card-body">
        <div class="email-segments">
          <div class="email-segment"><div class="segment-icon" style="background:#e3edfd;color:#1a56db;"><i class="fas fa-users"></i></div><div><strong>Todas</strong><p>${total} contactos — Newsletters</p></div></div>
          <div class="email-segment"><div class="segment-icon" style="background:#fdf0ff;color:#a855f7;"><i class="fas fa-star"></i></div><div><strong>Frecuentes</strong><p>${allUsers.filter(u=>u.bookings>=3).length} contactos — Fidelización</p></div></div>
          <div class="email-segment"><div class="segment-icon" style="background:#fef9c3;color:#854d0e;"><i class="fas fa-moon"></i></div><div><strong>Inactivas +60 días</strong><p>${allUsers.filter(u=>u.lastDate&&u.lastDate<ago60).length} contactos — Reactivación</p></div></div>
          <div class="email-segment"><div class="segment-icon" style="background:#f1f5f9;color:#64748b;"><i class="fas fa-user-plus"></i></div><div><strong>Sin citas</strong><p>${noBooking} contactos — Primera reserva</p></div></div>
        </div>
        <p style="margin-top:12px; font-size:var(--text-xs); color:var(--text-muted);"><i class="fas fa-info-circle"></i> Exporta CSV para importar en Mailchimp, Brevo o ActiveCampaign.</p>
      </div>
    </div>
  </div>
  `;

  document.getElementById('export-csv-btn')?.addEventListener('click', exportCSV);
  document.getElementById('filter-all-btn')?.addEventListener('click', () => document.querySelectorAll('.user-row').forEach(r => r.style.display = ''));
  document.getElementById('filter-active-btn')?.addEventListener('click', () => document.querySelectorAll('.user-row').forEach(r => { r.style.display = r.dataset.hasBooking === 'true' ? '' : 'none'; }));
  document.getElementById('filter-no-booking-btn')?.addEventListener('click', () => document.querySelectorAll('.user-row').forEach(r => { r.style.display = r.dataset.hasBooking === 'false' ? '' : 'none'; }));
}


async function loadClients() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `<div class="loading-container"><div class="spinner"></div></div>`;

  let bookings = [];
  try { bookings = await bookingAPI.all(); } catch {}
  
  // Extract unique clients from bookings
  const clientMap = {};
  bookings.forEach(b => {
    if (!clientMap[b.userEmail]) {
      clientMap[b.userEmail] = { name: b.userName, email: b.userEmail, phone: b.userPhone, bookings: 0, lastDate: b.date };
    }
    clientMap[b.userEmail].bookings++;
    if (b.date > clientMap[b.userEmail].lastDate) clientMap[b.userEmail].lastDate = b.date;
  });
  const clients = Object.values(clientMap);

  content.innerHTML = `
  <div class="animate-slide-up">
    <h2 style="margin-bottom:24px;"><i class="fas fa-users" style="color:var(--primary)"></i> Pacientes (${clients.length})</h2>
    <div class="card">
      <div class="table-responsive">
        <table class="data-table">
          <thead><tr><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Citas</th><th>Última cita</th><th>Acciones</th></tr></thead>
          <tbody>
            ${clients.length > 0 ? clients.map(c => `
            <tr>
              <td><strong>${c.name || '—'}</strong></td>
              <td>${c.email || '—'}</td>
              <td>${c.phone || '—'}</td>
              <td><span class="badge badge-blue">${c.bookings}</span></td>
              <td>${c.lastDate ? formatDate(c.lastDate) : '—'}</td>
              <td>
                ${c.phone ? `<a href="https://wa.me/${c.phone.replace(/\D/g,'')}" target="_blank" class="btn btn-sm btn-whatsapp" style="animation:none; padding:6px 12px;"><i class="fab fa-whatsapp"></i></a>` : ''}
              </td>
            </tr>`).join('') : 
            `<tr><td colspan="6" class="text-center text-muted" style="padding:30px;">Sin pacientes registrados aún.</td></tr>`}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `;
}

// ---- Shared Actions ----

function renderAdminBookingRow(b, showActions = true) {
  return `
  <div class="admin-booking-row">
    <div class="admin-booking-icon status-icon-${b.status}"><i class="fas fa-calendar"></i></div>
    <div class="admin-booking-info">
      <strong>${b.userName || 'N/A'}</strong>
      <span>${b.serviceName || b.service} — ${formatDate(b.date)} a las ${formatTime(b.time)}</span>
      <span style="font-size:var(--text-xs); color:var(--text-muted)"><i class="fas fa-map-marker-alt"></i> ${b.address || '—'}</span>
    </div>
    ${statusBadge(b.status)}
    ${showActions && b.status === 'pending' ? `
    <div style="display:flex; gap:8px; margin-left:auto;">
      <button class="btn btn-sm btn-success" data-confirm-id="${b.id}"><i class="fas fa-check"></i> Confirmar</button>
      <button class="btn btn-sm btn-danger" data-reject-id="${b.id}"><i class="fas fa-times"></i> Rechazar</button>
    </div>` : ''}
  </div>
  `;
}

async function loadPayments() {
  const content = document.getElementById('admin-content');
  content.innerHTML = `<div class="loading-container"><div class="spinner"></div></div>`;

  let payments = [];
  let bookings = [];
  try { [payments, bookings] = await Promise.all([paymentsAPI.list(), bookingAPI.all()]); } catch {}

  // Index bookings by id for cross-reference
  const bookingIndex = {};
  bookings.forEach(b => { bookingIndex[b.id] = b; });

  const totalAmount  = payments.filter(p => p.status === 'paid').reduce((s,p) => s + Number(p.amount || 0), 0);
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const paidCount    = payments.filter(p => p.status === 'paid').length;

  function payStatusBadge(status) {
    const map = {
      paid:     '<span class="badge" style="background:#dcfce7;color:#166534;"><i class="fas fa-check-circle"></i> Pagado</span>',
      pending:  '<span class="badge" style="background:#fef9c3;color:#854d0e;"><i class="fas fa-clock"></i> Pendiente</span>',
      failed:   '<span class="badge" style="background:#fee2e2;color:#dc2626;"><i class="fas fa-times-circle"></i> Fallido</span>',
      refunded: '<span class="badge" style="background:#f1f5f9;color:#64748b;"><i class="fas fa-undo"></i> Reembolsado</span>',
    };
    return map[status] || `<span class="badge">${status}</span>`;
  }

  content.innerHTML = `
  <div class="animate-slide-up">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; flex-wrap:wrap; gap:12px;">
      <h2><i class="fas fa-credit-card" style="color:var(--primary)"></i> Historial de Pagos</h2>
      <span class="badge" style="background:#dcfce7;color:#166534;border:1px solid #bbf7d0;"><i class="fas fa-database"></i> Firestore — sanae_payments</span>
    </div>

    <div class="stats-row" style="margin-bottom:24px;">
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#dcfce7;color:#166534;"><i class="fas fa-check-circle"></i></div>
        <div><div class="stat-card-num">${paidCount}</div><div class="stat-card-label">Pagos confirmados</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#fef9c3;color:#854d0e;"><i class="fas fa-clock"></i></div>
        <div><div class="stat-card-num">${pendingCount}</div><div class="stat-card-label">Pendientes</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#e3edfd;color:#1a56db;"><i class="fas fa-coins"></i></div>
        <div><div class="stat-card-num">$${totalAmount.toLocaleString('es-CL')}</div><div class="stat-card-label">Total recaudado</div></div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon" style="background:#fdf6e3;color:#854d0e;"><i class="fas fa-list"></i></div>
        <div><div class="stat-card-num">${payments.length}</div><div class="stat-card-label">Total transacciones</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-body" style="padding:0;">
        <div class="table-responsive">
          <table class="data-table">
            <thead><tr>
              <th>Fecha</th><th>Paciente</th><th>Servicio</th><th>Monto</th><th>Método</th><th>Estado</th><th>MP ID</th>
            </tr></thead>
            <tbody>
              ${payments.length > 0 ? payments.map(p => {
                const b = bookingIndex[p.bookingId] || {};
                return `<tr>
                  <td>${p.createdAt ? formatDate(p.createdAt.split('T')[0]) : '—'}</td>
                  <td>
                    <strong>${b.userName || p.userName || '—'}</strong>
                    <div style="font-size:var(--text-xs);color:var(--text-muted);">${b.userEmail || p.userEmail || ''}</div>
                  </td>
                  <td>${b.serviceName || p.serviceName || '—'}</td>
                  <td><strong>$${Number(p.amount||0).toLocaleString('es-CL')}</strong></td>
                  <td>${p.method || 'Mercado Pago'}</td>
                  <td>${payStatusBadge(p.status)}</td>
                  <td><code style="font-size:10px;color:var(--text-muted);">${p.mpId || p.externalReference || '—'}</code></td>
                </tr>`;
              }).join('') : '<tr><td colspan="7" class="text-center text-muted" style="padding:40px;"><i class="fas fa-receipt" style="font-size:2rem;display:block;margin-bottom:12px;"></i>Sin pagos registrados aún.<br>Los pagos aparecerán aquí cuando las clientas completen su reserva.</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  `;
}

function bindAdminActions(container) {
  container.querySelectorAll('[data-confirm-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await bookingAPI.confirm(btn.dataset.confirmId);
        showToast('Cita confirmada. Se notificó al paciente por WhatsApp.', 'success');
        loadAdminPanel('overview');
      } catch (err) { showToast(err.message || 'Error al confirmar.', 'error'); }
    });
  });

  container.querySelectorAll('[data-reject-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = `
        <div class="form-group">
          <label class="form-label">Motivo del rechazo (opcional)</label>
          <textarea class="form-control" id="reject-reason" rows="3" placeholder="Ej: Sin disponibilidad para esa fecha, reagendar..."></textarea>
        </div>
      `;
      const footer = `
        <button class="btn btn-outline-blue" id="reject-cancel">Cancelar</button>
        <button class="btn btn-danger" id="reject-confirm-btn">Rechazar cita</button>
      `;
      createModal('Rechazar Cita', body, footer);
      document.getElementById('reject-cancel')?.addEventListener('click', closeModal);
      document.getElementById('reject-confirm-btn')?.addEventListener('click', async () => {
        const reason = document.getElementById('reject-reason').value;
        try {
          await bookingAPI.reject(btn.dataset.rejectId, reason);
          closeModal();
          showToast('Cita rechazada. Se notificó al paciente.', 'success');
          loadAdminPanel('overview');
        } catch (err) { showToast(err.message, 'error'); }
      });
    });
  });

  container.querySelectorAll('[data-detail-id]').forEach(el => {
    el.addEventListener('click', () => {
      let b;
      try { b = JSON.parse(el.dataset.detailJson); } catch { return; }
      const body = `
        <div class="booking-detail">
          <div class="detail-row"><label>Servicio</label><strong>${b.serviceName || b.service}</strong></div>
          <div class="detail-row"><label>Paciente</label><strong>${b.userName}</strong></div>
          <div class="detail-row"><label>Teléfono</label><a href="https://wa.me/${(b.userPhone||'').replace(/\D/g,'')}" target="_blank" class="text-primary">${b.userPhone || '—'}</a></div>
          <div class="detail-row"><label>Email</label><strong>${b.userEmail || '—'}</strong></div>
          <div class="detail-row"><label>Fecha</label><strong>${formatDate(b.date)}</strong></div>
          <div class="detail-row"><label>Hora</label><strong>${formatTime(b.time)} hrs</strong></div>
          <div class="detail-row"><label>Dirección</label><strong>${b.address || '—'}</strong></div>
          <div class="detail-row"><label>Notas</label><span>${b.notes || 'Sin notas'}</span></div>
          <div class="detail-row"><label>Precio</label><strong>$${Number(b.servicePrice||0).toLocaleString('es-CL')} CLP</strong></div>
          <div class="detail-row"><label>Estado</label>${statusBadge(b.status)}</div>
        </div>
      `;
      const footer = b.userPhone ? `<a href="https://wa.me/${b.userPhone.replace(/\D/g,'')}" target="_blank" class="btn btn-whatsapp" style="animation:none;"><i class="fab fa-whatsapp"></i> Contactar paciente</a>` : '';
      createModal('Detalle de Cita', body, footer);
    });
  });

  container.querySelectorAll('[data-admin-panel]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      loadAdminPanel(el.dataset.adminPanel);
    });
  });
}

export async function loadAdminPanel(panel) {
  document.querySelectorAll('.sidebar-link').forEach(l =>
    l.classList.toggle('active', l.dataset.adminPanel === panel)
  );
  const titles = { overview:'Resumen', agenda:'Agenda', bookings:'Todas las Citas', services:'Servicios', schedule:'Horarios', blocks:'Bloqueos de Agenda', clients:'Pacientes', users:'Usuarios', payments:'Pagos' };
  const title = document.getElementById('admin-topbar-title');
  if (title) title.textContent = titles[panel] || '';

  switch (panel) {
    case 'overview':  await loadOverview();    break;
    case 'agenda':    await loadAgenda();      break;
    case 'bookings':  await loadAllBookings(); break;
    case 'services':  await loadServices();    break;
    case 'schedule':  await loadSchedule();    break;
    case 'blocks':    await loadBlocks();      break;
    case 'clients':   await loadClients();     break;
    case 'users':     await loadUsers();       break;
    case 'payments':  await loadPayments();    break;
    default:          await loadOverview();
  }
}

export function initAdminScripts() {
  loadAdminPanel('overview');
  
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      loadAdminPanel(link.dataset.adminPanel);
    });
  });

  document.getElementById('admin-sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('admin-sidebar')?.classList.toggle('open');
  });
  
  document.getElementById('admin-logout-btn')?.addEventListener('click', () => {
    logout();
    router.navigate('landing');
  });

  document.querySelectorAll('[data-admin-panel]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      loadAdminPanel(el.dataset.adminPanel);
    });
  });
}
