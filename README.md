# Floppy Bird

Clone arcade — Phaser 3, Vite, PWA. Résolution interne 288×512, canvas adaptatif (letterbox).

## Commandes

> **Ne pas utiliser Live Server** (port 5500) : il ne bundle pas Vite/Phaser — écran bloqué sur « Chargement… ».  
> Lance toujours **`npm run dev`** → http://localhost:5173

```bash
npm install
npm run dev          # http://localhost:5173  ← développement local
npm run build        # dist/ + PWA (Phaser via CDN, bundle allégé)
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
| H | Mode hardcore ON/OFF (menu, sans invincibilité au spawn) |
| ESC | Pause |
| M | Menu (pause ou game over) |
| Tap « SON » | Volume 100 % → 50 % → 25 % → muet |

## Jeu

- Tap → saut ; tuyaux infinis ; +1 par tuyau passé ; collision = mort
- 8 premiers gaps scriptés puis aléatoire lissé (`level.pipeGaps` dans `config.js`)
- Premier tuyau après 1,2 s ; invincibilité ~0,9 s au spawn (sauf mode hardcore)
- Tutoriel « sauter » à la première partie
- Son de palier distinct tous les 10 points
- Buffer de saut 4 frames ; 1er tap = démarrer + sauter
- **Record battu** → bannière « NOUVEAU RECORD ! » en jeu + badge game over
- **Records et TOP 5** par difficulté (facile / normal / difficile)
- **Mode entraînement** : ralenti (×0,65), fantôme (meilleur parcours), scores non enregistrés
- Escalade : +3 % vitesse tous les 10 points
- **Défi du jour** : code quotidien + **séquence de tuyaux partagée** (seed du jour, identique pour tous)
- **Mode hardcore** : pas d’invincibilité au spawn, gravité/vitesse renforcées, **TOP 5 hardcore** séparé

Difficultés (vitesse, écart, intervalle) : voir `difficulties` dans [`src/config.js`](src/config.js).

## Structure

```
src/
  config.js, storageKeys.js, gameState.js, storage.js, device.js, viewport.js
  bird.js, pipes.js, audio.js, haptics.js, training.js
  ui.js, uiLayout.js, uiMenu.js, uiMenuLayout.js, uiHud.js, uiPause.js, uiGameOver.js
  dailyChallenge.js, appBootstrap.js, phaserBootstrap.js, motion.js, sceneTypes.js
  sceneSetup.js, sceneFlow.js, sceneDeath.js, sceneJumpBuffer.js, sceneBootstrap.js
  sceneBackground.js, sceneInput.js, sceneRound.js
  textures/, scoreEffects.js
  GameScene.js, main.js, utils.js
tests/   e2e/   public/icons/   scripts/
```

## Build & perf

- **Dev** : Phaser bundlé par Vite (HMR rapide).
- **Production** : Phaser servi depuis `vendor/phaser.min.js` (précaché PWA, jouable hors ligne après 1ère visite).
- **Hors ligne sans visite préalable** : impossible sans cache SW — ouvre le jeu une fois en ligne (ou installe la PWA après cette visite). Voir `public/offline.html`.

## Déploiement

GitHub Pages : [https://jackavery1.github.io/Floppy-Bird/](https://jackavery1.github.io/Floppy-Bird/)

Les scores `localStorage` conservent les clés `flappy-bird-*` (migration automatique depuis l’ancien format).
