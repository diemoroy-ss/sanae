// =========================================================
// SANAE — Main Entry Point & SPA Router
// =========================================================

import './styles/base.css';
import './styles/app.css';

import { renderLanding, initLandingScripts } from './views/landing.js';
import { renderAuth, initAuthScripts }       from './views/auth.js';
import { renderDashboard, initDashboardScripts } from './views/dashboard.js';
import { renderAdmin, initAdminScripts }         from './views/admin.js';
import { isLoggedIn, isAdmin }                   from './services/auth.js';

// =====================================================
// Router
// =====================================================

const ROUTES = {
  landing:   { render: renderLanding,   init: initLandingScripts,   public: true  },
  login:     { render: () => renderAuth('login'),    init: () => initAuthScripts('login'),    public: true  },
  register:  { render: () => renderAuth('register'), init: () => initAuthScripts('register'), public: true  },
  dashboard: { render: renderDashboard, init: initDashboardScripts, public: false, adminOnly: false },
  admin:     { render: renderAdmin,     init: initAdminScripts,     public: false, adminOnly: true  },
};

export const router = {
  navigate(route) {
    // Save to history
    history.pushState({ route }, '', `#${route}`);
    renderRoute(route);
  },
};

function renderRoute(routeName) {
  const route = ROUTES[routeName] || ROUTES['landing'];
  const root  = document.getElementById('root');
  if (!root) return;

  // Access guards
  if (!route.public) {
    if (!isLoggedIn()) {
      return renderRoute('login');
    }
    if (route.adminOnly && !isAdmin()) {
      return renderRoute('dashboard');
    }
    if (routeName === 'admin' && !isAdmin()) {
      return renderRoute('dashboard');
    }
  }

  // Redirect logged-in user away from auth pages
  if ((routeName === 'login' || routeName === 'register') && isLoggedIn()) {
    return renderRoute(isAdmin() ? 'admin' : 'dashboard');
  }

  // Render
  root.innerHTML = route.render();

  // Bind all [data-route] links
  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate(el.dataset.route);
    });
  });

  // Init scripts
  if (route.init) route.init();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// =====================================================
// Bootstrap
// =====================================================

function boot() {
  // Inject root element if not present
  if (!document.getElementById('root')) {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.innerHTML = '';
    document.body.appendChild(root);
  }

  // Add toast container
  if (!document.getElementById('toast-container')) {
    const tc = document.createElement('div');
    tc.id = 'toast-container';
    document.body.appendChild(tc);
  }

  // Determine initial route
  const hash = window.location.hash.replace('#', '') || 'landing';
  renderRoute(hash);

  // Handle back/forward
  window.addEventListener('popstate', (e) => {
    const route = e.state?.route || 'landing';
    renderRoute(route);
  });
}

document.addEventListener('DOMContentLoaded', boot);
