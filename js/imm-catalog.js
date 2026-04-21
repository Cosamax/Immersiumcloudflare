/**
 * imm-catalog.js — Module dynamique Immersium
 * 
 * Charge le catalogue depuis 3 sources (par priorité) :
 *  1. localStorage (données persistées par l'admin-editor)
 *  2. API serveur (/functions/games-read — Cloudflare KV)
 *  3. Fichier statique data/catalogue.json (fallback)
 *
 * Puis génère automatiquement :
 *  - window.IMM_CATALOG, IMM_SIMS, IMM_CATALOG_NUMS
 *  - Les menus de navigation (pub-cat-grid + pub-cat-footer + pub-cat-header)
 *  - La page catalogue (cat-nav-dynamic + cat-accordions-dynamic + compteurs)
 *
 * Usage : <script src="js/imm-catalog.js"></script>
 */
(function () {
  'use strict';

  const LS_KEY = 'imm_catalogue_data';

  /* ── Icônes SVG par domaine (slug) ──────────────────────── */
  const DOMAIN_ICONS = {
    'intelligence-artificielle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L13.5 8.5 19 10 13.5 11.5 12 17 10.5 11.5 5 10 10.5 8.5z"/><path d="M19 17l.75 2.25L22 20l-2.25.75L19 23l-.75-2.25L16 20l2.25-.75z"/></svg>',
    'strategie-marketing': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    'marketing-digital': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
    'communication-digitale': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    'communication-a-lere-du-digital': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    'transformation-digitale': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',
    'accueil-client': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    'relation-client': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
  };

  /* ── Descriptions par domaine ────────────────────────────── */
  const DOMAIN_DESCS = {
    'Intelligence Artificielle': 'IA générative, agents, data pipelines, productivité augmentée.',
    'Stratégie Marketing': 'Diagnostic, plan marketing, pilotage ROI, positionnement.',
    'Marketing Digital': 'SEO, SEA, social, email, e-commerce, marketing automation.',
    "Communication à l'ère du digital": 'Communication digitale, gestion de crise, prise de parole.',
    'Transformation Digitale': 'Cloud, conduite du changement, gouvernance IT, leadership tech.',
    'Accueil Client': 'CRM, expérience client, fidélisation, customer success.',
    'Relation Client': 'CRM, expérience client, fidélisation, customer success.'
  };

  /* ── Icône par défaut ──────────────────────────────────── */
  const DEFAULT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';

  /* ── Slugifier ─────────────────────────────────────────── */
  function slugify(str) {
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/['']/g, '-')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  /* ── Couleur de niveau ─────────────────────────────────── */
  function levelColor(level) {
    if (!level) return 'var(--ink-soft)';
    const l = level.toLowerCase();
    if (l.includes('débutant') || l.includes('debutant')) return 'var(--green, #059669)';
    if (l.includes('intermédiaire') || l.includes('intermediaire')) return 'var(--marine, #1e40af)';
    if (l.includes('avancé') || l.includes('avance')) return 'var(--coral, #dc2626)';
    return 'var(--ink-soft)';
  }

  /* ── Source 1 : localStorage ───────────────────────────── */
  function loadFromLocalStorage() {
    try {
      // Essayer le nouveau format (imm_catalogue_data)
      var data = localStorage.getItem(LS_KEY);
      if (data) {
        var parsed = JSON.parse(data);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          console.log('[imm-catalog] Chargé depuis localStorage (' + Object.keys(parsed).length + ' jeux)');
          return parsed;
        }
      }
      // Essayer l'ancien format (imm_catalogue_custom)
      data = localStorage.getItem('imm_catalogue_custom');
      if (data) {
        var parsed2 = JSON.parse(data);
        if (parsed2 && typeof parsed2 === 'object' && Object.keys(parsed2).length > 0) {
          console.log('[imm-catalog] Chargé depuis localStorage custom (' + Object.keys(parsed2).length + ' jeux)');
          return parsed2;
        }
      }
    } catch (e) {
      console.warn('[imm-catalog] Erreur localStorage:', e);
    }
    return null;
  }

  /* ── Source 2 : API serveur (Cloudflare KV) ────────────── */
  async function loadFromServer() {
    try {
      var resp = await fetch('/functions/games-read?published=true', { signal: AbortSignal.timeout(5000) });
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      var data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        var catalogue = {};
        data.forEach(function(game) { if (game.id) catalogue[game.id] = game; });
        console.log('[imm-catalog] Chargé depuis API serveur (' + Object.keys(catalogue).length + ' jeux)');
        try { localStorage.setItem(LS_KEY, JSON.stringify(catalogue)); } catch(e) {}
        return catalogue;
      }
    } catch (e) {
      console.warn('[imm-catalog] API serveur indisponible:', e.message);
    }
    return null;
  }

  /* ── Source 3 : catalogue.json statique ─────────────────── */
  async function loadFromFile() {
    try {
      var resp = await fetch('data/catalogue.json');
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      var data = await resp.json();
      console.log('[imm-catalog] Chargé depuis catalogue.json (' + Object.keys(data).length + ' jeux)');
      return data;
    } catch (e) {
      console.error('[imm-catalog] Erreur chargement catalogue.json:', e);
      return {};
    }
  }

  /* ── Fusionner deux catalogues ─────────────────────────── */
  function mergeCatalogues(base, overlay) {
    if (!overlay || Object.keys(overlay).length === 0) return base;
    if (!base || Object.keys(base).length === 0) return overlay;
    var merged = Object.assign({}, base);
    Object.keys(overlay).forEach(function(id) {
      merged[id] = overlay[id];
    });
    return merged;
  }

  /* ── Chargement multi-sources ──────────────────────────── */
  async function loadCatalogue() {
    var lsData = loadFromLocalStorage();
    var fileData = await loadFromFile();
    var serverData = await loadFromServer();

    var catalogue = fileData || {};
    if (lsData) catalogue = mergeCatalogues(catalogue, lsData);
    if (serverData) catalogue = mergeCatalogues(catalogue, serverData);

    try { localStorage.setItem(LS_KEY, JSON.stringify(catalogue)); } catch(e) {}
    return catalogue;
  }

  /* ── Construire le CATALOG ─────────────────────────────── */
  function buildCatalog(rawCatalogue) {
    var catalog = {};
    var sims = {};
    var nums = {};

    var entries = Object.entries(rawCatalogue)
      .filter(function(e) { return e[1].published !== false; })
      .sort(function(a, b) {
        return (parseInt(a[1].numero || a[1].num) || 99) - (parseInt(b[1].numero || b[1].num) || 99);
      });

    entries.forEach(function(entry) {
      var id = entry[0], game = entry[1];
      var num = game.numero || game.num || '??';
      var numStr = String(num).padStart(2, '0');
      catalog[id] = {
        num: numStr,
        name: (game.id || id).toUpperCase(),
        domain: game.domain || 'Autre',
        color: game.color || '#333',
        level: game.level || '',
        challenges: game.challenges || 0,
        title: game.title || '',
        subtitle: game.subtitle || '',
        description: game.description || '',
        skills: game.skills || [],
        sessions: game.sessions || [],
        price: game.price || '49 €',
        bg: game.bg || ''
      };
      sims[id] = (game.id || id).toUpperCase() + ' — ' + (game.domain || 'Autre');
      nums[numStr] = id;
    });

    return { catalog: catalog, sims: sims, nums: nums };
  }

  /* ── Grouper par domaine ───────────────────────────────── */
  function groupByDomain(catalog) {
    var groups = {};
    Object.keys(catalog).forEach(function(id) {
      var info = catalog[id];
      var d = info.domain;
      if (!groups[d]) groups[d] = [];
      groups[d].push(Object.assign({ id: id }, info));
    });
    Object.values(groups).forEach(function(arr) {
      arr.sort(function(a, b) { return parseInt(a.num) - parseInt(b.num); });
    });
    return groups;
  }

  /* ── Générer le menu catalogue (pub-cat-grid) ──────────── */
  function renderCatGrid(groups) {
    var html = '';
    Object.keys(groups).forEach(function(domain) {
      var slug = slugify(domain);
      var icon = DOMAIN_ICONS[slug] || DEFAULT_ICON;
      var games = groups[domain];
      html += '<div class="pub-cat-col">';
      html += '<div class="cat-head"><div class="ic"><span class="ic-svg" style="display:flex;align-items:center;justify-content:center;width:100%;height:100%">' + icon + '</span></div>';
      html += '<div class="n">' + domain + '</div></div><ul>';
      games.forEach(function(g) {
        html += '<li><a href="game.html?game=' + g.id + '"><span class="num">' + g.num + '</span><span class="nm">' + g.name + '</span></a></li>';
      });
      html += '</ul></div>';
    });
    return html;
  }

  /* ── Générer le footer catalogue (pub-cat-footer) ──────── */
  function renderCatFooter(groups, totalCount) {
    var html = '<a href="catalogue.html" class="primary">Toutes<span class="cnt">' + totalCount + ' simulations</span></a>';
    Object.keys(groups).forEach(function(domain) {
      var slug = slugify(domain);
      html += '<a href="catalogue.html?c=' + slug + '">' + domain + '<span class="cnt">' + groups[domain].length + '</span></a>';
    });
    return html;
  }

  /* ── Générer le header catalogue ───────────────────────── */
  function renderCatHeader(totalCount) {
    return '<div class="title">' + totalCount + ' simulations par <em>compétence</em></div>' +
      '<a href="catalogue.html" class="all">Voir tout le catalogue →</a>';
  }

  /* ═══════════════════════════════════════════════════════════
     CATALOGUE PAGE : navigation rapide + accordéons + cartes
     ═══════════════════════════════════════════════════════════ */

  /* ── Navigation rapide par compétence ──────────────────── */
  function renderCatNav(groups, totalCount) {
    var html = '<a class="all" onclick="openAllAccordions()">Toutes<span class="cnt">' + totalCount + '</span></a>';
    Object.keys(groups).forEach(function(domain) {
      var slug = slugify(domain);
      var icon = DOMAIN_ICONS[slug] || DEFAULT_ICON;
      html += '<a href="#cat-' + slug + '" data-cat="' + slug + '">';
      html += '<span class="ic-svg" style="width:14px;height:14px;display:inline-flex;align-items:center;justify-content:center;vertical-align:middle;margin-right:6px">' + icon + '</span>';
      html += domain + '<span class="cnt">' + groups[domain].length + '</span></a>';
    });
    html += '<button class="expand-all" onclick="toggleAllAccordions()" id="expand-toggle">Tout replier</button>';
    html += '<div class="search"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>';
    html += '<input id="cat-search" placeholder="Rechercher…" oninput="filterCatalog(this.value)"></div>';
    return html;
  }

  /* ── Carte de simulation ───────────────────────────────── */
  function renderSimCard(game) {
    var totalDefis = game.challenges || 21;
    var sessCount = (game.sessions || []).length;
    var tags = (game.skills || []).slice(0, 3);
    var color = game.color || '#333';

    var html = '<a class="sim-card" href="game.html?game=' + game.id + '" data-domain="' + slugify(game.domain) + '" style="text-decoration:none;color:inherit;cursor:pointer">';
    html += '<div class="sim-banner" data-num="' + game.num + '" style="background:linear-gradient(135deg,' + color + ',' + color + 'dd);">';
    html += '<div class="sim-banner-content">';
    html += '<div class="sim-ord">N° ' + game.num + '</div>';
    html += '<div class="sim-title">' + game.name + '</div>';
    html += '</div></div>';
    html += '<div class="sim-body">';
    html += '<div class="sim-h3">' + (game.subtitle || '') + '</div>';
    html += '<p class="sim-desc">' + (game.description || '').substring(0, 150) + '</p>';
    if (tags.length > 0) {
      html += '<div class="sim-tags">';
      tags.forEach(function(t) { html += '<span class="pill pill-outline">' + t + '</span>'; });
      html += '</div>';
    }
    html += '<div class="sim-meta">';
    html += '<span class="ch"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="6 4 20 12 6 20 6 4"/></svg>' + totalDefis + ' défis · ' + (sessCount || 3) + ' sessions</span>';
    html += '<span class="sim-level" style="color:' + levelColor(game.level) + '">' + (game.level || '') + '</span>';
    html += '</div></div>';
    html += '<div class="sim-footer">';
    html += '<div class="price">49€ <span class="unit">HT</span></div>';
    html += '<span class="free">Défi 1 offert <svg viewBox="0 0 24 24" fill="currentColor" style="display:inline-block;vertical-align:-2px" width="11" height="11"><path d="M12 2L13.5 8.5 20 10 13.5 11.5 12 20 10.5 11.5 4 10 10.5 8.5z"/></svg></span>';
    html += '<div class="sim-footer-actions">';
    html += '<a href="game.html?game=' + game.id + '&ch=1" class="btn-try" onclick="event.stopPropagation()">Essai gratuit</a>';
    html += '<a href="paiement.html?plan=solo&sim=' + game.id + '" class="btn-buy" onclick="event.stopPropagation()">Acheter 49€ →</a>';
    html += '</div></div></a>';
    return html;
  }

  /* ── Accordéon par compétence ───────────────────────────── */
  function renderAccordions(groups) {
    var html = '';
    Object.keys(groups).forEach(function(domain, idx) {
      var slug = slugify(domain);
      var icon = DOMAIN_ICONS[slug] || DEFAULT_ICON;
      var games = groups[domain];
      var desc = DOMAIN_DESCS[domain] || '';
      var openAttr = idx === 0 ? ' open' : '';

      html += '<details class="cat-accordion"' + openAttr + ' data-slug="' + slug + '" id="cat-' + slug + '">';
      html += '<summary class="cat-accordion-head"><div class="cat-head-left">';
      html += '<div class="cat-head-ic">' + icon + '</div>';
      html += '<div><div class="cat-head-n">' + domain + '</div>';
      html += '<div class="cat-head-desc">' + desc + '</div></div></div>';
      html += '<div class="cat-head-right"><span class="cat-head-count">' + games.length + ' simulation' + (games.length > 1 ? 's' : '') + '</span>';
      html += '<span class="cat-head-chev">▾</span></div></summary>';
      html += '<div class="cat-accordion-body"><div class="cat-grid">';
      games.forEach(function(g) { html += renderSimCard(g); });
      html += '</div></div></details>';
    });
    return html;
  }

  /* ── Injecter dans le DOM ──────────────────────────────── */
  function injectMenus(groups, totalCount) {
    // Menus de navigation (pub-cat-grid)
    document.querySelectorAll('.pub-cat-grid').forEach(function(el) { el.innerHTML = renderCatGrid(groups); });

    // Footer catalogue (pub-cat-footer)
    document.querySelectorAll('.pub-cat-footer').forEach(function(el) { el.innerHTML = renderCatFooter(groups, totalCount); });

    // Header catalogue (pub-cat-header)
    document.querySelectorAll('.pub-cat-header').forEach(function(el) { el.innerHTML = renderCatHeader(totalCount); });

    // Ajuster grid-template-columns
    var colCount = Object.keys(groups).length;
    document.querySelectorAll('.pub-cat-grid').forEach(function(el) {
      el.style.gridTemplateColumns = 'repeat(' + Math.min(colCount, 6) + ', 1fr)';
    });

    // === PAGE CATALOGUE : navigation rapide ===
    var navEl = document.getElementById('cat-nav-dynamic');
    if (navEl) {
      navEl.innerHTML = renderCatNav(groups, totalCount);
    }

    // === PAGE CATALOGUE : accordéons ===
    var accEl = document.getElementById('cat-accordions-dynamic');
    if (accEl) {
      accEl.innerHTML = renderAccordions(groups);
    }

    // === PAGE CATALOGUE : compteurs dans le header ===
    var totalSims = document.getElementById('cat-total-sims');
    if (totalSims) totalSims.textContent = totalCount;

    var totalDefis = document.getElementById('cat-total-defis');
    if (totalDefis) {
      var defisCount = 0;
      Object.values(groups).forEach(function(games) {
        games.forEach(function(g) {
          defisCount += (g.challenges || 21);
        });
      });
      totalDefis.textContent = defisCount;
    }
  }

  /* ── Point d'entrée ────────────────────────────────────── */
  async function init() {
    try {
      var raw = await loadCatalogue();
      var result = buildCatalog(raw);
      var catalog = result.catalog, sims = result.sims, nums = result.nums;
      var groups = groupByDomain(catalog);
      var totalCount = Object.keys(catalog).length;

      // Exposer globalement
      window.IMM_CATALOG = catalog;
      window.IMM_CATALOG_RAW = raw;
      window.IMM_SIMS = sims;
      window.IMM_CATALOG_NUMS = nums;
      window.IMM_DOMAINS = groups;
      window.IMM_TOTAL_SIMS = totalCount;

      // Rétro-compatibilité
      if (typeof window.CATALOG === 'undefined') window.CATALOG = catalog;
      if (typeof window.CATALOG_NUMS === 'undefined') window.CATALOG_NUMS = nums;

      // Injecter dans le DOM
      injectMenus(groups, totalCount);

      // Émettre un événement
      window.dispatchEvent(new CustomEvent('imm:catalog-ready', { detail: { catalog: catalog, sims: sims, nums: nums, groups: groups, totalCount: totalCount } }));
    } catch (err) {
      console.error('[imm-catalog] init error:', err);
    }
  }

  // Lancer au chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
