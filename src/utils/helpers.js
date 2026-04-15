// =========================================================
// Toast Utility — Notificaciones in-app
// =========================================================

export function showToast(message, type = 'info', duration = 4000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'fa-check-circle',
    error:   'fa-times-circle',
    warning: 'fa-exclamation-triangle',
    info:    'fa-info-circle',
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'all 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// =========================================================
// Modal Utility
// =========================================================

export function createModal(title, bodyHTML, footerHTML = '') {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'active-modal';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close" id="modal-close-btn"><i class="fas fa-times"></i></button>
      </div>
      <div class="modal-body">${bodyHTML}</div>
      ${footerHTML ? `<div class="modal-footer">${footerHTML}</div>` : ''}
    </div>
  `;

  document.body.appendChild(overlay);
  document.getElementById('modal-close-btn').onclick = closeModal;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  return overlay;
}

export function closeModal() {
  const m = document.getElementById('active-modal');
  if (m) m.remove();
}

// =========================================================
// Date/Time Utilities
// =========================================================

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatTime(timeStr) {
  if (!timeStr) return '—';
  return timeStr.slice(0, 5); // HH:MM
}

export function formatDateTime(dateStr, timeStr) {
  return `${formatDate(dateStr)} a las ${formatTime(timeStr)}`;
}

export function todayISO() {
  return new Date().toISOString().split('T')[0];
}

export function getDayName(dayIndex) {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[dayIndex];
}

// =========================================================
// Status Badge
// =========================================================

export function statusBadge(status) {
  const map = {
    pending:          { label: 'Pendiente',  cls: 'badge-warning' },
    confirmed:        { label: 'Confirmada', cls: 'badge-success' },
    rejected:         { label: 'Rechazada',  cls: 'badge-danger'  },
    cancelled:        { label: 'Cancelada',  cls: 'badge-neutral' },
    completed:        { label: 'Completada', cls: 'badge-blue'    },
    paid:             { label: 'Pagada',     cls: 'badge-success' },
    refund_requested: { label: 'Reembolso Solicitado', cls: 'badge-warning'},
  };
  const s = map[status] || { label: status, cls: 'badge-neutral' };
  return `<span class="badge ${s.cls}">${s.label}</span>`;
}
