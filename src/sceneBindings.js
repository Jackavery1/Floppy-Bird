import { showAchievementToasts } from './uiMeta.js';

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function wireSceneBindings(scene) {
    scene.achievementNotifier = (achievements) => showAchievementToasts(scene, achievements);
}
