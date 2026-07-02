import { isSpecialSkin } from './skins/index.js';

/** @param {string|null|undefined} skinId */
export function routedSkinId(skinId) {
    return isSpecialSkin(skinId) ? skinId : null;
}
