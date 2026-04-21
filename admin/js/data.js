/* ══════════════════════════════════════════════
   IMMERSIUM — Mock Data
══════════════════════════════════════════════ */

const MOCK = {

  kpi: {
    users:     { value: 1284, trend: '+8%',  dir: 'up'   },
    courses:   { value: 86,   trend: '+3',   dir: 'up'   },
    trainers:  { value: 47,   trend: '+2',   dir: 'up'   },
    learners:  { value: 1237, trend: '+12%', dir: 'up'   },
    sessions:  { value: 342,  trend: '-5%',  dir: 'down' },
    games:     { value: 34,   trend: '+4',   dir: 'up'   },
    skills:    { value: 128,  trend: '+9',   dir: 'up'   },
    scenarios: { value: 61,   trend: '+6',   dir: 'up'   },
  },

  activity: [
    { user: 'Marie D.',   avatar: 'MD', color: '#6C5CE7', action: 'a créé la formation', target: 'Sécurité incendie VR', tag: 'Formation', tagColor: 'badge-purple', time: 'Il y a 2 min' },
    { user: 'Lucas R.',   avatar: 'LR', color: '#00cec9', action: 's\'est inscrit comme apprenant', target: 'Conduite de chariot élévateur', tag: 'Inscription', tagColor: 'badge-info', time: 'Il y a 9 min' },
    { user: 'Élise M.',   avatar: 'EM', color: '#fd79a8', action: 'a terminé le scénario', target: 'Premiers secours — Niveau 2', tag: 'Complétion', tagColor: 'badge-success', time: 'Il y a 18 min' },
    { user: 'Admin',      avatar: 'AD', color: '#fdcb6e', action: 'a mis à jour la clé API', target: 'Accès & API', tag: 'Sécurité', tagColor: 'badge-warning', time: 'Il y a 34 min' },
    { user: 'Thomas P.',  avatar: 'TP', color: '#e17055', action: 'a signalé un bug sur', target: 'Jeu : Évacuation d\'urgence', tag: 'Bug', tagColor: 'badge-danger', time: 'Il y a 1 h' },
    { user: 'Sophie L.',  avatar: 'SL', color: '#74b9ff', action: 'a publié le jeu', target: 'Atelier de soudage VR', tag: 'Publication', tagColor: 'badge-purple', time: 'Il y a 2 h' },
  ],

  users: [
    { id: 1, name: 'Marie Dupont',    email: 'marie.dupont@corp.fr',   role: 'Formateur',  status: 'Actif',    courses: 6,  joined: '12 jan. 2024', avatar: 'MD', color: '#6C5CE7' },
    { id: 2, name: 'Lucas Renard',    email: 'lucas.renard@corp.fr',   role: 'Apprenant',  status: 'Actif',    courses: 3,  joined: '3 fév. 2024',  avatar: 'LR', color: '#00cec9' },
    { id: 3, name: 'Élise Martin',    email: 'elise.martin@corp.fr',   role: 'Apprenant',  status: 'Inactif',  courses: 1,  joined: '20 jan. 2024', avatar: 'EM', color: '#fd79a8' },
    { id: 4, name: 'Thomas Petit',    email: 'thomas.petit@corp.fr',   role: 'Formateur',  status: 'Actif',    courses: 9,  joined: '5 nov. 2023',  avatar: 'TP', color: '#e17055' },
    { id: 5, name: 'Sophie Lambert',  email: 'sophie.lambert@corp.fr', role: 'Admin',      status: 'Actif',    courses: 0,  joined: '1 oct. 2023',  avatar: 'SL', color: '#74b9ff' },
    { id: 6, name: 'Paul Moreau',     email: 'paul.moreau@corp.fr',    role: 'Apprenant',  status: 'Suspendu', courses: 2,  joined: '14 mars 2024', avatar: 'PM', color: '#fdcb6e' },
    { id: 7, name: 'Lucie Blanc',     email: 'lucie.blanc@corp.fr',    role: 'Apprenant',  status: 'Actif',    courses: 5,  joined: '22 fév. 2024', avatar: 'LB', color: '#00b894' },
    { id: 8, name: 'Antoine Garnier', email: 'a.garnier@corp.fr',      role: 'Formateur',  status: 'Actif',    courses: 12, joined: '30 sept. 2023',avatar: 'AG', color: '#a29bfe' },
  ],

  courses: [
    { id: 1, title: 'Sécurité incendie VR',          category: 'Sécurité',       learners: 245, progress: 78, status: 'Publié',   trainer: 'Marie Dupont',    updated: '10 avr. 2025' },
    { id: 2, title: 'Conduite de chariot élévateur', category: 'Logistique',     learners: 132, progress: 45, status: 'Publié',   trainer: 'Thomas Petit',    updated: '8 avr. 2025'  },
    { id: 3, title: 'Premiers secours — Niveau 2',   category: 'Santé',          learners: 89,  progress: 62, status: 'Brouillon', trainer: 'Antoine Garnier', updated: '5 avr. 2025'  },
    { id: 4, title: 'Atelier de soudage VR',         category: 'Industrie',      learners: 56,  progress: 91, status: 'Publié',   trainer: 'Sophie Lambert',  updated: '2 avr. 2025'  },
    { id: 5, title: 'Gestion des déchets dangereux', category: 'Environnement',  learners: 78,  progress: 33, status: 'Archivé',  trainer: 'Marie Dupont',    updated: '1 mars 2025'  },
    { id: 6, title: 'Formation habilitation élec.',  category: 'Électricité',    learners: 203, progress: 55, status: 'Publié',   trainer: 'Thomas Petit',    updated: '15 avr. 2025' },
  ],

  games: [
    { id: 1, title: 'Évacuation d\'urgence',    category: 'Sécurité',   scenarios: 5,  plays: 1240, rating: 4.7, status: 'Publié'   },
    { id: 2, title: 'Atelier soudage 3D',       category: 'Industrie',  scenarios: 3,  plays: 654,  rating: 4.5, status: 'Publié'   },
    { id: 3, title: 'Premiers gestes',          category: 'Santé',      scenarios: 4,  plays: 890,  rating: 4.8, status: 'Publié'   },
    { id: 4, title: 'Chariot VR Pro',           category: 'Logistique', scenarios: 6,  plays: 430,  rating: 4.3, status: 'Brouillon'},
    { id: 5, title: 'Habilitation électrique',  category: 'Électricité',scenarios: 7,  plays: 1780, rating: 4.9, status: 'Publié'   },
    { id: 6, title: 'Gestion déchets 360°',     category: 'Env.',       scenarios: 2,  plays: 210,  rating: 3.9, status: 'Archivé'  },
  ],

  skills: [
    { id: 1, name: 'Sécurité incendie',          level: 'Fondamental', games: 3, learners: 567 },
    { id: 2, name: 'Premiers secours',            level: 'Avancé',      games: 4, learners: 432 },
    { id: 3, name: 'Conduite d\'engins',          level: 'Intermédiaire',games: 2, learners: 312 },
    { id: 4, name: 'Habilitation électrique B1',  level: 'Expert',      games: 5, learners: 287 },
    { id: 5, name: 'Gestion des risques',         level: 'Fondamental', games: 1, learners: 189 },
    { id: 6, name: 'Communication en équipe',     level: 'Intermédiaire',games: 2, learners: 145 },
    { id: 7, name: 'Manipulation produits chimiques', level: 'Avancé',  games: 3, learners: 98  },
    { id: 8, name: 'Travail en hauteur',          level: 'Expert',      games: 4, learners: 76  },
  ],

  scenarios: [
    { id: 1, title: 'Début d\'incendie bureau',    game: 'Évacuation d\'urgence',   duration: '8 min',  difficulty: 'Facile',    emoji: '🔥' },
    { id: 2, title: 'Évacuation totale bâtiment',  game: 'Évacuation d\'urgence',   duration: '18 min', difficulty: 'Difficile', emoji: '🚨' },
    { id: 3, title: 'Soudage TIG aluminium',        game: 'Atelier soudage 3D',      duration: '22 min', difficulty: 'Avancé',    emoji: '⚙️' },
    { id: 4, title: 'Arrêt cardiaque — RCP',        game: 'Premiers gestes',         duration: '12 min', difficulty: 'Intermédiaire', emoji: '❤️‍🩹' },
    { id: 5, title: 'Chargement rack élévateur',    game: 'Chariot VR Pro',          duration: '15 min', difficulty: 'Intermédiaire', emoji: '🏭' },
    { id: 6, title: 'Coupure réseau BTA',           game: 'Habilitation électrique', duration: '25 min', difficulty: 'Expert',    emoji: '⚡' },
  ],

  sessions: [
    { id: 1, title: 'Session Sécurité — Groupe A',   course: 'Sécurité incendie VR',      date: '22 avr. 2025', time: '09:00',  learners: 18, trainer: 'Marie Dupont',    status: 'Planifiée'  },
    { id: 2, title: 'Atelier Chariot — Nantes',       course: 'Conduite de chariot',       date: '24 avr. 2025', time: '14:00',  learners: 12, trainer: 'Thomas Petit',    status: 'Planifiée'  },
    { id: 3, title: 'Formation Élec. — Paris',        course: 'Habilitation électrique',   date: '20 avr. 2025', time: '10:30',  learners: 20, trainer: 'Antoine Garnier', status: 'Terminée'   },
    { id: 4, title: 'Premiers secours — Lyon',        course: 'Premiers secours Niv. 2',   date: '18 avr. 2025', time: '08:00',  learners: 15, trainer: 'Marie Dupont',    status: 'Terminée'   },
    { id: 5, title: 'Déchets dangereux — Bordeaux',   course: 'Gestion déchets dangereux', date: '25 avr. 2025', time: '13:00',  learners: 10, trainer: 'Sophie Lambert',  status: 'Annulée'    },
  ],

  reports: {
    completion:  [62, 70, 75, 68, 80, 85, 78, 82, 88, 91, 86, 90],
    enrollment:  [40, 55, 60, 75, 80, 95, 100, 115, 120, 130, 125, 140],
    months: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
  },

  notifications: [
    { title: 'Nouveau formateur inscrit', desc: 'Antoine Garnier vient de rejoindre la plateforme.', time: 'Il y a 5 min' },
    { title: 'Bug signalé', desc: 'Thomas P. a signalé un problème sur "Évacuation d\'urgence".', time: 'Il y a 1 h' },
    { title: 'Clé API expirée', desc: 'La clé API "Production" expire dans 3 jours.', time: 'Il y a 2 h' },
    { title: 'Session terminée', desc: '20 apprenants ont complété "Habilitation électrique".', time: 'Il y a 4 h' },
    { title: 'Mise à jour disponible', desc: 'Immersium v2.4.1 est disponible pour déploiement.', time: 'Hier' },
  ],

  apiKeys: [
    { id: 1, name: 'Production',     key: 'imm_live_7xKp2mQ9nRvL4sT1wZ8aE3bY6dC0fH', scope: 'Lecture / Écriture', expires: '12 juil. 2025', status: 'Actif'  },
    { id: 2, name: 'Développement',  key: 'imm_dev_3hNq8wMp5kVs2xT9aB7cD4eF1gH0iJ',  scope: 'Lecture seule',      expires: '30 mai 2025',   status: 'Actif'  },
    { id: 3, name: 'Staging',        key: 'imm_stg_1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT',  scope: 'Lecture / Écriture', expires: '5 mai 2025',    status: 'Expiré' },
  ],

};
