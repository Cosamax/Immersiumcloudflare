/* ═══════════════════════════════════════════════════════════════════
   IMM-SHARED.JS — Composants partagés : navbar, footer, auth state
   ═══════════════════════════════════════════════════════════════════ */

const API_BASE = 'https://immersium-api.mx-cosaque.workers.dev';

/* ─── Toggle drawer mobile ─── */
function toggleDrawer() {
  const d = document.getElementById('pub-drawer');
  if (!d) return;
  const isOpen = d.classList.contains('open');
  if (isOpen) {
    d.classList.remove('open');
    document.body.style.overflow = '';
  } else {
    d.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
window.toggleDrawer = toggleDrawer;

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const d = document.getElementById('pub-drawer');
    if (d && d.classList.contains('open')) toggleDrawer();
  }
});

/* ─── Catalogue dropdown ─── */
(function initCatDropdown() {
  const items = document.querySelectorAll('.pub-nav-item-cat');
  items.forEach(it => {
    const link = it.querySelector(':scope > a');
    if (!link) return;
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 960) return;
      const canHover = window.matchMedia('(hover: hover)').matches;
      if (canHover) return;
      e.preventDefault();
      items.forEach(o => { if (o !== it) o.classList.remove('open'); });
      it.classList.toggle('open');
    });
  });
  document.addEventListener('click', (e) => {
    items.forEach(it => { if (!it.contains(e.target)) it.classList.remove('open'); });
  });
})();

/* ─── Auth state (via imm-token + API Worker) ─── */
(function initAuthNav() {
  const token = localStorage.getItem('imm-token');
  if (token) {
    fetch(API_BASE + '/api/auth/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
    .then(r => r.json())
    .then(data => {
      if (data.user) {
        updateNavAuth(true);
      } else {
        localStorage.removeItem('imm-token');
        localStorage.removeItem('imm-user');
        updateNavAuth(false);
      }
    })
    .catch(() => updateNavAuth(false));
  } else {
    updateNavAuth(false);
  }
})();

function updateNavAuth(isLoggedIn) {
  const loginBtn = document.querySelector('.nav-login-btn');
  const ctaBtn = document.querySelector('.nav-cta-btn');
  const dashBtn = document.querySelector('.nav-dash-btn');

  if (isLoggedIn) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (ctaBtn) ctaBtn.style.display = 'none';
    if (dashBtn) dashBtn.style.display = 'inline-flex';
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (ctaBtn) ctaBtn.style.display = 'inline-flex';
    if (dashBtn) dashBtn.style.display = 'none';
  }
}

/* ─── Sign out ─── */
async function signOut() {
  const token = localStorage.getItem('imm-token');
  if (token) {
    try {
      await fetch(API_BASE + '/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
      });
    } catch(e) {}
  }
  localStorage.removeItem('imm-token');
  localStorage.removeItem('imm-user');
  localStorage.removeItem('imm_session');
  sessionStorage.removeItem('imm-admin');
  window.location.href = 'index.html';
}
window.immSignOut = signOut;

/* ─── Utility ─── */
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, '&quot;');
}
window.escapeHtml = escapeHtml;
window.escapeAttr = escapeAttr;

/* ─── Reveal animations ─── */
(function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  function observe() {
    document.querySelectorAll('.reveal, .reveal-rise, .reveal-left').forEach(el => io.observe(el));
  }
  observe();
  document.addEventListener('imm-catalog-loaded', () => setTimeout(observe, 100));
})();
