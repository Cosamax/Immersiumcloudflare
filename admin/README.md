# Immersium — Tableau de bord Admin

## Description
Application SPA (Single Page Application) de tableau de bord administrateur pour la plateforme Immersium, dédiée à la formation en réalité virtuelle.

## Fonctionnalités implémentées

### Navigation
- **Sidebar** collapsible (bouton toggle + état persisté localStorage)
- **Onglets principaux** dans la sidebar (19 pages)
- **Sous-onglets** contextuels par groupe (barre de tabs horizontale sous la topbar)
- **Navigation par hash URL** (`#dashboard`, `#users`, etc.)
- **Breadcrumb** dynamique
- **Recherche globale** (⌘K)
- **Panneau notifications**
- **Toasts** de confirmation/erreur

### Pages & sous-onglets
| Groupe | Onglet | Sous-onglets |
|--------|--------|-------------|
| Principal | Dashboard | — |
| Principal | Statistiques | — |
| Principal | Export données | — |
| Utilisateurs | Tous | Tous / Formateurs / Apprenants / Demandes |
| Utilisateurs | Formateurs | id. |
| Utilisateurs | Apprenants | id. |
| Utilisateurs | Demandes | id. |
| Formation | Sessions | Sessions / Résultats / Coaching / Simulations |
| Formation | Résultats | id. |
| Formation | Coaching | id. |
| Formation | Simulations VR | id. |
| Contenu | Éditeur | Éditeur / Accueil / Vedettes / Pages / FAQ |
| Contenu | Page d'accueil | id. |
| Contenu | Vedettes | id. |
| Contenu | Pages du site | id. |
| Contenu | FAQ | id. |
| Commercial | Tarifs & offres | Tarifs / Promotions |
| Commercial | Promotions | id. |
| Système | Accès & API | — |

## Structure des fichiers
```
index.html         — Coquille HTML + sidebar + topbar
css/main.css       — Variables, layout, composants UI
js/app.js          — Navigation SPA, render functions, data
src/               — Fichiers sources d'origine (non utilisés en prod)
```

## URL de navigation
| Hash | Page |
|------|------|
| `#dashboard` | Tableau de bord principal |
| `#stats` | Statistiques |
| `#export` | Export données |
| `#users` | Utilisateurs |
| `#formateurs` | Formateurs |
| `#apprenants` | Apprenants |
| `#demandes` | Demandes formation |
| `#sessions` | Sessions |
| `#results` | Résultats & scores |
| `#coaching` | Sessions coaching |
| `#simulations` | Simulations VR |
| `#editor` | Éditeur de contenu |
| `#hero` | Page d'accueil |
| `#vedettes` | Vedettes |
| `#pages` | Pages du site |
| `#faq` | FAQ |
| `#tarifs` | Tarifs & offres |
| `#promotions` | Promotions |
| `#access` | Accès & API |

## Fonctionnalités non encore implémentées
- Connexion réelle à Supabase (données de démonstration statiques)
- Authentification / guard de rôle
- CRUD réel (create/update/delete vers base de données)
- Éditeur rich-text complet (wysiwyg)
- Graphiques Chart.js avancés sur la page stats

## Prochaines étapes recommandées
1. Connecter l'instance Supabase pour les données réelles
2. Ajouter Chart.js sur la page Statistiques (courbes mensuelles)
3. Implémenter le guard `immersium-guard.js` (vérification session admin)
4. Rendre les formulaires modaux fonctionnels (POST vers API)
5. Ajouter un système de filtrage avancé côté client
