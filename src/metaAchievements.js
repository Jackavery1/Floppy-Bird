import { evaluateAchievements } from './metaProgress.js';
import { buildMetaContext } from './metaContext.js';
import { getSkin, listUnlockedSkins } from './skins/index.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

function notifyNewlyUnlocked(scene, newly) {
    if (newly.length > 0 && scene.achievementNotifier) {
        scene.achievementNotifier(newly);
    }
    return newly;
}

/** Succès liés au score en cours (toasts pendant la manche). @param {SceneContext} scene */
export function notifyAchievementUnlocks(scene) {
    return notifyNewlyUnlocked(scene, evaluateAchievements(scene, { timing: 'score' }));
}

/** Succès de fin de manche (toasts après l’animation de mort). @param {SceneContext} scene */
export function notifyEndOfRoundAchievements(scene) {
    return notifyNewlyUnlocked(scene, evaluateAchievements(scene, { timing: 'roundEnd' }));
}

/** Snapshot des skins débloqués au démarrage de manche. @param {SceneContext} scene */
export function snapshotUnlockedSkins(scene) {
    scene.round.unlockedSkinIdsAtStart = listUnlockedSkins(buildMetaContext(scene));
}

/**
 * Toasts pour les skins nouvellement débloqués (après persistance du score).
 * @param {SceneContext} scene
 */
export function notifyNewlyUnlockedSkins(scene) {
    if (scene.trainingMode) return [];
    const before = new Set(scene.round.unlockedSkinIdsAtStart ?? []);
    const newly = listUnlockedSkins(buildMetaContext(scene))
        .filter((id) => !before.has(id))
        .map((id) => ({
            id: `skin-${id}`,
            title: getSkin(id).label,
            kind: 'skin',
        }));
    return notifyNewlyUnlocked(scene, newly);
}
