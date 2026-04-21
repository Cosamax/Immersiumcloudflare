/* ══════════════════════════════════════════════
   IMMERSIUM — Page Renderers
══════════════════════════════════════════════ */

const Pages = {};

/* ─────────────── helpers ─────────────── */
function statusBadge(s) {
  const map = {
    'Actif':        'badge-success',
    'Publié':       'badge-success',
    'Planifiée':    'badge-info',
    'Terminée':     'badge-purple',
    'Inactif':      'badge-warning',
    'Brouillon':    'badge-warning',
    'Suspendu':     'badge-danger',
    'Archivé':      'badge-danger',
    'Annulée':      'badge-danger',
    'Expiré':       'badge-danger',
  };
  return `<span class="badge ${map[s] || 'badge-info'}">${s}</span>`;
}

function diffBadge(d) {
  const map = { 'Facile': 'badge-success', 'Intermédiaire': 'badge-info', 'Avancé': 'badge-warning', 'Difficile': 'badge-danger', 'Expert': 'badge-danger', 'Fondamental': 'badge-success' };
  return `<span class="badge ${map[d] || 'badge-info'}">${d}</span>`;
}

function stars(n) {
  let s = '';
  for (let i = 1; i <= 5; i++) {
    s += `<i class="fas fa-star" style="font-size:11px;color:${i <= Math.round(n) ? 'var(--warning)' : 'var(--border)'}"></i>`;
  }
  return `<span>${s} <small style="color:var(--text-muted)">${n}</small></span>`;
}

function avatarCell(u) {
  return `<div class="avatar-cell">
    <div class="avatar-sm" style="background:${u.color}22;color:${u.color}">${u.avatar}</div>
    <div>
      <div style="font-weight:600;color:var(--text-primary);font-size:13px">${u.name || u.title}</div>
      ${u.email ? `<div style="font-size:11px;color:var(--text-muted)">${u.email}</div>` : ''}
    </div>
  </div>`;
}

function progressCell(v) {
  return `<div style="display:flex;align-items:center;gap:8px">
    <div class="progress-bar-wrap" style="flex:1">
      <div class="progress-bar-fill" style="width:${v}%"></div>
    </div>
    <span style="font-size:12px;color:var(--text-secondary);width:32px;text-align:right">${v}%</span>
  </div>`;
}

function toolbar(placeholder, filterOptions = []) {
  const opts = filterOptions.map(o => `<option value="${o.v}">${o.l}</option>`).join('');
  return `<div class="table-toolbar">
    <div class="search-container">
      <i class="fas fa-search"></i>
      <input class="table-search" placeholder="${placeholder}" oninput="Pages._filter(this)" />
    </div>
    ${opts ? `<select class="filter-select">${opts}</select>` : ''}
    <button class="btn btn-secondary btn-sm"><i class="fas fa-filter"></i> Filtrer</button>
    <button class="btn btn-primary btn-sm" onclick="showToast('success','Nouveau élément créé !')"><i class="fas fa-plus"></i> Ajouter</button>
  </div>`;
}

Pages._filter = function(input) {
  const q = input.value.toLowerCase();
  const rows = input.closest('.card, section').querySelectorAll('tbody tr');
  rows.forEach(r => { r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none'; });
};

/* ─────────────── DASHBOARD ─────────────── */
Pages.dashboard = function() {
  const kpi = MOCK.kpi;
  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1>Tableau de bord</h1>
      <p>Vue d'ensemble de la plateforme Immersium — ${new Date().toLocaleDateString('fr-FR',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
    </div>
    <div class="page-header-actions">
      <button class="btn btn-secondary" onclick="showToast('info','Export en cours…')"><i class="fas fa-download"></i> Exporter</button>
      <button class="btn btn-primary" onclick="navigate('courses')"><i class="fas fa-plus"></i> Nouvelle formation</button>
    </div>
  </div>

  <!-- KPI -->
  <div class="kpi-grid">
    <div class="kpi-card" style="--kpi-color:#6C5CE7">
      <div class="kpi-header"><span class="kpi-label">Utilisateurs</span><div class="kpi-icon"><i class="fas fa-users"></i></div></div>
      <div class="kpi-value">${kpi.users.value.toLocaleString('fr-FR')}</div>
      <div class="kpi-footer"><span class="kpi-trend up"><i class="fas fa-arrow-up"></i> ${kpi.users.trend}</span> vs mois dernier</div>
    </div>
    <div class="kpi-card" style="--kpi-color:#00cec9">
      <div class="kpi-header"><span class="kpi-label">Formations</span><div class="kpi-icon"><i class="fas fa-book-open"></i></div></div>
      <div class="kpi-value">${kpi.courses.value}</div>
      <div class="kpi-footer"><span class="kpi-trend up"><i class="fas fa-arrow-up"></i> ${kpi.courses.trend}</span> nouvelles formations</div>
    </div>
    <div class="kpi-card" style="--kpi-color:#fd79a8">
      <div class="kpi-header"><span class="kpi-label">Formateurs</span><div class="kpi-icon"><i class="fas fa-chalkboard-teacher"></i></div></div>
      <div class="kpi-value">${kpi.trainers.value}</div>
      <div class="kpi-footer"><span class="kpi-trend up"><i class="fas fa-arrow-up"></i> ${kpi.trainers.trend}</span> vs mois dernier</div>
    </div>
    <div class="kpi-card" style="--kpi-color:#fdcb6e">
      <div class="kpi-header"><span class="kpi-label">Apprenants</span><div class="kpi-icon"><i class="fas fa-user-graduate"></i></div></div>
      <div class="kpi-value">${kpi.learners.value.toLocaleString('fr-FR')}</div>
      <div class="kpi-footer"><span class="kpi-trend up"><i class="fas fa-arrow-up"></i> ${kpi.learners.trend}</span> inscrits actifs</div>
    </div>
  </div>

  <!-- Chart + Activity -->
  <div class="cols-2-1" style="margin-bottom:24px">
    <div class="card">
      <div class="card-header">
        <h3 class="section-title" style="margin:0"><i class="fas fa-chart-line"></i> Activité mensuelle</h3>
        <div style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm chart-toggle active-tab" data-chart="enrollment" onclick="switchChart(this,'enrollment')">Inscriptions</button>
          <button class="btn btn-secondary btn-sm chart-toggle" data-chart="completion" onclick="switchChart(this,'completion')">Complétion (%)</button>
        </div>
      </div>
      <div class="chart-container" style="height:220px">
        <canvas id="mainChart" class="chart-canvas"></canvas>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h3 class="section-title" style="margin:0"><i class="fas fa-chart-pie"></i> Répartition</h3>
      </div>
      <div class="chart-container" style="height:160px;display:flex;align-items:center;justify-content:center">
        <canvas id="pieChart" style="max-width:200px;max-height:160px"></canvas>
      </div>
      <div style="display:flex;flex-direction:column;gap:6px;margin-top:10px">
        ${[['Apprenants','#6C5CE7',96],['Formateurs','#00cec9',3.7],['Admins','#fd79a8',0.3]].map(([l,c,p]) =>
          `<div style="display:flex;align-items:center;gap:8px;font-size:12px">
            <span style="width:10px;height:10px;border-radius:2px;background:${c};display:inline-block"></span>
            <span style="flex:1;color:var(--text-secondary)">${l}</span>
            <span style="color:var(--text-primary);font-weight:600">${p}%</span>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Activity + Quick Actions -->
  <div class="cols-2-1">
    <div class="card">
      <div class="card-header">
        <h3 class="section-title" style="margin:0"><i class="fas fa-stream"></i> Fil d'activité récente</h3>
        <button class="btn btn-secondary btn-sm">Tout voir</button>
      </div>
      <div class="activity-list">
        ${MOCK.activity.map(a => `
        <div class="activity-item">
          <div class="activity-avatar" style="background:${a.color}22;color:${a.color}">${a.avatar}</div>
          <div class="activity-body">
            <div class="activity-text">
              <strong>${a.user}</strong> ${a.action}
              <span class="badge ${a.tagColor}" style="margin:0 4px">${a.tag}</span>
              <em style="color:var(--text-primary)">${a.target}</em>
            </div>
            <div class="activity-time"><i class="fas fa-clock" style="font-size:10px;margin-right:3px"></i>${a.time}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <div class="card">
      <h3 class="section-title"><i class="fas fa-bolt"></i> Accès rapides</h3>
      <div class="quick-actions-grid">
        ${[
          ['fa-users','Utilisateurs','users'],
          ['fa-gamepad','Jeux','games'],
          ['fa-star','Compétences','skills'],
          ['fa-home','Page d\'accueil','homepage'],
          ['fa-key','Accès & API','access'],
          ['fa-chart-bar','Rapports','reports'],
        ].map(([ico, lbl, page]) => `
        <div class="quick-action" onclick="navigate('${page}')">
          <div class="quick-action-icon"><i class="fas ${ico}"></i></div>
          <span>${lbl}</span>
        </div>`).join('')}
      </div>
    </div>
  </div>`;
};

/* ─────────────── USERS ─────────────── */
Pages.users = function() {
  const rows = MOCK.users.map(u => `
    <tr>
      <td>${avatarCell(u)}</td>
      <td><span class="badge badge-purple" style="font-size:11px">${u.role}</span></td>
      <td>${statusBadge(u.status)}</td>
      <td style="text-align:center">${u.courses}</td>
      <td style="color:var(--text-muted)">${u.joined}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="showToast('info','Ouverture du profil…')"><i class="fas fa-eye"></i></button>
        <button class="btn btn-secondary btn-sm" style="margin-left:4px" onclick="showToast('info','Édition en cours…')"><i class="fas fa-pen"></i></button>
        <button class="btn btn-danger btn-sm" style="margin-left:4px" onclick="showToast('error','Utilisateur supprimé')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`).join('');

  return `
  <div class="page-header">
    <div class="page-header-left">
      <h1>Utilisateurs</h1>
      <p>${MOCK.users.length} utilisateurs enregistrés sur la plateforme</p>
    </div>
    <div class="page-header-actions">
      <button class="btn btn-secondary" onclick="showToast('info','Export CSV…')"><i class="fas fa-file-csv"></i> Exporter</button>
      <button class="btn btn-primary" onclick="showToast('success','Formulaire d\'invitation ouvert')"><i class="fas fa-user-plus"></i> Inviter</button>
    </div>
  </div>

  <!-- Sub KPI -->
  <div class="kpi-grid" style="margin-bottom:24px">
    <div class="kpi-card" style="--kpi-color:#6C5CE7">
      <div class="kpi-header"><span class="kpi-label">Total</span><div class="kpi-icon"><i class="fas fa-users"></i></div></div>
      <div class="kpi-value">1 284</div>
      <div class="kpi-footer"><span class="kpi-trend up"><i class="fas fa-arrow-up"></i> +8%</span> ce mois</div>
    </div>
    <div class="kpi-card" style="--kpi-color:#fd79a8">
      <div class="kpi-header"><span class="kpi-label">Formateurs</span><div class="kpi-icon"><i class="fas fa-chalkboard-teacher"></i></div></div>
      <div class="kpi-value">47</div>
      <div class="kpi-footer"><span class="kpi-trend up"><i class="fas fa-arrow-up"></i> +2</span> ce mois</div>
    </div>
    <div class="kpi-card" style="--kpi-color:#fdcb6e">
      <div class="kpi-header"><span class="kpi-label">Apprenants</span><div class="kpi-icon"><i class="fas fa-user-graduate"></i></div></div>
      <div class="kpi-value">1 237</div>
      <div class="kpi-footer"><span class="kpi-trend up"><i class="fas fa-arrow-up"></i> +12%</span> ce mois</div>
    </div>
    <div class="kpi-card" style="--kpi-color:#e17055">
      <div class="kpi-header"><span class="kpi-label">Suspendus</span><div class="kpi-icon"><i class="fas fa-ban"></i></div></div>
      <div class="kpi-value">12</div>
      <div class="kpi-footer"><span class="kpi-trend down"><i class="fas fa-arrow-down"></i> -3</span> ce mois</div>
    </div>
  </div>

  <div class="card">
    ${toolbar('Rechercher un utilisateur…', [
      {v:'', l:'Tous les rôles'}, {v:'apprenant', l:'Apprenants'}, {v:'formateur', l:'Formateurs'}, {v:'admin', l:'Admins'}
    ])}
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Utilisateur <i class="fas fa-sort" style="font-size:9px"></i></th>
          <th>Rôle</th>
          <th>Statut</th>
          <th style="text-align:center">Formations</th>
          <th>Inscrit le</th>
          <th>Actions</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="pagination">
      <span class="page-info">1–8 sur 1 284</span>
      <button class="page-btn"><i class="fas fa-chevron-left"></i></button>
      <button class="page-btn active">1</button>
      <button class="page-btn">2</button>
      <button class="page-btn">3</button>
      <button class="page-btn">…</button>
      <button class="page-btn">161</button>
      <button class="page-btn"><i class="fas fa-chevron-right"></i></button>
    </div>
  </div>`;
};

/* ─────────────── TRAINERS ─────────────── */
Pages.trainers = function() {
  const trainers = MOCK.users.filter(u => u.role === 'Formateur');
  return `
  <div class="page-header">
    <div class="page-header-left"><h1>Formateurs</h1><p>${trainers.length} formateurs actifs</p></div>
    <div class="page-header-actions">
      <button class="btn btn-primary" onclick="showToast('success','Invitation envoyée')"><i class="fas fa-user-plus"></i> Ajouter un formateur</button>
    </div>
  </div>
  <div class="scenario-grid">
    ${trainers.map(t => `
    <div class="card" style="display:flex;flex-direction:column;gap:14px;cursor:pointer" onclick="showToast('info','Profil de ${t.name}')">
      <div style="display:flex;align-items:center;gap:14px">
        <div class="user-avatar" style="width:52px;height:52px;font-size:20px;background:${t.color}22;color:${t.color}">${t.avatar}</div>
        <div>
          <div style="font-weight:700;font-size:14px">${t.name}</div>
          <div style="font-size:12px;color:var(--text-muted)">${t.email}</div>
        </div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        ${statusBadge(t.status)}
        <span class="badge badge-purple"><i class="fas fa-book-open" style="font-size:9px"></i> ${t.courses} formations</span>
      </div>
      <div style="font-size:12px;color:var(--text-muted)"><i class="fas fa-calendar" style="margin-right:5px"></i>Depuis ${t.joined}</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-secondary btn-sm" style="flex:1" onclick="event.stopPropagation();showToast('info','Édition…')"><i class="fas fa-pen"></i> Modifier</button>
        <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();showToast('error','Suppression…')"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('')}
  </div>`;
};

/* ─────────────── LEARNERS ─────────────── */
Pages.learners = function() {
  const learners = MOCK.users.filter(u => u.role === 'Apprenant');
  const rows = learners.map(u => `
    <tr>
      <td>${avatarCell(u)}</td>
      <td>${statusBadge(u.status)}</td>
      <td style="text-align:center">${u.courses}</td>
      <td>${progressCell(Math.floor(Math.random()*80)+20)}</td>
      <td style="color:var(--text-muted)">${u.joined}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="showToast('info','Profil apprenant')"><i class="fas fa-eye"></i></button>
        <button class="btn btn-primary btn-sm" style="margin-left:4px" onclick="showToast('success','Formation assignée')"><i class="fas fa-book"></i> Assigner</button>
      </td>
    </tr>`).join('');
  return `
  <div class="page-header">
    <div class="page-header-left"><h1>Apprenants</h1><p>Gestion des apprenants inscrits sur la plateforme</p></div>
    <div class="page-header-actions">
      <button class="btn btn-primary" onclick="showToast('success','Apprenant ajouté')"><i class="fas fa-user-plus"></i> Ajouter</button>
    </div>
  </div>
  <div class="card">
    ${toolbar('Rechercher un apprenant…')}
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Apprenant</th><th>Statut</th><th style="text-align:center">Formations</th><th>Progression</th><th>Inscrit le</th><th>Actions</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
};

/* ─────────────── COURSES ─────────────── */
Pages.courses = function() {
  const rows = MOCK.courses.map(c => `
    <tr>
      <td style="font-weight:600;color:var(--text-primary)">${c.title}</td>
      <td><span class="skill-tag" style="font-size:11px">${c.category}</span></td>
      <td style="text-align:center">${c.learners}</td>
      <td style="min-width:150px">${progressCell(c.progress)}</td>
      <td>${statusBadge(c.status)}</td>
      <td style="color:var(--text-secondary)">${c.trainer}</td>
      <td style="color:var(--text-muted)">${c.updated}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="showToast('info','Aperçu de la formation')"><i class="fas fa-eye"></i></button>
        <button class="btn btn-secondary btn-sm" style="margin-left:4px" onclick="showToast('info','Édition…')"><i class="fas fa-pen"></i></button>
        <button class="btn btn-danger btn-sm" style="margin-left:4px" onclick="showToast('error','Formation supprimée')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`).join('');
  return `
  <div class="page-header">
    <div class="page-header-left"><h1>Formations</h1><p>${MOCK.courses.length} formations disponibles</p></div>
    <div class="page-header-actions">
      <button class="btn btn-secondary"><i class="fas fa-file-csv"></i> Exporter</button>
      <button class="btn btn-primary" onclick="showToast('success','Nouvelle formation créée')"><i class="fas fa-plus"></i> Créer une formation</button>
    </div>
  </div>
  <div class="card">
    ${toolbar('Rechercher une formation…', [{v:'',l:'Tous les statuts'},{v:'publié',l:'Publiées'},{v:'brouillon',l:'Brouillons'},{v:'archivé',l:'Archivées'}])}
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Titre</th><th>Catégorie</th><th style="text-align:center">Apprenants</th><th>Progression globale</th><th>Statut</th><th>Formateur</th><th>Mis à jour</th><th>Actions</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
};

/* ─────────────── GAMES ─────────────── */
Pages.games = function() {
  return `
  <div class="page-header">
    <div class="page-header-left"><h1>Jeux</h1><p>Gestion des jeux VR disponibles sur la plateforme</p></div>
    <div class="page-header-actions">
      <button class="btn btn-primary" onclick="showToast('success','Nouveau jeu créé')"><i class="fas fa-plus"></i> Nouveau jeu</button>
    </div>
  </div>
  <div class="kpi-grid" style="margin-bottom:24px">
    <div class="kpi-card" style="--kpi-color:#6C5CE7">
      <div class="kpi-header"><span class="kpi-label">Jeux publiés</span><div class="kpi-icon"><i class="fas fa-gamepad"></i></div></div>
      <div class="kpi-value">28</div>
    </div>
    <div class="kpi-card" style="--kpi-color:#fdcb6e">
      <div class="kpi-header"><span class="kpi-label">Brouillons</span><div class="kpi-icon"><i class="fas fa-pencil-alt"></i></div></div>
      <div class="kpi-value">4</div>
    </div>
    <div class="kpi-card" style="--kpi-color:#00cec9">
      <div class="kpi-header"><span class="kpi-label">Parties jouées</span><div class="kpi-icon"><i class="fas fa-play"></i></div></div>
      <div class="kpi-value">5 204</div>
    </div>
    <div class="kpi-card" style="--kpi-color:#fd79a8">
      <div class="kpi-header"><span class="kpi-label">Note moyenne</span><div class="kpi-icon"><i class="fas fa-star"></i></div></div>
      <div class="kpi-value">4.5</div>
    </div>
  </div>
  <div class="scenario-grid">
    ${MOCK.games.map(g => `
    <div class="scenario-card" onclick="showToast('info','Gestion du jeu : ${g.title}')">
      <div class="scenario-thumb" style="background:linear-gradient(135deg,#1a1a3e,#2d2d5e)">
        <i class="fas fa-vr-cardboard" style="font-size:42px;color:var(--primary-light);opacity:.7"></i>
        <span style="position:absolute;top:10px;right:10px">${statusBadge(g.status)}</span>
      </div>
      <div class="scenario-body">
        <div class="scenario-title">${g.title}</div>
        <div class="scenario-meta">
          <span><i class="fas fa-tag"></i> ${g.category}</span>
          <span><i class="fas fa-film"></i> ${g.scenarios} scénarios</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">
          <div>${stars(g.rating)}</div>
          <span style="font-size:12px;color:var(--text-muted)"><i class="fas fa-play"></i> ${g.plays.toLocaleString('fr-FR')}</span>
        </div>
        <div style="display:flex;gap:6px;margin-top:12px">
          <button class="btn btn-secondary btn-sm" style="flex:1" onclick="event.stopPropagation();showToast('info','Édition du jeu')"><i class="fas fa-pen"></i> Modifier</button>
          <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();showToast('error','Suppression…')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
};

/* ─────────────── SKILLS ─────────────── */
Pages.skills = function() {
  const rows = MOCK.skills.map(s => `
    <tr>
      <td style="font-weight:600;color:var(--text-primary)">${s.name}</td>
      <td>${diffBadge(s.level)}</td>
      <td style="text-align:center">${s.games}</td>
      <td style="text-align:center">${s.learners.toLocaleString('fr-FR')}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="showToast('info','Modifier la compétence')"><i class="fas fa-pen"></i></button>
        <button class="btn btn-danger btn-sm" style="margin-left:4px" onclick="showToast('error','Compétence supprimée')"><i class="fas fa-trash"></i></button>
      </td>
    </tr>`).join('');
  return `
  <div class="page-header">
    <div class="page-header-left"><h1>Compétences</h1><p>Référentiel de compétences associées aux formations</p></div>
    <div class="page-header-actions">
      <button class="btn btn-primary" onclick="showToast('success','Compétence créée')"><i class="fas fa-plus"></i> Nouvelle compétence</button>
    </div>
  </div>
  <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:24px">
    ${MOCK.skills.map(s => `<div class="skill-tag" onclick="showToast('info','Filtre : ${s.name}')"><i class="fas fa-star"></i>${s.name}</div>`).join('')}
  </div>
  <div class="card">
    ${toolbar('Rechercher une compétence…')}
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Compétence</th><th>Niveau</th><th style="text-align:center">Jeux liés</th><th style="text-align:center">Apprenants</th><th>Actions</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
};

/* ─────────────── SESSIONS ─────────────── */
Pages.sessions = function() {
  const rows = MOCK.sessions.map(s => `
    <tr>
      <td style="font-weight:600;color:var(--text-primary)">${s.title}</td>
      <td style="color:var(--text-secondary)">${s.course}</td>
      <td><i class="fas fa-calendar" style="color:var(--primary-light);margin-right:5px"></i>${s.date}</td>
      <td>${s.time}</td>
      <td style="text-align:center">${s.learners}</td>
      <td style="color:var(--text-secondary)">${s.trainer}</td>
      <td>${statusBadge(s.status)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="showToast('info','Détails de la session')"><i class="fas fa-eye"></i></button>
        <button class="btn btn-danger btn-sm" style="margin-left:4px" onclick="showToast('error','Session annulée')"><i class="fas fa-times"></i></button>
      </td>
    </tr>`).join('');
  return `
  <div class="page-header">
    <div class="page-header-left"><h1>Sessions</h1><p>Planification et gestion des sessions de formation</p></div>
    <div class="page-header-actions">
      <button class="btn btn-primary" onclick="showToast('success','Nouvelle session planifiée')"><i class="fas fa-calendar-plus"></i> Planifier</button>
    </div>
  </div>
  <div class="card">
    ${toolbar('Rechercher une session…', [{v:'',l:'Tous les statuts'},{v:'planifiée',l:'Planifiées'},{v:'terminée',l:'Terminées'},{v:'annulée',l:'Annulées'}])}
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Session</th><th>Formation</th><th>Date</th><th>Heure</th><th style="text-align:center">Apprenants</th><th>Formateur</th><th>Statut</th><th>Actions</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
};

/* ─────────────── SCENARIOS ─────────────── */
Pages.scenarios = function() {
  return `
  <div class="page-header">
    <div class="page-header-left"><h1>Scénarios</h1><p>Contenu pédagogique immersif des jeux VR</p></div>
    <div class="page-header-actions">
      <button class="btn btn-primary" onclick="showToast('success','Scénario créé')"><i class="fas fa-plus"></i> Nouveau scénario</button>
    </div>
  </div>
  <div class="scenario-grid">
    ${MOCK.scenarios.map(s => `
    <div class="scenario-card" onclick="showToast('info','Scénario : ${s.title}')">
      <div class="scenario-thumb">
        <span style="font-size:50px">${s.emoji}</span>
      </div>
      <div class="scenario-body">
        <div class="scenario-title">${s.title}</div>
        <div class="scenario-meta" style="margin-bottom:10px">
          <span><i class="fas fa-gamepad"></i> ${s.game}</span>
          <span><i class="fas fa-clock"></i> ${s.duration}</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between">
          ${diffBadge(s.difficulty)}
          <div style="display:flex;gap:6px">
            <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation();showToast('info','Édition scénario')"><i class="fas fa-pen"></i></button>
            <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();showToast('error','Scénario supprimé')"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
};

/* ─────────────── MEDIA ─────────────── */
Pages.media = function() {
  const items = [
    {type:'video',icon:'fa-video',   name:'Intro sécurité incendie.mp4',    size:'245 Mo', date:'10 avr. 2025'},
    {type:'image',icon:'fa-image',   name:'Panneau soudage.png',             size:'3,2 Mo', date:'8 avr. 2025'},
    {type:'video',icon:'fa-video',   name:'Démonstration chariot.mp4',       size:'512 Mo', date:'5 avr. 2025'},
    {type:'doc',  icon:'fa-file-pdf',name:'Guide habilitation électrique.pdf',size:'1,8 Mo',date:'2 avr. 2025'},
    {type:'image',icon:'fa-image',   name:'Carte évacuation.jpg',            size:'4,5 Mo', date:'28 mars 2025'},
    {type:'audio',icon:'fa-music',   name:'Narration premiers secours.mp3',  size:'18 Mo',  date:'20 mars 2025'},
  ];
  return `
  <div class="page-header">
    <div class="page-header-left"><h1>Médiathèque</h1><p>Gestion des ressources multimédia</p></div>
    <div class="page-header-actions">
      <button class="btn btn-primary" onclick="showToast('success','Importation de fichier…')"><i class="fas fa-upload"></i> Importer</button>
    </div>
  </div>
  <div class="info-block"><i class="fas fa-info-circle"></i><span>Les fichiers vidéo 360° doivent être en format MP4 H.264 ou WebM pour une compatibilité optimale avec les casques VR.</span></div>
  <div class="scenario-grid">
    ${items.map(f => `
    <div class="card" style="display:flex;align-items:center;gap:14px;cursor:pointer" onclick="showToast('info','Aperçu de ${f.name}')">
      <div style="width:48px;height:48px;border-radius:var(--radius-sm);background:rgba(108,92,231,0.15);display:flex;align-items:center;justify-content:center;font-size:20px;color:var(--primary-light);flex-shrink:0">
        <i class="fas ${f.icon}"></i>
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-weight:600;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${f.name}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:3px">${f.size} · ${f.date}</div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();showToast('error','Fichier supprimé')"><i class="fas fa-trash"></i></button>
    </div>`).join('')}
  </div>`;
};

/* ─────────────── EVALUATIONS ─────────────── */
Pages.evaluations = function() {
  const evals = [
    {title:'QCM Sécurité incendie',        course:'Sécurité incendie VR',      avg:82, submissions:245, pass:88},
    {title:'Évaluation pratique chariot',   course:'Conduite de chariot',       avg:74, submissions:132, pass:71},
    {title:'Test premiers secours',         course:'Premiers secours Niv. 2',   avg:91, submissions:89,  pass:95},
    {title:'Examen habilitation B1',        course:'Habilitation électrique',   avg:68, submissions:203, pass:62},
  ];
  const rows = evals.map(e => `
    <tr>
      <td style="font-weight:600;color:var(--text-primary)">${e.title}</td>
      <td style="color:var(--text-secondary)">${e.course}</td>
      <td style="text-align:center">${e.submissions}</td>
      <td style="text-align:center">
        <span style="font-weight:700;color:${e.avg>=80?'var(--success)':e.avg>=60?'var(--warning)':'var(--danger)'}">${e.avg}%</span>
      </td>
      <td>${progressCell(e.pass)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="showToast('info','Résultats détaillés')"><i class="fas fa-chart-bar"></i> Résultats</button>
      </td>
    </tr>`).join('');
  return `
  <div class="page-header">
    <div class="page-header-left"><h1>Évaluations</h1><p>Suivi des évaluations et résultats des apprenants</p></div>
    <div class="page-header-actions">
      <button class="btn btn-primary" onclick="showToast('success','Évaluation créée')"><i class="fas fa-plus"></i> Créer une évaluation</button>
    </div>
  </div>
  <div class="card">
    <div class="table-wrapper">
      <table class="data-table">
        <thead><tr>
          <th>Évaluation</th><th>Formation</th><th style="text-align:center">Soumissions</th><th style="text-align:center">Score moyen</th><th>Taux de réussite</th><th>Actions</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
};

/* ─────────────── REPORTS ─────────────── */
Pages.reports = function() {
  return `
  <div class="page-header">
    <div class="page-header-left"><h1>Rapports & Analytiques</h1><p>Données de performance de la plateforme</p></div>
    <div class="page-header-actions">
      <button class="btn btn-secondary" onclick="showToast('info','Export PDF…')"><i class="fas fa-file-pdf"></i> Exporter PDF</button>
      <button class="btn btn-secondary" onclick="showToast('info','Export CSV…')"><i class="fas fa-file-csv"></i> Exporter CSV</button>
    </div>
  </div>
  <div class="kpi-grid" style="margin-bottom:24px">
    <div class="kpi-card" style="--kpi-color:#00b894"><div class="kpi-header"><span class="kpi-label">Taux de complétion</span><div class="kpi-icon"><i class="fas fa-check-circle"></i></div></div><div class="kpi-value">78%</div><div class="kpi-footer"><span class="kpi-trend up"><i class="fas fa-arrow-up"></i> +4%</span> vs trimestre préc.</div></div>
    <div class="kpi-card" style="--kpi-color:#fdcb6e"><div class="kpi-header"><span class="kpi-label">Temps moyen</span><div class="kpi-icon"><i class="fas fa-clock"></i></div></div><div class="kpi-value">24 min</div><div class="kpi-footer"><span class="kpi-trend down"><i class="fas fa-arrow-down"></i> -2 min</span> par session</div></div>
    <div class="kpi-card" style="--kpi-color:#74b9ff"><div class="kpi-header"><span class="kpi-label">Satisfaction</span><div class="kpi-icon"><i class="fas fa-smile"></i></div></div><div class="kpi-value">4.6/5</div><div class="kpi-footer"><span class="kpi-trend up"><i class="fas fa-arrow-up"></i> +0.2</span> vs mois dernier</div></div>
    <div class="kpi-card" style="--kpi-color:#fd79a8"><div class="kpi-header"><span class="kpi-label">Certifications</span><div class="kpi-icon"><i class="fas fa-certificate"></i></div></div><div class="kpi-value">842</div><div class="kpi-footer"><span class="kpi-trend up"><i class="fas fa-arrow-up"></i> +67</span> ce mois</div></div>
  </div>
  <div class="cols-2">
    <div class="card">
      <div class="card-header"><h3 class="section-title" style="margin:0"><i class="fas fa-chart-line"></i> Inscriptions 2025</h3></div>
      <div class="chart-container" style="height:230px"><canvas id="reportChart1" class="chart-canvas"></canvas></div>
    </div>
    <div class="card">
      <div class="card-header"><h3 class="section-title" style="margin:0"><i class="fas fa-chart-bar"></i> Taux de complétion (%)</h3></div>
      <div class="chart-container" style="height:230px"><canvas id="reportChart2" class="chart-canvas"></canvas></div>
    </div>
  </div>`;
};

/* ─────────────── HOMEPAGE ─────────────── */
Pages.homepage = function() {
  return `
  <div class="page-header">
    <div class="page-header-left"><h1>Page d'accueil</h1><p>Configuration de la page d'accueil publique Immersium</p></div>
    <div class="page-header-actions">
      <button class="btn btn-secondary" onclick="showToast('info','Aperçu ouvert')"><i class="fas fa-eye"></i> Aperçu</button>
      <button class="btn btn-primary" onclick="showToast('success','Page d\'accueil publiée !')"><i class="fas fa-save"></i> Publier</button>
    </div>
  </div>
  <div class="cols-2">
    <div class="card">
      <h3 class="section-title"><i class="fas fa-pen"></i> Contenu principal</h3>
      <div class="form-group"><label class="form-label">Titre principal</label><input class="form-control" value="Formez-vous en réalité virtuelle" /></div>
      <div class="form-group"><label class="form-label">Sous-titre</label><input class="form-control" value="Des formations immersives pour vos équipes" /></div>
      <div class="form-group"><label class="form-label">Description</label><textarea class="form-control" rows="4">Immersium propose des formations en réalité virtuelle innovantes pour améliorer les compétences de vos collaborateurs dans un environnement sécurisé et engageant.</textarea></div>
      <div class="form-group"><label class="form-label">Bouton d'action (CTA)</label><input class="form-control" value="Commencer maintenant" /></div>
    </div>
    <div class="card">
      <h3 class="section-title"><i class="fas fa-palette"></i> Apparence</h3>
      <div class="form-group"><label class="form-label">Couleur principale</label><input class="form-control" type="color" value="#6C5CE7" style="height:42px;padding:4px" /></div>
      <div class="form-group"><label class="form-label">Logo</label>
        <div style="border:2px dashed var(--border);border-radius:var(--radius-sm);padding:24px;text-align:center;color:var(--text-muted);cursor:pointer" onclick="showToast('info','Sélection du logo')">
          <i class="fas fa-upload" style="font-size:24px;margin-bottom:8px;display:block"></i>
          Glissez votre logo ici
        </div>
      </div>
      <div class="form-group"><label class="form-label">Image de fond</label>
        <div style="border:2px dashed var(--border);border-radius:var(--radius-sm);padding:24px;text-align:center;color:var(--text-muted);cursor:pointer" onclick="showToast('info','Sélection de l\'image')">
          <i class="fas fa-image" style="font-size:24px;margin-bottom:8px;display:block"></i>
          Glissez votre image ici (16:9)
        </div>
      </div>
    </div>
  </div>
  <div class="card">
    <h3 class="section-title"><i class="fas fa-list"></i> Sections affichées</h3>
    ${[
      ['Section Héros (bannière principale)', true],
      ['Compteurs de statistiques', true],
      ['Grille des formations phares', true],
      ['Témoignages apprenants', false],
      ['Section contact / inscription', true],
      ['Pied de page avec liens légaux', true],
    ].map(([label, on]) => `
    <div class="settings-row">
      <div><div class="settings-label">${label}</div></div>
      <label class="switch"><input type="checkbox" ${on?'checked':''} onchange="showToast('info','Paramètre mis à jour')"><span class="slider"></span></label>
    </div>`).join('')}
  </div>`;
};

/* ─────────────── ACCESS & API ─────────────── */
Pages.access = function() {
  return `
  <div class="page-header">
    <div class="page-header-left"><h1>Accès & API</h1><p>Gestion des clés d'API et des intégrations externes</p></div>
    <div class="page-header-actions">
      <button class="btn btn-primary" onclick="showToast('success','Nouvelle clé générée !')"><i class="fas fa-plus"></i> Générer une clé</button>
    </div>
  </div>
  <div class="info-block"><i class="fas fa-shield-alt"></i><span>Gardez vos clés API confidentielles. Ne les partagez jamais dans du code source public.</span></div>
  <div class="card" style="margin-bottom:20px">
    <h3 class="section-title"><i class="fas fa-key"></i> Clés API actives</h3>
    ${MOCK.apiKeys.map(k => `
    <div style="margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--border)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;flex-wrap:wrap;gap:8px">
        <div style="font-weight:600">${k.name} ${statusBadge(k.status)}</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm" onclick="showToast('info','Clé copiée !')"><i class="fas fa-copy"></i> Copier</button>
          <button class="btn btn-danger btn-sm" onclick="showToast('error','Clé révoquée')"><i class="fas fa-trash"></i> Révoquer</button>
        </div>
      </div>
      <div class="api-key-row">
        <span class="key-val">${k.key}</span>
        <button class="btn-icon" style="width:24px;height:24px" onclick="showToast('info','Clé copiée !')"><i class="fas fa-copy" style="font-size:11px"></i></button>
      </div>
      <div style="display:flex;gap:16px;margin-top:8px;font-size:12px;color:var(--text-muted)">
        <span><i class="fas fa-lock" style="margin-right:4px"></i>${k.scope}</span>
        <span><i class="fas fa-calendar" style="margin-right:4px"></i>Expire le ${k.expires}</span>
      </div>
    </div>`).join('')}
  </div>
  <div class="card">
    <h3 class="section-title"><i class="fas fa-plug"></i> Webhooks</h3>
    <div class="info-block"><i class="fas fa-info-circle"></i><span>Les webhooks permettent de notifier votre système externe lors d'événements Immersium (inscription, complétion, etc.).</span></div>
    ${[
      {url:'https://api.example.com/hooks/immersium', events:'inscription, complétion', status:'Actif'},
      {url:'https://hr.company.com/lrs/xapi',        events:'toutes les activités',     status:'Actif'},
    ].map(w => `
    <div class="settings-row">
      <div>
        <div class="settings-label"><code style="font-family:monospace;font-size:12px;color:var(--secondary)">${w.url}</code></div>
        <div class="settings-desc">Événements : ${w.events}</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        ${statusBadge(w.status)}
        <button class="btn btn-danger btn-sm" onclick="showToast('error','Webhook supprimé')"><i class="fas fa-trash"></i></button>
      </div>
    </div>`).join('')}
    <button class="btn btn-secondary btn-sm" style="margin-top:12px" onclick="showToast('success','Webhook ajouté')"><i class="fas fa-plus"></i> Ajouter un webhook</button>
  </div>`;
};

/* ─────────────── SETTINGS ─────────────── */
Pages.settings = function() {
  return `
  <div class="page-header">
    <div class="page-header-left"><h1>Paramètres</h1><p>Configuration technique de la plateforme Immersium</p></div>
    <div class="page-header-actions">
      <button class="btn btn-primary" onclick="showToast('success','Paramètres sauvegardés !')"><i class="fas fa-save"></i> Sauvegarder</button>
    </div>
  </div>
  <div class="cols-2">
    <div class="card">
      <h3 class="section-title"><i class="fas fa-globe"></i> Général</h3>
      <div class="form-group"><label class="form-label">Nom de la plateforme</label><input class="form-control" value="Immersium" /></div>
      <div class="form-group"><label class="form-label">URL de la plateforme</label><input class="form-control" value="https://app.immersium.io" /></div>
      <div class="form-group"><label class="form-label">Langue par défaut</label>
        <select class="form-control filter-select" style="width:100%">
          <option selected>Français</option><option>English</option><option>Español</option>
        </select>
      </div>
      <div class="form-group"><label class="form-label">Fuseau horaire</label>
        <select class="form-control filter-select" style="width:100%">
          <option selected>Europe/Paris (UTC+1)</option><option>UTC</option>
        </select>
      </div>
    </div>
    <div class="card">
      <h3 class="section-title"><i class="fas fa-envelope"></i> Notifications e-mail</h3>
      ${[
        ['Nouvel utilisateur inscrit', true],
        ['Formation complétée', true],
        ['Bug signalé', true],
        ['Clé API expirée', false],
        ['Rapport hebdomadaire', true],
      ].map(([label, on]) => `
      <div class="settings-row">
        <div><div class="settings-label">${label}</div></div>
        <label class="switch"><input type="checkbox" ${on?'checked':''} onchange="showToast('info','Préférence mise à jour')"><span class="slider"></span></label>
      </div>`).join('')}
    </div>
  </div>
  <div class="cols-2">
    <div class="card">
      <h3 class="section-title"><i class="fas fa-shield-alt"></i> Sécurité</h3>
      ${[
        ['Authentification à deux facteurs (2FA)', true],
        ['Connexion SSO / SAML', false],
        ['Expiration de session (30 min)', true],
        ['Journalisation des accès', true],
      ].map(([label, on]) => `
      <div class="settings-row">
        <div><div class="settings-label">${label}</div></div>
        <label class="switch"><input type="checkbox" ${on?'checked':''} onchange="showToast('info','Paramètre mis à jour')"><span class="slider"></span></label>
      </div>`).join('')}
    </div>
    <div class="card">
      <h3 class="section-title"><i class="fas fa-vr-cardboard"></i> Compatibilité VR</h3>
      ${[
        ['Meta Quest 2 / 3', true],
        ['HTC Vive', true],
        ['Pico 4', false],
        ['Valve Index', true],
        ['Mode WebXR (navigateur)', true],
      ].map(([label, on]) => `
      <div class="settings-row">
        <div><div class="settings-label">${label}</div></div>
        <label class="switch"><input type="checkbox" ${on?'checked':''} onchange="showToast('info','Casque mis à jour')"><span class="slider"></span></label>
      </div>`).join('')}
    </div>
  </div>`;
};
