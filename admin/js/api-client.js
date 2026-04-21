/* ══════════════════════════════════════════════
   IMMERSIUM — API Client (Cloudflare D1 via Worker)
   Drop-in replacement for mock-supabase.js
   Same query-builder interface, real HTTP calls.
══════════════════════════════════════════════ */

'use strict';

(function() {

  const API_BASE = 'https://immersium-api.mx-cosaque.workers.dev';

  // ── Helpers ──────────────────────────────────
  const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

  // ── Table → API endpoint mapping ────────────
  function getEndpoint(table) {
    const map = {
      profiles: '/api/profiles',
      simulations: '/api/simulations',
      user_progress: '/api/progress',
      training_sessions: '/api/training-sessions',
      training_requests: '/api/training-requests',
      coaching_sessions: '/api/coaching-sessions',
      site_pages: '/api/pages',
      faq: '/api/faq',
      plans: '/api/plans',
      promotions: '/api/promotions',
      hero_slides: '/api/hero-slides',
      session_participants: '/api/session-participants',
      certificates: '/api/certificates',
      orders: '/api/orders',
      subscriptions: '/api/subscriptions',
      // ── Aliases used by app.js ──
      faq_entries: '/api/faq',
      pricing_plans: '/api/plans',
      promo_codes: '/api/promotions',
      editorial_pages: '/api/pages',
      site_content: '/api/site-content',
      challenges: '/api/challenges',
      questions: '/api/questions',
      knowledge_notions: '/api/notions',
      simulation_competences: '/api/simulation-competences',
      simulation_characters: '/api/simulation-characters',
    };
    return map[table] || `/api/${table}`;
  }

  // ── In-memory cache for client-side filtering ──
  const cache = {};

  async function fetchTable(table, params = {}) {
    const endpoint = getEndpoint(table);
    let url = API_BASE + endpoint;
    const qs = new URLSearchParams(params).toString();
    if (qs) url += '?' + qs;

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      const data = json.data || [];
      cache[table] = Array.isArray(data) ? data : [data];
      return cache[table];
    } catch (e) {
      console.warn(`[API] Error fetching ${table}:`, e.message);
      return cache[table] || [];
    }
  }

  // ── Query builder (same interface as Supabase) ──
  function createQueryBuilder(tableName) {
    let selectFields = null;
    let filters = [];
    let filterParams = {};
    let orderField = null;
    let orderAsc = true;
    let limitCount = null;
    let singleMode = false;
    let pendingUpdate = null;
    let pendingInsert = null;
    let pendingDelete = false;
    let pendingUpsert = null;

    const builder = {
      select(fields) {
        if (fields && fields !== '*') {
          selectFields = fields.split(',').map(f => f.trim());
        }
        return builder;
      },
      eq(field, value) {
        filters.push(row => String(row[field]) === String(value));
        filterParams[field] = value;
        return builder;
      },
      neq(field, value) {
        filters.push(row => String(row[field]) !== String(value));
        return builder;
      },
      or(expr) {
        const parts = expr.split(',');
        filters.push(row => {
          return parts.some(part => {
            const m = part.match(/^(\w+)\.(eq|is|neq)\.(.+)$/);
            if (!m) return false;
            const [, field, op, val] = m;
            if (op === 'eq') return String(row[field]) === val;
            if (op === 'neq') return String(row[field]) !== val;
            if (op === 'is' && val === 'null') return row[field] == null;
            return false;
          });
        });
        return builder;
      },
      in(field, values) {
        filters.push(row => values.map(String).includes(String(row[field])));
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

      // ── Mutations (return builder for chaining with .eq() etc.) ──
      update(payload) {
        pendingUpdate = payload;
        return builder;
      },
      insert(rows) {
        pendingInsert = Array.isArray(rows) ? rows : [rows];
        return builder;
      },
      upsert(rows) {
        pendingUpsert = Array.isArray(rows) ? rows : [rows];
        return builder;
      },
      delete() {
        pendingDelete = true;
        return builder;
      },

      async _executeMutation() {
        try {
          const endpoint = getEndpoint(tableName);

          if (pendingInsert || pendingUpsert) {
            const rows = pendingInsert || pendingUpsert;
            const results = [];
            for (const row of rows) {
              if (!row.id && !row.slug && !row.key) row.id = uuid();
              if (!row.created_at) row.created_at = new Date().toISOString();
              const resp = await fetch(API_BASE + endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(row),
              });
              if (!resp.ok) {
                const errJson = await resp.json().catch(() => ({}));
                throw new Error(errJson.error || `HTTP ${resp.status}`);
              }
              results.push(row);
            }
            delete cache[tableName];
            return { data: results, error: null };
          }

          if (pendingUpdate) {
            const idField = filterParams.id || filterParams.game_id || filterParams.slug || filterParams.key;
            if (idField) {
              const resp = await fetch(API_BASE + endpoint + '/' + encodeURIComponent(idField), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pendingUpdate),
              });
              if (!resp.ok) {
                const errJson = await resp.json().catch(() => ({}));
                throw new Error(errJson.error || `HTTP ${resp.status}`);
              }
            } else {
              // Fetch all, filter client-side, update each
              const allData = await fetchTable(tableName);
              let filtered = allData;
              filters.forEach(fn => { filtered = filtered.filter(fn); });
              for (const row of filtered) {
                const rid = row.id || row.game_id || row.slug;
                if (rid) {
                  await fetch(API_BASE + endpoint + '/' + encodeURIComponent(rid), {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(pendingUpdate),
                  });
                }
              }
            }
            delete cache[tableName];
            return { data: null, error: null };
          }

          if (pendingDelete) {
            const idField = filterParams.id || filterParams.game_id || filterParams.slug || filterParams.key || filterParams.session_id;
            if (idField) {
              const resp = await fetch(API_BASE + endpoint + '/' + encodeURIComponent(idField), {
                method: 'DELETE',
              });
              if (!resp.ok) {
                const errJson = await resp.json().catch(() => ({}));
                throw new Error(errJson.error || `HTTP ${resp.status}`);
              }
            }
            delete cache[tableName];
            return { data: null, error: null };
          }

          return { data: null, error: null };
        } catch (e) {
          console.error('[API] Mutation error:', e);
          return { data: null, error: e };
        }
      },

      // ── Read execution ──
      async _execute() {
        // If there's a pending mutation, execute that instead
        if (pendingUpdate || pendingInsert || pendingDelete || pendingUpsert) {
          return builder._executeMutation();
        }

        try {
          // Fetch from API
          const allData = await fetchTable(tableName, filterParams.role ? { role: filterParams.role } : {});
          let result = [...allData];

          // Apply client-side filters
          filters.forEach(fn => { result = result.filter(fn); });

          // Apply ordering
          if (orderField) {
            result.sort((a, b) => {
              const va = a[orderField], vb = b[orderField];
              if (va == null && vb == null) return 0;
              if (va == null) return orderAsc ? 1 : -1;
              if (vb == null) return orderAsc ? -1 : 1;
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
            return { data: result[0] || null, error: null };
          }
          return { data: result, error: null };
        } catch (e) {
          console.error('[API] Query error:', e);
          return { data: singleMode ? null : [], error: e };
        }
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

  // ── API Supabase-compatible client ──────────
  window.IMM_SUPABASE = {
    from(tableName) {
      return createQueryBuilder(tableName);
    },
    auth: {
      signOut: async () => {
        const token = localStorage.getItem('imm-token');
        if (token) {
          try {
            await fetch(API_BASE + '/api/auth/logout', {
              method: 'POST',
              headers: { 'Authorization': 'Bearer ' + token }
            });
          } catch(e) {}
        }
        localStorage.removeItem('imm-token');
        localStorage.removeItem('imm-user');
        window.location.href = '../login.html';
        return { error: null };
      },
      getSession: async () => {
        const token = localStorage.getItem('imm-token');
        const stored = localStorage.getItem('imm-user');
        if (token && stored) {
          try {
            const user = JSON.parse(stored);
            return { data: { session: { user } }, error: null };
          } catch(e) {}
        }
        return { data: { session: null }, error: null };
      },
      getUser: async () => {
        const stored = localStorage.getItem('imm-user');
        if (stored) {
          try {
            const user = JSON.parse(stored);
            return {
              data: {
                user: {
                  id: user.id,
                  email: user.email,
                  user_metadata: { full_name: user.full_name || user.username || 'Administrateur' }
                }
              },
              error: null
            };
          } catch(e) {}
        }
        return { data: { user: null }, error: null };
      }
    }
  };

  console.log('[API Client] Connected to', API_BASE);

})();
