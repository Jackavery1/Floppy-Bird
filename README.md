# Floppy Bird

[![CI](https://github.com/Jackavery1/Floppy-Bird/actions/workflows/ci.yml/badge.svg)](https://github.com/Jackavery1/Floppy-Bird/actions/workflows/ci.yml)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-A11y%2090%2B%20%7C%20BP%2090%2B-green)](.)
[![A11y](https://img.shields.io/badge/A11y-WCAG%202.1%20AA-green)](.)

> Jeu arcade 2D Floppy Bird — Phaser 3, Vite, PWA progressive. Jouable hors-ligne avec scores locaux persistants.

**Démo** : [Jouer en ligne](https://jackavery1.github.io/Floppy-Bird/)

## Caractéristiques

- 🎮 **Gameplay fluide** : 60 FPS, collision detection optimisée, timing coyote
- 📱 **Responsive** : Tous les appareils (mobile, tablet, desktop) avec letterbox 288×512
- ♿ **Accessible** : WCAG 2.1 Level AA, clavier complet, screen reader support
- 🚀 **PWA** : Mode hors-ligne, installation sur home screen, caching intelligent
- 🎨 **Polish** : Particules d'impact, animations fluides, son & haptics
- 💾 **Persistant** : Scores locaux, progression meta, sélection skins sauvegardées
- ⚡ **Performance** : bundle app ~45 Ko gzip (Phaser vendor ~1,1 Mo, précaché PWA)

Couverture Vitest en CI : seuils ≥ 94 % lines / statements, ≥ 82 % branches, ≥ 91 % functions (`npm run test:coverage`). Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les artefacts locaux.

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
npm run measure      # tailles dist/ (après build)
npm run clean        # supprime dist/, coverage/, rapports e2e locaux
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
| ← / →        | Skin précédent / suivant (panneau skins)   |
| ESC          | Pause                                      |
| M            | Menu (pause ou game over)                  |

## Jeu

- Tap → saut ; tuyaux infinis ; +1 par tuyau passé ; collision = mort
- 8 premiers gaps scriptés (±10 px de jitter par manche), puis séquence daily / aléatoire lissé
- Premier tuyau après 1,2 s ; protection au spawn ~0,9 s (hardcore : grace plus courte par paliers sur les **7** premiers tuyaux — sol/plafond protégés pendant la grâce)
- Coyote time 5 frames : centre **ou** hitbox entière dans le corridor du gap (tuyaux seulement — sol et plafond restent mortels hors grâce spawn) ; teinte discrète pendant la grâce ; hint à la 1re sortie de gap + alerte si ≤ 2 frames ; buffer de saut 4 frames
- Tutoriel en 3 étapes (saut → gap → score) à la première partie, puis hint coyote au premier passage ; **auto-skip après 3 parties** si non terminé
- Son de palier distinct tous les 10 points
- **Record battu** → bannière « NOUVEAU RECORD ! » en jeu + badge game over
- **Preview vitesse** au score 9 ; **preview gaps** au score 15 puis bannière « GAPS RESSERRÉS » au score 20
- **Records et TOP 5** par difficulté (facile / normal / difficile)
- **Mode entraînement** : ralenti (×0,8), fantôme enregistré (meilleur parcours par difficulté/hardcore), scores non enregistrés
- **Défi du jour** (D) : séquence partagée, skin/pattern/objectif imposés (bases **10 / 16 / 22** pts + bonus skin), fantôme replay sans ralenti, **hors TOP 5 classique**, rejouable depuis le game over
- Escalade : +3 % vitesse / 10 pts (plafond +15 % à partir du score 50) ; preview vitesse au score 9 ; gaps resserrés après 20 ; preview combinée au score 15 ; séries à 10, 15, 20, 30, 40, 50 pts
- Hint coyote : réaffiché après chaque 3e mort sur tuyau
- **Mort différenciée** : feedback visuel (tuyau / sol / plafond) + libellé au game over ; micro slow-mo à l’impact
- **Mode hardcore** : gravité/vitesse renforcées, grace spawn échelonnée sur 7 tuyaux (sans bannière HUD), **TOP 5 hardcore** séparé
- **Skins** : apparence en classique ; **physique du pattern** (gravité/saut/vitesse) active uniquement au défi du jour
- **Meta** : 16 skins et 8 trophées déblocables (dont score 25 et série daily ×3)

Difficultés (vitesse, écart, intervalle) : voir `difficulties` dans [`src/config.js`](src/config.js).

## Structure

| Dossier         | Rôle                                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `src/`          | gameplay (`bird`, `pipes`, `scene*`), UI (`ui*` — carte : [`uiIndex.js`](src/uiIndex.js)), meta, I/O (`boolStorage`, `*Storage`) |
| `src/scene*.js` | Orchestration Phaser (flow, round, death, input…) — `GameScene.js` mince                                                         |
| `tests/`        | Vitest (miroir des modules métier ; helpers `gameSceneMocks`, `gameSceneHarness`)                                                |
| `e2e/`          | Playwright (desktop, mobile portrait/paysage Chromium + WebKit, tablette paysage)                                                |
| `public/`       | manifest PWA, `offline.html`                                                                                                     |
| `scripts/`      | build (icônes, copie Phaser vendor)                                                                                              |

**UI** : [`src/uiIndex.js`](src/uiIndex.js) réexporte la façade (`UI`, HUD, menu, pause, game over). `sceneSetup.js` l’utilise comme point d’entrée ; les sous-modules (`uiMenuOptionsLabels.js`, etc.) restent importables directement.

**Artefacts locaux** : voir [CONTRIBUTING.md](CONTRIBUTING.md).

## Build & perf

- **Dev** : Phaser bundlé par Vite (HMR rapide).
- **Production** : Phaser servi depuis `vendor/phaser.min.js` (précaché PWA, jouable hors ligne après 1ère visite).
- **Hors ligne sans visite préalable** : impossible sans cache SW — ouvre le jeu une fois en ligne (ou installe la PWA après cette visite). Voir `public/offline.html`.
- **Touch targets** : hauteur minimale **44 px** (`MIN_TOUCH`) ; boutons secondaires menu **80×44 px** (`menuBtnW` dans `uiLayoutConstants.js`, fit typo via `applyFittedLabel`)
- **Mobile paysage** : `#landscape-hint` bloque le jeu sur téléphone tactile (hauteur ≤520 px) — choix assumé ; **tablette paysage** (hauteur >520 px) autorisée
- **Accessibilité clavier** : overlay DOM transparent (`#a11y-controls`, 25 boutons) — pause, saut, menu, game over, difficultés, onglets options (Tab + Entrée)
- **Zoom** : pinch-to-zoom autorisé jusqu’à ×3 au menu ; **desktop** : zoom navigateur (ex. 200 %) conservé en partie ; **tactile** : pinch bloqué en jeu pour éviter les faux sauts ; letterbox centré via `visualViewport` (recalcul resize/scroll)
- **PWA** : `orientation: portrait-primary` (portrait recommandé sur téléphone) ; 1ère visite hors ligne → `offline.html`
- **UI** : titres menu/pause/game over en **Press Start 2P** ; métadonnées Open Graph / Twitter (`og:image` 512 px en prod)

## Installer la PWA

| Plateforme                  | Procédure                                                          |
| --------------------------- | ------------------------------------------------------------------ |
| **Android (Chrome)**        | Menu ⋮ → « Installer l’application » ou bannière d’installation    |
| **iPhone / iPad (Safari)**  | Partager ↑ → « Sur l’écran d’accueil » (icône 192 px déjà fournie) |
| **Desktop (Chrome / Edge)** | Icône ⊕ dans la barre d’adresse → Installer                        |

Après installation, le jeu s’ouvre en plein écran (`display: standalone`, portrait recommandé — voir `manifest.webmanifest`). Une visite en ligne est requise avant le mode hors ligne.

## Déploiement

GitHub Pages : [https://jackavery1.github.io/Floppy-Bird/](https://jackavery1.github.io/Floppy-Bird/) — détails dans [CONTRIBUTING.md](CONTRIBUTING.md#build-github-pages).

Les scores `localStorage` conservent les clés `flappy-bird-*` (migration automatique depuis l’ancien format).
