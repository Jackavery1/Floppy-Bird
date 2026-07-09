/**
 * Liaison des méthodes déléguées sur la façade {@link UI}.
 * Évite les pass-through répétés dans `ui.js` tout en conservant `scene.ui.*`.
 */
import { buildGameOverUI } from './uiGameOverLoader.js';
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
    showCoyoteHint,
    showHardcoreInvincibilityHint,
    showHardcoreTutorial,
    dismissHardcoreTutorial,
    showTrainingTutorial,
    dismissTrainingTutorial,
    showScoreStreak,
} from './uiHud.js';
import {
    showMenu,
    updateTrainingLabel,
    updateTrainingSpeedLabel,
    updateHardcoreLabel,
    updateDifficultyButtons,
    refreshHighScore as refreshMenuHighScore,
} from './uiMenu.js';
import { toggleMenuOptions, refreshHardcoreLockState } from './uiMenuOptions.js';
import { toggleMenuScores } from './uiMenuScoresPanel.js';
import { toggleMenuSkins } from './uiMenuSkinsPanel.js';
import { cycleMenuSkin } from './uiMenuSkins.js';
import { showPause } from './uiPause.js';

/** @param {typeof import('./ui.js').UI} UiClass */
export function bindUiFacade(UiClass) {
    const hud = {
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
        showCoyoteHint,
        showHardcoreInvincibilityHint,
        showHardcoreTutorial,
        dismissHardcoreTutorial,
        showTrainingTutorial,
        dismissTrainingTutorial,
        showFlash,
    };

    const menu = {
        showMenu,
        updateTrainingLabel,
        updateTrainingSpeedLabel,
        updateHardcoreLabel,
        updateDifficultyButtons,
        refreshHighScore: refreshMenuHighScore,
    };

    const panels = {
        toggleMenuOptionsPanel: toggleMenuOptions,
        toggleMenuScoresPanel: toggleMenuScores,
        toggleMenuSkinsPanel: toggleMenuSkins,
        cycleMenuSkin,
        refreshHardcoreLockState,
    };

    const overlays = {
        showPause,
    };

    for (const group of [hud, menu, panels, overlays]) {
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
