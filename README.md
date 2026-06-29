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

## Problème certificat npm

Si `npm install` échoue avec `UNABLE_TO_VERIFY_LEAF_SIGNATURE` ou une erreur SSL :

1. **Proxy d’entreprise** — demande le certificat racine à ton admin et configure-le :
   ```bash
   npm config set cafile "C:\chemin\vers\corp-ca.pem"
   ```
2. **Réseau temporairement bloqué** — réessaie sur un autre réseau (partage 4G, VPN personnel).
3. **Contournement local uniquement** (non recommandé en production) :
   ```bash
   npm install --strict-ssl=false
   ```
   À n’utiliser que si les options ci-dessus ne sont pas possibles.

## Contrôles

| Entrée | Action |
|--------|--------|
| Espace / tap | Saut, démarrer ou rejouer |
| 1 / 2 / 3 | Difficulté (menu) |
| T | Mode entraînement ON/OFF (menu) |
| ESC | Pause |
| M | Menu (pause ou game over) |
| Tap « SON » | Volume 100 % → 50 % → 25 % → muet |

## Jeu

- Tap → saut ; tuyaux infinis ; +1 par tuyau passé ; collision = mort
- 8 premiers gaps scriptés puis aléatoire lissé (`level.pipeGaps` dans `config.js`)
- Premier tuyau après 1,2 s ; invincibilité ~0,9 s au spawn
- Buffer de saut 4 frames ; 1er tap = démarrer + sauter
- **Record battu** → bannière « NOUVEAU RECORD ! » en jeu + badge game over
- **Records et TOP 5** par difficulté (facile / normal / difficile)
- **Mode entraînement** : ralenti (×0,65), fantôme (meilleur parcours), scores non enregistrés
- Escalade : +3 % vitesse tous les 10 points

### Difficultés

| | Vitesse | Écart | Intervalle |
|--|---------|-------|------------|
| Facile | 1.85 | 142 | 92 |
| Normal | 2.7 | 112 | 76 |
| Difficile | 3.4 | 98 | 68 |

## Structure

```
src/
  config.js, gameState.js, storage.js, device.js, viewport.js
  bird.js, pipes.js, audio.js, haptics.js, training.js
  ui.js, uiLayout.js, uiGameOver.js
  sceneSetup.js, sceneFlow.js, sceneDeath.js, sceneJumpBuffer.js, sceneBootstrap.js
  sceneBackground.js, sceneInput.js, sceneRound.js
  proceduralTextures.js, textures/, scoreEffects.js
  GameScene.js, main.js, utils.js
tests/   e2e/   public/icons/   scripts/
```

## Build & perf

- **Dev** : Phaser bundlé par Vite (HMR rapide).
- **Production** : Phaser chargé depuis jsDelivr (chunk séparé ~0 Ko dans `dist/`), mis en cache par la PWA.

## Déploiement

GitHub Pages : workflow `deploy.yml` — `npm test`, `npm run lint`, build, déploiement `dist/`.

URL : [https://jackavery1.github.io/Floppy-Bird/](https://jackavery1.github.io/Floppy-Bird/)

Test local du build Pages :

```bash
# PowerShell
$env:BASE_PATH="/Floppy-Bird/"; npm run build; npm run preview
```

Les scores `localStorage` conservent les clés `flappy-bird-*` (migration automatique depuis l’ancien format).
