import { showAchievementToasts } from './uiAchievementToast.js';

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function wireSceneBindings(scene) {
    scene.achievementNotifier = (achievements) => showAchievementToasts(scene, achievements);
}
