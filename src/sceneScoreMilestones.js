import { GAME_CONFIG } from './config.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene @param {number} score */
export function handleScoreMilestones(scene, score) {
    const { gapTightenAfterScore, streakMilestones } = GAME_CONFIG.round;
    if (score === gapTightenAfterScore) {
        scene.ui.showDifficultyEscalation?.();
    }
    if (streakMilestones.includes(score)) {
        scene.ui.showScoreStreak?.(score);
    }
}
