/**
 * imm-cms-loader.js — v2
 * Charge les contenus CMS depuis l'API page-contents et les injecte dans le DOM.
 *
 * Trois modes d'injection :
 *   1. data-cms / data-cms-html / data-cms-list attributes (existants dans le HTML)
 *   2. Mappings CSS selector → champ CMS centralisés (PAGE_MAPPINGS ci-dessous)
 *   3. Renderers spéciaux pour les pages légales (articles) et mentions
 *
 * Les clés préfixées (ex: "paiement.brand_name") sont automatiquement résolues
 * en retirant le préfixe correspondant au pageId.
 */

const CMS_API = 'https://immersium-api.mx-cosaque.workers.dev';

/* ═══════════════════════════════════════════════════════════════
   MAPPINGS CSS SELECTOR → CHAMP CMS
   type: 'text' (default) | 'html' | 'href' | 'src'
   ═══════════════════════════════════════════════════════════════ */
const PAGE_MAPPINGS = {

  contact: [
    { s: '.contact-head h1',           f: 'title',             t: 'html' },
    { s: '.contact-head .sub',         f: 'subtitle' },
    { s: '.form-submit',              f: 'form_button' },
    { s: '.contact-sidebar .info-card:nth-child(1) .ic-list li:nth-child(3) a',
                                       f: 'email' },
    { s: '.map-placeholder p',         f: 'adresse' },
    { s: '.map-footer',               f: 'adresse',            t: 'html' },
  ],

  coaching: [
    { s: '.coaching-hero h1',          f: 'title',             t: 'html' },
    { s: '.coaching-hero .sub',        f: 'subtitle' },
    // Steps
    { s: '.process-step:nth-child(1) h3', f: 'step_1_title' },
    { s: '.process-step:nth-child(1) p',  f: 'step_1_desc' },
    { s: '.process-step:nth-child(2) h3', f: 'step_2_title' },
    { s: '.process-step:nth-child(2) p',  f: 'step_2_desc' },
    { s: '.process-step:nth-child(3) h3', f: 'step_3_title' },
    { s: '.process-step:nth-child(3) p',  f: 'step_3_desc' },
    { s: '.process-step:nth-child(4) h3', f: 'step_4_title' },
    { s: '.process-step:nth-child(4) p',  f: 'step_4_desc' },
    // CTA band
    { s: '.cta-band h2',              f: 'cta_title',          t: 'html' },
    { s: '.cta-band p',               f: 'cta_desc' },
    { s: '.cta-band .btn-jade',       f: 'cta_button' },
    // FAQ coaching (rendered from faq_items array)
    { s: '.faq-list',                  f: 'faq_items',         t: 'faq' },
  ],

  tarifs: [
    // Hero is handled by data-cms / data-cms-html attributes
    // Full tarifs rendering is done by the special 'tarifs' renderer
    { s: '#section-particulier',       f: '_tarifs_b2c',       t: 'tarifs_b2c' },
    { s: '#section-b2b',               f: '_tarifs_b2b',       t: 'tarifs_b2b' },
    { s: '#reassurance-grid',          f: '_tarifs_reas',      t: 'tarifs_reas' },
    { s: '#tarifs-faq',                f: 'faq_items',         t: 'faq' },
    { s: '.cta-band h2',               f: 'cta_title',         t: 'html' },
    { s: '.cta-band p',                f: 'cta_desc' },
    { s: '.cta-band .btn-jade',        f: 'cta_button' },
  ],

  faq: [
    { s: '.page-hero h1',             f: 'title',             t: 'html' },
    // CTA card at bottom
    { s: '.section h3',               f: 'cta_title' },
    { s: '.section h3 + p',           f: 'cta_desc' },
    { s: '.section .btn-jade',        f: 'cta_button' },
  ],

  about: [
    // about.html already has data-cms attributes on most elements
    // Add CV items rendering
    { s: '.cv-grid',                   f: 'cv_items',          t: 'cv' },
  ],

  mentions: [
    { s: '.legal-hero h1',            f: 'title' },
    { s: '.legal-body',               f: '_mentions_render',   t: 'mentions' },
  ],

  // paiement, cgu, cgv already have data-cms attributes — handled by prefix stripping
};


/* ═══════════════════════════════════════════════════════════════
   MAIN LOADER
   ═══════════════════════════════════════════════════════════════ */
async function loadCmsPage(pageId) {
  let content = null;

  // 1. Fetch from API
  try {
    const resp = await fetch(`${CMS_API}/api/page-contents/${pageId}`);
    if (resp.ok) {
      const j = await resp.json();
      if (j && j.data) {
        let c = j.data.content;
        if (typeof c === 'string') {
          try { c = JSON.parse(c); } catch(e) { c = null; }
        }
        if (c && typeof c === 'object') content = c;
      }
    }
  } catch(e) {
    console.warn('CMS API indisponible pour', pageId, e.message);
  }

  // 2. Fallback to pages-content.json
  if (!content) {
    try {
      const resp = await fetch('/data/pages-content.json');
      if (resp.ok) {
        const all = await resp.json();
        if (all[pageId]) content = all[pageId];
      }
    } catch(e) {
      console.warn('Fallback pages-content.json indisponible:', e.message);
    }
  }

  if (!content) return;

  // ── A. Inject via data-cms attributes (with prefix stripping) ──
  injectDataCms(content, pageId);

  // ── B. Inject via CSS selector mappings ──
  const mappings = PAGE_MAPPINGS[pageId];
  if (mappings) {
    injectMappings(content, mappings, pageId);
  }

  // ── C. Inject legal articles (data-cms-articles) ──
  injectArticles(content, pageId);

  console.log('CMS content loaded for page:', pageId);
}


/* ═══════════════════════════════════════════════════════════════
   A. DATA-CMS ATTRIBUTE INJECTION
   Supports flat keys and prefixed keys (e.g. "paiement.form_title")
   ═══════════════════════════════════════════════════════════════ */
function resolveField(content, field, pageId) {
  // Direct match
  if (content[field] !== undefined) return content[field];
  // Prefixed match: "paiement.form_title" → "form_title"
  const prefix = pageId + '.';
  if (field.startsWith(prefix)) {
    const stripped = field.slice(prefix.length);
    if (content[stripped] !== undefined) return content[stripped];
  }
  return undefined;
}

function injectDataCms(content, pageId) {
  // Simple text
  document.querySelectorAll('[data-cms]').forEach(el => {
    const field = el.getAttribute('data-cms');
    const val = resolveField(content, field, pageId);
    if (val !== undefined && val !== null && val !== '') {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.value = val;
      } else {
        el.textContent = val;
      }
    }
  });

  // HTML injection
  document.querySelectorAll('[data-cms-html]').forEach(el => {
    const field = el.getAttribute('data-cms-html');
    const val = resolveField(content, field, pageId);
    if (val !== undefined && val !== null && val !== '') {
      el.innerHTML = val;
    }
  });

  // List injection (templates)
  document.querySelectorAll('[data-cms-list]').forEach(container => {
    const field = container.getAttribute('data-cms-list');
    const items = resolveField(content, field, pageId);
    if (!Array.isArray(items) || items.length === 0) return;

    const template = container.querySelector('[data-cms-template]');
    if (!template) return;

    const tplHTML = template.outerHTML;
    container.innerHTML = '';

    items.forEach(item => {
      let html = tplHTML;
      Object.keys(item).forEach(key => {
        const regex = new RegExp('\\{\\{' + key + '\\}\\}', 'g');
        html = html.replace(regex, item[key] || '');
      });
      html = html.replace('data-cms-template', 'data-cms-rendered');
      container.insertAdjacentHTML('beforeend', html);
    });
  });
}


/* ═══════════════════════════════════════════════════════════════
   B. CSS SELECTOR MAPPING INJECTION
   ═══════════════════════════════════════════════════════════════ */
function injectMappings(content, mappings, pageId) {
  mappings.forEach(m => {
    const type = m.t || 'text';
    const val = content[m.f];

    // Special renderers
    if (type === 'faq')           return renderFaqItems(m.s, val);
    if (type === 'cv')            return renderCvItems(m.s, val);
    if (type === 'mentions')      return renderMentions(m.s, content);
    if (type === 'tarifs_b2c')    return renderTarifsB2C(m.s, content);
    if (type === 'tarifs_b2b')    return renderTarifsB2B(m.s, content);
    if (type === 'tarifs_reas')   return renderTarifsReassurance(m.s, content);

    if (val === undefined || val === null || val === '') return;

    const el = document.querySelector(m.s);
    if (!el) return;

    switch (type) {
      case 'html':
        el.innerHTML = val;
        break;
      case 'href':
        el.setAttribute('href', val);
        break;
      case 'src':
        el.setAttribute('src', val);
        break;
      default: // text
        el.textContent = val;
    }
  });
}


/* ═══════════════════════════════════════════════════════════════
   C. LEGAL ARTICLES RENDERER (CGU / CGV)
   ═══════════════════════════════════════════════════════════════ */
function injectArticles(content, pageId) {
  document.querySelectorAll('[data-cms-articles]').forEach(container => {
    const field = container.getAttribute('data-cms-articles');
    const articles = resolveField(content, field, pageId);
    if (!Array.isArray(articles) || articles.length === 0) return;

    // Build TOC + articles
    const tocItems = articles.map((a, i) => {
      const id = 'c' + (i + 1);
      const shortTitle = a.title.replace(/^\d+\.\s*/, '');
      return `<li><a href="#${id}">${shortTitle}</a></li>`;
    }).join('');

    const articlesHtml = articles.map((a, i) => {
      const id = 'c' + (i + 1);
      return `<h2 id="${id}">${a.title}</h2>\n<p>${a.content}</p>`;
    }).join('\n\n');

    container.innerHTML =
      `<div class="legal-toc"><h4>Sommaire</h4><ol>${tocItems}</ol></div>\n\n${articlesHtml}`;
  });
}


/* ═══════════════════════════════════════════════════════════════
   SPECIAL RENDERERS
   ═══════════════════════════════════════════════════════════════ */

/** Render FAQ items into an accordion list */
function renderFaqItems(selector, items) {
  if (!Array.isArray(items) || items.length === 0) return;
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="faq-item">
      <button class="faq-q" onclick="this.closest('.faq-item').classList.toggle('open')">
        ${item.q} <span class="icon">+</span>
      </button>
      <div class="faq-a">${item.a}</div>
    </div>
  `).join('');
}

/** Render CV items (about page) */
function renderCvItems(selector, items) {
  if (!Array.isArray(items) || items.length === 0) return;
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = items.map(item => {
    // Parse "Type · Année — Titre. Description"
    const text = item.text || '';
    const dashIdx = text.indexOf('—');
    let tag = '', title = '', desc = '';
    if (dashIdx > -1) {
      tag = text.substring(0, dashIdx).trim();
      const rest = text.substring(dashIdx + 1).trim();
      const dotIdx = rest.indexOf('.');
      if (dotIdx > -1) {
        title = rest.substring(0, dotIdx).trim();
        desc = rest.substring(dotIdx + 1).trim();
      } else {
        title = rest;
      }
    } else {
      title = text;
    }
    return `
      <div class="cv-card">
        <div class="cv-tag">${tag}</div>
        <h4>${title}</h4>
        <p>${desc}</p>
      </div>
    `;
  }).join('');
}

/** Render B2C plan cards from CMS content */
function renderTarifsB2C(selector, content) {
  const plans = [
    { id: 'decouverte', prefix: 'plan_decouverte_', featured: false },
    { id: 'essentiel',  prefix: 'plan_essentiel_',  featured: true },
    { id: 'illimite',   prefix: 'plan_illimite_',    featured: false }
  ];
  plans.forEach(plan => {
    const card = document.getElementById('card-' + plan.id);
    if (!card) return;
    const p = plan.prefix;
    const name = content[p + 'name'];
    const desc = content[p + 'desc'];
    const priceM = content[p + 'price_monthly'];
    const priceY = content[p + 'price_yearly'];
    const yearlyTotal = content[p + 'yearly_total'];
    const cta = content[p + 'cta'];
    const features = content[p + 'features'];
    const badge = content[p + 'badge'];

    if (name) { const el = card.querySelector('.plan-name'); if (el) el.textContent = name; }
    if (desc) { const el = card.querySelector('.plan-desc'); if (el) el.textContent = desc; }
    if (priceM) {
      const priceEl = card.querySelector('.plan-price');
      if (priceEl) {
        priceEl.textContent = priceM;
        priceEl.setAttribute('data-monthly', priceM);
        if (priceY) priceEl.setAttribute('data-yearly', priceY);
      }
    }
    if (yearlyTotal && priceY) {
      const perEl = card.querySelector('.plan-per');
      if (perEl) {
        perEl.setAttribute('data-monthly', 'Sans engagement');
        perEl.setAttribute('data-yearly', yearlyTotal + ' \u20ac/an \u2014 soit ' + priceY + ' \u20ac/mois');
      }
    }
    if (cta) { const el = card.querySelector('.plan-cta'); if (el) el.textContent = cta; }
    if (badge && plan.featured) {
      const el = card.querySelector('.pop-label');
      if (el) el.textContent = badge;
    }
    if (Array.isArray(features) && features.length > 0) {
      const ul = card.querySelector('.plan-features');
      if (ul) {
        ul.innerHTML = features.map(f => {
          const text = typeof f === 'string' ? f : (f.text || '');
          return '<li><span class="check">\u2713</span> ' + text + '</li>';
        }).join('');
      }
    }
  });
}

/** Render B2B plan cards from CMS content */
function renderTarifsB2B(selector, content) {
  // B2B header
  const header = document.querySelector('.b2b-header');
  if (header) {
    if (content.b2b_title) { const el = header.querySelector('h2'); if (el) el.innerHTML = content.b2b_title; }
    if (content.b2b_subtitle) { const el = header.querySelector('p'); if (el) el.textContent = content.b2b_subtitle; }
  }

  const plans = [
    { id: 'b2b-formateur', prefix: 'b2b_formateur_', featured: false, hasPrice: true },
    { id: 'b2b-cfa',       prefix: 'b2b_cfa_',       featured: true,  hasPrice: false },
    { id: 'b2b-mesure',    prefix: 'b2b_mesure_',     featured: false, hasPrice: false }
  ];
  plans.forEach(plan => {
    const card = document.getElementById('card-' + plan.id);
    if (!card) return;
    const p = plan.prefix;
    const name = content[p + 'name'];
    const desc = content[p + 'desc'];
    const cta = content[p + 'cta'];
    const features = content[p + 'features'];
    const badge = content[p + 'badge'];

    if (name) { const el = card.querySelector('.plan-name'); if (el) el.textContent = name; }
    if (desc) { const el = card.querySelector('.plan-desc'); if (el) el.textContent = desc; }
    if (cta) { const el = card.querySelector('.plan-cta'); if (el) el.textContent = cta; }
    if (badge && plan.featured) {
      const el = card.querySelector('.pop-label');
      if (el) el.textContent = badge;
    }

    if (plan.hasPrice) {
      const price = content[p + 'price'];
      const per = content[p + 'per'];
      if (price) { const el = card.querySelector('.plan-price'); if (el) el.textContent = price; }
      if (per) { const el = card.querySelector('.plan-per'); if (el) el.textContent = per; }
    } else {
      const priceText = content[p + 'price_text'];
      const priceSub = content[p + 'price_sub'];
      if (priceText) { const el = card.querySelector('.plan-price-text'); if (el) el.textContent = priceText; }
      if (priceSub) { const el = card.querySelector('.plan-price-sub'); if (el) el.textContent = priceSub; }
    }

    if (Array.isArray(features) && features.length > 0) {
      const ul = card.querySelector('.plan-features');
      if (ul) {
        ul.innerHTML = features.map(f => {
          const text = typeof f === 'string' ? f : (f.text || '');
          return '<li><span class="check">\u2713</span> ' + text + '</li>';
        }).join('');
      }
    }
  });

  // Also update the switchAudience hero texts from CMS
  if (content.b2b_title || content.b2b_subtitle) {
    const origSwitch = window.switchAudience;
    window.switchAudience = function(audience) {
      origSwitch(audience);
      if (audience === 'b2b') {
        const heroTitle = document.getElementById('hero-title');
        const heroSub = document.getElementById('hero-subtitle');
        if (content.b2b_title && heroTitle) heroTitle.innerHTML = content.b2b_title;
        if (content.b2b_subtitle && heroSub) heroSub.textContent = content.b2b_subtitle;
      } else {
        const heroTitle = document.getElementById('hero-title');
        const heroSub = document.getElementById('hero-subtitle');
        if (content.title && heroTitle) heroTitle.innerHTML = content.title;
        if (content.subtitle && heroSub) heroSub.textContent = content.subtitle;
      }
    };
  }
}

/** Render reassurance blocks from CMS content */
function renderTarifsReassurance(selector, content) {
  const grid = document.querySelector(selector);
  if (!grid) return;
  const cards = grid.querySelectorAll('.reas-card');
  for (let i = 1; i <= 3; i++) {
    const card = cards[i - 1];
    if (!card) continue;
    const title = content['reassurance_' + i + '_title'];
    const desc = content['reassurance_' + i + '_desc'];
    if (title) { const el = card.querySelector('.reas-title'); if (el) el.textContent = title; }
    if (desc) { const el = card.querySelector('.reas-desc'); if (el) el.textContent = desc; }
  }
}

/** Render mentions légales from structured content */
function renderMentions(selector, c) {
  const container = document.querySelector(selector);
  if (!container) return;

  const sections = [];

  if (c.editeur || c.siren || c.siege || c.email) {
    sections.push(`<h2>Éditeur du site</h2>
<p><strong>${c.editeur || ''}</strong><br>
${c.siege || ''}<br>
SIRET : ${c.siren || 'En cours d\'immatriculation'}<br>
Email : <a href="mailto:${c.email || ''}" style="color:var(--marine)">${c.email || ''}</a>
${c.tel ? '<br>Tél : ' + c.tel : ''}</p>`);
  }

  if (c.directeur) {
    sections.push(`<h2>Directeur de la publication</h2>
<p>${c.directeur}</p>`);
  }

  if (c.hebergeur) {
    sections.push(`<h2>Hébergement</h2>
<p>Ce site est hébergé par <strong>${c.hebergeur}</strong>.</p>`);
  }

  if (c.propriete) {
    sections.push(`<h2>Propriété intellectuelle</h2>
<p>${c.propriete}</p>`);
  }

  if (c.donnees_desc || c.donnees_responsable) {
    sections.push(`<h2>Données personnelles</h2>
<p>${c.donnees_desc || ''}</p>
${c.donnees_email_dpo ? '<p>Contact DPO : <a href="mailto:' + c.donnees_email_dpo + '" style="color:var(--marine)">' + c.donnees_email_dpo + '</a></p>' : ''}`);
  }

  if (c.cookies_desc) {
    sections.push(`<h2>Cookies</h2>
<p>${c.cookies_desc}</p>`);
  }

  if (c.credits) {
    sections.push(`<p style="margin-top:40px;font-size:12px;color:var(--ink-mute)">${c.credits}</p>`);
  }

  if (sections.length > 0) {
    container.innerHTML = sections.join('\n');
  }
}
