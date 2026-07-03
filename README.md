# Floppy Bird

[![CI](https://github.com/Jackavery1/Floppy-Bird/actions/workflows/ci.yml/badge.svg)](https://github.com/Jackavery1/Floppy-Bird/actions/workflows/ci.yml)

Clone arcade — Phaser 3, Vite, PWA. Résolution interne 288×512, canvas adaptatif (letterbox).

Couverture Vitest en CI : seuils ≥ 75 % lines / statements, ≥ 70 % functions / branches (`npm run test:coverage`).

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
npm run format:check # Prettier (vérif)
npm run format       # Prettier (appliquer)
npm run icons        # public/icons/
```

Dépannage npm, icônes PWA et build Pages : voir [CONTRIBUTING.md](CONTRIBUTING.md).

## Contrôles

| Entrée       | Action                                     |
| ------------ | ------------------------------------------ |
| Espace / tap | Saut, démarrer ou rejouer                  |
| 1 / 2 / 3    | Difficulté (menu)                          |
| T            | Mode entraînement ON/OFF (menu)            |
| H            | Mode hardcore ON/OFF (menu)                |
| D            | Lancer le défi du jour (menu ou game over) |
| S            | Scores (menu)                              |
| O            | Options (menu)                             |
| K            | Skins (menu)                               |
| ESC          | Pause                                      |
| M            | Menu (pause ou game over)                  |

## Jeu

- Tap → saut ; tuyaux infinis ; +1 par tuyau passé ; collision = mort
- 8 premiers gaps scriptés à chaque manche, puis séquence daily / aléatoire lissé
- Premier tuyau après 1,2 s ; invincibilité ~0,9 s au spawn (hardcore : 700→325 ms sur les 6 premiers tuyaux, collisions tuyaux seulement)
- Coyote time 5 frames : centre **ou** hitbox entière dans le corridor du gap ; teinte discrète pendant la grâce ; hint « seconde chance » la première fois ; buffer de saut 4 frames
- Tutoriel en 3 étapes (saut → gap → score) à la première partie, puis hint coyote au premier passage
- Son de palier distinct tous les 10 points
- **Record battu** → bannière « NOUVEAU RECORD ! » en jeu + badge game over
- **Records et TOP 5** par difficulté (facile / normal / difficile)
- **Mode entraînement** : ralenti (×0,65), fantôme enregistré (meilleur parcours par difficulté/hardcore), scores non enregistrés
- **Défi du jour** (D) : séquence partagée, skin/objectif imposés, fantôme replay sans ralenti, **hors TOP 5 classique**, rejouable depuis le game over
- Escalade : +3 % vitesse / 10 pts ; gaps resserrés après 20 ; preview « DIFFICULTÉ ↑ à 20 » au score 18, bannière « DIFFICULTÉ ↑ » (20) et séries à 10, 15, 20, 30, 40, 50 pts
- **Mort différenciée** : feedback visuel (tuyau / sol / plafond) + libellé au game over ; micro slow-mo à l’impact
- **Mode hardcore** : gravité/vitesse renforcées, grace progressive 700→325 ms sur 6 tuyaux (bannière « Invincible N ms » à chaque renouvellement), **TOP 5 hardcore** séparé
- **Meta** : 16 skins et 8 trophées déblocables (dont score 25 et série daily ×3)

Difficultés (vitesse, écart, intervalle) : voir `difficulties` dans [`src/config.js`](src/config.js).

## Structure

| Dossier         | Rôle                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| `src/`          | gameplay (`bird`, `pipes`, `scene*`), UI (`ui*` — carte : [`uiIndex.js`](src/uiIndex.js)), meta, textures |
| `src/scene*.js` | Orchestration Phaser (flow, round, death, input…) — `GameScene.js` mince                                  |
| `tests/`        | Vitest (miroir des modules métier)                                                                        |
| `e2e/`          | Playwright (desktop, mobile portrait/paysage Chromium + WebKit, tablette paysage)                         |
| `public/`       | manifest PWA, `offline.html`                                                                              |
| `scripts/`      | build (icônes, copie Phaser vendor)                                                                       |

**UI** : [`src/uiIndex.js`](src/uiIndex.js) réexporte la façade (`UI`, HUD, menu, pause, game over). `sceneSetup.js` l’utilise comme point d’entrée ; les sous-modules (`uiMenuOptionsLabels.js`, etc.) restent importables directement.

**Artefacts locaux** (`dist/`, `test-results/`, `coverage/`, `playwright-report/`) : générés par build/tests, ignorés par git — ne pas les committer.

## Build & perf

- **Dev** : Phaser bundlé par Vite (HMR rapide).
- **Production** : Phaser servi depuis `vendor/phaser.min.js` (précaché PWA, jouable hors ligne après 1ère visite).
- **Hors ligne sans visite préalable** : impossible sans cache SW — ouvre le jeu une fois en ligne (ou installe la PWA après cette visite). Voir `public/offline.html`.
- **Mobile paysage** : overlay bloquant sur téléphone tactile (hauteur ≤520 px) ; **tablette paysage** (hauteur >520 px) autorisée
- **Zoom** : pinch-to-zoom autorisé jusqu’à ×3 (accessibilité) ; le canvas reste en letterbox

## Installer la PWA

| Plateforme                  | Procédure                                                          |
| --------------------------- | ------------------------------------------------------------------ |
| **Android (Chrome)**        | Menu ⋮ → « Installer l’application » ou bannière d’installation    |
| **iPhone / iPad (Safari)**  | Partager ↑ → « Sur l’écran d’accueil » (icône 192 px déjà fournie) |
| **Desktop (Chrome / Edge)** | Icône ⊕ dans la barre d’adresse → Installer                        |

Après installation, le jeu s’ouvre en plein écran (`display: standalone`, orientation libre). Une visite en ligne est requise avant le mode hors ligne.

## Déploiement

GitHub Pages : [https://jackavery1.github.io/Floppy-Bird/](https://jackavery1.github.io/Floppy-Bird/) — détails dans [CONTRIBUTING.md](CONTRIBUTING.md#build-github-pages).

Les scores `localStorage` conservent les clés `flappy-bird-*` (migration automatique depuis l’ancien format).
