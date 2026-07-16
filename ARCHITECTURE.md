# Architecture - Floppy Bird v2.0.0

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
├── sceneMenuSync.js           # Port scène → menu (sans import uiMenu depuis le flux)
├── sceneA11ySync.js           # Port scène → accessibilité DOM
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
├── UI (`src/ui/`)
│   ├── core/          # Façade UI, pause, bind scène
│   ├── menu/          # Accueil, options, scores, skins, défi
│   ├── hud/           # Score, bannières, tutoriel, toasts
│   ├── gameOver/      # Panneau fin (lazy via loader → chunk ui-gameover)
│   ├── a11y/          # Overlay DOM clavier / lecteurs d’écran
│   └── shared/        # Layout, depth, chrome GO, texte, toggles
├── uiIndex.js                 # Entrée publique UI
│
├── A11y (voir `src/ui/a11y/`)
├── haptics.js                 # Retours haptiques (respecte mute / reduced-motion)
│
├── Media
├── audio.js                   # Gestion du son
├── motion.js                  # Animations (tweens, shake)
├── textures/                  # Sprites générés
│
└── PWA
    ├── public/shell-tokens.css  # Variables CSS shell (style.css + offline.html)
    ├── public/offline-page.css  # Styles page fallback offline
    └── (VitePWA : `globPatterns` + `globIgnores` tokens ; polices jeu via @fontsource → assets/, latin offline via `public/fonts/`)

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
uiIndex.js → ui/core/ui.js (façade SceneContext)
├── menu/      # Accueil, options, scores, skins, défi
├── hud/       # Score, bannières, tutoriel, toasts
├── gameOver/  # Lazy via uiGameOverLoader → chunk ui-gameover
├── a11y/      # Overlay DOM clavier / lecteurs d’écran
└── shared/    # Layout, depth, chrome GO, texte
```

#### Contrat façade `UI` (`ui/core/ui.js`)

| Règle              | Détail                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Import**         | `import { UI } from './uiIndex.js'` en prod ; `ui/core/ui.js` réservé aux tests de façade |
| **Responsabilité** | État UI Phaser (menu/HUD/overlays) ; délégation via `uiFacadeBind.js` |
| **Interdit**       | Physique, spawn, collision, persistance — rester dans `scene*`, `bird`, `*Storage`       |
| **Extension**      | Implémenter sous `src/ui/**`, enregistrer dans `uiFacadeBind.js` si `scene.ui` doit l’appeler |
| **Délégation**     | 38 méthodes via `bindUiFacade` (`UI_FACADE_METHODS`) — zéro pass-through dans la façade |
| **Cycles**         | `npm run cycles` (madge) en CI — garde-fou imports circulaires `src/`                       |
| **Découpage build**| Chunk `ui` (menu/HUD/a11y + skins) ; chunk async `ui-gameover` (hors loader) |

Cibles tactiles menu : hauteur **48 px** (`MENU_SECONDARY_HIT` / `MIN_CTA_TOUCH`) pour SCORE / OPTS / SKINS ; **44 px** (`MIN_TOUCH`) pour les autres secondaires ; **48 px** pour les CTA primaires (démarrer, sauter, rejouer, pause). Boutons rangée secondaire **80 px** de large (`menuBtnW`) pour les libellés courts **SCORE / OPTS / SKINS** (`applyFittedLabel` dans `ui/menu/uiMenuPanel.js`). Raccourcis clavier desktop : panneau **OPTIONS → onglet CTRL** (`optionsControlRows` dans `device.js`, rendu par `uiMenuOptionsControls.js`).

#### Index modules `ui*`

Modules physiques sous `src/ui/{menu,hud,gameOver,a11y,shared,core}/` ; entrée publique `uiIndex.js` (plus de shims `src/ui*.js`).

| Module | Rôle |
| ------ | ---- |
| `ui/core/ui.js` / `uiIndex.js` | Façade orchestration ; délégation via `uiFacadeBind.js` |
| `ui/shared/uiLayout.js` / `uiLayoutConstants.js` | Grille, cibles tactiles, `FONT_SIZE_*`, `TOUCH_TARGETS` |
| `ui/shared/uiDepth.js` / `uiText.js` | Z-order Phaser, typo et labels adaptatifs |
| `ui/shared/uiGameOverChrome.js` | Frame + coins plaque (skeleton HUD + panneau GO) |
| `ui/menu/*` | Menu principal, options, scores, skins, défi du jour |
| `ui/hud/*` | Score, pause, bannières, tutoriel, toasts |
| `ui/gameOver/*` | Panneau game over (lazy via `uiGameOverLoader` → chunk `ui-gameover`) |
| `ui/a11y/*` | Overlay DOM clavier / lecteurs d'écran ; `bindUnifiedInteractiveFocus` |

#### Arbre modules `ui*` (vue rapide)

```
uiIndex.js → ui/core/ui.js (façade)
├── shared/   : layout, depth, text, chrome GO, toggles
├── menu/     : accueil, options, scores, skins, daily
├── hud/      : score, bannières, tutoriel, toasts
├── gameOver/ : lazy via uiGameOverLoader → chunk ui-gameover
└── a11y/     : overlay #a11y-controls, focus unifié
```

#### Cluster a11y — graphe d'imports (évite les cycles `madge`)

```
uiDomAccessibility.js              ← barrel (appBootstrap, tests)
├── uiDomAccessibilityLayer.js     ← overlay DOM #a11y-controls
├── uiDomAccessibilityControls.js  ← feuille : bindUnifiedInteractiveFocus, aria
├── uiDomAccessibilityMenuToggles.js ← toggles difficulté / modes (menu)
├── uiDomAccessibilityPanelFlows.js  ← panneaux scores / skins / options
├── uiDomAccessibilityFlows.js     ← setup menu + game over
│   └── uiMenuOptionsTabs.js
│       └── uiMenuPanelChrome.js
├── uiDomAccessibilityFocusVisuals.js  ← focus canvas (menuStart, fermer panneaux, skins)
│   └── bindUnifiedInteractiveFocus au build pour le reste des contrôles

Règle : les modules UI Phaser (`uiMenu*`, `uiGameOver*`, `uiHud*`, `uiPause`), `sceneDeath` et
`sceneA11ySync` importent depuis les feuilles (`uiDomAccessibilityPanelFlows.js`,
`uiDomAccessibilityMenuToggles.js`, `uiDomAccessibilityControls.js`, `uiDomAccessibilityFlows.js`,
`uiDomAccessibilityLayer.js`), jamais depuis le barrel `uiDomAccessibility.js` (réservé à
`appBootstrap.js` et tests).

Panneaux menu : `uiMenuPanel.js` (visibilité, toggle, backdrop) + `uiMenuPanelController.js`
(controller + shell) + `uiMenuPanels.js` (orchestration fermeture/rebuild). Overlays scène :
`sceneFlowOverlays.js`. Tokens shell : `shellTokenDefaults.js` (aligné `public/shell-tokens.css`).
Garde-fous CSS : `tests/cssShellClasses.test.js`, `tests/cssStaticPages.test.js`.
Seam debug mort : `getLastDeathMetrics()` (`metaSeam.js`) — `cause`, `elapsedMs`, `isEarlyDeath`, `beforeFirstPipe`.
```

#### GameScene — adaptateur Phaser

`GameScene.js` délègue volontairement vers `sceneFlow.js` / `sceneBeginRound.js` (`handlePrimaryAction`,
`togglePause`, `changeDifficulty`, etc.). C’est le point d’entrée Phaser requis par le moteur, pas un god-object
métier : la logique vit dans les modules `scene*`.

#### Contrat `SceneContext` (`src/sceneTypes.js`)

Contexte typé passé aux modules `scene*` (bird, pipes, round, ui, modes). Initialisé par `sceneContext.js` avant `create()`.

| Zone | Modules autorisés à muter |
| ---- | ------------------------- |
| `state`, `difficulty`, modes | `sceneFlow.js`, `sceneBeginRound.js`, `sceneDeath.js` |
| `round.*` | `sceneRound.js`, `roundState.js`, `sceneDeath.js`, `sceneBeginRound.js` |
| `bird`, `pipes`, `ghost` | entités + `sceneBootstrap.js` |
| `ui` | façade `UI` uniquement — pas de physique ni storage direct |

Détail complet des champs : JSDoc `@typedef SceneContext` dans `src/sceneTypes.js`.

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

## Considérations performance

### Optimisation

- **Object Pooling** : Pipes réutilisés
- **Lazy Loading** : textures décor (`textures/decorPreload.js`, chunk Vite séparé) après fond/sol/oiseau ; skins additionnels au panneau skins
- **Code splitting** : chunk Vite `ui` (modules `src/ui/**` hors gameOver, + `src/skins/**` — le graphe eager menu↔skins interdisait un chunk `skins` séparé). Chunk async `ui-gameover` pour `src/ui/gameOver/**` sauf `uiGameOverLoader.js` (précharge via `import()`). Chrome skeleton partagé : `src/ui/shared/uiGameOverChrome.js`. Décor hors `textures/index.js` : `import('./textures/decorPreload.js')` depuis `GameScene`.
- **Shell jeu** : `shellGameState.js` (`partie-active`, `data-game-state`) + `shellViewport.js` (zoom menu ; pinch bloqué en partie tactile, zoom navigateur conservé sur desktop).
- **Canvas Rendering** : Phaser optimise le rendu
- **Event Delegation** : Minimal DOM updates

### Mémoire

- **Scene Cleanup** : Destroy() appelé sur transition
- **Event Listeners** : Unsubscribed on cleanup
- **Tweens** : Destroyed after completion

### Mode entraînement (`training.timeScale`)

Vitesse par défaut **80 %** (`training.timeScale: 0.8`), cyclable dans OPTIONS : `training.timeScaleSteps` `[0.6, 0.7, 0.8, 1]` (persisté `trainingStorage`). Appliqué via `resolveTrainingTimeScale` (`sceneBootstrap.js`) + Phaser `time.timeScale`. Couvert par tests unitaires, seam `getTrainingRuntime` / `cycleTrainingSpeed`, e2e `gameplay-equity`.

## Stratégie de tests

Détail des specs, viewports et commandes : [CONTRIBUTING.md](CONTRIBUTING.md). Seuils couverture : `vite.config.js`.

- **Unitaires** : gameplay, UI, storage, accessibilité
- **E2E** : navigation, clavier/touch, responsive, PWA offline
- **CI** : `check` → `e2e-smoke` (desktop + mobile portrait, bloque deploy) + matrice e2e complète (6 viewports, bloquante) + lighthouse

## Implémentation accessibilité

### WCAG 2.1 Level AA (cible)

- **Keyboard Navigation** : 26 boutons DOM overlay + canvas (`role="application"`, `aria-labelledby="game-description"`)
- **Screen Readers** : `#ui-announcer`, labels ARIA, états `aria-pressed` / `aria-expanded` sur toggles
- **Color Contrast** : tokens testés AA sur fond nuit ; HUD jour compensé par contour noir (`designTokens.test.js`)
- **Motion** : `prefers-reduced-motion` respecté
- **Focus** : outline 2px ; `prefers-contrast: more` renforce focus et couleurs (`style.css`) ; feedback canvas via `uiDomAccessibilityFocusVisuals.js` + `bindUnifiedInteractiveFocus`

### Fichiers concernés

- `uiDomAccessibility*.js` : A11y layer
- `motion.js` : Animation control
- `style.css` + `public/shell-tokens.css` : Focus styles et tokens shell
- `index.html` : Landmarks, `#game-description` pour le canvas
- `src/appBootstrap.js` : `role="application"` + `aria-labelledby` sur le canvas Phaser

## Évolutivité

### Pérennisation

- **Modular Architecture** : Easy to add new features
- **Configuration** : Centralized in `config.js`
- **Design Tokens** : `src/designTokens.js`, `src/ui/shared/uiLayoutConstants.js`, `public/shell-tokens.css` + `style.css` (shell synchronisé via `shellTheme.js`)
- **Test Coverage** : seuils dans `vite.config.js` ; snapshot bundle `npm run measure` → `scripts/bundle-baseline.json`

## Workflow de développement

Commandes : [README.md](README.md). Mesure bundle : `npm run build && npm run measure`.

## Dépendances

| Package         | Version | Role           |
| --------------- | ------- | -------------- |
| phaser          | ^3.80.1 | Game engine    |
| vite            | ^5.4.11 | Build tool     |
| vite-plugin-pwa | ^0.21.1 | PWA generation |
| vitest          | ^2.1.6  | Testing        |
| playwright      | ^1.49.1 | E2E testing    |
| eslint          | ^9.17.0 | Linting        |
| prettier        | ^3.4.2  | Formatting     |

## Standards qualité code

- **ESLint** : 0 errors
- **Prettier** : format check en CI
- **Tests / couverture** : voir CI (`npm test`, `npm run test:coverage`)

### Exclusions coverage (justifiées)

| Fichier                  | Raison                                                  |
| ------------------------ | ------------------------------------------------------- |
| `src/phaser-shim.js`     | Alias build vendor Phaser — pas de logique applicative  |
| `src/testSeam.js`        | API Playwright E2E uniquement (`VITE_ENABLE_TEST_SEAM`) |
| `src/skins/skinIds.js`   | Constantes d’identifiants                               |
| `src/skins/skinTypes.js` | Typedef JSDoc sans runtime                              |
| `src/sceneTypes.js`      | Contrat JSDoc `SceneContext` — documenté, non exécuté   |

- **Types** : JSDoc comments
- **Accessibility** : 100/100 Lighthouse

---

Last updated: 2026-07-14
