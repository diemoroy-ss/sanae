// =========================================================
// SANAE - Configuración Central de la Aplicación
// =========================================================
// Actualiza estas URLs según tu configuración de n8n y servicios

export const CONFIG = {
  // ---- n8n Webhooks (configurar en n8n.santisoft.cl) ----
  N8N_BASE: 'https://n8n.santisoft.cl/webhook',
  
  // Auth
  WEBHOOK_REGISTER:    '/sanae/auth/register',
  WEBHOOK_LOGIN:       '/sanae/auth/login',
  
  // Reservas (Bookings)
  WEBHOOK_BOOKING_CREATE:    '/sanae/booking/create',
  WEBHOOK_BOOKING_LIST:      '/sanae/booking/list',
  WEBHOOK_BOOKING_CONFIRM:   '/sanae/booking/confirm',
  WEBHOOK_BOOKING_REJECT:    '/sanae/booking/reject',
  WEBHOOK_BOOKING_CANCEL:    '/sanae/booking/cancel',
  WEBHOOK_BOOKING_ALL:       '/sanae/booking/all',       // Admin: todas
  
  // Servicios
  WEBHOOK_SERVICES_LIST:   '/sanae/services/list',
  WEBHOOK_SERVICES_CREATE: '/sanae/services/create',
  WEBHOOK_SERVICES_UPDATE: '/sanae/services/update',
  WEBHOOK_SERVICES_DELETE: '/sanae/services/delete',
  
  // Horarios
  WEBHOOK_SCHEDULE_GET:    '/sanae/schedule/get',
  WEBHOOK_SCHEDULE_SET:    '/sanae/schedule/set',
  WEBHOOK_SLOTS_AVAILABLE: '/sanae/slots/available',    // Slots disponibles por fecha

  // Bloqueos de agenda
  WEBHOOK_BLOCKS_LIST:   '/sanae/blocks/list',
  WEBHOOK_BLOCKS_CREATE: '/sanae/blocks/create',
  WEBHOOK_BLOCKS_DELETE: '/sanae/blocks/delete',
  
  // Pagos (Mercado Pago - confirmados via n8n)
  WEBHOOK_PAYMENT_CREATE:  '/sanae/payment/create',
  WEBHOOK_PAYMENT_STATUS:  '/sanae/payment/status',

  // ---- Mercado Pago ----
  // La public key se expone en frontend; la secret key SOLO en n8n
  MP_PUBLIC_KEY: 'TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // Reemplazar con tu PK real
  
  // ---- Evolution API (WhatsApp) ----
  EVOLUTION_BASE:      'https://api.santisoft.cl',
  EVOLUTION_INSTANCE:  'sanae',                          // Nombre de tu instancia
  EVOLUTION_API_KEY:   'YOUR_EVOLUTION_API_KEY',         // Reemplazar con tu API Key
  
  // ---- Admin ----
  // Lista de emails con acceso de administrador
  ADMIN_EMAILS: [
    'santisoftai@gmail.com',
    'xi.lezana21@gmail.com',
  ],
  
  // ---- App ----
  APP_URL:     'https://sanae.santisoft.cl',
  WA_PHONE:    '56972715562',
};
