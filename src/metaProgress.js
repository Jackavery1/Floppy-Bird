import { ACHIEVEMENTS } from './achievements.js';
import { loadMeta, unlockAchievement } from './metaStorage.js';
import { buildMetaContext } from './metaContext.js';

export { buildMetaContext } from './metaContext.js';

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function evaluateAchievements(scene) {
    if (scene.trainingMode) return [];
    const ctx = buildMetaContext(scene);
    const unlocked = loadMeta().achievements;
    const newly = [];
    for (const def of ACHIEVEMENTS) {
        if (unlocked.includes(def.id)) continue;
        if (!def.check(ctx)) continue;
        if (unlockAchievement(def.id)) {
            newly.push(def);
        }
    }
    return newly;
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function processMetaOnScore(scene) {
    return evaluateAchievements(scene);
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function processMetaOnRoundEnd(scene) {
    return evaluateAchievements(scene);
}

export function achievementSummary() {
    const unlocked = loadMeta().achievements;
    return { unlocked: unlocked.length, total: ACHIEVEMENTS.length };
}
