export {
    createScoreDisplay,
    showInGameScore,
    updateScore,
} from './uiHudScore.js';

import { destroyInGameControls } from './uiHudControls.js';

export {
    createInGameControls,
    destroyInGameControls,
} from './uiHudControls.js';

export {
    showRecordBroken,
    showJumpTutorial,
    dismissJumpTutorial,
    showFlash,
    showDailyGoalReached,
} from './uiHudFeedback.js';

/** @param {import('./ui.js').UI} ui */
export function hideInGameScore(ui) {
    if (ui.scoreText) {
        ui.scoreText.setVisible(false);
    }
    destroyInGameControls(ui);
}
