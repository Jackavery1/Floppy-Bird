/**
 * Liaison des méthodes déléguées sur la façade {@link UI}.
 * Évite les pass-through répétés dans `ui.js` tout en conservant `scene.ui.*`.
 */
import { buildGameOverUI } from '../gameOver/uiGameOverLoader.js';
import {
    createScoreDisplay,
    hideInGameScore,
    createInGameControls,
    updateScore,
    showRecordBroken,
    showFlash,
    showJumpTutorial,
    dismissJumpTutorial,
    showGapTutorial,
    showScoreTutorial,
    dismissGameplayTutorial,
    showDailyGoalReached,
    showDailyGoalBrief,
    showDifficultyEscalation,
    showDifficultyEscalationPreview,
    showSpeedBoostPreview,
    showHardcoreTutorial,
    dismissHardcoreTutorial,
    showTrainingTutorial,
    dismissTrainingTutorial,
    showScoreStreak,
    showGameOverLoading,
    hideGameOverLoading,
} from '../hud/uiHud.js';
import {
    showMenu,
    updateTrainingLabel,
    updateTrainingSpeedLabel,
    updateHardcoreLabel,
    updateDifficultyButtons,
    refreshHighScore as refreshMenuHighScore,
} from '../menu/uiMenu.js';
import { toggleMenuOptions, refreshHardcoreLockState } from '../menu/uiMenuOptions.js';
import { toggleMenuScores } from '../menu/uiMenuScoresPanel.js';
import { toggleMenuSkins } from '../menu/uiMenuSkinsPanel.js';
import { cycleMenuSkin } from '../menu/uiMenuSkinCycle.js';
import { showPause } from './uiPause.js';

const HUD_METHODS = {
    createScoreDisplay,
    hideInGameScore,
    createInGameControls,
    updateScore,
    showRecordBroken,
    showDailyGoalReached,
    showDailyGoalBrief,
    showDifficultyEscalation,
    showScoreStreak,
    showJumpTutorial,
    showGapTutorial,
    showScoreTutorial,
    dismissJumpTutorial,
    dismissGameplayTutorial,
    showDifficultyEscalationPreview,
    showSpeedBoostPreview,
    showHardcoreTutorial,
    dismissHardcoreTutorial,
    showTrainingTutorial,
    dismissTrainingTutorial,
    showFlash,
    showGameOverLoading,
    hideGameOverLoading,
};

const MENU_METHODS = {
    showMenu,
    updateTrainingLabel,
    updateTrainingSpeedLabel,
    updateHardcoreLabel,
    updateDifficultyButtons,
    refreshHighScore: refreshMenuHighScore,
};

const PANEL_METHODS = {
    toggleMenuOptionsPanel: toggleMenuOptions,
    toggleMenuScoresPanel: toggleMenuScores,
    toggleMenuSkinsPanel: toggleMenuSkins,
    cycleMenuSkin,
    refreshHardcoreLockState,
};

const OVERLAY_METHODS = {
    showPause,
};

/** Noms des méthodes déléguées sur `scene.ui` (source unique pour tests et doc). */
export const UI_FACADE_METHODS = Object.freeze([
    ...Object.keys(HUD_METHODS),
    ...Object.keys(MENU_METHODS),
    ...Object.keys(PANEL_METHODS),
    ...Object.keys(OVERLAY_METHODS),
    'showGameOver',
]);

/** @param {typeof import('./ui.js').UI} UiClass */
export function bindUiFacade(UiClass) {
    for (const group of [HUD_METHODS, MENU_METHODS, PANEL_METHODS, OVERLAY_METHODS]) {
        for (const [name, fn] of Object.entries(group)) {
            UiClass.prototype[name] = function (...args) {
                return fn(this, ...args);
            };
        }
    }

    UiClass.prototype.showGameOver = function (
        finalScore,
        leaderboardData,
        fadeIn = false,
        isNewRecord = false,
        hardcoreMode = false,
        dailyGoal = 0,
        activeSkinId = 'classic',
        deathCause = null
    ) {
        return buildGameOverUI(
            this.scene,
            this,
            finalScore,
            leaderboardData,
            fadeIn,
            isNewRecord,
            hardcoreMode,
            dailyGoal,
            activeSkinId,
            deathCause
        );
    };
}
