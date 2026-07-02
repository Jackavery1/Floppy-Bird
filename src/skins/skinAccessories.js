/** @typedef {import('./skinTypes.js').SkinPalette} SkinPalette */

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

const TALL_ACCESSORY = { height: 34, bodyOffsetY: 2 };

/** @type {Record<string, import('./skinTypes.js').SkinAccessory>} */
export const SKIN_ACCESSORIES = Object.freeze({
    armure: { ...TALL_ACCESSORY, draw: drawArmureAccessory },
    mushu: { ...TALL_ACCESSORY, draw: drawMushuAccessory },
    phoenix: { ...TALL_ACCESSORY, draw: drawPhoenixAccessory },
    fantome: { ...TALL_ACCESSORY, alpha: 0.72, draw: drawFantomeAccessory },
    glace: { ...TALL_ACCESSORY, draw: drawGlaceAccessory },
    tempete: { ...TALL_ACCESSORY, draw: drawTempeteAccessory },
    cosmos: { ...TALL_ACCESSORY, draw: drawCosmosAccessory },
    neon: { draw: drawNeonAccessory },
});
