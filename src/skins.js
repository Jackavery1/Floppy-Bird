export const SKIN_IDS = Object.freeze(['classic', 'ruby', 'ocean', 'forest']);

/** @typedef {{ body: number, bodyHi: number, wing: number, beak: number, beakDark: number }} SkinPalette */

/** @type {Record<string, { id: string, label: string, palette: SkinPalette, unlock: (ctx: import('./metaContext.js').MetaContext) => boolean }>} */
export const SKINS = Object.freeze({
    classic: {
        id: 'classic',
        label: 'Classique',
        palette: {
            body: 0xFFCC00,
            bodyHi: 0xFFEE88,
            wing: 0xFFAA00,
            beak: 0xFF8800,
            beakDark: 0xCC5500,
        },
        unlock: () => true,
    },
    ruby: {
        id: 'ruby',
        label: 'Rubis',
        palette: {
            body: 0xE53935,
            bodyHi: 0xFF8A80,
            wing: 0xC62828,
            beak: 0xFF6F00,
            beakDark: 0xE65100,
        },
        unlock: ctx => ctx.bestScoreAny >= 10,
    },
    ocean: {
        id: 'ocean',
        label: 'Océan',
        palette: {
            body: 0x29B6F6,
            bodyHi: 0x81D4FA,
            wing: 0x0288D1,
            beak: 0xFF8F00,
            beakDark: 0xEF6C00,
        },
        unlock: ctx => ctx.bestScoreAny >= 20,
    },
    forest: {
        id: 'forest',
        label: 'Forêt',
        palette: {
            body: 0x66BB6A,
            bodyHi: 0xA5D6A7,
            wing: 0x388E3C,
            beak: 0xFFA726,
            beakDark: 0xF57C00,
        },
        unlock: ctx => ctx.bestHardcoreScore >= 5,
    },
});

export function birdTextureKey(skinId) {
    return `bird-sheet-${skinId}`;
}

export function birdAnimKey(skinId) {
    return `bird-bat-${skinId}`;
}

export function getSkin(skinId) {
    return SKINS[skinId] ?? SKINS.classic;
}

export function listUnlockedSkins(ctx) {
    return SKIN_IDS.filter(id => SKINS[id].unlock(ctx));
}

export function nextUnlockedSkin(currentId, ctx) {
    const unlocked = listUnlockedSkins(ctx);
    if (!unlocked.length) return 'classic';
    const idx = unlocked.indexOf(currentId);
    return unlocked[(idx + 1) % unlocked.length];
}
