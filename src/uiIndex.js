/**
 * Carte des modules UI — point de découverte (imports directs recommandés en prod).
 * @module uiIndex
 */

/** Façade principale Phaser */
export { UI } from './ui.js';

/** Profondeur z-order et layout */
export { DEPTH } from './uiDepth.js';
export { UI_LAYOUT, MIN_TOUCH, addCenteredText } from './uiLayout.js';

/** Menu principal et panneaux */
export { showMenu, updateDifficultyButtons, refreshHighScore } from './uiMenu.js';
export { buildMenuHeader, buildMenuDifficulty } from './uiMenuHeader.js';
export { buildMenuDailyChallenge, refreshDailyChallengeButton } from './uiMenuDailyChallenge.js';
export { buildSkinsTab, refreshSkinsTab } from './uiMenuSkins.js';
export { toggleMenuOptions } from './uiMenuOptions.js';
export { toggleMenuScores } from './uiMenuScoresPanel.js';
export { toggleMenuSkins } from './uiMenuSkinsPanel.js';
export { buildMenuToggleButton } from './uiMenuPanel.js';

/** HUD en jeu */
export {
    createScoreDisplay,
    updateScore,
    showInGameScore,
} from './uiHudScore.js';
export {
    showRecordBroken,
    showDailyGoalReached,
    showDifficultyEscalation,
    showScoreStreak,
    showJumpTutorial,
    dismissJumpTutorial,
    showFlash,
} from './uiHudFeedback.js';
export { createInGameControls } from './uiHudControls.js';

/** Pause et game over */
export { showPause } from './uiPause.js';
export { buildGameOverUI } from './uiGameOver.js';
export { showAchievementToasts } from './uiAchievementToast.js';
