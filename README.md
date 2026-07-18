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
| **Gameplay** | 60 FPS, coyote time, buffer de saut (1 frame), gaps scriptés puis aléatoires, escalade de difficulté |
| **Modes** | Classique (3 difficultés), entraînement, hardcore, défi du jour |
| **Meta** | 16 skins déblocables, 8 trophées, records et TOP 5 par difficulté |
| **Responsive** | Letterbox 288×512, mobile / tablette / desktop, safe-area, CTA primaires 48 px |
| **Accessibilité** | WCAG 2.1 AA, clavier complet, overlay DOM, lecteurs d'écran |
| **PWA** | Hors-ligne après 1re visite, installation sur l'écran d'accueil |
| **Performance** | Bundle app ~53 Ko gzip (Phaser vendor ~1,1 Mo, précaché) |

### Comment jouer

#### Objectif

Évitez les tuyaux et le sol/plafond. Chaque tuyau passé = **+1 point**. Battez votre record et débloquez skins et trophées.

#### Contrôles

<a id="matrice-clavier-et-entrées"></a>

| Entrée | Action |
| ------ | ------ |
| **Espace** / **tap** | Sauter, démarrer, rejouer ou **reprendre** (si pause) |
| **1** / **2** / **3** | Difficulté facile / normal / difficile (menu) |
| **T** | Mode entraînement ACTIVÉ/DÉSACTIVÉ (menu) |
| **H** | Mode hardcore ACTIVÉ/DÉSACTIVÉ (menu) |
| **D** | Lancer le défi du jour (menu ou game over) |
| **S** | Scores (menu) |
| **O** | Options (menu) |
| **K** | Skins (menu) |
| **←** / **→** | Skin précédent / suivant (panneau skins) |
| **ESC** | Pause / reprendre |
| **M** | Menu (pause ou game over) |

#### Règles et mécaniques

- **Coyote time** (5 frames) : marge à la sortie d'un gap — protège tuyaux **et plafond** (pas le sol) ; teinte oiseau `#FFD54F` (`teinteCoyoteActif`) pendant la protection.
- **Invincibilité spawn** : ~900 ms (classique), **620 ms** (hardcore) ; 1er tuyau à **1300 ms** (marge ≥400 ms).
- **Tutoriel** en 3 étapes à la première partie ; auto-skip après 3 parties si non terminé.
- **Escalade** : +3 % vitesse / 10 pts (plafond +15 % à partir du score 50) ; gaps resserrés au score 25.
- **Records** : bannière « NOUVEAU RECORD ! » en jeu ; TOP 5 par difficulté (classique et hardcore séparés).
- **Mort différenciée** : feedback visuel tuyau / sol / plafond + libellé au game over.

#### Modes de jeu

| Mode | Description |
| ---- | ----------- |
| **Classique** | 3 difficultés (vitesse, écart, intervalle — voir [`src/config.js`](src/config.js)) |
| **Entraînement** | Ralenti ×0,8, fantôme du meilleur parcours, scores non enregistrés |
| **Hardcore** | Modificateur : gaps ×0,9, vitesse/gravité ↑, coyote ↓, unlock score ≥ 20, TOP 5 dédié |
| **Défi du jour** | Séquence partagée, skin/pattern imposés, objectifs 12/19/28 +, gaps/vitesse renforcés |

Les **skins** modifient l'apparence en classique ; la **physique du pattern** (gravité/saut/vitesse) s'applique uniquement au défi du jour.

### Installation et configuration

#### Prérequis

- [Node.js](https://nodejs.org/) 20 (CI) — 18+ accepté en local
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
npm run preview    # http://localhost:8000 (Playwright CI utilise le port 4173 via vite preview)
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
| `src/` | Gameplay (`bird`, `pipes`, `scene*`), UI (`src/ui/`), meta, storage |
| `src/scene*.js` | Orchestration Phaser — `GameScene.js` mince |
| `src/skins/` | 16 skins et conditions de déblocage |
| `tests/` | Vitest (miroir des modules métier) |
| `e2e/` | Playwright (desktop, mobile, tablette) |
| `public/` | Manifest PWA, `offline.html`, polices |
| `scripts/` | Build (icônes, copie Phaser vendor) |
| `docs/` | [Design tokens](docs/design-tokens.md) · page visuelle `npm run dev:tokens` |

Documentation complémentaire : [ARCHITECTURE.md](ARCHITECTURE.md) · [CONTRIBUTING.md](CONTRIBUTING.md) · [AUDIT-EXCLUSIONS.md](AUDIT-EXCLUSIONS.md)

#### Responsive et viewports

Letterbox 288×512 ; mobile / tablette / desktop ; CTA primaires 48 px ; safe-area. Détail des projets Playwright (smoke deploy vs matrice PR) : [CONTRIBUTING.md](CONTRIBUTING.md#matrice-viewports-e2e-playwright). Commande smoke : `npm run test:e2e:smoke`.

#### Clavier et entrées

Raccourcis desktop : Espace / `1`–`3` / `T` `H` `D` / `O` `S` `K` / ESC / `M` (voir tableau contrôles ci-dessus). Mobile : tap canvas + overlay `#a11y-*`. Pinch bloqué en partie tactile ; zoom navigateur desktop jusqu’à 200 % (e2e).

Paramètre debug gameplay : `?debug` affiche FPS et hitboxes collision ; le **mode entraînement** affiche aussi les hitboxes (sprite vs collision vs tuyaux).

Référence visuelle des tokens : `npm run dev:tokens` → [`tokens.html`](tokens.html).

### Développement

```bash
npm test              # Vitest
npm run test:coverage # Couverture (seuils CI ≥ 94 % lines)
npm run test:e2e      # Playwright (viewport + chargement)
npm run test:e2e:smoke # Smoke CI (desktop + mobile portrait + tablette)
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

## English

**Floppy Bird** is a Phaser 3 / Vite arcade PWA (pipes, difficulties, skins, daily challenge, trophies). Demo: [jackavery1.github.io/Floppy-Bird](https://jackavery1.github.io/Floppy-Bird/).

Full documentation (controls, modes, setup, CI): see the French sections above and [CONTRIBUTING.md](CONTRIBUTING.md) · [ARCHITECTURE.md](ARCHITECTURE.md).

```bash
npm install && npm run dev
```

App bundle ~53 KB gzip (Phaser vendor ~1.1 MB, precached).
