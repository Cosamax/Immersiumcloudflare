/* ═══════════════════════════════════════════════════════
   IMMERSIUM ADMIN — JS PRINCIPAL
   Navigation SPA avec onglets & sous-onglets
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ── SVG helpers ───────────────────────────────────────── */
const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${d}</svg>`;
const iconUsers    = () => svg('<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>');
const iconFormateur= () => svg('<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>');
const iconApprenant= () => svg('<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>');
const iconDoc      = () => svg('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/>');
const iconCalendar = () => svg('<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>');
const iconChart    = () => svg('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>');
const iconChat     = () => svg('<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>');
const iconPlay     = () => svg('<polygon points="5 3 19 12 5 21 5 3"/>');
const iconEdit     = () => svg('<path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>');
const iconDesktop  = () => svg('<rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/>');
const iconStar     = () => svg('<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>');
const iconPage     = () => svg('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>');
const iconFAQ      = () => svg('<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>');
const iconEuro     = () => svg('<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>');
const iconHeart    = () => svg('<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>');
const iconLock     = () => svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>');
const iconDown     = () => svg('<polyline points="6 9 12 15 18 9"/>');
const iconPlus     = () => svg('<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>');
const iconDownload = () => svg('<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>');
const iconTrash    = () => svg('<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>');
const iconEye      = () => svg('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>');
const iconCopy     = () => svg('<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>');

/* ── Config pages ─────────────────────────────────────── */
const PAGES = {
  dashboard: { label: 'Dashboard', section: 'Principal', render: renderDashboard },
  stats:     { label: 'Statistiques', section: 'Principal', render: renderStats },
  export:    { label: 'Export données', section: 'Principal', render: renderExport },

  users: {
    label: 'Utilisateurs', section: 'Utilisateurs',
    subtabs: [
      { id: 'users',      label: 'Tous',       icon: iconUsers },
      { id: 'formateurs', label: 'Formateurs', icon: iconFormateur },
      { id: 'apprenants', label: 'Apprenants', icon: iconApprenant },
      { id: 'demandes',   label: 'Demandes',   icon: iconDoc, badge: '12' }
    ],
    render: renderUsers
  },
  formateurs: {
    label: 'Formateurs', section: 'Utilisateurs',
    subtabs: [
      { id: 'users',      label: 'Tous',       icon: iconUsers },
      { id: 'formateurs', label: 'Formateurs', icon: iconFormateur },
      { id: 'apprenants', label: 'Apprenants', icon: iconApprenant },
      { id: 'demandes',   label: 'Demandes',   icon: iconDoc, badge: '12' }
    ],
    render: renderFormateurs
  },
  apprenants: {
    label: 'Apprenants', section: 'Utilisateurs',
    subtabs: [
      { id: 'users',      label: 'Tous',       icon: iconUsers },
      { id: 'formateurs', label: 'Formateurs', icon: iconFormateur },
      { id: 'apprenants', label: 'Apprenants', icon: iconApprenant },
      { id: 'demandes',   label: 'Demandes',   icon: iconDoc, badge: '12' }
    ],
    render: renderApprenants
  },
  demandes: {
    label: 'Demandes', section: 'Utilisateurs',
    subtabs: [
      { id: 'users',      label: 'Tous',       icon: iconUsers },
      { id: 'formateurs', label: 'Formateurs', icon: iconFormateur },
      { id: 'apprenants', label: 'Apprenants', icon: iconApprenant },
      { id: 'demandes',   label: 'Demandes',   icon: iconDoc, badge: '12' }
    ],
    render: renderDemandes
  },

  sessions: {
    label: 'Sessions', section: 'Formation',
    subtabs: [
      { id: 'sessions',    label: 'Sessions',    icon: iconCalendar },
      { id: 'results',     label: 'Résultats',   icon: iconChart },
      { id: 'coaching',    label: 'Coaching',    icon: iconChat },
      { id: 'simulations', label: 'Simulations', icon: iconPlay }
    ],
    render: renderSessions
  },
  results: {
    label: 'Résultats & scores', section: 'Formation',
    subtabs: [
      { id: 'sessions',    label: 'Sessions',    icon: iconCalendar },
      { id: 'results',     label: 'Résultats',   icon: iconChart },
      { id: 'coaching',    label: 'Coaching',    icon: iconChat },
      { id: 'simulations', label: 'Simulations', icon: iconPlay }
    ],
    render: renderResults
  },
  coaching: {
    label: 'Coaching', section: 'Formation',
    subtabs: [
      { id: 'sessions',    label: 'Sessions',    icon: iconCalendar },
      { id: 'results',     label: 'Résultats',   icon: iconChart },
      { id: 'coaching',    label: 'Coaching',    icon: iconChat },
      { id: 'simulations', label: 'Simulations', icon: iconPlay }
    ],
    render: renderCoaching
  },
  simulations: {
    label: 'Simulations VR', section: 'Formation',
    subtabs: [
      { id: 'sessions',    label: 'Sessions',    icon: iconCalendar },
      { id: 'results',     label: 'Résultats',   icon: iconChart },
      { id: 'coaching',    label: 'Coaching',    icon: iconChat },
      { id: 'simulations', label: 'Simulations', icon: iconPlay },
      { id: 'certs',       label: 'Certificats', icon: iconChart }
    ],
    render: renderSimulations
  },
  certs: {
    label: 'Certificats', section: 'Formation',
    subtabs: [
      { id: 'sessions',    label: 'Sessions',    icon: iconCalendar },
      { id: 'results',     label: 'Résultats',   icon: iconChart },
      { id: 'coaching',    label: 'Coaching',    icon: iconChat },
      { id: 'certs',       label: 'Certificats', icon: iconChart }
    ],
    render: renderCerts
  },
  orders: {
    label: 'Commandes', section: 'Commercial',
    subtabs: [
      { id: 'tarifs',      label: 'Tarifs',      icon: iconEuro },
      { id: 'promotions',  label: 'Promos',      icon: iconHeart },
      { id: 'orders',      label: 'Commandes',   icon: iconEuro }
    ],
    render: renderOrders
  },

  editor: {
    label: 'Éditeur de contenu', section: 'Contenu',
    subtabs: [
      { id: 'editor',   label: 'Éditeur',       icon: iconEdit },
      { id: 'hero',     label: "Accueil",        icon: iconDesktop },
      { id: 'vedettes', label: 'Vedettes',       icon: iconStar },
      { id: 'pages',    label: 'Pages',          icon: iconPage },
      { id: 'faq',      label: 'FAQ',            icon: iconFAQ }
    ],
    render: renderEditor
  },
  hero: {
    label: "Page d'accueil", section: 'Contenu',
    subtabs: [
      { id: 'editor',   label: 'Éditeur',       icon: iconEdit },
      { id: 'hero',     label: "Accueil",        icon: iconDesktop },
      { id: 'vedettes', label: 'Vedettes',       icon: iconStar },
      { id: 'pages',    label: 'Pages',          icon: iconPage },
      { id: 'faq',      label: 'FAQ',            icon: iconFAQ }
    ],
    render: renderHero
  },
  vedettes: {
    label: 'Vedettes', section: 'Contenu',
    subtabs: [
      { id: 'editor',   label: 'Éditeur',       icon: iconEdit },
      { id: 'hero',     label: "Accueil",        icon: iconDesktop },
      { id: 'vedettes', label: 'Vedettes',       icon: iconStar },
      { id: 'pages',    label: 'Pages',          icon: iconPage },
      { id: 'faq',      label: 'FAQ',            icon: iconFAQ }
    ],
    render: renderVedettes
  },
  pages: {
    label: 'Pages du site', section: 'Contenu',
    subtabs: [
      { id: 'editor',   label: 'Éditeur',       icon: iconEdit },
      { id: 'hero',     label: "Accueil",        icon: iconDesktop },
      { id: 'vedettes', label: 'Vedettes',       icon: iconStar },
      { id: 'pages',    label: 'Pages',          icon: iconPage },
      { id: 'faq',      label: 'FAQ',            icon: iconFAQ }
    ],
    render: renderPages
  },
  faq: {
    label: 'FAQ', section: 'Contenu',
    subtabs: [
      { id: 'editor',   label: 'Éditeur',       icon: iconEdit },
      { id: 'hero',     label: "Accueil",        icon: iconDesktop },
      { id: 'vedettes', label: 'Vedettes',       icon: iconStar },
      { id: 'pages',    label: 'Pages',          icon: iconPage },
      { id: 'faq',      label: 'FAQ',            icon: iconFAQ }
    ],
    render: renderFAQ
  },

  tarifs: {
    label: 'Tarifs & offres', section: 'Commercial',
    subtabs: [
      { id: 'tarifs',     label: 'Tarifs',     icon: iconEuro },
      { id: 'promotions', label: 'Promotions', icon: iconHeart }
    ],
    render: renderTarifs
  },
  promotions: {
    label: 'Promotions', section: 'Commercial',
    subtabs: [
      { id: 'tarifs',     label: 'Tarifs',     icon: iconEuro },
      { id: 'promotions', label: 'Promotions', icon: iconHeart }
    ],
    render: renderPromotions
  },

  access: { label: 'Accès & API', section: 'Système', render: renderAccess }
};

/* ── State & DOM ───────────────────────────────────────── */
let currentPage = 'dashboard';
const $ = id => document.getElementById(id);
const pageArea      = $('pageArea');
const breadcrumb    = $('breadcrumbPage');
const subtabsBar    = $('subtabsBar');
const subtabsInner  = $('subtabsInner');
const appEl         = $('app');
const notifPanel    = $('notifPanel');
const overlayBg     = $('overlayBg');
const toastContainer = $('toastContainer');

/* ── Navigation ────────────────────────────────────────── */
function navigate(pageId) {
  if (!PAGES[pageId]) return;
  currentPage = pageId;
  const page = PAGES[pageId];

  breadcrumb.textContent = page.label;

  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId);
  });

  if (page.subtabs && page.subtabs.length) {
    subtabsBar.style.display = '';
    subtabsInner.innerHTML = page.subtabs.map(tab => `
      <button class="subtab-btn ${tab.id === pageId ? 'active' : ''}" data-page="${tab.id}">
        ${tab.icon()}
        <span>${tab.label}</span>
        ${tab.badge ? `<span class="subtab-badge">${tab.badge}</span>` : ''}
      </button>
    `).join('');
    subtabsInner.querySelectorAll('.subtab-btn').forEach(btn => {
      btn.addEventListener('click', () => navigate(btn.dataset.page));
    });
  } else {
    subtabsBar.style.display = 'none';
  }

  pageArea.innerHTML = '';
  page.render(pageArea);
  history.pushState({ page: pageId }, '', `#${pageId}`);

  if (window.innerWidth <= 768) appEl.classList.remove('mobile-open');
}

/* ── UI Events ─────────────────────────────────────────── */
$('sidebarToggle').addEventListener('click', () => {
  appEl.classList.toggle('sidebar-collapsed');
  localStorage.setItem('sidebarCollapsed', appEl.classList.contains('sidebar-collapsed'));
});

$('menuToggle').addEventListener('click', () => appEl.classList.toggle('mobile-open'));

if (localStorage.getItem('sidebarCollapsed') === 'true') appEl.classList.add('sidebar-collapsed');

$('appNav').addEventListener('click', e => {
  const item = e.target.closest('[data-page]');
  if (item) { e.preventDefault(); navigate(item.dataset.page); }
});

$('notifBtn').addEventListener('click', e => {
  e.stopPropagation();
  const h = notifPanel.hidden;
  notifPanel.hidden = !h;
  overlayBg.hidden = h;
});
$('notifClose').addEventListener('click', () => { notifPanel.hidden = true; overlayBg.hidden = true; });
overlayBg.addEventListener('click', () => { notifPanel.hidden = true; overlayBg.hidden = true; });

document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); $('globalSearch').focus(); $('globalSearch').select(); }
  if (e.key === 'Escape') $('globalSearch').blur();
});

document.querySelector('.nav-back').addEventListener('click', e => { e.preventDefault(); showToast('Retour au site principal', 'warn'); });
$('logoutBtn').addEventListener('click', async () => {
  if (!confirm('Se déconnecter ?')) return;
  try {
    await window.IMM_SUPABASE.auth.signOut();
    location.replace('../login.html');
  } catch(e) {
    showToast('Erreur déconnexion : ' + e.message, 'error');
  }
});

// Afficher l'utilisateur connecté dès que le guard a validé
window.addEventListener('admin:ready', (e) => {
  const user = e.detail.user;
  const profile = e.detail.profile;
  const name = profile.full_name || profile.display_name || user.email.split('@')[0];
  const email = user.email;
  const initial = (name[0] || 'A').toUpperCase();
  const uName = document.getElementById('userName');
  const uAvatar = document.getElementById('userAvatar');
  const uRole = uName?.parentElement.querySelector('.user-role');
  if (uName) uName.textContent = name;
  if (uAvatar) uAvatar.textContent = initial;
  if (uRole) uRole.textContent = email;
});

window.addEventListener('popstate', e => { if (e.state && e.state.page) navigate(e.state.page); });

/* ── Toast ─────────────────────────────────────────────── */
function showToast(msg, type) {
  const t = document.createElement('div');
  t.className = `toast ${type || ''}`;
  t.textContent = msg;
  toastContainer.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* ── Badges ────────────────────────────────────────────── */
function badgeStatus(s) {
  const m = { 'Confirmée':'badge-success','Terminée':'badge-accent','En attente':'badge-warn','Annulée':'badge-danger','Actif':'badge-success','Inactif':'badge-muted','Terminé':'badge-success','En cours':'badge-accent','Brouillon':'badge-muted','Publié':'badge-success','Traitée':'badge-success' };
  return `<span class="badge ${m[s]||'badge-muted'}">${s}</span>`;
}
function badgePlan(p) {
  const m = { 'Découverte':'badge-muted','Pack Mensuel':'badge-accent','Intensif':'badge-success' };
  return `<span class="badge ${m[p]||'badge-muted'}">${p}</span>`;
}
function badgeRole(r) {
  const m = { 'admin':'badge-danger','formateur':'badge-accent','apprenant':'badge-muted' };
  return `<span class="badge ${m[r]||'badge-muted'}">${r}</span>`;
}

/* ── Sample data ───────────────────────────────────────── */
function sampleUsers() {
  const names = ['Marie Dupont','Lucas Bernard','Sophie Martin','Antoine Leroy','Emma Petit','Julien Roux','Léa Blanc','Thomas Gris','Camille Noir','Paul Vert','Clara Bleu','Nathan Rouge','Julie Mauve','Arthur Orange','Jade Citron'];
  const plans = ['Découverte','Pack Mensuel','Intensif'];
  const roles = ['apprenant','apprenant','apprenant','formateur','apprenant','apprenant','apprenant','admin'];
  const colors = ['#024AFF','#0D9488','#CC0033','#FF6B00','#7C3AED','#DB2777','#2563EB','#059669'];
  return names.map((n, i) => ({
    name: n,
    email: n.toLowerCase().replace(/[\s]/g,'.').replace(/[éèê]/g,'e').replace(/[àâ]/g,'a')+'@exemple.fr',
    plan: plans[i % plans.length],
    role: roles[i % roles.length],
    date: `${String(Math.floor(Math.random()*28)+1).padStart(2,'0')}/${String(Math.floor(Math.random()*12)+1).padStart(2,'0')}/2026`,
    initials: n.split(' ').map(w => w[0]).join(''),
    color: colors[i % colors.length]
  }));
}

function initials(n) { return n.split(' ').map(w => w[0]).join(''); }
function randomColor(name) {
  const colors = ['#024AFF','#0D9488','#CC0033','#FF6B00','#7C3AED','#DB2777'];
  let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xFFFFFF;
  return colors[h % colors.length];
}

/* ═══════════════════════════════════════════════════════
   RENDER FUNCTIONS
   ═══════════════════════════════════════════════════════ */

/* ─── DASHBOARD ──────────────────────────────────────── */
async function renderDashboard(el) {
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // État de chargement
  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Tableau de <em>bord</em></h1>
        <p>Vue d'ensemble de la plateforme Immersium — ${today}</p>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi accent"><div class="value" style="color:var(--ink-mute)">…</div><div class="label">Utilisateurs inscrits</div></div>
      <div class="kpi success"><div class="value" style="color:var(--ink-mute)">…</div><div class="label">Formateurs</div></div>
      <div class="kpi warn"><div class="value" style="color:var(--ink-mute)">…</div><div class="label">Parties jouées</div></div>
      <div class="kpi"><div class="value" style="color:var(--ink-mute)">…</div><div class="label">Simulations actives</div></div>
    </div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  if (!sb) { el.innerHTML = `<div class="wrap"><div style="padding:40px;color:#DC2626">Supabase non chargé</div></div>`; return; }

  // Charger en parallèle
  const [profilesRes, simsRes, progressRes] = await Promise.all([
    sb.from('profiles').select('id,email,role,created_at,full_name').order('created_at', { ascending: false }),
    sb.from('simulations').select('game_id,name,domain,active,challenge_count'),
    sb.from('user_progress').select('user_id,game_id,challenge_num,score,updated_at').order('updated_at', { ascending: false }),
  ]);

  const profiles = profilesRes.data || [];
  const sims = simsRes.data || [];
  const progress = progressRes.data || [];

  // Calculs
  const totalUsers = profiles.length;
  const admins = profiles.filter(p => p.role === 'admin').length;
  const formateurs = profiles.filter(p => p.role === 'formateur').length;
  const apprenants = profiles.filter(p => p.role === 'apprenant' || !p.role).length;
  const totalPlays = progress.length;
  const activeSims = sims.filter(s => s.active).length;

  // Utilisateurs inscrits ces 30 derniers jours
  const thirty = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentUsers = profiles.filter(p => new Date(p.created_at) > thirty).length;

  // Top simulations jouées
  const playsByGame = {};
  progress.forEach(p => { playsByGame[p.game_id] = (playsByGame[p.game_id] || 0) + 1; });
  const topSims = Object.entries(playsByGame)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([gid, count]) => {
      const s = sims.find(x => x.game_id === gid);
      return { name: s?.name || gid.toUpperCase(), count, domain: s?.domain };
    });

  // Dernières inscriptions
  const recentProfiles = profiles.slice(0, 5);

  // Dernière activité (progressions)
  const recentActivity = progress.slice(0, 5).map(p => {
    const user = profiles.find(u => u.id === p.user_id);
    const sim = sims.find(s => s.game_id === p.game_id);
    return {
      userName: user?.full_name || user?.email?.split('@')[0] || 'Utilisateur',
      simName: sim?.name || p.game_id?.toUpperCase(),
      challengeNum: p.challenge_num || 1,
      score: p.score || 0,
      updatedAt: p.updated_at
    };
  });

  const maxTopCount = topSims.length > 0 ? topSims[0].count : 1;

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Tableau de <em>bord</em></h1>
        <p>Vue d'ensemble de la plateforme Immersium — ${today}</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-secondary" onclick="renderDashboard(document.getElementById('pageArea'))">
          ${iconDownload()}<span>Actualiser</span>
        </button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi accent">
        <div class="value">${totalUsers}</div>
        <div class="label">Utilisateurs inscrits</div>
        <div style="font-size:11px;color:var(--ink-mute);margin-top:4px">+${recentUsers} ce mois</div>
      </div>
      <div class="kpi success">
        <div class="value">${formateurs}</div>
        <div class="label">Formateurs</div>
        <div style="font-size:11px;color:var(--ink-mute);margin-top:4px">${apprenants} apprenants · ${admins} admin</div>
      </div>
      <div class="kpi warn">
        <div class="value">${totalPlays}</div>
        <div class="label">Parties jouées</div>
        <div style="font-size:11px;color:var(--ink-mute);margin-top:4px">tous jeux confondus</div>
      </div>
      <div class="kpi">
        <div class="value">${activeSims}<span style="font-size:22px;color:var(--ink-mute);font-weight:400"> / ${sims.length}</span></div>
        <div class="label">Simulations actives</div>
        <div style="font-size:11px;color:var(--ink-mute);margin-top:4px">${sims.reduce((t,s)=>t+(s.challenge_count||21),0)} défis en ligne</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card sessions-table">
        <div class="card-h">
          <h2>Dernières activités</h2>
          <button class="btn btn-secondary btn-sm" onclick="navigate('results')">Voir tout</button>
        </div>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse">
            <thead><tr>
              <th style="padding:9px 16px;text-align:left;font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--line)">Apprenant</th>
              <th style="padding:9px 16px;text-align:left;font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--line)">Simulation</th>
              <th style="padding:9px 16px;text-align:left;font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--line)">Défi</th>
              <th style="padding:9px 16px;text-align:left;font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--line)">Score</th>
              <th style="padding:9px 16px;text-align:left;font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--line)">Quand</th>
            </tr></thead>
            <tbody>
              ${recentActivity.length > 0 ? recentActivity.map(a => `
                <tr>
                  <td style="padding:10px 16px;font-size:13px;font-weight:550">${escapeHtml(a.userName)}</td>
                  <td style="padding:10px 16px;font-size:13px">${escapeHtml(a.simName)}</td>
                  <td style="padding:10px 16px;font-size:12px;font-family:var(--f-mono);color:var(--ink-mute)">Défi ${a.challengeNum}</td>
                  <td style="padding:10px 16px;font-size:13px;font-family:var(--f-mono);font-weight:600">${a.score}</td>
                  <td style="padding:10px 16px;font-size:12px;color:var(--ink-mute)">${timeAgo(a.updatedAt)}</td>
                </tr>`).join('') : '<tr><td colspan="5" style="padding:30px;text-align:center;color:var(--ink-mute);font-size:13px">Aucune activité pour le moment</td></tr>'}
            </tbody>
          </table>
        </div>
      </div>

      <div style="display:flex;flex-direction:column;gap:16px">
        <div class="card">
          <div class="card-h"><h2>Top simulations</h2></div>
          <div class="card-body">
            ${topSims.length > 0 ? topSims.map(s => {
              const pct = Math.round((s.count / maxTopCount) * 100);
              return `<div class="stat-bar-row">
                <span class="label" style="font-weight:500">${escapeHtml(s.name)}</span>
                <div class="bar"><div class="fill" style="width:${pct}%"></div></div>
                <span class="val">${s.count}</span>
              </div>`;
            }).join('') : '<div style="padding:20px;text-align:center;color:var(--ink-mute);font-size:13px">Aucune partie jouée pour le moment</div>'}
          </div>
        </div>

        <div class="card">
          <div class="card-h"><h2>Dernières inscriptions</h2></div>
          <div class="card-body" style="padding:8px 16px">
            ${recentProfiles.length > 0 ? recentProfiles.map(p => `
              <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--line-soft)">
                <div style="width:28px;height:28px;border-radius:50%;background:var(--marine-soft);color:var(--marine);display:flex;align-items:center;justify-content:center;font-weight:600;font-size:11px">${(p.full_name || p.email)[0].toUpperCase()}</div>
                <div style="flex:1;min-width:0">
                  <div style="font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(p.full_name || p.email.split('@')[0])}</div>
                  <div style="font-size:11px;color:var(--ink-mute)">${escapeHtml(p.role || 'apprenant')} · ${timeAgo(p.created_at)}</div>
                </div>
              </div>`).join('') : '<div style="padding:20px;text-align:center;color:var(--ink-mute);font-size:13px">Aucune inscription</div>'}
          </div>
        </div>
      </div>
    </div>

    <h3 style="font-size:14px;font-weight:700;margin-bottom:14px;color:var(--ink-soft)">Accès rapides</h3>
    <div class="quick-links">
      ${[['users','Utilisateurs',iconUsers],['formateurs','Formateurs',iconFormateur],['apprenants','Apprenants',iconApprenant],['sessions','Sessions',iconCalendar],['results','Résultats',iconChart],['coaching','Coaching',iconChat],['simulations','Simulations',iconPlay],['editor','Éditeur',iconEdit],['hero','Accueil',iconDesktop],['faq','FAQ',iconFAQ],['tarifs','Tarifs',iconEuro],['promotions','Promos',iconHeart],['stats','Stats',iconChart],['export','Export',iconDownload],['access','API',iconLock]]
        .map(([id,label,icon]) => `<div class="quick-link" onclick="navigate('${id}')"><div class="ico">${icon()}</div><span>${label}</span></div>`).join('')}
    </div>
  </div>`;
}

// Formater un timestamp en "il y a X"
function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'à l\'instant';
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days}j`;
  const months = Math.floor(days / 30);
  if (months < 12) return `il y a ${months} mois`;
  return d.toLocaleDateString('fr-FR');
}

window.renderDashboard = renderDashboard;

/* ─── STATS ──────────────────────────────────────────── */
async function renderStats(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Statis<em>tiques</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Récupération des données…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const [profilesRes, progressRes, simsRes, sessionsRes, demandesRes] = await Promise.all([
    sb.from('profiles').select('id,email,role,created_at'),
    sb.from('user_progress').select('user_id,game_id,challenge_num,score,updated_at'),
    sb.from('simulations').select('game_id,name,domain,challenge_count,active'),
    sb.from('training_sessions').select('id,status,start_date').then(r => r).catch(() => ({ data: [] })),
    sb.from('training_requests').select('id,status,created_at').then(r => r).catch(() => ({ data: [] })),
  ]);

  const profiles = profilesRes.data || [];
  const progress = progressRes.data || [];
  const sims = simsRes.data || [];
  const sessions = sessionsRes.data || [];
  const demandes = demandesRes.data || [];

  // ── KPI globaux
  const totalUsers = profiles.length;
  const totalProgress = progress.length;
  const totalSessions = sessions.length;
  const formateurs = profiles.filter(p => p.role === 'formateur').length;
  const completedSims = progress.filter(p => {
    const sim = sims.find(s => s.game_id === p.game_id);
    return p.challenge_num >= (sim?.challenge_count || 21);
  }).length;
  const avgScore = progress.length > 0 ? Math.round(progress.reduce((t, p) => t + (p.score || 0), 0) / progress.length * 10) / 10 : 0;

  // ── Inscriptions sur 12 derniers mois
  const monthsData = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    const count = profiles.filter(p => {
      const cd = new Date(p.created_at);
      return cd >= d && cd < next;
    }).length;
    monthsData.push({ label, count });
  }

  // ── Activité (progressions) sur 12 derniers mois
  const activityData = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const label = d.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    const count = progress.filter(p => {
      const pd = new Date(p.updated_at);
      return pd >= d && pd < next;
    }).length;
    activityData.push({ label, count });
  }

  // ── Top simulations
  const playsByGame = {};
  progress.forEach(p => { playsByGame[p.game_id] = (playsByGame[p.game_id] || 0) + 1; });
  const topSims = Object.entries(playsByGame)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([gid, count]) => {
      const s = sims.find(x => x.game_id === gid);
      return { name: s?.name || gid.toUpperCase(), domain: s?.domain || '', count };
    });
  const maxPlays = topSims.length > 0 ? topSims[0].count : 1;

  // ── Répartition par domaine
  const byDomain = {};
  progress.forEach(p => {
    const s = sims.find(x => x.game_id === p.game_id);
    const d = s?.domain || 'Inconnu';
    byDomain[d] = (byDomain[d] || 0) + 1;
  });
  const domainData = Object.entries(byDomain).sort((a, b) => b[1] - a[1]);
  const totalDomain = domainData.reduce((t, [,v]) => t + v, 0) || 1;

  // ── Répartition par rôle
  const roleDist = {
    admin: profiles.filter(p => p.role === 'admin').length,
    formateur: formateurs,
    apprenant: profiles.filter(p => p.role === 'apprenant' || !p.role).length,
  };

  // ── Répartition des statuts de session
  const sessionStatuses = {
    planned: sessions.filter(s => s.status === 'planned').length,
    active: sessions.filter(s => s.status === 'active').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
  };

  // ── Rendu
  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Statis<em>tiques</em></h1>
        <p>Vue analytique de l'activité Immersium</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-secondary" onclick="renderStats(document.getElementById('pageArea'))">${iconDownload()}<span>Actualiser</span></button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi accent"><div class="value">${totalUsers}</div><div class="label">Comptes inscrits</div></div>
      <div class="kpi success"><div class="value">${totalProgress}</div><div class="label">Entrées progression</div></div>
      <div class="kpi"><div class="value">${completedSims}</div><div class="label">Simulations terminées</div></div>
      <div class="kpi warn"><div class="value">${avgScore}</div><div class="label">Score moyen</div></div>
    </div>

    <div class="cards-grid" style="grid-template-columns:1fr 1fr">
      <div class="card">
        <div class="card-h"><h2>Inscriptions — 12 derniers mois</h2></div>
        <div class="card-body" style="padding:18px">
          ${renderLineChart(monthsData, 'var(--marine)')}
        </div>
      </div>
      <div class="card">
        <div class="card-h"><h2>Activité — 12 derniers mois</h2></div>
        <div class="card-body" style="padding:18px">
          ${renderLineChart(activityData, 'var(--jade)')}
        </div>
      </div>
    </div>

    <div class="cards-grid" style="grid-template-columns:1fr 1fr">
      <div class="card">
        <div class="card-h"><h2>Top simulations jouées</h2></div>
        <div class="card-body">
          ${topSims.length > 0 ? topSims.map(s => {
            const pct = Math.round((s.count / maxPlays) * 100);
            return `<div class="stat-bar-row">
              <span class="label" style="font-weight:500">${escapeHtml(s.name)}</span>
              <div class="bar"><div class="fill" style="width:${pct}%"></div></div>
              <span class="val">${s.count}</span>
            </div>`;
          }).join('') : '<div style="padding:20px;text-align:center;color:var(--ink-mute);font-size:13px">Aucune activité</div>'}
        </div>
      </div>
      <div class="card">
        <div class="card-h"><h2>Répartition par domaine</h2></div>
        <div class="card-body">
          ${domainData.length > 0 ? renderDonut(domainData, totalDomain) : '<div style="padding:20px;text-align:center;color:var(--ink-mute);font-size:13px">Aucune donnée</div>'}
        </div>
      </div>
    </div>

    <div class="cards-grid" style="grid-template-columns:1fr 1fr">
      <div class="card">
        <div class="card-h"><h2>Répartition des utilisateurs</h2></div>
        <div class="card-body">
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
            <div style="text-align:center;padding:16px;background:var(--bg-alt);border-radius:var(--r-sm)">
              <div style="font-family:var(--f-display);font-size:28px;font-weight:500;color:var(--marine)">${roleDist.apprenant}</div>
              <div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;margin-top:4px">Apprenants</div>
            </div>
            <div style="text-align:center;padding:16px;background:var(--bg-alt);border-radius:var(--r-sm)">
              <div style="font-family:var(--f-display);font-size:28px;font-weight:500;color:var(--jade)">${roleDist.formateur}</div>
              <div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;margin-top:4px">Formateurs</div>
            </div>
            <div style="text-align:center;padding:16px;background:var(--bg-alt);border-radius:var(--r-sm)">
              <div style="font-family:var(--f-display);font-size:28px;font-weight:500;color:var(--coral)">${roleDist.admin}</div>
              <div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;margin-top:4px">Admin</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-h"><h2>État des sessions (${totalSessions})</h2></div>
        <div class="card-body">
          ${totalSessions === 0 ? '<div style="padding:20px;text-align:center;color:var(--ink-mute);font-size:13px">Aucune session créée</div>' : `
            <div class="stat-bar-row"><span class="label">Planifiées</span><div class="bar"><div class="fill" style="width:${Math.round(sessionStatuses.planned/totalSessions*100)}%;background:var(--orange)"></div></div><span class="val">${sessionStatuses.planned}</span></div>
            <div class="stat-bar-row"><span class="label">En cours</span><div class="bar"><div class="fill" style="width:${Math.round(sessionStatuses.active/totalSessions*100)}%;background:var(--jade)"></div></div><span class="val">${sessionStatuses.active}</span></div>
            <div class="stat-bar-row"><span class="label">Terminées</span><div class="bar"><div class="fill" style="width:${Math.round(sessionStatuses.completed/totalSessions*100)}%;background:var(--marine)"></div></div><span class="val">${sessionStatuses.completed}</span></div>
            <div class="stat-bar-row"><span class="label">Annulées</span><div class="bar"><div class="fill" style="width:${Math.round(sessionStatuses.cancelled/totalSessions*100)}%;background:var(--coral)"></div></div><span class="val">${sessionStatuses.cancelled}</span></div>
          `}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-h"><h2>Résumé</h2></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
          <div style="text-align:center;padding:16px;background:var(--bg-alt);border-radius:var(--r)">
            <div style="font-family:var(--f-display);font-size:26px;font-weight:500;color:var(--marine)">${sims.filter(s=>s.active).length}</div>
            <div style="font-size:11px;color:var(--ink-mute);margin-top:4px;letter-spacing:.05em">SIMULATIONS ACTIVES</div>
          </div>
          <div style="text-align:center;padding:16px;background:var(--bg-alt);border-radius:var(--r)">
            <div style="font-family:var(--f-display);font-size:26px;font-weight:500;color:var(--jade)">${sims.reduce((t,s)=>t+(s.challenge_count||21),0)}</div>
            <div style="font-size:11px;color:var(--ink-mute);margin-top:4px;letter-spacing:.05em">DÉFIS EN LIGNE</div>
          </div>
          <div style="text-align:center;padding:16px;background:var(--bg-alt);border-radius:var(--r)">
            <div style="font-family:var(--f-display);font-size:26px;font-weight:500;color:var(--orange)">${demandes.filter(d=>d.status==='pending').length}</div>
            <div style="font-size:11px;color:var(--ink-mute);margin-top:4px;letter-spacing:.05em">DEMANDES EN ATTENTE</div>
          </div>
          <div style="text-align:center;padding:16px;background:var(--bg-alt);border-radius:var(--r)">
            <div style="font-family:var(--f-display);font-size:26px;font-weight:500;color:var(--coral)">${Math.max(...progress.map(p=>p.score||0), 0)}</div>
            <div style="font-size:11px;color:var(--ink-mute);margin-top:4px;letter-spacing:.05em">SCORE MAXIMUM</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

// ── Mini line chart SVG
function renderLineChart(data, color) {
  if (!data || data.length === 0) return '<div style="padding:30px;text-align:center;color:var(--ink-mute);font-size:13px">Aucune donnée</div>';
  const max = Math.max(...data.map(d => d.count), 1);
  const w = 520, h = 200, padX = 36, padY = 20, padBottom = 30;
  const innerW = w - padX * 2;
  const innerH = h - padY - padBottom;
  const step = data.length > 1 ? innerW / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = padX + i * step;
    const y = padY + innerH - (d.count / max) * innerH;
    return { x, y, d };
  });

  const pathLine = points.map((p, i) => (i === 0 ? 'M' : 'L') + p.x + ',' + p.y).join(' ');
  const pathArea = pathLine + ` L${points[points.length-1].x},${padY+innerH} L${points[0].x},${padY+innerH} Z`;

  // Ticks Y
  const ticks = [0, Math.ceil(max/2), max];

  return `<svg viewBox="0 0 ${w} ${h}" style="width:100%;height:auto;font-family:var(--f-body);font-size:10px">
    ${ticks.map(t => {
      const y = padY + innerH - (t / max) * innerH;
      return `<line x1="${padX}" y1="${y}" x2="${w-padX}" y2="${y}" stroke="var(--line)" stroke-dasharray="2 3"/>
        <text x="${padX-6}" y="${y+3}" text-anchor="end" fill="var(--ink-mute)">${t}</text>`;
    }).join('')}
    <path d="${pathArea}" fill="${color}" fill-opacity="0.08"/>
    <path d="${pathLine}" fill="none" stroke="${color}" stroke-width="2"/>
    ${points.map((p, i) => `
      <circle cx="${p.x}" cy="${p.y}" r="3" fill="${color}"/>
      <text x="${p.x}" y="${h-8}" text-anchor="middle" fill="var(--ink-mute)" style="font-size:9px">${i % 2 === 0 || data.length <= 6 ? p.d.label : ''}</text>
    `).join('')}
  </svg>
  <div style="text-align:center;font-size:11px;color:var(--ink-mute);margin-top:6px">Total : <strong style="color:var(--ink)">${data.reduce((t,d)=>t+d.count,0)}</strong></div>`;
}

// ── Donut SVG
function renderDonut(data, total) {
  const colors = ['#0E1A2B', '#16A34A', '#C9A96E', '#E85D3B', '#1E3A8A', '#F59E0B', '#7C3AED'];
  let offset = 0;
  const r = 60, cx = 90, cy = 90;
  const circumference = 2 * Math.PI * r;

  const segments = data.map(([name, value], i) => {
    const pct = value / total;
    const length = pct * circumference;
    const dashArray = `${length} ${circumference - length}`;
    const dashOffset = -offset;
    offset += length;
    return { name, value, pct, color: colors[i % colors.length], dashArray, dashOffset };
  });

  return `<div style="display:flex;gap:18px;align-items:center">
    <svg width="180" height="180" viewBox="0 0 180 180" style="flex-shrink:0">
      ${segments.map(s => `
        <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}"
                stroke-width="20" stroke-dasharray="${s.dashArray}" stroke-dashoffset="${s.dashOffset}"
                transform="rotate(-90 ${cx} ${cy})"/>`).join('')}
      <text x="${cx}" y="${cy-4}" text-anchor="middle" font-family="var(--f-display)" font-size="22" font-weight="500" fill="var(--ink)">${total}</text>
      <text x="${cx}" y="${cy+14}" text-anchor="middle" font-size="10" fill="var(--ink-mute)" style="letter-spacing:.05em;text-transform:uppercase">parties</text>
    </svg>
    <div style="flex:1;display:grid;gap:6px">
      ${segments.map(s => `
        <div style="display:flex;align-items:center;gap:8px;font-size:12px">
          <div style="width:10px;height:10px;border-radius:2px;background:${s.color};flex-shrink:0"></div>
          <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(s.name)}</span>
          <span style="color:var(--ink-mute);font-family:var(--f-mono);font-size:11px">${s.value}</span>
          <span style="font-weight:600;font-family:var(--f-mono);font-size:11px;color:var(--ink);min-width:36px;text-align:right">${Math.round(s.pct*100)}%</span>
        </div>`).join('')}
    </div>
  </div>`;
}

window.renderStats = renderStats;

/* ─── EXPORT ─────────────────────────────────────────── */
async function renderExport(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Export <em>données</em></h1>
        <p>Téléchargez vos données Immersium au format CSV ou JSON</p>
      </div>
    </div>

    <div style="padding:14px 18px;background:var(--bg-alt);border-left:3px solid var(--marine);border-radius:var(--r-sm);margin-bottom:24px;font-size:13px;color:var(--ink-soft);line-height:1.6">
      <strong style="color:var(--ink)">CSV</strong> : compatible Excel (encodage UTF-8 avec BOM, séparateur point-virgule).
      <strong style="color:var(--ink)">JSON</strong> : format brut complet pour réimport ou traitement externe.
      Les données sensibles (mots de passe, tokens) ne sont jamais exportées.
    </div>

    <div class="export-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px">
      ${[
        { key: 'users', title: 'Comptes utilisateurs', desc: 'Tous les comptes : apprenants, formateurs, admins', icon: 'users' },
        { key: 'apprenants', title: 'Apprenants', desc: 'Uniquement les comptes apprenants avec leur progression', icon: 'student' },
        { key: 'formateurs', title: 'Formateurs', desc: 'Liste des formateurs enregistrés', icon: 'teacher' },
        { key: 'progress', title: 'Progressions', desc: 'Toutes les entrées de progression (user, jeu, défi, score)', icon: 'chart' },
        { key: 'simulations', title: 'Simulations', desc: 'Catalogue complet des 15 simulations (méta-données)', icon: 'play' },
        { key: 'challenges', title: 'Défis & questions', desc: 'Tous les défis avec questions et notions (945 lignes)', icon: 'edit' },
        { key: 'sessions', title: 'Sessions de formation', desc: 'Groupes de formation créés', icon: 'calendar' },
        { key: 'demandes', title: 'Demandes de formation', desc: 'Demandes reçues depuis le site', icon: 'mail' },
        { key: 'certificates', title: 'Certificats', desc: 'Certificats délivrés aux apprenants', icon: 'chart' },
        { key: 'orders', title: 'Commandes', desc: 'Commandes Stripe (paiements ponctuels)', icon: 'mail' },
        { key: 'subscriptions', title: 'Abonnements', desc: 'Abonnements actifs et passés', icon: 'chart' },
      ].map(item => `
        <div class="export-card card" style="padding:20px">
          <div style="width:40px;height:40px;border-radius:var(--r-sm);background:var(--marine-soft);color:var(--marine);display:flex;align-items:center;justify-content:center;margin-bottom:12px">
            ${exportIcon(item.icon)}
          </div>
          <h3 style="font-size:15px;font-weight:600;margin-bottom:4px">${item.title}</h3>
          <p style="font-size:12px;color:var(--ink-mute);line-height:1.5;margin-bottom:14px;min-height:36px">${item.desc}</p>
          <div style="display:flex;gap:6px">
            <button class="btn btn-primary btn-sm" onclick="exportData('${item.key}','csv')" style="flex:1">
              ${iconDownload()}<span>CSV</span>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="exportData('${item.key}','json')" style="flex:1">
              <span>JSON</span>
            </button>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="card" style="padding:20px;margin-top:20px">
      <h3 style="font-size:14px;font-weight:600;margin-bottom:10px">Export complet</h3>
      <p style="font-size:12px;color:var(--ink-mute);margin-bottom:14px">
        Un unique fichier JSON contenant toutes les tables d'un seul coup (utile pour sauvegarde ou migration).
      </p>
      <button class="btn btn-primary" onclick="exportAllData()">
        ${iconDownload()}<span>Télécharger le dump complet (JSON)</span>
      </button>
    </div>
  </div>`;
}

function exportIcon(kind) {
  const icons = {
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
    student: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    teacher: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><polygon points="10 8 16 12 10 16 10 8"/><circle cx="12" cy="12" r="10"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>',
  };
  return icons[kind] || icons.play;
}

// Télécharger un blob
function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Convertir array d'objets en CSV
function arrayToCsv(rows, columns) {
  if (!rows || rows.length === 0) return '\uFEFF(aucune donnée)';
  const cols = columns || Object.keys(rows[0]);
  const escape = (v) => {
    if (v == null) return '';
    if (Array.isArray(v) || typeof v === 'object') v = JSON.stringify(v);
    const s = String(v);
    if (/[;"\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const lines = [cols.join(';')];
  rows.forEach(r => lines.push(cols.map(c => escape(r[c])).join(';')));
  return '\uFEFF' + lines.join('\n');  // BOM pour Excel
}

const EXPORT_CONFIGS = {
  users: {
    table: 'profiles',
    select: 'id,email,full_name,role,created_at',
    filename: 'immersium-utilisateurs',
  },
  apprenants: {
    table: 'profiles',
    select: 'id,email,full_name,role,created_at',
    filter: (q) => q.or('role.eq.apprenant,role.is.null'),
    filename: 'immersium-apprenants',
  },
  formateurs: {
    table: 'profiles',
    select: 'id,email,full_name,role,created_at',
    filter: (q) => q.eq('role', 'formateur'),
    filename: 'immersium-formateurs',
  },
  progress: {
    table: 'user_progress',
    select: '*',
    filename: 'immersium-progressions',
  },
  simulations: {
    table: 'simulations',
    select: '*',
    filename: 'immersium-simulations',
  },
  challenges: {
    table: 'challenges',
    select: 'game_id,challenge_num,question_index,type,challenge_title,session_name,question,prompt,points,active',
    filename: 'immersium-defis',
  },
  sessions: {
    table: 'training_sessions',
    select: '*',
    filename: 'immersium-sessions',
  },
  demandes: {
    table: 'training_requests',
    select: '*',
    filename: 'immersium-demandes',
  },
  certificates: {
    table: 'certificates',
    select: '*',
    filename: 'immersium-certificats',
  },
  orders: {
    table: 'orders',
    select: '*',
    filename: 'immersium-commandes',
  },
  subscriptions: {
    table: 'subscriptions',
    select: '*',
    filename: 'immersium-abonnements',
  },
};

window.exportData = async function(key, format) {
  const cfg = EXPORT_CONFIGS[key];
  if (!cfg) return;
  const sb = window.IMM_SUPABASE;
  showToast(`Export ${cfg.filename} en cours…`, '');

  try {
    let query = sb.from(cfg.table).select(cfg.select);
    if (cfg.filter) query = cfg.filter(query);
    const { data, error } = await query;
    if (error) {
      if ((error.message || '').toLowerCase().includes('relation') || error.code === '42P01') {
        showToast(`Table "${cfg.table}" non initialisée`, 'error');
        return;
      }
      throw error;
    }

    const date = new Date().toISOString().slice(0, 10);
    if (format === 'csv') {
      const csv = arrayToCsv(data || []);
      downloadBlob(csv, `${cfg.filename}-${date}.csv`, 'text/csv;charset=utf-8');
    } else {
      const json = JSON.stringify({ exported_at: new Date().toISOString(), table: cfg.table, count: data?.length || 0, rows: data || [] }, null, 2);
      downloadBlob(json, `${cfg.filename}-${date}.json`, 'application/json');
    }
    showToast(`${(data||[]).length} lignes exportées`, 'success');
  } catch (e) {
    console.error('[EXPORT]', e);
    showToast('Erreur export : ' + (e.message || e), 'error');
  }
};

window.exportAllData = async function() {
  const sb = window.IMM_SUPABASE;
  showToast('Export complet en cours (peut prendre quelques secondes)…', '');

  try {
    const dump = {
      exported_at: new Date().toISOString(),
      exported_by: window.IMM_USER?.email || 'unknown',
      tables: {}
    };

    for (const [key, cfg] of Object.entries(EXPORT_CONFIGS)) {
      try {
        let query = sb.from(cfg.table).select(cfg.select);
        if (cfg.filter) query = cfg.filter(query);
        const { data, error } = await query;
        if (error) {
          dump.tables[key] = { error: error.message, rows: [] };
        } else {
          dump.tables[key] = { count: (data || []).length, rows: data || [] };
        }
      } catch (e) {
        dump.tables[key] = { error: e.message, rows: [] };
      }
    }

    const date = new Date().toISOString().slice(0, 10);
    downloadBlob(JSON.stringify(dump, null, 2), `immersium-dump-complet-${date}.json`, 'application/json');
    const totalRows = Object.values(dump.tables).reduce((t, tb) => t + (tb.count || 0), 0);
    showToast(`Dump complet téléchargé (${totalRows} lignes au total)`, 'success');
  } catch (e) {
    showToast('Erreur export : ' + (e.message || e), 'error');
  }
};

window.renderExport = renderExport;

/* ─── USERS ──────────────────────────────────────────── */
function renderUsers(el) {
  const users = sampleUsers();
  window._allUsers = users;
  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left"><h1>Gestion des <em>utilisateurs</em></h1><p>${users.length} comptes au total</p></div>
      <div class="page-h-right"><button class="btn btn-primary" onclick="openUserModal()">${iconPlus()}<span>Nouvel utilisateur</span></button></div>
    </div>
    <div class="kpi-grid">
      <div class="kpi accent"><div class="value">${users.length}</div><div class="label">Total comptes</div></div>
      <div class="kpi"><div class="value">3</div><div class="label">Administrateurs</div></div>
      <div class="kpi success"><div class="value">72</div><div class="label">Inscrits ce mois</div></div>
    </div>
    <div class="filter-bar">
      <select id="roleFilter" onchange="filterUsers()">
        <option value="">Tous les rôles</option>
        <option value="admin">Admin</option>
        <option value="formateur">Formateur</option>
        <option value="apprenant">Apprenant</option>
      </select>
      <input type="search" class="filter-search" id="userSearch" placeholder="Rechercher…" oninput="filterUsers()"/>
    </div>
    <div class="table-wrap">
      <table><thead><tr><th>Utilisateur</th><th>Plan</th><th>Rôle</th><th>Inscrit le</th><th>Actions</th></tr></thead>
      <tbody id="usersBody">${renderUsersRows(users)}</tbody></table>
    </div>
  </div>
  <div class="modal-overlay" id="userModalOverlay" hidden>
    <div class="modal">
      <div class="modal-h"><h3>Nouvel utilisateur</h3><button class="modal-close" onclick="closeUserModal()">${svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>')}</button></div>
      <div class="modal-body">
        <div class="form-group"><label class="form-label">Nom complet</label><input class="form-input" placeholder="ex. Marie Dupont"/></div>
        <div class="form-group"><label class="form-label">Email</label><input class="form-input" type="email" placeholder="marie@exemple.fr"/></div>
        <div class="form-group"><label class="form-label">Plan</label><select class="form-select"><option>Découverte</option><option>Pack Mensuel</option><option>Intensif</option></select></div>
        <div class="form-group"><label class="form-label">Rôle</label><select class="form-select"><option>apprenant</option><option>formateur</option><option>admin</option></select></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeUserModal()">Annuler</button>
        <button class="btn btn-primary" onclick="closeUserModal();showToast('Utilisateur créé','success')">Créer</button>
      </div>
    </div>
  </div>`;
}

function renderUsersRows(rows) {
  return rows.map(u => `<tr>
    <td><div class="user-cell"><div class="avatar" style="background:${u.color}">${u.initials}</div>
    <div class="user-cell-info"><div class="name">${u.name}</div><div class="email">${u.email}</div></div></div></td>
    <td>${badgePlan(u.plan)}</td>
    <td>${badgeRole(u.role)}</td>
    <td style="font-family:var(--f-mono);font-size:11px;color:var(--ink-mute)">${u.date}</td>
    <td><div style="display:flex;gap:6px">
      <button class="btn btn-secondary btn-sm" onclick="showToast('Édition…')">${iconEdit()}</button>
      <button class="btn btn-danger btn-sm" onclick="showToast('Supprimé','error')">${iconTrash()}</button>
    </div></td>
  </tr>`).join('');
}

window.filterUsers = () => {
  if (!window._allUsers) return;
  const role = document.getElementById('roleFilter').value.toLowerCase();
  const q = document.getElementById('userSearch').value.toLowerCase();
  const filtered = window._allUsers.filter(u => (!role || u.role === role) && (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
  document.getElementById('usersBody').innerHTML = renderUsersRows(filtered);
};
window.openUserModal = () => { document.getElementById('userModalOverlay').hidden = false; };
window.closeUserModal = () => { document.getElementById('userModalOverlay').hidden = true; };

/* ─── FORMATEURS ─────────────────────────────────────── */
async function renderFormateurs(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left"><h1>Gestion des <em>formateurs</em></h1><p>Chargement…</p></div>
    </div>
    <div style="text-align:center;padding:40px;color:var(--ink-mute)">Récupération des formateurs…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const [formRes, progressRes] = await Promise.all([
    sb.from('profiles').select('*').eq('role', 'formateur').order('created_at', { ascending: false }),
    sb.from('user_progress').select('user_id,updated_at'),
  ]);

  const formateurs = formRes.data || [];
  const progress = progressRes.data || [];

  // Un formateur est "actif" si ses apprenants (ou lui-même) ont une activité récente (< 30j)
  // Pour l'instant, on considère simplement qu'un formateur connu est actif.
  // À terme on liera formateur → groupe → apprenants.
  const activeCount = formateurs.length;

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Gestion des <em>formateurs</em></h1>
        <p>${formateurs.length} formateur${formateurs.length > 1 ? 's' : ''} enregistré${formateurs.length > 1 ? 's' : ''}</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-secondary" onclick="renderFormateurs(document.getElementById('pageArea'))">${iconDownload()}<span>Actualiser</span></button>
        <button class="btn btn-primary" onclick="openPromoteModal()">${iconPlus()}<span>Promouvoir un utilisateur</span></button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi accent"><div class="value">${formateurs.length}</div><div class="label">Formateurs</div></div>
      <div class="kpi success"><div class="value">${activeCount}</div><div class="label">Actifs</div></div>
    </div>

    ${formateurs.length === 0 ? `
      <div class="card" style="padding:60px 20px;text-align:center">
        <h3 style="font-size:17px;margin-bottom:8px">Aucun formateur pour le moment</h3>
        <p style="color:var(--ink-mute);font-size:13px;margin-bottom:20px">
          Pour désigner un formateur, promouvez un compte existant en changeant son rôle en <code>formateur</code>.
        </p>
        <button class="btn btn-primary" onclick="openPromoteModal()">${iconPlus()}<span>Promouvoir un utilisateur</span></button>
      </div>
    ` : `
      <div class="cards-grid">
        ${formateurs.map(f => {
          const name = f.full_name || f.display_name || f.email.split('@')[0];
          const initial = name[0].toUpperCase();
          return `<div class="card" style="padding:18px;display:flex;gap:14px;align-items:flex-start">
            <div class="avatar" style="background:var(--marine);width:44px;height:44px;font-size:14px;border-radius:var(--r);color:white;display:flex;align-items:center;justify-content:center;font-weight:600">${initial}</div>
            <div style="flex:1;min-width:0">
              <div style="font-weight:700;font-size:14px">${escapeHtml(name)}</div>
              <div style="font-size:12px;color:var(--ink-mute)">${escapeHtml(f.email)}</div>
              <div style="font-size:11px;margin-top:6px;color:var(--ink-soft)">Inscrit ${timeAgo(f.created_at)}</div>
              <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;gap:8px">
                <span class="badge badge-success">Formateur</span>
                <div style="display:flex;gap:4px">
                  <button class="btn btn-secondary btn-sm" onclick="changeRole('${f.id}','apprenant','${escapeHtml(name).replace(/'/g, '&#39;')}')" title="Rétrograder en apprenant">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>
    `}
  </div>

  <!-- Modal promotion -->
  <div class="modal-overlay" id="promoteModalOverlay" hidden>
    <div class="modal" style="max-width:520px">
      <div class="modal-h">
        <h3>Promouvoir en formateur</h3>
        <button class="modal-close" onclick="closePromoteModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Email de l'utilisateur à promouvoir</label>
          <input type="email" class="form-input" id="promote-email" placeholder="ex: formateur@exemple.fr">
          <small style="color:var(--ink-mute);font-size:11px;display:block;margin-top:4px">
            L'utilisateur doit déjà avoir créé un compte. Son rôle passera de <code>apprenant</code> à <code>formateur</code>.
          </small>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closePromoteModal()">Annuler</button>
        <button class="btn btn-primary" onclick="promoteUser()">Promouvoir</button>
      </div>
    </div>
  </div>`;
}

window.openPromoteModal = function() {
  document.getElementById('promoteModalOverlay').hidden = false;
  setTimeout(() => document.getElementById('promote-email')?.focus(), 50);
};
window.closePromoteModal = function() {
  document.getElementById('promoteModalOverlay').hidden = true;
  const inp = document.getElementById('promote-email'); if (inp) inp.value = '';
};

window.promoteUser = async function() {
  const email = document.getElementById('promote-email').value.trim().toLowerCase();
  if (!email) { showToast('Email requis', 'error'); return; }
  const sb = window.IMM_SUPABASE;
  try {
    const { data: user, error: findErr } = await sb.from('profiles').select('id,email,role,full_name').eq('email', email).maybeSingle();
    if (findErr) throw findErr;
    if (!user) { showToast(`Aucun compte avec l'email ${email}`, 'error'); return; }
    if (user.role === 'formateur') { showToast(`${email} est déjà formateur`, ''); return; }
    if (user.role === 'admin') {
      if (!confirm(`${email} est administrateur. Confirmer la rétrogradation en formateur ?`)) return;
    }
    const { error } = await sb.from('profiles').update({ role: 'formateur' }).eq('id', user.id);
    if (error) throw error;
    showToast(`${email} promu formateur`, 'success');
    closePromoteModal();
    renderFormateurs(document.getElementById('pageArea'));
  } catch (e) {
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

window.changeRole = async function(userId, newRole, userName) {
  if (!confirm(`Rétrograder ${userName} en ${newRole} ?`)) return;
  const sb = window.IMM_SUPABASE;
  try {
    const { error } = await sb.from('profiles').update({ role: newRole }).eq('id', userId);
    if (error) throw error;
    showToast(`Rôle mis à jour`, 'success');
    renderFormateurs(document.getElementById('pageArea'));
  } catch (e) {
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

window.renderFormateurs = renderFormateurs;

/* ─── APPRENANTS ─────────────────────────────────────── */
async function renderApprenants(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left"><h1>Suivi des <em>apprenants</em></h1><p>Chargement…</p></div>
    </div>
    <div style="text-align:center;padding:40px;color:var(--ink-mute)">Récupération des apprenants…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const [profilesRes, progressRes, simsRes] = await Promise.all([
    sb.from('profiles').select('*').or('role.eq.apprenant,role.is.null').order('created_at', { ascending: false }),
    sb.from('user_progress').select('user_id,game_id,challenge_num,score,updated_at'),
    sb.from('simulations').select('game_id,name,challenge_count'),
  ]);

  const apprenants = profilesRes.data || [];
  const progress = progressRes.data || [];
  const sims = simsRes.data || [];

  // Calculer stats par apprenant
  const statsByUser = {};
  progress.forEach(p => {
    if (!statsByUser[p.user_id]) {
      statsByUser[p.user_id] = { games: new Set(), completedGames: new Set(), score: 0, lastActivity: null, gameProgress: {} };
    }
    const u = statsByUser[p.user_id];
    u.games.add(p.game_id);
    u.score = Math.max(u.score, p.score || 0);  // on prend le plus haut score trouvé
    if (!u.lastActivity || new Date(p.updated_at) > new Date(u.lastActivity)) {
      u.lastActivity = p.updated_at;
    }
    // Suivi progression par jeu
    const sim = sims.find(s => s.game_id === p.game_id);
    const totalChal = sim?.challenge_count || 21;
    const curChal = p.challenge_num || 1;
    if (!u.gameProgress[p.game_id] || curChal > u.gameProgress[p.game_id].cur) {
      u.gameProgress[p.game_id] = { cur: curChal, total: totalChal };
    }
    if (curChal >= totalChal) u.completedGames.add(p.game_id);
  });

  // Total des parties terminées
  const totalCompleted = Array.from(Object.values(statsByUser)).reduce((t, u) => t + u.completedGames.size, 0);
  const activeApprenants = apprenants.filter(a => statsByUser[a.id]).length;
  const avgProgress = apprenants.length > 0
    ? Math.round(Object.values(statsByUser).reduce((t, u) => {
        const games = Object.values(u.gameProgress);
        if (games.length === 0) return t;
        const avgPct = games.reduce((s, g) => s + (g.cur / g.total), 0) / games.length;
        return t + avgPct;
      }, 0) / Math.max(apprenants.length, 1) * 100)
    : 0;

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Suivi des <em>apprenants</em></h1>
        <p>${apprenants.length} apprenants · ${activeApprenants} actifs</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-secondary" onclick="renderApprenants(document.getElementById('pageArea'))">${iconDownload()}<span>Actualiser</span></button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi accent"><div class="value">${apprenants.length}</div><div class="label">Apprenants inscrits</div></div>
      <div class="kpi success"><div class="value">${activeApprenants}</div><div class="label">Actifs (ayant joué)</div></div>
      <div class="kpi"><div class="value">${totalCompleted}</div><div class="label">Simulations terminées</div></div>
      <div class="kpi warn"><div class="value">${avgProgress}%</div><div class="label">Progression moyenne</div></div>
    </div>

    <div class="filter-bar">
      <input type="search" class="filter-search" id="app-search" placeholder="Rechercher par nom ou email…" oninput="filterApprenantTable(this.value)">
    </div>

    <div class="table-wrap"><table id="app-table">
      <thead><tr>
        <th>Apprenant</th>
        <th>Email</th>
        <th>Parties jouées</th>
        <th>Terminées</th>
        <th>Meilleur score</th>
        <th>Dernière activité</th>
        <th>Actions</th>
      </tr></thead>
      <tbody>
        ${apprenants.length > 0 ? apprenants.map(u => {
          const s = statsByUser[u.id];
          const name = u.full_name || u.display_name || u.email.split('@')[0];
          const initial = name[0].toUpperCase();
          const played = s?.games.size || 0;
          const done = s?.completedGames.size || 0;
          const score = s?.score || 0;
          const lastAct = s?.lastActivity ? timeAgo(s.lastActivity) : 'jamais';
          return `<tr data-search="${escapeHtml((name + ' ' + u.email).toLowerCase())}">
            <td><div class="user-cell"><div class="avatar" style="background:var(--marine)">${initial}</div><div class="user-cell-info"><div class="name">${escapeHtml(name)}</div></div></div></td>
            <td style="font-size:12px;color:var(--ink-mute)">${escapeHtml(u.email)}</td>
            <td style="font-family:var(--f-mono)">${played}</td>
            <td style="font-family:var(--f-mono);color:${done > 0 ? 'var(--jade)' : 'var(--ink-mute)'}">${done}</td>
            <td style="font-family:var(--f-mono);font-weight:600">${score} pts</td>
            <td style="font-size:12px;color:var(--ink-mute)">${lastAct}</td>
            <td><button class="btn btn-secondary btn-sm" onclick="viewApprenantDetail('${u.id}')">Voir</button></td>
          </tr>`;
        }).join('') : '<tr><td colspan="7" style="padding:40px;text-align:center;color:var(--ink-mute)">Aucun apprenant pour le moment</td></tr>'}
      </tbody>
    </table></div>
  </div>

  <!-- Modal détail apprenant -->
  <div class="modal-overlay" id="appModalOverlay" hidden>
    <div class="modal" style="max-width:720px">
      <div class="modal-h">
        <h3 id="appModalTitle">Apprenant</h3>
        <button class="modal-close" onclick="closeApprenantModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="appModalBody"></div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeApprenantModal()">Fermer</button>
      </div>
    </div>
  </div>`;

  // Stocker pour le modal détail
  window._apprenantsData = { apprenants, statsByUser, sims };
}

window.filterApprenantTable = function(q) {
  const query = (q || '').toLowerCase().trim();
  document.querySelectorAll('#app-table tbody tr').forEach(tr => {
    const search = tr.dataset.search || '';
    tr.style.display = !query || search.includes(query) ? '' : 'none';
  });
};

window.viewApprenantDetail = function(userId) {
  const { apprenants, statsByUser, sims } = window._apprenantsData || {};
  const u = apprenants?.find(a => a.id === userId);
  if (!u) return;
  const s = statsByUser[userId] || { games: new Set(), completedGames: new Set(), gameProgress: {}, score: 0 };
  const name = u.full_name || u.email.split('@')[0];

  const gamesList = Object.entries(s.gameProgress).map(([gid, p]) => {
    const sim = sims.find(x => x.game_id === gid);
    const pct = Math.round((p.cur / p.total) * 100);
    const done = p.cur >= p.total;
    return `<div style="padding:12px 14px;border:1px solid var(--line);border-radius:var(--r-sm);margin-bottom:8px;display:grid;grid-template-columns:1fr auto auto;gap:14px;align-items:center">
      <div>
        <div style="font-weight:600;font-size:14px">${escapeHtml(sim?.name || gid.toUpperCase())}</div>
        <div style="font-size:11px;color:var(--ink-mute);margin-top:2px">${escapeHtml(sim?.domain || '')}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;min-width:180px">
        <div class="progress" style="flex:1"><div class="progress-fill" style="width:${pct}%;background:${done ? 'var(--jade)' : 'var(--marine)'}"></div></div>
        <span style="font-size:11px;color:var(--ink-mute);font-family:var(--f-mono)">${p.cur}/${p.total}</span>
      </div>
      <span class="badge ${done ? 'badge-success' : 'badge-info'}">${done ? 'Terminé' : 'En cours'}</span>
    </div>`;
  }).join('') || '<div style="padding:30px;text-align:center;color:var(--ink-mute);font-size:13px">Aucune simulation jouée</div>';

  document.getElementById('appModalTitle').textContent = name;
  document.getElementById('appModalBody').innerHTML = `
    <div style="display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--line)">
      <div style="width:56px;height:56px;border-radius:50%;background:var(--marine);color:white;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:600">${name[0].toUpperCase()}</div>
      <div>
        <div style="font-size:18px;font-weight:600">${escapeHtml(name)}</div>
        <div style="font-size:13px;color:var(--ink-mute)">${escapeHtml(u.email)}</div>
        <div style="font-size:11px;color:var(--ink-mute);margin-top:2px">Inscrit ${timeAgo(u.created_at)}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:20px">
      <div style="padding:12px;background:var(--bg-alt);border-radius:var(--r-sm);text-align:center">
        <div style="font-size:22px;font-weight:600;font-family:var(--f-display)">${s.games.size}</div>
        <div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;margin-top:4px">Simulations</div>
      </div>
      <div style="padding:12px;background:var(--bg-alt);border-radius:var(--r-sm);text-align:center">
        <div style="font-size:22px;font-weight:600;font-family:var(--f-display);color:var(--jade)">${s.completedGames.size}</div>
        <div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;margin-top:4px">Terminées</div>
      </div>
      <div style="padding:12px;background:var(--bg-alt);border-radius:var(--r-sm);text-align:center">
        <div style="font-size:22px;font-weight:600;font-family:var(--f-display)">${s.score}</div>
        <div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;margin-top:4px">Meilleur score</div>
      </div>
    </div>

    <h4 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:10px;font-weight:600">Simulations en cours</h4>
    ${gamesList}`;
  document.getElementById('appModalOverlay').hidden = false;
};

window.closeApprenantModal = function() {
  document.getElementById('appModalOverlay').hidden = true;
};

window.renderApprenants = renderApprenants;

/* ─── DEMANDES ───────────────────────────────────────── */
async function renderDemandes(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Demandes de <em>formation</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Récupération des demandes…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const { data, error } = await sb.from('training_requests').select('*').order('created_at', { ascending: false });

  if (error) {
    const isMissing = (error.message || '').includes('training_requests') || error.code === '42P01' || (error.message || '').toLowerCase().includes('relation');
    el.innerHTML = `<div class="wrap">
      <div class="page-h"><div class="page-h-left"><h1>Demandes de <em>formation</em></h1></div></div>
      <div class="card" style="padding:30px;max-width:620px">
        <h3 style="margin-bottom:10px;color:${isMissing ? 'var(--ink)' : '#DC2626'}">${isMissing ? 'Table non initialisée' : 'Erreur'}</h3>
        <p style="font-size:13px;color:var(--ink-mute);line-height:1.6;margin-bottom:14px">
          ${isMissing
            ? 'La table <code>training_requests</code> n\'existe pas encore. Lance le SQL <code>sql/06-training-requests.sql</code> dans Supabase SQL Editor.'
            : escapeHtml(error.message)}
        </p>
      </div>
    </div>`;
    return;
  }

  const demandes = data || [];
  const pending = demandes.filter(d => d.status === 'pending');
  const contacted = demandes.filter(d => d.status === 'contacted');
  const accepted = demandes.filter(d => d.status === 'accepted');
  const rejected = demandes.filter(d => d.status === 'rejected');

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Demandes de <em>formation</em></h1>
        <p>${demandes.length} demande${demandes.length > 1 ? 's' : ''} · ${pending.length} en attente</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-secondary" onclick="renderDemandes(document.getElementById('pageArea'))">${iconDownload()}<span>Actualiser</span></button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi warn"><div class="value">${pending.length}</div><div class="label">En attente</div></div>
      <div class="kpi accent"><div class="value">${contacted.length}</div><div class="label">Contactées</div></div>
      <div class="kpi success"><div class="value">${accepted.length}</div><div class="label">Acceptées</div></div>
      <div class="kpi"><div class="value">${rejected.length}</div><div class="label">Refusées</div></div>
    </div>

    <div class="filter-bar" style="display:flex;gap:8px">
      <select class="form-input" id="dem-filter-status" onchange="filterDemandes()" style="max-width:180px">
        <option value="">Tous les statuts</option>
        <option value="pending">En attente</option>
        <option value="contacted">Contactées</option>
        <option value="accepted">Acceptées</option>
        <option value="rejected">Refusées</option>
        <option value="archived">Archivées</option>
      </select>
      <input type="search" class="filter-search" id="dem-search" placeholder="Rechercher par nom, email, organisation…" oninput="filterDemandes()" style="flex:1">
    </div>

    ${demandes.length === 0 ? `
      <div class="card" style="padding:60px 20px;text-align:center">
        <h3 style="font-size:17px;margin-bottom:8px">Aucune demande pour le moment</h3>
        <p style="color:var(--ink-mute);font-size:13px">
          Les demandes arrivent depuis la page <code>demander-formation.html</code>.
        </p>
      </div>` : `
      <div class="table-wrap"><table id="dem-table">
        <thead><tr>
          <th>Demandeur</th>
          <th>Organisation</th>
          <th>Type / Taille</th>
          <th>Échéance</th>
          <th>Statut</th>
          <th>Reçue</th>
          <th>Actions</th>
        </tr></thead>
        <tbody>
          ${demandes.map(d => `
            <tr data-status="${d.status}" data-search="${escapeHtml((d.first_name + ' ' + d.last_name + ' ' + d.email + ' ' + d.organization).toLowerCase())}">
              <td>
                <div style="font-weight:600;font-size:13px">${escapeHtml(d.first_name + ' ' + d.last_name)}</div>
                <div style="font-size:11px;color:var(--ink-mute)">${escapeHtml(d.email)}</div>
              </td>
              <td>
                <div style="font-size:13px">${escapeHtml(d.organization)}</div>
                ${d.role_in_org ? `<div style="font-size:11px;color:var(--ink-mute)">${escapeHtml(d.role_in_org)}</div>` : ''}
              </td>
              <td>
                <div style="font-size:12px">${escapeHtml(d.structure_type || '—')}</div>
                <div style="font-size:11px;color:var(--ink-mute)">${escapeHtml(d.group_size || '—')}</div>
              </td>
              <td style="font-size:12px">${escapeHtml(d.timeline || '—')}</td>
              <td>${statusBadge(d.status)}</td>
              <td style="font-size:11px;color:var(--ink-mute)">${timeAgo(d.created_at)}</td>
              <td>
                <button class="btn btn-secondary btn-sm" onclick="viewDemandeDetail('${d.id}')">Voir</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table></div>
    `}
  </div>

  <!-- Modal détail demande -->
  <div class="modal-overlay" id="demModalOverlay" hidden>
    <div class="modal" style="max-width:720px">
      <div class="modal-h">
        <h3 id="demModalTitle">Détail de la demande</h3>
        <button class="modal-close" onclick="closeDemandeModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="demModalBody"></div>
      <div class="modal-footer" id="demModalFooter"></div>
    </div>
  </div>`;

  window._demandesData = demandes;
}

function statusBadge(s) {
  const map = {
    'pending': ['badge-warn', 'En attente'],
    'contacted': ['badge-info', 'Contactée'],
    'accepted': ['badge-success', 'Acceptée'],
    'rejected': ['badge-danger', 'Refusée'],
    'archived': ['badge-muted', 'Archivée']
  };
  const [cls, label] = map[s] || ['badge-muted', s || '—'];
  return `<span class="badge ${cls}">${label}</span>`;
}

window.filterDemandes = function() {
  const status = document.getElementById('dem-filter-status').value;
  const q = (document.getElementById('dem-search').value || '').toLowerCase().trim();
  document.querySelectorAll('#dem-table tbody tr').forEach(tr => {
    const matchStatus = !status || tr.dataset.status === status;
    const matchSearch = !q || (tr.dataset.search || '').includes(q);
    tr.style.display = (matchStatus && matchSearch) ? '' : 'none';
  });
};

window.viewDemandeDetail = function(id) {
  const d = (window._demandesData || []).find(x => x.id === id);
  if (!d) return;
  document.getElementById('demModalTitle').textContent = `${d.first_name} ${d.last_name} — ${d.organization}`;
  document.getElementById('demModalBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px">
      <div><div style="font-size:11px;color:var(--ink-mute);letter-spacing:.05em;text-transform:uppercase;font-weight:600;margin-bottom:2px">Email</div>
        <a href="mailto:${escapeHtml(d.email)}" style="font-size:13px;color:var(--marine)">${escapeHtml(d.email)}</a></div>
      <div><div style="font-size:11px;color:var(--ink-mute);letter-spacing:.05em;text-transform:uppercase;font-weight:600;margin-bottom:2px">Téléphone</div>
        <div style="font-size:13px">${escapeHtml(d.phone || '—')}</div></div>
      <div><div style="font-size:11px;color:var(--ink-mute);letter-spacing:.05em;text-transform:uppercase;font-weight:600;margin-bottom:2px">Fonction</div>
        <div style="font-size:13px">${escapeHtml(d.role_in_org || '—')}</div></div>
      <div><div style="font-size:11px;color:var(--ink-mute);letter-spacing:.05em;text-transform:uppercase;font-weight:600;margin-bottom:2px">Type de structure</div>
        <div style="font-size:13px">${escapeHtml(d.structure_type)}</div></div>
      <div><div style="font-size:11px;color:var(--ink-mute);letter-spacing:.05em;text-transform:uppercase;font-weight:600;margin-bottom:2px">Taille du groupe</div>
        <div style="font-size:13px">${escapeHtml(d.group_size)}</div></div>
      <div><div style="font-size:11px;color:var(--ink-mute);letter-spacing:.05em;text-transform:uppercase;font-weight:600;margin-bottom:2px">Échéance</div>
        <div style="font-size:13px">${escapeHtml(d.timeline || '—')}</div></div>
    </div>

    ${d.simulations_interest ? `
    <div style="margin-bottom:18px">
      <div style="font-size:11px;color:var(--ink-mute);letter-spacing:.05em;text-transform:uppercase;font-weight:600;margin-bottom:6px">Simulations intéressantes</div>
      <div style="font-size:13px;padding:10px 14px;background:var(--bg-alt);border-radius:var(--r-sm)">${escapeHtml(d.simulations_interest)}</div>
    </div>` : ''}

    <div style="margin-bottom:18px">
      <div style="font-size:11px;color:var(--ink-mute);letter-spacing:.05em;text-transform:uppercase;font-weight:600;margin-bottom:6px">Besoin exprimé</div>
      <div style="font-size:13.5px;line-height:1.6;padding:14px;background:var(--bg-alt);border-radius:var(--r-sm);white-space:pre-wrap">${escapeHtml(d.message)}</div>
    </div>

    <div style="margin-bottom:18px;padding:14px;background:var(--paper);border:1px solid var(--line);border-radius:var(--r-sm)">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="font-size:11px;color:var(--ink-mute);letter-spacing:.05em;text-transform:uppercase;font-weight:600">Statut actuel</div>
        ${statusBadge(d.status)}
      </div>
      <div style="font-size:11px;color:var(--ink-mute)">Reçue ${timeAgo(d.created_at)}${d.contacted_at ? ' · Contactée ' + timeAgo(d.contacted_at) : ''}</div>
    </div>

    <div class="form-group">
      <label class="form-label">Notes internes</label>
      <textarea class="form-input" id="dem-notes" rows="3" placeholder="Notes sur cette demande (non visibles par le demandeur)…">${escapeHtml(d.admin_notes || '')}</textarea>
    </div>
  `;

  document.getElementById('demModalFooter').innerHTML = `
    <button class="btn btn-secondary" onclick="closeDemandeModal()">Fermer</button>
    <button class="btn btn-secondary" onclick="updateDemandeStatus('${d.id}','rejected')">Refuser</button>
    <button class="btn btn-secondary" onclick="updateDemandeStatus('${d.id}','contacted')">Marquer contactée</button>
    <button class="btn btn-primary" onclick="updateDemandeStatus('${d.id}','accepted')">Accepter</button>
  `;

  document.getElementById('demModalOverlay').hidden = false;
};

window.closeDemandeModal = function() {
  document.getElementById('demModalOverlay').hidden = true;
};

window.updateDemandeStatus = async function(id, newStatus) {
  const sb = window.IMM_SUPABASE;
  const notes = document.getElementById('dem-notes')?.value.trim() || null;
  const payload = { status: newStatus, admin_notes: notes, updated_at: new Date().toISOString() };
  if (newStatus === 'contacted' || newStatus === 'accepted') payload.contacted_at = new Date().toISOString();
  try {
    const { error } = await sb.from('training_requests').update(payload).eq('id', id);
    if (error) throw error;
    showToast(`Demande marquée "${newStatus}"`, 'success');
    closeDemandeModal();
    renderDemandes(document.getElementById('pageArea'));
  } catch (e) {
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

window.renderDemandes = renderDemandes;

/* ─── SESSIONS ───────────────────────────────────────── */
async function renderSessions(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Sessions de <em>formation</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Récupération des sessions…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const [sessRes, profilesRes, simsRes, partsRes] = await Promise.all([
    sb.from('training_sessions').select('*').order('start_date', { ascending: false, nullsFirst: false }),
    sb.from('profiles').select('id,email,full_name,role'),
    sb.from('simulations').select('game_id,name,domain'),
    sb.from('session_participants').select('session_id,user_id'),
  ]);

  if (sessRes.error) {
    const missing = (sessRes.error.message || '').toLowerCase().includes('training_sessions') || sessRes.error.code === '42P01';
    el.innerHTML = `<div class="wrap">
      <div class="page-h"><div class="page-h-left"><h1>Sessions de <em>formation</em></h1></div></div>
      <div class="card" style="padding:30px;max-width:640px">
        <h3 style="margin-bottom:10px;color:${missing ? 'var(--ink)' : '#DC2626'}">${missing ? 'Table non initialisée' : 'Erreur'}</h3>
        <p style="font-size:13px;color:var(--ink-mute);line-height:1.6">
          ${missing ? 'Lance le SQL <code>sql/07-training-sessions.sql</code> dans Supabase SQL Editor.' : escapeHtml(sessRes.error.message)}
        </p>
      </div>
    </div>`;
    return;
  }

  const sessions = sessRes.data || [];
  const profiles = profilesRes.data || [];
  const sims = simsRes.data || [];
  const parts = partsRes.data || [];

  const formateurs = profiles.filter(p => p.role === 'formateur');
  const apprenants = profiles.filter(p => p.role === 'apprenant' || !p.role);

  // Compte participants par session
  const partsBySession = {};
  parts.forEach(p => { partsBySession[p.session_id] = (partsBySession[p.session_id] || 0) + 1; });

  // Stocker en cache pour les modals
  window._sessionsData = { sessions, profiles, sims, parts, formateurs, apprenants };

  const statusCount = {
    planned: sessions.filter(s => s.status === 'planned').length,
    active: sessions.filter(s => s.status === 'active').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
  };

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Sessions de <em>formation</em></h1>
        <p>${sessions.length} session${sessions.length > 1 ? 's' : ''} · ${statusCount.active} en cours</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-secondary" onclick="renderSessions(document.getElementById('pageArea'))">${iconDownload()}<span>Actualiser</span></button>
        <button class="btn btn-primary" onclick="openSessionModal()">${iconPlus()}<span>Nouvelle session</span></button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi accent"><div class="value">${sessions.length}</div><div class="label">Total</div></div>
      <div class="kpi warn"><div class="value">${statusCount.planned}</div><div class="label">Planifiées</div></div>
      <div class="kpi success"><div class="value">${statusCount.active}</div><div class="label">En cours</div></div>
      <div class="kpi"><div class="value">${statusCount.completed}</div><div class="label">Terminées</div></div>
    </div>

    <div class="filter-bar" style="display:flex;gap:8px">
      <select class="form-input" id="sess-filter-status" onchange="filterSessionsTable()" style="max-width:180px">
        <option value="">Tous les statuts</option>
        <option value="planned">Planifiées</option>
        <option value="active">En cours</option>
        <option value="completed">Terminées</option>
        <option value="cancelled">Annulées</option>
      </select>
      <input type="search" class="filter-search" id="sess-search" placeholder="Rechercher par nom, client…" oninput="filterSessionsTable()" style="flex:1">
    </div>

    ${sessions.length === 0 ? `
      <div class="card" style="padding:60px 20px;text-align:center">
        <h3 style="font-size:17px;margin-bottom:8px">Aucune session pour le moment</h3>
        <p style="color:var(--ink-mute);font-size:13px;margin-bottom:20px">
          Créez votre première session de formation pour organiser vos apprenants en groupes.
        </p>
        <button class="btn btn-primary" onclick="openSessionModal()">${iconPlus()}<span>Créer une session</span></button>
      </div>` : `
      <div class="table-wrap"><table id="sess-table">
        <thead><tr>
          <th>Nom</th>
          <th>Client</th>
          <th>Formateur</th>
          <th>Dates</th>
          <th>Apprenants</th>
          <th>Simulations</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr></thead>
        <tbody>
          ${sessions.map(s => {
            const form = formateurs.find(f => f.id === s.formateur_id);
            const formName = form ? (form.full_name || form.email.split('@')[0]) : '—';
            const dates = formatDateRange(s.start_date, s.end_date);
            const nbParts = partsBySession[s.id] || 0;
            const nbSims = (s.simulations || []).length;
            return `<tr data-status="${s.status}" data-search="${escapeHtml(((s.name || '') + ' ' + (s.client_org || '')).toLowerCase())}">
              <td>
                <div style="font-weight:600;font-size:13px">${escapeHtml(s.name)}</div>
                ${s.description ? `<div style="font-size:11px;color:var(--ink-mute);margin-top:2px">${escapeHtml(s.description.substring(0, 60))}${s.description.length > 60 ? '…' : ''}</div>` : ''}
              </td>
              <td style="font-size:13px">${escapeHtml(s.client_org || '—')}</td>
              <td style="font-size:13px">${escapeHtml(formName)}</td>
              <td style="font-size:12px;color:var(--ink-mute);font-family:var(--f-mono)">${dates}</td>
              <td style="font-family:var(--f-mono);text-align:center">${nbParts}</td>
              <td style="font-family:var(--f-mono);text-align:center">${nbSims}</td>
              <td>${sessionStatusBadge(s.status)}</td>
              <td>
                <div style="display:flex;gap:4px">
                  <button class="btn btn-secondary btn-sm" onclick="viewSessionDetail('${s.id}')" title="Détails">Voir</button>
                  <button class="btn btn-secondary btn-sm" onclick="openSessionModal('${s.id}')" title="Modifier">${iconEdit()}</button>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>
    `}
  </div>

  <!-- Modal création/édition session -->
  <div class="modal-overlay" id="sessModalOverlay" hidden>
    <div class="modal" style="max-width:720px">
      <div class="modal-h">
        <h3 id="sessModalTitle">Nouvelle session</h3>
        <button class="modal-close" onclick="closeSessionModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="sessModalBody"></div>
      <div class="modal-footer" id="sessModalFooter"></div>
    </div>
  </div>

  <!-- Modal détail session -->
  <div class="modal-overlay" id="sessDetailOverlay" hidden>
    <div class="modal" style="max-width:760px">
      <div class="modal-h">
        <h3 id="sessDetailTitle">Détail de la session</h3>
        <button class="modal-close" onclick="closeSessionDetail()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="sessDetailBody"></div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeSessionDetail()">Fermer</button>
      </div>
    </div>
  </div>`;
}

function sessionStatusBadge(s) {
  const map = {
    'planned': ['badge-warn', 'Planifiée'],
    'active': ['badge-success', 'En cours'],
    'completed': ['badge-muted', 'Terminée'],
    'cancelled': ['badge-danger', 'Annulée']
  };
  const [cls, label] = map[s] || ['badge-muted', s];
  return `<span class="badge ${cls}">${label}</span>`;
}

function formatDateRange(start, end) {
  if (!start && !end) return '—';
  const fmt = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
  if (start && end) return `${fmt(start)} → ${fmt(end)}`;
  return fmt(start || end);
}

window.filterSessionsTable = function() {
  const status = document.getElementById('sess-filter-status').value;
  const q = (document.getElementById('sess-search').value || '').toLowerCase().trim();
  document.querySelectorAll('#sess-table tbody tr').forEach(tr => {
    const matchStatus = !status || tr.dataset.status === status;
    const matchSearch = !q || (tr.dataset.search || '').includes(q);
    tr.style.display = (matchStatus && matchSearch) ? '' : 'none';
  });
};

window.openSessionModal = async function(sessionId) {
  const { sessions, formateurs, sims, parts, apprenants } = window._sessionsData;
  const isEdit = !!sessionId;
  const s = isEdit ? sessions.find(x => x.id === sessionId) : {
    name: '', description: '', client_org: '', formateur_id: null,
    start_date: '', end_date: '', status: 'planned', simulations: [], notes: ''
  };
  if (isEdit && !s) return;

  // Participants actuels
  const currentParts = parts.filter(p => p.session_id === sessionId).map(p => p.user_id);

  document.getElementById('sessModalTitle').textContent = isEdit ? `Modifier : ${s.name}` : 'Nouvelle session';
  document.getElementById('sessModalBody').innerHTML = `
    <div class="form-group">
      <label class="form-label">Nom de la session *</label>
      <input type="text" class="form-input" id="sess-name" value="${escapeHtml(s.name || '')}" placeholder="ex: BTS NDRC 2026 — Promo IDRECOM">
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Client / Organisation</label>
        <input type="text" class="form-input" id="sess-client" value="${escapeHtml(s.client_org || '')}" placeholder="ex: IDRECOM">
      </div>
      <div class="form-group">
        <label class="form-label">Formateur</label>
        <select class="form-input" id="sess-formateur">
          <option value="">— Aucun —</option>
          ${formateurs.map(f => `<option value="${f.id}" ${s.formateur_id === f.id ? 'selected' : ''}>${escapeHtml(f.full_name || f.email)}</option>`).join('')}
        </select>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Date de début</label>
        <input type="date" class="form-input" id="sess-start" value="${s.start_date || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Date de fin</label>
        <input type="date" class="form-input" id="sess-end" value="${s.end_date || ''}">
      </div>
      <div class="form-group">
        <label class="form-label">Statut</label>
        <select class="form-input" id="sess-status">
          <option value="planned" ${s.status === 'planned' ? 'selected' : ''}>Planifiée</option>
          <option value="active" ${s.status === 'active' ? 'selected' : ''}>En cours</option>
          <option value="completed" ${s.status === 'completed' ? 'selected' : ''}>Terminée</option>
          <option value="cancelled" ${s.status === 'cancelled' ? 'selected' : ''}>Annulée</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Description</label>
      <textarea class="form-input" id="sess-desc" rows="2">${escapeHtml(s.description || '')}</textarea>
    </div>

    <div class="form-group">
      <label class="form-label">Simulations assignées (${(s.simulations || []).length}/${sims.length})</label>
      <div style="max-height:180px;overflow-y:auto;padding:10px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--bg-alt)">
        ${sims.map(sim => `
          <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer">
            <input type="checkbox" class="sess-sim-cb" value="${sim.game_id}" ${(s.simulations || []).includes(sim.game_id) ? 'checked' : ''}>
            <span style="font-size:13px;font-weight:500">${escapeHtml(sim.name)}</span>
            <span style="font-size:11px;color:var(--ink-mute)">${escapeHtml(sim.domain || '')}</span>
          </label>
        `).join('')}
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Apprenants inscrits (${currentParts.length}/${apprenants.length})</label>
      <input type="search" class="form-input" placeholder="Filtrer par nom ou email…" oninput="filterParticipantsList(this.value)" style="margin-bottom:8px">
      <div id="sess-parts-list" style="max-height:180px;overflow-y:auto;padding:10px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--bg-alt)">
        ${apprenants.map(a => {
          const name = a.full_name || a.email.split('@')[0];
          return `<label class="sess-part-item" data-search="${escapeHtml((name + ' ' + a.email).toLowerCase())}" style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer">
            <input type="checkbox" class="sess-part-cb" value="${a.id}" ${currentParts.includes(a.id) ? 'checked' : ''}>
            <span style="font-size:13px;font-weight:500">${escapeHtml(name)}</span>
            <span style="font-size:11px;color:var(--ink-mute)">${escapeHtml(a.email)}</span>
          </label>`;
        }).join('')}
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Notes internes</label>
      <textarea class="form-input" id="sess-notes" rows="2">${escapeHtml(s.notes || '')}</textarea>
    </div>
  `;

  document.getElementById('sessModalFooter').innerHTML = `
    ${isEdit ? `<button class="btn btn-danger" onclick="deleteSession('${sessionId}')" style="margin-right:auto">Supprimer</button>` : ''}
    <button class="btn btn-secondary" onclick="closeSessionModal()">Annuler</button>
    <button class="btn btn-primary" onclick="saveSession(${isEdit ? `'${sessionId}'` : 'null'})">Enregistrer</button>
  `;

  document.getElementById('sessModalOverlay').hidden = false;
};

window.filterParticipantsList = function(q) {
  const query = (q || '').toLowerCase().trim();
  document.querySelectorAll('.sess-part-item').forEach(el => {
    el.style.display = !query || (el.dataset.search || '').includes(query) ? '' : 'none';
  });
};

window.closeSessionModal = function() {
  document.getElementById('sessModalOverlay').hidden = true;
};

window.saveSession = async function(sessionId) {
  const sb = window.IMM_SUPABASE;
  const name = document.getElementById('sess-name').value.trim();
  if (!name) { showToast('Le nom est obligatoire', 'error'); return; }

  const payload = {
    name,
    client_org: document.getElementById('sess-client').value.trim() || null,
    formateur_id: document.getElementById('sess-formateur').value || null,
    start_date: document.getElementById('sess-start').value || null,
    end_date: document.getElementById('sess-end').value || null,
    status: document.getElementById('sess-status').value,
    description: document.getElementById('sess-desc').value.trim() || null,
    simulations: Array.from(document.querySelectorAll('.sess-sim-cb:checked')).map(cb => cb.value),
    notes: document.getElementById('sess-notes').value.trim() || null,
    updated_at: new Date().toISOString(),
  };

  const selectedParts = Array.from(document.querySelectorAll('.sess-part-cb:checked')).map(cb => cb.value);

  try {
    let savedId = sessionId;
    if (sessionId) {
      const { error } = await sb.from('training_sessions').update(payload).eq('id', sessionId);
      if (error) throw error;
    } else {
      const user = window.IMM_USER;
      if (user) payload.created_by = user.id;
      const { data, error } = await sb.from('training_sessions').insert([payload]).select().single();
      if (error) throw error;
      savedId = data.id;
    }

    // Gérer les participants : on efface puis on réinsère (simple mais efficace)
    await sb.from('session_participants').delete().eq('session_id', savedId);
    if (selectedParts.length > 0) {
      const inserts = selectedParts.map(uid => ({ session_id: savedId, user_id: uid }));
      const { error: partErr } = await sb.from('session_participants').insert(inserts);
      if (partErr) throw partErr;
    }

    showToast(`Session ${sessionId ? 'mise à jour' : 'créée'}`, 'success');
    closeSessionModal();
    renderSessions(document.getElementById('pageArea'));
  } catch (e) {
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

window.deleteSession = async function(sessionId) {
  if (!confirm('Supprimer définitivement cette session ? Les apprenants ne seront pas supprimés.')) return;
  const sb = window.IMM_SUPABASE;
  try {
    const { error } = await sb.from('training_sessions').delete().eq('id', sessionId);
    if (error) throw error;
    showToast('Session supprimée', 'success');
    closeSessionModal();
    renderSessions(document.getElementById('pageArea'));
  } catch (e) {
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

window.viewSessionDetail = async function(sessionId) {
  const { sessions, profiles, sims, parts, formateurs } = window._sessionsData;
  const s = sessions.find(x => x.id === sessionId);
  if (!s) return;

  const formName = formateurs.find(f => f.id === s.formateur_id)?.full_name || formateurs.find(f => f.id === s.formateur_id)?.email || '—';
  const participantIds = parts.filter(p => p.session_id === sessionId).map(p => p.user_id);
  const participants = profiles.filter(p => participantIds.includes(p.id));
  const assignedSims = sims.filter(sim => (s.simulations || []).includes(sim.game_id));

  // Charger la progression des participants dans les simulations assignées
  const sb = window.IMM_SUPABASE;
  const { data: progress } = await sb.from('user_progress')
    .select('user_id,game_id,challenge_num,score,updated_at')
    .in('user_id', participantIds.length > 0 ? participantIds : ['00000000-0000-0000-0000-000000000000'])
    .in('game_id', (s.simulations || []).length > 0 ? s.simulations : ['__none__']);

  const progMap = {};
  (progress || []).forEach(p => {
    const key = p.user_id + '|' + p.game_id;
    if (!progMap[key] || (p.challenge_num || 0) > progMap[key].challenge_num) {
      progMap[key] = p;
    }
  });

  document.getElementById('sessDetailTitle').textContent = s.name;
  document.getElementById('sessDetailBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px">
      <div><div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;font-weight:600;margin-bottom:2px">Client</div>
        <div style="font-size:14px">${escapeHtml(s.client_org || '—')}</div></div>
      <div><div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;font-weight:600;margin-bottom:2px">Formateur</div>
        <div style="font-size:14px">${escapeHtml(formName)}</div></div>
      <div><div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;font-weight:600;margin-bottom:2px">Dates</div>
        <div style="font-size:14px">${formatDateRange(s.start_date, s.end_date)}</div></div>
      <div><div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;font-weight:600;margin-bottom:2px">Statut</div>
        <div>${sessionStatusBadge(s.status)}</div></div>
    </div>

    ${s.description ? `<div style="padding:14px;background:var(--bg-alt);border-radius:var(--r-sm);margin-bottom:18px;font-size:13px;line-height:1.5">${escapeHtml(s.description)}</div>` : ''}

    <h4 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:10px;font-weight:600">Simulations assignées (${assignedSims.length})</h4>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:18px">
      ${assignedSims.length > 0 ? assignedSims.map(sim => `<span class="badge badge-info" style="font-size:11px">${escapeHtml(sim.name)}</span>`).join('') : '<span style="color:var(--ink-mute);font-size:13px">Aucune simulation assignée</span>'}
    </div>

    <h4 style="font-size:13px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:10px;font-weight:600">Progression des apprenants (${participants.length})</h4>
    ${participants.length === 0 ? '<div style="color:var(--ink-mute);font-size:13px">Aucun apprenant inscrit</div>' : `
      <div style="display:grid;gap:8px">
        ${participants.map(p => {
          const pName = p.full_name || p.email.split('@')[0];
          const userProgs = assignedSims.map(sim => {
            const key = p.id + '|' + sim.game_id;
            const prog = progMap[key];
            return { sim, prog };
          });
          const totalDefisDone = userProgs.reduce((t, up) => t + (up.prog ? (up.prog.challenge_num || 0) : 0), 0);
          const totalDefis = assignedSims.length * 21;
          const pct = totalDefis > 0 ? Math.round((totalDefisDone / totalDefis) * 100) : 0;
          return `<div style="padding:12px 14px;border:1px solid var(--line);border-radius:var(--r-sm)">
            <div style="display:grid;grid-template-columns:1fr 200px;gap:14px;align-items:center">
              <div>
                <div style="font-weight:600;font-size:13px">${escapeHtml(pName)}</div>
                <div style="font-size:11px;color:var(--ink-mute)">${escapeHtml(p.email)}</div>
              </div>
              <div style="display:flex;align-items:center;gap:8px">
                <div class="progress" style="flex:1"><div class="progress-fill" style="width:${pct}%"></div></div>
                <span style="font-size:11px;color:var(--ink-mute);font-family:var(--f-mono);white-space:nowrap">${pct}%</span>
              </div>
            </div>
          </div>`;
        }).join('')}
      </div>`}

    ${s.notes ? `<div style="margin-top:18px;padding:12px;background:var(--paper);border:1px solid var(--line);border-radius:var(--r-sm)">
      <div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;font-weight:600;margin-bottom:6px">Notes</div>
      <div style="font-size:13px;line-height:1.5;white-space:pre-wrap">${escapeHtml(s.notes)}</div>
    </div>` : ''}
  `;

  document.getElementById('sessDetailOverlay').hidden = false;
};

window.closeSessionDetail = function() {
  document.getElementById('sessDetailOverlay').hidden = true;
};

window.renderSessions = renderSessions;

/* ─── RESULTS ────────────────────────────────────────── */
async function renderResults(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Résultats & <em>scores</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Récupération des résultats…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const [progRes, profilesRes, simsRes] = await Promise.all([
    sb.from('user_progress').select('*').order('updated_at', { ascending: false }),
    sb.from('profiles').select('id,email,full_name'),
    sb.from('simulations').select('game_id,name,domain,challenge_count'),
  ]);

  const progress = progRes.data || [];
  const profiles = profilesRes.data || [];
  const sims = simsRes.data || [];

  if (progress.length === 0) {
    el.innerHTML = `<div class="wrap">
      <div class="page-h"><div class="page-h-left"><h1>Résultats & <em>scores</em></h1><p>Aucun résultat pour le moment</p></div></div>
      <div class="card" style="padding:60px 20px;text-align:center">
        <h3 style="font-size:17px;margin-bottom:8px">Aucune activité enregistrée</h3>
        <p style="color:var(--ink-mute);font-size:13px">
          Les résultats apparaîtront ici dès que des apprenants commenceront à jouer les simulations.
        </p>
      </div>
    </div>`;
    return;
  }

  // Calculs globaux
  const totalEntries = progress.length;
  const totalCompleted = progress.filter(p => {
    const sim = sims.find(s => s.game_id === p.game_id);
    const total = sim?.challenge_count || 21;
    return (p.challenge_num || 0) >= total;
  }).length;
  const avgScore = totalEntries > 0 ? Math.round(progress.reduce((t, p) => t + (p.score || 0), 0) / totalEntries * 10) / 10 : 0;
  const maxScore = Math.max(...progress.map(p => p.score || 0), 0);

  // Enrichir chaque ligne
  const rows = progress.map(p => {
    const user = profiles.find(x => x.id === p.user_id);
    const sim = sims.find(s => s.game_id === p.game_id);
    const total = sim?.challenge_count || 21;
    const curChal = p.challenge_num || 0;
    const done = curChal >= total;
    const pct = total > 0 ? Math.round((curChal / total) * 100) : 0;
    return {
      id: `${p.user_id}_${p.game_id}`,
      userId: p.user_id,
      userName: user?.full_name || user?.email?.split('@')[0] || 'Utilisateur',
      email: user?.email || '',
      gameId: p.game_id,
      simName: sim?.name || p.game_id?.toUpperCase(),
      domain: sim?.domain || '',
      currentChal: curChal,
      totalChal: total,
      pct,
      score: p.score || 0,
      done,
      updatedAt: p.updated_at
    };
  });

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Résultats & <em>scores</em></h1>
        <p>${totalEntries} entrées de progression · ${totalCompleted} simulations terminées</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-secondary" onclick="renderResults(document.getElementById('pageArea'))">${iconDownload()}<span>Actualiser</span></button>
        <button class="btn btn-primary" onclick="exportResultsCsv()" title="Exporter en CSV">${iconDownload()}<span>Export CSV</span></button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi accent"><div class="value">${totalEntries}</div><div class="label">Entrées totales</div></div>
      <div class="kpi success"><div class="value">${totalCompleted}</div><div class="label">Terminées</div></div>
      <div class="kpi"><div class="value">${avgScore}</div><div class="label">Score moyen</div></div>
      <div class="kpi warn"><div class="value">${maxScore}</div><div class="label">Score maximum</div></div>
    </div>

    <div class="filter-bar" style="display:flex;gap:8px">
      <select class="form-input" id="res-filter-sim" onchange="filterResultsTable()" style="max-width:220px">
        <option value="">Toutes les simulations</option>
        ${sims.map(s => `<option value="${s.game_id}">${escapeHtml(s.name)}</option>`).join('')}
      </select>
      <select class="form-input" id="res-filter-status" onchange="filterResultsTable()" style="max-width:160px">
        <option value="">Tous les statuts</option>
        <option value="done">Terminées</option>
        <option value="inprogress">En cours</option>
      </select>
      <input type="search" class="filter-search" id="res-search" placeholder="Rechercher par nom ou email…" oninput="filterResultsTable()" style="flex:1">
    </div>

    <div class="table-wrap"><table id="res-table">
      <thead><tr>
        <th>Apprenant</th>
        <th>Simulation</th>
        <th>Progression</th>
        <th>Score</th>
        <th>Statut</th>
        <th>Dernière activité</th>
      </tr></thead>
      <tbody>
        ${rows.map(r => `
          <tr data-sim="${r.gameId}" data-status="${r.done ? 'done' : 'inprogress'}" data-search="${escapeHtml((r.userName + ' ' + r.email).toLowerCase())}">
            <td>
              <div style="font-weight:600;font-size:13px">${escapeHtml(r.userName)}</div>
              <div style="font-size:11px;color:var(--ink-mute)">${escapeHtml(r.email)}</div>
            </td>
            <td>
              <div style="font-size:13px;font-weight:500">${escapeHtml(r.simName)}</div>
              <div style="font-size:11px;color:var(--ink-mute)">${escapeHtml(r.domain)}</div>
            </td>
            <td>
              <div style="display:flex;align-items:center;gap:8px;min-width:160px">
                <div class="progress" style="flex:1"><div class="progress-fill" style="width:${r.pct}%;background:${r.done ? 'var(--jade)' : 'var(--marine)'}"></div></div>
                <span style="font-family:var(--f-mono);font-size:11px;color:var(--ink-mute);white-space:nowrap">${r.currentChal}/${r.totalChal}</span>
              </div>
            </td>
            <td style="font-family:var(--f-mono);font-weight:600;font-size:13px">${r.score}</td>
            <td>${r.done ? '<span class="badge badge-success">Terminée</span>' : '<span class="badge badge-info">En cours</span>'}</td>
            <td style="font-size:11px;color:var(--ink-mute)">${timeAgo(r.updatedAt)}</td>
          </tr>`).join('')}
      </tbody>
    </table></div>
  </div>`;

  window._resultsData = rows;
}

window.filterResultsTable = function() {
  const sim = document.getElementById('res-filter-sim').value;
  const status = document.getElementById('res-filter-status').value;
  const q = (document.getElementById('res-search').value || '').toLowerCase().trim();
  document.querySelectorAll('#res-table tbody tr').forEach(tr => {
    const matchSim = !sim || tr.dataset.sim === sim;
    const matchStatus = !status || tr.dataset.status === status;
    const matchSearch = !q || (tr.dataset.search || '').includes(q);
    tr.style.display = (matchSim && matchStatus && matchSearch) ? '' : 'none';
  });
};

window.exportResultsCsv = function() {
  const rows = window._resultsData || [];
  if (rows.length === 0) { showToast('Aucune donnée à exporter', ''); return; }

  const header = ['Apprenant', 'Email', 'Simulation', 'Domaine', 'Défis faits', 'Défis total', 'Progression (%)', 'Score', 'Statut', 'Dernière activité'];
  const lines = [header.join(';')];
  rows.forEach(r => {
    const csvEscape = (v) => {
      const str = String(v == null ? '' : v);
      if (/[;"\n\r]/.test(str)) return '"' + str.replace(/"/g, '""') + '"';
      return str;
    };
    lines.push([
      r.userName, r.email, r.simName, r.domain,
      r.currentChal, r.totalChal, r.pct, r.score,
      r.done ? 'Terminée' : 'En cours',
      r.updatedAt ? new Date(r.updatedAt).toLocaleString('fr-FR') : ''
    ].map(csvEscape).join(';'));
  });

  const csv = '\uFEFF' + lines.join('\n');  // BOM UTF-8 pour Excel
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `immersium-resultats-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Export CSV téléchargé', 'success');
};

window.renderResults = renderResults;

/* ─── COACHING ───────────────────────────────────────── */
async function renderCoaching(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Sessions de <em>coaching</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Récupération des sessions de coaching…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const [coachRes, profilesRes, simsRes] = await Promise.all([
    sb.from('coaching_sessions').select('*').order('created_at', { ascending: false }),
    sb.from('profiles').select('id,email,full_name,role'),
    sb.from('simulations').select('game_id,name'),
  ]);

  if (coachRes.error) {
    const missing = (coachRes.error.message || '').toLowerCase().includes('coaching_sessions') || coachRes.error.code === '42P01';
    el.innerHTML = `<div class="wrap">
      <div class="page-h"><div class="page-h-left"><h1>Sessions de <em>coaching</em></h1></div></div>
      <div class="card" style="padding:30px;max-width:640px">
        <h3 style="margin-bottom:10px;color:${missing ? 'var(--ink)' : '#DC2626'}">${missing ? 'Table non initialisée' : 'Erreur'}</h3>
        <p style="font-size:13px;color:var(--ink-mute);line-height:1.6">
          ${missing ? 'Lance le SQL <code>sql/08-coaching-sessions.sql</code> dans Supabase SQL Editor.' : escapeHtml(coachRes.error.message)}
        </p>
      </div>
    </div>`;
    return;
  }

  const sessions = coachRes.data || [];
  const profiles = profilesRes.data || [];
  const sims = simsRes.data || [];
  const formateurs = profiles.filter(p => p.role === 'formateur' || p.role === 'admin');

  const statusCount = {
    requested: sessions.filter(s => s.status === 'requested').length,
    scheduled: sessions.filter(s => s.status === 'scheduled').length,
    completed: sessions.filter(s => s.status === 'completed').length,
    cancelled: sessions.filter(s => s.status === 'cancelled').length,
  };

  // Moyenne des notes (sur celles notées)
  const rated = sessions.filter(s => s.rating);
  const avgRating = rated.length > 0 ? (rated.reduce((t, s) => t + s.rating, 0) / rated.length).toFixed(1) : '—';

  window._coachingData = { sessions, profiles, sims, formateurs };

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Sessions de <em>coaching</em></h1>
        <p>${sessions.length} session${sessions.length > 1 ? 's' : ''} · ${statusCount.requested} en attente</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-secondary" onclick="renderCoaching(document.getElementById('pageArea'))">${iconDownload()}<span>Actualiser</span></button>
        <button class="btn btn-primary" onclick="openCoachingModal()">${iconPlus()}<span>Nouvelle session</span></button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi warn"><div class="value">${statusCount.requested}</div><div class="label">Demandées</div></div>
      <div class="kpi accent"><div class="value">${statusCount.scheduled}</div><div class="label">Planifiées</div></div>
      <div class="kpi success"><div class="value">${statusCount.completed}</div><div class="label">Terminées</div></div>
      <div class="kpi"><div class="value">${avgRating}<span style="font-size:16px;color:var(--ink-mute);font-weight:400"> /5</span></div><div class="label">Note moyenne</div></div>
    </div>

    <div class="filter-bar" style="display:flex;gap:8px">
      <select class="form-input" id="co-filter-status" onchange="filterCoachingTable()" style="max-width:180px">
        <option value="">Tous les statuts</option>
        <option value="requested">Demandées</option>
        <option value="scheduled">Planifiées</option>
        <option value="completed">Terminées</option>
        <option value="cancelled">Annulées</option>
      </select>
      <input type="search" class="filter-search" id="co-search" placeholder="Rechercher par apprenant, sujet…" oninput="filterCoachingTable()" style="flex:1">
    </div>

    ${sessions.length === 0 ? `
      <div class="card" style="padding:60px 20px;text-align:center">
        <h3 style="font-size:17px;margin-bottom:8px">Aucune session de coaching</h3>
        <p style="color:var(--ink-mute);font-size:13px;margin-bottom:20px">
          Les sessions peuvent être créées manuellement ici, ou demandées par les apprenants depuis leur espace.
        </p>
        <button class="btn btn-primary" onclick="openCoachingModal()">${iconPlus()}<span>Créer une session</span></button>
      </div>` : `
      <div class="table-wrap"><table id="co-table">
        <thead><tr>
          <th>Apprenant</th>
          <th>Formateur</th>
          <th>Sujet</th>
          <th>Mode</th>
          <th>Date prévue</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr></thead>
        <tbody>
          ${sessions.map(s => {
            const learner = profiles.find(p => p.id === s.learner_id);
            const formateur = profiles.find(p => p.id === s.formateur_id);
            const learnerName = learner ? (learner.full_name || learner.email.split('@')[0]) : '—';
            const formName = formateur ? (formateur.full_name || formateur.email.split('@')[0]) : 'Non assigné';
            const dateStr = s.scheduled_date
              ? new Date(s.scheduled_date).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
              : (s.proposed_date ? new Date(s.proposed_date).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' (proposée)' : '—');
            return `<tr data-status="${s.status}" data-search="${escapeHtml((learnerName + ' ' + (s.topic || '') + ' ' + (learner?.email || '')).toLowerCase())}">
              <td>
                <div style="font-weight:600;font-size:13px">${escapeHtml(learnerName)}</div>
                <div style="font-size:11px;color:var(--ink-mute)">${escapeHtml(learner?.email || '')}</div>
              </td>
              <td style="font-size:13px;color:${formateur ? 'var(--ink)' : 'var(--ink-mute)'}">${escapeHtml(formName)}</td>
              <td style="font-size:13px">${escapeHtml((s.topic || '').substring(0, 50))}${s.topic?.length > 50 ? '…' : ''}</td>
              <td><span class="badge badge-muted">${s.mode === 'visio' ? 'Visio' : s.mode === 'phone' ? 'Tél.' : 'Présentiel'}</span></td>
              <td style="font-size:12px;color:var(--ink-mute);font-family:var(--f-mono)">${dateStr}</td>
              <td>${coachingStatusBadge(s.status)}</td>
              <td><button class="btn btn-secondary btn-sm" onclick="openCoachingModal('${s.id}')">Gérer</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>
    `}
  </div>

  <!-- Modal création/édition coaching -->
  <div class="modal-overlay" id="coachModalOverlay" hidden>
    <div class="modal" style="max-width:700px">
      <div class="modal-h">
        <h3 id="coachModalTitle">Nouvelle session de coaching</h3>
        <button class="modal-close" onclick="closeCoachingModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="coachModalBody"></div>
      <div class="modal-footer" id="coachModalFooter"></div>
    </div>
  </div>`;
}

function coachingStatusBadge(s) {
  const map = {
    'requested': ['badge-warn', 'Demandée'],
    'scheduled': ['badge-info', 'Planifiée'],
    'completed': ['badge-success', 'Terminée'],
    'cancelled': ['badge-danger', 'Annulée']
  };
  const [cls, label] = map[s] || ['badge-muted', s];
  return `<span class="badge ${cls}">${label}</span>`;
}

window.filterCoachingTable = function() {
  const status = document.getElementById('co-filter-status').value;
  const q = (document.getElementById('co-search').value || '').toLowerCase().trim();
  document.querySelectorAll('#co-table tbody tr').forEach(tr => {
    const matchStatus = !status || tr.dataset.status === status;
    const matchSearch = !q || (tr.dataset.search || '').includes(q);
    tr.style.display = (matchStatus && matchSearch) ? '' : 'none';
  });
};

window.openCoachingModal = function(sessionId) {
  const { sessions, profiles, sims, formateurs } = window._coachingData || {};
  const apprenants = profiles.filter(p => p.role === 'apprenant' || !p.role);
  const isEdit = !!sessionId;
  const s = isEdit ? sessions.find(x => x.id === sessionId) : {
    learner_id: '', formateur_id: '', topic: '', description: '',
    mode: 'visio', proposed_date: '', scheduled_date: '', duration_min: 30,
    status: 'requested', meeting_link: '', related_game_id: '', report: '', rating: null
  };
  if (isEdit && !s) return;

  const toLocalInput = (iso) => iso ? new Date(iso).toISOString().slice(0, 16) : '';

  document.getElementById('coachModalTitle').textContent = isEdit ? 'Modifier la session de coaching' : 'Nouvelle session de coaching';
  document.getElementById('coachModalBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Apprenant *</label>
        <select class="form-input" id="co-learner" ${isEdit ? 'disabled' : ''}>
          <option value="">— Sélectionner —</option>
          ${apprenants.map(a => `<option value="${a.id}" ${s.learner_id === a.id ? 'selected' : ''}>${escapeHtml(a.full_name || a.email)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Formateur assigné</label>
        <select class="form-input" id="co-formateur">
          <option value="">— Non assigné —</option>
          ${formateurs.map(f => `<option value="${f.id}" ${s.formateur_id === f.id ? 'selected' : ''}>${escapeHtml(f.full_name || f.email)} (${f.role})</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Sujet / Demande *</label>
      <input type="text" class="form-input" id="co-topic" value="${escapeHtml(s.topic || '')}" placeholder="ex: Comprendre le SEO pour mon projet">
    </div>

    <div class="form-group">
      <label class="form-label">Description / Contexte</label>
      <textarea class="form-input" id="co-description" rows="2">${escapeHtml(s.description || '')}</textarea>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Simulation concernée</label>
        <select class="form-input" id="co-game">
          <option value="">—</option>
          ${sims.map(sim => `<option value="${sim.game_id}" ${s.related_game_id === sim.game_id ? 'selected' : ''}>${escapeHtml(sim.name)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Mode</label>
        <select class="form-input" id="co-mode">
          <option value="visio" ${s.mode === 'visio' ? 'selected' : ''}>Visio</option>
          <option value="phone" ${s.mode === 'phone' ? 'selected' : ''}>Téléphone</option>
          <option value="onsite" ${s.mode === 'onsite' ? 'selected' : ''}>Présentiel</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Durée (min)</label>
        <input type="number" class="form-input" id="co-duration" value="${s.duration_min || 30}" min="15" step="15">
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Date proposée</label>
        <input type="datetime-local" class="form-input" id="co-proposed" value="${toLocalInput(s.proposed_date)}">
      </div>
      <div class="form-group">
        <label class="form-label">Date confirmée</label>
        <input type="datetime-local" class="form-input" id="co-scheduled" value="${toLocalInput(s.scheduled_date)}">
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Lien de la réunion (visio)</label>
      <input type="url" class="form-input" id="co-meeting" value="${escapeHtml(s.meeting_link || '')}" placeholder="https://teams.microsoft.com/l/meetup…">
    </div>

    <div class="form-group">
      <label class="form-label">Statut</label>
      <select class="form-input" id="co-status">
        <option value="requested" ${s.status === 'requested' ? 'selected' : ''}>Demandée</option>
        <option value="scheduled" ${s.status === 'scheduled' ? 'selected' : ''}>Planifiée</option>
        <option value="completed" ${s.status === 'completed' ? 'selected' : ''}>Terminée</option>
        <option value="cancelled" ${s.status === 'cancelled' ? 'selected' : ''}>Annulée</option>
      </select>
    </div>

    <div class="form-group" id="co-report-block" ${s.status !== 'completed' && !isEdit ? 'style="display:none"' : ''}>
      <label class="form-label">Compte-rendu (après la séance)</label>
      <textarea class="form-input" id="co-report" rows="4">${escapeHtml(s.report || '')}</textarea>
    </div>

    <div class="form-group" id="co-rating-block" ${s.status !== 'completed' && !isEdit ? 'style="display:none"' : ''}>
      <label class="form-label">Note de satisfaction /5</label>
      <select class="form-input" id="co-rating" style="max-width:140px">
        <option value="">—</option>
        ${[1,2,3,4,5].map(n => `<option value="${n}" ${s.rating === n ? 'selected' : ''}>${n} / 5</option>`).join('')}
      </select>
    </div>
  `;

  // Afficher/masquer report selon statut
  setTimeout(() => {
    const statusEl = document.getElementById('co-status');
    if (statusEl) {
      statusEl.addEventListener('change', () => {
        const showReport = statusEl.value === 'completed';
        document.getElementById('co-report-block').style.display = showReport ? '' : 'none';
        document.getElementById('co-rating-block').style.display = showReport ? '' : 'none';
      });
    }
  }, 50);

  document.getElementById('coachModalFooter').innerHTML = `
    ${isEdit ? `<button class="btn btn-danger" onclick="deleteCoaching('${sessionId}')" style="margin-right:auto">Supprimer</button>` : ''}
    <button class="btn btn-secondary" onclick="closeCoachingModal()">Annuler</button>
    <button class="btn btn-primary" onclick="saveCoaching(${isEdit ? `'${sessionId}'` : 'null'})">Enregistrer</button>
  `;

  document.getElementById('coachModalOverlay').hidden = false;
};

window.closeCoachingModal = function() {
  document.getElementById('coachModalOverlay').hidden = true;
};

window.saveCoaching = async function(sessionId) {
  const sb = window.IMM_SUPABASE;
  const learner_id = document.getElementById('co-learner').value;
  const topic = document.getElementById('co-topic').value.trim();

  if (!learner_id) { showToast('Sélectionnez un apprenant', 'error'); return; }
  if (!topic) { showToast('Le sujet est obligatoire', 'error'); return; }

  const toIso = (v) => v ? new Date(v).toISOString() : null;

  const payload = {
    learner_id,
    formateur_id: document.getElementById('co-formateur').value || null,
    topic,
    description: document.getElementById('co-description').value.trim() || null,
    related_game_id: document.getElementById('co-game').value || null,
    mode: document.getElementById('co-mode').value,
    duration_min: parseInt(document.getElementById('co-duration').value, 10) || 30,
    proposed_date: toIso(document.getElementById('co-proposed').value),
    scheduled_date: toIso(document.getElementById('co-scheduled').value),
    meeting_link: document.getElementById('co-meeting').value.trim() || null,
    status: document.getElementById('co-status').value,
    report: document.getElementById('co-report').value.trim() || null,
    rating: parseInt(document.getElementById('co-rating').value, 10) || null,
    updated_at: new Date().toISOString(),
  };

  try {
    if (sessionId) {
      const { error } = await sb.from('coaching_sessions').update(payload).eq('id', sessionId);
      if (error) throw error;
    } else {
      const { error } = await sb.from('coaching_sessions').insert([payload]);
      if (error) throw error;
    }
    showToast(`Session ${sessionId ? 'mise à jour' : 'créée'}`, 'success');
    closeCoachingModal();
    renderCoaching(document.getElementById('pageArea'));
  } catch (e) {
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

window.deleteCoaching = async function(sessionId) {
  if (!confirm('Supprimer cette session de coaching ?')) return;
  const sb = window.IMM_SUPABASE;
  try {
    const { error } = await sb.from('coaching_sessions').delete().eq('id', sessionId);
    if (error) throw error;
    showToast('Session supprimée', 'success');
    closeCoachingModal();
    renderCoaching(document.getElementById('pageArea'));
  } catch (e) {
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

window.renderCoaching = renderCoaching;

/* ─── SIMULATIONS (connecté à Supabase) ─────────────── */

// Icônes SVG par domaine (pas d'emoji)
const DOMAIN_ICONS = {
  'Marketing Digital': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 6-6"/></svg>',
  'Transformation Digitale': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32"><path d="M21 12a9 9 0 11-6.219-8.56"/><polyline points="21 3 21 9 15 9"/></svg>',
  'Stratégie Marketing': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="0.5"/></svg>',
  'Communication Digitale': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
  'Communication digitale': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
  "Communication à l'ère digitale": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
  'Intelligence Artificielle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32"><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9z"/><path d="M3 9h2M3 15h2M19 9h2M19 15h2M9 3v2M15 3v2M9 19v2M15 19v2"/></svg>',
  'IA en Entreprise': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32"><rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9z"/><path d="M3 9h2M3 15h2M19 9h2M19 15h2M9 3v2M15 3v2M9 19v2M15 19v2"/></svg>',
};
const DEFAULT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="32" height="32"><polygon points="10 8 16 12 10 16 10 8"/><circle cx="12" cy="12" r="10"/></svg>';

async function fetchSimulations() {
  const sb = window.IMM_SUPABASE;
  if (!sb) return { data: [], progressCount: {} };
  try {
    const [sims, progress] = await Promise.all([
      sb.from('simulations').select('*').order('sort_order'),
      sb.from('user_progress').select('game_id', { count: 'exact', head: false })
    ]);
    // Compter les parties par game_id
    const progressCount = {};
    (progress.data || []).forEach(p => {
      progressCount[p.game_id] = (progressCount[p.game_id] || 0) + 1;
    });
    return { data: sims.data || [], progressCount, error: sims.error };
  } catch(e) {
    console.error('[ADMIN] fetchSimulations:', e);
    return { data: [], progressCount: {}, error: e };
  }
}

async function renderSimulations(el) {
  // État de chargement
  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left"><h1>Simulations <em>Immersium</em></h1><p>Chargement…</p></div>
    </div>
    <div style="text-align:center;padding:60px;color:var(--ink-mute);font-size:14px">
      <div class="spinner" style="display:inline-block;width:32px;height:32px;border:3px solid var(--line);border-top-color:var(--marine);border-radius:50%;animation:spin 1s linear infinite"></div>
      <div style="margin-top:16px">Récupération des simulations depuis Supabase…</div>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  </div>`;

  const { data: sims, progressCount, error } = await fetchSimulations();

  if (error || sims.length === 0) {
    el.innerHTML = `<div class="wrap">
      <div class="page-h">
        <div class="page-h-left"><h1>Simulations <em>Immersium</em></h1></div>
      </div>
      <div class="card" style="padding:40px;text-align:center">
        <h3 style="margin-bottom:10px">Aucune simulation trouvée</h3>
        <p style="color:var(--ink-mute);font-size:13px">
          ${error ? 'Erreur : ' + (error.message || error) : 'La table simulations est vide.'}
        </p>
      </div>
    </div>`;
    return;
  }

  const totalPlays = Object.values(progressCount).reduce((t, n) => t + n, 0);
  const activeCount = sims.filter(s => s.active).length;

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Simulations <em>Immersium</em></h1>
        <p>${sims.length} simulations dans votre catalogue</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-secondary" onclick="renderSimulations(document.getElementById('pageArea'))">
          ${iconDownload()}<span>Actualiser</span>
        </button>
        <button class="btn btn-primary" onclick="openImportSimModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <span>Importer JSON</span>
        </button>
      </div>
    </div>
    <div class="kpi-grid">
      <div class="kpi accent"><div class="value">${sims.length}</div><div class="label">Simulations</div></div>
      <div class="kpi success"><div class="value">${activeCount}</div><div class="label">Actives</div></div>
      <div class="kpi"><div class="value">${sims.reduce((t, s) => t + (s.challenge_count || 21), 0)}</div><div class="label">Défis totaux</div></div>
      <div class="kpi"><div class="value">${totalPlays}</div><div class="label">Parties jouées</div></div>
    </div>
    <div class="simulations-grid">
      ${sims.map(s => {
        const icon = DOMAIN_ICONS[s.domain] || DEFAULT_ICON;
        const plays = progressCount[s.game_id] || 0;
        const status = s.active ? 'Actif' : 'Inactif';
        const level = s.level || '—';
        return `<div class="sim-card" data-game="${s.game_id}">
          <div class="sim-thumb" style="display:flex;align-items:center;justify-content:center;color:var(--marine)">${icon}</div>
          <div class="sim-body">
            <div class="sim-title">${s.name}</div>
            <div class="sim-meta">${s.domain || ''}${level !== '—' ? ' · ' + level : ''}</div>
            <div style="font-size:12px;color:var(--ink-mute);margin-top:8px;line-height:1.5">
              ${s.description ? s.description.substring(0, 100) + (s.description.length > 100 ? '…' : '') : ''}
            </div>
          </div>
          <div class="sim-footer">
            ${badgeStatus(status)}
            <span style="font-family:var(--f-mono);font-size:11px;color:var(--ink-mute)">${s.challenge_count || 21} défis · ${plays} parties</span>
            <div style="display:flex;gap:6px">
              <a href="../game.html?game=${s.game_id}" target="_blank" class="btn btn-secondary btn-sm" title="Ouvrir la simulation">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
              <button class="btn btn-secondary btn-sm" onclick="exportSimulationJson('${s.game_id}')" title="Exporter en JSON">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              </button>
              <button class="btn btn-secondary btn-sm" onclick="openSimModal('${s.game_id}')" title="Modifier">${iconEdit()}</button>
            </div>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <!-- Modal d'édition simulation -->
  <div class="modal-overlay" id="simModalOverlay" hidden>
    <div class="modal" style="max-width:640px">
      <div class="modal-h">
        <h3 id="simModalTitle">Modifier la simulation</h3>
        <button class="modal-close" onclick="closeSimModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="simModalBody">
        <!-- Rempli dynamiquement -->
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeSimModal()">Annuler</button>
        <button class="btn btn-primary" id="simModalSaveBtn" onclick="saveSimulation()">
          <span>Enregistrer</span>
        </button>
      </div>
    </div>
  </div>`;
}

/* ─── Modal édition simulation ─────────────────────── */
let currentEditingSim = null;

async function openSimModal(gameId) {
  const sb = window.IMM_SUPABASE;
  if (!sb) { showToast('Supabase non disponible', 'error'); return; }

  const overlay = document.getElementById('simModalOverlay');
  const body = document.getElementById('simModalBody');
  const title = document.getElementById('simModalTitle');
  overlay.hidden = false;
  body.innerHTML = `<div style="text-align:center;padding:40px;color:var(--ink-mute)">Chargement…</div>`;

  try {
    const { data, error } = await sb.from('simulations').select('*').eq('game_id', gameId).single();
    if (error || !data) { body.innerHTML = `<div style="padding:20px;color:#DC2626">Erreur : ${error?.message || 'introuvable'}</div>`; return; }

    currentEditingSim = data;
    title.textContent = `Modifier ${data.name}`;

    body.innerHTML = `
      <div class="form-group">
        <label class="form-label">Identifiant (game_id)</label>
        <input type="text" class="form-input" value="${data.game_id}" disabled style="background:var(--bg-alt);color:var(--ink-mute)">
        <small style="color:var(--ink-mute);font-size:11px">Non modifiable</small>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        <div class="form-group">
          <label class="form-label">Nom *</label>
          <input type="text" class="form-input" id="sim-name" value="${escapeHtml(data.name || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Numéro</label>
          <input type="text" class="form-input" id="sim-num" value="${escapeHtml(data.num || '')}">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Domaine</label>
        <input type="text" class="form-input" id="sim-domain" value="${escapeHtml(data.domain || '')}">
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        <div class="form-group">
          <label class="form-label">Niveau</label>
          <select class="form-input" id="sim-level">
            <option value="">—</option>
            <option value="Débutant" ${data.level === 'Débutant' ? 'selected' : ''}>Débutant</option>
            <option value="Intermédiaire" ${data.level === 'Intermédiaire' ? 'selected' : ''}>Intermédiaire</option>
            <option value="Avancé" ${data.level === 'Avancé' ? 'selected' : ''}>Avancé</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Statut</label>
          <select class="form-input" id="sim-active">
            <option value="true" ${data.active ? 'selected' : ''}>Actif</option>
            <option value="false" ${!data.active ? 'selected' : ''}>Inactif</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Description</label>
        <textarea class="form-input" id="sim-description" rows="3">${escapeHtml(data.description || '')}</textarea>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
        <div class="form-group">
          <label class="form-label">Nb de défis</label>
          <input type="number" class="form-input" id="sim-challenge-count" value="${data.challenge_count || 21}" min="1">
        </div>
        <div class="form-group">
          <label class="form-label">Durée (min)</label>
          <input type="number" class="form-input" id="sim-duration" value="${data.duration_min || 90}" min="1">
        </div>
        <div class="form-group">
          <label class="form-label">Prix (€)</label>
          <input type="number" class="form-input" id="sim-price" value="${data.price_eur || 0}" step="0.01" min="0">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        <div class="form-group">
          <label class="form-label">Tuteur — Nom</label>
          <input type="text" class="form-input" id="sim-tutor-name" value="${escapeHtml(data.tutor_name || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Tuteur — Rôle</label>
          <input type="text" class="form-input" id="sim-tutor-role" value="${escapeHtml(data.tutor_role || '')}">
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
        <div class="form-group">
          <label class="form-label">Ordre d'affichage</label>
          <input type="number" class="form-input" id="sim-sort-order" value="${data.sort_order || 0}">
        </div>
        <div class="form-group">
          <label class="form-label">Couleur principale</label>
          <input type="text" class="form-input" id="sim-color" value="${escapeHtml(data.color || '')}" placeholder="#1E3A8A">
        </div>
        <div class="form-group">
          <label class="form-label">Couleur niveau</label>
          <input type="text" class="form-input" id="sim-level-color" value="${escapeHtml(data.level_color || '')}" placeholder="#16A34A">
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Intro (texte narratif)</label>
        <textarea class="form-input" id="sim-intro" rows="4">${escapeHtml(data.intro_text || '')}</textarea>
      </div>

      <div style="padding:12px 14px;background:var(--bg-alt);border-radius:var(--r-sm);font-size:12px;color:var(--ink-mute);margin-top:10px">
        <strong style="color:var(--ink)">À savoir</strong> — Les champs "compétences" et "personnages" (listes JSON)
        ne sont pas éditables via ce formulaire pour l'instant. Utilise un import SQL pour les modifier.
      </div>
    `;
  } catch (e) {
    body.innerHTML = `<div style="padding:20px;color:#DC2626">Erreur : ${e.message}</div>`;
  }
}

function closeSimModal() {
  document.getElementById('simModalOverlay').hidden = true;
  currentEditingSim = null;
}

async function saveSimulation() {
  if (!currentEditingSim) return;
  const sb = window.IMM_SUPABASE;
  const btn = document.getElementById('simModalSaveBtn');
  btn.disabled = true;
  btn.innerHTML = '<span>Enregistrement…</span>';

  // Récupérer les valeurs
  const payload = {
    name: document.getElementById('sim-name').value.trim(),
    num: document.getElementById('sim-num').value.trim() || null,
    domain: document.getElementById('sim-domain').value.trim() || null,
    level: document.getElementById('sim-level').value || null,
    active: document.getElementById('sim-active').value === 'true',
    description: document.getElementById('sim-description').value.trim() || null,
    challenge_count: parseInt(document.getElementById('sim-challenge-count').value, 10) || 21,
    duration_min: parseInt(document.getElementById('sim-duration').value, 10) || null,
    price_eur: parseFloat(document.getElementById('sim-price').value) || null,
    tutor_name: document.getElementById('sim-tutor-name').value.trim() || null,
    tutor_role: document.getElementById('sim-tutor-role').value.trim() || null,
    sort_order: parseInt(document.getElementById('sim-sort-order').value, 10) || 0,
    color: document.getElementById('sim-color').value.trim() || null,
    level_color: document.getElementById('sim-level-color').value.trim() || null,
    intro_text: document.getElementById('sim-intro').value.trim() || null,
    updated_at: new Date().toISOString(),
  };

  if (!payload.name) {
    showToast('Le nom est obligatoire', 'error');
    btn.disabled = false;
    btn.innerHTML = '<span>Enregistrer</span>';
    return;
  }

  try {
    const { error } = await sb
      .from('simulations')
      .update(payload)
      .eq('game_id', currentEditingSim.game_id);

    if (error) throw error;

    showToast(`Simulation ${payload.name} mise à jour`, 'success');
    closeSimModal();
    // Recharger la liste
    await renderSimulations(document.getElementById('pageArea'));
  } catch (e) {
    console.error('[ADMIN] saveSimulation:', e);
    showToast('Erreur : ' + (e.message || e), 'error');
    btn.disabled = false;
    btn.innerHTML = '<span>Enregistrer</span>';
  }
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Exposer globalement (onclick inline)
window.openSimModal = openSimModal;
window.closeSimModal = closeSimModal;
window.saveSimulation = saveSimulation;
window.renderSimulations = renderSimulations;

/* ─── EDITOR ─────────────────────────────────────────── */
/* ═══════════════════════════════════════════════════════════════════
   ÉDITEUR HIÉRARCHIQUE — Simulations > Défi > Question
   ═══════════════════════════════════════════════════════════════════ */

// État de navigation de l'éditeur
const editorState = {
  view: 'list',          // 'list' | 'sim' | 'challenge' | 'question'
  simTab: 'meta',        // 'meta' | 'onboarding' | 'challenges'
  gameId: null,
  challengeNum: null,
  questionIndex: null,
  cache: { sims: null, challenges: {} },  // cache pour éviter re-fetch
};

async function renderEditor(el) {
  const state = editorState;

  // Router selon la view
  if (state.view === 'list') {
    return renderEditorSimList(el);
  }
  if (state.view === 'sim') {
    return renderEditorSim(el);
  }
  if (state.view === 'challenge') {
    return renderEditorChallenge(el);
  }
  if (state.view === 'question') {
    return renderEditorQuestion(el);
  }
}

window.renderEditor = renderEditor;

/* ── Breadcrumb partagé ─────────────────────────────── */
function editorBreadcrumb() {
  const s = editorState;
  const crumbs = [
    `<a href="#" onclick="editorGoList();return false" style="color:var(--marine);text-decoration:none;font-weight:500">Éditeur</a>`
  ];
  if (s.gameId) {
    crumbs.push(`<span style="color:var(--ink-mute)">›</span>`);
    if (s.view === 'sim') {
      crumbs.push(`<span style="font-weight:600">${s.gameId.toUpperCase()}</span>`);
    } else {
      crumbs.push(`<a href="#" onclick="editorGoSim('${s.gameId}');return false" style="color:var(--marine);text-decoration:none;font-weight:500">${s.gameId.toUpperCase()}</a>`);
    }
  }
  if (s.challengeNum) {
    crumbs.push(`<span style="color:var(--ink-mute)">›</span>`);
    if (s.view === 'challenge') {
      crumbs.push(`<span style="font-weight:600">Défi ${s.challengeNum}</span>`);
    } else {
      crumbs.push(`<a href="#" onclick="editorGoChallenge('${s.gameId}',${s.challengeNum});return false" style="color:var(--marine);text-decoration:none;font-weight:500">Défi ${s.challengeNum}</a>`);
    }
  }
  if (s.questionIndex) {
    crumbs.push(`<span style="color:var(--ink-mute)">›</span>`);
    crumbs.push(`<span style="font-weight:600">Question ${s.questionIndex}</span>`);
  }
  return `<div style="display:flex;align-items:center;gap:8px;font-size:13px;margin-bottom:24px;padding:10px 14px;background:var(--paper);border:1px solid var(--line);border-radius:var(--r-sm)">${crumbs.join('')}</div>`;
}

/* ── Navigation helpers ─────────────────────────────── */
window.editorGoList = () => {
  editorState.view = 'list';
  editorState.gameId = null;
  editorState.challengeNum = null;
  editorState.questionIndex = null;
  renderEditor(document.getElementById('pageArea'));
};
window.editorGoSim = (gameId) => {
  editorState.view = 'sim';
  editorState.gameId = gameId;
  editorState.challengeNum = null;
  editorState.questionIndex = null;
  editorState.simTab = 'meta';
  renderEditor(document.getElementById('pageArea'));
};
window.editorGoChallenge = (gameId, cn) => {
  editorState.view = 'challenge';
  editorState.gameId = gameId;
  editorState.challengeNum = cn;
  editorState.questionIndex = null;
  renderEditor(document.getElementById('pageArea'));
};
window.editorGoQuestion = (gameId, cn, qi) => {
  editorState.view = 'question';
  editorState.gameId = gameId;
  editorState.challengeNum = cn;
  editorState.questionIndex = qi;
  renderEditor(document.getElementById('pageArea'));
};

/* ─── VIEW 1 : Liste des simulations ─────────────── */
async function renderEditorSimList(el) {
  el.innerHTML = `<div class="wrap">
    ${editorBreadcrumb()}
    <div class="page-h">
      <div class="page-h-left">
        <h1>Éditeur de <em>contenu</em></h1>
        <p>Sélectionnez une simulation pour éditer son contenu</p>
      </div>
    </div>
    <div style="text-align:center;padding:40px;color:var(--ink-mute)">Chargement…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  if (!sb) { showToast('Supabase non disponible', 'error'); return; }

  const { data: sims, error } = await sb.from('simulations').select('*').order('sort_order');
  if (error) {
    el.innerHTML = `<div class="wrap"><div style="padding:40px;color:#DC2626">Erreur : ${error.message}</div></div>`;
    return;
  }
  editorState.cache.sims = sims;

  el.innerHTML = `<div class="wrap">
    ${editorBreadcrumb()}
    <div class="page-h">
      <div class="page-h-left">
        <h1>Éditeur de <em>contenu</em></h1>
        <p>${sims.length} simulations · Cliquez pour éditer</p>
      </div>
    </div>
    <div class="simulations-grid">
      ${sims.map(s => {
        const icon = DOMAIN_ICONS[s.domain] || DEFAULT_ICON;
        return `<div class="sim-card" style="cursor:pointer" onclick="editorGoSim('${s.game_id}')">
          <div class="sim-thumb" style="display:flex;align-items:center;justify-content:center;color:var(--marine)">${icon}</div>
          <div class="sim-body">
            <div class="sim-title">${s.name}</div>
            <div class="sim-meta">${s.domain || ''}${s.level ? ' · ' + s.level : ''}</div>
          </div>
          <div class="sim-footer">
            ${badgeStatus(s.active ? 'Actif' : 'Inactif')}
            <span style="font-family:var(--f-mono);font-size:11px;color:var(--ink-mute)">${s.challenge_count || 21} défis</span>
            <span style="color:var(--marine)">${iconEdit()}</span>
          </div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

/* ─── VIEW 2 : Simulation sélectionnée ───────────── */
async function renderEditorSim(el) {
  const gameId = editorState.gameId;
  const sb = window.IMM_SUPABASE;
  const tab = editorState.simTab;

  el.innerHTML = `<div class="wrap">
    ${editorBreadcrumb()}
    <div style="text-align:center;padding:40px;color:var(--ink-mute)">Chargement de ${gameId.toUpperCase()}…</div>
  </div>`;

  // Charger simulation + challenges (pour la liste de défis)
  const [simRes, chalRes] = await Promise.all([
    sb.from('simulations').select('*').eq('game_id', gameId).single(),
    sb.from('challenges').select('challenge_num,challenge_title,session_name,question_index').eq('game_id', gameId).order('challenge_num').order('question_index')
  ]);

  if (simRes.error || !simRes.data) {
    el.innerHTML = `<div class="wrap"><div style="padding:40px;color:#DC2626">Erreur : ${simRes.error?.message || 'introuvable'}</div></div>`;
    return;
  }
  const sim = simRes.data;
  const challenges = chalRes.data || [];
  editorState.cache.challenges[gameId] = challenges;

  // Regrouper les questions par défi
  const byChal = {};
  challenges.forEach(c => {
    if (!byChal[c.challenge_num]) {
      byChal[c.challenge_num] = {
        num: c.challenge_num,
        title: c.challenge_title || `Défi ${c.challenge_num}`,
        session: c.session_name || '',
        questions: []
      };
    }
    byChal[c.challenge_num].questions.push(c.question_index);
  });
  const chalList = Object.values(byChal).sort((a, b) => a.num - b.num);

  // Parser les JSONB éventuellement string
  ['competences', 'characters'].forEach(f => {
    if (typeof sim[f] === 'string') { try { sim[f] = JSON.parse(sim[f]); } catch(e) {} }
  });

  const tabs = [
    { id: 'meta', label: 'Métadonnées' },
    { id: 'onboarding', label: 'Onboarding' },
    { id: 'challenges', label: `Défis (${chalList.length})` },
  ];

  el.innerHTML = `<div class="wrap">
    ${editorBreadcrumb()}
    <div class="page-h">
      <div class="page-h-left">
        <h1>${sim.name} <em style="color:var(--ink-mute);font-size:20px">${sim.domain || ''}</em></h1>
        <p>${sim.description ? sim.description.substring(0, 120) + '…' : 'Aucune description'}</p>
      </div>
      <div class="page-h-right">
        <a href="../game.html?game=${gameId}" target="_blank" class="btn btn-secondary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          <span>Aperçu</span>
        </a>
      </div>
    </div>

    <div style="display:flex;gap:4px;border-bottom:1px solid var(--line);margin-bottom:24px">
      ${tabs.map(t => `
        <button onclick="editorState.simTab='${t.id}';renderEditor(document.getElementById('pageArea'))"
                style="padding:10px 18px;background:none;border:none;font-size:13px;font-weight:${tab===t.id?'600':'500'};color:${tab===t.id?'var(--marine)':'var(--ink-mute)'};cursor:pointer;border-bottom:2px solid ${tab===t.id?'var(--marine)':'transparent'};margin-bottom:-1px">
          ${t.label}
        </button>`).join('')}
    </div>

    <div id="editor-tab-content"></div>
  </div>`;

  const tabEl = document.getElementById('editor-tab-content');
  if (tab === 'meta') renderEditorSimMeta(tabEl, sim);
  else if (tab === 'onboarding') renderEditorSimOnboarding(tabEl, sim);
  else if (tab === 'challenges') renderEditorSimChallenges(tabEl, sim, chalList);
}

/* ── Onglet Métadonnées ─────────────────────────── */
function renderEditorSimMeta(el, sim) {
  el.innerHTML = `<div class="card" style="padding:24px;max-width:720px">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="form-group">
        <label class="form-label">Nom *</label>
        <input type="text" class="form-input" id="sim-name" value="${escapeHtml(sim.name || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">Numéro</label>
        <input type="text" class="form-input" id="sim-num" value="${escapeHtml(sim.num || '')}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Domaine</label>
      <input type="text" class="form-input" id="sim-domain" value="${escapeHtml(sim.domain || '')}">
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <div class="form-group">
        <label class="form-label">Niveau</label>
        <select class="form-input" id="sim-level">
          <option value="">—</option>
          <option value="Débutant" ${sim.level === 'Débutant' ? 'selected' : ''}>Débutant</option>
          <option value="Intermédiaire" ${sim.level === 'Intermédiaire' ? 'selected' : ''}>Intermédiaire</option>
          <option value="Avancé" ${sim.level === 'Avancé' ? 'selected' : ''}>Avancé</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Statut</label>
        <select class="form-input" id="sim-active">
          <option value="true" ${sim.active ? 'selected' : ''}>Actif</option>
          <option value="false" ${!sim.active ? 'selected' : ''}>Inactif</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Description</label>
      <textarea class="form-input" id="sim-description" rows="3">${escapeHtml(sim.description || '')}</textarea>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
      <div class="form-group">
        <label class="form-label">Nb de défis</label>
        <input type="number" class="form-input" id="sim-challenge-count" value="${sim.challenge_count || 21}">
      </div>
      <div class="form-group">
        <label class="form-label">Durée (min)</label>
        <input type="number" class="form-input" id="sim-duration" value="${sim.duration_min || 90}">
      </div>
      <div class="form-group">
        <label class="form-label">Prix (€)</label>
        <input type="number" class="form-input" id="sim-price" value="${sim.price_eur || 0}" step="0.01">
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
      <div class="form-group">
        <label class="form-label">Ordre</label>
        <input type="number" class="form-input" id="sim-sort-order" value="${sim.sort_order || 0}">
      </div>
      <div class="form-group">
        <label class="form-label">Couleur principale</label>
        <input type="text" class="form-input" id="sim-color" value="${escapeHtml(sim.color || '')}" placeholder="#1E3A8A">
      </div>
      <div class="form-group">
        <label class="form-label">Couleur niveau</label>
        <input type="text" class="form-input" id="sim-level-color" value="${escapeHtml(sim.level_color || '')}" placeholder="#16A34A">
      </div>
    </div>
    <div style="display:flex;gap:10px;margin-top:20px">
      <button class="btn btn-primary" onclick="saveSimMeta()">Enregistrer</button>
      <button class="btn btn-secondary" onclick="editorGoList()">Annuler</button>
    </div>
  </div>`;
}

window.saveSimMeta = async function() {
  const sb = window.IMM_SUPABASE;
  const gameId = editorState.gameId;
  const payload = {
    name: document.getElementById('sim-name').value.trim(),
    num: document.getElementById('sim-num').value.trim() || null,
    domain: document.getElementById('sim-domain').value.trim() || null,
    level: document.getElementById('sim-level').value || null,
    active: document.getElementById('sim-active').value === 'true',
    description: document.getElementById('sim-description').value.trim() || null,
    challenge_count: parseInt(document.getElementById('sim-challenge-count').value, 10) || 21,
    duration_min: parseInt(document.getElementById('sim-duration').value, 10) || null,
    price_eur: parseFloat(document.getElementById('sim-price').value) || null,
    sort_order: parseInt(document.getElementById('sim-sort-order').value, 10) || 0,
    color: document.getElementById('sim-color').value.trim() || null,
    level_color: document.getElementById('sim-level-color').value.trim() || null,
    updated_at: new Date().toISOString(),
  };
  if (!payload.name) { showToast('Le nom est obligatoire', 'error'); return; }
  try {
    const { error } = await sb.from('simulations').update(payload).eq('game_id', gameId);
    if (error) throw error;
    showToast(`Métadonnées de ${payload.name} mises à jour`, 'success');
  } catch (e) {
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

/* ── Onglet Onboarding ──────────────────────────── */
function renderEditorSimOnboarding(el, sim) {
  const characters = Array.isArray(sim.characters) ? sim.characters : [];
  const competences = Array.isArray(sim.competences) ? sim.competences : [];

  el.innerHTML = `<div style="display:grid;gap:24px;max-width:900px">

    <div class="card" style="padding:24px">
      <h2 style="font-size:17px;margin-bottom:16px">Texte d'introduction</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        <div class="form-group">
          <label class="form-label">Tuteur — Nom</label>
          <input type="text" class="form-input" id="sim-tutor-name" value="${escapeHtml(sim.tutor_name || '')}">
        </div>
        <div class="form-group">
          <label class="form-label">Tuteur — Rôle</label>
          <input type="text" class="form-input" id="sim-tutor-role" value="${escapeHtml(sim.tutor_role || '')}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Texte narratif "Ton premier jour"</label>
        <textarea class="form-input" id="sim-intro" rows="8" style="font-family:var(--f-display)">${escapeHtml(sim.intro_text || '')}</textarea>
      </div>
      <button class="btn btn-primary" onclick="saveSimOnboardingText()">Enregistrer le texte</button>
    </div>

    <div class="card" style="padding:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h2 style="font-size:17px">Compétences à acquérir <span style="color:var(--ink-mute);font-size:12px;font-weight:400">(${competences.length})</span></h2>
      </div>
      <div id="competences-list">
        ${competences.map((c, i) => `
          <div style="display:flex;gap:8px;margin-bottom:8px;align-items:center">
            <input type="text" class="form-input" value="${escapeHtml(c)}" data-comp-idx="${i}" style="flex:1">
            <button class="btn btn-secondary btn-sm" onclick="this.parentElement.remove()" title="Supprimer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
            </button>
          </div>
        `).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn btn-secondary" onclick="addCompetence()">${iconPlus()}<span>Ajouter une compétence</span></button>
        <button class="btn btn-primary" onclick="saveSimCompetences()">Enregistrer</button>
      </div>
    </div>

    <div class="card" style="padding:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h2 style="font-size:17px">Personnages <span style="color:var(--ink-mute);font-size:12px;font-weight:400">(${characters.length})</span></h2>
      </div>
      <div id="characters-list" style="display:grid;gap:16px">
        ${characters.map((c, i) => `
          <div class="char-item" data-char-idx="${i}" style="padding:16px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--bg-alt)">
            <div style="display:grid;grid-template-columns:1fr 1fr 80px auto;gap:10px;margin-bottom:10px">
              <div><label style="font-size:11px;color:var(--ink-mute)">Nom</label>
                <input type="text" class="form-input char-name" value="${escapeHtml(c.name || '')}"></div>
              <div><label style="font-size:11px;color:var(--ink-mute)">Rôle</label>
                <input type="text" class="form-input char-role" value="${escapeHtml(c.role || '')}"></div>
              <div><label style="font-size:11px;color:var(--ink-mute)">Âge</label>
                <input type="number" class="form-input char-age" value="${c.age || ''}"></div>
              <div style="display:flex;align-items:flex-end">
                <button class="btn btn-secondary btn-sm" onclick="this.closest('.char-item').remove()" title="Supprimer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
                </button>
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
              <div><label style="font-size:11px;color:var(--ink-mute)">Canal</label>
                <input type="text" class="form-input char-channel" value="${escapeHtml(c.channel || '')}" placeholder="Email · Teams"></div>
              <div><label style="font-size:11px;color:var(--ink-mute)">Photo (URL)</label>
                <input type="text" class="form-input char-photo" value="${escapeHtml(c.photo_url || '')}"></div>
            </div>
            <div style="margin-top:10px">
              <label style="font-size:11px;color:var(--ink-mute)">Citation</label>
              <textarea class="form-input char-quote" rows="2">${escapeHtml(c.quote || '')}</textarea>
            </div>
            <div style="margin-top:10px">
              <label style="font-size:11px;color:var(--ink-mute)">Description</label>
              <textarea class="form-input char-description" rows="2">${escapeHtml(c.description || '')}</textarea>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:14px">
        <button class="btn btn-secondary" onclick="addCharacter()">${iconPlus()}<span>Ajouter un personnage</span></button>
        <button class="btn btn-primary" onclick="saveSimCharacters()">Enregistrer les personnages</button>
      </div>
    </div>

  </div>`;
}

window.saveSimOnboardingText = async function() {
  const sb = window.IMM_SUPABASE;
  const payload = {
    tutor_name: document.getElementById('sim-tutor-name').value.trim() || null,
    tutor_role: document.getElementById('sim-tutor-role').value.trim() || null,
    intro_text: document.getElementById('sim-intro').value.trim() || null,
    updated_at: new Date().toISOString(),
  };
  try {
    const { error } = await sb.from('simulations').update(payload).eq('game_id', editorState.gameId);
    if (error) throw error;
    showToast('Texte d\'introduction sauvegardé', 'success');
  } catch (e) {
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

window.addCompetence = function() {
  const list = document.getElementById('competences-list');
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;gap:8px;margin-bottom:8px;align-items:center';
  div.innerHTML = `<input type="text" class="form-input" placeholder="Nouvelle compétence" style="flex:1">
    <button class="btn btn-secondary btn-sm" onclick="this.parentElement.remove()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
    </button>`;
  list.appendChild(div);
  div.querySelector('input').focus();
};

window.saveSimCompetences = async function() {
  const sb = window.IMM_SUPABASE;
  const inputs = document.querySelectorAll('#competences-list input');
  const comps = Array.from(inputs).map(i => i.value.trim()).filter(v => v);
  try {
    const { error } = await sb.from('simulations').update({ competences: comps, updated_at: new Date().toISOString() }).eq('game_id', editorState.gameId);
    if (error) throw error;
    showToast(`${comps.length} compétences sauvegardées`, 'success');
  } catch (e) {
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

window.addCharacter = function() {
  const list = document.getElementById('characters-list');
  const div = document.createElement('div');
  div.className = 'char-item';
  div.style.cssText = 'padding:16px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--bg-alt)';
  div.innerHTML = `<div style="display:grid;grid-template-columns:1fr 1fr 80px auto;gap:10px;margin-bottom:10px">
    <div><label style="font-size:11px;color:var(--ink-mute)">Nom</label>
      <input type="text" class="form-input char-name" placeholder="Prénom Nom"></div>
    <div><label style="font-size:11px;color:var(--ink-mute)">Rôle</label>
      <input type="text" class="form-input char-role"></div>
    <div><label style="font-size:11px;color:var(--ink-mute)">Âge</label>
      <input type="number" class="form-input char-age"></div>
    <div style="display:flex;align-items:flex-end">
      <button class="btn btn-secondary btn-sm" onclick="this.closest('.char-item').remove()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
      </button>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div><label style="font-size:11px;color:var(--ink-mute)">Canal</label>
      <input type="text" class="form-input char-channel" placeholder="Email · Teams"></div>
    <div><label style="font-size:11px;color:var(--ink-mute)">Photo (URL)</label>
      <input type="text" class="form-input char-photo"></div>
  </div>
  <div style="margin-top:10px">
    <label style="font-size:11px;color:var(--ink-mute)">Citation</label>
    <textarea class="form-input char-quote" rows="2"></textarea>
  </div>
  <div style="margin-top:10px">
    <label style="font-size:11px;color:var(--ink-mute)">Description</label>
    <textarea class="form-input char-description" rows="2"></textarea>
  </div>`;
  list.appendChild(div);
};

window.saveSimCharacters = async function() {
  const sb = window.IMM_SUPABASE;
  const items = document.querySelectorAll('#characters-list .char-item');
  const chars = Array.from(items).map(el => ({
    name: el.querySelector('.char-name').value.trim(),
    role: el.querySelector('.char-role').value.trim(),
    age: parseInt(el.querySelector('.char-age').value, 10) || null,
    channel: el.querySelector('.char-channel').value.trim(),
    photo_url: el.querySelector('.char-photo').value.trim(),
    quote: el.querySelector('.char-quote').value.trim(),
    description: el.querySelector('.char-description').value.trim(),
  })).filter(c => c.name);
  try {
    const { error } = await sb.from('simulations').update({ characters: chars, updated_at: new Date().toISOString() }).eq('game_id', editorState.gameId);
    if (error) throw error;
    showToast(`${chars.length} personnages sauvegardés`, 'success');
  } catch (e) {
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

/* ── Onglet Défis (liste) ──────────────────────── */
function renderEditorSimChallenges(el, sim, chalList) {
  if (chalList.length === 0) {
    el.innerHTML = `<div class="card" style="padding:40px;text-align:center;color:var(--ink-mute)">
      Aucun défi trouvé pour cette simulation.
    </div>`;
    return;
  }

  // Regrouper par session
  const bySession = {};
  chalList.forEach(c => {
    const sess = c.session || 'Sans session';
    if (!bySession[sess]) bySession[sess] = [];
    bySession[sess].push(c);
  });

  el.innerHTML = Object.entries(bySession).map(([sess, items]) => `
    <div style="margin-bottom:28px">
      <h3 style="font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:12px;font-weight:600">${escapeHtml(sess)}</h3>
      <div style="display:grid;gap:8px">
        ${items.map(c => `
          <div style="display:flex;align-items:center;gap:14px;padding:14px 18px;background:var(--paper);border:1px solid var(--line);border-radius:var(--r-sm);cursor:pointer;transition:all .15s"
               onclick="editorGoChallenge('${editorState.gameId}',${c.num})"
               onmouseover="this.style.borderColor='var(--marine)';this.style.transform='translateX(4px)'"
               onmouseout="this.style.borderColor='var(--line)';this.style.transform='translateX(0)'">
            <div style="width:32px;height:32px;border-radius:50%;background:var(--marine-soft);color:var(--marine);display:flex;align-items:center;justify-content:center;font-weight:700;font-family:var(--f-mono);font-size:13px">${c.num}</div>
            <div style="flex:1">
              <div style="font-weight:500;font-size:14px;margin-bottom:2px">${escapeHtml(c.title)}</div>
              <div style="font-size:11px;color:var(--ink-mute)">${c.questions.length} question${c.questions.length > 1 ? 's' : ''}</div>
            </div>
            <span style="color:var(--ink-mute)">${iconEdit()}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* ─── VIEW 3 : Défi sélectionné ──────────────────── */
async function renderEditorChallenge(el) {
  const gameId = editorState.gameId;
  const cn = editorState.challengeNum;
  const sb = window.IMM_SUPABASE;

  el.innerHTML = `<div class="wrap">${editorBreadcrumb()}<div style="padding:40px;color:var(--ink-mute);text-align:center">Chargement…</div></div>`;

  const { data: questions, error } = await sb
    .from('challenges')
    .select('*')
    .eq('game_id', gameId)
    .eq('challenge_num', cn)
    .order('question_index');

  if (error || !questions || questions.length === 0) {
    el.innerHTML = `<div class="wrap">${editorBreadcrumb()}<div style="padding:40px;color:#DC2626">${error?.message || 'Aucune question trouvée'}</div></div>`;
    return;
  }

  const firstQ = questions[0];

  el.innerHTML = `<div class="wrap">
    ${editorBreadcrumb()}
    <div class="page-h">
      <div class="page-h-left">
        <h1>Défi ${cn} — <em>${escapeHtml(firstQ.challenge_title || '')}</em></h1>
        <p>${questions.length} question${questions.length > 1 ? 's' : ''} · ${escapeHtml(firstQ.session_name || '')}</p>
      </div>
    </div>

    <div class="card" style="padding:24px;margin-bottom:24px;max-width:720px">
      <h2 style="font-size:15px;margin-bottom:16px">Informations du défi</h2>
      <div class="form-group">
        <label class="form-label">Titre du défi</label>
        <input type="text" class="form-input" id="chal-title" value="${escapeHtml(firstQ.challenge_title || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">Session</label>
        <input type="text" class="form-input" id="chal-session" value="${escapeHtml(firstQ.session_name || '')}">
      </div>
      <button class="btn btn-primary" onclick="saveChallengeInfo()">Enregistrer</button>
      <small style="display:block;margin-top:8px;color:var(--ink-mute);font-size:11px">
        Le titre et la session s'appliquent aux ${questions.length} questions de ce défi.
      </small>
    </div>

    <h2 style="font-size:15px;margin-bottom:12px;letter-spacing:.05em;text-transform:uppercase;color:var(--ink-mute)">Questions <span style="color:var(--ink);font-weight:normal;text-transform:none;letter-spacing:0;font-size:12px">— cliquez sur une question pour éditer son contenu et ses notions</span></h2>
    <div style="display:grid;gap:10px;max-width:960px">
      ${questions.map(q => {
        const notions = Array.isArray(q.knowledge_notions) ? q.knowledge_notions : [];
        return `
        <div style="background:var(--paper);border:1px solid var(--line);border-radius:var(--r-sm);overflow:hidden">
          <div style="display:flex;align-items:flex-start;gap:14px;padding:16px 20px;cursor:pointer;transition:all .15s;border-bottom:${notions.length > 0 ? '1px solid var(--line)' : 'none'}"
               onclick="editorGoQuestion('${gameId}',${cn},${q.question_index})"
               onmouseover="this.style.background='var(--bg-alt)'"
               onmouseout="this.style.background='var(--paper)'">
            <div style="width:28px;height:28px;border-radius:50%;background:var(--marine);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0">${q.question_index}</div>
            <div style="flex:1">
              <div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:4px">Question ${q.question_index} · ${escapeHtml(q.type || 'mcq')}</div>
              <div style="font-weight:500;font-size:14px;line-height:1.45">${escapeHtml((q.question || q.prompt || '').substring(0, 180))}${(q.question || q.prompt || '').length > 180 ? '…' : ''}</div>
              <div style="display:flex;gap:12px;margin-top:8px;font-size:11px;color:var(--ink-mute);font-family:var(--f-mono)">
                <span>${q.points || 10} pts</span>
                ${notions.length > 0 ? `<span style="color:var(--jade)">✓ ${notions.length} notion${notions.length > 1 ? 's' : ''}</span>` : '<span style="color:var(--orange)">✗ sans notions</span>'}
              </div>
            </div>
            <span class="btn btn-primary btn-sm" style="pointer-events:none">Éditer</span>
          </div>
          ${notions.length > 0 ? `
            <div style="padding:12px 20px 14px 62px;background:var(--bg-alt);font-size:12px">
              <div style="font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--ink-mute);font-weight:600;margin-bottom:6px">Notions pédagogiques</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap">
                ${notions.map((n, i) => `
                  <span style="padding:4px 10px;background:var(--paper);border:1px solid var(--line);border-radius:6px;font-size:11.5px" title="${escapeHtml(n.definition || '')}">
                    <strong style="color:var(--marine)">N${i + 1}</strong> ${escapeHtml((n.title || '').substring(0, 50))}${(n.title || '').length > 50 ? '…' : ''}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;}).join('')}
    </div>
  </div>`;
}

window.saveChallengeInfo = async function() {
  const sb = window.IMM_SUPABASE;
  const payload = {
    challenge_title: document.getElementById('chal-title').value.trim() || null,
    session_name: document.getElementById('chal-session').value.trim() || null,
  };
  try {
    const { error } = await sb
      .from('challenges')
      .update(payload)
      .eq('game_id', editorState.gameId)
      .eq('challenge_num', editorState.challengeNum);
    if (error) throw error;
    showToast('Infos du défi mises à jour', 'success');
  } catch (e) {
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

/* ─── VIEW 4 : Question sélectionnée (éditeur complet) ── */
let currentEditingQuestion = null;  // stockage local pendant l'édition

async function renderEditorQuestion(el) {
  const sb = window.IMM_SUPABASE;
  const { gameId, challengeNum, questionIndex } = editorState;

  el.innerHTML = `<div class="wrap">${editorBreadcrumb()}<div style="padding:40px;color:var(--ink-mute);text-align:center">Chargement…</div></div>`;

  const { data: q, error } = await sb
    .from('challenges')
    .select('*')
    .eq('game_id', gameId)
    .eq('challenge_num', challengeNum)
    .eq('question_index', questionIndex)
    .single();

  if (error || !q) {
    el.innerHTML = `<div class="wrap">${editorBreadcrumb()}<div style="padding:40px;color:#DC2626">${error?.message || 'Question introuvable'}</div></div>`;
    return;
  }

  // Parser les JSONB qui pourraient être des strings
  ['options', 'options_detailed', 'correct_answer', 'pairs', 'knowledge_notions',
   'communications_before', 'communications_after', 'key_takeaways',
   'instructions', 'rubric'].forEach(f => {
    if (typeof q[f] === 'string') { try { q[f] = JSON.parse(q[f]); } catch(e) {} }
  });

  currentEditingQuestion = q;

  el.innerHTML = `<div class="wrap">
    ${editorBreadcrumb()}
    <div class="page-h">
      <div class="page-h-left">
        <h1>Question ${questionIndex} — <em>${escapeHtml(q.type || 'mcq')}</em></h1>
        <p>${escapeHtml((q.prompt || q.question || '').substring(0, 120))}…</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-secondary" onclick="editorGoChallenge('${gameId}',${challengeNum})">← Retour au défi</button>
        <button class="btn btn-primary" onclick="saveQuestion()">Enregistrer</button>
      </div>
    </div>

    <div style="display:grid;gap:20px;max-width:900px">

      <!-- Bloc 1 : Énoncé & type -->
      <div class="card" style="padding:24px">
        <h2 style="font-size:15px;margin-bottom:16px;letter-spacing:.04em">Énoncé et type</h2>
        <div style="display:grid;grid-template-columns:1fr 140px 100px;gap:14px">
          <div class="form-group">
            <label class="form-label">Type</label>
            <select class="form-input" id="q-type" onchange="renderQuestionTypeFields()">
              ${['mcq','checkbox','ordering','matching','open','free','tool','screenshot','tuto'].map(t => `
                <option value="${t}" ${q.type === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Points</label>
            <input type="number" class="form-input" id="q-points" value="${q.points || 10}">
          </div>
          <div class="form-group">
            <label class="form-label">Index</label>
            <input type="number" class="form-input" value="${q.question_index}" disabled style="background:var(--bg-alt);color:var(--ink-mute)">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Énoncé (prompt)</label>
          <textarea class="form-input" id="q-prompt" rows="3">${escapeHtml(q.prompt || q.question || '')}</textarea>
          <small style="color:var(--ink-mute);font-size:11px">C'est la question principale affichée à l'apprenant.</small>
        </div>
        <div class="form-group">
          <label class="form-label">Mission (texte d'intro facultatif)</label>
          <textarea class="form-input" id="q-mission" rows="2">${escapeHtml(q.mission || '')}</textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Scénario (partagé par les 3 questions du défi)</label>
          <textarea class="form-input" id="q-scenario" rows="2">${escapeHtml(q.scenario || '')}</textarea>
        </div>
      </div>

      <!-- Bloc 2 : Réponses/Options (adapté au type) -->
      <div class="card" style="padding:24px">
        <h2 style="font-size:15px;margin-bottom:16px;letter-spacing:.04em">Réponses et options</h2>
        <div id="q-type-fields"></div>
      </div>

      <!-- Bloc 3 : Base de connaissances (notions pédagogiques) -->
      <div class="card" style="padding:24px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <h2 style="font-size:15px;letter-spacing:.04em">Notions pédagogiques <span style="color:var(--ink-mute);font-size:12px;font-weight:400">(le pilier)</span></h2>
          <button class="btn btn-secondary btn-sm" onclick="addNotion()">${iconPlus()}<span>Ajouter une notion</span></button>
        </div>
        <div id="q-notions-list" style="display:grid;gap:14px">
          ${(q.knowledge_notions || []).map((n, i) => renderNotionBlock(n, i)).join('')}
        </div>
        ${(!q.knowledge_notions || q.knowledge_notions.length === 0) ? '<div style="padding:20px;text-align:center;color:var(--ink-mute);font-size:13px;background:var(--bg-alt);border-radius:var(--r-sm)">Aucune notion. Cliquez sur "Ajouter une notion" pour construire la base de connaissances.</div>' : ''}
      </div>

      <!-- Bloc 4 : Communications reçues avant -->
      <div class="card" style="padding:24px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <h2 style="font-size:15px;letter-spacing:.04em">Communications reçues avant</h2>
          <button class="btn btn-secondary btn-sm" onclick="addComm('before')">${iconPlus()}<span>Ajouter</span></button>
        </div>
        <div id="q-comms-before" style="display:grid;gap:10px">
          ${(q.communications_before || []).map((c, i) => renderCommBlock(c, 'before', i)).join('')}
        </div>
      </div>

      <!-- Bloc 5 : Communications reçues après -->
      <div class="card" style="padding:24px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <h2 style="font-size:15px;letter-spacing:.04em">Communications reçues après</h2>
          <button class="btn btn-secondary btn-sm" onclick="addComm('after')">${iconPlus()}<span>Ajouter</span></button>
        </div>
        <div id="q-comms-after" style="display:grid;gap:10px">
          ${(q.communications_after || []).map((c, i) => renderCommBlock(c, 'after', i)).join('')}
        </div>
      </div>

      <!-- Bloc 6 : Feedbacks & À retenir -->
      <div class="card" style="padding:24px">
        <h2 style="font-size:15px;margin-bottom:16px;letter-spacing:.04em">Feedbacks et à retenir</h2>
        <div class="form-group">
          <label class="form-label">Explication (affichée après la réponse)</label>
          <textarea class="form-input" id="q-explanation" rows="3">${escapeHtml(q.explanation || '')}</textarea>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div class="form-group">
            <label class="form-label">Feedback si correct (général)</label>
            <textarea class="form-input" id="q-feedback-correct" rows="3">${escapeHtml(q.feedback_correct || '')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Feedback si incorrect (général)</label>
            <textarea class="form-input" id="q-feedback-incorrect" rows="3">${escapeHtml(q.feedback_incorrect || '')}</textarea>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">À retenir (points clés)</label>
          <div id="q-takeaways" style="display:grid;gap:8px">
            ${(q.key_takeaways || []).map((t, i) => `
              <div style="display:flex;gap:8px;align-items:center">
                <input type="text" class="form-input" value="${escapeHtml(t)}">
                <button class="btn btn-secondary btn-sm" onclick="this.parentElement.remove()" title="Supprimer">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
                </button>
              </div>`).join('')}
          </div>
          <button class="btn btn-secondary btn-sm" style="margin-top:8px" onclick="addTakeaway()">${iconPlus()}<span>Ajouter un point</span></button>
        </div>
      </div>

      <!-- Actions de bas de page -->
      <div style="display:flex;gap:10px;justify-content:flex-end;padding:16px 0">
        <button class="btn btn-secondary" onclick="editorGoChallenge('${gameId}',${challengeNum})">Annuler</button>
        <button class="btn btn-primary" onclick="saveQuestion()">Enregistrer la question</button>
      </div>

    </div>
  </div>`;

  renderQuestionTypeFields();
}

/* ── Rendu adaptatif selon le type de question ─── */
window.renderQuestionTypeFields = function() {
  const type = document.getElementById('q-type').value;
  const container = document.getElementById('q-type-fields');
  const q = currentEditingQuestion;

  if (['mcq', 'qcm', 'checkbox'].includes(type)) {
    // Options avec feedback par option
    const opts = Array.isArray(q.options_detailed) && q.options_detailed.length > 0
      ? q.options_detailed
      : (Array.isArray(q.options) ? q.options.map((o, i) => ({
          label: typeof o === 'string' ? o : o.text || o.label || '',
          correct: Array.isArray(q.correct_answer) ? q.correct_answer.includes(i) : (q.correct_answer === i),
          feedback: ''
        })) : []);
    container.innerHTML = `
      <div style="font-size:11px;color:var(--ink-mute);margin-bottom:12px">
        Pour chaque option, cochez si c'est correct et renseignez le feedback affiché à l'apprenant.
      </div>
      <div id="q-options-list" style="display:grid;gap:10px">
        ${opts.map((o, i) => renderOptionBlock(o, i, type === 'checkbox')).join('')}
      </div>
      <button class="btn btn-secondary btn-sm" style="margin-top:12px" onclick="addOption('${type}')">${iconPlus()}<span>Ajouter une option</span></button>
    `;
  } else if (type === 'ordering') {
    const items = Array.isArray(q.options) ? q.options : [];
    const order = Array.isArray(q.correct_answer) ? q.correct_answer : [];
    container.innerHTML = `
      <div style="font-size:11px;color:var(--ink-mute);margin-bottom:12px">Les éléments à remettre dans l'ordre. La colonne droite indique l'ordre correct.</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div>
          <label class="form-label">Éléments (à mélanger)</label>
          <div id="q-ordering-items" style="display:grid;gap:6px">
            ${items.map(item => `<input type="text" class="form-input" value="${escapeHtml(String(item))}">`).join('')}
          </div>
          <button class="btn btn-secondary btn-sm" style="margin-top:8px" onclick="addOrderingItem('items')">${iconPlus()}<span>Ajouter</span></button>
        </div>
        <div>
          <label class="form-label">Ordre correct</label>
          <div id="q-ordering-order" style="display:grid;gap:6px">
            ${order.map(item => `<input type="text" class="form-input" value="${escapeHtml(String(item))}">`).join('')}
          </div>
          <button class="btn btn-secondary btn-sm" style="margin-top:8px" onclick="addOrderingItem('order')">${iconPlus()}<span>Ajouter</span></button>
        </div>
      </div>
    `;
  } else if (type === 'matching') {
    const pairs = Array.isArray(q.pairs) ? q.pairs : [];
    container.innerHTML = `
      <div style="font-size:11px;color:var(--ink-mute);margin-bottom:12px">Créez les paires à associer. Gauche ↔ Droite.</div>
      <div id="q-pairs-list" style="display:grid;gap:8px">
        ${pairs.map((p, i) => renderPairBlock(p, i)).join('')}
      </div>
      <button class="btn btn-secondary btn-sm" style="margin-top:8px" onclick="addPair()">${iconPlus()}<span>Ajouter une paire</span></button>
    `;
  } else if (['open', 'free'].includes(type)) {
    const rubric = q.rubric || {};
    container.innerHTML = `
      <div style="font-size:11px;color:var(--ink-mute);margin-bottom:12px">Question à réponse libre. Décrivez les critères de correction ci-dessous.</div>
      <div class="form-group">
        <label class="form-label">Critères de correction</label>
        <textarea class="form-input" id="q-rubric-criteria" rows="4">${escapeHtml(rubric.criteria || '')}</textarea>
        <small style="color:var(--ink-mute);font-size:11px">Utilisé par l'IA (ou par toi en correction manuelle) pour évaluer la réponse.</small>
      </div>
      <div class="form-group">
        <label class="form-label">Réponse attendue type (facultatif)</label>
        <textarea class="form-input" id="q-expected" rows="3">${escapeHtml(q.expected_description || '')}</textarea>
      </div>
    `;
  } else if (['screenshot', 'tool', 'tuto'].includes(type)) {
    const instr = Array.isArray(q.instructions) ? q.instructions : [];
    container.innerHTML = `
      <div style="font-size:11px;color:var(--ink-mute);margin-bottom:12px">Tâche à réaliser avec un outil (capture d'écran à rendre, tuto à suivre…).</div>
      <div class="form-group">
        <label class="form-label">Instructions étape par étape</label>
        <div id="q-instructions" style="display:grid;gap:6px">
          ${instr.map(s => `<input type="text" class="form-input" value="${escapeHtml(String(s))}">`).join('')}
        </div>
        <button class="btn btn-secondary btn-sm" style="margin-top:8px" onclick="addInstruction()">${iconPlus()}<span>Ajouter une étape</span></button>
      </div>
      <div class="form-group">
        <label class="form-label">Description attendue du livrable</label>
        <textarea class="form-input" id="q-expected" rows="3">${escapeHtml(q.expected_description || '')}</textarea>
      </div>
    `;
  }
};

/* ── Blocs atomiques (rendu HTML) ───────────────── */
function renderOptionBlock(opt, idx, isCheckbox) {
  const name = isCheckbox ? `opt-${idx}` : 'opt-group';
  const inputType = isCheckbox ? 'checkbox' : 'radio';
  return `<div class="opt-block" data-opt-idx="${idx}" style="padding:14px;border:1px solid var(--line);border-radius:var(--r-sm);background:${opt.correct ? 'rgba(22,163,74,.05)' : 'var(--bg-alt)'}">
    <div style="display:flex;gap:10px;align-items:flex-start">
      <label style="display:flex;align-items:center;gap:6px;margin-top:10px;white-space:nowrap">
        <input type="${inputType}" name="${name}" class="opt-correct" ${opt.correct ? 'checked' : ''} onchange="updateOptionBg(this)">
        <span style="font-size:12px;color:${opt.correct ? 'var(--jade)' : 'var(--ink-mute)'};font-weight:600">Correct</span>
      </label>
      <div style="flex:1;display:grid;gap:8px">
        <input type="text" class="form-input opt-label" value="${escapeHtml(opt.label || opt.text || '')}" placeholder="Texte de l'option">
        <textarea class="form-input opt-feedback" rows="2" placeholder="Feedback affiché à l'apprenant quand il choisit cette option…">${escapeHtml(opt.feedback || '')}</textarea>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="this.closest('.opt-block').remove()" title="Supprimer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
      </button>
    </div>
  </div>`;
}

window.updateOptionBg = function(cb) {
  const block = cb.closest('.opt-block');
  block.style.background = cb.checked ? 'rgba(22,163,74,.05)' : 'var(--bg-alt)';
  const span = block.querySelector('label span');
  span.style.color = cb.checked ? 'var(--jade)' : 'var(--ink-mute)';
};

window.addOption = function(type) {
  const list = document.getElementById('q-options-list');
  const count = list.children.length;
  const div = document.createElement('div');
  div.innerHTML = renderOptionBlock({ label: '', correct: false, feedback: '' }, count, type === 'checkbox');
  list.appendChild(div.firstElementChild);
};

function renderPairBlock(p, idx) {
  return `<div class="pair-block" style="display:grid;grid-template-columns:1fr 30px 1fr auto;gap:8px;align-items:center">
    <input type="text" class="form-input pair-left" value="${escapeHtml(p.left || '')}" placeholder="Gauche">
    <div style="text-align:center;color:var(--ink-mute)">↔</div>
    <input type="text" class="form-input pair-right" value="${escapeHtml(p.right || '')}" placeholder="Droite">
    <button class="btn btn-secondary btn-sm" onclick="this.closest('.pair-block').remove()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
    </button>
  </div>`;
}

window.addPair = function() {
  const list = document.getElementById('q-pairs-list');
  const div = document.createElement('div');
  div.innerHTML = renderPairBlock({ left: '', right: '' }, list.children.length);
  list.appendChild(div.firstElementChild);
};

window.addOrderingItem = function(which) {
  const list = document.getElementById(which === 'items' ? 'q-ordering-items' : 'q-ordering-order');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-input';
  list.appendChild(input);
  input.focus();
};

window.addInstruction = function() {
  const list = document.getElementById('q-instructions');
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-input';
  input.placeholder = 'Étape…';
  list.appendChild(input);
  input.focus();
};

function renderNotionBlock(n, idx) {
  // Sécurisation : si la notion est nulle ou n'a pas de champs, on utilise un objet vide
  const safe = (typeof n === 'object' && n !== null) ? n : {};
  // Compatibilité avec d'anciens formats de données (certains imports utilisent 'name' ou 'notion')
  const title = safe.title || safe.name || safe.notion || '';
  const definition = safe.definition || safe.def || '';
  const analogy = safe.analogy || safe.analogie || '';
  const example = safe.example || safe.exemple || safe.lumio_example || '';

  return `<div class="notion-block" style="padding:16px;border:2px solid var(--marine-soft);border-radius:var(--r-sm);background:var(--paper)">
    <div style="display:flex;gap:10px;align-items:center;margin-bottom:10px">
      <div style="width:24px;height:24px;border-radius:4px;background:var(--marine);color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;letter-spacing:.08em">N${idx + 1}</div>
      <input type="text" class="form-input notion-title" value="${escapeHtml(title)}" placeholder="Titre de la notion" style="flex:1;font-weight:600">
      <button class="btn btn-secondary btn-sm" onclick="this.closest('.notion-block').remove()" title="Supprimer">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
      </button>
    </div>
    <div class="form-group">
      <label style="font-size:11px;color:var(--ink-mute);letter-spacing:.1em;text-transform:uppercase;font-weight:600;display:block;margin-bottom:4px">Définition</label>
      <textarea class="form-input notion-definition" rows="2" placeholder="Qu'est-ce que c'est, en termes simples ?">${escapeHtml(definition)}</textarea>
    </div>
    <div class="form-group">
      <label style="font-size:11px;color:var(--ink-mute);letter-spacing:.1em;text-transform:uppercase;font-weight:600;display:block;margin-bottom:4px">Analogie</label>
      <textarea class="form-input notion-analogy" rows="2" placeholder="Comparez à quelque chose de familier (ex: c'est comme...)">${escapeHtml(analogy)}</textarea>
    </div>
    <div class="form-group">
      <label style="font-size:11px;color:var(--ink-mute);letter-spacing:.1em;text-transform:uppercase;font-weight:600;display:block;margin-bottom:4px">Exemple concret</label>
      <textarea class="form-input notion-example" rows="2" placeholder="Un cas concret illustrant la notion">${escapeHtml(example)}</textarea>
    </div>
  </div>`;
}

window.addNotion = function() {
  const list = document.getElementById('q-notions-list');
  const div = document.createElement('div');
  div.innerHTML = renderNotionBlock({ title: '', definition: '', analogy: '', example: '' }, list.children.length);
  const block = div.firstElementChild;
  list.appendChild(block);
  block.querySelector('.notion-title').focus();
};

function renderCommBlock(c, kind, idx) {
  const channels = ['EMAIL', 'TEAMS', 'SMS', 'TELEPHONE', 'VISIO', 'MESSAGE VOCAL'];
  return `<div class="comm-block" data-comm-kind="${kind}" style="padding:14px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--bg-alt)">
    <div style="display:grid;grid-template-columns:130px 1fr 1fr auto;gap:8px;margin-bottom:8px">
      <select class="form-input comm-channel">
        ${channels.map(ch => `<option value="${ch}" ${c.channel === ch ? 'selected' : ''}>${ch}</option>`).join('')}
      </select>
      <input type="text" class="form-input comm-from" value="${escapeHtml(c.from || c.sender || '')}" placeholder="De (ex: Nora Said)">
      <input type="text" class="form-input comm-subject" value="${escapeHtml(c.subject || '')}" placeholder="Objet">
      <button class="btn btn-secondary btn-sm" onclick="this.closest('.comm-block').remove()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
      </button>
    </div>
    <textarea class="form-input comm-body" rows="3" placeholder="Corps du message…">${escapeHtml(c.body || c.message || '')}</textarea>
  </div>`;
}

window.addComm = function(kind) {
  const list = document.getElementById(`q-comms-${kind}`);
  const div = document.createElement('div');
  div.innerHTML = renderCommBlock({ channel: 'EMAIL', from: '', subject: '', body: '' }, kind, list.children.length);
  list.appendChild(div.firstElementChild);
};

window.addTakeaway = function() {
  const list = document.getElementById('q-takeaways');
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;gap:8px;align-items:center';
  div.innerHTML = `<input type="text" class="form-input" placeholder="Point clé…">
    <button class="btn btn-secondary btn-sm" onclick="this.parentElement.remove()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
    </button>`;
  list.appendChild(div);
  div.querySelector('input').focus();
};

/* ── Enregistrement complet de la question ───── */
window.saveQuestion = async function() {
  const sb = window.IMM_SUPABASE;
  const q = currentEditingQuestion;
  if (!q) { showToast('Aucune question en cours d\'édition', 'error'); return; }

  const type = document.getElementById('q-type').value;
  const payload = {
    type,
    prompt: document.getElementById('q-prompt').value.trim() || null,
    question: document.getElementById('q-prompt').value.trim() || null,  // on synchronise les 2 champs
    mission: document.getElementById('q-mission').value.trim() || null,
    scenario: document.getElementById('q-scenario').value.trim() || null,
    points: parseInt(document.getElementById('q-points').value, 10) || 10,
    explanation: document.getElementById('q-explanation').value.trim() || null,
    feedback_correct: document.getElementById('q-feedback-correct').value.trim() || null,
    feedback_incorrect: document.getElementById('q-feedback-incorrect').value.trim() || null,
  };

  // Notions
  payload.knowledge_notions = Array.from(document.querySelectorAll('.notion-block')).map(el => ({
    title: el.querySelector('.notion-title').value.trim(),
    definition: el.querySelector('.notion-definition').value.trim(),
    analogy: el.querySelector('.notion-analogy').value.trim(),
    example: el.querySelector('.notion-example').value.trim(),
  })).filter(n => n.title || n.definition);

  // Communications avant
  payload.communications_before = Array.from(document.querySelectorAll('[data-comm-kind="before"]')).map(el => ({
    channel: el.querySelector('.comm-channel').value,
    from: el.querySelector('.comm-from').value.trim(),
    subject: el.querySelector('.comm-subject').value.trim(),
    body: el.querySelector('.comm-body').value.trim(),
  })).filter(c => c.from || c.body);

  // Communications après
  payload.communications_after = Array.from(document.querySelectorAll('[data-comm-kind="after"]')).map(el => ({
    channel: el.querySelector('.comm-channel').value,
    from: el.querySelector('.comm-from').value.trim(),
    subject: el.querySelector('.comm-subject').value.trim(),
    body: el.querySelector('.comm-body').value.trim(),
  })).filter(c => c.from || c.body);

  // À retenir
  payload.key_takeaways = Array.from(document.querySelectorAll('#q-takeaways input'))
    .map(i => i.value.trim()).filter(v => v);

  // Options / correct_answer selon type
  if (['mcq', 'qcm', 'checkbox'].includes(type)) {
    const opts = Array.from(document.querySelectorAll('.opt-block')).map(el => ({
      label: el.querySelector('.opt-label').value.trim(),
      correct: el.querySelector('.opt-correct').checked,
      feedback: el.querySelector('.opt-feedback').value.trim(),
    })).filter(o => o.label);

    payload.options_detailed = opts;
    payload.options = opts.map(o => o.label);

    if (type === 'checkbox') {
      payload.correct_answer = opts.map((o, i) => o.correct ? i : null).filter(v => v !== null);
    } else {
      const correctIdx = opts.findIndex(o => o.correct);
      payload.correct_answer = correctIdx >= 0 ? correctIdx : null;
    }
  } else if (type === 'ordering') {
    payload.options = Array.from(document.querySelectorAll('#q-ordering-items input')).map(i => i.value.trim()).filter(v => v);
    payload.correct_answer = Array.from(document.querySelectorAll('#q-ordering-order input')).map(i => i.value.trim()).filter(v => v);
  } else if (type === 'matching') {
    payload.pairs = Array.from(document.querySelectorAll('.pair-block')).map(el => ({
      left: el.querySelector('.pair-left').value.trim(),
      right: el.querySelector('.pair-right').value.trim(),
    })).filter(p => p.left && p.right);
  } else if (['open', 'free'].includes(type)) {
    const criteria = document.getElementById('q-rubric-criteria')?.value.trim();
    payload.rubric = criteria ? { criteria } : null;
    payload.expected_description = document.getElementById('q-expected')?.value.trim() || null;
  } else if (['screenshot', 'tool', 'tuto'].includes(type)) {
    payload.instructions = Array.from(document.querySelectorAll('#q-instructions input')).map(i => i.value.trim()).filter(v => v);
    payload.expected_description = document.getElementById('q-expected')?.value.trim() || null;
  }

  try {
    const { error } = await sb
      .from('challenges')
      .update(payload)
      .eq('game_id', q.game_id)
      .eq('challenge_num', q.challenge_num)
      .eq('question_index', q.question_index);
    if (error) throw error;
    showToast(`Question ${q.question_index} sauvegardée`, 'success');
  } catch (e) {
    console.error('[ADMIN] saveQuestion:', e);
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

/* ─── HERO ───────────────────────────────────────────── */
async function renderHero(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Page d'<em>accueil</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Récupération du contenu…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const [slidesRes, contentRes] = await Promise.all([
    sb.from('hero_slides').select('*').order('sort_order'),
    sb.from('site_content').select('*').order('section').order('key'),
  ]);

  const slides = slidesRes.error ? null : (slidesRes.data || []);
  const content = contentRes.error ? null : (contentRes.data || []);

  const slidesMissing = slidesRes.error && ((slidesRes.error.message || '').toLowerCase().includes('hero_slides') || slidesRes.error.code === '42P01');
  const contentMissing = contentRes.error && ((contentRes.error.message || '').toLowerCase().includes('site_content') || contentRes.error.code === '42P01');

  window._slidesData = slides || [];

  // Regrouper site_content par section (hors "autre")
  const bySection = {};
  (content || []).forEach(c => {
    const sec = c.section || 'autre';
    if (!bySection[sec]) bySection[sec] = [];
    bySection[sec].push(c);
  });

  const sectionLabels = {
    hero: 'Textes complémentaires du hero',
    about: 'Section À propos',
    avantages: 'Avantages',
    temoignages: 'Témoignages',
    cta: 'Appel à l\'action',
    footer: 'Pied de page',
    autre: 'Autres textes'
  };

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Page d'<em>accueil</em></h1>
        <p>Slides du carrousel + textes annexes de la page d'accueil</p>
      </div>
      <div class="page-h-right">
        <a href="../index.html" target="_blank" class="btn btn-secondary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          <span>Aperçu du site</span>
        </a>
      </div>
    </div>

    <div style="display:grid;gap:20px;max-width:860px">

      <!-- Bloc des slides du carrousel -->
      <div class="card" style="padding:22px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
          <div>
            <h2 style="font-size:16px;font-weight:600;margin-bottom:4px">Carrousel du hero</h2>
            <p style="font-size:12px;color:var(--ink-mute)">Les slides affichées en haut de la page d'accueil. Les slides actives tournent automatiquement.</p>
          </div>
          ${!slidesMissing ? `<button class="btn btn-primary btn-sm" onclick="openSlideModal()">${iconPlus()}<span>Nouvelle slide</span></button>` : ''}
        </div>

        ${slidesMissing ? `
          <div style="padding:16px;background:#FEF6EE;border:1px solid #FED7AA;border-radius:var(--r-sm);font-size:13px;color:#9A3412">
            <strong>Table non initialisée.</strong> Lance <code>sql/11-hero-slides.sql</code> dans Supabase pour activer la gestion des slides du hero.
            <br><span style="font-size:12px;color:var(--ink-mute)">Le site affichera les slides par défaut en attendant.</span>
          </div>
        ` : (slides.length === 0 ? `
          <div style="padding:30px;text-align:center;color:var(--ink-mute);font-size:13px">
            Aucune slide configurée. Le site utilise les slides par défaut.
            <div style="margin-top:12px"><button class="btn btn-primary btn-sm" onclick="openSlideModal()">${iconPlus()}<span>Créer la première slide</span></button></div>
          </div>
        ` : `
          <div style="display:grid;gap:10px">
            ${slides.map((s, i) => `
              <div style="padding:14px 16px;border:1px solid var(--line);border-radius:var(--r-sm);background:${s.active ? 'var(--paper)' : 'var(--bg-alt)'};opacity:${s.active ? 1 : .6}">
                <div style="display:flex;gap:12px;align-items:flex-start">
                  <div style="width:30px;height:30px;border-radius:50%;background:var(--marine);color:white;display:flex;align-items:center;justify-content:center;font-family:var(--f-mono);font-weight:700;font-size:13px;flex-shrink:0">${i + 1}</div>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;font-weight:600">${escapeHtml(s.eyebrow || '—')}</div>
                    <div style="font-size:14px;font-weight:600;margin:4px 0">${(s.title_html || '').replace(/<em>/g, '<em style="color:var(--orange);font-style:italic">')}</div>
                    <div style="font-size:12px;color:var(--ink-soft);line-height:1.45;margin-bottom:6px">${escapeHtml((s.lede || '').substring(0, 150))}${(s.lede || '').length > 150 ? '…' : ''}</div>
                    <div style="display:flex;gap:8px;font-size:11px;color:var(--ink-mute)">
                      ${s.audience ? `<span class="badge badge-info" style="font-size:10px">${escapeHtml(s.audience)}</span>` : ''}
                      ${!s.active ? '<span class="badge badge-muted" style="font-size:10px">Inactive</span>' : ''}
                    </div>
                  </div>
                  <div style="display:flex;gap:4px;flex-shrink:0">
                    ${i > 0 ? `<button class="btn btn-secondary btn-sm" onclick="moveSlide('${s.id}',-1)" title="Remonter">↑</button>` : ''}
                    ${i < slides.length - 1 ? `<button class="btn btn-secondary btn-sm" onclick="moveSlide('${s.id}',1)" title="Descendre">↓</button>` : ''}
                    <button class="btn btn-secondary btn-sm" onclick="openSlideModal('${s.id}')" title="Éditer">${iconEdit()}</button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `)}
      </div>

      <!-- Bloc des textes complémentaires (site_content) -->
      ${contentMissing ? `
        <div class="card" style="padding:22px">
          <h2 style="font-size:16px;font-weight:600;margin-bottom:8px">Autres textes du site</h2>
          <div style="padding:12px;background:#FEF6EE;border:1px solid #FED7AA;border-radius:var(--r-sm);font-size:12.5px;color:#9A3412">
            Table <code>site_content</code> non initialisée. Lance <code>sql/09-site-content.sql</code>.
          </div>
        </div>
      ` : Object.entries(bySection).map(([sec, items]) => `
        <div class="card" style="padding:22px">
          <h2 style="font-size:16px;margin-bottom:16px;font-weight:600">${escapeHtml(sectionLabels[sec] || sec)}</h2>
          ${items.map(c => `
            <div class="form-group" data-content-key="${c.key}">
              <label class="form-label" style="display:flex;justify-content:space-between;align-items:baseline">
                <span>${escapeHtml(c.description || c.key)}</span>
                <span style="font-size:10px;color:var(--ink-mute);font-family:var(--f-mono);letter-spacing:.03em">${c.key}</span>
              </label>
              ${c.type === 'text' && (c.value || '').length < 100
                ? `<input type="text" class="form-input content-val" value="${escapeHtml(c.value || '')}">`
                : `<textarea class="form-input content-val" rows="${c.type === 'html' ? 6 : 3}">${escapeHtml(c.value || '')}</textarea>`}
            </div>
          `).join('')}
        </div>
      `).join('')}

      ${!contentMissing && Object.keys(bySection).length > 0 ? `
        <div style="display:flex;gap:10px;justify-content:flex-end;padding-top:10px">
          <button class="btn btn-primary" onclick="saveAllContent()">Enregistrer les textes</button>
        </div>
      ` : ''}
    </div>
  </div>

  <!-- Modal slide hero -->
  <div class="modal-overlay" id="slideModalOverlay" hidden>
    <div class="modal" style="max-width:720px">
      <div class="modal-h">
        <h3 id="slideModalTitle">Nouvelle slide</h3>
        <button class="modal-close" onclick="closeSlideModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="slideModalBody"></div>
      <div class="modal-footer" id="slideModalFooter"></div>
    </div>
  </div>`;
}

window.saveAllContent = async function() {
  const sb = window.IMM_SUPABASE;
  const items = document.querySelectorAll('[data-content-key]');
  const updates = Array.from(items).map(el => ({
    key: el.dataset.contentKey,
    value: el.querySelector('.content-val').value
  }));
  try {
    for (const u of updates) {
      await sb.from('site_content').update({ value: u.value, updated_at: new Date().toISOString() }).eq('key', u.key);
    }
    showToast(`${updates.length} champ${updates.length > 1 ? 's' : ''} mis à jour`, 'success');
  } catch (e) {
    showToast('Erreur : ' + (e.message || e), 'error');
  }
};

window.openSlideModal = function(id) {
  const slides = window._slidesData || [];
  const s = id ? slides.find(x => x.id === id) : {
    eyebrow: '', title_html: '', lede: '',
    cta_primary_label: '', cta_primary_href: '',
    cta_secondary_label: '', cta_secondary_href: '',
    photo_url: '', photo_alt: '',
    audience: '', badges: [],
    sort_order: slides.length + 1, active: true
  };
  if (id && !s) return;

  const badgesText = Array.isArray(s.badges) ? s.badges.map(b => b.label || '').join('\n') : '';

  document.getElementById('slideModalTitle').textContent = id ? 'Modifier la slide' : 'Nouvelle slide';
  document.getElementById('slideModalBody').innerHTML = `
    <input type="hidden" id="sl-id" value="${id || ''}">

    <div class="form-group">
      <label class="form-label">Surtitre (eyebrow)</label>
      <input type="text" class="form-input" id="sl-eyebrow" value="${escapeHtml(s.eyebrow || '')}" placeholder="ex: L'apprentissage par la pratique">
    </div>

    <div class="form-group">
      <label class="form-label">Titre * <span style="font-weight:400;color:var(--ink-mute);font-size:11px">— HTML autorisé, utilisez &lt;em&gt;mot&lt;/em&gt; pour mettre en italique orange</span></label>
      <textarea class="form-input" id="sl-title" rows="2" style="font-family:var(--f-mono);font-size:12px">${escapeHtml(s.title_html || '')}</textarea>
    </div>

    <div class="form-group">
      <label class="form-label">Sous-titre (lede)</label>
      <textarea class="form-input" id="sl-lede" rows="3">${escapeHtml(s.lede || '')}</textarea>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Bouton principal — libellé</label>
        <input type="text" class="form-input" id="sl-cta1-label" value="${escapeHtml(s.cta_primary_label || '')}" placeholder="Voir le catalogue">
      </div>
      <div class="form-group">
        <label class="form-label">Bouton principal — lien</label>
        <input type="text" class="form-input" id="sl-cta1-href" value="${escapeHtml(s.cta_primary_href || '')}" placeholder="catalogue.html">
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Bouton secondaire — libellé</label>
        <input type="text" class="form-input" id="sl-cta2-label" value="${escapeHtml(s.cta_secondary_label || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">Bouton secondaire — lien</label>
        <input type="text" class="form-input" id="sl-cta2-href" value="${escapeHtml(s.cta_secondary_href || '')}">
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Photo — URL</label>
        <input type="url" class="form-input" id="sl-photo" value="${escapeHtml(s.photo_url || '')}" placeholder="https://…">
      </div>
      <div class="form-group">
        <label class="form-label">Photo — alt</label>
        <input type="text" class="form-input" id="sl-alt" value="${escapeHtml(s.photo_alt || '')}">
      </div>
    </div>

    <div class="form-group">
      <label class="form-label">Audience (étiquette en haut)</label>
      <input type="text" class="form-input" id="sl-audience" value="${escapeHtml(s.audience || '')}" placeholder="ex: CFA · Formateurs · Entreprises">
    </div>

    <div class="form-group">
      <label class="form-label">Badges de confiance (un par ligne, ex: "Premier défi offert")</label>
      <textarea class="form-input" id="sl-badges" rows="3">${escapeHtml(badgesText)}</textarea>
    </div>

    <div style="display:grid;grid-template-columns:160px 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Ordre</label>
        <input type="number" class="form-input" id="sl-order" value="${s.sort_order || 0}">
      </div>
      <div class="form-group">
        <label class="form-label">&nbsp;</label>
        <label style="display:flex;align-items:center;gap:8px;padding-top:10px;font-size:13px">
          <input type="checkbox" id="sl-active" ${s.active ? 'checked' : ''}>
          <span>Slide affichée sur le site</span>
        </label>
      </div>
    </div>
  `;

  document.getElementById('slideModalFooter').innerHTML = `
    ${id ? `<button class="btn btn-danger" onclick="deleteSlide('${id}')" style="margin-right:auto">Supprimer</button>` : ''}
    <button class="btn btn-secondary" onclick="closeSlideModal()">Annuler</button>
    <button class="btn btn-primary" onclick="saveSlide()">Enregistrer</button>
  `;
  document.getElementById('slideModalOverlay').hidden = false;
};

window.closeSlideModal = function() {
  document.getElementById('slideModalOverlay').hidden = true;
};

window.saveSlide = async function() {
  const sb = window.IMM_SUPABASE;
  const id = document.getElementById('sl-id').value;

  const badges = document.getElementById('sl-badges').value
    .split('\n').map(s => s.trim()).filter(Boolean).map(label => ({ label }));

  const payload = {
    eyebrow: document.getElementById('sl-eyebrow').value.trim() || null,
    title_html: document.getElementById('sl-title').value.trim(),
    lede: document.getElementById('sl-lede').value.trim() || null,
    cta_primary_label: document.getElementById('sl-cta1-label').value.trim() || null,
    cta_primary_href: document.getElementById('sl-cta1-href').value.trim() || null,
    cta_secondary_label: document.getElementById('sl-cta2-label').value.trim() || null,
    cta_secondary_href: document.getElementById('sl-cta2-href').value.trim() || null,
    photo_url: document.getElementById('sl-photo').value.trim() || null,
    photo_alt: document.getElementById('sl-alt').value.trim() || null,
    audience: document.getElementById('sl-audience').value.trim() || null,
    badges,
    sort_order: parseInt(document.getElementById('sl-order').value, 10) || 0,
    active: document.getElementById('sl-active').checked,
    updated_at: new Date().toISOString(),
  };
  if (!payload.title_html) { showToast('Le titre est obligatoire', 'error'); return; }
  try {
    if (id) {
      const { error } = await sb.from('hero_slides').update(payload).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await sb.from('hero_slides').insert([payload]);
      if (error) throw error;
    }
    showToast(`Slide ${id ? 'mise à jour' : 'créée'}`, 'success');
    closeSlideModal();
    renderHero(document.getElementById('pageArea'));
  } catch (e) { showToast('Erreur : ' + (e.message || e), 'error'); }
};

window.deleteSlide = async function(id) {
  if (!confirm('Supprimer cette slide ?')) return;
  const sb = window.IMM_SUPABASE;
  try {
    const { error } = await sb.from('hero_slides').delete().eq('id', id);
    if (error) throw error;
    showToast('Slide supprimée', 'success');
    closeSlideModal();
    renderHero(document.getElementById('pageArea'));
  } catch (e) { showToast('Erreur : ' + (e.message || e), 'error'); }
};

window.moveSlide = async function(id, delta) {
  const sb = window.IMM_SUPABASE;
  try {
    const { data } = await sb.from('hero_slides').select('id,sort_order').order('sort_order');
    const list = data || [];
    const idx = list.findIndex(s => s.id === id);
    const newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= list.length) return;
    const other = list[newIdx];
    await sb.from('hero_slides').update({ sort_order: other.sort_order }).eq('id', id);
    await sb.from('hero_slides').update({ sort_order: list[idx].sort_order }).eq('id', other.id);
    renderHero(document.getElementById('pageArea'));
  } catch (e) { showToast('Erreur : ' + (e.message || e), 'error'); }
};

window.renderHero = renderHero;


/* ─── VEDETTES ─────────────────────────────────────── */
async function renderVedettes(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Simulations <em>vedettes</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Récupération…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const { data, error } = await sb.from('simulations').select('*').order('featured_order', { nullsFirst: false }).order('name');
  if (error) { el.innerHTML = `<div class="wrap"><div style="padding:30px;color:#DC2626">Erreur : ${escapeHtml(error.message)}</div></div>`; return; }

  const sims = data || [];
  const featured = sims.filter(s => s.featured).sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0));
  const notFeatured = sims.filter(s => !s.featured);

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Simulations <em>vedettes</em></h1>
        <p>${featured.length} simulation${featured.length > 1 ? 's' : ''} mise${featured.length > 1 ? 's' : ''} en avant sur la page d'accueil</p>
      </div>
    </div>

    <div class="card" style="padding:20px;margin-bottom:20px">
      <h2 style="font-size:14px;font-weight:600;margin-bottom:14px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-mute)">En vedette (${featured.length})</h2>
      ${featured.length === 0 ? `<div style="padding:30px;text-align:center;color:var(--ink-mute);font-size:13px">Aucune simulation en vedette</div>` : `
        <div style="display:grid;gap:10px">
          ${featured.map((s, i) => `
            <div style="display:flex;align-items:center;gap:14px;padding:14px 18px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--bg-alt)">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--marine);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-family:var(--f-mono);font-size:13px">${i + 1}</div>
              <div style="flex:1">
                <div style="font-weight:600;font-size:14px">${escapeHtml(s.name)}</div>
                <div style="font-size:11px;color:var(--ink-mute)">${escapeHtml(s.domain || '')}</div>
              </div>
              <div style="display:flex;gap:4px">
                ${i > 0 ? `<button class="btn btn-secondary btn-sm" onclick="moveFeatured('${s.game_id}',-1)" title="Remonter">↑</button>` : ''}
                ${i < featured.length - 1 ? `<button class="btn btn-secondary btn-sm" onclick="moveFeatured('${s.game_id}',1)" title="Descendre">↓</button>` : ''}
                <button class="btn btn-danger btn-sm" onclick="toggleFeatured('${s.game_id}',false)">Retirer</button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>

    <div class="card" style="padding:20px">
      <h2 style="font-size:14px;font-weight:600;margin-bottom:14px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink-mute)">Autres simulations du catalogue (${notFeatured.length})</h2>
      <div style="display:grid;gap:8px">
        ${notFeatured.map(s => `
          <div style="display:flex;align-items:center;gap:14px;padding:10px 14px;border:1px solid var(--line);border-radius:var(--r-sm)">
            <div style="flex:1">
              <div style="font-weight:500;font-size:13px">${escapeHtml(s.name)}</div>
              <div style="font-size:11px;color:var(--ink-mute)">${escapeHtml(s.domain || '')}</div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="toggleFeatured('${s.game_id}',true)">${iconPlus()}<span>Mettre en vedette</span></button>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;
}

window.toggleFeatured = async function(gameId, featured) {
  const sb = window.IMM_SUPABASE;
  try {
    // Si on ajoute, on attribue le prochain featured_order
    let order = 0;
    if (featured) {
      const { data } = await sb.from('simulations').select('featured_order').eq('featured', true).order('featured_order', { ascending: false }).limit(1);
      order = ((data?.[0]?.featured_order) || 0) + 1;
    }
    const { error } = await sb.from('simulations').update({ featured, featured_order: featured ? order : 0 }).eq('game_id', gameId);
    if (error) throw error;
    showToast(featured ? 'Mise en vedette' : 'Retirée des vedettes', 'success');
    renderVedettes(document.getElementById('pageArea'));
  } catch (e) { showToast('Erreur : ' + (e.message || e), 'error'); }
};

window.moveFeatured = async function(gameId, delta) {
  const sb = window.IMM_SUPABASE;
  try {
    // Charger la liste ordonnée
    const { data } = await sb.from('simulations').select('game_id,featured_order').eq('featured', true).order('featured_order');
    const list = data || [];
    const idx = list.findIndex(s => s.game_id === gameId);
    const newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= list.length) return;
    // Swap
    const other = list[newIdx];
    await sb.from('simulations').update({ featured_order: other.featured_order }).eq('game_id', gameId);
    await sb.from('simulations').update({ featured_order: list[idx].featured_order }).eq('game_id', other.game_id);
    renderVedettes(document.getElementById('pageArea'));
  } catch (e) { showToast('Erreur : ' + (e.message || e), 'error'); }
};

window.renderVedettes = renderVedettes;


/* ─── PAGES ÉDITORIALES ───────────────────────────── */
async function renderPages(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Pages du <em>site</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Récupération des pages…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const { data, error } = await sb.from('editorial_pages').select('*').order('slug');
  if (error) {
    const missing = (error.message || '').toLowerCase().includes('editorial_pages') || error.code === '42P01';
    el.innerHTML = `<div class="wrap"><div class="card" style="padding:30px;max-width:620px">
      <h3 style="margin-bottom:10px">${missing ? 'Table non initialisée' : 'Erreur'}</h3>
      <p style="font-size:13px;color:var(--ink-mute)">${missing ? 'Lance <code>sql/09-site-content.sql</code> dans Supabase.' : escapeHtml(error.message)}</p>
    </div></div>`;
    return;
  }

  const pages = data || [];
  window._pagesData = pages;

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Pages du <em>site</em></h1>
        <p>${pages.length} page${pages.length > 1 ? 's' : ''} éditoriale${pages.length > 1 ? 's' : ''}</p>
      </div>
    </div>

    <div class="table-wrap"><table>
      <thead><tr><th>Titre</th><th>Slug</th><th>Description SEO</th><th>État</th><th>Modifiée</th><th>Actions</th></tr></thead>
      <tbody>
        ${pages.map(p => `<tr>
          <td style="font-weight:600">${escapeHtml(p.title)}</td>
          <td style="font-family:var(--f-mono);font-size:11px;color:var(--ink-mute)">${escapeHtml(p.slug)}</td>
          <td style="font-size:12px;color:var(--ink-mute);max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(p.meta_description || '—')}</td>
          <td>${p.published ? '<span class="badge badge-success">Publiée</span>' : '<span class="badge badge-muted">Brouillon</span>'}</td>
          <td style="font-size:11px;color:var(--ink-mute)">${timeAgo(p.updated_at)}</td>
          <td><button class="btn btn-secondary btn-sm" onclick="openPageModal('${p.slug}')">${iconEdit()}<span>Éditer</span></button></td>
        </tr>`).join('')}
      </tbody>
    </table></div>
  </div>

  <div class="modal-overlay" id="pageModalOverlay" hidden>
    <div class="modal" style="max-width:820px">
      <div class="modal-h">
        <h3 id="pageModalTitle">Éditer la page</h3>
        <button class="modal-close" onclick="closePageModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="pageModalBody"></div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closePageModal()">Annuler</button>
        <button class="btn btn-primary" onclick="savePage()">Enregistrer</button>
      </div>
    </div>
  </div>`;
}

window.openPageModal = function(slug) {
  const p = (window._pagesData || []).find(x => x.slug === slug);
  if (!p) return;
  document.getElementById('pageModalTitle').textContent = `Éditer : ${p.title}`;
  document.getElementById('pageModalBody').innerHTML = `
    <div class="form-group">
      <label class="form-label">Titre de la page *</label>
      <input type="text" class="form-input" id="pg-title" value="${escapeHtml(p.title)}">
    </div>
    <div class="form-group">
      <label class="form-label">Slug (URL)</label>
      <input type="text" class="form-input" value="${escapeHtml(p.slug)}" disabled style="background:var(--bg-alt);color:var(--ink-mute);font-family:var(--f-mono)">
    </div>
    <div class="form-group">
      <label class="form-label">Description SEO (meta)</label>
      <input type="text" class="form-input" id="pg-meta" value="${escapeHtml(p.meta_description || '')}" maxlength="160">
      <small style="color:var(--ink-mute);font-size:11px">Max 160 caractères, affichée dans les résultats Google.</small>
    </div>
    <div class="form-group">
      <label class="form-label">Contenu (HTML ou Markdown)</label>
      <textarea class="form-input" id="pg-content" rows="14" style="font-family:var(--f-mono);font-size:12px">${escapeHtml(p.content || '')}</textarea>
    </div>
    <div class="form-group">
      <label style="display:flex;align-items:center;gap:8px;font-size:13px;cursor:pointer">
        <input type="checkbox" id="pg-published" ${p.published ? 'checked' : ''}>
        <span>Page publiée (visible sur le site)</span>
      </label>
    </div>
    <input type="hidden" id="pg-slug" value="${escapeHtml(p.slug)}">`;
  document.getElementById('pageModalOverlay').hidden = false;
};

window.closePageModal = function() { document.getElementById('pageModalOverlay').hidden = true; };

window.savePage = async function() {
  const sb = window.IMM_SUPABASE;
  const slug = document.getElementById('pg-slug').value;
  const payload = {
    title: document.getElementById('pg-title').value.trim(),
    meta_description: document.getElementById('pg-meta').value.trim() || null,
    content: document.getElementById('pg-content').value,
    published: document.getElementById('pg-published').checked,
    updated_at: new Date().toISOString(),
  };
  if (!payload.title) { showToast('Le titre est obligatoire', 'error'); return; }
  try {
    const { error } = await sb.from('editorial_pages').update(payload).eq('slug', slug);
    if (error) throw error;
    showToast('Page mise à jour', 'success');
    closePageModal();
    renderPages(document.getElementById('pageArea'));
  } catch (e) { showToast('Erreur : ' + (e.message || e), 'error'); }
};

window.renderPages = renderPages;


/* ─── FAQ ─────────────────────────────────────────── */
async function renderFAQ(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Gestion de la <em>FAQ</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Récupération…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const { data, error } = await sb.from('faq_entries').select('*').order('category').order('sort_order');
  if (error) {
    const missing = (error.message || '').toLowerCase().includes('faq_entries') || error.code === '42P01';
    el.innerHTML = `<div class="wrap"><div class="card" style="padding:30px;max-width:620px">
      <h3 style="margin-bottom:10px">${missing ? 'Table non initialisée' : 'Erreur'}</h3>
      <p style="font-size:13px;color:var(--ink-mute)">${missing ? 'Lance <code>sql/09-site-content.sql</code> dans Supabase.' : escapeHtml(error.message)}</p>
    </div></div>`;
    return;
  }

  const faq = data || [];
  window._faqData = faq;

  const categories = {
    general: 'Général',
    pricing: 'Tarifs',
    technical: 'Technique',
    pedagogy: 'Pédagogie'
  };

  const byCategory = {};
  faq.forEach(f => {
    const cat = f.category || 'general';
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(f);
  });

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Gestion de la <em>FAQ</em></h1>
        <p>${faq.length} question${faq.length > 1 ? 's' : ''} · ${faq.filter(f=>f.active).length} publiée${faq.filter(f=>f.active).length > 1 ? 's' : ''}</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-primary" onclick="openFaqModal()">${iconPlus()}<span>Nouvelle question</span></button>
      </div>
    </div>

    ${faq.length === 0 ? `
      <div class="card" style="padding:60px 20px;text-align:center">
        <h3 style="font-size:17px;margin-bottom:8px">Aucune question dans la FAQ</h3>
        <button class="btn btn-primary" onclick="openFaqModal()">${iconPlus()}<span>Ajouter la première question</span></button>
      </div>
    ` : Object.entries(byCategory).map(([cat, items]) => `
      <div style="margin-bottom:28px">
        <h3 style="font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:12px;font-weight:600">${escapeHtml(categories[cat] || cat)} (${items.length})</h3>
        <div style="display:grid;gap:10px">
          ${items.map(f => `
            <div style="padding:16px 18px;background:var(--paper);border:1px solid var(--line);border-radius:var(--r-sm);opacity:${f.active ? '1' : '0.6'}">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;margin-bottom:8px">
                <div style="flex:1">
                  <div style="font-weight:600;font-size:14px;margin-bottom:4px">${escapeHtml(f.question)}</div>
                  ${!f.active ? '<span class="badge badge-muted" style="font-size:10px">Masquée</span>' : ''}
                </div>
                <div style="display:flex;gap:4px">
                  <button class="btn btn-secondary btn-sm" onclick="openFaqModal('${f.id}')">${iconEdit()}</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteFaq('${f.id}')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z"/></svg>
                  </button>
                </div>
              </div>
              <div style="font-size:13px;color:var(--ink-soft);line-height:1.55">${escapeHtml(f.answer.substring(0, 200))}${f.answer.length > 200 ? '…' : ''}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  </div>

  <div class="modal-overlay" id="faqModalOverlay" hidden>
    <div class="modal" style="max-width:680px">
      <div class="modal-h">
        <h3 id="faqModalTitle">Nouvelle question FAQ</h3>
        <button class="modal-close" onclick="closeFaqModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="faqModalBody"></div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeFaqModal()">Annuler</button>
        <button class="btn btn-primary" onclick="saveFaq()">Enregistrer</button>
      </div>
    </div>
  </div>`;
}

window.openFaqModal = function(id) {
  const f = id ? (window._faqData || []).find(x => x.id === id) : { question: '', answer: '', category: 'general', sort_order: 0, active: true };
  document.getElementById('faqModalTitle').textContent = id ? 'Modifier la question' : 'Nouvelle question FAQ';
  document.getElementById('faqModalBody').innerHTML = `
    <input type="hidden" id="faq-id" value="${id || ''}">
    <div class="form-group">
      <label class="form-label">Question *</label>
      <input type="text" class="form-input" id="faq-question" value="${escapeHtml(f.question || '')}" placeholder="ex: Combien coûte une licence ?">
    </div>
    <div class="form-group">
      <label class="form-label">Réponse *</label>
      <textarea class="form-input" id="faq-answer" rows="6">${escapeHtml(f.answer || '')}</textarea>
    </div>
    <div style="display:grid;grid-template-columns:1fr 140px;gap:12px">
      <div class="form-group">
        <label class="form-label">Catégorie</label>
        <select class="form-input" id="faq-category">
          <option value="general" ${f.category === 'general' ? 'selected' : ''}>Général</option>
          <option value="pricing" ${f.category === 'pricing' ? 'selected' : ''}>Tarifs</option>
          <option value="technical" ${f.category === 'technical' ? 'selected' : ''}>Technique</option>
          <option value="pedagogy" ${f.category === 'pedagogy' ? 'selected' : ''}>Pédagogie</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Ordre</label>
        <input type="number" class="form-input" id="faq-order" value="${f.sort_order || 0}">
      </div>
    </div>
    <div class="form-group">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
        <input type="checkbox" id="faq-active" ${f.active ? 'checked' : ''}>
        <span>Question publiée (visible sur le site)</span>
      </label>
    </div>
  `;
  document.getElementById('faqModalOverlay').hidden = false;
};

window.closeFaqModal = function() { document.getElementById('faqModalOverlay').hidden = true; };

window.saveFaq = async function() {
  const sb = window.IMM_SUPABASE;
  const id = document.getElementById('faq-id').value;
  const payload = {
    question: document.getElementById('faq-question').value.trim(),
    answer: document.getElementById('faq-answer').value.trim(),
    category: document.getElementById('faq-category').value,
    sort_order: parseInt(document.getElementById('faq-order').value, 10) || 0,
    active: document.getElementById('faq-active').checked,
    updated_at: new Date().toISOString(),
  };
  if (!payload.question || !payload.answer) { showToast('Question et réponse obligatoires', 'error'); return; }
  try {
    if (id) {
      const { error } = await sb.from('faq_entries').update(payload).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await sb.from('faq_entries').insert([payload]);
      if (error) throw error;
    }
    showToast(`Question ${id ? 'mise à jour' : 'ajoutée'}`, 'success');
    closeFaqModal();
    renderFAQ(document.getElementById('pageArea'));
  } catch (e) { showToast('Erreur : ' + (e.message || e), 'error'); }
};

window.deleteFaq = async function(id) {
  if (!confirm('Supprimer cette question ?')) return;
  const sb = window.IMM_SUPABASE;
  try {
    const { error } = await sb.from('faq_entries').delete().eq('id', id);
    if (error) throw error;
    showToast('Question supprimée', 'success');
    renderFAQ(document.getElementById('pageArea'));
  } catch (e) { showToast('Erreur : ' + (e.message || e), 'error'); }
};

window.renderFAQ = renderFAQ;

/* ─── TARIFS ─────────────────────────────────────────── */
async function renderTarifs(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Tarifs & <em>offres</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Récupération…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const { data, error } = await sb.from('pricing_plans').select('*').order('sort_order');
  if (error) {
    const missing = (error.message || '').toLowerCase().includes('pricing_plans') || error.code === '42P01';
    el.innerHTML = `<div class="wrap"><div class="card" style="padding:30px;max-width:620px">
      <h3 style="margin-bottom:10px">${missing ? 'Table non initialisée' : 'Erreur'}</h3>
      <p style="font-size:13px;color:var(--ink-mute)">${missing ? 'Lance <code>sql/10-pricing-promos.sql</code> dans Supabase.' : escapeHtml(error.message)}</p>
    </div></div>`;
    return;
  }

  const plans = data || [];
  window._plansData = plans;

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Tarifs & <em>offres</em></h1>
        <p>${plans.length} forfait${plans.length > 1 ? 's' : ''} · ${plans.filter(p => p.active).length} actif${plans.filter(p => p.active).length > 1 ? 's' : ''}</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-primary" onclick="openPlanModal()">${iconPlus()}<span>Nouveau forfait</span></button>
      </div>
    </div>

    ${plans.length === 0 ? `
      <div class="card" style="padding:60px 20px;text-align:center">
        <h3 style="font-size:17px;margin-bottom:8px">Aucun forfait</h3>
        <button class="btn btn-primary" onclick="openPlanModal()">${iconPlus()}<span>Créer un forfait</span></button>
      </div>
    ` : `
      <div class="tarif-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px">
        ${plans.map(p => `
          <div class="tarif-card ${p.featured ? 'featured' : ''}" style="padding:22px;position:relative;${!p.active ? 'opacity:.55' : ''}">
            ${p.tag ? `<span class="tag" style="position:absolute;top:-10px;right:16px;background:var(--marine);color:white;padding:3px 10px;border-radius:999px;font-size:10px;font-weight:600;letter-spacing:.05em;text-transform:uppercase">${escapeHtml(p.tag)}</span>` : ''}
            <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px">
              <div>
                <h3 style="font-size:16px;font-weight:700">${escapeHtml(p.name)}</h3>
                <div style="font-size:11px;color:var(--ink-mute);margin-top:2px;letter-spacing:.04em;text-transform:uppercase">${p.target === 'b2b' ? 'Entreprise / établissement' : 'Particulier'}</div>
              </div>
              ${!p.active ? '<span class="badge badge-muted" style="font-size:10px">Inactif</span>' : ''}
            </div>
            <div class="price" style="font-family:var(--f-display);font-size:36px;font-weight:500;margin-bottom:14px">
              ${p.price_eur == 0 && p.period === 'unique' ? 'Sur devis' : `<sup style="font-size:16px">€</sup>${p.price_eur}<span style="font-size:12px;color:var(--ink-mute);font-weight:400"> /${p.period}</span>`}
            </div>
            ${p.description ? `<p style="font-size:12px;color:var(--ink-mute);margin-bottom:12px;line-height:1.5">${escapeHtml(p.description)}</p>` : ''}
            <ul style="list-style:none;padding:0;margin:0 0 14px 0;display:grid;gap:6px;font-size:13px">
              ${(p.features || []).map(f => `<li style="display:flex;gap:8px;align-items:flex-start"><span style="color:var(--jade);flex-shrink:0">✓</span><span>${escapeHtml(f)}</span></li>`).join('')}
            </ul>
            <div style="display:flex;gap:8px;margin-top:14px;padding-top:14px;border-top:1px solid var(--line-soft)">
              <button class="btn btn-secondary btn-sm" onclick="openPlanModal('${p.id}')" style="flex:1">${iconEdit()}<span>Éditer</span></button>
              <button class="btn ${p.active ? 'btn-secondary' : 'btn-primary'} btn-sm" onclick="togglePlan('${p.id}',${!p.active})">${p.active ? 'Désactiver' : 'Activer'}</button>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  </div>

  <div class="modal-overlay" id="planModalOverlay" hidden>
    <div class="modal" style="max-width:640px">
      <div class="modal-h">
        <h3 id="planModalTitle">Nouveau forfait</h3>
        <button class="modal-close" onclick="closePlanModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="planModalBody"></div>
      <div class="modal-footer" id="planModalFooter"></div>
    </div>
  </div>`;
}

window.openPlanModal = function(id) {
  const p = id ? (window._plansData || []).find(x => x.id === id) : {
    name: '', slug: '', price_eur: 0, period: 'mois', target: 'individual',
    features: [], cta_text: 'Choisir', cta_url: '', featured: false, tag: '',
    sort_order: 0, active: true, description: ''
  };
  document.getElementById('planModalTitle').textContent = id ? `Modifier : ${p.name}` : 'Nouveau forfait';
  document.getElementById('planModalBody').innerHTML = `
    <input type="hidden" id="pl-id" value="${id || ''}">
    <div style="display:grid;grid-template-columns:1fr 200px;gap:12px">
      <div class="form-group">
        <label class="form-label">Nom du forfait *</label>
        <input type="text" class="form-input" id="pl-name" value="${escapeHtml(p.name || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">Slug (URL)</label>
        <input type="text" class="form-input" id="pl-slug" value="${escapeHtml(p.slug || '')}" placeholder="learner">
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Prix (€)</label>
        <input type="number" class="form-input" id="pl-price" value="${p.price_eur}" step="0.01" min="0">
      </div>
      <div class="form-group">
        <label class="form-label">Période</label>
        <select class="form-input" id="pl-period">
          <option value="mois" ${p.period === 'mois' ? 'selected' : ''}>/ mois</option>
          <option value="an" ${p.period === 'an' ? 'selected' : ''}>/ an</option>
          <option value="unique" ${p.period === 'unique' ? 'selected' : ''}>unique</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Cible</label>
        <select class="form-input" id="pl-target">
          <option value="individual" ${p.target === 'individual' ? 'selected' : ''}>Particulier</option>
          <option value="b2b" ${p.target === 'b2b' ? 'selected' : ''}>B2B</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Description courte</label>
      <textarea class="form-input" id="pl-desc" rows="2">${escapeHtml(p.description || '')}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Fonctionnalités incluses (une par ligne)</label>
      <textarea class="form-input" id="pl-features" rows="5" placeholder="1 simulation incluse&#10;Accès 7 jours&#10;Support par email">${escapeHtml((p.features || []).join('\n'))}</textarea>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Texte du bouton</label>
        <input type="text" class="form-input" id="pl-cta-text" value="${escapeHtml(p.cta_text || '')}">
      </div>
      <div class="form-group">
        <label class="form-label">URL / destination bouton</label>
        <input type="text" class="form-input" id="pl-cta-url" value="${escapeHtml(p.cta_url || '')}" placeholder="/demander-formation.html">
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr 100px;gap:12px">
      <div class="form-group">
        <label class="form-label">Étiquette (tag)</label>
        <input type="text" class="form-input" id="pl-tag" value="${escapeHtml(p.tag || '')}" placeholder="Populaire">
      </div>
      <div class="form-group">
        <label class="form-label">Ordre d'affichage</label>
        <input type="number" class="form-input" id="pl-order" value="${p.sort_order || 0}">
      </div>
      <div class="form-group">
        <label class="form-label">&nbsp;</label>
        <label style="display:flex;align-items:center;gap:8px;padding-top:10px;font-size:13px">
          <input type="checkbox" id="pl-featured" ${p.featured ? 'checked' : ''}>
          <span>Vedette</span>
        </label>
      </div>
    </div>
  `;
  document.getElementById('planModalFooter').innerHTML = `
    ${id ? `<button class="btn btn-danger" onclick="deletePlan('${id}')" style="margin-right:auto">Supprimer</button>` : ''}
    <button class="btn btn-secondary" onclick="closePlanModal()">Annuler</button>
    <button class="btn btn-primary" onclick="savePlan()">Enregistrer</button>
  `;
  document.getElementById('planModalOverlay').hidden = false;
};

window.closePlanModal = function() { document.getElementById('planModalOverlay').hidden = true; };

window.savePlan = async function() {
  const sb = window.IMM_SUPABASE;
  const id = document.getElementById('pl-id').value;
  const payload = {
    name: document.getElementById('pl-name').value.trim(),
    slug: document.getElementById('pl-slug').value.trim() || null,
    price_eur: parseFloat(document.getElementById('pl-price').value) || 0,
    period: document.getElementById('pl-period').value,
    target: document.getElementById('pl-target').value,
    description: document.getElementById('pl-desc').value.trim() || null,
    features: document.getElementById('pl-features').value.split('\n').map(s => s.trim()).filter(Boolean),
    cta_text: document.getElementById('pl-cta-text').value.trim() || null,
    cta_url: document.getElementById('pl-cta-url').value.trim() || null,
    tag: document.getElementById('pl-tag').value.trim() || null,
    sort_order: parseInt(document.getElementById('pl-order').value, 10) || 0,
    featured: document.getElementById('pl-featured').checked,
    updated_at: new Date().toISOString(),
  };
  if (!payload.name) { showToast('Le nom est obligatoire', 'error'); return; }
  try {
    if (id) {
      const { error } = await sb.from('pricing_plans').update(payload).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await sb.from('pricing_plans').insert([payload]);
      if (error) throw error;
    }
    showToast(`Forfait ${id ? 'mis à jour' : 'créé'}`, 'success');
    closePlanModal();
    renderTarifs(document.getElementById('pageArea'));
  } catch (e) { showToast('Erreur : ' + (e.message || e), 'error'); }
};

window.togglePlan = async function(id, newActive) {
  const sb = window.IMM_SUPABASE;
  try {
    const { error } = await sb.from('pricing_plans').update({ active: newActive, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    showToast(newActive ? 'Forfait activé' : 'Forfait désactivé', 'success');
    renderTarifs(document.getElementById('pageArea'));
  } catch (e) { showToast('Erreur : ' + (e.message || e), 'error'); }
};

window.deletePlan = async function(id) {
  if (!confirm('Supprimer définitivement ce forfait ?')) return;
  const sb = window.IMM_SUPABASE;
  try {
    const { error } = await sb.from('pricing_plans').delete().eq('id', id);
    if (error) throw error;
    showToast('Forfait supprimé', 'success');
    closePlanModal();
    renderTarifs(document.getElementById('pageArea'));
  } catch (e) { showToast('Erreur : ' + (e.message || e), 'error'); }
};

window.renderTarifs = renderTarifs;


/* ─── PROMOTIONS ─────────────────────────────────────── */
async function renderPromotions(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Codes <em>promotionnels</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Récupération…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const [promoRes, plansRes] = await Promise.all([
    sb.from('promo_codes').select('*').order('created_at', { ascending: false }),
    sb.from('pricing_plans').select('id,name').eq('active', true),
  ]);
  if (promoRes.error) {
    const missing = (promoRes.error.message || '').toLowerCase().includes('promo_codes') || promoRes.error.code === '42P01';
    el.innerHTML = `<div class="wrap"><div class="card" style="padding:30px;max-width:620px">
      <h3 style="margin-bottom:10px">${missing ? 'Table non initialisée' : 'Erreur'}</h3>
      <p style="font-size:13px;color:var(--ink-mute)">${missing ? 'Lance <code>sql/10-pricing-promos.sql</code> dans Supabase.' : escapeHtml(promoRes.error.message)}</p>
    </div></div>`;
    return;
  }

  const promos = promoRes.data || [];
  const plans = plansRes.data || [];
  window._promosData = { promos, plans };

  const now = new Date();
  const activeNow = promos.filter(p => p.active && (!p.valid_until || new Date(p.valid_until) > now) && (p.max_uses === null || p.uses_count < p.max_uses));
  const expired = promos.filter(p => !p.active || (p.valid_until && new Date(p.valid_until) < now));

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Codes <em>promotionnels</em></h1>
        <p>${activeNow.length} code${activeNow.length > 1 ? 's' : ''} actif${activeNow.length > 1 ? 's' : ''} · ${promos.length} au total</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-primary" onclick="openPromoModal()">${iconPlus()}<span>Nouveau code</span></button>
      </div>
    </div>

    ${promos.length === 0 ? `
      <div class="card" style="padding:60px 20px;text-align:center">
        <h3 style="font-size:17px;margin-bottom:8px">Aucun code promo</h3>
        <button class="btn btn-primary" onclick="openPromoModal()">${iconPlus()}<span>Créer un code</span></button>
      </div>
    ` : `
      <div style="display:grid;gap:12px">
        ${promos.map(p => {
          const plan = plans.find(x => x.id === p.applies_to_plan_id);
          const isExpired = p.valid_until && new Date(p.valid_until) < now;
          const isMaxed = p.max_uses !== null && p.uses_count >= p.max_uses;
          const usageStr = p.max_uses === null ? `${p.uses_count} / ∞` : `${p.uses_count} / ${p.max_uses}`;
          return `<div class="card" style="padding:18px;display:flex;gap:16px;align-items:center;opacity:${p.active ? '1' : '.55'}">
            <div style="width:64px;height:64px;border-radius:var(--r-sm);background:${p.active && !isExpired && !isMaxed ? 'var(--jade)' : 'var(--ink-mute)'};color:white;display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0">
              <div style="font-size:18px;font-weight:700;font-family:var(--f-mono)">
                ${p.discount_percent ? '-' + p.discount_percent + '%' : (p.discount_amount_eur ? '-' + p.discount_amount_eur + '€' : '?')}
              </div>
            </div>
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
                <code style="font-family:var(--f-mono);font-size:14px;font-weight:700;background:var(--bg-alt);padding:2px 8px;border-radius:var(--r-sm)">${escapeHtml(p.code)}</code>
                ${isExpired ? '<span class="badge badge-danger">Expiré</span>' : ''}
                ${isMaxed ? '<span class="badge badge-warn">Épuisé</span>' : ''}
                ${!p.active ? '<span class="badge badge-muted">Désactivé</span>' : ''}
              </div>
              <div style="font-size:12px;color:var(--ink-mute);margin-bottom:4px">${escapeHtml(p.description || '—')}</div>
              <div style="display:flex;gap:14px;font-size:11px;color:var(--ink-mute);font-family:var(--f-mono)">
                <span>Utilisations : <strong>${usageStr}</strong></span>
                ${plan ? `<span>Forfait : <strong>${escapeHtml(plan.name)}</strong></span>` : ''}
                ${p.valid_until ? `<span>Expire : <strong>${new Date(p.valid_until).toLocaleDateString('fr-FR')}</strong></span>` : ''}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:6px">
              <button class="btn btn-secondary btn-sm" onclick="openPromoModal('${p.id}')">${iconEdit()}<span>Éditer</span></button>
              <button class="btn ${p.active ? 'btn-secondary' : 'btn-primary'} btn-sm" onclick="togglePromo('${p.id}',${!p.active})">${p.active ? 'Désactiver' : 'Réactiver'}</button>
            </div>
          </div>`;
        }).join('')}
      </div>
    `}
  </div>

  <div class="modal-overlay" id="promoModalOverlay" hidden>
    <div class="modal" style="max-width:640px">
      <div class="modal-h">
        <h3 id="promoModalTitle">Nouveau code promo</h3>
        <button class="modal-close" onclick="closePromoModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="promoModalBody"></div>
      <div class="modal-footer" id="promoModalFooter"></div>
    </div>
  </div>`;
}

window.openPromoModal = function(id) {
  const { promos, plans } = window._promosData || { promos: [], plans: [] };
  const p = id ? promos.find(x => x.id === id) : {
    code: '', description: '', discount_percent: 10, discount_amount_eur: null,
    max_uses: null, uses_count: 0, valid_from: null, valid_until: null,
    applies_to_plan_id: null, active: true
  };
  const toDateInput = (v) => v ? new Date(v).toISOString().slice(0, 10) : '';

  document.getElementById('promoModalTitle').textContent = id ? `Modifier : ${p.code}` : 'Nouveau code promo';
  document.getElementById('promoModalBody').innerHTML = `
    <input type="hidden" id="pr-id" value="${id || ''}">
    <div class="form-group">
      <label class="form-label">Code *</label>
      <input type="text" class="form-input" id="pr-code" value="${escapeHtml(p.code || '')}" placeholder="WELCOME20" style="font-family:var(--f-mono);text-transform:uppercase">
      <small style="color:var(--ink-mute);font-size:11px">Unique, sensible à la casse. Sera stocké tel quel.</small>
    </div>
    <div class="form-group">
      <label class="form-label">Description (pour l'admin, non publique)</label>
      <input type="text" class="form-input" id="pr-desc" value="${escapeHtml(p.description || '')}" placeholder="Offre bienvenue nouveaux inscrits">
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Réduction en %</label>
        <input type="number" class="form-input" id="pr-pct" value="${p.discount_percent || ''}" min="0" max="100" placeholder="20">
      </div>
      <div class="form-group">
        <label class="form-label">Ou réduction en €</label>
        <input type="number" class="form-input" id="pr-amt" value="${p.discount_amount_eur || ''}" step="0.01" min="0" placeholder="10.00">
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Utilisations max (vide = illimité)</label>
        <input type="number" class="form-input" id="pr-max" value="${p.max_uses ?? ''}" min="1" placeholder="100">
      </div>
      <div class="form-group">
        <label class="form-label">Utilisations actuelles</label>
        <input type="number" class="form-input" value="${p.uses_count || 0}" disabled style="background:var(--bg-alt);color:var(--ink-mute)">
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group">
        <label class="form-label">Valide à partir de</label>
        <input type="date" class="form-input" id="pr-from" value="${toDateInput(p.valid_from)}">
      </div>
      <div class="form-group">
        <label class="form-label">Expire le (vide = illimité)</label>
        <input type="date" class="form-input" id="pr-until" value="${toDateInput(p.valid_until)}">
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Applicable à un forfait précis (facultatif)</label>
      <select class="form-input" id="pr-plan">
        <option value="">— Tous les forfaits —</option>
        ${plans.map(pl => `<option value="${pl.id}" ${p.applies_to_plan_id === pl.id ? 'selected' : ''}>${escapeHtml(pl.name)}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px">
        <input type="checkbox" id="pr-active" ${p.active ? 'checked' : ''}>
        <span>Code actif</span>
      </label>
    </div>
  `;
  document.getElementById('promoModalFooter').innerHTML = `
    ${id ? `<button class="btn btn-danger" onclick="deletePromo('${id}')" style="margin-right:auto">Supprimer</button>` : ''}
    <button class="btn btn-secondary" onclick="closePromoModal()">Annuler</button>
    <button class="btn btn-primary" onclick="savePromo()">Enregistrer</button>
  `;
  document.getElementById('promoModalOverlay').hidden = false;
};

window.closePromoModal = function() { document.getElementById('promoModalOverlay').hidden = true; };

window.savePromo = async function() {
  const sb = window.IMM_SUPABASE;
  const id = document.getElementById('pr-id').value;
  const code = document.getElementById('pr-code').value.trim().toUpperCase();
  if (!code) { showToast('Le code est obligatoire', 'error'); return; }

  const pct = document.getElementById('pr-pct').value;
  const amt = document.getElementById('pr-amt').value;
  if (!pct && !amt) { showToast('Saisissez un % ou un montant de réduction', 'error'); return; }

  const toIso = (v) => v ? new Date(v + 'T00:00:00Z').toISOString() : null;

  const payload = {
    code,
    description: document.getElementById('pr-desc').value.trim() || null,
    discount_percent: pct ? parseInt(pct, 10) : null,
    discount_amount_eur: amt ? parseFloat(amt) : null,
    max_uses: document.getElementById('pr-max').value ? parseInt(document.getElementById('pr-max').value, 10) : null,
    valid_from: toIso(document.getElementById('pr-from').value),
    valid_until: toIso(document.getElementById('pr-until').value),
    applies_to_plan_id: document.getElementById('pr-plan').value || null,
    active: document.getElementById('pr-active').checked,
    updated_at: new Date().toISOString(),
  };
  try {
    if (id) {
      const { error } = await sb.from('promo_codes').update(payload).eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await sb.from('promo_codes').insert([payload]);
      if (error) throw error;
    }
    showToast(`Code ${id ? 'mis à jour' : 'créé'}`, 'success');
    closePromoModal();
    renderPromotions(document.getElementById('pageArea'));
  } catch (e) {
    if ((e.message || '').includes('duplicate')) showToast('Ce code existe déjà', 'error');
    else showToast('Erreur : ' + (e.message || e), 'error');
  }
};

window.togglePromo = async function(id, newActive) {
  const sb = window.IMM_SUPABASE;
  try {
    const { error } = await sb.from('promo_codes').update({ active: newActive, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw error;
    showToast(newActive ? 'Code activé' : 'Code désactivé', 'success');
    renderPromotions(document.getElementById('pageArea'));
  } catch (e) { showToast('Erreur : ' + (e.message || e), 'error'); }
};

window.deletePromo = async function(id) {
  if (!confirm('Supprimer définitivement ce code promo ?')) return;
  const sb = window.IMM_SUPABASE;
  try {
    const { error } = await sb.from('promo_codes').delete().eq('id', id);
    if (error) throw error;
    showToast('Code supprimé', 'success');
    closePromoModal();
    renderPromotions(document.getElementById('pageArea'));
  } catch (e) { showToast('Erreur : ' + (e.message || e), 'error'); }
};

window.renderPromotions = renderPromotions;

/* ─── ACCESS & SÉCURITÉ ──────────────────────────────── */
async function renderAccess(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Accès & <em>sécurité</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Audit en cours…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const supabaseUrl = window.IMM_SUPABASE_URL || '';
  const anonKey = window.IMM_SUPABASE_ANON || '';

  // Récupérer admins et formateurs
  const { data: profiles } = await sb.from('profiles').select('id,email,full_name,role,created_at');
  const admins = (profiles || []).filter(p => p.role === 'admin');
  const formateurs = (profiles || []).filter(p => p.role === 'formateur');

  // Diagnostic des tables critiques
  const tablesToCheck = [
    { name: 'profiles', label: 'Profils utilisateurs', critical: true },
    { name: 'simulations', label: 'Catalogue simulations', critical: true },
    { name: 'challenges', label: 'Défis et questions', critical: true },
    { name: 'user_progress', label: 'Progression apprenants', critical: true },
    { name: 'training_requests', label: 'Demandes de formation', critical: false },
    { name: 'training_sessions', label: 'Sessions de formation', critical: false },
    { name: 'session_participants', label: 'Participants sessions', critical: false },
    { name: 'coaching_sessions', label: 'Sessions coaching', critical: false },
    { name: 'site_content', label: 'Contenu site vitrine', critical: false },
    { name: 'faq_entries', label: 'FAQ', critical: false },
    { name: 'editorial_pages', label: 'Pages éditoriales', critical: false },
    { name: 'pricing_plans', label: 'Forfaits tarifaires', critical: false },
    { name: 'promo_codes', label: 'Codes promo', critical: false },
  ];

  const tableResults = [];
  for (const t of tablesToCheck) {
    try {
      const { count, error } = await sb.from(t.name).select('*', { count: 'exact', head: true });
      if (error) {
        tableResults.push({ ...t, status: 'missing', count: 0, error: error.message });
      } else {
        tableResults.push({ ...t, status: 'ok', count: count || 0 });
      }
    } catch (e) {
      tableResults.push({ ...t, status: 'error', count: 0, error: e.message });
    }
  }

  const missingCritical = tableResults.filter(t => t.critical && t.status !== 'ok').length;
  const missingOptional = tableResults.filter(t => !t.critical && t.status !== 'ok').length;

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Accès & <em>sécurité</em></h1>
        <p>Diagnostic, connexions, audit des rôles</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-secondary" onclick="renderAccess(document.getElementById('pageArea'))">${iconDownload()}<span>Actualiser</span></button>
      </div>
    </div>

    ${missingCritical > 0 ? `
      <div style="padding:14px 18px;background:#FEF2F2;border-left:3px solid #DC2626;border-radius:var(--r-sm);margin-bottom:20px;font-size:13px;color:#7F1D1D">
        <strong>Attention :</strong> ${missingCritical} table${missingCritical > 1 ? 's' : ''} critique${missingCritical > 1 ? 's' : ''} manquante${missingCritical > 1 ? 's' : ''}. La plateforme ne peut pas fonctionner correctement.
      </div>
    ` : ''}

    <div class="kpi-grid">
      <div class="kpi accent"><div class="value">${admins.length}</div><div class="label">Administrateurs</div></div>
      <div class="kpi success"><div class="value">${formateurs.length}</div><div class="label">Formateurs</div></div>
      <div class="kpi"><div class="value">${tableResults.filter(t => t.status === 'ok').length}/${tablesToCheck.length}</div><div class="label">Tables en ligne</div></div>
      <div class="kpi ${missingOptional > 0 ? 'warn' : ''}"><div class="value">${missingOptional}</div><div class="label">SQL non lancés</div></div>
    </div>

    <div class="cards-grid" style="grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px">
      <div class="card">
        <div class="card-h"><h2>Administrateurs (${admins.length})</h2></div>
        <div class="card-body">
          ${admins.length === 0 ? '<p style="color:var(--ink-mute);font-size:13px;padding:10px 0">Aucun administrateur défini</p>' : admins.map(a => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--line-soft)">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--coral);color:white;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px">
                ${(a.full_name || a.email)[0].toUpperCase()}
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(a.full_name || a.email.split('@')[0])}</div>
                <div style="font-size:11px;color:var(--ink-mute);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(a.email)}</div>
              </div>
              <span class="badge badge-danger" style="font-size:10px">Admin</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-h"><h2>Formateurs (${formateurs.length})</h2></div>
        <div class="card-body">
          ${formateurs.length === 0 ? '<p style="color:var(--ink-mute);font-size:13px;padding:10px 0">Aucun formateur défini</p>' : formateurs.slice(0, 8).map(f => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--line-soft)">
              <div style="width:32px;height:32px;border-radius:50%;background:var(--jade);color:white;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:13px">
                ${(f.full_name || f.email)[0].toUpperCase()}
              </div>
              <div style="flex:1;min-width:0">
                <div style="font-weight:600;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(f.full_name || f.email.split('@')[0])}</div>
                <div style="font-size:11px;color:var(--ink-mute);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(f.email)}</div>
              </div>
              <span class="badge badge-success" style="font-size:10px">Formateur</span>
            </div>
          `).join('')}
          ${formateurs.length > 8 ? `<div style="text-align:center;padding:10px 0;font-size:11px;color:var(--ink-mute)">+${formateurs.length - 8} autre${formateurs.length - 8 > 1 ? 's' : ''} formateur${formateurs.length - 8 > 1 ? 's' : ''}</div>` : ''}
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-h"><h2>Diagnostic des tables</h2></div>
      <div class="card-body">
        <div style="display:grid;gap:4px">
          ${tableResults.map(t => `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:${t.status === 'ok' ? 'transparent' : (t.critical ? '#FEF2F2' : '#FEF6EE')};border:1px solid ${t.status === 'ok' ? 'var(--line-soft)' : (t.critical ? '#FECACA' : '#FED7AA')};border-radius:var(--r-sm)">
              <div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                ${t.status === 'ok'
                  ? '<svg viewBox="0 0 24 24" fill="none" stroke="var(--jade)" stroke-width="3" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>'
                  : '<svg viewBox="0 0 24 24" fill="none" stroke="' + (t.critical ? '#DC2626' : '#EA580C') + '" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'}
              </div>
              <div style="flex:1;min-width:0">
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="font-weight:500;font-size:13px">${escapeHtml(t.label)}</span>
                  <code style="font-family:var(--f-mono);font-size:10px;color:var(--ink-mute);background:var(--bg-alt);padding:1px 6px;border-radius:4px">${t.name}</code>
                  ${t.critical ? '<span class="badge badge-danger" style="font-size:9px">CRITIQUE</span>' : ''}
                </div>
                ${t.status !== 'ok' ? `<div style="font-size:11px;color:var(--ink-mute);margin-top:2px">${escapeHtml(t.error || 'Non initialisée')}</div>` : ''}
              </div>
              <div style="font-family:var(--f-mono);font-size:11px;color:var(--ink-mute);text-align:right;white-space:nowrap">
                ${t.status === 'ok' ? `<strong style="color:var(--ink)">${t.count}</strong> ligne${t.count > 1 ? 's' : ''}` : 'hors ligne'}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-h"><h2>Configuration Supabase</h2></div>
      <div class="card-body">
        <div style="padding:12px;background:var(--bg-alt);border-radius:var(--r-sm);margin-bottom:14px;font-size:12px;color:var(--ink-soft);line-height:1.6">
          Ces informations identifient votre projet Supabase. L'<strong>anon key</strong> est publique (elle est dans le code côté client), mais elle ne donne accès qu'aux tables autorisées par les règles RLS. Ne partagez jamais votre <strong>service_role key</strong>.
        </div>
        <div class="form-group">
          <label class="form-label">URL du projet</label>
          <div style="display:flex;gap:6px">
            <input type="text" class="form-input" value="${escapeHtml(supabaseUrl)}" readonly style="font-family:var(--f-mono);font-size:12px;background:var(--bg-alt)">
            <button class="btn btn-secondary btn-sm" onclick="copyToClipboard('${escapeHtml(supabaseUrl)}')">Copier</button>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Anon key (publique)</label>
          <div style="display:flex;gap:6px">
            <input type="text" class="form-input" value="${escapeHtml(anonKey)}" readonly style="font-family:var(--f-mono);font-size:11px;background:var(--bg-alt)">
            <button class="btn btn-secondary btn-sm" onclick="copyToClipboard('${escapeHtml(anonKey)}')">Copier</button>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Tableau de bord Supabase</label>
          <a href="https://supabase.com/dashboard/project/tbmiidxddsynzqvakbiw" target="_blank" class="btn btn-secondary" style="text-decoration:none;width:fit-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            <span>Ouvrir dans Supabase</span>
          </a>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-h"><h2>Connexion actuelle</h2></div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
          <div>
            <div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;font-weight:600;margin-bottom:4px">Compte connecté</div>
            <div style="font-size:14px;font-weight:600">${escapeHtml(window.IMM_USER?.email || '—')}</div>
          </div>
          <div>
            <div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;font-weight:600;margin-bottom:4px">Identifiant utilisateur</div>
            <code style="font-family:var(--f-mono);font-size:11px;color:var(--ink-soft);word-break:break-all">${escapeHtml(window.IMM_USER?.id || '—')}</code>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

window.copyToClipboard = function(text) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copié dans le presse-papier', 'success');
  }).catch(() => {
    showToast('Impossible de copier', 'error');
  });
};

window.renderAccess = renderAccess;


/* ─── CERTIFICATS ───────────────────────────────────── */
async function renderCerts(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Certi<em>ficats</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Récupération des certificats…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const [certsRes, profilesRes] = await Promise.all([
    sb.from('certificates').select('*').order('issued_at', { ascending: false }),
    sb.from('profiles').select('id,email,full_name'),
  ]);

  if (certsRes.error) {
    const missing = (certsRes.error.message || '').toLowerCase().includes('certificates') || certsRes.error.code === '42P01';
    el.innerHTML = `<div class="wrap"><div class="card" style="padding:30px;max-width:640px">
      <h3 style="margin-bottom:10px">${missing ? 'Table non initialisée' : 'Erreur'}</h3>
      <p style="font-size:13px;color:var(--ink-mute)">${missing ? 'Lance <code>sql/12-certificates.sql</code> dans Supabase pour activer les certificats.' : escapeHtml(certsRes.error.message)}</p>
    </div></div>`;
    return;
  }

  const certs = certsRes.data || [];
  const profiles = profilesRes.data || [];

  // Stats
  const thisMonth = new Date(); thisMonth.setDate(1);
  const thisMonthCount = certs.filter(c => new Date(c.issued_at) >= thisMonth).length;
  const uniqueUsers = new Set(certs.map(c => c.user_id)).size;
  const byGame = {};
  certs.forEach(c => { byGame[c.game_id] = (byGame[c.game_id] || 0) + 1; });
  const topGame = Object.entries(byGame).sort((a, b) => b[1] - a[1])[0];
  const avgScore = certs.length > 0
    ? Math.round(certs.reduce((t, c) => t + (c.score || 0), 0) / certs.length)
    : 0;

  window._certsData = certs;

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Certi<em>ficats</em></h1>
        <p>${certs.length} certificat${certs.length > 1 ? 's' : ''} délivré${certs.length > 1 ? 's' : ''}</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-secondary" onclick="renderCerts(document.getElementById('pageArea'))">${iconDownload()}<span>Actualiser</span></button>
        <button class="btn btn-primary" onclick="exportCertsCsv()">${iconDownload()}<span>Export CSV</span></button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi accent"><div class="value">${certs.length}</div><div class="label">Total</div></div>
      <div class="kpi success"><div class="value">${thisMonthCount}</div><div class="label">Ce mois-ci</div></div>
      <div class="kpi"><div class="value">${uniqueUsers}</div><div class="label">Apprenants certifiés</div></div>
      <div class="kpi warn"><div class="value">${avgScore}<span style="font-size:16px;color:var(--ink-mute);font-weight:400"> /100</span></div><div class="label">Score moyen</div></div>
    </div>

    ${certs.length === 0 ? `
      <div class="card" style="padding:60px 20px;text-align:center">
        <h3 style="font-size:17px;margin-bottom:8px">Aucun certificat délivré pour le moment</h3>
        <p style="color:var(--ink-mute);font-size:13px">Les certificats sont générés automatiquement quand un apprenant termine les 21 défis d'une simulation.</p>
      </div>
    ` : `
      <div class="filter-bar" style="display:flex;gap:8px">
        <input type="search" class="filter-search" id="cert-search" placeholder="Rechercher par nom, email, simulation…" oninput="filterCertsTable()" style="flex:1">
      </div>
      <div class="table-wrap"><table id="cert-table">
        <thead><tr>
          <th>N° certificat</th>
          <th>Apprenant</th>
          <th>Simulation</th>
          <th>Score</th>
          <th>Délivré le</th>
          <th>Actions</th>
        </tr></thead>
        <tbody>
          ${certs.map(c => {
            const u = profiles.find(p => p.id === c.user_id);
            return `<tr data-search="${escapeHtml((c.recipient_name + ' ' + c.recipient_email + ' ' + c.game_name + ' ' + c.certificate_number).toLowerCase())}">
              <td style="font-family:var(--f-mono);font-size:11px;font-weight:600">${escapeHtml(c.certificate_number)}</td>
              <td>
                <div style="font-weight:600;font-size:13px">${escapeHtml(c.recipient_name)}</div>
                <div style="font-size:11px;color:var(--ink-mute)">${escapeHtml(c.recipient_email || u?.email || '')}</div>
              </td>
              <td>
                <div style="font-size:13px;font-weight:500">${escapeHtml(c.game_name)}</div>
                ${c.domain ? `<div style="font-size:11px;color:var(--ink-mute)">${escapeHtml(c.domain)}</div>` : ''}
              </td>
              <td style="font-family:var(--f-mono);font-weight:600">${c.score != null ? c.score + '/100' : '—'}</td>
              <td style="font-size:12px;color:var(--ink-mute)">${new Date(c.issued_at).toLocaleDateString('fr-FR', {day:'numeric',month:'short',year:'numeric'})}</td>
              <td><button class="btn btn-secondary btn-sm" onclick="adminDownloadCert('${c.id}')">PDF</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>
    `}
  </div>`;
}

window.filterCertsTable = function() {
  const q = (document.getElementById('cert-search').value || '').toLowerCase().trim();
  document.querySelectorAll('#cert-table tbody tr').forEach(tr => {
    tr.style.display = !q || (tr.dataset.search || '').includes(q) ? '' : 'none';
  });
};

window.adminDownloadCert = function(id) {
  const cert = (window._certsData || []).find(c => c.id === id);
  if (!cert) return;
  if (!window.IMM_generateCertificatePDF) {
    showToast('Module PDF non chargé. Recharge la page.', 'error');
    return;
  }
  window.IMM_generateCertificatePDF(cert);
};

window.exportCertsCsv = function() {
  const certs = window._certsData || [];
  if (certs.length === 0) { showToast('Aucun certificat à exporter', ''); return; }

  const header = ['N°', 'Apprenant', 'Email', 'Simulation', 'Domaine', 'Score', 'Défis', 'Délivré le'];
  const lines = [header.join(';')];
  const esc = (v) => {
    if (v == null) return '';
    const s = String(v);
    if (/[;"\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  certs.forEach(c => {
    lines.push([
      c.certificate_number,
      c.recipient_name,
      c.recipient_email || '',
      c.game_name,
      c.domain || '',
      c.score != null ? c.score : '',
      c.challenges_completed || 21,
      new Date(c.issued_at).toLocaleString('fr-FR')
    ].map(esc).join(';'));
  });
  const csv = '\uFEFF' + lines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `immersium-certificats-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Export CSV téléchargé', 'success');
};

window.renderCerts = renderCerts;


/* ─── COMMANDES STRIPE ───────────────────────────────────── */
async function renderOrders(el) {
  el.innerHTML = `<div class="wrap">
    <div class="page-h"><div class="page-h-left"><h1>Com<em>mandes</em></h1><p>Chargement…</p></div></div>
    <div style="padding:40px;text-align:center;color:var(--ink-mute)">Récupération des commandes…</div>
  </div>`;

  const sb = window.IMM_SUPABASE;
  const [ordersRes, subsRes] = await Promise.all([
    sb.from('orders').select('*').order('created_at', { ascending: false }),
    sb.from('subscriptions').select('*').order('created_at', { ascending: false }),
  ]);

  if (ordersRes.error) {
    const missing = (ordersRes.error.message || '').toLowerCase().includes('orders') || ordersRes.error.code === '42P01';
    el.innerHTML = `<div class="wrap"><div class="card" style="padding:30px;max-width:640px">
      <h3 style="margin-bottom:10px">${missing ? 'Table non initialisée' : 'Erreur'}</h3>
      <p style="font-size:13px;color:var(--ink-mute)">${missing ? 'Lance <code>sql/13-stripe.sql</code> dans Supabase pour activer les commandes.' : escapeHtml(ordersRes.error.message)}</p>
    </div></div>`;
    return;
  }

  const orders = ordersRes.data || [];
  const subs = subsRes.data || [];
  const paidOrders = orders.filter(o => o.status === 'paid');

  // CA total en €
  const totalRevenue = paidOrders.reduce((t, o) => t + (o.amount_cents || 0), 0) / 100;
  
  // CA du mois en cours
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const monthRevenue = paidOrders
    .filter(o => o.paid_at && new Date(o.paid_at) >= monthStart)
    .reduce((t, o) => t + (o.amount_cents || 0), 0) / 100;

  const activeSubs = subs.filter(s => s.status === 'active' || s.status === 'trialing').length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  window._ordersData = orders;

  const statusColors = {
    pending: ['badge-warn', 'En attente'],
    paid: ['badge-success', 'Payée'],
    failed: ['badge-danger', 'Échouée'],
    refunded: ['badge-muted', 'Remboursée'],
    cancelled: ['badge-muted', 'Annulée'],
  };
  const statusBadgeOrder = (s) => {
    const [cls, label] = statusColors[s] || ['badge-muted', s || '—'];
    return `<span class="badge ${cls}">${label}</span>`;
  };

  el.innerHTML = `<div class="wrap">
    <div class="page-h">
      <div class="page-h-left">
        <h1>Com<em>mandes</em></h1>
        <p>${orders.length} commande${orders.length > 1 ? 's' : ''} · ${paidOrders.length} payée${paidOrders.length > 1 ? 's' : ''}</p>
      </div>
      <div class="page-h-right">
        <button class="btn btn-secondary" onclick="renderOrders(document.getElementById('pageArea'))">${iconDownload()}<span>Actualiser</span></button>
        <button class="btn btn-primary" onclick="exportOrdersCsv()">${iconDownload()}<span>Export CSV</span></button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi accent"><div class="value">${totalRevenue.toFixed(0)}<span style="font-size:20px;color:var(--ink-mute);font-weight:400"> €</span></div><div class="label">CA total</div></div>
      <div class="kpi success"><div class="value">${monthRevenue.toFixed(0)}<span style="font-size:20px;color:var(--ink-mute);font-weight:400"> €</span></div><div class="label">CA ce mois-ci</div></div>
      <div class="kpi"><div class="value">${activeSubs}</div><div class="label">Abonnements actifs</div></div>
      <div class="kpi warn"><div class="value">${pendingCount}</div><div class="label">En attente</div></div>
    </div>

    ${orders.length === 0 ? `
      <div class="card" style="padding:60px 20px;text-align:center">
        <h3 style="font-size:17px;margin-bottom:8px">Aucune commande pour le moment</h3>
        <p style="color:var(--ink-mute);font-size:13px;max-width:500px;margin:0 auto">Les commandes apparaîtront ici dès qu'un utilisateur paiera via Stripe. Voir <code>docs/STRIPE.md</code> pour l'activation.</p>
      </div>
    ` : `
      <div class="filter-bar" style="display:flex;gap:8px">
        <select class="form-input" id="ord-filter-status" onchange="filterOrdersTable()" style="max-width:180px">
          <option value="">Tous les statuts</option>
          <option value="paid">Payées</option>
          <option value="pending">En attente</option>
          <option value="failed">Échouées</option>
          <option value="refunded">Remboursées</option>
        </select>
        <input type="search" class="filter-search" id="ord-search" placeholder="Rechercher par email, forfait, session…" oninput="filterOrdersTable()" style="flex:1">
      </div>

      <div class="table-wrap"><table id="orders-table">
        <thead><tr>
          <th>Date</th>
          <th>Client</th>
          <th>Forfait</th>
          <th>Montant</th>
          <th>Code promo</th>
          <th>Statut</th>
          <th>Session Stripe</th>
        </tr></thead>
        <tbody>
          ${orders.map(o => {
            const amt = ((o.amount_cents || 0) / 100).toFixed(2);
            const discount = o.discount_cents ? ` (-${(o.discount_cents / 100).toFixed(2)}€)` : '';
            return `<tr data-status="${o.status}" data-search="${escapeHtml((o.email + ' ' + (o.plan_name || '') + ' ' + (o.stripe_session_id || '')).toLowerCase())}">
              <td style="font-size:12px;color:var(--ink-mute);font-family:var(--f-mono)">${new Date(o.created_at).toLocaleString('fr-FR', {day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}</td>
              <td><div style="font-size:13px">${escapeHtml(o.email)}</div></td>
              <td>
                <div style="font-size:13px;font-weight:500">${escapeHtml(o.plan_name || o.plan_slug || '—')}</div>
              </td>
              <td style="font-family:var(--f-mono);font-weight:600">${amt} €${discount}</td>
              <td style="font-size:12px">${o.promo_code ? `<code style="font-family:var(--f-mono);font-size:11px">${escapeHtml(o.promo_code)}</code>` : '—'}</td>
              <td>${statusBadgeOrder(o.status)}</td>
              <td style="font-family:var(--f-mono);font-size:10px;color:var(--ink-mute)">${o.stripe_session_id ? escapeHtml(o.stripe_session_id.substring(0, 20) + '…') : '—'}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table></div>
    `}
  </div>`;
}

window.filterOrdersTable = function() {
  const status = document.getElementById('ord-filter-status').value;
  const q = (document.getElementById('ord-search').value || '').toLowerCase().trim();
  document.querySelectorAll('#orders-table tbody tr').forEach(tr => {
    const matchStatus = !status || tr.dataset.status === status;
    const matchSearch = !q || (tr.dataset.search || '').includes(q);
    tr.style.display = (matchStatus && matchSearch) ? '' : 'none';
  });
};

window.exportOrdersCsv = function() {
  const orders = window._ordersData || [];
  if (orders.length === 0) { showToast('Aucune commande à exporter', ''); return; }
  const header = ['Date', 'Email', 'Forfait', 'Montant (€)', 'Code promo', 'Réduction (€)', 'Statut', 'Session Stripe', 'Payment Intent'];
  const esc = (v) => { if (v == null) return ''; const s = String(v); return /[;"\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const lines = [header.join(';')];
  orders.forEach(o => lines.push([
    new Date(o.created_at).toLocaleString('fr-FR'),
    o.email, o.plan_name || o.plan_slug || '',
    ((o.amount_cents || 0) / 100).toFixed(2),
    o.promo_code || '',
    o.discount_cents ? (o.discount_cents / 100).toFixed(2) : '',
    o.status,
    o.stripe_session_id || '',
    o.stripe_payment_intent_id || '',
  ].map(esc).join(';')));
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `immersium-commandes-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('Export CSV téléchargé', 'success');
};

window.renderOrders = renderOrders;


/* ═══════════════════════════════════════════════════════════════════
   EXPORT / IMPORT JSON D'UNE SIMULATION
   Format miroir de la base : round-trip garanti.
   ═══════════════════════════════════════════════════════════════════ */

const IMM_JSON_VERSION = '1.0';

// ─── EXPORT ────────────────────────────────────────────────────
window.exportSimulationJson = async function(gameId) {
  const sb = window.IMM_SUPABASE;
  showToast(`Export de ${gameId.toUpperCase()} en cours…`, '');
  try {
    const [simRes, chalRes] = await Promise.all([
      sb.from('simulations').select('*').eq('game_id', gameId).single(),
      sb.from('challenges').select('*').eq('game_id', gameId)
        .order('challenge_num').order('question_index'),
    ]);
    if (simRes.error) throw simRes.error;
    if (chalRes.error) throw chalRes.error;

    const sim = simRes.data;
    const chal = chalRes.data || [];

    // Grouper les questions par challenge_num
    const byChallenge = {};
    chal.forEach(q => {
      const n = q.challenge_num;
      if (!byChallenge[n]) {
        byChallenge[n] = {
          challenge_num: n,
          challenge_title: q.challenge_title || '',
          session_name: q.session_name || '',
          questions: []
        };
      }
      const { id, game_id, challenge_num, challenge_title, session_name, created_at, updated_at, ...questionData } = q;
      byChallenge[n].questions.push(questionData);
    });

    const challenges = Object.values(byChallenge).sort((a, b) => a.challenge_num - b.challenge_num);
    const { created_at, updated_at, ...simData } = sim;

    const payload = {
      immersium_version: IMM_JSON_VERSION,
      exported_at: new Date().toISOString(),
      exported_by: window.IMM_USER?.email || 'unknown',
      simulation: simData,
      challenges
    };

    const filename = `immersium-${gameId}-${new Date().toISOString().slice(0,10)}.json`;
    downloadBlob(JSON.stringify(payload, null, 2), filename, 'application/json');
    const totalQuestions = challenges.reduce((t, c) => t + c.questions.length, 0);
    showToast(`${sim.name} exporté (${challenges.length} défis, ${totalQuestions} questions)`, 'success');
  } catch (e) {
    console.error('[EXPORT JSON]', e);
    showToast('Erreur export : ' + (e.message || e), 'error');
  }
};


// ─── IMPORT ────────────────────────────────────────────────────
window.openImportSimModal = function() {
  let overlay = document.getElementById('importSimOverlay');
  if (overlay) { overlay.hidden = false; return; }

  overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'importSimOverlay';
  overlay.innerHTML = `
    <div class="modal" style="max-width:680px">
      <div class="modal-h">
        <h3>Importer une simulation depuis un JSON</h3>
        <button class="modal-close" onclick="closeImportSimModal()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="modal-body" id="importSimBody">
        <div style="padding:14px 16px;background:var(--bg-alt);border-left:3px solid var(--marine);border-radius:var(--r-sm);margin-bottom:18px;font-size:12.5px;line-height:1.6;color:var(--ink-soft)">
          <strong style="color:var(--ink)">Format attendu</strong> : fichier JSON produit par le bouton "Export JSON" d'une simulation Immersium.<br>
          <strong style="color:var(--ink)">Si la simulation existe déjà</strong>, les défis manquants seront ajoutés. Les défis existants seront conservés tels quels (mode fusion).
        </div>
        <div class="form-group">
          <label class="form-label">Fichier JSON à importer</label>
          <input type="file" class="form-input" id="import-file" accept="application/json,.json" onchange="handleImportFile(event)">
        </div>
        <div id="import-preview"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeImportSimModal()">Annuler</button>
        <button class="btn btn-primary" id="import-confirm-btn" onclick="confirmImportSim()" disabled>Importer</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
};

window.closeImportSimModal = function() {
  const ov = document.getElementById('importSimOverlay');
  if (ov) ov.remove();
  window._importPayload = null;
};

window.handleImportFile = async function(event) {
  const file = event.target.files[0];
  const preview = document.getElementById('import-preview');
  const btn = document.getElementById('import-confirm-btn');
  preview.innerHTML = '';
  btn.disabled = true;
  window._importPayload = null;

  if (!file) return;

  try {
    const text = await file.text();
    const payload = JSON.parse(text);

    if (!payload.simulation || !payload.simulation.game_id) {
      throw new Error('Format invalide : il manque le bloc "simulation" avec game_id.');
    }
    if (!Array.isArray(payload.challenges)) {
      throw new Error('Format invalide : le champ "challenges" doit être un tableau.');
    }

    const sim = payload.simulation;
    const challenges = payload.challenges;
    const totalQuestions = challenges.reduce((t, c) => t + (c.questions?.length || 0), 0);

    const sb = window.IMM_SUPABASE;
    const { data: existing } = await sb.from('simulations').select('game_id,name').eq('game_id', sim.game_id).maybeSingle();

    let existingChalNums = [];
    if (existing) {
      const { data: existingChals } = await sb.from('challenges').select('challenge_num').eq('game_id', sim.game_id);
      existingChalNums = [...new Set((existingChals || []).map(c => c.challenge_num))];
    }

    const newChalNums = challenges.map(c => c.challenge_num).filter(n => !existingChalNums.includes(n));
    const skippedChalNums = challenges.map(c => c.challenge_num).filter(n => existingChalNums.includes(n));

    let notionsCount = 0;
    challenges.forEach(c => (c.questions || []).forEach(q => {
      if (Array.isArray(q.knowledge_notions)) notionsCount += q.knowledge_notions.length;
    }));

    window._importPayload = { payload, newChalNums, skippedChalNums, existing };

    preview.innerHTML = `
      <div style="margin-top:18px;padding:16px;border:1px solid var(--line);border-radius:var(--r-sm);background:var(--bg-alt)">
        <div style="font-size:11px;color:var(--ink-mute);text-transform:uppercase;letter-spacing:.05em;font-weight:600;margin-bottom:10px">Aperçu de l'import</div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
          <div><div style="font-size:11px;color:var(--ink-mute)">game_id</div><div style="font-family:var(--f-mono);font-size:13px;font-weight:600">${escapeHtml(sim.game_id)}</div></div>
          <div><div style="font-size:11px;color:var(--ink-mute)">Nom</div><div style="font-size:13px;font-weight:500">${escapeHtml(sim.name || '—')}</div></div>
          <div><div style="font-size:11px;color:var(--ink-mute)">Domaine</div><div style="font-size:13px">${escapeHtml(sim.domain || '—')}</div></div>
          <div><div style="font-size:11px;color:var(--ink-mute)">Tuteur</div><div style="font-size:13px">${escapeHtml(sim.tutor_name || '—')}</div></div>
        </div>

        <div style="display:flex;gap:20px;flex-wrap:wrap;padding-top:12px;border-top:1px solid var(--line);font-size:13px">
          <div><strong>${challenges.length}</strong> défi${challenges.length > 1 ? 's' : ''} dans le fichier</div>
          <div><strong>${totalQuestions}</strong> question${totalQuestions > 1 ? 's' : ''}</div>
          <div><strong>${notionsCount}</strong> notion${notionsCount > 1 ? 's' : ''} pédagogique${notionsCount > 1 ? 's' : ''}</div>
        </div>

        ${existing ? `
          <div style="margin-top:14px;padding:12px;background:#FEF6EE;border:1px solid #FED7AA;border-radius:var(--r-sm);font-size:12.5px;line-height:1.6">
            <strong style="color:#9A3412">Simulation existante détectée</strong> : <code>${escapeHtml(existing.game_id)}</code> (${escapeHtml(existing.name)})<br>
            <strong style="color:var(--jade)">${newChalNums.length}</strong> défi${newChalNums.length > 1 ? 's' : ''} à ajouter · <strong style="color:var(--ink-mute)">${skippedChalNums.length}</strong> défi${skippedChalNums.length > 1 ? 's' : ''} déjà présent${skippedChalNums.length > 1 ? 's' : ''} (ignoré${skippedChalNums.length > 1 ? 's' : ''})<br>
            ${newChalNums.length > 0 ? `Nouveaux : défis ${newChalNums.join(', ')}` : 'Aucun nouveau défi à ajouter.'}
            <div style="margin-top:8px;font-size:11px;color:var(--ink-mute)">La fiche simulation (nom, description, tuteur…) ne sera <strong>pas</strong> écrasée.</div>
          </div>
        ` : `
          <div style="margin-top:14px;padding:12px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:var(--r-sm);font-size:12.5px;color:#166534">
            <strong>Nouvelle simulation</strong> — sera créée de zéro avec ses ${challenges.length} défis.
          </div>
        `}
      </div>
    `;

    const hasWork = !existing || newChalNums.length > 0;
    document.getElementById('import-confirm-btn').disabled = !hasWork;
    if (!hasWork) {
      preview.innerHTML += `<div style="margin-top:10px;padding:10px;background:#FEF2F2;border:1px solid #FECACA;border-radius:var(--r-sm);font-size:12px;color:#991B1B">Aucune modification à faire — tous les défis sont déjà en base.</div>`;
    }

  } catch (e) {
    console.error('[IMPORT PARSE]', e);
    preview.innerHTML = `<div style="margin-top:16px;padding:14px;background:#FEF2F2;border:1px solid #FECACA;border-radius:var(--r-sm);color:#991B1B;font-size:13px">
      <strong>Fichier invalide</strong><br>${escapeHtml(e.message)}
    </div>`;
  }
};

window.confirmImportSim = async function() {
  const ctx = window._importPayload;
  if (!ctx) return;
  const { payload, newChalNums, existing } = ctx;
  const sb = window.IMM_SUPABASE;
  const btn = document.getElementById('import-confirm-btn');
  btn.disabled = true;
  btn.textContent = 'Import en cours…';

  try {
    const sim = payload.simulation;

    if (!existing) {
      const simPayload = { ...sim };
      delete simPayload.created_at;
      delete simPayload.updated_at;
      const { error: simErr } = await sb.from('simulations').insert([simPayload]);
      if (simErr) throw new Error('Création simulation : ' + simErr.message);
    }

    const rowsToInsert = [];
    (payload.challenges || []).forEach(c => {
      if (!newChalNums.includes(c.challenge_num)) return;
      (c.questions || []).forEach((q, qIdx) => {
        rowsToInsert.push({
          game_id: sim.game_id,
          challenge_num: c.challenge_num,
          challenge_title: c.challenge_title || null,
          session_name: c.session_name || null,
          question_index: q.question_index ?? qIdx,
          type: q.type || 'open',
          question: q.question || null,
          prompt: q.prompt || null,
          options: q.options || null,
          correct_answer: q.correct_answer ?? null,
          points: q.points ?? 10,
          active: q.active !== false,
          knowledge_notions: q.knowledge_notions || null,
          knowledge_base: q.knowledge_base || null,
          comm_before: q.comm_before || null,
          comm_after: q.comm_after || null,
          feedback_correct: q.feedback_correct || null,
          feedback_wrong: q.feedback_wrong || null,
          retain: q.retain || null,
        });
      });
    });

    if (rowsToInsert.length > 0) {
      for (let i = 0; i < rowsToInsert.length; i += 50) {
        const batch = rowsToInsert.slice(i, i + 50);
        const { error: chErr } = await sb.from('challenges').insert(batch);
        if (chErr) throw new Error(`Insert défis (batch ${i}) : ${chErr.message}`);
      }
    }

    const nbDefisAjoutes = newChalNums.length;
    const nbQuestionsAjoutees = rowsToInsert.length;
    let msg;
    if (!existing) {
      msg = `${sim.name} créé (${nbDefisAjoutes} défis, ${nbQuestionsAjoutees} questions)`;
    } else if (nbDefisAjoutes === 0) {
      msg = 'Rien à importer';
    } else {
      msg = `${nbDefisAjoutes} défi${nbDefisAjoutes > 1 ? 's' : ''} ajouté${nbDefisAjoutes > 1 ? 's' : ''} à ${existing.name} (${nbQuestionsAjoutees} questions)`;
    }
    showToast(msg, 'success');
    closeImportSimModal();
    renderSimulations(document.getElementById('pageArea'));
  } catch (e) {
    console.error('[IMPORT]', e);
    showToast('Erreur import : ' + (e.message || e), 'error');
    btn.disabled = false;
    btn.textContent = 'Réessayer';
  }
};


/* ── Export to global ──────────────────────────────────── */
window.navigate = navigate;
window.showToast = showToast;

/* ── Init ───────────────────────────────────────────────── */
(function init() {
  const hash = location.hash.replace('#', '');
  navigate(PAGES[hash] ? hash : 'dashboard');
})();
