/* ═══════════════════════════════════════════════════════════════════
   IMM-API.JS — Client API REST pour Immersium (remplace Supabase)
   Fournit window.IMM_SUPABASE compatible avec le code Bolt existant
   ═══════════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  var API_BASE = 'https://immersium-api.mx-cosaque.workers.dev/api';

  // Supabase-compatible query builder
  function QueryBuilder(table) {
    this._table = table;
    this._filters = [];
    this._orderCol = null;
    this._orderAsc = true;
    this._limitVal = null;
    this._selectCols = '*';
    this._countOnly = false;
    this._headOnly = false;
    this._single = false;
    this._maybeSingle = false;
  }

  QueryBuilder.prototype.select = function(cols, opts) {
    this._selectCols = cols || '*';
    if (opts && opts.count === 'exact') this._countOnly = true;
    if (opts && opts.head) this._headOnly = true;
    return this;
  };

  QueryBuilder.prototype.eq = function(col, val) {
    this._filters.push({ type: 'eq', col: col, val: val });
    return this;
  };

  QueryBuilder.prototype.neq = function(col, val) {
    this._filters.push({ type: 'neq', col: col, val: val });
    return this;
  };

  QueryBuilder.prototype.gt = function(col, val) {
    this._filters.push({ type: 'gt', col: col, val: val });
    return this;
  };

  QueryBuilder.prototype.gte = function(col, val) {
    this._filters.push({ type: 'gte', col: col, val: val });
    return this;
  };

  QueryBuilder.prototype.lt = function(col, val) {
    this._filters.push({ type: 'lt', col: col, val: val });
    return this;
  };

  QueryBuilder.prototype.lte = function(col, val) {
    this._filters.push({ type: 'lte', col: col, val: val });
    return this;
  };

  QueryBuilder.prototype.like = function(col, val) {
    this._filters.push({ type: 'like', col: col, val: val });
    return this;
  };

  QueryBuilder.prototype.ilike = function(col, val) {
    this._filters.push({ type: 'ilike', col: col, val: val });
    return this;
  };

  QueryBuilder.prototype.is = function(col, val) {
    this._filters.push({ type: 'is', col: col, val: val });
    return this;
  };

  QueryBuilder.prototype.in = function(col, vals) {
    this._filters.push({ type: 'in', col: col, val: vals });
    return this;
  };

  QueryBuilder.prototype.contains = function(col, val) {
    this._filters.push({ type: 'contains', col: col, val: val });
    return this;
  };

  QueryBuilder.prototype.or = function(expr) {
    this._filters.push({ type: 'or', col: null, val: expr });
    return this;
  };

  QueryBuilder.prototype.not = function(col, op, val) {
    this._filters.push({ type: 'not_' + op, col: col, val: val });
    return this;
  };

  QueryBuilder.prototype.filter = function(col, op, val) {
    this._filters.push({ type: op, col: col, val: val });
    return this;
  };

  QueryBuilder.prototype.range = function(from, to) {
    this._rangeFrom = from;
    this._rangeTo = to;
    return this;
  };

  QueryBuilder.prototype.order = function(col, opts) {
    this._orderCol = col;
    this._orderAsc = opts ? opts.ascending !== false : true;
    return this;
  };

  QueryBuilder.prototype.limit = function(n) {
    this._limitVal = n;
    return this;
  };

  QueryBuilder.prototype.single = function() {
    this._single = true;
    return this;
  };

  QueryBuilder.prototype.maybeSingle = function() {
    this._maybeSingle = true;
    return this;
  };

  QueryBuilder.prototype.insert = function(rows) {
    this._insertData = Array.isArray(rows) ? rows : [rows];
    return this;
  };

  QueryBuilder.prototype.update = function(data) {
    this._updateData = data;
    return this;
  };

  QueryBuilder.prototype.upsert = function(data) {
    this._upsertData = Array.isArray(data) ? data : [data];
    return this;
  };

  QueryBuilder.prototype.delete = function() {
    this._deleteMode = true;
    return this;
  };

  QueryBuilder.prototype.then = function(resolve, reject) {
    return this._execute().then(resolve, reject);
  };

  QueryBuilder.prototype.catch = function(reject) {
    return this._execute().catch(reject);
  };

  // Helper: find the ID value from filters
  QueryBuilder.prototype._findIdFilter = function() {
    var idKeys = ['id', 'slug', 'game_id', 'page_id'];
    for (var i = 0; i < this._filters.length; i++) {
      var f = this._filters[i];
      if (f.type === 'eq' && idKeys.indexOf(f.col) !== -1) {
        return { key: f.col, val: f.val };
      }
    }
    return null;
  };

  // Apply client-side filters to rows
  QueryBuilder.prototype._applyClientFilters = function(rows) {
    var self = this;
    self._filters.forEach(function(f) {
      switch (f.type) {
        case 'neq':
          rows = rows.filter(function(r) { return r[f.col] !== f.val; });
          break;
        case 'gt':
          rows = rows.filter(function(r) { return r[f.col] > f.val; });
          break;
        case 'gte':
          rows = rows.filter(function(r) { return r[f.col] >= f.val; });
          break;
        case 'lt':
          rows = rows.filter(function(r) { return r[f.col] < f.val; });
          break;
        case 'lte':
          rows = rows.filter(function(r) { return r[f.col] <= f.val; });
          break;
        case 'like':
          var likeRe = new RegExp(f.val.replace(/%/g, '.*'));
          rows = rows.filter(function(r) { return likeRe.test(r[f.col] || ''); });
          break;
        case 'ilike':
          var ilikeRe = new RegExp(f.val.replace(/%/g, '.*'), 'i');
          rows = rows.filter(function(r) { return ilikeRe.test(r[f.col] || ''); });
          break;
        case 'is':
          rows = rows.filter(function(r) {
            if (f.val === null) return r[f.col] === null || r[f.col] === undefined;
            return r[f.col] === f.val;
          });
          break;
        case 'in':
          rows = rows.filter(function(r) { return f.val.indexOf(r[f.col]) !== -1; });
          break;
        case 'contains':
          rows = rows.filter(function(r) {
            var v = r[f.col];
            if (typeof v === 'string') {
              try { v = JSON.parse(v); } catch(e) {}
            }
            if (Array.isArray(v) && Array.isArray(f.val)) {
              return f.val.every(function(item) { return v.indexOf(item) !== -1; });
            }
            if (typeof v === 'object' && v && typeof f.val === 'object') {
              return Object.keys(f.val).every(function(k) { return v[k] === f.val[k]; });
            }
            return String(v || '').indexOf(String(f.val)) !== -1;
          });
          break;
        case 'or':
          // Simple OR parsing: "col1.eq.val1,col2.eq.val2"
          var orParts = (f.val || '').split(',');
          rows = rows.filter(function(r) {
            return orParts.some(function(part) {
              var m = part.trim().match(/^(\w+)\.(\w+)\.(.+)$/);
              if (!m) return true;
              var col = m[1], op = m[2], val = m[3];
              if (op === 'eq') return String(r[col]) === val;
              if (op === 'neq') return String(r[col]) !== val;
              if (op === 'ilike') {
                var re = new RegExp(val.replace(/%/g, '.*'), 'i');
                return re.test(r[col] || '');
              }
              return true;
            });
          });
          break;
      }
    });
    return rows;
  };

  QueryBuilder.prototype._execute = function() {
    var self = this;
    var url = API_BASE + '/' + this._table;

    // Handle UPSERT (try update first, then insert if not found)
    if (this._upsertData) {
      var upsertPromises = this._upsertData.map(function(item) {
        var id = item.id || item.slug || item.page_id || item.game_id;
        if (id) {
          // Try update first
          return fetch(url + '/' + encodeURIComponent(id), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          }).then(function(r) {
            if (r.ok) return r.json();
            // If update fails (404), try insert
            return fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
            }).then(function(r2) { return r2.json(); });
          });
        } else {
          // No ID, just insert
          return fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          }).then(function(r) { return r.json(); });
        }
      });
      return Promise.all(upsertPromises)
        .then(function(results) { return { data: results, error: null }; })
        .catch(function(e) { return { data: null, error: e }; });
    }

    // Handle INSERT
    if (this._insertData) {
      return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this._insertData.length === 1 ? this._insertData[0] : this._insertData)
      }).then(function(r) { return r.json(); })
        .then(function(d) { return { data: d.data || d, error: null }; })
        .catch(function(e) { return { data: null, error: e }; });
    }

    // Handle UPDATE
    if (this._updateData) {
      var updateUrl = url;
      var idFilter = this._findIdFilter();
      if (idFilter) {
        updateUrl = url + '/' + encodeURIComponent(idFilter.val);
      }
      return fetch(updateUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this._updateData)
      }).then(function(r) { return r.json(); })
        .then(function(d) { return { data: d.data || d, error: null }; })
        .catch(function(e) { return { data: null, error: e }; });
    }

    // Handle DELETE
    if (this._deleteMode) {
      var deleteUrl = url;
      var delIdFilter = this._findIdFilter();
      if (delIdFilter) {
        deleteUrl = url + '/' + encodeURIComponent(delIdFilter.val);
      }
      return fetch(deleteUrl, { method: 'DELETE' })
        .then(function(r) { return r.json(); })
        .then(function(d) { return { data: d, error: null }; })
        .catch(function(e) { return { data: null, error: e }; });
    }

    // Handle GET with filters
    var params = [];
    self._filters.forEach(function(f) {
      if (f.type === 'eq') {
        params.push(encodeURIComponent(f.col) + '=' + encodeURIComponent(f.val));
      }
    });
    if (self._orderCol) {
      params.push('order=' + self._orderCol + (self._orderAsc ? '' : ':desc'));
    }
    if (self._limitVal) {
      params.push('limit=' + self._limitVal);
    }
    if (params.length) url += '?' + params.join('&');

    return fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        var rows = d.data || d;
        if (!Array.isArray(rows)) rows = rows ? [rows] : [];

        // Apply client-side filters (neq, gte, lte, ilike, contains, etc.)
        rows = self._applyClientFilters(rows);

        // Client-side ordering
        if (self._orderCol) {
          var col = self._orderCol;
          var asc = self._orderAsc;
          rows.sort(function(a, b) {
            var va = a[col], vb = b[col];
            if (va == null) return 1;
            if (vb == null) return -1;
            if (va < vb) return asc ? -1 : 1;
            if (va > vb) return asc ? 1 : -1;
            return 0;
          });
        }

        // Range
        if (self._rangeFrom !== undefined) {
          rows = rows.slice(self._rangeFrom, (self._rangeTo || rows.length) + 1);
        }

        if (self._limitVal) {
          rows = rows.slice(0, self._limitVal);
        }

        var result = { data: rows, error: null };
        if (self._countOnly) {
          result.count = rows.length;
        }
        if (self._headOnly) {
          result.data = null;
        }
        if (self._single) {
          result.data = rows[0] || null;
        }
        if (self._maybeSingle) {
          result.data = rows[0] || null;
        }
        return result;
      })
      .catch(function(e) {
        console.error('[IMM-API] Error:', e);
        return { data: null, error: e, count: 0 };
      });
  };

  // Supabase-compatible client
  var client = {
    from: function(table) {
      // Map table names to API endpoints
      var tableMap = {
        'profiles': 'profiles',
        'simulations': 'simulations',
        'challenges': 'challenges',
        'questions': 'questions',
        'knowledge_notions': 'notions',
        'notions': 'notions',
        'training_sessions': 'training-sessions',
        'training_requests': 'training-requests',
        'coaching_sessions': 'coaching-sessions',
        'game_progress': 'progress',
        'progress': 'progress',
        'user_progress': 'progress',
        'site_pages': 'pages',
        'pages': 'pages',
        'faq_items': 'faq',
        'faq': 'faq',
        'pricing_plans': 'plans',
        'plans': 'plans',
        'promotions': 'promotions',
        'promo_codes': 'promo-codes',
        'hero_slides': 'hero-slides',
        'site_content': 'site-content',
        'session_participants': 'session-participants',
        'simulation_competences': 'simulation-competences',
        'simulation_characters': 'simulation-characters',
        'page_contents': 'page-contents',
        'editorial_pages': 'pages',
        // Tables manquantes - mappées vers de nouvelles routes API
        'app_settings': 'app-settings',
        'coaching_coaches': 'coaching-coaches',
        'contact_messages': 'contact-messages',
        'featured_games': 'featured-games',
        'free_accesses': 'free-accesses',
      };
      var endpoint = tableMap[table] || table;
      return new QueryBuilder(endpoint);
    },
    auth: {
      getSession: function() {
        var raw = sessionStorage.getItem('imm-admin');
        if (raw) {
          try {
            var s = JSON.parse(raw);
            return Promise.resolve({ data: { session: s } });
          } catch(e) {}
        }
        return Promise.resolve({ data: { session: null } });
      },
      onAuthStateChange: function(cb) {
        return { data: { subscription: { unsubscribe: function(){} } } };
      },
      signOut: function() {
        sessionStorage.removeItem('imm-admin');
        return Promise.resolve({ error: null });
      }
    },
    rpc: function(name, params) {
      return fetch(API_BASE + '/rpc/' + name, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params || {})
      }).then(function(r) { return r.json(); })
        .then(function(d) { return { data: d, error: null }; })
        .catch(function(e) { return { data: null, error: e }; });
    }
  };

  window.IMM_SUPABASE = client;
  window.IMM_API_BASE = API_BASE;

  // Dispatch ready event if guard already ran
  var session = null;
  try {
    var raw = sessionStorage.getItem('imm-admin');
    if (raw) session = JSON.parse(raw);
  } catch(e) {}

  if (session) {
    var evt = new CustomEvent('imm:ready', {
      detail: {
        username: session.username || 'Admin',
        name: session.name || session.username || 'Admin',
        role: session.role
      }
    });
    setTimeout(function() { document.dispatchEvent(evt); }, 50);
  }
})();
