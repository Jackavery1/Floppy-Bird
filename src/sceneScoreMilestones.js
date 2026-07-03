import { GAME_CONFIG } from './config.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene @param {number} score */
export function handleScoreMilestones(scene, score) {
    const { gapTightenAfterScore, difficultyPreviewOffset, streakMilestones } = GAME_CONFIG.round;
    if (score === gapTightenAfterScore - difficultyPreviewOffset) {
        scene.ui.showDifficultyEscalationPreview?.();
    }
    if (score === gapTightenAfterScore) {
        scene.ui.showDifficultyEscalation?.();
    }
    if (streakMilestones.includes(score)) {
        scene.ui.showScoreStreak?.(score);
    }
}
