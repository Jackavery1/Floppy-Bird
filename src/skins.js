export const SKIN_IDS = Object.freeze([
    'classic', 'lavande', 'ruby', 'ambre',
    'ocean', 'corail', 'forest', 'minuit',
    'armure', 'mushu', 'phoenix', 'fantome',
    'glace', 'tempete', 'cosmos', 'neon',
]);

/** @typedef {{
 *   body: number, bodyHi: number, wing: number, beak: number, beakDark: number,
 *   [extra: string]: number,
 * }} SkinPalette */

/**
 * @typedef {Object} SkinAccessory
 * @property {number} [height]
 * @property {number} [bodyOffsetY]
 * @property {number} [alpha]
 * @property {(g: import('phaser').GameObjects.Graphics, ox: number, oy: number,
 *   pos: 'up'|'mid'|'down', palette: SkinPalette) => void} [draw]
 */

function drawArmureAccessory(g, ox, oy, _pos, p) {
    g.fillStyle(p.helmet, 1);
    g.fillRect(ox + 20, oy + 1, 13, 6);
    g.fillRect(ox + 30, oy + 6, 4, 6);
    g.fillRect(ox + 2, oy + 5, 5, 5);
    g.fillStyle(p.helmetHi, 1);
    g.fillRect(ox + 21, oy + 1, 11, 1);
    g.fillStyle(p.plume, 1);
    g.fillRect(ox + 25, oy - 2, 3, 4);
    g.fillRect(ox + 9, oy + 9, 3, 3);
}

function drawMushuAccessory(g, ox, oy, _pos, p) {
    g.fillStyle(p.horn, 1);
    g.fillRect(ox + 22, oy - 2, 2, 4);
    g.fillRect(ox + 28, oy - 2, 2, 4);
    g.fillStyle(p.ridge, 1);
    g.fillRect(ox + 8, oy + 1, 3, 3);
    g.fillRect(ox + 13, oy - 1, 3, 4);
    g.fillRect(ox + 18, oy + 1, 3, 3);
    g.fillStyle(p.whisker, 1);
    g.fillRect(ox + 30, oy + 10, 5, 1);
    g.fillRect(ox + 30, oy + 18, 5, 1);
}

function drawFantomeAccessory(g, ox, oy, _pos, p) {
    g.fillStyle(p.glow, 1);
    g.fillRect(ox + 23, oy + 6, 1, 7);
    g.fillRect(ox + 31, oy + 6, 1, 7);
    g.fillStyle(p.wisp, 0.5);
    g.fillRect(ox + 5, oy + 22, 5, 4);
    g.fillRect(ox + 21, oy + 22, 5, 4);
    g.fillStyle(p.wisp, 0.4);
    g.fillRect(ox + 13, oy + 24, 5, 5);
    g.fillRect(ox + 28, oy + 19, 4, 4);
}

function drawNeonAccessory(g, ox, oy, _pos, p) {
    g.fillStyle(p.visor, 1);
    g.fillRect(ox + 23, oy + 7, 8, 4);
    g.fillRect(ox + 9, oy + 13, 2, 2);
    g.fillStyle(p.trim, 1);
    g.fillRect(ox + 23, oy + 11, 8, 1);
    g.fillRect(ox + 6, oy + 3, 22, 1);
    g.fillRect(ox + 3, oy + 20, 28, 1);
}

function drawPhoenixAccessory(g, ox, oy, _pos, p) {
    g.fillStyle(p.flame, 1);
    g.fillRect(ox + 24, oy - 3, 4, 5);
    g.fillRect(ox + 20, oy - 1, 3, 3);
    g.fillRect(ox + 29, oy - 1, 3, 3);
    g.fillStyle(p.ember, 1);
    g.fillRect(ox + 25, oy + 1, 2, 2);
    g.fillRect(ox + 6, oy + 4, 4, 2);
    g.fillRect(ox + 30, oy + 6, 3, 2);
}

function drawGlaceAccessory(g, ox, oy, _pos, p) {
    g.fillStyle(p.crystal, 1);
    g.fillRect(ox + 22, oy - 2, 2, 4);
    g.fillRect(ox + 28, oy - 2, 2, 4);
    g.fillRect(ox + 25, oy - 3, 2, 2);
    g.fillStyle(p.shine, 0.85);
    g.fillRect(ox + 10, oy + 5, 2, 2);
    g.fillRect(ox + 30, oy + 12, 2, 2);
}

function drawTempeteAccessory(g, ox, oy, _pos, p) {
    g.fillStyle(p.cloud, 0.9);
    g.fillRect(ox + 18, oy - 2, 10, 4);
    g.fillRect(ox + 20, oy - 4, 6, 3);
    g.fillStyle(p.bolt, 1);
    g.fillRect(ox + 24, oy + 2, 2, 5);
    g.fillRect(ox + 22, oy + 5, 4, 1);
    g.fillRect(ox + 26, oy + 7, 2, 2);
}

function drawCosmosAccessory(g, ox, oy, _pos, p) {
    g.fillStyle(p.star, 1);
    g.fillRect(ox + 8, oy + 2, 2, 2);
    g.fillRect(ox + 14, oy - 1, 2, 2);
    g.fillRect(ox + 30, oy + 4, 2, 2);
    g.fillStyle(p.ring, 1);
    g.fillRect(ox + 4, oy + 14, 30, 1);
    g.fillRect(ox + 18, oy + 12, 2, 4);
}

/** @param {import('./metaContext.js').MetaContext} ctx */
function allSkinsExceptNeonUnlocked(ctx) {
    return SKIN_IDS.filter(id => id !== 'neon').every(id => SKINS[id].unlock(ctx));
}

/** @type {Record<string, { id: string, label: string, hint: string, palette: SkinPalette,
 *   accessory?: SkinAccessory, unlock: (ctx: import('./metaContext.js').MetaContext) => boolean }>} */
export const SKINS = Object.freeze({
    classic: {
        id: 'classic',
        label: 'Classique',
        hint: 'Toujours disponible',
        palette: {
            body: 0xFFCC00,
            bodyHi: 0xFFEE88,
            wing: 0xFFAA00,
            beak: 0xFF8800,
            beakDark: 0xCC5500,
        },
        unlock: () => true,
    },
    lavande: {
        id: 'lavande',
        label: 'Lavande',
        hint: 'Meilleur score ≥ 5',
        palette: {
            body: 0xB39DDB,
            bodyHi: 0xE1BEE7,
            wing: 0x9575CD,
            beak: 0xFF8A65,
            beakDark: 0xE64A19,
        },
        unlock: ctx => ctx.bestScoreAny >= 5,
    },
    ruby: {
        id: 'ruby',
        label: 'Rubis',
        hint: 'Meilleur score ≥ 10',
        palette: {
            body: 0xE53935,
            bodyHi: 0xFF8A80,
            wing: 0xC62828,
            beak: 0xFF6F00,
            beakDark: 0xE65100,
        },
        unlock: ctx => ctx.bestScoreAny >= 10,
    },
    ambre: {
        id: 'ambre',
        label: 'Ambre',
        hint: 'Score normal ≥ 12',
        palette: {
            body: 0xFFB300,
            bodyHi: 0xFFE082,
            wing: 0xFF8F00,
            beak: 0xFF6D00,
            beakDark: 0xE65100,
        },
        unlock: ctx => ctx.bestNormalScore >= 12,
    },
    ocean: {
        id: 'ocean',
        label: 'Océan',
        hint: 'Meilleur score ≥ 20',
        palette: {
            body: 0x29B6F6,
            bodyHi: 0x81D4FA,
            wing: 0x0288D1,
            beak: 0xFF8F00,
            beakDark: 0xEF6C00,
        },
        unlock: ctx => ctx.bestScoreAny >= 20,
    },
    corail: {
        id: 'corail',
        label: 'Corail',
        hint: 'Meilleur score ≥ 25',
        palette: {
            body: 0xFF7043,
            bodyHi: 0xFFAB91,
            wing: 0xF4511E,
            beak: 0xFFD54F,
            beakDark: 0xFFA000,
        },
        unlock: ctx => ctx.bestScoreAny >= 25,
    },
    forest: {
        id: 'forest',
        label: 'Forêt',
        hint: 'Meilleur score hardcore ≥ 5',
        palette: {
            body: 0x66BB6A,
            bodyHi: 0xA5D6A7,
            wing: 0x388E3C,
            beak: 0xFFA726,
            beakDark: 0xF57C00,
        },
        unlock: ctx => ctx.bestHardcoreScore >= 5,
    },
    minuit: {
        id: 'minuit',
        label: 'Minuit',
        hint: 'Score difficile ≥ 15',
        palette: {
            body: 0x3949AB,
            bodyHi: 0x7986CB,
            wing: 0x283593,
            beak: 0xB0BEC5,
            beakDark: 0x78909C,
        },
        unlock: ctx => ctx.bestHardScore >= 15,
    },
    armure: {
        id: 'armure',
        label: 'Chevalier',
        hint: 'Meilleur score hardcore ≥ 15',
        palette: {
            body: 0x78909C,
            bodyHi: 0xB0BEC5,
            wing: 0x546E7A,
            beak: 0xCFD8DC,
            beakDark: 0x90A4AE,
            helmet: 0x455A64,
            helmetHi: 0x607D8B,
            plume: 0xC62828,
        },
        accessory: { height: 34, bodyOffsetY: 2, draw: drawArmureAccessory },
        unlock: ctx => ctx.bestHardcoreScore >= 15,
    },
    mushu: {
        id: 'mushu',
        label: 'Mushu',
        hint: 'Score ≥ 15 dans les 3 difficultés',
        palette: {
            body: 0xE64A19,
            bodyHi: 0xFFCA28,
            wing: 0xBF360C,
            beak: 0xFFD54F,
            beakDark: 0xFFA000,
            horn: 0xFFD54F,
            ridge: 0xFFCA28,
            whisker: 0xFFECB3,
        },
        accessory: { height: 34, bodyOffsetY: 2, draw: drawMushuAccessory },
        unlock: ctx => ctx.bestEasyScore >= 15
            && ctx.bestNormalScore >= 15
            && ctx.bestHardScore >= 15,
    },
    phoenix: {
        id: 'phoenix',
        label: 'Phénix',
        hint: 'Meilleur score hardcore ≥ 20',
        palette: {
            body: 0xFF5722,
            bodyHi: 0xFFAB91,
            wing: 0xE64A19,
            beak: 0xFFD54F,
            beakDark: 0xFF8F00,
            flame: 0xFFEB3B,
            ember: 0xFF6F00,
        },
        accessory: { height: 34, bodyOffsetY: 2, draw: drawPhoenixAccessory },
        unlock: ctx => ctx.bestHardcoreScore >= 20,
    },
    fantome: {
        id: 'fantome',
        label: 'Fantôme',
        hint: 'Meilleur score ≥ 30',
        palette: {
            body: 0xE0F7FA,
            bodyHi: 0xFFFFFF,
            wing: 0xB2EBF2,
            beak: 0xE1F5FE,
            beakDark: 0xB3E5FC,
            glow: 0x18FFFF,
            wisp: 0xE0F7FA,
        },
        accessory: { height: 34, bodyOffsetY: 2, alpha: 0.72, draw: drawFantomeAccessory },
        unlock: ctx => ctx.bestScoreAny >= 30,
    },
    glace: {
        id: 'glace',
        label: 'Glace',
        hint: '3 défis du jour réussis',
        palette: {
            body: 0xB3E5FC,
            bodyHi: 0xE1F5FE,
            wing: 0x4FC3F7,
            beak: 0xFFE082,
            beakDark: 0xFFB300,
            crystal: 0xFFFFFF,
            shine: 0xE0F7FA,
        },
        accessory: { height: 34, bodyOffsetY: 2, draw: drawGlaceAccessory },
        unlock: ctx => ctx.dailyCompletionsTotal >= 3,
    },
    tempete: {
        id: 'tempete',
        label: 'Tempête',
        hint: '10 pts en entraînement',
        palette: {
            body: 0x607D8B,
            bodyHi: 0x90A4AE,
            wing: 0x455A64,
            beak: 0xFFD54F,
            beakDark: 0xFFA000,
            cloud: 0xCFD8DC,
            bolt: 0xFFEB3B,
        },
        accessory: { height: 34, bodyOffsetY: 2, draw: drawTempeteAccessory },
        unlock: ctx => ctx.bestTrainingScore >= 10,
    },
    cosmos: {
        id: 'cosmos',
        label: 'Cosmos',
        hint: 'Meilleur score hardcore ≥ 28',
        palette: {
            body: 0x311B92,
            bodyHi: 0x5E35B1,
            wing: 0x4527A0,
            beak: 0xCE93D8,
            beakDark: 0x8E24AA,
            star: 0xFFFFFF,
            ring: 0xB388FF,
        },
        accessory: { height: 34, bodyOffsetY: 2, draw: drawCosmosAccessory },
        unlock: ctx => ctx.bestHardcoreScore >= 28,
    },
    neon: {
        id: 'neon',
        label: 'Néon',
        hint: 'Collection complète (15 skins)',
        palette: {
            body: 0x1A1A2E,
            bodyHi: 0x3D2C5C,
            wing: 0x00E5FF,
            beak: 0xFF2BD6,
            beakDark: 0xC2185B,
            visor: 0xFF2BD6,
            trim: 0x00E5FF,
        },
        accessory: { draw: drawNeonAccessory },
        unlock: allSkinsExceptNeonUnlocked,
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
