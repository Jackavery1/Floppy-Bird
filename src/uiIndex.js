/**
 * Barrel public UI — point d’entrée façade (`sceneSetup` importe `UI` depuis ici).
 *
 * **Contrat façade `UI` (`ui.js`)**
 * - Rôle : orchestrateur Phaser lié à `SceneContext` (menu, HUD, pause, game over).
 * - Import prod : `import { UI } from './uiIndex.js'` — éviter `ui.js` hors tests.
 * - Logique : déléguer aux modules `uiMenu*`, `uiHud*`, `uiPause`, `uiGameOver*` ; pas de gameplay.
 * - Extension : implémenter dans le sous-module, puis exposer une méthode sur `UI` si la scène en a besoin.
 *
 * Carte détaillée : [ARCHITECTURE.md § UI](ARCHITECTURE.md#6-ui-architecture).
 * @module uiIndex
 */

/** Façade principale Phaser */
export { UI } from './ui.js';

/** Profondeur z-order et layout */
export { DEPTH } from './uiDepth.js';
export { UI_LAYOUT, MIN_TOUCH, addCenteredText, TOUCH_TARGETS } from './uiLayout.js';

/** Menu principal et panneaux */
export { showMenu, updateDifficultyButtons, refreshHighScore } from './uiMenu.js';
export { buildMenuHeader, buildMenuDifficulty } from './uiMenuHeader.js';
export { buildMenuDailyChallenge, refreshDailyChallengeButton } from './uiMenuDailyChallenge.js';
export { buildSkinsTab, refreshSkinsTab } from './uiMenuSkins.js';
export { toggleMenuOptions, applyTrainingLabel, applyHardcoreLabel } from './uiMenuOptions.js';
export { toggleMenuScores } from './uiMenuScoresPanel.js';
export { toggleMenuSkins } from './uiMenuSkinsPanel.js';
export { buildMenuToggleButton } from './uiMenuPanel.js';

/** HUD en jeu */
export { createScoreDisplay, updateScore, showInGameScore } from './uiHudScore.js';
export {
    showRecordBroken,
    showDailyGoalReached,
    showDifficultyEscalation,
    showScoreStreak,
    showJumpTutorial,
    dismissJumpTutorial,
    showFlash,
} from './uiHud.js';
export { createInGameControls } from './uiHudControls.js';

/** Pause et game over */
export { showPause } from './uiPause.js';
export { buildGameOverUI } from './uiGameOver.js';
export { buildGameOverShell } from './uiGameOverPanel.js';
export { buildGameOverSummary } from './uiGameOverSummary.js';
export { buildGameOverActions, animateGameOverReveal } from './uiGameOverActions.js';
export { showAchievementToasts } from './uiAchievementToast.js';
