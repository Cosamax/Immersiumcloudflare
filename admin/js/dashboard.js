/* ══════════════════════════════════════════════════════
   IMMERSIUM ADMIN — Dashboard JS unifié
   Navigation par onglets + sous-onglets
   Contenu extrait fidèlement des fichiers HTML d'origine
══════════════════════════════════════════════════════ */

/* ─────────── CONFIG ONGLETS ─────────── */
const TABS = {
  dashboard: {
    label: 'Tableau de bord',
    subtabs: null // pas de sous-onglets
  },
  utilisateurs: {
    label: 'Utilisateurs',
    subtabs: [
      { id: 'users',       label: 'Tous les utilisateurs', icon: usersIco() },
      { id: 'formateurs',  label: 'Formateurs',            icon: personIco() },
      { id: 'apprenants',  label: 'Apprenants',            icon: graduateIco() },
    ]
  },
  formation: {
    label: 'Formation',
    subtabs: [
      { id: 'sessions',  label: 'Sessions coaching', icon: calIco() },
      { id: 'results',   label: 'Résultats & scores', icon: chartIco() },
      { id: 'demandes',  label: 'Demandes formation', icon: fileIco() },
    ]
  },
  contenu: {
    label: 'Contenu',
    subtabs: [
      { id: 'editor',      label: 'Jeux & Formations', icon: editIco() },
      { id: 'simulations', label: 'Config simulations', icon: monitorIco() },
      { id: 'hero',        label: "Page d'accueil",     icon: imgIco() },
      { id: 'vedettes',    label: 'Vedettes accueil',   icon: starIco() },
      { id: 'pages',       label: 'Pages du site',      icon: pageIco() },
      { id: 'faq',         label: 'FAQ',                icon: helpIco() },
      { id: 'tarifs',      label: 'Tarifs & Plans',     icon: priceIco() },
      { id: 'coaching',    label: 'Coaches',            icon: coachIco() },
    ]
  },
  commercial: {
    label: 'Commercial',
    subtabs: [
      { id: 'promotions', label: 'Promotions & Accès', icon: promoIco() },
    ]
  },
  systeme: {
    label: 'Système',
    subtabs: [
      { id: 'stats',  label: 'Statistiques',  icon: statsIco() },
      { id: 'access', label: 'Accès & API',   icon: keyIco() },
      { id: 'export', label: 'Exporter',      icon: dlIco() },
    ]
  }
};

/* ─────────── ÉTAT ─────────── */
let currentTab    = 'dashboard';
let currentSubtab = null;
let supabase      = null;

/* ─────────── ICONES SVG ─────────── */
function usersIco()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`; }
function personIco()   { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`; }
function graduateIco() { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2.21 2.686 4 6 4s6-1.79 6-4v-5"/></svg>`; }
function calIco()      { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg>`; }
function chartIco()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z"/><path d="M9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625z"/><path d="M16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>`; }
function fileIco()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`; }
function editIco()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`; }
function monitorIco()  { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`; }
function imgIco()      { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`; }
function starIco()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`; }
function pageIco()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg>`; }
function helpIco()     { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`; }
function priceIco()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>`; }
function coachIco()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>`; }
function promoIco()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 14l6-6"/><circle cx="9.5" cy="9.5" r="1.5"/><circle cx="14.5" cy="14.5" r="1.5"/><rect x="2" y="2" width="20" height="20" rx="2.18"/></svg>`; }
function statsIco()    { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>`; }
function keyIco()      { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/></svg>`; }
function dlIco()       { return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>`; }

/* ─────────── UTILS ─────────── */
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function initials(name) {
  return (name||'?').trim().split(' ').map(w=>w[0]||'').join('').toUpperCase().slice(0,2)||'?';
}
function showToast(msg, type='') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'dsh-toast show ' + type;
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.className = 'dsh-toast'; }, 3200);
}
function setContent(html) {
  const el = document.getElementById('dshContent');
  el.style.opacity = '0';
  setTimeout(() => {
    el.innerHTML = html;
    el.style.transition = 'opacity .2s';
    el.style.opacity = '1';
    // ré-injecter les scripts inline si présents
    el.querySelectorAll('script').forEach(s => {
      const ns = document.createElement('script');
      ns.textContent = s.textContent;
      s.replaceWith(ns);
    });
  }, 80);
}
function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' });
}
function barRow(label, val, max) {
  const pct = max ? Math.round(val/max*100) : 0;
  return `<div class="stat-row">
    <div class="stat-label">${esc(label)}</div>
    <div style="flex:1;margin:0 12px"><div class="progress-wrap"><div class="progress-fill" style="width:${pct}%"></div></div></div>
    <div class="stat-value">${val}</div>
  </div>`;
}

/* ─────────── NAVIGATION ─────────── */
function navigate(tabId, subtabId) {
  currentTab = tabId;
  const tabCfg = TABS[tabId];

  // Sous-onglet par défaut
  if (!subtabId && tabCfg.subtabs && tabCfg.subtabs.length) {
    subtabId = tabCfg.subtabs[0].id;
  }
  currentSubtab = subtabId || null;

  // MAJ onglets principaux
  document.querySelectorAll('.mtab').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tabId);
  });

  // MAJ sous-onglets
  renderSubtabs(tabCfg, subtabId);

  // Render page
  renderPage(tabId, subtabId);

  // MAJ mobile nav
  renderMobileNav(tabId, subtabId);

  // Fermer le drawer
  closeMobileDrawer();
}

function renderSubtabs(tabCfg, activeSubtab) {
  const bar = document.getElementById('subtabBar');
  if (!tabCfg.subtabs) {
    bar.classList.add('hidden');
    return;
  }
  bar.classList.remove('hidden');
  bar.innerHTML = tabCfg.subtabs.map(st => `
    <button class="stab${st.id === activeSubtab ? ' active' : ''}" data-subtab="${st.id}">
      ${st.icon}${esc(st.label)}
    </button>
  `).join('');
  bar.querySelectorAll('.stab').forEach(btn => {
    btn.addEventListener('click', () => navigate(currentTab, btn.dataset.subtab));
  });
}

/* ─────────── PAGES RENDERERS ─────────── */
function renderPage(tab, subtab) {
  const key = subtab || tab;
  const renderer = PAGES[key];
  if (renderer) {
    setContent('<div class="loading-screen"><div class="loading-spinner"></div><p>Chargement…</p></div>');
    setTimeout(() => {
      setContent(renderer());
      // appeler le loader de données si dispo
      if (LOADERS[key]) {
        setTimeout(() => LOADERS[key](), 150);
      }
    }, 60);
  } else {
    setContent(`<div class="empty-state"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg><h3>En construction</h3><p>Cette section sera disponible prochainement.</p></div>`);
  }
}

/* ════════════════════════════════════════════
   PAGES CONTENT
════════════════════════════════════════════ */
const PAGES = {};
const LOADERS = {};

/* ── DASHBOARD ── */
PAGES.dashboard = () => `
<div class="page-h">
  <div class="page-h-left">
    <h1>Tableau de <em>bord</em></h1>
    <p>Vue d'ensemble de la plateforme Immersium. ${new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
  </div>
</div>

<div class="kpi-grid">
  <div class="kpi accent"><div class="value" id="kpi-users">—</div><div class="label">Utilisateurs inscrits</div></div>
  <div class="kpi success"><div class="value" id="kpi-sessions">—</div><div class="label">Sessions actives</div></div>
  <div class="kpi warn"><div class="value" id="kpi-pending">—</div><div class="label">Demandes en attente</div></div>
  <div class="kpi"><div class="value">15</div><div class="label">Simulations actives</div></div>
</div>

<div class="grid-2" style="margin-bottom:20px">
  <div class="card">
    <div class="card-h"><h2>Accès <em>rapides</em></h2></div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${[
        ['rgba(2,74,255,.1)','var(--marine)',usersIco(),'Gérer les utilisateurs','Comptes, rôles, accès','utilisateurs','users'],
        ['rgba(13,148,136,.1)','var(--jade)',calIco(),'Sessions coaching','Confirmer, planifier','formation','sessions'],
        ['rgba(255,107,0,.1)','var(--orange)',imgIco(),"Éditer la page d'accueil",'Slider, bannière','contenu','hero'],
        ['rgba(204,0,51,.1)','var(--coral)',promoIco(),'Promotions & accès','Codes promo, accès gratuits','commercial','promotions'],
      ].map(([bg,stroke,ico,lbl,sub,tab,st])=>`
        <div class="quick-link" onclick="navigate('${tab}','${st}')" style="cursor:pointer">
          <div class="ico" style="background:${bg}">${ico.replace('currentColor',stroke)}</div>
          <div><div class="lbl">${lbl}</div><div class="sub">${sub}</div></div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="card">
    <div class="card-h">
      <h2>Dernières <em>sessions</em></h2>
      <button class="btn sm" onclick="navigate('formation','sessions')">Voir tout</button>
    </div>
    <div id="recent-sessions-loading" style="text-align:center;padding:30px;color:var(--ink-mute);font-size:13px">Chargement…</div>
    <div class="table-wrap" id="recent-sessions-table" style="display:none">
      <table><thead><tr><th>Apprenant</th><th>Forfait</th><th>Statut</th></tr></thead>
      <tbody id="recent-sessions-tbody"></tbody></table>
    </div>
    <div id="recent-sessions-empty" class="empty-state" style="display:none;padding:30px">
      <p>Aucune session pour l'instant.</p>
    </div>
  </div>
</div>

<div class="card">
  <div class="card-h"><h2>Navigation <em>rapide</em> — toutes les sections</h2></div>
  <div class="quick-links">
    ${[
      ['rgba(2,74,255,.1)','var(--marine)',personIco(),'Formateurs','Profils, disponibilités','utilisateurs','formateurs'],
      ['rgba(13,148,136,.1)','var(--jade)',graduateIco(),'Apprenants','Progression, scores','utilisateurs','apprenants'],
      ['rgba(255,107,0,.1)','var(--orange)',chartIco(),'Résultats','Scores et certifications','formation','results'],
      ['rgba(14,26,43,.07)','var(--ink)',monitorIco(),'Simulations','Config, couleurs, niveaux','contenu','simulations'],
      ['rgba(2,74,255,.1)','var(--marine)',editIco(),'Éditeur de jeux','Défis, questions, scénarios','contenu','editor'],
      ['rgba(255,107,0,.1)','var(--orange)',starIco(),'Vedettes','Simulations mises en avant','contenu','vedettes'],
      ['rgba(14,26,43,.07)','var(--ink)',pageIco(),'Pages du site','CMS, FAQ, CGV…','contenu','pages'],
      ['rgba(2,74,255,.1)','var(--marine)',helpIco(),'FAQ','Questions fréquentes','contenu','faq'],
      ['rgba(13,148,136,.1)','var(--jade)',priceIco(),'Tarifs & Plans','Plans, fonctionnalités','contenu','tarifs'],
      ['rgba(255,107,0,.1)','var(--orange)',coachIco(),'Coaches','Profils coaching','contenu','coaching'],
      ['rgba(13,148,136,.1)','var(--jade)',statsIco(),'Statistiques','Audience, conversions','systeme','stats'],
      ['rgba(14,26,43,.07)','var(--ink)',dlIco(),'Export données','CSV, JSON','systeme','export'],
      ['rgba(204,0,51,.1)','var(--coral)',fileIco(),'Demandes formation','Inscriptions, devis','formation','demandes'],
      ['rgba(2,74,255,.1)','var(--marine)',keyIco(),'Accès & API','Clés, webhooks','systeme','access'],
    ].map(([bg,stroke,ico,lbl,sub,tab,st])=>`
      <div class="quick-link" onclick="navigate('${tab}','${st}')" style="cursor:pointer">
        <div class="ico" style="background:${bg}">${ico.replace('currentColor',stroke)}</div>
        <div><div class="lbl">${lbl}</div><div class="sub">${sub}</div></div>
      </div>
    `).join('')}
  </div>
</div>`;

LOADERS.dashboard = async () => {
  if (!supabase) return;
  try {
    const [usersRes, sessRes] = await Promise.all([
      supabase.from('profiles').select('id',{count:'exact',head:true}),
      supabase.from('coaching_sessions').select('id,learner_name,plan,status').order('created_at',{ascending:false}).limit(5)
    ]);
    const el = id => document.getElementById(id);
    if (el('kpi-users')) el('kpi-users').textContent = usersRes.count ?? '—';
    const sess = sessRes.data || [];
    if (el('kpi-sessions')) el('kpi-sessions').textContent = sess.filter(s=>s.status==='confirmed').length;
    if (el('kpi-pending'))  el('kpi-pending').textContent  = sess.filter(s=>s.status==='pending').length;

    if (el('recent-sessions-loading')) el('recent-sessions-loading').style.display='none';
    if (!sess.length) { if(el('recent-sessions-empty')) el('recent-sessions-empty').style.display=''; return; }
    if (el('recent-sessions-table')) el('recent-sessions-table').style.display='';
    const planL={decouverte:'Découverte',mensuel:'Pack mensuel',intensif:'Intensif'};
    const statL={pending:'En attente',confirmed:'Confirmée',completed:'Terminée',cancelled:'Annulée'};
    const statC={pending:'pending',confirmed:'confirmed',completed:'completed',cancelled:'cancelled'};
    if (el('recent-sessions-tbody')) el('recent-sessions-tbody').innerHTML = sess.map(s=>
      `<tr><td>${esc(s.learner_name)}</td><td>${planL[s.plan]||s.plan}</td><td><span class="badge ${statC[s.status]||''}">${statL[s.status]||s.status}</span></td></tr>`
    ).join('');
  } catch(e) { console.warn('Dashboard load:', e); }
};

/* ── USERS ── */
PAGES.users = () => `
<div class="page-h">
  <div class="page-h-left">
    <h1>Gestion des <em>utilisateurs</em></h1>
    <p>Tous les comptes inscrits sur la plateforme Immersium.</p>
  </div>
  <button class="btn primary" onclick="openUserModal()">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    Nouvel utilisateur
  </button>
</div>
<div class="kpi-grid">
  <div class="kpi"><div class="value" id="kpi-total">—</div><div class="label">Total comptes</div></div>
  <div class="kpi"><div class="value" id="kpi-admins">—</div><div class="label">Administrateurs</div></div>
  <div class="kpi"><div class="value" id="kpi-recent">—</div><div class="label">Inscrits ce mois</div></div>
</div>
<div class="card">
  <div class="filter-bar">
    <select id="filter-role" onchange="usersApplyFilters()">
      <option value="">Tous les rôles</option>
      <option value="admin">Administrateurs</option>
      <option value="user">Utilisateurs</option>
    </select>
    <input type="text" id="filter-search" placeholder="Rechercher par nom…" oninput="usersApplyFilters()">
  </div>
  <div id="users-loading" style="text-align:center;padding:40px;color:var(--ink-mute)">Chargement…</div>
  <div class="table-wrap" id="users-table" style="display:none">
    <table>
      <thead><tr><th>Utilisateur</th><th>Plan</th><th>Rôle</th><th>Inscrit le</th><th>Actions</th></tr></thead>
      <tbody id="users-tbody"></tbody>
    </table>
  </div>
  <div id="users-empty" class="empty-state" style="display:none"><h3>Aucun utilisateur</h3><p>Les comptes inscrits apparaîtront ici.</p></div>
</div>

<div class="modal-overlay" id="user-modal" onclick="if(event.target===this)closeUserModal()">
  <div class="modal">
    <h2 id="user-modal-title">Nouvel <em>utilisateur</em></h2>
    <input type="hidden" id="u-id">
    <div class="form-row"><label>Nom complet</label><input type="text" id="u-name" placeholder="Prénom Nom"></div>
    <div class="form-row"><label>Organisation</label><input type="text" id="u-org" placeholder="Entreprise…"></div>
    <div class="form-row"><label>Plan</label><input type="text" id="u-plan" placeholder="free, pro, entreprise…"></div>
    <div class="form-row"><label>Rôle</label>
      <select id="u-role"><option value="user">Utilisateur</option><option value="admin">Administrateur</option></select>
    </div>
    <div class="modal-actions">
      <button class="btn" onclick="closeUserModal()">Annuler</button>
      <button class="btn primary" onclick="saveUser()">Enregistrer</button>
    </div>
  </div>
</div>`;

let _allUsers = [];
LOADERS.users = async () => {
  if (!supabase) { document.getElementById('users-loading').style.display='none'; document.getElementById('users-empty').style.display=''; return; }
  try {
    const res = await supabase.from('profiles').select('*').order('created_at',{ascending:false});
    document.getElementById('users-loading').style.display='none';
    _allUsers = res.data || [];
    const thisMonth = new Date(); thisMonth.setDate(1); thisMonth.setHours(0,0,0,0);
    document.getElementById('kpi-total').textContent  = _allUsers.length;
    document.getElementById('kpi-admins').textContent = _allUsers.filter(u=>u.role==='admin').length;
    document.getElementById('kpi-recent').textContent = _allUsers.filter(u=>u.created_at&&new Date(u.created_at)>=thisMonth).length;
    _renderUsersTable(_allUsers);
  } catch(e) { console.warn(e); }
};
function _renderUsersTable(data) {
  const tbody = document.getElementById('users-tbody');
  const table = document.getElementById('users-table');
  const empty = document.getElementById('users-empty');
  if (!tbody) return;
  if (!data.length) { table.style.display='none'; empty.style.display=''; return; }
  table.style.display=''; empty.style.display='none';
  tbody.innerHTML = data.map(u => {
    const name = (u.full_name||'').trim()||'—';
    const org = u.organization ? `<div style="font-size:11px;color:var(--ink-mute)">${esc(u.organization)}</div>` : '';
    const plan = u.plan ? `<span class="badge ${u.plan}">${esc(u.plan)}</span>` : '—';
    return `<tr>
      <td data-label="Utilisateur"><div style="display:flex;align-items:center;gap:10px"><div class="av-sm">${initials(name)}</div><div><div style="font-weight:600">${esc(name)}</div>${org}</div></div></td>
      <td data-label="Plan">${plan}</td>
      <td data-label="Rôle"><span class="badge ${u.role||'user'}">${u.role||'user'}</span></td>
      <td data-label="Inscrit le">${fmtDate(u.created_at)}</td>
      <td data-label="Actions"><button class="btn sm" onclick="editUser('${u.id}')">Modifier</button></td>
    </tr>`;
  }).join('');
}
window.usersApplyFilters = function() {
  const role = document.getElementById('filter-role')?.value;
  const search = (document.getElementById('filter-search')?.value||'').toLowerCase();
  const filtered = _allUsers.filter(u => {
    if (role && u.role !== role) return false;
    if (search && !(u.full_name||'').toLowerCase().includes(search) && !(u.organization||'').toLowerCase().includes(search)) return false;
    return true;
  });
  _renderUsersTable(filtered);
};
window.openUserModal = function() {
  document.getElementById('user-modal-title').innerHTML = 'Nouvel <em>utilisateur</em>';
  ['u-id','u-name','u-org','u-plan'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('u-role').value='user';
  document.getElementById('user-modal').classList.add('open');
};
window.editUser = function(id) {
  const u = _allUsers.find(x=>x.id===id); if(!u) return;
  document.getElementById('user-modal-title').innerHTML = "Modifier l'<em>utilisateur</em>";
  document.getElementById('u-id').value   = u.id;
  document.getElementById('u-name').value = u.full_name||'';
  document.getElementById('u-org').value  = u.organization||'';
  document.getElementById('u-plan').value = u.plan||'';
  document.getElementById('u-role').value = u.role||'user';
  document.getElementById('user-modal').classList.add('open');
};
window.closeUserModal = function() { document.getElementById('user-modal')?.classList.remove('open'); };
window.saveUser = async function() {
  if (!supabase) { showToast('Connexion non disponible','error'); return; }
  const id = document.getElementById('u-id').value;
  const payload = { full_name: document.getElementById('u-name').value.trim(), organization: document.getElementById('u-org').value.trim(), plan: document.getElementById('u-plan').value.trim()||null, role: document.getElementById('u-role').value, updated_at: new Date().toISOString() };
  const res = id ? await supabase.from('profiles').update(payload).eq('id',id) : null;
  if (!res) { showToast('Créer un compte nécessite l\'invitation Supabase Auth','warn'); return; }
  if (res.error) { showToast('Erreur : '+res.error.message,'error'); return; }
  showToast('Utilisateur mis à jour','success');
  closeUserModal();
  LOADERS.users();
};

/* ── FORMATEURS ── */
PAGES.formateurs = () => `
<div class="page-h">
  <div class="page-h-left">
    <h1>Gestion des <em>formateurs</em></h1>
    <p>Coachs et intervenants disponibles pour les sessions de coaching.</p>
  </div>
  <button class="btn primary" onclick="openCoachModal()">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    Nouveau formateur
  </button>
</div>
<div class="kpi-grid">
  <div class="kpi"><div class="value" id="kpi-total">—</div><div class="label">Formateurs inscrits</div></div>
  <div class="kpi success"><div class="value" id="kpi-active">—</div><div class="label">Actifs</div></div>
  <div class="kpi accent"><div class="value" id="kpi-sessions">—</div><div class="label">Sessions ce mois</div></div>
</div>
<div id="coaches-loading" style="text-align:center;padding:60px;color:var(--ink-mute)">Chargement…</div>
<div id="coaches-grid" class="coaches-grid" style="display:none"></div>
<div id="coaches-empty" class="empty-state" style="display:none">
  <h3>Aucun formateur</h3><p>Ajoutez des coachs pour les rendre disponibles lors des réservations.</p>
  <button class="btn primary" onclick="openCoachModal()" style="margin-top:16px">Ajouter un formateur</button>
</div>

<div class="modal-overlay" id="coach-modal" onclick="if(event.target===this)closeCoachModal()">
  <div class="modal">
    <h2 id="coach-modal-title">Nouveau <em>formateur</em></h2>
    <input type="hidden" id="c-id">
    <div class="form-row"><label>Nom complet</label><input type="text" id="c-name" placeholder="Prénom Nom"></div>
    <div class="form-row"><label>Email</label><input type="email" id="c-email" placeholder="email@exemple.com"></div>
    <div class="form-row"><label>Spécialité</label><input type="text" id="c-specialty" placeholder="Commerce, Management…"></div>
    <div class="form-row"><label>Bio courte</label><textarea id="c-bio" rows="3" placeholder="Quelques mots sur le formateur…"></textarea></div>
    <div class="form-row"><label>Statut</label><select id="c-active"><option value="true">Actif</option><option value="false">Inactif</option></select></div>
    <div class="modal-actions">
      <button class="btn" onclick="closeCoachModal()">Annuler</button>
      <button class="btn primary" onclick="saveCoach()">Enregistrer</button>
    </div>
  </div>
</div>`;

let _allCoaches = [];
LOADERS.formateurs = async () => {
  if (!supabase) { document.getElementById('coaches-loading').style.display='none'; document.getElementById('coaches-empty').style.display=''; return; }
  try {
    const [coachRes, sessRes] = await Promise.all([
      supabase.from('coaching_coaches').select('*').order('sort_order'),
      supabase.from('coaching_sessions').select('coach_id,created_at')
    ]);
    document.getElementById('coaches-loading').style.display='none';
    _allCoaches = coachRes.data||[];
    document.getElementById('kpi-total').textContent  = _allCoaches.length;
    document.getElementById('kpi-active').textContent = _allCoaches.filter(c=>c.active).length;
    const thisMonth = new Date(); thisMonth.setDate(1); thisMonth.setHours(0,0,0,0);
    document.getElementById('kpi-sessions').textContent = (sessRes.data||[]).filter(s=>s.created_at&&new Date(s.created_at)>=thisMonth).length;
    _renderCoaches(_allCoaches);
  } catch(e) { console.warn(e); }
};
function _renderCoaches(data) {
  const grid=document.getElementById('coaches-grid'), empty=document.getElementById('coaches-empty');
  if (!grid) return;
  if (!data.length) { grid.style.display='none'; empty.style.display=''; return; }
  grid.style.display=''; empty.style.display='none';
  grid.innerHTML = data.map(c => `
    <div class="coach-card">
      <div class="av">${initials(c.name)}</div>
      <div class="name">${esc(c.name)}</div>
      ${c.specialty ? `<div class="specialty">${esc(c.specialty)}</div>` : ''}
      ${c.bio ? `<div class="bio">${esc(c.bio)}</div>` : ''}
      <span class="badge ${c.active?'active':'inactive'}">${c.active?'Actif':'Inactif'}</span>
      <div class="actions"><button class="btn sm" onclick="editCoach('${c.id}')">Modifier</button></div>
    </div>`).join('');
}
window.openCoachModal = function() {
  document.getElementById('coach-modal-title').innerHTML='Nouveau <em>formateur</em>';
  ['c-id','c-name','c-email','c-specialty','c-bio'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('c-active').value='true';
  document.getElementById('coach-modal').classList.add('open');
};
window.editCoach = function(id) {
  const c=_allCoaches.find(x=>x.id===id); if(!c) return;
  document.getElementById('coach-modal-title').innerHTML='Modifier le <em>formateur</em>';
  document.getElementById('c-id').value=c.id;
  document.getElementById('c-name').value=c.name||'';
  document.getElementById('c-email').value=c.email||'';
  document.getElementById('c-specialty').value=c.specialty||'';
  document.getElementById('c-bio').value=c.bio||'';
  document.getElementById('c-active').value=c.active?'true':'false';
  document.getElementById('coach-modal').classList.add('open');
};
window.closeCoachModal = function() { document.getElementById('coach-modal')?.classList.remove('open'); };
window.saveCoach = async function() {
  if (!supabase) { showToast('Connexion non disponible','error'); return; }
  const id=document.getElementById('c-id').value;
  const name=document.getElementById('c-name').value.trim();
  if (!name) { showToast('Le nom est requis','error'); return; }
  const payload={name,email:document.getElementById('c-email').value.trim()||null,specialty:document.getElementById('c-specialty').value.trim()||null,bio:document.getElementById('c-bio').value.trim()||null,active:document.getElementById('c-active').value==='true'};
  const res=id?await supabase.from('coaching_coaches').update(payload).eq('id',id):await supabase.from('coaching_coaches').insert(payload);
  if(res.error){showToast('Erreur : '+res.error.message,'error');return;}
  showToast(id?'Formateur mis à jour':'Formateur ajouté','success');
  closeCoachModal(); LOADERS.formateurs();
};

/* ── APPRENANTS ── */
PAGES.apprenants = () => `
<div class="page-h">
  <div class="page-h-left">
    <h1>Suivi des <em>apprenants</em></h1>
    <p>Progression, scores et avancement dans les simulations.</p>
  </div>
</div>
<div class="kpi-grid">
  <div class="kpi"><div class="value" id="kpi-total">—</div><div class="label">Apprenants actifs</div></div>
  <div class="kpi success"><div class="value" id="kpi-completed">—</div><div class="label">Simulations terminées</div></div>
  <div class="kpi accent"><div class="value" id="kpi-avg">—</div><div class="label">Score moyen</div></div>
</div>
<div class="card">
  <div class="filter-bar">
    <input type="text" id="learner-search" placeholder="Rechercher un apprenant…" oninput="learnersFilter()">
  </div>
  <div id="learners-loading" style="text-align:center;padding:40px;color:var(--ink-mute)">Chargement…</div>
  <div class="table-wrap" id="learners-table" style="display:none">
    <table>
      <thead><tr><th>Apprenant</th><th>Simulations jouées</th><th>Terminées</th><th>Score total</th><th>Progression</th></tr></thead>
      <tbody id="learners-tbody"></tbody>
    </table>
  </div>
  <div id="learners-empty" class="empty-state" style="display:none"><h3>Aucune donnée</h3><p>Les données de progression apparaîtront ici.</p></div>
</div>`;

let _allLearners = [];
LOADERS.apprenants = async () => {
  if (!supabase) { document.getElementById('learners-loading').style.display='none'; document.getElementById('learners-empty').style.display=''; return; }
  try {
    const [profRes, progRes] = await Promise.all([
      supabase.from('profiles').select('id,full_name,organization,plan'),
      supabase.from('user_progress').select('user_id,score,completed')
    ]);
    document.getElementById('learners-loading').style.display='none';
    const profiles = profRes.data||[], progress = progRes.data||[];
    const byUser = {};
    progress.forEach(p => { if(!byUser[p.user_id]) byUser[p.user_id]={played:0,completed:0,score:0}; byUser[p.user_id].played++; if(p.completed) byUser[p.user_id].completed++; byUser[p.user_id].score+=(p.score||0); });
    _allLearners = profiles.map(pr => { const s=byUser[pr.id]||{played:0,completed:0,score:0}; return {id:pr.id,name:(pr.full_name||'').trim()||'—',organization:pr.organization||'—',plan:pr.plan||'',played:s.played,completed:s.completed,score:s.score}; }).filter(u=>u.played>0);
    document.getElementById('kpi-total').textContent    = _allLearners.length;
    document.getElementById('kpi-completed').textContent = _allLearners.reduce((a,u)=>a+u.completed,0);
    const scores = _allLearners.filter(u=>u.score>0).map(u=>u.score);
    document.getElementById('kpi-avg').textContent = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : '—';
    _renderLearners(_allLearners);
  } catch(e) { console.warn(e); }
};
function _renderLearners(data) {
  const tbody=document.getElementById('learners-tbody'), table=document.getElementById('learners-table'), empty=document.getElementById('learners-empty');
  if(!tbody) return;
  if(!data.length){table.style.display='none';empty.style.display='';return;}
  table.style.display='';empty.style.display='none';
  tbody.innerHTML=data.map(u=>{
    const pct=Math.round((u.completed/Math.max(u.played,1))*100);
    return `<tr>
      <td><div style="font-weight:600">${esc(u.name)}</div><div style="font-size:11px;color:var(--ink-mute)">${esc(u.organization)}${u.plan?' · <strong>'+esc(u.plan)+'</strong>':''}</div></td>
      <td>${u.played}</td><td>${u.completed}</td>
      <td><strong>${u.score}</strong> pts</td>
      <td style="min-width:140px"><div style="display:flex;align-items:center;gap:8px"><div class="progress-wrap" style="flex:1"><div class="progress-fill" style="width:${pct}%"></div></div><span style="font-size:12px;color:var(--ink-mute)">${pct}%</span></div></td>
    </tr>`;
  }).join('');
}
window.learnersFilter = function() {
  const q=(document.getElementById('learner-search')?.value||'').toLowerCase();
  _renderLearners(_allLearners.filter(u=>!q||u.name.toLowerCase().includes(q)||u.organization.toLowerCase().includes(q)));
};

/* ── SESSIONS ── */
PAGES.sessions = () => `
<div class="page-h">
  <div class="page-h-left">
    <h1>Sessions de <em>coaching</em></h1>
    <p>Gérez les demandes de session, les confirmations et le suivi des coachings.</p>
  </div>
  <button class="btn primary" onclick="openSessionModal()">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    Nouvelle session
  </button>
</div>
<div class="kpi-grid">
  <div class="kpi"><div class="value" id="kpi-total">—</div><div class="label">Total demandes</div></div>
  <div class="kpi warn"><div class="value" id="kpi-pending">—</div><div class="label">En attente</div></div>
  <div class="kpi success"><div class="value" id="kpi-confirmed">—</div><div class="label">Confirmées</div></div>
  <div class="kpi accent"><div class="value" id="kpi-completed">—</div><div class="label">Terminées</div></div>
</div>
<div class="card">
  <div class="filter-bar">
    <select id="sess-status" onchange="sessFilter()"><option value="">Tous les statuts</option><option value="pending">En attente</option><option value="confirmed">Confirmées</option><option value="completed">Terminées</option><option value="cancelled">Annulées</option></select>
    <select id="sess-coach" onchange="sessFilter()"><option value="">Tous les coachs</option></select>
    <select id="sess-plan" onchange="sessFilter()"><option value="">Tous les forfaits</option><option value="decouverte">Découverte</option><option value="mensuel">Pack mensuel</option><option value="intensif">Intensif</option></select>
    <input type="text" id="sess-search" placeholder="Rechercher un apprenant…" oninput="sessFilter()">
  </div>
  <div id="sess-loading" style="text-align:center;padding:40px;color:var(--ink-mute)">Chargement…</div>
  <div class="table-wrap" id="sess-table" style="display:none">
    <table>
      <thead><tr><th>Apprenant</th><th>Coach</th><th>Forfait</th><th>Date prévue</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody id="sess-tbody"></tbody>
    </table>
  </div>
  <div id="sess-empty" class="empty-state" style="display:none"><h3>Aucune session</h3><p>Les demandes de coaching apparaîtront ici.</p></div>
</div>

<div class="modal-overlay" id="sess-modal" onclick="if(event.target===this)closeSessionModal()">
  <div class="modal">
    <h2 id="sess-modal-title">Nouvelle <em>session</em></h2>
    <input type="hidden" id="s-id">
    <div class="form-row"><label>Nom apprenant</label><input type="text" id="s-learner" placeholder="Prénom Nom"></div>
    <div class="form-row"><label>Email apprenant</label><input type="email" id="s-email" placeholder="email@exemple.com"></div>
    <div class="form-row"><label>Forfait</label><select id="s-plan"><option value="decouverte">Découverte</option><option value="mensuel">Pack mensuel</option><option value="intensif">Intensif</option></select></div>
    <div class="form-row"><label>Coach</label><select id="s-coach"><option value="">Sélectionner un coach</option></select></div>
    <div class="form-row"><label>Date/heure prévue</label><input type="datetime-local" id="s-date"></div>
    <div class="form-row"><label>Notes</label><textarea id="s-notes" rows="3" placeholder="Objectifs, remarques…"></textarea></div>
    <div class="form-row"><label>Statut</label><select id="s-status"><option value="pending">En attente</option><option value="confirmed">Confirmée</option><option value="completed">Terminée</option><option value="cancelled">Annulée</option></select></div>
    <div class="modal-actions">
      <button class="btn" onclick="closeSessionModal()">Annuler</button>
      <button class="btn primary" onclick="saveSession()">Enregistrer</button>
    </div>
  </div>
</div>`;

let _allSessions = [], _coachMap = {};
LOADERS.sessions = async () => {
  if (!supabase) { document.getElementById('sess-loading').style.display='none'; document.getElementById('sess-empty').style.display=''; return; }
  try {
    const [sessRes, coachRes] = await Promise.all([
      supabase.from('coaching_sessions').select('*').order('created_at',{ascending:false}),
      supabase.from('coaching_coaches').select('id,name').eq('active',true)
    ]);
    document.getElementById('sess-loading').style.display='none';
    _allSessions = sessRes.data||[];
    const coaches = coachRes.data||[];
    _coachMap = Object.fromEntries(coaches.map(c=>[c.id,c.name]));

    // Remplir select coachs
    const coachSel = document.getElementById('sess-coach');
    if (coachSel) coaches.forEach(c => coachSel.innerHTML += `<option value="${c.id}">${esc(c.name)}</option>`);
    const sCoachSel = document.getElementById('s-coach');
    if (sCoachSel) coaches.forEach(c => sCoachSel.innerHTML += `<option value="${c.id}">${esc(c.name)}</option>`);

    document.getElementById('kpi-total').textContent     = _allSessions.length;
    document.getElementById('kpi-pending').textContent   = _allSessions.filter(s=>s.status==='pending').length;
    document.getElementById('kpi-confirmed').textContent = _allSessions.filter(s=>s.status==='confirmed').length;
    document.getElementById('kpi-completed').textContent = _allSessions.filter(s=>s.status==='completed').length;
    _renderSessions(_allSessions);
  } catch(e) { console.warn(e); }
};
function _renderSessions(data) {
  const tbody=document.getElementById('sess-tbody'),table=document.getElementById('sess-table'),empty=document.getElementById('sess-empty');
  if(!tbody) return;
  const planL={decouverte:'Découverte',mensuel:'Pack mensuel',intensif:'Intensif'};
  const statL={pending:'En attente',confirmed:'Confirmée',completed:'Terminée',cancelled:'Annulée'};
  if(!data.length){table.style.display='none';empty.style.display='';return;}
  table.style.display='';empty.style.display='none';
  tbody.innerHTML=data.map(s=>`<tr>
    <td data-label="Apprenant"><div style="font-weight:600">${esc(s.learner_name||'—')}</div><div style="font-size:11px;color:var(--ink-mute)">${esc(s.learner_email||'')}</div></td>
    <td data-label="Coach">${esc(_coachMap[s.coach_id]||'—')}</td>
    <td data-label="Forfait"><span class="badge ${s.plan||''}">${planL[s.plan]||s.plan||'—'}</span></td>
    <td data-label="Date">${s.scheduled_at?new Date(s.scheduled_at).toLocaleString('fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'—'}</td>
    <td data-label="Statut"><span class="badge ${s.status||''}">${statL[s.status]||s.status}</span></td>
    <td data-label="Actions">
      <button class="btn sm" onclick="editSession('${s.id}')">Modifier</button>
      ${s.status==='pending'?`<button class="btn sm success" style="margin-left:4px" onclick="confirmSession('${s.id}')">Confirmer</button>`:''}
    </td>
  </tr>`).join('');
}
window.sessFilter = function() {
  const status=document.getElementById('sess-status')?.value;
  const coach=document.getElementById('sess-coach')?.value;
  const plan=document.getElementById('sess-plan')?.value;
  const search=(document.getElementById('sess-search')?.value||'').toLowerCase();
  _renderSessions(_allSessions.filter(s=>{
    if(status&&s.status!==status)return false;
    if(coach&&s.coach_id!==coach)return false;
    if(plan&&s.plan!==plan)return false;
    if(search&&!(s.learner_name||'').toLowerCase().includes(search))return false;
    return true;
  }));
};
window.openSessionModal = function() {
  document.getElementById('sess-modal-title').innerHTML='Nouvelle <em>session</em>';
  ['s-id','s-learner','s-email','s-date','s-notes'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('s-plan').value='decouverte';
  document.getElementById('s-status').value='pending';
  document.getElementById('sess-modal').classList.add('open');
};
window.editSession = function(id) {
  const s=_allSessions.find(x=>x.id===id); if(!s) return;
  document.getElementById('sess-modal-title').innerHTML='Modifier la <em>session</em>';
  document.getElementById('s-id').value=s.id;
  document.getElementById('s-learner').value=s.learner_name||'';
  document.getElementById('s-email').value=s.learner_email||'';
  document.getElementById('s-plan').value=s.plan||'decouverte';
  document.getElementById('s-coach').value=s.coach_id||'';
  document.getElementById('s-date').value=s.scheduled_at?new Date(s.scheduled_at).toISOString().slice(0,16):'';
  document.getElementById('s-notes').value=s.notes||'';
  document.getElementById('s-status').value=s.status||'pending';
  document.getElementById('sess-modal').classList.add('open');
};
window.closeSessionModal = function() { document.getElementById('sess-modal')?.classList.remove('open'); };
window.confirmSession = async function(id) {
  if(!supabase){showToast('Connexion non disponible','error');return;}
  const res=await supabase.from('coaching_sessions').update({status:'confirmed',updated_at:new Date().toISOString()}).eq('id',id);
  if(res.error){showToast('Erreur : '+res.error.message,'error');return;}
  showToast('Session confirmée','success'); LOADERS.sessions();
};
window.saveSession = async function() {
  if(!supabase){showToast('Connexion non disponible','error');return;}
  const id=document.getElementById('s-id').value;
  const payload={learner_name:document.getElementById('s-learner').value.trim(),learner_email:document.getElementById('s-email').value.trim()||null,plan:document.getElementById('s-plan').value,coach_id:document.getElementById('s-coach').value||null,scheduled_at:document.getElementById('s-date').value||null,notes:document.getElementById('s-notes').value.trim()||null,status:document.getElementById('s-status').value,updated_at:new Date().toISOString()};
  const res=id?await supabase.from('coaching_sessions').update(payload).eq('id',id):await supabase.from('coaching_sessions').insert({...payload,created_at:new Date().toISOString()});
  if(res.error){showToast('Erreur : '+res.error.message,'error');return;}
  showToast(id?'Session mise à jour':'Session créée','success');
  closeSessionModal(); LOADERS.sessions();
};

/* ── RESULTS ── */
PAGES.results = () => `
<div class="page-h">
  <div class="page-h-left">
    <h1>Résultats &amp; <em>scores</em></h1>
    <p>Suivi des performances par simulation et par apprenant.</p>
  </div>
</div>
<div class="kpi-grid">
  <div class="kpi"><div class="value" id="kpi-entries">—</div><div class="label">Entrées de progression</div></div>
  <div class="kpi success"><div class="value" id="kpi-completed">—</div><div class="label">Simulations terminées</div></div>
  <div class="kpi accent"><div class="value" id="kpi-avg">—</div><div class="label">Score moyen</div></div>
  <div class="kpi warn"><div class="value" id="kpi-max">—</div><div class="label">Score maximum</div></div>
</div>
<div class="card">
  <div class="filter-bar">
    <select id="res-game" onchange="resFilter()"><option value="">Toutes les simulations</option></select>
    <select id="res-status" onchange="resFilter()"><option value="">Tous les statuts</option><option value="1">Terminées</option><option value="0">En cours</option></select>
    <input type="text" id="res-search" placeholder="Rechercher…" oninput="resFilter()">
  </div>
  <div id="res-loading" style="text-align:center;padding:40px;color:var(--ink-mute)">Chargement…</div>
  <div class="table-wrap" id="res-table" style="display:none">
    <table>
      <thead><tr><th>Apprenant</th><th>Simulation</th><th>Défi</th><th>Score</th><th>Statut</th></tr></thead>
      <tbody id="res-tbody"></tbody>
    </table>
  </div>
  <div id="res-empty" class="empty-state" style="display:none"><h3>Aucun résultat</h3><p>Les données de progression apparaîtront ici dès que des apprenants auront joué.</p></div>
</div>`;

let _allResults=[], _profMap={};
LOADERS.results = async () => {
  if(!supabase){document.getElementById('res-loading').style.display='none';document.getElementById('res-empty').style.display='';return;}
  try {
    const [progRes,profRes]=await Promise.all([supabase.from('user_progress').select('*').order('updated_at',{ascending:false}).limit(500),supabase.from('profiles').select('id,full_name,organization')]);
    document.getElementById('res-loading').style.display='none';
    _allResults=progRes.data||[];
    (profRes.data||[]).forEach(p=>_profMap[p.id]=p);
    document.getElementById('kpi-entries').textContent=_allResults.length;
    document.getElementById('kpi-completed').textContent=_allResults.filter(r=>r.completed).length;
    const scores=_allResults.map(r=>r.score||0).filter(s=>s>0);
    document.getElementById('kpi-avg').textContent=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):'—';
    document.getElementById('kpi-max').textContent=scores.length?Math.max(...scores):'—';
    const games=[...new Set(_allResults.map(r=>r.game_id).filter(Boolean))].sort();
    const gameSel=document.getElementById('res-game');
    games.forEach(g=>gameSel.innerHTML+=`<option value="${esc(g)}">${esc(g)}</option>`);
    if(!_allResults.length){document.getElementById('res-empty').style.display='';return;}
    _renderResults(_allResults);
  } catch(e){console.warn(e);}
};
function _renderResults(data) {
  const tbody=document.getElementById('res-tbody'),table=document.getElementById('res-table'),empty=document.getElementById('res-empty');
  if(!tbody)return;
  if(!data.length){table.style.display='none';empty.style.display='';return;}
  table.style.display='';empty.style.display='none';
  tbody.innerHTML=data.map(r=>{
    const p=_profMap[r.user_id]||{};
    const name=(p.full_name||'').trim()||r.user_id?.slice(0,8)+'…';
    const maxScore=r.max_score||100;
    const pct=Math.min(100,Math.round((r.score||0)/maxScore*100));
    return `<tr>
      <td><div style="font-weight:600">${esc(name)}</div></td>
      <td><span style="font-family:var(--f-mono);font-size:12px">${esc(r.game_id||'—')}</span></td>
      <td>#${r.challenge_num||0}</td>
      <td><div style="display:flex;align-items:center;gap:8px"><div class="progress-wrap" style="width:80px"><div class="progress-fill" style="width:${pct}%"></div></div><strong>${r.score||0}</strong></div></td>
      <td><span class="badge ${r.completed?'completed':'pending'}">${r.completed?'Terminé':'En cours'}</span></td>
    </tr>`;
  }).join('');
}
window.resFilter=function(){
  const game=document.getElementById('res-game')?.value;
  const status=document.getElementById('res-status')?.value;
  const search=(document.getElementById('res-search')?.value||'').toLowerCase();
  _renderResults(_allResults.filter(r=>{
    if(game&&r.game_id!==game)return false;
    if(status!==''&&String(r.completed?1:0)!==status)return false;
    if(search){const p=_profMap[r.user_id]||{};const n=((p.full_name||'')+' '+(r.game_id||'')).toLowerCase();if(!n.includes(search))return false;}
    return true;
  }));
};

/* ── DEMANDES ── */
PAGES.demandes = () => `
<div class="page-h">
  <div class="page-h-left">
    <h1>Demandes de <em>formation</em></h1>
    <p>Inscriptions et demandes de devis reçues.</p>
  </div>
</div>
<div class="kpi-grid">
  <div class="kpi"><div class="value" id="kpi-total">—</div><div class="label">Total demandes</div></div>
  <div class="kpi warn"><div class="value" id="kpi-new">—</div><div class="label">Nouvelles</div></div>
  <div class="kpi success"><div class="value" id="kpi-treated">—</div><div class="label">Traitées</div></div>
</div>
<div class="card">
  <div class="filter-bar">
    <select id="dem-status" onchange="demFilter()"><option value="">Tous les statuts</option><option value="new">Nouvelles</option><option value="in_progress">En cours</option><option value="treated">Traitées</option></select>
    <input type="text" id="dem-search" placeholder="Rechercher…" oninput="demFilter()">
  </div>
  <div id="dem-loading" style="text-align:center;padding:40px;color:var(--ink-mute)">Chargement…</div>
  <div class="table-wrap" id="dem-table" style="display:none">
    <table>
      <thead><tr><th>Contact</th><th>Organisation</th><th>Sujet</th><th>Date</th><th>Statut</th><th>Actions</th></tr></thead>
      <tbody id="dem-tbody"></tbody>
    </table>
  </div>
  <div id="dem-empty" class="empty-state" style="display:none"><h3>Aucune demande</h3><p>Les demandes de formation apparaîtront ici.</p></div>
</div>`;

let _allDemandes=[];
LOADERS.demandes = async () => {
  if(!supabase){document.getElementById('dem-loading').style.display='none';document.getElementById('dem-empty').style.display='';return;}
  try {
    const res=await supabase.from('training_requests').select('*').order('created_at',{ascending:false});
    document.getElementById('dem-loading').style.display='none';
    _allDemandes=res.data||[];
    document.getElementById('kpi-total').textContent=_allDemandes.length;
    document.getElementById('kpi-new').textContent=_allDemandes.filter(d=>d.status==='new'||!d.status).length;
    document.getElementById('kpi-treated').textContent=_allDemandes.filter(d=>d.status==='treated').length;
    if(!_allDemandes.length){document.getElementById('dem-empty').style.display='';return;}
    _renderDemandes(_allDemandes);
  }catch(e){console.warn(e);}
};
function _renderDemandes(data){
  const tbody=document.getElementById('dem-tbody'),table=document.getElementById('dem-table'),empty=document.getElementById('dem-empty');
  if(!tbody)return;
  const statL={new:'Nouvelle',in_progress:'En cours',treated:'Traitée'};
  const statC={new:'pending',in_progress:'confirmed',treated:'completed'};
  if(!data.length){table.style.display='none';empty.style.display='';return;}
  table.style.display='';empty.style.display='none';
  tbody.innerHTML=data.map(d=>`<tr>
    <td><div style="font-weight:600">${esc(d.name||d.full_name||'—')}</div><div style="font-size:11px;color:var(--ink-mute)">${esc(d.email||'')}</div></td>
    <td>${esc(d.organization||d.company||'—')}</td>
    <td style="max-width:200px"><div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(d.subject||d.message?.slice(0,60)||'—')}</div></td>
    <td>${fmtDate(d.created_at)}</td>
    <td><span class="badge ${statC[d.status]||'pending'}">${statL[d.status]||'Nouvelle'}</span></td>
    <td><button class="btn sm" onclick="demandeAction('${d.id}')">Traiter</button></td>
  </tr>`).join('');
}
window.demFilter=function(){
  const st=document.getElementById('dem-status')?.value;
  const q=(document.getElementById('dem-search')?.value||'').toLowerCase();
  _renderDemandes(_allDemandes.filter(d=>{
    if(st&&(d.status||'new')!==st)return false;
    if(q&&!(d.name||d.full_name||'').toLowerCase().includes(q)&&!(d.organization||'').toLowerCase().includes(q))return false;
    return true;
  }));
};
window.demandeAction=async function(id){
  if(!supabase){showToast('Non disponible','error');return;}
  await supabase.from('training_requests').update({status:'treated',updated_at:new Date().toISOString()}).eq('id',id);
  showToast('Demande marquée comme traitée','success'); LOADERS.demandes();
};

/* ── STATS ── */
PAGES.stats = () => `
<div class="page-h">
  <div class="page-h-left">
    <h1>Statistiques <em>plateforme</em></h1>
    <p>Vue d'ensemble des données d'utilisation et de performance.</p>
  </div>
</div>
<div class="kpi-grid">
  <div class="kpi accent"><div class="value" id="kpi-users">—</div><div class="label">Comptes inscrits</div></div>
  <div class="kpi success"><div class="value" id="kpi-progress">—</div><div class="label">Entrées progression</div></div>
  <div class="kpi warn"><div class="value" id="kpi-sessions">—</div><div class="label">Sessions coaching</div></div>
  <div class="kpi"><div class="value" id="kpi-coaches">—</div><div class="label">Formateurs actifs</div></div>
</div>
<div class="grid-2">
  <div class="card">
    <div class="card-h"><h2>Simulations les plus <em>jouées</em></h2></div>
    <div id="top-games"><div style="padding:20px;text-align:center;color:var(--ink-mute)">Chargement…</div></div>
  </div>
  <div class="card">
    <div class="card-h"><h2>Répartition des <em>sessions</em></h2></div>
    <div id="session-stats"><div style="padding:20px;text-align:center;color:var(--ink-mute)">Chargement…</div></div>
  </div>
</div>
<div class="card">
  <div class="card-h"><h2>Résumé <em>mensuel</em></h2></div>
  <div id="monthly-stats" style="text-align:center;padding:20px;color:var(--ink-mute)">Chargement…</div>
</div>`;

LOADERS.stats = async () => {
  if(!supabase){return;}
  try {
    const [profRes,progRes,sessRes,coachRes]=await Promise.all([supabase.from('profiles').select('id',{count:'exact',head:true}),supabase.from('user_progress').select('game_id,completed'),supabase.from('coaching_sessions').select('status,created_at'),supabase.from('coaching_coaches').select('id',{count:'exact',head:true}).eq('active',true)]);
    document.getElementById('kpi-users').textContent=profRes.count??'—';
    const prog=progRes.data||[];
    document.getElementById('kpi-progress').textContent=prog.length;
    const sess=sessRes.data||[];
    document.getElementById('kpi-sessions').textContent=sess.length;
    document.getElementById('kpi-coaches').textContent=coachRes.count??'—';
    const gameCount={};
    prog.forEach(p=>gameCount[p.game_id]=(gameCount[p.game_id]||0)+1);
    const sortedGames=Object.entries(gameCount).sort((a,b)=>b[1]-a[1]).slice(0,8);
    const maxGame=sortedGames.length?sortedGames[0][1]:1;
    document.getElementById('top-games').innerHTML=sortedGames.length?sortedGames.map(g=>barRow(g[0],g[1],maxGame)).join(''):'<div style="padding:20px;text-align:center;color:var(--ink-mute)">Aucune donnée</div>';
    const statusCount={pending:0,confirmed:0,completed:0,cancelled:0};
    sess.forEach(s=>{if(statusCount[s.status]!==undefined)statusCount[s.status]++;});
    const maxS=Math.max(...Object.values(statusCount))||1;
    const statusLabels={pending:'En attente',confirmed:'Confirmées',completed:'Terminées',cancelled:'Annulées'};
    document.getElementById('session-stats').innerHTML=Object.entries(statusCount).map(e=>barRow(statusLabels[e[0]]||e[0],e[1],maxS)).join('');
    const thisMonth=new Date();thisMonth.setDate(1);thisMonth.setHours(0,0,0,0);
    const monthSess=sess.filter(s=>s.created_at&&new Date(s.created_at)>=thisMonth).length;
    document.getElementById('monthly-stats').innerHTML=`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:16px;text-align:center">
      <div><div style="font-family:var(--f-display);font-size:28px;font-weight:500;color:var(--marine)">${monthSess}</div><div style="font-size:12px;color:var(--ink-mute);margin-top:4px">Sessions ce mois</div></div>
      <div><div style="font-family:var(--f-display);font-size:28px;font-weight:500;color:var(--jade)">${prog.filter(p=>p.completed).length}</div><div style="font-size:12px;color:var(--ink-mute);margin-top:4px">Simulations terminées</div></div>
      <div><div style="font-family:var(--f-display);font-size:28px;font-weight:500;color:var(--orange)">${Math.round(prog.filter(p=>p.completed).length/Math.max(prog.length,1)*100)}%</div><div style="font-size:12px;color:var(--ink-mute);margin-top:4px">Taux de complétion</div></div>
    </div>`;
  }catch(e){console.warn(e);}
};

/* ── ACCESS ── */
PAGES.access = () => `
<div class="page-h">
  <div class="page-h-left">
    <h1>Accès &amp; <em>API</em></h1>
    <p>Gestion des clés d'API et des intégrations externes.</p>
  </div>
</div>
<div class="notif-banner">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
  <span>Gardez vos clés API confidentielles. Ne les partagez jamais dans du code source public ou des dépôts Git.</span>
</div>
<div class="grid-2">
  <div class="card">
    <div class="card-h"><h2>Clés <em>API</em></h2><button class="btn primary sm" onclick="showToast('Clé générée !','')">Générer une clé</button></div>
    <div id="api-keys-loading" style="text-align:center;padding:30px;color:var(--ink-mute)">Chargement…</div>
    <div id="api-keys-list"></div>
  </div>
  <div class="card">
    <div class="card-h"><h2>Webhooks <em>actifs</em></h2><button class="btn sm" onclick="showToast('Formulaire webhook')">Ajouter</button></div>
    <div id="webhooks-loading" style="text-align:center;padding:30px;color:var(--ink-mute)">Chargement…</div>
    <div id="webhooks-list"></div>
  </div>
</div>
<div class="card">
  <div class="card-h"><h2>Variables <em>d'environnement</em></h2></div>
  <div id="env-loading" style="text-align:center;padding:30px;color:var(--ink-mute)">Chargement…</div>
  <div id="env-list"></div>
</div>`;

LOADERS.access = async () => {
  if(!supabase){['api-keys-loading','webhooks-loading','env-loading'].forEach(id=>{const el=document.getElementById(id);if(el)el.style.display='none';});return;}
  try {
    const [keysRes,hooksRes,envRes]=await Promise.all([supabase.from('api_keys').select('*').order('created_at',{ascending:false}),supabase.from('webhooks').select('*').order('created_at',{ascending:false}),supabase.from('env_vars').select('*').order('key')]);
    document.getElementById('api-keys-loading').style.display='none';
    document.getElementById('webhooks-loading').style.display='none';
    document.getElementById('env-loading').style.display='none';
    const keys=keysRes.data||[];
    document.getElementById('api-keys-list').innerHTML=keys.length?keys.map(k=>`<div class="api-key-row"><div class="api-key-val">${esc(k.key_prefix||'sk_…')}••••••••</div><span class="badge ${k.active?'active':'inactive'}" style="flex-shrink:0">${k.active?'Actif':'Révoqué'}</span><button class="btn sm danger" onclick="revokeKey('${k.id}')">Révoquer</button></div>`).join(''):`<div class="empty-state" style="padding:20px"><p>Aucune clé API. Générez-en une avec le bouton ci-dessus.</p></div>`;
    const hooks=hooksRes.data||[];
    document.getElementById('webhooks-list').innerHTML=hooks.length?hooks.map(h=>`<div class="stat-row"><div><div class="stat-label">${esc(h.url)}</div><div style="font-size:11px;color:var(--ink-mute)">${esc(h.event||'all')}</div></div><span class="badge ${h.active?'active':'inactive'}">${h.active?'Actif':'Inactif'}</span></div>`).join(''):`<div class="empty-state" style="padding:20px"><p>Aucun webhook configuré.</p></div>`;
    const envs=envRes.data||[];
    document.getElementById('env-list').innerHTML=envs.length?`<div class="table-wrap"><table><thead><tr><th>Clé</th><th>Valeur</th><th>Description</th></tr></thead><tbody>${envs.map(e=>`<tr><td><code style="font-family:var(--f-mono);font-size:12px">${esc(e.key)}</code></td><td><code style="font-family:var(--f-mono);font-size:12px;color:var(--marine)">••••••</code></td><td style="color:var(--ink-mute)">${esc(e.description||'')}</td></tr>`).join('')}</tbody></table></div>`:`<div class="empty-state" style="padding:20px"><p>Aucune variable d'environnement.</p></div>`;
  }catch(e){console.warn(e);}
};
window.revokeKey=async function(id){if(!supabase){showToast('Non disponible','error');return;}await supabase.from('api_keys').update({active:false}).eq('id',id);showToast('Clé révoquée','success');LOADERS.access();};

/* ── EXPORT ── */
PAGES.export = () => `
<div class="page-h">
  <div class="page-h-left">
    <h1>Export des <em>données</em></h1>
    <p>Téléchargez les données de la plateforme au format CSV ou JSON.</p>
  </div>
</div>
<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px">
  ${[
    ['var(--marine)','rgba(2,74,255,.08)',usersIco(),'Utilisateurs','Tous les comptes inscrits (profils, rôles, plans)'],
    ['var(--jade)','rgba(13,148,136,.08)',calIco(),'Sessions coaching','Toutes les sessions avec statuts et notes'],
    ['var(--orange)','rgba(255,107,0,.08)',chartIco(),'Résultats & scores','Progression et scores par simulation'],
    ['var(--coral)','rgba(204,0,51,.08)',coachIco(),'Formateurs','Liste des coachs actifs et inactifs'],
    ['var(--marine)','rgba(2,74,255,.08)',promoIco(),'Promotions','Codes promo et accès gratuits'],
    ['var(--ink)','rgba(14,26,43,.06)',fileIco(),'Demandes formation','Inscriptions et demandes de devis'],
  ].map(([color,bg,ico,label,desc])=>`
  <div class="card" style="margin:0">
    <div style="width:44px;height:44px;border-radius:var(--r);background:${bg};display:flex;align-items:center;justify-content:center;margin-bottom:14px">${ico.replace('currentColor',color)}</div>
    <h3 style="font-family:var(--f-display);font-size:16px;font-weight:500;margin-bottom:6px">${label}</h3>
    <p style="font-size:12px;color:var(--ink-mute);margin-bottom:16px;line-height:1.5">${desc}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn sm primary" onclick="exportData('${label.toLowerCase()}','csv')">Exporter CSV</button>
      <button class="btn sm" onclick="exportData('${label.toLowerCase()}','json')">Exporter JSON</button>
    </div>
  </div>`).join('')}
</div>`;

LOADERS.export = () => {};
window.exportData = async function(type, format) {
  if (!supabase) { showToast('Connexion non disponible', 'error'); return; }
  showToast(`Export ${type} en ${format.toUpperCase()} en cours…`, '');
  const tableMap = { 'utilisateurs': 'profiles', 'sessions coaching': 'coaching_sessions', 'résultats & scores': 'user_progress', 'formateurs': 'coaching_coaches', 'promotions': 'promotions', 'demandes formation': 'training_requests' };
  const tbl = tableMap[type];
  if (!tbl) { showToast('Table non reconnue', 'error'); return; }
  try {
    const { data, error } = await supabase.from(tbl).select('*');
    if (error) { showToast('Erreur export : ' + error.message, 'error'); return; }
    let content, mime, ext;
    if (format === 'json') {
      content = JSON.stringify(data, null, 2);
      mime = 'application/json'; ext = 'json';
    } else {
      if (!data.length) { showToast('Aucune donnée à exporter', 'warn'); return; }
      const keys = Object.keys(data[0]);
      content = keys.join(',') + '\n' + data.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(',')).join('\n');
      mime = 'text/csv'; ext = 'csv';
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `immersium-${tbl}-${new Date().toISOString().slice(0,10)}.${ext}`;
    a.click(); URL.revokeObjectURL(url);
    showToast('Export téléchargé !', 'success');
  } catch(e) { showToast('Erreur : ' + e.message, 'error'); }
};

/* ── PAGES AVEC IFRAME ── */
function iframePage(src, title, desc) {
  return `
  <div class="page-h">
    <div class="page-h-left"><h1>${title}</h1><p>${desc}</p></div>
    <a class="btn" href="${src}" target="_blank">Ouvrir dans un nouvel onglet</a>
  </div>
  <div style="border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden;background:var(--paper)">
    <iframe src="${src}" style="width:100%;height:calc(100vh - 260px);min-height:600px;border:none;display:block" loading="lazy"></iframe>
  </div>`;
}

PAGES.editor      = () => iframePage('src/admin-editor.html',      'Éditeur de jeux &amp; <em>formations</em>',     'Créez et modifiez les défis, questions et scénarios.');
PAGES.simulations = () => iframePage('src/admin-simulations.html', 'Config <em>simulations</em>',                   'Paramétrage des simulations VR (couleurs, niveaux, règles).');
PAGES.hero        = () => iframePage('src/admin-hero.html',        "Page <em>d'accueil</em>",                       'Éditez le hero, le slider et les bannières de la page d\'accueil.');
PAGES.vedettes    = () => iframePage('src/admin-vedettes.html',    'Vedettes <em>accueil</em>',                     'Simulations mises en avant sur la page d\'accueil.');
PAGES.pages       = () => iframePage('src/admin-pages.html',       'Pages du <em>site</em>',                        'Gestion du CMS : CGV, mentions légales, pages statiques.');
PAGES.faq         = () => iframePage('src/admin-faq.html',         'FAQ',                                           'Gérez les questions fréquentes affichées sur le site.');
PAGES.tarifs      = () => iframePage('src/admin-tarifs.html',      'Tarifs &amp; <em>plans</em>',                   'Configuration des plans et fonctionnalités disponibles.');
PAGES.coaching    = () => iframePage('src/admin-coaching.html',    'Gestion des <em>coaches</em>',                  'Profils, spécialités et disponibilités des coaches.');
PAGES.promotions  = () => iframePage('src/admin-promotions.html',  'Promotions &amp; <em>accès</em>',               'Codes promotionnels et accès gratuits à la plateforme.');

/* Loaders vides pour les pages iframe */
['editor','simulations','hero','vedettes','pages','faq','tarifs','coaching','promotions'].forEach(k => { LOADERS[k] = () => {}; });

/* ═════════════════════════════
   MOBILE DRAWER
═════════════════════════════ */
function renderMobileNav(activeTab, activeSub) {
  const nav = document.getElementById('mobileNav');
  if (!nav) return;
  let html = '';
  for (const [tabId, tabCfg] of Object.entries(TABS)) {
    html += `<div class="mobile-nav-sec">${tabCfg.label}</div>`;
    if (!tabCfg.subtabs) {
      html += `<div class="mobile-nav-item${tabId===activeTab&&!activeSub?' active':''}" onclick="navigate('${tabId}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>${tabCfg.label}</div>`;
    } else {
      tabCfg.subtabs.forEach(st => {
        html += `<div class="mobile-nav-item${st.id===activeSub?' active':''}" onclick="navigate('${tabId}','${st.id}')">${st.icon}${esc(st.label)}</div>`;
      });
    }
  }
  nav.innerHTML = html;
}

window.closeMobileDrawer = function() {
  document.getElementById('mobileDrawer')?.classList.remove('open');
  document.getElementById('mobileOverlay')?.classList.remove('open');
};

/* ═════════════════════════════
   INIT
═════════════════════════════ */
document.addEventListener('DOMContentLoaded', function() {
  // Écoute des onglets principaux
  document.querySelectorAll('.mtab').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.tab));
  });

  // Bouton menu mobile
  document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('mobileDrawer').classList.add('open');
    document.getElementById('mobileOverlay').classList.add('open');
    renderMobileNav(currentTab, currentSubtab);
  });

  // Supabase (facultatif — si le projet a une config)
  if (window.IMM_SUPABASE) {
    supabase = window.IMM_SUPABASE;
  }
  document.addEventListener('imm:ready', e => {
    supabase = window.IMM_SUPABASE;
    if (e.detail?.name) {
      const ini = initials(e.detail.name);
      const av = document.getElementById('dshUserAv');
      const nm = document.getElementById('dshUserName');
      if (av) av.textContent = ini;
      if (nm) nm.textContent = e.detail.name;
    }
  });

  // Lancement
  navigate('dashboard');
});

window.closeGlobalModal = function() { document.getElementById('globalModal')?.classList.remove('open'); };
