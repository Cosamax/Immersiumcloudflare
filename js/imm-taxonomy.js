/* ═══════════════════════════════════════════════════════════════════
   IMM-TAXONOMY.JS — Catégories & sous-catégories partagées
   Source unique de vérité pour le catalogue (admin + public).
   ═══════════════════════════════════════════════════════════════════ */
(function() {
  var TAXONOMY = [
    { id: 'communication', name: 'Communication', color: '#10B981', subs: ['Communication professionnelle', 'Communication digitale', 'Communication écrite et orale', 'Communication interculturelle'] },
    { id: 'marketing', name: 'Marketing', color: '#2563EB', subs: ['Marketing digital', 'Stratégie marketing', 'Marketing relationnel', 'Études et analyse marché'] },
    { id: 'commerce', name: 'Commerce & Relation client', color: '#F59E0B', subs: ['Techniques de vente', 'Négociation commerciale', 'Relation client / Accueil', 'Expérience client et fidélisation'] },
    { id: 'digital', name: 'Digitalisation & Numérique', color: '#F97316', subs: ['Transformation digitale', 'Intelligence artificielle', 'Outils collaboratifs', 'E-business / E-commerce'] },
    { id: 'management', name: 'Management', color: '#8B5CF6', subs: ["Management d'équipe", 'Management de projet', 'Leadership et posture managériale', 'Conduite du changement'] },
    { id: 'gestion', name: 'Gestion & Entrepreneuriat', color: '#0891B2', subs: ["Gestion d'entreprise", "Création / reprise d'activité", 'Gestion financière', 'Pilotage de la performance'] },
    { id: 'rh', name: 'Ressources humaines', color: '#EC4899', subs: ['Recrutement et intégration', 'Formation et développement', 'GPEC et talents', 'Qualité de vie au travail'] },
    { id: 'devpro', name: 'Développement professionnel', color: '#84CC16', subs: ['Efficacité professionnelle', 'Savoir-être et posture', 'Gestion du stress et des émotions', 'Méthodologie et organisation'] },
    { id: 'conformite', name: 'Conformité & Cadre légal', color: '#6366F1', subs: ['Droit du numérique / RGPD', 'Droit commercial', 'Droit du travail', 'RSE et éthique'] },
    { id: 'inclusion', name: 'Inclusion & Accessibilité', color: '#14B8A6', subs: ['FALC et communication accessible'] }
  ];

  /* Parse une valeur category/subcategory : peut être :
     - un tableau JSON ('["A","B"]')
     - une chaîne simple ('A')
     - null/undefined
     Retourne toujours un tableau de strings (vide si rien). */
  function parseCategoryField(v) {
    if (!v) return [];
    if (Array.isArray(v)) return v.filter(Boolean);
    var s = String(v).trim();
    if (!s) return [];
    if (s.charAt(0) === '[') {
      try {
        var arr = JSON.parse(s);
        if (Array.isArray(arr)) return arr.filter(Boolean);
      } catch (e) { /* fall through */ }
    }
    return [s];
  }

  /* Sérialise un tableau pour stockage en base.
     - tableau vide → null
     - 1 élément → string brute (rétro-compat)
     - 2+ éléments → JSON */
  function serializeCategoryField(arr) {
    if (!arr || !arr.length) return null;
    var clean = arr.filter(Boolean);
    if (clean.length === 0) return null;
    if (clean.length === 1) return clean[0];
    return JSON.stringify(clean);
  }

  window.IMM_TAXONOMY = TAXONOMY;
  window.IMM_PARSE_CAT = parseCategoryField;
  window.IMM_SERIALIZE_CAT = serializeCategoryField;
})();
