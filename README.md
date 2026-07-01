# Floppy Bird

Clone arcade — Phaser 3, Vite, PWA. Résolution interne 288×512, canvas adaptatif (letterbox).

## Commandes

> **Ne pas utiliser Live Server** (port 5500) : il ne bundle pas Vite/Phaser — écran bloqué sur « Chargement… ».  
> Lance toujours **`npm run dev`** → http://localhost:5173

```bash
npm install
npm run dev          # http://localhost:5173  ← développement local
npm run build        # dist/ + PWA (Phaser vendor/, bundle allégé)
npm run preview      # preview dist
npm test             # Vitest
npm run test:coverage
npm run test:e2e     # Playwright (viewport + chargement)
npm run lint         # ESLint
npm run icons        # public/icons/
```

Dépannage npm, icônes PWA et build Pages : voir [CONTRIBUTING.md](CONTRIBUTING.md).

## Contrôles

| Entrée | Action |
|--------|--------|
| Espace / tap | Saut, démarrer ou rejouer |
| 1 / 2 / 3 | Difficulté (menu) |
| T | Mode entraînement ON/OFF (menu) |
| H | Mode hardcore ON/OFF (menu) |
| D | Défi du jour ON/OFF (menu options) |
| O | Options (menu) |
| ESC | Pause |
| M | Menu (pause ou game over) |
| Tap « OPTIONS » | Modes, apparence, son |

## Jeu

- Tap → saut ; tuyaux infinis ; +1 par tuyau passé ; collision = mort
- 8 premiers gaps scriptés à chaque manche, puis séquence daily / aléatoire lissé
- Premier tuyau après 1,2 s ; invincibilité ~0,9 s au spawn (700→625→550 ms en hardcore sur les 3 premiers tuyaux, tuyaux seulement)
- Coyote time 5 frames dans les gaps — hitbox entière dans le gap (pas plafond/sol) ; buffer de saut 4 frames
- Tutoriel « sauter » à la première partie
- Son de palier distinct tous les 10 points
- **Record battu** → bannière « NOUVEAU RECORD ! » en jeu + badge game over
- **Records et TOP 5** par difficulté (facile / normal / difficile)
- **Mode entraînement** : ralenti (×0,65), fantôme (meilleur parcours par difficulté/hardcore), scores non enregistrés
- Escalade : +3 % vitesse tous les 10 points ; gaps resserrés après score 20
- **Défi du jour** : toggle menu (D) — séquence partagée du jour ou aléatoire libre
- **Mode hardcore** : gravité/vitesse renforcées, grace progressive 700→625→550 ms sur les 3 premiers tuyaux, **TOP 5 hardcore** séparé
- **Meta** : 4 skins et 5 trophées déblocables

Difficultés (vitesse, écart, intervalle) : voir `difficulties` dans [`src/config.js`](src/config.js).

## Structure

| Dossier | Rôle |
|---------|------|
| `src/` | gameplay (`bird`, `pipes`, `scene*`), UI (`ui*`), meta, textures |
| `tests/` | Vitest (miroir des modules métier) |
| `e2e/` | Playwright (desktop + mobile portrait/paysage) |
| `public/` | manifest PWA, `offline.html` |
| `scripts/` | build (icônes, copie Phaser vendor) |

## Build & perf

- **Dev** : Phaser bundlé par Vite (HMR rapide).
- **Production** : Phaser servi depuis `vendor/phaser.min.js` (précaché PWA, jouable hors ligne après 1ère visite).
- **Hors ligne sans visite préalable** : impossible sans cache SW — ouvre le jeu une fois en ligne (ou installe la PWA après cette visite). Voir `public/offline.html`.
- **Mobile paysage** : overlay « tourne en portrait » bloque les taps sur le jeu.

## Installer la PWA

| Plateforme | Procédure |
|------------|-----------|
| **Android (Chrome)** | Menu ⋮ → « Installer l’application » ou bannière d’installation |
| **iPhone / iPad (Safari)** | Partager ↑ → « Sur l’écran d’accueil » (icône 192 px déjà fournie) |
| **Desktop (Chrome / Edge)** | Icône ⊕ dans la barre d’adresse → Installer |

Après installation, le jeu s’ouvre en plein écran portrait (`display: standalone`). Une visite en ligne est requise avant le mode hors ligne.

## Déploiement

GitHub Pages : [https://jackavery1.github.io/Floppy-Bird/](https://jackavery1.github.io/Floppy-Bird/)

Les scores `localStorage` conservent les clés `flappy-bird-*` (migration automatique depuis l’ancien format).
