/**
 * Immersium API Worker — Cloudflare D1 Backend
 * Provides CRUD endpoints for the admin dashboard and public app.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function err(message, status = 400) {
  return json({ error: message }, status);
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    const db = env.DB;

    try {
      // ============================================================
      // PROFILES
      // ============================================================
      if (path === '/api/profiles' && method === 'GET') {
        const role = url.searchParams.get('role');
        const limit = parseInt(url.searchParams.get('limit') || '100');
        const offset = parseInt(url.searchParams.get('offset') || '0');
        let q = 'SELECT * FROM profiles';
        const params = [];
        if (role) { q += ' WHERE role = ?'; params.push(role); }
        q += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        const { results } = await db.prepare(q).bind(...params).all();

        // Also get count
        let cq = 'SELECT COUNT(*) as total FROM profiles';
        if (role) { cq += ' WHERE role = ?'; }
        const countRes = role
          ? await db.prepare(cq).bind(role).first()
          : await db.prepare(cq).first();

        return json({ data: results, count: countRes.total });
      }

      if (path.match(/^\/api\/profiles\/[^/]+$/) && method === 'GET') {
        const id = path.split('/').pop();
        const row = await db.prepare('SELECT * FROM profiles WHERE id = ?').bind(id).first();
        return row ? json({ data: row }) : err('Not found', 404);
      }

      if (path === '/api/profiles' && method === 'POST') {
        const body = await request.json();
        await db.prepare(
          'INSERT INTO profiles (id, email, full_name, role, plan) VALUES (?, ?, ?, ?, ?)'
        ).bind(body.id, body.email, body.full_name || '', body.role || 'apprenant', body.plan || 'Découverte').run();
        return json({ success: true }, 201);
      }

      if (path.match(/^\/api\/profiles\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = path.split('/').pop();
        const body = await request.json();
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(body)) {
          if (k !== 'id') { sets.push(`${k} = ?`); vals.push(v); }
        }
        sets.push("updated_at = datetime('now')");
        vals.push(id);
        await db.prepare(`UPDATE profiles SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        return json({ success: true });
      }

      if (path.match(/^\/api\/profiles\/[^/]+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await db.prepare('DELETE FROM profiles WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // SIMULATIONS
      // ============================================================
      if (path === '/api/simulations' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM simulations ORDER BY game_id').all();
        return json({ data: results });
      }

      if (path.match(/^\/api\/simulations\/[^/]+$/) && method === 'GET') {
        const gid = path.split('/').pop();
        const sim = await db.prepare('SELECT * FROM simulations WHERE game_id = ?').bind(gid).first();
        if (!sim) return err('Not found', 404);
        // Also get sessions
        const { results: sessions } = await db.prepare('SELECT * FROM simulation_sessions WHERE game_id = ? ORDER BY session_num').bind(gid).all();
        // Characters
        const { results: chars } = await db.prepare('SELECT * FROM simulation_characters WHERE game_id = ? ORDER BY sort_order').bind(gid).all();
        // Competences
        const { results: comps } = await db.prepare('SELECT * FROM simulation_competences WHERE game_id = ? ORDER BY sort_order').bind(gid).all();
        return json({ data: { ...sim, sessions, characters: chars, competences: comps } });
      }

      if (path.match(/^\/api\/simulations\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const gid = path.split('/').pop();
        const body = await request.json();
        const sets = [];
        const vals = [];
        const allowed = ['name', 'subtitle', 'domain', 'color', 'level', 'active', 'featured', 'featured_order', 'intro_text', 'intro_html', 'intro_video_url', 'intro_video_title', 'intro_video_poster', 'category', 'subcategory'];
        for (const [k, v] of Object.entries(body)) {
          if (allowed.includes(k)) { sets.push(`${k} = ?`); vals.push(v); }
        }
        if (sets.length > 0) {
          sets.push("updated_at = datetime('now')");
          vals.push(gid);
          await db.prepare(`UPDATE simulations SET ${sets.join(', ')} WHERE game_id = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }

      // ============================================================
      // CHALLENGES
      // ============================================================
      if (path.match(/^\/api\/simulations\/[^/]+\/challenges$/) && method === 'GET') {
        const gid = path.split('/')[3];
        const { results } = await db.prepare('SELECT * FROM challenges WHERE game_id = ? ORDER BY challenge_num').bind(gid).all();
        return json({ data: results });
      }

      if (path.match(/^\/api\/simulations\/[^/]+\/challenges\/\d+$/) && method === 'GET') {
        const parts = path.split('/');
        const gid = parts[3];
        const chNum = parseInt(parts[5]);
        const ch = await db.prepare('SELECT * FROM challenges WHERE game_id = ? AND challenge_num = ?').bind(gid, chNum).first();
        if (!ch) return err('Not found', 404);
        // Get questions
        const { results: questions } = await db.prepare('SELECT * FROM questions WHERE game_id = ? AND challenge_num = ? ORDER BY question_index').bind(gid, chNum).all();
        // Parse options_json
        for (const q of questions) {
          try { q.options = JSON.parse(q.options_json); } catch { q.options = []; }
          try { q.correct_answer = JSON.parse(q.correct_answer); } catch { /* keep as string */ }
        }
        // Get notions
        const { results: notions } = await db.prepare('SELECT * FROM knowledge_notions WHERE game_id = ? AND challenge_num = ? ORDER BY sort_order').bind(gid, chNum).all();
        return json({ data: { ...ch, questions, knowledge_notions: notions } });
      }

      if (path.match(/^\/api\/simulations\/[^/]+\/challenges\/\d+$/) && (method === 'PUT' || method === 'PATCH')) {
        const parts = path.split('/');
        const gid = parts[3];
        const chNum = parseInt(parts[5]);
        const body = await request.json();
        const sets = [];
        const vals = [];
        const allowed = ['title', 'session_num', 'scenario', 'duration_min', 'max_score'];
        for (const [k, v] of Object.entries(body)) {
          if (allowed.includes(k)) { sets.push(`${k} = ?`); vals.push(v); }
        }
        if (sets.length > 0) {
          vals.push(gid, chNum);
          await db.prepare(`UPDATE challenges SET ${sets.join(', ')} WHERE game_id = ? AND challenge_num = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }

      // ============================================================
      // QUESTIONS
      // ============================================================
      if (path.match(/^\/api\/challenges\/\d+$/) && method === 'DELETE') {
        const id = parseInt(path.split('/').pop());
        const ch = await db.prepare('SELECT game_id FROM challenges WHERE id = ?').bind(id).first();
        await db.prepare('DELETE FROM questions WHERE game_id = ? AND challenge_num = (SELECT challenge_num FROM challenges WHERE id = ?)').bind(ch?.game_id, id).run();
        await db.prepare('DELETE FROM knowledge_notions WHERE game_id = ? AND challenge_num = (SELECT challenge_num FROM challenges WHERE id = ?)').bind(ch?.game_id, id).run();
        await db.prepare('DELETE FROM challenges WHERE id = ?').bind(id).run();
        if (ch?.game_id) {
          const countRes = await db.prepare('SELECT COUNT(*) as c FROM challenges WHERE game_id = ?').bind(ch.game_id).first();
          await db.prepare('UPDATE simulations SET challenge_count = ? WHERE game_id = ?').bind(countRes.c, ch.game_id).run();
        }
        return json({ success: true });
      }

      if (path.match(/^\/api\/questions\/\d+$/) && (method === 'PUT' || method === 'PATCH')) {
        const qid = parseInt(path.split('/').pop());
        const body = await request.json();
        const sets = [];
        const vals = [];
        const allowed = ['type', 'question', 'explanation', 'points', 'correct_answer', 'yt_url', 'placeholder', 'ai_prompt', 'tool_url', 'tool_instruction'];
        for (const [k, v] of Object.entries(body)) {
          if (k === 'options') {
            sets.push('options_json = ?'); vals.push(JSON.stringify(v));
          } else if (k === 'correct_answer' && typeof v !== 'string') {
            sets.push('correct_answer = ?'); vals.push(JSON.stringify(v));
          } else if (allowed.includes(k)) {
            sets.push(`${k} = ?`); vals.push(v);
          }
        }
        if (sets.length > 0) {
          vals.push(qid);
          await db.prepare(`UPDATE questions SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }

      // ============================================================
      // KNOWLEDGE NOTIONS
      // ============================================================
      if (path.match(/^\/api\/simulations\/[^/]+\/challenges\/\d+\/notions$/) && method === 'GET') {
        const parts = path.split('/');
        const gid = parts[3];
        const chNum = parseInt(parts[5]);
        const { results } = await db.prepare('SELECT * FROM knowledge_notions WHERE game_id = ? AND challenge_num = ? ORDER BY sort_order').bind(gid, chNum).all();
        return json({ data: results });
      }

      if (path.match(/^\/api\/questions\/\d+$/) && method === 'DELETE') {
        const id = parseInt(path.split('/').pop());
        await db.prepare('DELETE FROM questions WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      if (path.match(/^\/api\/notions\/\d+$/) && method === 'DELETE') {
        const id = parseInt(path.split('/').pop());
        await db.prepare('DELETE FROM knowledge_notions WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      if (path.match(/^\/api\/notions\/\d+$/) && (method === 'PUT' || method === 'PATCH')) {
        const nid = parseInt(path.split('/').pop());
        const body = await request.json();
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(body)) {
          if (['title', 'definition', 'analogy', 'example', 'sort_order'].includes(k)) {
            sets.push(`${k} = ?`); vals.push(v);
          }
        }
        if (sets.length > 0) {
          vals.push(nid);
          await db.prepare(`UPDATE knowledge_notions SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }

      // ============================================================
      // TRAINING SESSIONS
      // ============================================================
      if (path === '/api/training-sessions' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM training_sessions ORDER BY created_at DESC').all();
        return json({ data: results });
      }

      if (path === '/api/training-sessions' && method === 'POST') {
        const body = await request.json();
        const id = body.id || crypto.randomUUID();
        await db.prepare(
          'INSERT INTO training_sessions (id, name, client, formateur_id, start_date, end_date, apprenants, simulations, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(id, body.name || '', body.client || '', body.formateur_id || '', body.start_date || '', body.end_date || '', body.apprenants || 0, body.simulations || 0, body.status || 'planifiee', body.notes || '').run();
        return json({ data: { id }, success: true }, 201);
      }

      if (path.match(/^\/api\/training-sessions\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = path.split('/').pop();
        const body = await request.json();
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(body)) {
          if (k !== 'id') { sets.push(`${k} = ?`); vals.push(v); }
        }
        sets.push("updated_at = datetime('now')");
        vals.push(id);
        await db.prepare(`UPDATE training_sessions SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        return json({ success: true });
      }

      if (path.match(/^\/api\/training-sessions\/[^/]+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await db.prepare('DELETE FROM session_participants WHERE session_id = ?').bind(id).run();
        await db.prepare('DELETE FROM training_sessions WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // TRAINING REQUESTS
      // ============================================================
      if (path === '/api/training-requests' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM training_requests ORDER BY created_at DESC').all();
        return json({ data: results });
      }

      if (path.match(/^\/api\/training-requests\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = path.split('/').pop();
        const body = await request.json();
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(body)) {
          if (k !== 'id') { sets.push(`${k} = ?`); vals.push(v); }
        }
        sets.push("updated_at = datetime('now')");
        vals.push(id);
        await db.prepare(`UPDATE training_requests SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        return json({ success: true });
      }

      // ============================================================
      // COACHING SESSIONS
      // ============================================================
      if (path === '/api/coaching-sessions' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM coaching_sessions ORDER BY created_at DESC').all();
        return json({ data: results });
      }

      if (path === '/api/coaching-sessions' && method === 'POST') {
        const body = await request.json();
        const id = body.id || crypto.randomUUID();
        await db.prepare(
          'INSERT INTO coaching_sessions (id, apprenant_id, formateur_id, game_id, date, duration_min, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(id, body.apprenant_id || '', body.formateur_id || '', body.game_id || '', body.date || '', body.duration_min || 30, body.status || 'planifiee', body.notes || '').run();
        return json({ data: { id }, success: true }, 201);
      }

      if (path.match(/^\/api\/coaching-sessions\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = path.split('/').pop();
        const body = await request.json();
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(body)) {
          if (k !== 'id') { sets.push(`${k} = ?`); vals.push(v); }
        }
        vals.push(id);
        await db.prepare(`UPDATE coaching_sessions SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        return json({ success: true });
      }

      if (path.match(/^\/api\/coaching-sessions\/[^/]+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await db.prepare('DELETE FROM coaching_sessions WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // USER PROGRESS
      // ============================================================
      if (path === '/api/progress' && method === 'GET') {
        const userId = url.searchParams.get('user_id');
        const gameId = url.searchParams.get('game_id');
        let q = 'SELECT * FROM user_progress WHERE 1=1';
        const params = [];
        if (userId) { q += ' AND user_id = ?'; params.push(userId); }
        if (gameId) { q += ' AND game_id = ?'; params.push(gameId); }
        q += ' ORDER BY updated_at DESC LIMIT 500';
        const { results } = await db.prepare(q).bind(...params).all();
        return json({ data: results });
      }

      if (path === '/api/progress' && method === 'POST') {
        const body = await request.json();
        await db.prepare(
          'INSERT OR REPLACE INTO user_progress (user_id, game_id, challenge_num, score, completed, answers_json) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(body.user_id, body.game_id, body.challenge_num, body.score || 0, body.completed || 0, JSON.stringify(body.answers || {})).run();
        return json({ success: true }, 201);
      }

      // ============================================================
      // SITE PAGES (CMS)
      // ============================================================
      if (path === '/api/pages' && method === 'GET') {
        const slug = url.searchParams.get('slug');
        if (slug) {
          const row = await db.prepare('SELECT * FROM site_pages WHERE slug = ?').bind(slug).first();
          return row ? json({ data: [row] }) : json({ data: [] });
        }
        const { results } = await db.prepare('SELECT * FROM site_pages ORDER BY slug').all();
        return json({ data: results });
      }

      if (path.match(/^\/api\/pages\/[^/]+$/) && method === 'GET') {
        const slug = path.split('/').pop();
        const row = await db.prepare('SELECT * FROM site_pages WHERE slug = ?').bind(slug).first();
        return row ? json({ data: row }) : err('Not found', 404);
      }

      if (path.match(/^\/api\/pages\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const slug = path.split('/').pop();
        const body = await request.json();
        await db.prepare(
          "INSERT OR REPLACE INTO site_pages (slug, title, content, meta_description, published, updated_at) VALUES (?, ?, ?, ?, ?, datetime('now'))"
        ).bind(slug, body.title || '', body.content || '', body.meta_description || '', body.published !== undefined ? body.published : 1).run();
        return json({ success: true });
      }

      // ============================================================
      // FAQ
      // ============================================================
      if (path === '/api/faq' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM faq ORDER BY sort_order').all();
        return json({ data: results });
      }

      if (path === '/api/faq' && method === 'POST') {
        const body = await request.json();
        await db.prepare(
          'INSERT INTO faq (question, answer, category, sort_order, published) VALUES (?, ?, ?, ?, ?)'
        ).bind(body.question || '', body.answer || '', body.category || 'Général', body.sort_order || 0, 1).run();
        return json({ success: true }, 201);
      }

      if (path.match(/^\/api\/faq\/\d+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = parseInt(path.split('/').pop());
        const body = await request.json();
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(body)) {
          if (['question', 'answer', 'category', 'sort_order', 'published'].includes(k)) {
            sets.push(`${k} = ?`); vals.push(v);
          }
        }
        if (sets.length > 0) {
          vals.push(id);
          await db.prepare(`UPDATE faq SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }

      if (path.match(/^\/api\/faq\/\d+$/) && method === 'DELETE') {
        const id = parseInt(path.split('/').pop());
        await db.prepare('DELETE FROM faq WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // PLANS
      // ============================================================
      if (path === '/api/plans' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM plans ORDER BY sort_order').all();
        return json({ data: results });
      }

      if (path === '/api/plans' && method === 'POST') {
        const body = await request.json();
        const id = body.id || crypto.randomUUID();
        await db.prepare(
          'INSERT INTO plans (id, name, price_monthly, price_yearly, features_json, active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(id, body.name || '', body.price_monthly || 0, body.price_yearly || 0, JSON.stringify(body.features || []), 1, body.sort_order || 0).run();
        return json({ data: { id }, success: true }, 201);
      }

      if (path.match(/^\/api\/plans\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = path.split('/').pop();
        const body = await request.json();
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(body)) {
          if (k === 'features') { sets.push('features_json = ?'); vals.push(JSON.stringify(v)); }
          else if (['name', 'price_monthly', 'price_yearly', 'active', 'sort_order'].includes(k)) {
            sets.push(`${k} = ?`); vals.push(v);
          }
        }
        if (sets.length > 0) {
          vals.push(id);
          await db.prepare(`UPDATE plans SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }

      if (path.match(/^\/api\/plans\/[^/]+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await db.prepare('DELETE FROM plans WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // PROMOTIONS
      // ============================================================
      if (path === '/api/promotions' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM promotions ORDER BY created_at DESC').all();
        return json({ data: results });
      }

      if (path === '/api/promotions' && method === 'POST') {
        const body = await request.json();
        const id = body.id || crypto.randomUUID();
        await db.prepare(
          'INSERT INTO promotions (id, code, discount_percent, discount_amount, valid_from, valid_until, max_uses, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(id, body.code || '', body.discount_percent || 0, body.discount_amount || 0, body.valid_from || '', body.valid_until || '', body.max_uses || 0, 1).run();
        return json({ data: { id }, success: true }, 201);
      }

      if (path.match(/^\/api\/promotions\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = path.split('/').pop();
        const body = await request.json();
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(body)) {
          if (['code', 'discount_percent', 'discount_amount', 'valid_from', 'valid_until', 'max_uses', 'active'].includes(k)) {
            sets.push(`${k} = ?`); vals.push(v);
          }
        }
        if (sets.length > 0) {
          vals.push(id);
          await db.prepare(`UPDATE promotions SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }

      if (path.match(/^\/api\/promotions\/[^/]+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await db.prepare('DELETE FROM promotions WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // PROMO CODES
      // ============================================================
      if (path === '/api/promo-codes' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM promo_codes ORDER BY created_at DESC').all();
        return json({ data: results });
      }

      if (path === '/api/promo-codes' && method === 'POST') {
        const body = await request.json();
        const id = crypto.randomUUID();
        await db.prepare(
          'INSERT INTO promo_codes (id, code, discount_type, discount_value, target, max_uses, starts_at, expires_at, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(id, body.code, body.discount_type || 'percent', body.discount_value || 0, body.target || 'all', body.max_uses || null, body.starts_at || null, body.expires_at || null, body.active !== undefined ? (body.active ? 1 : 0) : 1).run();
        return json({ data: { id }, success: true });
      }

      if (path.match(/^\/api\/promo-codes\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = path.split('/').pop();
        const body = await request.json();
        const allowed = ['code', 'discount_type', 'discount_value', 'target', 'max_uses', 'used_count', 'starts_at', 'expires_at', 'active'];
        const sets = [], vals = [];
        for (const [k, v] of Object.entries(body)) {
          if (allowed.includes(k)) { sets.push(`${k} = ?`); vals.push(v); }
        }
        if (sets.length) {
          vals.push(id);
          await db.prepare(`UPDATE promo_codes SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }

      if (path.match(/^\/api\/promo-codes\/[^/]+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await db.prepare('DELETE FROM promo_codes WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // HERO SLIDES
      // ============================================================
      if (path === '/api/hero-slides' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM hero_slides ORDER BY sort_order').all();
        return json({ data: results });
      }

      if (path === '/api/hero-slides' && method === 'POST') {
        const body = await request.json();
        const id = body.id || crypto.randomUUID();
        const badges_str = body.badges ? (typeof body.badges === 'string' ? body.badges : JSON.stringify(body.badges)) : '[]';
        await db.prepare(
          'INSERT INTO hero_slides (id, title, subtitle, cta_text, cta_url, image_url, sort_order, active, eyebrow, title_html, lede, audience, cta_primary_label, cta_primary_href, cta_secondary_label, cta_secondary_href, photo_url, photo_alt, badges) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(id, body.title || '', body.subtitle || '', body.cta_text || '', body.cta_url || '', body.image_url || '', body.sort_order || 0, body.active !== undefined ? body.active : 1, body.eyebrow || '', body.title_html || '', body.lede || '', body.audience || '', body.cta_primary_label || '', body.cta_primary_href || '', body.cta_secondary_label || '', body.cta_secondary_href || '', body.photo_url || '', body.photo_alt || '', badges_str).run();
        return json({ data: { id }, success: true }, 201);
      }

      if (path.match(/^\/api\/hero-slides\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = path.split('/').pop();
        const body = await request.json();
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(body)) {
          if (['title', 'subtitle', 'cta_text', 'cta_url', 'image_url', 'sort_order', 'active', 'eyebrow', 'title_html', 'lede', 'audience', 'cta_primary_label', 'cta_primary_href', 'cta_secondary_label', 'cta_secondary_href', 'photo_url', 'photo_alt', 'badges'].includes(k)) {
            if (k === 'badges' && typeof v !== 'string') { sets.push(`${k} = ?`); vals.push(JSON.stringify(v)); continue; }
            sets.push(`${k} = ?`); vals.push(v);
          }
        }
        if (sets.length > 0) {
          vals.push(id);
          await db.prepare(`UPDATE hero_slides SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }

      if (path.match(/^\/api\/hero-slides\/[^/]+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await db.prepare('DELETE FROM hero_slides WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // SITE CONTENT (key-value CMS)
      // ============================================================
      if (path === '/api/site-content' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM site_content ORDER BY key').all();
        return json({ data: results });
      }

      if (path.match(/^\/api\/site-content\/[^/]+$/) && method === 'GET') {
        const key = decodeURIComponent(path.split('/').pop());
        const row = await db.prepare('SELECT * FROM site_content WHERE key = ?').bind(key).first();
        return row ? json({ data: row }) : err('Not found', 404);
      }

      if (path.match(/^\/api\/site-content\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const key = decodeURIComponent(path.split('/').pop());
        const body = await request.json();
        await db.prepare(
          "INSERT OR REPLACE INTO site_content (key, value, updated_at) VALUES (?, ?, datetime('now'))"
        ).bind(key, body.value || '').run();
        return json({ success: true });
      }

      if (path === '/api/site-content' && method === 'POST') {
        const body = await request.json();
        await db.prepare(
          "INSERT OR REPLACE INTO site_content (key, value, updated_at) VALUES (?, ?, datetime('now'))"
        ).bind(body.key || '', body.value || '').run();
        return json({ success: true }, 201);
      }

      // ============================================================
      // SESSION PARTICIPANTS
      // ============================================================
      if (path === '/api/session-participants' && method === 'GET') {
        const sessionId = url.searchParams.get('session_id');
        let q = 'SELECT * FROM session_participants';
        const params = [];
        if (sessionId) { q += ' WHERE session_id = ?'; params.push(sessionId); }
        const { results } = params.length
          ? await db.prepare(q).bind(...params).all()
          : await db.prepare(q).all();
        return json({ data: results });
      }

      if (path === '/api/session-participants' && method === 'POST') {
        const body = await request.json();
        await db.prepare(
          'INSERT INTO session_participants (session_id, user_id) VALUES (?, ?)'
        ).bind(body.session_id || '', body.user_id || '').run();
        return json({ success: true }, 201);
      }

      if (path.match(/^\/api\/session-participants\/[^/]+$/) && method === 'DELETE') {
        const sessionId = path.split('/').pop();
        await db.prepare('DELETE FROM session_participants WHERE session_id = ?').bind(sessionId).run();
        return json({ success: true });
      }

      // ============================================================
      // SIMULATION COMPETENCES
      // ============================================================
      if (path === '/api/simulation-competences' && method === 'GET') {
        const gameId = url.searchParams.get('game_id');
        let q = 'SELECT * FROM simulation_competences';
        const params = [];
        if (gameId) { q += ' WHERE game_id = ?'; params.push(gameId); }
        q += ' ORDER BY sort_order';
        const { results } = params.length
          ? await db.prepare(q).bind(...params).all()
          : await db.prepare(q).all();
        return json({ data: results });
      }

      if (path === '/api/simulation-competences' && method === 'POST') {
        const body = await request.json();
        await db.prepare(
          'INSERT INTO simulation_competences (game_id, label, sort_order) VALUES (?, ?, ?)'
        ).bind(body.game_id || '', body.name || body.label || '', body.sort_order || 0).run();
        return json({ success: true }, 201);
      }

      if (path.match(/^\/api\/simulation-competences\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = path.split('/').pop();
        const body = await request.json();
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(body)) {
          if (k === 'name') { sets.push('label = ?'); vals.push(v); }
          else if (['label', 'sort_order', 'game_id'].includes(k)) {
            sets.push(`${k} = ?`); vals.push(v);
          }
        }
        if (sets.length > 0) {
          vals.push(id);
          await db.prepare(`UPDATE simulation_competences SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }

      if (path.match(/^\/api\/simulation-competences\/[^/]+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await db.prepare('DELETE FROM simulation_competences WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // SIMULATION CHARACTERS
      // ============================================================
      if (path === '/api/simulation-characters' && method === 'GET') {
        const gameId = url.searchParams.get('game_id');
        let q = 'SELECT * FROM simulation_characters';
        const params = [];
        if (gameId) { q += ' WHERE game_id = ?'; params.push(gameId); }
        q += ' ORDER BY sort_order';
        const { results } = params.length
          ? await db.prepare(q).bind(...params).all()
          : await db.prepare(q).all();
        return json({ data: results });
      }

      if (path === '/api/simulation-characters' && method === 'POST') {
        const body = await request.json();
        await db.prepare(
          'INSERT INTO simulation_characters (game_id, name, role, description, sort_order) VALUES (?, ?, ?, ?, ?)'
        ).bind(body.game_id || '', body.name || '', body.role || '', body.description || body.avatar_url || '', body.sort_order || 0).run();
        return json({ success: true }, 201);
      }

      if (path.match(/^\/api\/simulation-characters\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = path.split('/').pop();
        const body = await request.json();
        const sets = [];
        const vals = [];
        for (const [k, v] of Object.entries(body)) {
          if (k === 'avatar_url') { sets.push('description = ?'); vals.push(v); }
          else if (['name', 'role', 'description', 'sort_order', 'game_id'].includes(k)) {
            sets.push(`${k} = ?`); vals.push(v);
          }
        }
        if (sets.length > 0) {
          vals.push(id);
          await db.prepare(`UPDATE simulation_characters SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }

      if (path.match(/^\/api\/simulation-characters\/[^/]+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await db.prepare('DELETE FROM simulation_characters WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // GENERIC CHALLENGES (direct access for query builder)
      // ============================================================
      if (path === '/api/challenges' && method === 'GET') {
        const gameId = url.searchParams.get('game_id');
        const chNum = url.searchParams.get('challenge_num');
        let q = 'SELECT * FROM challenges';
        const params = [];
        const wheres = [];
        if (gameId) { wheres.push('game_id = ?'); params.push(gameId); }
        if (chNum) { wheres.push('challenge_num = ?'); params.push(parseInt(chNum)); }
        if (wheres.length) q += ' WHERE ' + wheres.join(' AND ');
        q += ' ORDER BY challenge_num';
        const { results } = params.length
          ? await db.prepare(q).bind(...params).all()
          : await db.prepare(q).all();
        // Add aliases: title -> challenge_title, session_num -> session_name
        for (const row of results) {
          row.challenge_title = row.title;
          row.session_name = row.session_num;
        }
        return json({ data: results });
      }

      if (path === '/api/challenges' && method === 'POST') {
        const body = await request.json();
        await db.prepare(
          'INSERT INTO challenges (game_id, challenge_num, session_num, title, scenario, duration_min, max_score) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(body.game_id, body.challenge_num || 1, body.session_num || 1, body.title || '', body.scenario || '', body.duration_min || 15, body.max_score || 100).run();
        return json({ success: true }, 201);
      }

      // PATCH /api/challenges/:game_id — update challenges by game_id (+ challenge_num from body or query)
      if (path.match(/^\/api\/challenges\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const gid = path.split('/').pop();
        const body = await request.json();
        const chNum = body.challenge_num || url.searchParams.get('challenge_num');
        const sets = [];
        const vals = [];
        const allowed = ['title', 'session_num', 'scenario', 'duration_min', 'max_score'];
        for (const [k, v] of Object.entries(body)) {
          if (allowed.includes(k)) { sets.push(`${k} = ?`); vals.push(v); }
        }
        if (sets.length > 0) {
          let q = `UPDATE challenges SET ${sets.join(', ')} WHERE game_id = ?`;
          vals.push(gid);
          if (chNum) { q += ' AND challenge_num = ?'; vals.push(parseInt(chNum)); }
          await db.prepare(q).bind(...vals).run();
        }
        return json({ success: true });
      }

      // ============================================================
      // GENERIC QUESTIONS (direct access for query builder)
      // ============================================================
      if (path === '/api/questions' && method === 'GET') {
        const gameId = url.searchParams.get('game_id');
        const chNum = url.searchParams.get('challenge_num');
        let q = 'SELECT * FROM questions';
        const params = [];
        const wheres = [];
        if (gameId) { wheres.push('game_id = ?'); params.push(gameId); }
        if (chNum) { wheres.push('challenge_num = ?'); params.push(parseInt(chNum)); }
        if (wheres.length) q += ' WHERE ' + wheres.join(' AND ');
        q += ' ORDER BY challenge_num, question_index';
        const { results } = params.length
          ? await db.prepare(q).bind(...params).all()
          : await db.prepare(q).all();
        // Parse options_json into options
        for (const row of results) {
          try { row.options = JSON.parse(row.options_json); } catch { row.options = []; }
          delete row.options_json;
        }
        return json({ data: results });
      }

      if (path === '/api/questions' && method === 'POST') {
        const body = await request.json();
        await db.prepare(
          'INSERT INTO questions (game_id, challenge_num, question_index, type, question, options_json, correct_answer, explanation, points) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(body.game_id, body.challenge_num || 1, body.question_index || 0, body.type || 'qcm', body.question || '', JSON.stringify(body.options || []), typeof body.correct_answer === 'string' ? body.correct_answer : JSON.stringify(body.correct_answer || ''), body.explanation || '', body.points || 10).run();
        return json({ success: true }, 201);
      }

      // ============================================================
      // GENERIC NOTIONS (direct access for query builder)
      // ============================================================
      if (path === '/api/notions' && method === 'GET') {
        const gameId = url.searchParams.get('game_id');
        const chNum = url.searchParams.get('challenge_num');
        let q = 'SELECT * FROM knowledge_notions';
        const params = [];
        const wheres = [];
        if (gameId) { wheres.push('game_id = ?'); params.push(gameId); }
        if (chNum) { wheres.push('challenge_num = ?'); params.push(parseInt(chNum)); }
        if (wheres.length) q += ' WHERE ' + wheres.join(' AND ');
        q += ' ORDER BY challenge_num, sort_order';
        const { results } = params.length
          ? await db.prepare(q).bind(...params).all()
          : await db.prepare(q).all();
        return json({ data: results });
      }

      if (path === '/api/notions' && method === 'POST') {
        const body = await request.json();
        await db.prepare(
          'INSERT INTO knowledge_notions (game_id, challenge_num, title, definition, analogy, example, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(body.game_id, body.challenge_num || 1, body.title || '', body.definition || '', body.analogy || '', body.example || '', body.sort_order || 0).run();
        return json({ success: true }, 201);
      }

      // ============================================================
      // AUTH
      // ============================================================
      if (path === '/api/auth/login' && method === 'POST') {
        const body = await request.json();
        const { email, password } = body;
        if (!email || !password) return err('Email et mot de passe requis.', 400);

        const user = await db.prepare('SELECT * FROM profiles WHERE email = ?').bind(email.toLowerCase().trim()).first();
        if (!user) return err('Email ou mot de passe incorrect.', 401);

        // Check password hash
        const encoder = new TextEncoder();
        const data = encoder.encode(password + (user.salt || ''));
        const hashBuf = await crypto.subtle.digest('SHA-256', data);
        const hashHex = [...new Uint8Array(hashBuf)].map(b => b.toString(16).padStart(2, '0')).join('');

        if (hashHex !== user.password_hash) return err('Email ou mot de passe incorrect.', 401);

        // Generate session token
        const tokenBuf = new Uint8Array(32);
        crypto.getRandomValues(tokenBuf);
        const token = [...tokenBuf].map(b => b.toString(16).padStart(2, '0')).join('');

        // Store session
        await db.prepare(
          "INSERT INTO auth_sessions (token, user_id, expires_at) VALUES (?, ?, datetime('now', '+30 days'))"
        ).bind(token, user.id).run();

        return json({
          token,
          user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role, plan: user.plan }
        });
      }

      if (path === '/api/auth/signup' && method === 'POST') {
        const body = await request.json();
        const { email, password, full_name } = body;
        if (!email || !password) return err('Email et mot de passe requis.', 400);
        if (password.length < 8) return err('Le mot de passe doit contenir au moins 8 caractères.', 400);

        // Check if email exists
        const existing = await db.prepare('SELECT id FROM profiles WHERE email = ?').bind(email.toLowerCase().trim()).first();
        if (existing) return err('Un compte avec cet email existe déjà.', 409);

        // Hash password
        const salt = [...new Uint8Array(crypto.getRandomValues(new Uint8Array(16)))].map(b => b.toString(16).padStart(2, '0')).join('');
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuf = await crypto.subtle.digest('SHA-256', data);
        const hashHex = [...new Uint8Array(hashBuf)].map(b => b.toString(16).padStart(2, '0')).join('');

        // Create user
        const id = crypto.randomUUID();
        await db.prepare(
          'INSERT INTO profiles (id, email, full_name, role, plan, password_hash, salt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(id, email.toLowerCase().trim(), full_name || '', 'apprenant', 'Découverte', hashHex, salt).run();

        // Generate session token
        const tokenBuf = new Uint8Array(32);
        crypto.getRandomValues(tokenBuf);
        const token = [...tokenBuf].map(b => b.toString(16).padStart(2, '0')).join('');

        await db.prepare(
          "INSERT INTO auth_sessions (token, user_id, expires_at) VALUES (?, ?, datetime('now', '+30 days'))"
        ).bind(token, id).run();

        return json({
          token,
          user: { id, email: email.toLowerCase().trim(), full_name: full_name || '', role: 'apprenant', plan: 'Découverte' }
        }, 201);
      }

      if (path === '/api/auth/admin' && method === 'POST') {
        const body = await request.json();
        const { username, pin } = body;
        if (!username || !pin) return err('Nom d\'utilisateur et code requis.', 400);

        // Check admin credentials
        const admin = await db.prepare(
          "SELECT * FROM profiles WHERE (email = ? OR full_name = ?) AND role = 'admin'"
        ).bind(username.toLowerCase().trim(), username.trim()).first();

        if (!admin) return err('Identifiants incorrects.', 401);

        // For admin, check pin against password_hash or use simple pin
        // Default admin pin: 1234 (stored in admin_pin column)
        const storedPin = admin.admin_pin || '1234';
        if (pin !== storedPin) return err('Code d\'accès incorrect.', 401);

        // Generate session token
        const tokenBuf = new Uint8Array(32);
        crypto.getRandomValues(tokenBuf);
        const token = [...tokenBuf].map(b => b.toString(16).padStart(2, '0')).join('');

        await db.prepare(
          "INSERT INTO auth_sessions (token, user_id, expires_at) VALUES (?, ?, datetime('now', '+30 days'))"
        ).bind(token, admin.id).run();

        return json({
          token,
          user: { id: admin.id, username: admin.full_name, role: admin.role }
        });
      }

      if (path === '/api/auth/me' && method === 'GET') {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return err('Non authentifié.', 401);
        const token = authHeader.replace('Bearer ', '');

        const session = await db.prepare(
          "SELECT s.*, p.* FROM auth_sessions s JOIN profiles p ON s.user_id = p.id WHERE s.token = ? AND s.expires_at > datetime('now')"
        ).bind(token).first();

        if (!session) return err('Session expirée.', 401);

        return json({
          user: { id: session.user_id, email: session.email, full_name: session.full_name, role: session.role, plan: session.plan }
        });
      }

      if (path === '/api/auth/logout' && method === 'POST') {
        const authHeader = request.headers.get('Authorization');
        if (authHeader) {
          const token = authHeader.replace('Bearer ', '');
          await db.prepare('DELETE FROM auth_sessions WHERE token = ?').bind(token).run();
        }
        return json({ success: true });
      }

      // ============================================================
      // STATS (aggregated)
      // ============================================================
      if (path === '/api/stats' && method === 'GET') {
        const totalUsers = await db.prepare('SELECT COUNT(*) as c FROM profiles').first();
        const totalFormateurs = await db.prepare("SELECT COUNT(*) as c FROM profiles WHERE role = 'formateur'").first();
        const totalApprenants = await db.prepare("SELECT COUNT(*) as c FROM profiles WHERE role = 'apprenant'").first();
        const totalProgress = await db.prepare('SELECT COUNT(*) as c FROM user_progress').first();
        const avgScore = await db.prepare('SELECT AVG(score) as avg FROM user_progress WHERE completed = 1').first();
        const totalSims = await db.prepare('SELECT COUNT(*) as c FROM simulations WHERE active = 1').first();

        return json({
          data: {
            total_users: totalUsers.c,
            total_formateurs: totalFormateurs.c,
            total_apprenants: totalApprenants.c,
            total_progress: totalProgress.c,
            avg_score: avgScore.avg || 0,
            total_simulations: totalSims.c,
          }
        });
      }

      // ============================================================
      // CATALOGUE (public endpoint for game.html)
      // ----------------------------------------------------------
      // Optimisé : 5 requêtes D1 globales + assemblage en mémoire
      // (au lieu de ~700 requêtes N+1). Cache HTTP via caches.default
      // (TTL 5 min). Invalidation : POST /api/catalogue/invalidate.
      // ============================================================
      if (path === '/api/catalogue' && method === 'GET') {
        const cacheUrl = new URL(request.url);
        cacheUrl.search = '';
        const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
        const cached = await caches.default.match(cacheKey);
        if (cached) {
          const h = new Headers(cached.headers);
          h.set('X-Cache', 'HIT');
          Object.entries(CORS_HEADERS).forEach(([k,v]) => h.set(k,v));
          return new Response(cached.body, { status: cached.status, headers: h });
        }

        const [simsR, sessR, chsR, qsR, notionsR] = await Promise.all([
          db.prepare('SELECT * FROM simulations WHERE active = 1 ORDER BY game_id').all(),
          db.prepare('SELECT * FROM simulation_sessions ORDER BY game_id, session_num').all(),
          db.prepare('SELECT * FROM challenges ORDER BY game_id, challenge_num').all(),
          db.prepare('SELECT * FROM questions ORDER BY game_id, challenge_num, question_index').all(),
          db.prepare('SELECT * FROM knowledge_notions ORDER BY game_id, challenge_num, sort_order').all(),
        ]);

        const sims = simsR.results || [];
        const allSess = sessR.results || [];
        const allChs = chsR.results || [];
        const allQs = qsR.results || [];
        const allNotions = notionsR.results || [];

        const sessByGame = new Map();
        for (const s of allSess) {
          if (!sessByGame.has(s.game_id)) sessByGame.set(s.game_id, []);
          sessByGame.get(s.game_id).push(s);
        }
        const chsByGame = new Map();
        const chsByGameSess = new Map();
        for (const c of allChs) {
          if (!chsByGame.has(c.game_id)) chsByGame.set(c.game_id, []);
          chsByGame.get(c.game_id).push(c);
          const k = c.game_id + '|' + c.session_num;
          if (!chsByGameSess.has(k)) chsByGameSess.set(k, []);
          chsByGameSess.get(k).push(c);
        }
        const qsByGameCh = new Map();
        for (const q of allQs) {
          const k = q.game_id + '|' + q.challenge_num;
          try { q.options = JSON.parse(q.options_json); } catch { q.options = q.options || []; }
          try { q.correct_answer = JSON.parse(q.correct_answer); } catch { /* raw */ }
          delete q.options_json;
          if (!qsByGameCh.has(k)) qsByGameCh.set(k, []);
          qsByGameCh.get(k).push(q);
        }
        const notionsByGameCh = new Map();
        for (const n of allNotions) {
          const k = n.game_id + '|' + n.challenge_num;
          if (!notionsByGameCh.has(k)) notionsByGameCh.set(k, []);
          notionsByGameCh.get(k).push(n);
        }

        const catalogue = {};
        for (const sim of sims) {
          const sessions = (sessByGame.get(sim.game_id) || []).map(sess => ({
            ...sess,
            challenges: (chsByGameSess.get(sim.game_id + '|' + sess.session_num) || [])
              .map(c => ({ id: `${sim.game_id}_ch${c.challenge_num}`, title: c.title })),
          }));
          const challenges_data = {};
          for (const ch of (chsByGame.get(sim.game_id) || [])) {
            challenges_data[`${sim.game_id}_ch${ch.challenge_num}`] = {
              scenario: ch.scenario,
              questions: qsByGameCh.get(sim.game_id + '|' + ch.challenge_num) || [],
              knowledge_notions: notionsByGameCh.get(sim.game_id + '|' + ch.challenge_num) || [],
            };
          }
          catalogue[sim.game_id] = {
            title: sim.name,
            subtitle: sim.subtitle,
            color: sim.color,
            challenges: sim.challenge_count,
            sessions,
            challenges_data,
            intro_text: sim.intro_text,
            intro_html: sim.intro_html,
            level: sim.level,
            domain: sim.domain,
          };
        }

        const body = JSON.stringify(catalogue);
        const respHeaders = {
          ...CORS_HEADERS,
          'Content-Type': 'application/json;charset=UTF-8',
          'Cache-Control': 'public, max-age=300, s-maxage=300',
          'X-Cache': 'MISS',
        };
        const cacheResp = new Response(body, {
          status: 200,
          headers: { 'Content-Type': 'application/json;charset=UTF-8', 'Cache-Control': 'public, max-age=300, s-maxage=300' },
        });
        if (ctx && ctx.waitUntil) {
          ctx.waitUntil(caches.default.put(cacheKey, cacheResp));
        } else {
          await caches.default.put(cacheKey, cacheResp);
        }
        return new Response(body, { status: 200, headers: respHeaders });
      }

      if (path === '/api/catalogue/invalidate' && method === 'POST') {
        const cacheUrl = new URL(request.url);
        cacheUrl.pathname = '/api/catalogue';
        cacheUrl.search = '';
        const cacheKey = new Request(cacheUrl.toString(), { method: 'GET' });
        const ok = await caches.default.delete(cacheKey);
        return json({ success: true, deleted: ok });
      }

            // ============================================================
      // PAGE CONTENTS (CMS)
      // ============================================================
      if (path === '/api/page-contents' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM page_contents ORDER BY page_id').all();
        return json({ data: results });
      }

      if (path.match(/^\/api\/page-contents\/[^/]+$/) && method === 'GET') {
        const pageId = decodeURIComponent(path.split('/').pop());
        const row = await db.prepare('SELECT * FROM page_contents WHERE page_id = ?').bind(pageId).first();
        if (!row) return json({ data: { page_id: pageId, content: '{}' } });
        return json({ data: row });
      }

      if (path.match(/^\/api\/page-contents\/[^/]+$/) && (method === 'PUT' || method === 'POST' || method === 'PATCH')) {
        const pageId = decodeURIComponent(path.split('/').pop());
        const body = await request.json();
        const content = typeof body.content === 'string' ? body.content : JSON.stringify(body.content);
        await db.prepare(
          `INSERT INTO page_contents (page_id, content, updated_at) VALUES (?, ?, datetime('now'))
           ON CONFLICT(page_id) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at`
        ).bind(pageId, content).run();
        return json({ success: true });
      }

      // (Duplicate endpoints removed - handled above)

      // ============================================================
      // APP SETTINGS
      // ============================================================
      if (path === '/api/app-settings' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM app_settings').all();
        return json({ data: results });
      }
      if (path === '/api/app-settings' && method === 'POST') {
        const body = await request.json();
        const key = body.key || body.id;
        const value = typeof body.value === 'string' ? body.value : JSON.stringify(body.value);
        await db.prepare(
          `INSERT INTO app_settings (key, value, updated_at) VALUES (?, ?, datetime('now'))
           ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
        ).bind(key, value).run();
        return json({ success: true });
      }
      if (path.match(/^\/api\/app-settings\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const key = decodeURIComponent(path.split('/').pop());
        const body = await request.json();
        const value = typeof body.value === 'string' ? body.value : JSON.stringify(body.value);
        await db.prepare('UPDATE app_settings SET value = ?, updated_at = datetime("now") WHERE key = ?').bind(value, key).run();
        return json({ success: true });
      }

      // ============================================================
      // COACHING COACHES
      // ============================================================
      if (path === '/api/coaching-coaches' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM coaching_coaches ORDER BY display_name').all();
        return json({ data: results });
      }
      if (path === '/api/coaching-coaches' && method === 'POST') {
        const body = await request.json();
        const id = body.id || crypto.randomUUID();
        await db.prepare(
          `INSERT INTO coaching_coaches (id, display_name, email, specialties, bio, photo_url, active, hourly_rate, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`
        ).bind(id, body.display_name||'', body.email||'', body.specialties||'[]', body.bio||'', body.photo_url||'', body.active??1, body.hourly_rate||0).run();
        return json({ data: { id }, success: true });
      }
      if (path.match(/^\/api\/coaching-coaches\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = decodeURIComponent(path.split('/').pop());
        const body = await request.json();
        const sets = []; const vals = [];
        for (const [k,v] of Object.entries(body)) {
          if (k !== 'id') { sets.push(`${k} = ?`); vals.push(typeof v === 'object' ? JSON.stringify(v) : v); }
        }
        if (sets.length) {
          vals.push(id);
          await db.prepare(`UPDATE coaching_coaches SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }
      if (path.match(/^\/api\/coaching-coaches\/[^/]+$/) && method === 'DELETE') {
        const id = decodeURIComponent(path.split('/').pop());
        await db.prepare('DELETE FROM coaching_coaches WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // CONTACT MESSAGES
      // ============================================================
      if (path === '/api/contact-messages' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
        return json({ data: results });
      }
      if (path === '/api/contact-messages' && method === 'POST') {
        const body = await request.json();
        const id = body.id || crypto.randomUUID();
        await db.prepare(
          `INSERT INTO contact_messages (id, name, email, subject, message, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`
        ).bind(id, body.name||'', body.email||'', body.subject||'', body.message||'', body.status||'new').run();
        return json({ data: { id }, success: true });
      }
      if (path.match(/^\/api\/contact-messages\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = decodeURIComponent(path.split('/').pop());
        const body = await request.json();
        const sets = []; const vals = [];
        for (const [k,v] of Object.entries(body)) {
          if (k !== 'id') { sets.push(`${k} = ?`); vals.push(v); }
        }
        if (sets.length) {
          vals.push(id);
          await db.prepare(`UPDATE contact_messages SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }
      if (path.match(/^\/api\/contact-messages\/[^/]+$/) && method === 'DELETE') {
        const id = decodeURIComponent(path.split('/').pop());
        await db.prepare('DELETE FROM contact_messages WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // FEATURED GAMES
      // ============================================================
      if (path === '/api/featured-games' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM featured_games ORDER BY sort_order').all();
        return json({ data: results });
      }
      if (path === '/api/featured-games' && method === 'POST') {
        const body = await request.json();
        const id = body.id || crypto.randomUUID();
        await db.prepare(
          `INSERT INTO featured_games (id, game_id, sort_order, active, created_at)
           VALUES (?, ?, ?, ?, datetime('now'))`
        ).bind(id, body.game_id||'', body.sort_order||0, body.active??1).run();
        return json({ data: { id }, success: true });
      }
      if (path.match(/^\/api\/featured-games\/[^/]+$/) && method === 'DELETE') {
        const id = decodeURIComponent(path.split('/').pop());
        await db.prepare('DELETE FROM featured_games WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // FREE ACCESSES
      // ============================================================
      if (path === '/api/free-accesses' && method === 'GET') {
        const { results } = await db.prepare('SELECT * FROM free_accesses ORDER BY created_at DESC').all();
        return json({ data: results });
      }
      if (path === '/api/free-accesses' && method === 'POST') {
        const body = await request.json();
        const id = body.id || crypto.randomUUID();
        await db.prepare(
          `INSERT INTO free_accesses (id, email, game_id, plan_id, reason, granted_by, expires_at, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`
        ).bind(id, body.email||'', body.game_id||'', body.plan_id||'', body.reason||'', body.granted_by||'', body.expires_at||'').run();
        return json({ data: { id }, success: true });
      }
      if (path.match(/^\/api\/free-accesses\/[^/]+$/) && (method === 'PUT' || method === 'PATCH')) {
        const id = decodeURIComponent(path.split('/').pop());
        const body = await request.json();
        const sets = []; const vals = [];
        for (const [k,v] of Object.entries(body)) {
          if (k !== 'id') { sets.push(`${k} = ?`); vals.push(v); }
        }
        if (sets.length) {
          vals.push(id);
          await db.prepare(`UPDATE free_accesses SET ${sets.join(', ')} WHERE id = ?`).bind(...vals).run();
        }
        return json({ success: true });
      }
      if (path.match(/^\/api\/free-accesses\/[^/]+$/) && method === 'DELETE') {
        const id = decodeURIComponent(path.split('/').pop());
        await db.prepare('DELETE FROM free_accesses WHERE id = ?').bind(id).run();
        return json({ success: true });
      }

      // ============================================================
      // 404
      // ============================================================
      return err('Not found', 404);

    } catch (e) {
      console.error('API Error:', e);
      return err(e.message || 'Internal server error', 500);
    }
  },
};
