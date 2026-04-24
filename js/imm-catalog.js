/* ═══════════════════════════════════════════════════════════════════
   IMM-CATALOG.JS — Catalogue des 15 simulations Immersium
   Chargé dynamiquement depuis Supabase, avec fallback statique
   Wrapped in IIFE to avoid const redeclaration with inline scripts
   ═══════════════════════════════════════════════════════════════════ */

(function() {

var _CATALOG_FALLBACK = {
  lumio:    { name:'LUMIO',    num:'01', domain:'Marketing Digital',       desc:'Illuminez votre stratégie de contenu et de visibilité en ligne.',              level:'Débutant',      levelColor:'#16A34A', color:'#0131B4', color2:'#FF6B35' },
  breval:   { name:'BREVAL',   num:'02', domain:'Marketing Digital',       desc:'Maximisez le retour sur investissement de vos campagnes digitales.',           level:'Intermédiaire', levelColor:'#D97706', color:'#0125A8', color2:'#FF8C5A' },
  heliance: { name:'HELIANCE', num:'03', domain:'Marketing Digital',       desc:'Développez la présence digitale d\'une marque à travers tous les canaux.',    level:'Avancé',        levelColor:'#DC2626', color:'#011A9E', color2:'#FFA07A' },
  nexia:    { name:'NEXIA',    num:'04', domain:'Transformation Digitale', desc:'Connectez les enjeux de la transformation digitale à la stratégie d\'entreprise.', level:'Débutant', levelColor:'#16A34A', color:'#7C2D12', color2:'#F97316' },
  orbis:    { name:'ORBIS',    num:'05', domain:'Transformation Digitale', desc:'Déployez une transformation digitale à 360°.',                                level:'Intermédiaire', levelColor:'#D97706', color:'#92400E', color2:'#FB923C' },
  vertex:   { name:'VERTEX',   num:'06', domain:'Transformation Digitale', desc:'Atteignez le sommet de la maturité digitale.',                                level:'Avancé',        levelColor:'#DC2626', color:'#78350F', color2:'#FDBA74' },
  solara:   { name:'SOLARA',   num:'07', domain:'Stratégie Marketing',     desc:'Élaborez une stratégie marketing complète pour une marque en croissance.',     level:'Débutant',      levelColor:'#16A34A', color:'#1D4ED8', color2:'#93C5FD' },
  praxis:   { name:'PRAXIS',   num:'08', domain:'Stratégie Marketing',     desc:'Construisez et exécutez une stratégie marketing B2B efficace.',               level:'Intermédiaire', levelColor:'#D97706', color:'#1E40AF', color2:'#60A5FA' },
  astra:    { name:'ASTRA',    num:'09', domain:'Stratégie Marketing',     desc:'Pilotez la stratégie marketing d\'un groupe multi-marques.',                  level:'Avancé',        levelColor:'#DC2626', color:'#1E3A5F', color2:'#3B82F6' },
  eveil:    { name:'EVEIL',    num:'10', domain:'IA en Entreprise',        desc:'Éveillez les équipes aux enjeux et opportunités de l\'intelligence artificielle.', level:'Débutant',  levelColor:'#16A34A', color:'#0F172A', color2:'#6366F1' },
  elan:     { name:'ELAN',     num:'11', domain:'IA en Entreprise',        desc:'Donnez un nouvel élan à une organisation grâce à l\'IA.',                     level:'Intermédiaire', levelColor:'#D97706', color:'#0F172A', color2:'#818CF8' },
  ancre:    { name:'ANCRE',    num:'12', domain:'IA en Entreprise',        desc:'Ancrez l\'intelligence artificielle au cœur des processus d\'une entreprise.', level:'Avancé',       levelColor:'#DC2626', color:'#0F172A', color2:'#A5B4FC' },
  signal:   { name:'SIGNAL',   num:'13', domain:'Communication',           desc:'Émettez les bons signaux sur les canaux digitaux.',                           level:'Débutant',      levelColor:'#16A34A', color:'#064E3B', color2:'#10B981' },
  lien:     { name:'LIEN',     num:'14', domain:'Communication',           desc:'Renforcez les liens au sein des équipes par une communication efficace.',     level:'Intermédiaire', levelColor:'#D97706', color:'#065F46', color2:'#34D399' },
  echo:     { name:'ECHO',     num:'15', domain:'Communication',           desc:'Faites résonner la communication interne d\'une organisation.',               level:'Avancé',        levelColor:'#DC2626', color:'#166534', color2:'#6EE7B7' },
};

var _DOMAINS = ['Marketing Digital','Transformation Digitale','Stratégie Marketing','IA en Entreprise','Communication'];

var _LEVELS = ['Débutant','Intermédiaire','Avancé','Expert'];

/* Expose globally (only if not already set by inline script) */
if (!window.IMM_CATALOG) window.IMM_CATALOG = _CATALOG_FALLBACK;
if (!window.IMM_DOMAINS) window.IMM_DOMAINS = _DOMAINS;
if (!window.IMM_LEVELS)  window.IMM_LEVELS  = _LEVELS;

/* Build the nav dropdown with whatever catalog we have */
function buildCatDropdown(catalog, panel) {
  var entries = Object.entries(catalog);
  var grouped = {};
  entries.forEach(function(pair) {
    var id = pair[0], info = pair[1];
    if (!grouped[info.domain]) grouped[info.domain] = [];
    grouped[info.domain].push(Object.assign({ id: id }, info));
  });
  Object.keys(grouped).forEach(function(d) {
    grouped[d].sort(function(a, b) { return parseInt(a.num) - parseInt(b.num); });
  });

  var domains = _DOMAINS.filter(function(d) { return grouped[d]; });

  var header = panel.querySelector('.pub-cat-header');
  if (header) {
    header.innerHTML =
      '<div class="title">Catalogue <em>Immersium</em></div>' +
      '<a href="catalogue.html" class="all">Voir les 15 simulations →</a>';
  }

  var grid = panel.querySelector('.pub-cat-grid');
  if (grid) {
    grid.innerHTML = domains.map(function(domain) {
      var sims = grouped[domain];
      return '<div class="pub-cat-col">' +
        '<div class="cat-head">' +
          '<div class="ic">' + domain.charAt(0) + '</div>' +
          '<div class="n">' + domain + '</div>' +
        '</div>' +
        '<ul>' +
          sims.map(function(s) {
            return '<li><a href="game.html?game=' + s.id + '">' +
              '<span class="num">' + s.num + '</span>' +
              '<span class="nm">' + s.name + '</span>' +
              (s.subdomain ? '<span class="sub">' + s.subdomain + '</span>' : '') +
            '</a></li>';
          }).join('') +
        '</ul>' +
      '</div>';
    }).join('');
  }

  var footer = panel.querySelector('.pub-cat-footer');
  if (footer) {
    footer.innerHTML =
      '<span class="lbl">Niveaux :</span>' +
      _LEVELS.map(function(l) {
        return '<a href="catalogue.html?level=' + encodeURIComponent(l) + '">' + l + '</a>';
      }).join('') +
      '<a href="catalogue.html" style="margin-left:auto;background:var(--ink);color:#fff">Tout voir <span style="opacity:.7">15</span></a>';
  }
}

/* Make buildCatDropdown available globally for other scripts */
window.buildCatDropdown = buildCatDropdown;

/* Immediately build the dropdown from fallback */
var catPanel = document.querySelector('.pub-cat-panel');
if (catPanel) {
  buildCatDropdown(window.IMM_CATALOG || _CATALOG_FALLBACK, catPanel);
}

/* Then try to upgrade from Supabase */
(async function loadCatalogFromSupabase() {
  try {
    var sb = window.IMM_SUPABASE;
    if (!sb) return; /* fallback already built above */
    var result = await sb.from('simulations').select('*').eq('active', true).order('sort_order');
    var data = result.data, error = result.error;
    if (error || !data || data.length === 0) return;
    var catalog = {};
    data.forEach(function(s) {
      catalog[s.game_id] = {
        name: s.name, num: s.num, domain: s.domain, desc: s.description,
        level: s.level, levelColor: s.level_color, color: s.color, color2: s.color2,
        challengeCount: s.challenge_count
      };
    });
    window.IMM_CATALOG = catalog;
    document.dispatchEvent(new CustomEvent('imm-catalog-loaded', { detail: catalog }));
    if (catPanel) buildCatDropdown(catalog, catPanel);
  } catch(e) {
    console.warn('[Immersium] Catalog from Supabase failed:', e.message);
  }
})();

})();
