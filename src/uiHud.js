export { createScoreDisplay, showInGameScore, updateScore } from './uiHudScore.js';

import { destroyInGameControls } from './uiHudControls.js';

export { createInGameControls, destroyInGameControls } from './uiHudControls.js';

export {
    showRecordBroken,
    showDailyGoalBrief,
    showJumpTutorial,
    showGapTutorial,
    showScoreTutorial,
    dismissJumpTutorial,
    dismissGameplayTutorial,
    showFlash,
    showDailyGoalReached,
    showDifficultyEscalation,
    showDifficultyEscalationPreview,
    showCoyoteHint,
    showHardcoreInvincibilityHint,
    showHardcoreTutorial,
    dismissHardcoreTutorial,
    showScoreStreak,
} from './uiHudFeedback.js';

/** @param {import('./ui.js').UI} ui */
export function hideInGameScore(ui) {
    if (ui.scoreText) {
        ui.scoreText.setVisible(false);
    }
    destroyInGameControls(ui);
}
