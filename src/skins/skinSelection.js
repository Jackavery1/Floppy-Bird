import { saveSelectedSkin } from '../metaStorage.js';

/** @param {import('../sceneTypes.js').SceneContext} scene @param {string} skinId */
export function applySelectedSkin(scene, skinId) {
    saveSelectedSkin(skinId);
    scene.bird?.setSkin?.(skinId);
    return skinId;
}
