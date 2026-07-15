import { GAME_CONFIG } from './config.js';
import { announceScoreLive } from './sceneScoreAnnounce.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene @param {number} score */
export function handleScoreMilestones(scene, score) {
    const {
        gapTightenAfterScore,
        streakMilestones,
        speedBoostEvery,
        speedBoostPreviewOffset,
        difficultyPreviewOffset,
    } = GAME_CONFIG.round;

    const speedPreviewAt = speedBoostEvery - speedBoostPreviewOffset;
    const escalationPreviewAt = gapTightenAfterScore - difficultyPreviewOffset;

    if (score === speedPreviewAt) {
        scene.ui.showSpeedBoostPreview?.();
    }
    if (score === escalationPreviewAt) {
        scene.ui.showDifficultyEscalationPreview?.();
    }
    if (score === gapTightenAfterScore) {
        scene.ui.showDifficultyEscalation?.();
    }
    if (streakMilestones.includes(score)) {
        scene.ui.showScoreStreak?.(score);
    }
    announceScoreLive(score);
}
