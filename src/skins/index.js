import { SKIN_ACCESSORIES } from './skinAccessories.js';
import { SKIN_DEFINITIONS } from './skinDefinitions.js';
import { SKIN_IDS } from './skinIds.js';
import { resolveUnlock } from './skinUnlocks.js';

export { SKIN_IDS } from './skinIds.js';

/** @type {Record<string, import('./skinTypes.js').SkinEntry>} */
const skins = {};

for (const id of SKIN_IDS) {
    const def = SKIN_DEFINITIONS[id];
    const accessory = def.accessoryKey ? SKIN_ACCESSORIES[def.accessoryKey] : undefined;
    skins[id] = {
        id,
        label: def.label,
        hint: def.hint,
        family: def.family,
        palette: def.palette,
        ...(accessory ? { accessory } : {}),
        unlock: () => false,
    };
}

for (const id of SKIN_IDS) {
    skins[id].unlock = resolveUnlock(SKIN_DEFINITIONS[id].unlock, skins);
}

export const SKINS = Object.freeze(skins);

export function birdTextureKey(skinId) {
    return `bird-sheet-${skinId}`;
}

export function birdAnimKey(skinId) {
    return `bird-bat-${skinId}`;
}

export function getSkin(skinId) {
    return SKINS[skinId] ?? SKINS.classic;
}

export function isSpecialSkin(skinId) {
    return getSkin(skinId).family === 'special';
}

/** @param {import('../metaContext.js').MetaContext} ctx */
export function listUnlockedSkins(ctx) {
    return SKIN_IDS.filter((id) => SKINS[id].unlock(ctx));
}

/** @param {import('../metaContext.js').MetaContext} ctx */
export function nextUnlockedSkin(currentId, ctx) {
    return cycleUnlockedSkin(currentId, ctx, 1);
}

/** @param {import('../metaContext.js').MetaContext} ctx @param {1 | -1} step */
export function cycleUnlockedSkin(currentId, ctx, step = 1) {
    const unlocked = listUnlockedSkins(ctx);
    if (!unlocked.length) return 'classic';
    const idx = unlocked.indexOf(currentId);
    const base = idx >= 0 ? idx : 0;
    const next = (base + step + unlocked.length) % unlocked.length;
    return unlocked[next];
}
