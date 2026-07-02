import { loadSelectedSkin } from './metaStorage.js';
import { buildMetaContext } from './metaContext.js';
import { listUnlockedSkins } from './skins.js';
import { getDailyChallengeSkin } from './dailyChallenge.js';

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function resolvePlaySkin(scene) {
    if (scene.playMode === 'daily') {
        return getDailyChallengeSkin();
    }
    const selected = loadSelectedSkin();
    const ctx = buildMetaContext(scene);
    return listUnlockedSkins(ctx).includes(selected) ? selected : 'classic';
}
