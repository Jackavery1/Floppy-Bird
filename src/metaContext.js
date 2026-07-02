import { DIFFICULTY, DIFFICULTY_ORDER } from './config.js';
import { loadHighScore } from './storage.js';
import { listUnlockedSkins } from './skins.js';
import { isHardcoreUnlocked } from './hardcoreUnlock.js';
import { loadDailyStats } from './dailyChallengeProgress.js';
import { loadBestTrainingScore } from './trainingStorage.js';

/**
 * @typedef {Object} MetaContext
 * @property {number} score
 * @property {boolean} hardcore
 * @property {boolean} dailyChallenge
 * @property {boolean} dailyGoalMet
 * @property {number} dailyGoal
 * @property {boolean} hardcoreUnlocked
 * @property {number} bestScoreAny
 * @property {number} bestHardcoreScore
 * @property {number} bestEasyScore
 * @property {number} bestNormalScore
 * @property {number} bestHardScore
 * @property {number} bestTrainingScore
 * @property {number} dailyCompletionsTotal
 * @property {number} unlockedSkinCount
 */

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function buildMetaContext(scene) {
    let bestScoreAny = 0;
    for (const diff of DIFFICULTY_ORDER) {
        bestScoreAny = Math.max(bestScoreAny, loadHighScore(diff, false));
    }
    let bestHardcoreScore = 0;
    for (const diff of DIFFICULTY_ORDER) {
        bestHardcoreScore = Math.max(bestHardcoreScore, loadHighScore(diff, true));
    }
    const ctx = {
        score: scene.round.score,
        hardcore: scene.hardcoreMode,
        dailyChallenge: scene.dailyChallengeMode === true,
        dailyGoal: scene.dailyGoal ?? 0,
        dailyGoalMet: scene.playMode === 'daily'
            && scene.dailyGoal > 0
            && scene.round.score >= scene.dailyGoal,
        bestScoreAny,
        bestHardcoreScore,
        bestEasyScore: loadHighScore(DIFFICULTY.EASY, false),
        bestNormalScore: loadHighScore(DIFFICULTY.NORMAL, false),
        bestHardScore: loadHighScore(DIFFICULTY.HARD, false),
        bestTrainingScore: loadBestTrainingScore(),
        dailyCompletionsTotal: loadDailyStats().totalCompletions,
        unlockedSkinCount: 0,
        hardcoreUnlocked: false,
    };
    ctx.unlockedSkinCount = listUnlockedSkins(ctx).length;
    ctx.hardcoreUnlocked = isHardcoreUnlocked(ctx);
    return ctx;
}
