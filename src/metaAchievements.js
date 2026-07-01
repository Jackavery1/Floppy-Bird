import { evaluateAchievements } from './metaProgress.js';

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
