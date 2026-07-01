import { DIFFICULTY_ORDER } from './config.js';
import { getDailyChallengeSeed } from './dailyChallenge.js';
import { loadHighScore } from './storage.js';
import { listUnlockedSkins } from './skins.js';

/**
 * @typedef {Object} MetaContext
 * @property {number} score
 * @property {boolean} hardcore
 * @property {boolean} dailyChallenge
 * @property {number} bestScoreAny
 * @property {number} bestHardcoreScore
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
        dailyChallenge: getDailyChallengeSeed() != null,
        bestScoreAny,
        bestHardcoreScore,
        unlockedSkinCount: 0,
    };
    ctx.unlockedSkinCount = listUnlockedSkins(ctx).length;
    return ctx;
}
