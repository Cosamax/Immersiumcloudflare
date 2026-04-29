# Immersium API — Worker Cloudflare

Worker exposant les endpoints REST pour le dashboard admin et l'application publique. Backend D1 (`immersium-db`).

URL de production : `https://immersium-api.mx-cosaque.workers.dev`

## Authentification

L'admin réutilise le système de session existant :

1. Login via `POST /api/auth/admin` avec `{ username, pin }` → renvoie `{ token }`
2. Token stocké côté client en `localStorage` sous `imm-token` (géré par l'admin SPA)
3. Sur chaque appel d'écriture admin, header `Authorization: Bearer <token>`
4. Vérification serveur : la fonction `requireAdmin(request, db)` cherche le token en table `auth_sessions` et vérifie que le profil lié a `role='admin'`

Les endpoints **GET publics** (catalogue, simulations en lecture, etc.) ne requièrent pas d'auth — la page `/catalogue.html` continue de fonctionner pour les visiteurs anonymes.

## Endpoints CRUD principaux

| Ressource | GET liste | GET détail | POST | PATCH | DELETE |
|---|---|---|---|---|---|
| `/api/simulations` | ✅ | ✅ `/:gid` | 🔒 ✅ | 🔒 ✅ `/:gid` | 🔒 ✅ `/:gid` |
| `/api/simulation-sessions` | ✅ `?game_id=…` | — | 🔒 ✅ | 🔒 ✅ | 🔒 ✅ `?game_id=&session_num=` |
| `/api/simulation-characters` | ✅ | — | 🔒 ✅ | 🔒 ✅ `/:id` | 🔒 ✅ `/:id` |
| `/api/simulation-competences` | ✅ `?game_id=…` | — | 🔒 ✅ | 🔒 ✅ `/:id` | 🔒 ✅ `/:id` |
| `/api/challenges` | ✅ | — | 🔒 ✅ | 🔒 ✅ `/:gid` | 🔒 ✅ `/:gid` |
| `/api/questions` | ✅ `?game_id=&challenge_num=` | — | 🔒 ✅ | 🔒 ✅ `/:id` | 🔒 ✅ `/:id` |
| `/api/notions` | ✅ `?game_id=&challenge_num=` | — | 🔒 ✅ | 🔒 ✅ `/:id` | 🔒 ✅ `/:id` |

🔒 = nécessite Bearer token admin.

## Endpoints admin composites

### `POST /api/admin/simulations/import-bundle`

Import atomique d'un jeu complet (simulation + sessions + characters + competences + challenges + questions + notions) en **un seul `db.batch()` D1 transactionnel**. Tout-ou-rien.

**Body** :

```json
{
  "mode": "merge | replace | create",
  "simulation": {
    "game_id": "volteria",
    "name": "VOLTERIA",
    "subtitle": "Communication Digitale PME",
    "domain": "Communication Digitale",
    "color": "#0B3D5C",
    "level": "Intermédiaire",
    "active": 1,
    "intro_text": "...",
    "intro_html": "<div class=\"ob-section-title\">...</div>"
  },
  "sessions": [
    { "session_num": 1, "title": "Session 1 — Stratégie et fondamentaux" }
  ],
  "characters": [
    { "name": "Aurélie Saint-Prix", "role": "Tutrice", "description": "...", "sort_order": 1 }
  ],
  "competences": [
    "Calendrier éditorial multicanal",
    "Segmentation B2B/B2C"
  ],
  "challenges": [
    {
      "challenge_num": 1,
      "session_num": 1,
      "title": "Construire un calendrier éditorial mensuel cohérent",
      "scenario": "Lundi 9h. Aurélie te dit...",
      "duration_min": 55,
      "max_score": 30,
      "header_image": { "url": "https://...", "caption": "..." },
      "questions": [
        {
          "question_index": 1,
          "type": "mcq",
          "question": "...",
          "points": 10,
          "correct_answer": 2,
          "options": [
            { "id": "opt_1", "text": "...", "correct": false, "feedback": "..." }
          ]
        }
      ],
      "knowledge_notions": [
        { "title": "...", "definition": "...", "analogy": "...", "example": "..." }
      ]
    }
  ]
}
```

**Modes** :
- **`merge`** (défaut) : ajoute le contenu sans toucher à l'existant ; échoue si conflit `challenge_num` déjà présent.
- **`replace`** : supprime tout le contenu existant pour ce `game_id` puis recrée.
- **`create`** : équivalent à `replace` mais sémantique « nouveau jeu ».

**Réponse 201** :

```json
{
  "success": true,
  "mode": "create",
  "game_id": "volteria",
  "created": {
    "simulation": 1,
    "sessions": 3,
    "characters": 4,
    "competences": 10,
    "challenges": 21,
    "questions": 63,
    "notions": 21
  }
}
```

### `GET /api/admin/simulations/:gid/export-bundle`

Export complet d'un jeu au même format JSON que l'import. Utile pour :
- Backups avant modification destructive
- Duplication d'un jeu (export → modifier `game_id` → réimport)
- Versioning : commit du bundle dans `data/games/<gid>.json`

## Exemples curl

### Import d'un nouveau jeu

```bash
TOKEN="$(curl -s -X POST $API/api/auth/admin \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","pin":"1234"}' | jq -r .token)"

curl -X POST $API/api/admin/simulations/import-bundle \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d @data/games/volteria.json
```

### Export d'un jeu pour backup

```bash
curl -s $API/api/admin/simulations/volteria/export-bundle \
  -H "Authorization: Bearer $TOKEN" \
  > backup_volteria_$(date +%Y%m%d).json
```

### Suppression d'un jeu

```bash
curl -X DELETE $API/api/simulations/volteria \
  -H "Authorization: Bearer $TOKEN"
```

## Déploiement

Déploiement automatique via GitHub Actions (`.github/workflows/deploy-worker-api.yml`) sur push de `worker-api/**` vers `main`.

Déploiement manuel :

```bash
cd worker-api
npm install
npx wrangler deploy
```

## Schéma D1 — tables principales

- `simulations` (game_id PK, name, subtitle, domain, color, level, challenge_count, active, featured, intro_text, intro_html, intro_video_*, outro_video_*, category, subcategory, num, sort_order, created_at, updated_at)
- `simulation_sessions` (game_id, session_num, title) — PK composite
- `simulation_characters` (id, game_id, name, role, description, sort_order)
- `simulation_competences` (id, game_id, label, sort_order)
- `challenges` (id, game_id, challenge_num, session_num, title, scenario, duration_min, max_score, image_url, image_caption)
- `questions` (id, game_id, challenge_num, question_index, type, question, options_json, correct_answer, explanation, points)
- `knowledge_notions` (id, game_id, challenge_num, title, definition, analogy, example, sort_order)
- `profiles` (id, email, full_name, role, plan, admin_pin)
- `auth_sessions` (token PK, user_id, expires_at)
