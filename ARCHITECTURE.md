# Architecture - Floppy Bird v1.6.0

## Vue d'ensemble

Floppy Bird est un clone arcade 2D construit avec **Phaser 3** et **Vite**, déployé comme **PWA**.

```
┌─────────────────────────────────────────┐
│         Phaser 3 (Game Engine)          │
├─────────────────────────────────────────┤
│  Scenes      │  Physics  │  Input       │
│  (Game Loop) │ (Collide) │ (Keyboard)   │
├─────────────────────────────────────────┤
│  Vite (Build & Dev Server)              │
├─────────────────────────────────────────┤
│  PWA (Service Worker + Manifest)        │
└─────────────────────────────────────────┘
```

## Structure des fichiers

```
src/
├── main.js                    # Point d'entrée
├── gameState.js               # État global du jeu
├── config.js                  # Configuration (résolution, physics, etc)
├── designTokens.js            # Design tokens (couleurs, polices)
├── utils.js                   # Utilités (random, lerp, etc)
│
├── Game Loop
├── sceneBootstrap.js          # Initialisation Phaser
├── sceneSetup.js              # Setup initial
├── sceneRound.js              # Boucle principale de jeu
├── sceneDeath.js              # Gestion de la mort
├── sceneFeedback.js           # Feedback (particules, shake, etc)
├── sceneInput.js              # Gestion des inputs
├── sceneFlow.js               # Transitions entre scènes
│
├── Game Objects
├── bird.js                    # Physique et animation de l'oiseau
├── pipes.js                   # Génération et collision des tuyaux
├── pipeSpawn.js               # Logique de spawn des tuyaux
├── pipeCollision.js           # Détection collision
├── pipeGaps.js                # Gestion des espaces entre tuyaux
│
├── Game State
├── roundState.js              # État de la manche en cours
├── roundScore.js              # Calcul du score
├── metaProgress.js            # Progression meta (records, etc)
├── storage.js                 # LocalStorage API
├── hardcoreUnlock.js          # Logique déverrouillage hardcore
│
├── UI
├── ui.js                      # Orchestration UI
├── uiLayout.js                # Layout constants et helpers
├── uiMenu.js                  # Menu principal
├── uiMenuPanel.js             # Panels génériques (animations)
├── uiMenuSkins.js             # Sélection des skins
├── uiGameOver.js              # Écran de fin
├── uiGameOverDecor.js         # Éléments visuels (confetti)
├── uiHudBanners.js            # Bannières HUD
│
├── A11y
├── uiDomAccessibility*.js     # Layer d'accessibilité DOM
├── haptics.js                 # Retours haptiques
│
├── Media
├── audio.js                   # Gestion du son
├── motion.js                  # Animations (tweens, shake)
├── textures/                  # Sprites générés
│
└── PWA
    └── (service worker géré par Vite PWA plugin)

tests/
├── Unit tests (Vitest)
└── e2e/                       # Tests E2E (Playwright)
```

## Patterns & Conventions

### 1. Scenes (Phaser)

Chaque scene gère une responsabilité :

- `sceneBootstrap` : Initialisation
- `sceneRound` : Gameplay principal
- `sceneDeath` : Game over
- `sceneFeedback` : Effets visuels/sonores

### 2. State Management

- **gameState.js** : État global (difficulté, mode hardcore, etc)
- **roundState.js** : État de la manche courante
- **storage.js** : Persistance LocalStorage

### 3. Input Handling

- **sceneInput.js** : Normalization clavier/tactile
- **uiDomAccessibility.js** : Accessibilité clavier

### 4. Physics

- **bird.js** : Gravity, velocity, coyote timing
- **pipeCollision.js** : AABB collision detection
- **pipeGaps.js** : Gestion dynamique des espaces

### 5. Animations

- **motion.js** : `sceneTween()` pour toutes les animations
- Respecte `prefers-reduced-motion`
- Tweens chainés avec onComplete callbacks

### 6. UI Architecture

```
ui.js (orchestration — façade SceneContext)
├── Menu Principal
│   ├── uiMenu.js (navigation)
│   ├── uiMenuPanel.js (animations)
│   └── uiMenuSkins.js (sélection skins)
├── HUD (pendant le jeu)
│   ├── uiHudBanners.js
│   └── uiHudCoyoteBadge.js
└── Game Over
    ├── uiGameOver.js
    └── uiGameOverDecor.js (confetti)
```

#### Contrat façade `UI` (`ui.js`)

| Règle              | Détail                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Import**         | `import { UI } from './uiIndex.js'` en prod ; `ui.js` direct réservé aux tests de façade |
| **Responsabilité** | État UI Phaser (menu/HUD/overlays) ; délégation via `uiFacadeBind.js` |
| **Interdit**       | Physique, spawn, collision, persistance — rester dans `scene*`, `bird`, `*Storage`       |
| **Extension**      | Implémenter dans `ui*.js`, enregistrer dans `uiFacadeBind.js` si `scene.ui` doit l’appeler |
| **Découpage build**| Chunk `skins` seul ; pas de chunk `ui` (graphe eager `uiFacadeBind` ↔ `skins`)              |

Cibles tactiles menu : hauteur **44 px** (`MIN_TOUCH`) ; boutons rangée secondaire **80 px** de large (`menuBtnW`) pour les libellés courts **SCORE / OPTS / SKINS** (`applyFittedLabel` dans `uiMenuPanel.js`). Raccourcis clavier desktop : ligne d’aide en bas du menu (`optionsHint`, `difficultyHint`).

## Data Flow

### Startup

```
main.js
  ↓
appBootstrap.js (Phaser init)
  ↓
sceneBootstrap.js (preload assets)
  ↓
sceneRound.js (gameState loaded)
  ↓
ui.js (menu affiché)
```

### Gameplay

```
Input (keyboard/touch)
  ↓
sceneInput.js (normalize)
  ↓
bird.jump() (update velocity)
  ↓
Physics engine (Phaser)
  ↓
pipeCollision.js (détect collision)
  ↓
sceneFeedback.js (effects)
  ↓
roundScore.js (update score)
  ↓
HUD (affichage)
```

### Death Flow

```
Collision detected
  ↓
sceneFeedback.playDeathImpactFeedback()
  ↓
sceneDeath.handleDeath()
  ↓
storage.saveRound()
  ↓
uiGameOver.buildGameOverUI()
  ↓
Menu principal (input restart/menu)
```

## Performance Considerations

### Optimization

- **Object Pooling** : Pipes réutilisés
- **Lazy Loading** : Textures oiseau à la demande (`ensureBirdTexture`) — classic + skin actif au boot, reste au panneau skins
- **Code splitting** : chunks Vite `skins` (~3 Ko gzip) et `ui-gameover` (~10 Ko gzip, préchargé au `beginRound`). Le barrel `uiIndex.js` n’exporte plus le game over pour éviter un import statique.
- **Shell jeu** : `shellGameState.js` (`partie-active`, `data-game-state`) + `shellViewport.js` (zoom menu vs partie).
- **Canvas Rendering** : Phaser optimise le rendu
- **Event Delegation** : Minimal DOM updates

### Memory

- **Scene Cleanup** : Destroy() appelé sur transition
- **Event Listeners** : Unsubscribed on cleanup
- **Tweens** : Destroyed after completion

### Mode entraînement (`training.timeScale`)

Vitesse par défaut **80 %** (`training.timeScale: 0.8`), cyclable dans OPTIONS : `training.timeScaleSteps` `[0.6, 0.7, 0.8, 1]` (persisté `trainingStorage`). Appliqué via `resolveTrainingTimeScale` (`sceneBootstrap.js`) + Phaser `time.timeScale`. Couvert par tests unitaires, seam `getTrainingRuntime` / `cycleTrainingSpeed`, e2e `gameplay-equity`.

## Testing Strategy

### Unit Tests (604 tests, couverture CI ≥ 94 % lignes / 82 % branches)

- **Gameplay** : Physics, collision, scoring
- **UI** : Menu navigation, state updates
- **Storage** : Persistence, data integrity
- **Accessibility** : ARIA (`aria-pressed`, `aria-expanded`), annonces, `menuTrainingSpeed`

### E2E Tests (10 specs, 88 cas, 6 projets viewport — ~528 exécutions en matrice CI)

- **Navigation** : Menu flow
- **Input** : Keyboard, touch, gamepad
- **Responsive** : All viewports
- **PWA** : Offline mode, precache

### CI / déploiement (`.github/workflows/ci.yml`)

```
check ──┬──► e2e (matrice 6 projets en parallèle, ~15 min mur, timeout 35 min/job)
        └──► lighthouse
check + lighthouse ──► deploy → gh-pages
```

Le job `deploy` **n’attend pas** `e2e` : signal de régression sans bloquer Pages. `PLAYWRIGHT_SKIP_BUILD=1` en CI évite le double build.

## Accessibility Implementation

### WCAG 2.1 Level AA (cible)

- **Keyboard Navigation** : 26 boutons DOM overlay + canvas
- **Screen Readers** : `#ui-announcer`, labels ARIA, états `aria-pressed` / `aria-expanded` sur toggles
- **Color Contrast** : tokens testés AA sur fond nuit ; HUD jour compensé par contour noir (`designTokens.test.js`)
- **Motion** : `prefers-reduced-motion` respecté
- **Focus** : outline 2px ; `prefers-contrast: more` renforce focus et couleurs (`style.css`)

### Implementation Files

- `uiDomAccessibility*.js` : A11y layer
- `motion.js` : Animation control
- `style.css` : Focus styles
- `index.html` : ARIA semantics

## Scalability

### Future-Proof

- **Modular Architecture** : Easy to add new features
- **Configuration** : Centralized in `config.js`
- **Design Tokens** : `src/designTokens.js`, `src/uiLayoutConstants.js`, `style.css` (shell synchronisé via `shellTheme.js`)
- **Test Coverage** : seuils CI 94 % lignes / 82 % branches (`vite.config.js`)

## Development Workflow

### Local Development

```bash
npm run dev              # http://localhost:5173
npm run test:watch      # Vitest watch
npm test                # Vitest une passe (CI)
npm run test:e2e        # E2E tests
npm run lint            # ESLint
npm run format          # Prettier
```

### Build & Deploy

```bash
npm run icons           # public/icons/ (+ icons:optimize en CI)
npm run build           # dist/ + PWA (police latin/latin-ext uniquement)
npm run measure         # tailles dist/ après build ; snapshot manuel scripts/bundle-baseline.json
npm run preview         # Test build locally
git push                # CI/CD GitHub Actions
```

## Dependencies

| Package         | Version | Role           |
| --------------- | ------- | -------------- |
| phaser          | ^3.80.1 | Game engine    |
| vite            | ^5.4.11 | Build tool     |
| vite-plugin-pwa | ^0.21.1 | PWA generation |
| vitest          | ^2.1.6  | Testing        |
| playwright      | ^1.49.1 | E2E testing    |
| eslint          | ^9.17.0 | Linting        |
| prettier        | ^3.4.2  | Formatting     |

## Code Quality Standards

- **ESLint** : 0 errors
- **Prettier** : 100% formatted
- **Tests** : 604/604 passing
- **Coverage** : ~95 % lignes / ~84 % branches (seuils CI 94/82/91 %)

### Exclusions coverage (justifiées)

| Fichier                  | Raison                                                  |
| ------------------------ | ------------------------------------------------------- |
| `src/phaser-shim.js`     | Alias build vendor Phaser — pas de logique applicative  |
| `src/testSeam.js`        | API Playwright E2E uniquement (`VITE_ENABLE_TEST_SEAM`) |
| `src/skins/skinIds.js`   | Constantes d’identifiants                               |
| `src/skins/skinTypes.js` | Typedef JSDoc sans runtime                              |
| `src/sceneTypes.js`      | Contrat JSDoc `SceneContext` — documenté, non exécuté   |

Couverture globale actuelle : ~95 % lignes, ~84 % branches (`npm run test:coverage`).

- **Types** : JSDoc comments
- **Accessibility** : 100/100 Lighthouse

---

Last updated: 2026-07-09
