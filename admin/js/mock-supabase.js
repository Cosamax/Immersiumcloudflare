/* ══════════════════════════════════════════════
   IMMERSIUM — Mock Supabase Client
   Simulates Supabase responses with demo data
   based on the 15 simulations from catalogue.json
══════════════════════════════════════════════ */

'use strict';

(function() {

  // ── Helpers ──────────────────────────────────
  const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = arr => arr[rnd(0, arr.length - 1)];
  const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

  const firstNames = ['Marie','Lucas','Élise','Thomas','Sophie','Paul','Lucie','Antoine','Camille','Hugo','Léa','Nathan','Emma','Jules','Chloé','Maxime','Sarah','Alexandre','Clara','Romain','Inès','Théo','Manon','Arthur','Jade','Louis','Alice','Gabriel','Eva','Raphaël','Zoé','Victor','Lola','Adam','Margot','Mathis','Juliette','Ethan','Charlotte','Noé','Ambre','Léo','Anaïs','Tom','Lina','Enzo','Laura','Valentin','Mila','Baptiste'];
  const lastNames = ['Dupont','Martin','Bernard','Petit','Robert','Richard','Durand','Moreau','Laurent','Simon','Michel','Lefebvre','Leroy','Roux','David','Bertrand','Morel','Fournier','Girard','Bonnet','Mercier','Blanc','Guérin','Boyer','Garnier','Chevalier','François','Legrand','Gauthier','Garcia','Perrin','Robin','Clément','Morin','Nicolas','Henry','Rousseau','Mathieu','Gautier','Masson'];

  // ── Generate demo simulations from catalogue ──
  const SIMULATIONS = [
    { game_id: 'lumio',     name: 'LUMIO — Marketing Digital',        domain: 'Marketing',       active: true,  challenge_count: 21 },
    { game_id: 'ancre',     name: 'ANCRE — Gestion de Projet',        domain: 'Management',      active: true,  challenge_count: 21 },
    { game_id: 'prisme',    name: 'PRISME — Communication',           domain: 'Communication',   active: true,  challenge_count: 21 },
    { game_id: 'synergie',  name: 'SYNERGIE — Travail d\'équipe',     domain: 'RH',              active: true,  challenge_count: 21 },
    { game_id: 'horizon',   name: 'HORIZON — Leadership',             domain: 'Management',      active: true,  challenge_count: 21 },
    { game_id: 'impact',    name: 'IMPACT — Vente & Négociation',     domain: 'Commercial',      active: true,  challenge_count: 21 },
    { game_id: 'nexus',     name: 'NEXUS — Transformation Digitale',  domain: 'Digital',         active: true,  challenge_count: 21 },
    { game_id: 'pulse',     name: 'PULSE — Relation Client',          domain: 'Commercial',      active: true,  challenge_count: 21 },
    { game_id: 'zenith',    name: 'ZENITH — Management',              domain: 'Management',      active: true,  challenge_count: 21 },
    { game_id: 'atlas',     name: 'ATLAS — Stratégie d\'entreprise',  domain: 'Stratégie',       active: true,  challenge_count: 21 },
    { game_id: 'forge',     name: 'FORGE — Innovation',               domain: 'Innovation',      active: true,  challenge_count: 21 },
    { game_id: 'eclore',    name: 'ÉCLORE — Entrepreneuriat',         domain: 'Entrepreneuriat', active: true,  challenge_count: 21 },
    { game_id: 'boussole',  name: 'BOUSSOLE — Orientation Pro',       domain: 'Orientation',     active: true,  challenge_count: 21 },
    { game_id: 'levier',    name: 'LEVIER — Finance',                 domain: 'Finance',         active: true,  challenge_count: 21 },
    { game_id: 'toile',     name: 'TOILE — Création Web',             domain: 'Digital',         active: false, challenge_count: 21 },
  ];

  // ── Generate demo profiles ──────────────────
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const PROFILES = [];
  // 3 admins
  for (let i = 0; i < 3; i++) {
    const fn = pick(firstNames), ln = pick(lastNames);
    PROFILES.push({
      id: uuid(),
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@immersium.fr`,
      role: 'admin',
      full_name: `${fn} ${ln}`,
      created_at: new Date(now - rnd(90, 365) * day).toISOString()
    });
  }
  // 47 formateurs
  for (let i = 0; i < 47; i++) {
    const fn = pick(firstNames), ln = pick(lastNames);
    PROFILES.push({
      id: uuid(),
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@formation.fr`,
      role: 'formateur',
      full_name: `${fn} ${ln}`,
      created_at: new Date(now - rnd(10, 300) * day).toISOString()
    });
  }
  // 1234 apprenants
  for (let i = 0; i < 1234; i++) {
    const fn = pick(firstNames), ln = pick(lastNames);
    PROFILES.push({
      id: uuid(),
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${rnd(1,999)}@mail.fr`,
      role: 'apprenant',
      full_name: `${fn} ${ln}`,
      created_at: new Date(now - rnd(0, 365) * day).toISOString()
    });
  }

  // Sort by created_at desc
  PROFILES.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // ── Generate demo user_progress ─────────────
  const USER_PROGRESS = [];
  const apprenants = PROFILES.filter(p => p.role === 'apprenant');
  apprenants.forEach(user => {
    const numGames = rnd(1, 4);
    const games = [];
    for (let g = 0; g < numGames; g++) {
      const sim = pick(SIMULATIONS.filter(s => s.active));
      if (games.includes(sim.game_id)) continue;
      games.push(sim.game_id);
      const maxCh = rnd(1, sim.challenge_count);
      for (let ch = 1; ch <= maxCh; ch++) {
        USER_PROGRESS.push({
          user_id: user.id,
          game_id: sim.game_id,
          challenge_num: ch,
          score: rnd(30, 100),
          updated_at: new Date(now - rnd(0, 60) * day - rnd(0, 24 * 60) * 60000).toISOString()
        });
      }
    }
  });
  USER_PROGRESS.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  // ── Generate demo training_sessions ─────────
  const TRAINING_SESSIONS = [];
  const formateurs = PROFILES.filter(p => p.role === 'formateur');
  const statuses = ['planifiee', 'en_cours', 'terminee', 'annulee'];
  for (let i = 0; i < 25; i++) {
    const trainer = pick(formateurs);
    const sim = pick(SIMULATIONS.filter(s => s.active));
    const status = pick(statuses);
    TRAINING_SESSIONS.push({
      id: uuid(),
      title: `Session ${sim.name.split('—')[0].trim()} — Groupe ${String.fromCharCode(65 + rnd(0, 7))}`,
      simulation_id: sim.game_id,
      trainer_id: trainer.id,
      status: status,
      start_date: new Date(now + rnd(-30, 30) * day).toISOString(),
      max_participants: rnd(10, 30),
      created_at: new Date(now - rnd(5, 60) * day).toISOString()
    });
  }
  TRAINING_SESSIONS.sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

  // ── Generate demo training_requests ─────────
  const TRAINING_REQUESTS = [];
  const reqStatuses = ['en_attente', 'acceptee', 'refusee'];
  for (let i = 0; i < 12; i++) {
    const user = pick(apprenants);
    const sim = pick(SIMULATIONS.filter(s => s.active));
    TRAINING_REQUESTS.push({
      id: uuid(),
      user_id: user.id,
      user_email: user.email,
      user_name: user.full_name,
      simulation_id: sim.game_id,
      simulation_name: sim.name,
      status: i < 5 ? 'en_attente' : pick(reqStatuses),
      message: `Je souhaite suivre la formation ${sim.name.split('—')[1]?.trim() || sim.name}.`,
      created_at: new Date(now - rnd(0, 30) * day).toISOString()
    });
  }
  TRAINING_REQUESTS.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // ── Generate demo session_participants ───────
  const SESSION_PARTICIPANTS = [];
  TRAINING_SESSIONS.forEach(session => {
    const numParts = rnd(5, session.max_participants);
    const shuffled = [...apprenants].sort(() => Math.random() - 0.5).slice(0, numParts);
    shuffled.forEach(user => {
      SESSION_PARTICIPANTS.push({
        session_id: session.id,
        user_id: user.id
      });
    });
  });

  // ── Data store ──────────────────────────────
  const TABLES = {
    profiles: PROFILES,
    simulations: SIMULATIONS,
    user_progress: USER_PROGRESS,
    training_sessions: TRAINING_SESSIONS,
    training_requests: TRAINING_REQUESTS,
    session_participants: SESSION_PARTICIPANTS,
  };

  // ── Mock query builder ──────────────────────
  function createQueryBuilder(tableName) {
    let data = [...(TABLES[tableName] || [])];
    let selectFields = null;
    let filters = [];
    let orderField = null;
    let orderAsc = true;
    let limitCount = null;
    let singleMode = false;

    const builder = {
      select(fields) {
        if (fields && fields !== '*') {
          selectFields = fields.split(',').map(f => f.trim());
        }
        return builder;
      },
      eq(field, value) {
        filters.push(row => row[field] === value);
        return builder;
      },
      neq(field, value) {
        filters.push(row => row[field] !== value);
        return builder;
      },
      or(expr) {
        // Parse simple or expressions like "role.eq.apprenant,role.is.null"
        const parts = expr.split(',');
        filters.push(row => {
          return parts.some(part => {
            const m = part.match(/^(\w+)\.(eq|is|neq)\.(.+)$/);
            if (!m) return false;
            const [, field, op, val] = m;
            if (op === 'eq') return row[field] === val;
            if (op === 'neq') return row[field] !== val;
            if (op === 'is' && val === 'null') return row[field] == null;
            return false;
          });
        });
        return builder;
      },
      in(field, values) {
        filters.push(row => values.includes(row[field]));
        return builder;
      },
      gt(field, value) {
        filters.push(row => row[field] > value);
        return builder;
      },
      lt(field, value) {
        filters.push(row => row[field] < value);
        return builder;
      },
      gte(field, value) {
        filters.push(row => row[field] >= value);
        return builder;
      },
      lte(field, value) {
        filters.push(row => row[field] <= value);
        return builder;
      },
      order(field, opts = {}) {
        orderField = field;
        orderAsc = opts.ascending !== false;
        return builder;
      },
      limit(n) {
        limitCount = n;
        return builder;
      },
      maybeSingle() {
        singleMode = true;
        return builder;
      },
      single() {
        singleMode = true;
        return builder;
      },
      update(payload) {
        // Apply filters, then update matching rows
        let filtered = data;
        filters.forEach(fn => { filtered = filtered.filter(fn); });
        filtered.forEach(row => {
          Object.assign(row, payload);
        });
        return Promise.resolve({ data: filtered, error: null });
      },
      insert(rows) {
        const arr = Array.isArray(rows) ? rows : [rows];
        arr.forEach(r => {
          if (!r.id) r.id = uuid();
          if (!r.created_at) r.created_at = new Date().toISOString();
          TABLES[tableName].push(r);
        });
        return Promise.resolve({ data: arr, error: null });
      },
      delete() {
        let filtered = data;
        filters.forEach(fn => { filtered = filtered.filter(fn); });
        const ids = new Set(filtered.map(r => r.id));
        TABLES[tableName] = TABLES[tableName].filter(r => !ids.has(r.id));
        return Promise.resolve({ data: filtered, error: null });
      },
      _execute() {
        return new Promise((resolve, reject) => {
          try {
            let result = data;

            // Apply filters
            filters.forEach(fn => { result = result.filter(fn); });

            // Apply ordering
            if (orderField) {
              result.sort((a, b) => {
                const va = a[orderField], vb = b[orderField];
                if (va < vb) return orderAsc ? -1 : 1;
                if (va > vb) return orderAsc ? 1 : -1;
                return 0;
              });
            }

            // Apply limit
            if (limitCount) result = result.slice(0, limitCount);

            // Apply select projection
            if (selectFields) {
              result = result.map(row => {
                const out = {};
                selectFields.forEach(f => { out[f] = row[f]; });
                return out;
              });
            }

            // Single mode
            if (singleMode) {
              resolve({ data: result[0] || null, error: null });
            } else {
              resolve({ data: result, error: null });
            }
          } catch (err) {
            resolve({ data: [], error: err });
          }
        });
      },
      then(resolve, reject) {
        return builder._execute().then(resolve, reject);
      },
      catch(fn) {
        return builder._execute().catch(fn);
      }
    };

    return builder;
  }

  // ── Mock Supabase client ────────────────────
  window.IMM_SUPABASE = {
    from(tableName) {
      return createQueryBuilder(tableName);
    },
    auth: {
      signOut: async () => {
        window.location.href = '/';
        return { error: null };
      },
      getSession: async () => {
        return { data: { session: { user: { id: PROFILES[0].id, email: PROFILES[0].email } } }, error: null };
      },
      getUser: async () => {
        return { data: { user: { id: PROFILES[0].id, email: PROFILES[0].email, user_metadata: { full_name: 'Administrateur' } } }, error: null };
      }
    }
  };

  console.log('[Mock Supabase] Loaded with', PROFILES.length, 'profiles,', USER_PROGRESS.length, 'progress records,', SIMULATIONS.length, 'simulations');

})();
