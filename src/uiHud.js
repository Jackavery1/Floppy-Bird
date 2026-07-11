export { createScoreDisplay, showInGameScore, updateScore } from './uiHudScore.js';

import { destroyInGameControls } from './uiHudControls.js';

export { createInGameControls, destroyInGameControls } from './uiHudControls.js';

export {
    showRecordBroken,
    showDailyGoalBrief,
    showDailyGoalReached,
    showDifficultyEscalation,
    showScoreStreak,
    showSpeedBoostPreview,
    showDifficultyEscalationPreview,
    showCoyoteHint,
    showCoyoteLowGraceHint,
    showFlash,
} from './uiHudBanners.js';

export {
    showJumpTutorial,
    showGapTutorial,
    showScoreTutorial,
    showHardcoreTutorial,
    dismissHardcoreTutorial,
    showTrainingTutorial,
    dismissTrainingTutorial,
    dismissJumpTutorial,
    dismissGameplayTutorial,
} from './uiHudTutorial.js';

/** @param {import('./ui.js').UI} ui */
export function hideInGameScore(ui) {
    if (ui.scoreText) {
        ui.scoreText.setVisible(false);
    }
    destroyInGameControls(ui);
}
