# Floppy Bird

Clone arcade type Flappy — Phaser 3, PWA, un niveau, scores locaux.

## Démarrage

```bash
npm install
# Si erreur certificat : npm install --strict-ssl=false

npm run dev           # http://localhost:5173
npm run build         # dist/ + PWA
npm start             # preview dist/ :8000
npm test              # tests unitaires
npm run test:coverage # tests + rapport de couverture (seuils dans vitest.config.js)
npm run icons         # génère public/icons/ (PNG PWA + favicon)
npm run icons:optimize
```

## Structure (v1.5)

```
src/
├── config.js              # Config 288×512, niveau, difficultés
├── gameState.js           # États figés (menu, playing, dying…)
├── gameStateRules.js      # Règles de transition (testables)
├── gameConstants.js       # SOUND, DIFFICULTY
├── uiLayout.js            # Grille Y + panneau game over
├── utils.js
├── proceduralTextures.js  # Sprites générés (oiseau, tuyaux, fond)
├── audio.js               # Sons Web Audio + volume + mute
├── bird.js, pipes.js
├── ui.js
├── ScorePopupPool.js, ScoreParticlePool.js
├── GameScene.js
└── main.js                # Phaser + resizeCanvas mobile
public/icons/, offline.html
tests/                     # unitaires + smoke GameScene + uiLayout
scripts/
```

Résolution interne **288×512** ; le canvas CSS s’adapte à l’écran (letterbox, sans déformation).

## Modifier le parcours de tuyaux

Édite `src/config.js` :

```javascript
level: {
  name: 'Ciel débutant',
  pipeGaps: [150, 190, 230, 170, 210, 130, 250, 185],
},
```

Les 8 premières positions sont scriptées puis aléatoires. Chaque valeur est re-clampée selon le `pipeGap` de la difficulté active (142 facile / 112 normal / 98 difficile).

## Contrôles

| Entrée | Action |
|--------|--------|
| Espace / tap | Saut (en jeu) ou démarrer / rejouer |
| 1 / 2 / 3 | Difficulté (menu) |
| ESC | Pause |
| M | Menu (pause ou game over) |
| Tap « SON » (menu) | Cycle volume 100 % → 50 % → 25 % → muet |

## Tests

- `npm test` — suite Vitest (logique, audio, pools, états, layout).
- `npm run test:coverage` — couverture v8 sur la logique métier (`coverage/`). Seuils Vitest : 75 % lignes (hors `ui.js`, `GameScene.js`, `proceduralTextures.js`, `main.js`).

Les scores localStorage conservent les clés `flappy-bird-*` pour ne pas perdre les parties enregistrées avant le renommage du package.

## GitHub Pages

URL : [https://jackavery1.github.io/Floppy-Bird/](https://jackavery1.github.io/Floppy-Bird/)

Le dépôt doit publier le dossier **`dist/`** (build Vite), pas les sources. Un workflow `.github/workflows/deploy.yml` build et déploie à chaque push sur `main`.

1. Sur GitHub : **Settings → Pages → Build and deployment → Source** → **GitHub Actions**.
2. Push sur `main` : le workflow `Deploy GitHub Pages` génère `dist/` avec `base: /Floppy-Bird/` puis déploie.

Test local du build Pages :

```bash
# PowerShell
$env:BASE_PATH="/Floppy-Bird/"; npm run build; npm run preview
```
