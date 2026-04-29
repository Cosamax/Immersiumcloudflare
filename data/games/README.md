# Bundles de jeux Immersium

Ce dossier contient les **bundles JSON** d'import de chaque simulation. Un fichier = un jeu, nommé `<game_id>.json`.

## À quoi ça sert

Chaque bundle est une représentation portable et complète d'un jeu Immersium :
- Métadonnées (titre, sous-titre, niveau, couleur, intro, etc.)
- Sessions narratives
- Personnages (casting)
- Compétences visées
- Challenges, questions et notions clés

Ces fichiers sont la **source de vérité** pour le contenu pédagogique. Ils sont versionnés en git → diff propre, review possible, rollback en 1 clic.

La base D1 Cloudflare est le **cache runtime** : elle est peuplée à partir de ces bundles via l'endpoint d'import (voir ci-dessous).

## Workflow d'ajout d'un nouveau jeu

1. Créer `data/games/<nouveau_id>.json` au format ci-dessous (par exemple en s'inspirant de `volteria.json`)
2. Ouvrir une PR contre `main` pour relire la diff
3. Merger → Cloudflare Pages publie le fichier à `https://immersium.fr/data/games/<id>.json`
4. Importer en D1 :
   ```bash
   TOKEN="..."  # token admin (voir admin SPA)
   curl -X POST https://immersium-api.mx-cosaque.workers.dev/api/admin/simulations/import-bundle \
     -H "Authorization: Bearer $TOKEN" \
     -H 'Content-Type: application/json' \
     -d @data/games/<id>.json
   ```
   ou via le bouton « Importer JSON » de l'admin SPA.

5. Vérifier que le jeu apparaît sur `/catalogue` et joue correctement sur `/game.html?id=<id>`.

## Format du bundle

Voir la documentation complète dans [`worker-api/README.md`](../../worker-api/README.md). Structure :

```json
{
  "bundle_version": "1.0",
  "mode": "create | merge | replace",
  "simulation": { "game_id": "...", "name": "...", "subtitle": "...", "color": "...", "level": "...", "intro_text": "...", "intro_html": "..." },
  "sessions": [{ "session_num": 1, "title": "..." }],
  "characters": [{ "name": "...", "role": "...", "description": "...", "sort_order": 1 }],
  "competences": ["..."],
  "challenges": [
    {
      "challenge_num": 1, "session_num": 1, "title": "...", "scenario": "...",
      "duration_min": 55, "max_score": 30,
      "questions": [{ "question_index": 1, "type": "mcq", "question": "...", "points": 10, "correct_answer": 2, "options": [...] }],
      "knowledge_notions": [{ "title": "...", "definition": "...", "analogy": "...", "example": "..." }]
    }
  ]
}
```

## Conventions

- `game_id` = slug en kebab-case ou snake_case lowercase (`volteria`, `lumio`, `karu_pro`)
- Nom de fichier = `<game_id>.json`
- `mode: "create"` lors du premier import ; `mode: "replace"` pour ré-importer en écrasant ; `mode: "merge"` pour ajouter du contenu sans casser l'existant
- L'endpoint d'import exécute tout dans un `db.batch()` D1 (transactionnel) : tout-ou-rien, pas d'état partiel possible
