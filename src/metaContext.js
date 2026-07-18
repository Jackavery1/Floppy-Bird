import { DIFFICULTY } from './config.js';
import { loadBestHardcoreScore, loadBestScoreAny, loadHighScore } from './highScores.js';
import { listUnlockedSkins } from './skins/index.js';
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
 * @property {number} dailyStreak
 * @property {number} unlockedSkinCount
 */

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function buildMetaContext(scene) {
    const bestScoreAny = loadBestScoreAny();
    const bestHardcoreScore = loadBestHardcoreScore();
    const ctx = {
        score: scene.round.score,
        hardcore: scene.hardcoreMode,
        dailyChallenge: scene.dailyChallengeMode === true,
        dailyGoal: scene.dailyGoal ?? 0,
        dailyGoalMet:
            scene.playMode === 'daily' &&
            scene.dailyGoal > 0 &&
            scene.round.score >= scene.dailyGoal,
        bestScoreAny,
        bestHardcoreScore,
        bestEasyScore: loadHighScore(DIFFICULTY.EASY, false),
        bestNormalScore: loadHighScore(DIFFICULTY.NORMAL, false),
        bestHardScore: loadHighScore(DIFFICULTY.HARD, false),
        bestTrainingScore: loadBestTrainingScore(),
        dailyCompletionsTotal: 0,
        dailyStreak: 0,
        unlockedSkinCount: 0,
        hardcoreUnlocked: false,
    };
    const dailyStats = loadDailyStats();
    ctx.dailyCompletionsTotal = dailyStats.totalCompletions;
    ctx.dailyStreak = dailyStats.consecutiveDays;
    ctx.unlockedSkinCount = listUnlockedSkins(ctx).length;
    ctx.hardcoreUnlocked = isHardcoreUnlocked(ctx);
    return ctx;
}
