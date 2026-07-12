# Floppy Bird

[![CI](https://github.com/Jackavery1/Floppy-Bird/actions/workflows/ci.yml/badge.svg)](https://github.com/Jackavery1/Floppy-Bird/actions/workflows/ci.yml)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-A11y%2090%2B%20%7C%20BP%2090%2B-green)](.)
[![A11y](https://img.shields.io/badge/A11y-WCAG%202.1%20AA-green)](.)

> Jeu arcade 2D inspiré de Flappy Bird — Phaser 3, Vite, PWA progressive. Jouable hors-ligne avec scores locaux persistants.

**Démo en ligne** : [jackavery1.github.io/Floppy-Bird](https://jackavery1.github.io/Floppy-Bird/)

---

## Table des matières

- [Français 🇫🇷](#français-)
  - [Introduction](#introduction)
  - [Aperçu du jeu](#aperçu-du-jeu)
  - [Fonctionnalités](#fonctionnalités)
  - [Comment jouer](#comment-jouer)
  - [Installation et configuration](#installation-et-configuration)
  - [Installer la PWA](#installer-la-pwa)
  - [Technologies utilisées](#technologies-utilisées)
  - [Structure du projet](#structure-du-projet)
  - [Développement](#développement)
  - [Contributeurs](#-contributeurs)
  - [Contact](#contact)
- [English 🇬🇧](#english-)

---

## Français 🇫🇷

### Introduction

**Floppy Bird** est un jeu arcade web où vous guidez un oiseau à travers une série infinie de tuyaux. Chaque tuyau franchi rapporte un point ; une collision met fin à la partie. Le jeu propose plusieurs difficultés, des skins déblocables, un défi quotidien et une progression meta (trophées), le tout accessible au clavier, à la souris et au tactile.

Projet personnel développé avec **Phaser 3** et **Vite**, déployé en **PWA** sur GitHub Pages.

### Aperçu du jeu

![Floppy Bird — aperçu](https://jackavery1.github.io/Floppy-Bird/icons/icon-512.png)

> Jouez directement sans installation : [ouvrir la démo](https://jackavery1.github.io/Floppy-Bird/)

### Fonctionnalités

| Domaine | Détail |
| ------- | ------ |
| **Gameplay** | 60 FPS, coyote time, buffer de saut, gaps scriptés puis aléatoires, escalade de difficulté |
| **Modes** | Classique (3 difficultés), entraînement, hardcore, défi du jour |
| **Meta** | 16 skins déblocables, 8 trophées, records et TOP 5 par difficulté |
| **Responsive** | Letterbox 288×512, mobile / tablette / desktop, safe-area, CTA primaires 48 px |
| **Accessibilité** | WCAG 2.1 AA, clavier complet, overlay DOM, lecteurs d'écran |
| **PWA** | Hors-ligne après 1re visite, installation sur l'écran d'accueil |
| **Performance** | Bundle app ~45 Ko gzip (Phaser vendor ~1,1 Mo, précaché) |

### Comment jouer

#### Objectif

Évitez les tuyaux et le sol/plafond. Chaque tuyau passé = **+1 point**. Battez votre record et débloquez skins et trophées.

#### Contrôles

| Entrée | Action |
| ------ | ------ |
| **Espace** / **tap** | Saut, démarrer ou rejouer |
| **1** / **2** / **3** | Difficulté facile / normal / difficile (menu) |
| **T** | Mode entraînement ON/OFF (menu) |
| **H** | Mode hardcore ON/OFF (menu) |
| **D** | Lancer le défi du jour (menu ou game over) |
| **S** | Scores (menu) |
| **O** | Options (menu) |
| **K** | Skins (menu) |
| **←** / **→** | Skin précédent / suivant (panneau skins) |
| **ESC** | Pause |
| **M** | Menu (pause ou game over) |

#### Règles et mécaniques

- **Coyote time** (5 frames) : marge de grâce à la sortie d'un gap ; teinte discrète pendant la protection au spawn (~0,9 s, **700 ms** en hardcore).
- **Tutoriel** en 3 étapes à la première partie ; auto-skip après 3 parties si non terminé.
- **Escalade** : +3 % vitesse / 10 pts (plafond +15 % à partir du score 50) ; gaps resserrés au score 20.
- **Records** : bannière « NOUVEAU RECORD ! » en jeu ; TOP 5 par difficulté (classique et hardcore séparés).
- **Mort différenciée** : feedback visuel tuyau / sol / plafond + libellé au game over.

#### Modes de jeu

| Mode | Description |
| ---- | ----------- |
| **Classique** | 3 difficultés (vitesse, écart, intervalle — voir [`src/config.js`](src/config.js)) |
| **Entraînement** | Ralenti ×0,8, fantôme du meilleur parcours, scores non enregistrés |
| **Hardcore** | Gravité/vitesse renforcées, grace spawn 700 ms, TOP 5 dédié |
| **Défi du jour** | Séquence partagée, skin/pattern/objectif imposés, rejouable depuis le game over |

Les **skins** modifient l'apparence en classique ; la **physique du pattern** (gravité/saut/vitesse) s'applique uniquement au défi du jour.

### Installation et configuration

#### Prérequis

- [Node.js](https://nodejs.org/) 18 ou supérieur
- npm (inclus avec Node.js)

#### Récupération et lancement

```bash
git clone https://github.com/Jackavery1/Floppy-Bird.git
cd Floppy-Bird
npm install
npm run dev
```

Ouvrez **http://localhost:5173** dans votre navigateur.

> **Important** : n'utilisez pas Live Server (port 5500). Sans le bundler Vite, l'écran reste bloqué sur « Chargement… ».

#### Build production (optionnel)

```bash
npm run build
npm run preview    # http://localhost:8000
```

### Installer la PWA

| Plateforme | Procédure |
| ---------- | --------- |
| **Android (Chrome)** | Menu ⋮ → « Installer l'application » |
| **iPhone / iPad (Safari)** | Partager ↑ → « Sur l'écran d'accueil » |
| **Desktop (Chrome / Edge)** | Icône ⊕ dans la barre d'adresse → Installer |
| **Orientation** | `any` dans le manifest (portrait recommandé sur mobile ; paysage tablette supporté) |

Une visite en ligne est requise avant le mode hors-ligne. Sans cache Service Worker, `public/offline.html` s'affiche.

### Technologies utilisées

| Couche | Technologie |
| ------ | ----------- |
| Moteur de jeu | Phaser 3.80 (pixel art, 60 FPS) |
| Build / dev | Vite 5 (ES modules, HMR) |
| PWA | vite-plugin-pwa + Workbox |
| Tests unitaires | Vitest 2 |
| Tests E2E | Playwright 1.49 (Chromium + WebKit) |
| Qualité | ESLint 9, Prettier 3, Lighthouse 12 |
| Langage | JavaScript ES modules |
| Déploiement | GitHub Pages + GitHub Actions |

### Structure du projet

| Dossier | Rôle |
| ------- | ---- |
| `src/` | Gameplay (`bird`, `pipes`, `scene*`), UI (`ui*`), meta, storage |
| `src/scene*.js` | Orchestration Phaser — `GameScene.js` mince |
| `src/skins/` | 16 skins et conditions de déblocage |
| `tests/` | Vitest (miroir des modules métier) |
| `e2e/` | Playwright (desktop, mobile, tablette) |
| `public/` | Manifest PWA, `offline.html`, polices |
| `scripts/` | Build (icônes, copie Phaser vendor) |
| `docs/` | [Design tokens](docs/design-tokens.md) · page visuelle `npm run dev:tokens` |

Documentation complémentaire : [ARCHITECTURE.md](ARCHITECTURE.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [AUDIT-EXCLUSIONS.md](AUDIT-EXCLUSIONS.md)

#### Matrice viewport (comportements)

| Contexte | Résolution logique | Entrée | Comportement |
| -------- | ------------------ | ------ | ------------ |
| **Desktop** | Letterbox 288×512 centré | Clavier (Espace, ESC…) + souris | Canvas cliquable ; overlay a11y masqué sauf focus clavier |
| **Mobile portrait** | Letterbox plein écran + safe-area | Tap + overlay `#a11y-*` | CTA primaires 48 px ; zone saut 96×96 px ; pause 44 px coin haut-droit |
| **Mobile paysage** | Letterbox avec bandes | Tap (overlay masqué si exclusion audit) | Même logique jeu ; voir `AUDIT-EXCLUSIONS.md` pour l’overlay paysage |
| **Tablette** | Letterbox adaptatif | Tap ou clavier externe | Projets Playwright `tablet-*` ; cibles tactiles identiques au mobile |

Paramètre debug gameplay : ajouter `?debug` à l’URL pour afficher FPS et hitboxes collision (oiseau + tuyaux).

Référence visuelle des tokens : `npm run dev:tokens` → [`tokens.html`](tokens.html).

### Développement

```bash
npm test              # Vitest
npm run test:coverage # Couverture (seuils CI ≥ 94 % lines)
npm run test:e2e      # Playwright (viewport + chargement)
npm run lint          # ESLint
npm run format        # Prettier
npm run icons         # Génère public/icons/
npm run measure       # Tailles dist/ (après build)
npm run clean         # Supprime dist/, coverage/, rapports e2e
```

Couverture Vitest en CI : seuils ≥ 94 % lines/statements, ≥ 82 % branches, ≥ 91 % functions. Dépannage npm, icônes PWA et déploiement Pages : voir [CONTRIBUTING.md](CONTRIBUTING.md).

Les scores `localStorage` conservent les clés `flappy-bird-*` (migration automatique depuis l'ancien format).

### 👥 Contributeurs

- [Joris Martinez](https://github.com/Jackavery1) — développement, design, tests

### Contact

Pour toute question ou suggestion, ouvrez une [issue](https://github.com/Jackavery1/Floppy-Bird/issues) sur GitHub.

---

## English 🇬🇧

### Introduction

**Floppy Bird** is a web arcade game where you guide a bird through an endless series of pipes. Each pipe passed scores one point; a collision ends the run. The game offers multiple difficulties, unlockable skins, a daily challenge, and meta progression (trophies), fully playable with keyboard, mouse, and touch.

Personal project built with **Phaser 3** and **Vite**, deployed as a **PWA** on GitHub Pages.

### Game Preview

![Floppy Bird — preview](https://jackavery1.github.io/Floppy-Bird/icons/icon-512.png)

> Play instantly without installation: [open the demo](https://jackavery1.github.io/Floppy-Bird/)

### Features

| Area | Detail |
| ---- | ------ |
| **Gameplay** | 60 FPS, coyote time, jump buffer, scripted then random gaps, difficulty scaling |
| **Modes** | Classic (3 difficulties), training, hardcore, daily challenge |
| **Meta** | 16 unlockable skins, 8 trophies, records and TOP 5 per difficulty |
| **Responsive** | 288×512 letterbox, mobile / tablet / desktop, safe-area, 48 px primary CTAs |
| **Accessibility** | WCAG 2.1 AA, full keyboard, DOM overlay, screen reader support |
| **PWA** | Offline after first visit, install to home screen |
| **Performance** | App bundle ~45 KB gzip (Phaser vendor ~1.1 MB, precached) |

### How to Play

#### Goal

Avoid pipes and the floor/ceiling. Each pipe passed = **+1 point**. Beat your record and unlock skins and trophies.

#### Controls

| Input | Action |
| ----- | ------ |
| **Space** / **tap** | Jump, start or replay |
| **1** / **2** / **3** | Easy / normal / hard difficulty (menu) |
| **T** | Training mode ON/OFF (menu) |
| **H** | Hardcore mode ON/OFF (menu) |
| **D** | Start daily challenge (menu or game over) |
| **S** | Scores (menu) |
| **O** | Options (menu) |
| **K** | Skins (menu) |
| **←** / **→** | Previous / next skin (skins panel) |
| **ESC** | Pause |
| **M** | Menu (pause or game over) |

#### Rules and Mechanics

- **Coyote time** (5 frames): grace margin when leaving a gap; subtle tint during spawn protection (~0.9 s, **700 ms** in hardcore).
- **Tutorial** in 3 steps on first run; auto-skip after 3 games if not completed.
- **Scaling**: +3% speed / 10 pts (cap +15% from score 50); tighter gaps at score 20.
- **Records**: « NEW RECORD! » banner in-game; TOP 5 per difficulty (classic and hardcore separate).
- **Differentiated death**: visual feedback pipe / floor / ceiling + label on game over.

#### Game Modes

| Mode | Description |
| ---- | ----------- |
| **Classic** | 3 difficulties (speed, gap, interval — see [`src/config.js`](src/config.js)) |
| **Training** | ×0.8 slow motion, ghost of best run, scores not saved |
| **Hardcore** | Increased gravity/speed, 700 ms spawn grace, dedicated TOP 5 |
| **Daily challenge** | Shared sequence, forced skin/pattern/objective, replayable from game over |

**Skins** change appearance in classic mode; **pattern physics** (gravity/jump/speed) apply only to the daily challenge.

### Setup and Configuration

#### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (included with Node.js)

#### Clone and Run

```bash
git clone https://github.com/Jackavery1/Floppy-Bird.git
cd Floppy-Bird
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

> **Important**: do not use Live Server (port 5500). Without the Vite bundler, the screen stays stuck on « Loading… ».

#### Production Build (optional)

```bash
npm run build
npm run preview    # http://localhost:8000
```

### Install the PWA

| Platform | Steps |
| -------- | ----- |
| **Android (Chrome)** | Menu ⋮ → « Install app » |
| **iPhone / iPad (Safari)** | Share ↑ → « Add to Home Screen » |
| **Desktop (Chrome / Edge)** | ⊕ icon in address bar → Install |
| **Orientation** | `any` in the manifest (portrait recommended on mobile; tablet landscape supported) |

An online visit is required before offline mode. Without Service Worker cache, `public/offline.html` is shown.

### Technologies Used

| Layer | Technology |
| ----- | ---------- |
| Game engine | Phaser 3.80 (pixel art, 60 FPS) |
| Build / dev | Vite 5 (ES modules, HMR) |
| PWA | vite-plugin-pwa + Workbox |
| Unit tests | Vitest 2 |
| E2E tests | Playwright 1.49 (Chromium + WebKit) |
| Quality | ESLint 9, Prettier 3, Lighthouse 12 |
| Language | JavaScript ES modules |
| Deployment | GitHub Pages + GitHub Actions |

### Project Structure

| Folder | Role |
| ------ | ---- |
| `src/` | Gameplay (`bird`, `pipes`, `scene*`), UI (`ui*`), meta, storage |
| `src/scene*.js` | Phaser orchestration — thin `GameScene.js` |
| `src/skins/` | 16 skins and unlock conditions |
| `tests/` | Vitest (mirror of business modules) |
| `e2e/` | Playwright (desktop, mobile, tablet) |
| `public/` | PWA manifest, `offline.html`, fonts |
| `scripts/` | Build (icons, Phaser vendor copy) |
| `docs/` | [Design tokens](docs/design-tokens.md) · page visuelle `npm run dev:tokens` |

Additional docs: [ARCHITECTURE.md](ARCHITECTURE.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [AUDIT-EXCLUSIONS.md](AUDIT-EXCLUSIONS.md)

### Development

```bash
npm test              # Vitest
npm run test:coverage # Coverage (CI thresholds ≥ 94% lines)
npm run test:e2e      # Playwright (viewport + loading)
npm run lint          # ESLint
npm run format        # Prettier
npm run icons         # Generate public/icons/
npm run measure       # dist/ sizes (after build)
npm run clean         # Remove dist/, coverage/, e2e reports
```

Vitest coverage in CI: thresholds ≥ 94% lines/statements, ≥ 82% branches, ≥ 91% functions. npm troubleshooting, PWA icons and Pages deployment: see [CONTRIBUTING.md](CONTRIBUTING.md).

`localStorage` scores keep `flappy-bird-*` keys (automatic migration from legacy format).

### 👥 Contributors

- [Joris Martinez](https://github.com/Jackavery1) — development, design, tests

### Contact

For questions or suggestions, open an [issue](https://github.com/Jackavery1/Floppy-Bird/issues) on GitHub.
