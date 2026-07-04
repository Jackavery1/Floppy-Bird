/**
 * Barrel public UI — point d’entrée façade (`sceneSetup` importe `UI` depuis ici).
 * Carte détaillée des modules : voir [Structure](README.md#structure).
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
