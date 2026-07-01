import { ACHIEVEMENTS } from './achievements.js';
import { loadMeta, unlockAchievement } from './metaStorage.js';
import { buildMetaContext } from './metaContext.js';

/** @param {import('./sceneTypes.js').SceneContext} scene @param {{ timing?: 'score' | 'roundEnd' | 'all' }} [opts] */
export function evaluateAchievements(scene, { timing = 'all' } = {}) {
    if (scene.trainingMode) return [];
    const ctx = buildMetaContext(scene);
    const unlocked = loadMeta().achievements;
    const newly = [];
    for (const def of ACHIEVEMENTS) {
        const defTiming = def.timing ?? 'score';
        if (timing !== 'all' && defTiming !== timing) continue;
        if (unlocked.includes(def.id)) continue;
        if (!def.check(ctx)) continue;
        if (unlockAchievement(def.id)) {
            newly.push(def);
        }
    }
    return newly;
}
