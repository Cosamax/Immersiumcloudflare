/* ═══════════════════════════════════════════════════════════════════
   IMM-CATALOG.JS — Catalogue des 15 simulations Immersium
   Taxonomie v2 : 10 catégories / sous-catégories
   Chargé dynamiquement depuis Supabase, avec fallback statique
   Wrapped in IIFE to avoid const redeclaration with inline scripts
═══════════════════════════════════════════════════════════════════ */
(function() {

   var _CATALOG_FALLBACK = {
          lumio: {
                   name:'LUMIO', num:'01',
                   category:'Marketing',
                   subcategory:'Marketing digital',
                   domain:'Marketing digital',
                   desc:'Illuminez votre stratégie de contenu et de visibilité en ligne.',
                   level:'Débutant', levelColor:'#16A34A', color:'#0131B4', color2:'#FF6B35'
          },
          breval: {
                   name:'BREVAL', num:'02',
                   category:'Marketing',
                   subcategory:'Marketing digital',
                   domain:'Marketing digital',
                   desc:'Maximisez le retour sur investissement de vos campagnes digitales.',
                   level:'Intermédiaire', levelColor:'#D97706', color:'#0125A8', color2:'#FF8C5A'
          },
          heliance: {
                   name:'HELIANCE', num:'03',
                   category:'Marketing',
                   subcategory:'Études et analyse marché',
                   domain:'Études et analyse marché',
                   desc:'Développez la présence digitale d\'une marque à travers tous les canaux.',
                   level:'Avancé', levelColor:'#DC2626', color:'#011A9E', color2:'#FFA07A'
          },
          nexia: {
                   name:'NEXIA', num:'04',
                   category:'Digitalisation & Numérique',
                   subcategory:'Transformation digitale',
                   domain:'Transformation digitale',
                   desc:'Connectez les enjeux de la transformation digitale à la stratégie d\'entreprise.',
                   level:'Débutant', levelColor:'#16A34A', color:'#7C2D12', color2:'#F97316'
          },
          orbis: {
                   name:'ORBIS', num:'05',
                   category:'Digitalisation & Numérique',
                   subcategory:'Transformation digitale',
                   domain:'Transformation digitale',
                   desc:'Déployez une transformation digitale à 360°.',
                   level:'Intermédiaire', levelColor:'#D97706', color:'#92400E', color2:'#FB923C'
          },
          vertex: {
                   name:'VERTEX', num:'06',
                   category:'Digitalisation & Numérique',
                   subcategory:'Transformation digitale',
                   domain:'Transformation digitale',
                   desc:'Atteignez le sommet de la maturité digitale.',
                   level:'Avancé', levelColor:'#DC2626', color:'#78350F', color2:'#FDBA74'
          },
          solara: {
                   name:'SOLARA', num:'07',
                   category:'Marketing',
                   subcategory:'Stratégie marketing',
                   domain:'Stratégie marketing',
                   desc:'Élaborez une stratégie marketing complète pour une marque en croissance.',
                   level:'Débutant', levelColor:'#16A34A', color:'#1D4ED8', color2:'#93C5FD'
          },
          praxis: {
                   name:'PRAXIS', num:'08',
                   category:'Marketing',
                   subcategory:'Stratégie marketing',
                   domain:'Stratégie marketing',
                   desc:'Construisez et exécutez une stratégie marketing B2B efficace.',
                   level:'Intermédiaire', levelColor:'#D97706', color:'#1E40AF', color2:'#60A5FA'
          },
          astra: {
                   name:'ASTRA', num:'09',
                   category:'Marketing',
                   subcategory:'Marketing relationnel',
                   domain:'Marketing relationnel',
                   desc:'Pilotez la stratégie marketing d\'un groupe multi-marques.',
                   level:'Avancé', levelColor:'#DC2626', color:'#1E3A5F', color2:'#3B82F6'
          },
          eveil: {
                   name:'EVEIL', num:'10',
                   category:'Digitalisation & Numérique',
                   subcategory:'Intelligence artificielle',
                   domain:'Intelligence artificielle',
                   desc:'Éveillez les équipes aux enjeux et opportunités de l\'intelligence artificielle.',
                   level:'Débutant', levelColor:'#16A34A', color:'#0F172A', color2:'#6366F1'
          },
          elan: {
                   name:'ELAN', num:'11',
                   category:'Digitalisation & Numérique',
                   subcategory:'Intelligence artificielle',
                   domain:'Intelligence artificielle',
                   desc:'Donnez un nouvel élan à une organisation grâce à l\'IA.',
                   level:'Intermédiaire', levelColor:'#D97706', color:'#0F172A', color2:'#818CF8'
          },
          ancre: {
                   name:'ANCRE', num:'12',
                   category:'Digitalisation & Numérique',
                   subcategory:'Intelligence artificielle',
                   domain:'Intelligence artificielle',
                   desc:'Ancrez l\'intelligence artificielle au cœur des processus d\'une entreprise.',
                   level:'Avancé', levelColor:'#DC2626', color:'#0F172A', color2:'#A5B4FC'
          },
          signal: {
                   name:'SIGNAL', num:'13',
                   category:'Communication',
                   subcategory:'Communication digitale',
                   domain:'Communication digitale',
                   desc:'Émettez les bons signaux sur les canaux digitaux.',
                   level:'Débutant', levelColor:'#16A34A', color:'#064E3B', color2:'#10B981'
          },
          lien: {
                   name:'LIEN', num:'14',
                   category:'Communication',
                   subcategory:'Communication professionnelle',
                   domain:'Communication professionnelle',
                   desc:'Renforcez les liens au sein des équipes par une communication efficace.',
                   level:'Intermédiaire', levelColor:'#D97706', color:'#065F46', color2:'#34D399'
          },
          echo: {
                   name:'ECHO', num:'15',
                   category:'Communication',
                   subcategory:'Communication professionnelle',
                   domain:'Communication professionnelle',
                   desc:'Faites résonner la communication interne d\'une organisation.',
                   level:'Avancé', levelColor:'#DC2626', color:'#166534', color2:'#6EE7B7'
          },
   };

   /* ── Taxonomie complète v2 ── */
   var _TAXONOMY = {
          'Communication': [
                   'Communication professionnelle',
                   'Communication digitale',
                   'Communication écrite et orale',
                   'Communication interculturelle'
                 ],
          'Marketing': [
                   'Marketing digital',
                   'Stratégie marketing',
                   'Marketing relationnel',
                   'Études et analyse marché'
                 ],
          'Commerce & Relation client': [
                   'Techniques de vente',
                   'Négociation commerciale',
                   'Relation client / Accueil',
                   'Expérience client et fidélisation'
                 ],
          'Digitalisation & Numérique': [
                   'Transformation digitale',
                   'Intelligence artificielle',
                   'Outils collaboratifs',
                   'E-business / E-commerce'
                 ],
          'Management': [
                   'Management d\'équipe',
                   'Management de projet',
                   'Leadership et posture managériale',
                   'Conduite du changement'
                 ],
          'Gestion & Entrepreneuriat': [
                   'Gestion d\'entreprise',
                   'Création / reprise d\'activité',
                   'Gestion financière',
                   'Pilotage de la performance'
                 ],
          'Ressources humaines': [
                   'Recrutement et intégration',
                   'Formation et développement',
                   'GPEC et talents',
                   'Qualité de vie au travail'
                 ],
          'Développement professionnel': [
                   'Efficacité professionnelle',
                   'Savoir-être et posture',
                   'Gestion du stress et des émotions',
                   'Méthodologie et organisation'
                 ],
          'Conformité & Cadre légal': [
                   'Droit du numérique / RGPD',
                   'Droit commercial',
                   'Droit du travail',
                   'RSE et éthique'
                 ],
          'Inclusion & Accessibilité': [
                   'FALC et communication accessible',
                   'Illettrisme et illectronisme',
                   'Handicap et aménagement',
                   'Diversité et inclusion'
                 ]
   };

   var _CATEGORIES = Object.keys(_TAXONOMY);

   var _DOMAINS = [
          'Communication professionnelle',
          'Communication digitale',
          'Marketing digital',
          'Stratégie marketing',
          'Marketing relationnel',
          'Études et analyse marché',
          'Transformation digitale',
          'Intelligence artificielle',
          'Outils collaboratifs',
          'E-business / E-commerce',
          'Management d\'équipe',
          'Management de projet',
          'Leadership et posture managériale',
          'Conduite du changement',
          'Gestion d\'entreprise',
          'Création / reprise d\'activité',
          'Gestion financière',
          'Pilotage de la performance',
          'Recrutement et intégration',
          'Formation et développement',
          'GPEC et talents',
          'Qualité de vie au travail',
          'Efficacité professionnelle',
          'Savoir-être et posture',
          'Gestion du stress et des émotions',
          'Méthodologie et organisation',
          'Droit du numérique / RGPD',
          'Droit commercial',
          'Droit du travail',
          'RSE et éthique',
          'FALC et communication accessible',
          'Illettrisme et illectronisme',
          'Handicap et aménagement',
          'Diversité et inclusion',
          'Techniques de vente',
          'Négociation commerciale',
          'Relation client / Accueil',
          'Expérience client et fidélisation'
        ];

   var _LEVELS = ['Débutant','Intermédiaire','Avancé','Expert'];

   /* Expose globally (only if not already set by inline script) */
   if (!window.IMM_CATALOG)   window.IMM_CATALOG   = _CATALOG_FALLBACK;
     if (!window.IMM_TAXONOMY)  window.IMM_TAXONOMY  = _TAXONOMY;
     if (!window.IMM_CATEGORIES) window.IMM_CATEGORIES = _CATEGORIES;
     if (!window.IMM_DOMAINS)   window.IMM_DOMAINS   = _DOMAINS;
     if (!window.IMM_LEVELS)    window.IMM_LEVELS    = _LEVELS;

   /* Build the nav dropdown grouped by CATEGORY (not domain) */
   function buildCatDropdown(catalog, panel) {
          var entries = Object.entries(catalog);
          var grouped = {};
          entries.forEach(function(pair) {
                   var id = pair[0], info = pair[1];
                   var cat = info.category || info.domain || 'Autre';
                   if (!grouped[cat]) grouped[cat] = [];
                   grouped[cat].push(Object.assign({ id: id }, info));
          });
          Object.keys(grouped).forEach(function(cat) {
                   grouped[cat].sort(function(a, b) { return parseInt(a.num) - parseInt(b.num); });
          });

       var categories = _CATEGORIES.filter(function(c) { return grouped[c]; });

       var header = panel.querySelector('.pub-cat-header');
          if (header) {
                   header.innerHTML =
                              '<div class="title">Catalogue <em>Immersium</em></div>' +
                              '<a href="catalogue.html" class="all">Voir les ' + entries.length + ' simulations \u2192</a>';
          }

       var grid = panel.querySelector('.pub-cat-grid');
          if (grid) {
                   grid.innerHTML = categories.map(function(cat) {
                              var sims = grouped[cat];
                              return '<div class="pub-cat-col">' +
                                           '<div class="cat-head">' +
                                             '<div class="ic">' + cat.charAt(0) + '</div>' +
                                             '<div class="n">' + cat + '</div>' +
                                           '</div>' +
                                           '<ul>' +
                                           sims.map(function(s) {
                                                          return '<li><a href="game.html?game=' + s.id + '">' +
                                                                           '<span class="num">' + s.num + '</span>' +
                                                                           '<span class="nm">' + s.name + '</span>' +
                                                                           '<span class="sub">' + s.subcategory + '</span>' +
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
                              '<a href="catalogue.html" style="margin-left:auto;background:var(--ink);color:#fff">Tout voir <span style="opacity:.7">' + entries.length + '</span></a>';
          }
   }

   window.buildCatDropdown = buildCatDropdown;

   var catPanel = document.querySelector('.pub-cat-panel');
     if (catPanel) {
            buildCatDropdown(window.IMM_CATALOG || _CATALOG_FALLBACK, catPanel);
     }

   /* Upgrade from Supabase if available */
   (async function loadCatalogFromSupabase() {
          try {
                   var sb = window.IMM_SUPABASE;
                   if (!sb) return;
                   var result = await sb.from('simulations').select('*').eq('active', true).order('sort_order');
                   var data = result.data, error = result.error;
                   if (error || !data || data.length === 0) return;
                   var catalog = {};
                   data.forEach(function(s) {
                              catalog[s.game_id] = {
                                           name: s.name, num: s.num,
                                           category: s.category, subcategory: s.subcategory, domain: s.domain,
                                           desc: s.description, level: s.level, levelColor: s.level_color,
                                           color: s.color, color2: s.color2, challengeCount: s.challenge_count
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
