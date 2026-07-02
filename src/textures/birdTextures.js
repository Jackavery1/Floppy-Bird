import { getSkin } from '../skins/index.js';

/** @typedef {import('../skins/skinTypes.js').SkinPalette} SkinPalette */

const FRAME_W = 38;
const FRAME_H = 28;

/** @param {import('phaser').GameObjects.Graphics} g */
function drawOutline(g, ox, oy, alpha) {
    g.fillStyle(0x000000, alpha);
    g.fillRect(ox + 4,  oy + 1, 26, 26);
    g.fillRect(ox + 1,  oy + 4, 32, 20);
    g.fillRect(ox + 0,  oy + 6, 36, 16);
    g.fillRect(ox + 31, oy + 9,  9, 13);
}

/** @param {import('phaser').GameObjects.Graphics} g @param {SkinPalette} p */
function drawBody(g, ox, oy, p, alpha) {
    g.fillStyle(p.body, alpha);
    g.fillRect(ox + 6, oy + 3, 22, 22);
    g.fillRect(ox + 3, oy + 6, 28, 16);
    g.fillRect(ox + 2, oy + 8, 32, 12);
    g.fillStyle(p.bodyHi, alpha);
    g.fillRect(ox + 15, oy + 11, 11, 9);
    g.fillStyle(0xFFFFFF, alpha);
    g.fillRect(ox + 22, oy + 4, 9, 11);
    g.fillStyle(0x111111, alpha);
    g.fillRect(ox + 25, oy + 7, 5, 5);
    g.fillStyle(0xFFFFFF, alpha);
    g.fillRect(ox + 26, oy + 7, 2, 2);
    g.fillStyle(p.beak, alpha);
    g.fillRect(ox + 33, oy + 11, 5, 8);
    g.fillStyle(p.beakDark, alpha);
    g.fillRect(ox + 33, oy + 16, 5, 4);
}

/** @param {import('phaser').GameObjects.Graphics} g @param {'up'|'mid'|'down'} pos @param {SkinPalette} p */
function drawWing(g, ox, oy, pos, p, alpha) {
    g.fillStyle(p.wing, alpha);
    if (pos === 'up') {
        g.fillRect(ox + 4, oy + 2, 14, 6);
        g.fillRect(ox + 6, oy + 0, 10, 4);
    } else if (pos === 'mid') {
        g.fillRect(ox + 4, oy + 15, 15, 7);
        g.fillRect(ox + 6, oy + 13, 11, 4);
    } else {
        g.fillRect(ox + 4, oy + 21, 14, 6);
        g.fillRect(ox + 6, oy + 25, 10, 3);
    }
}

/**
 * @param {import('phaser').Scene} scene
 * @param {string} skinId
 */
export function createBirdSpriteSheet(scene, skinId = 'classic') {
    const skin = getSkin(skinId);
    const { palette, accessory } = skin;
    const texKey = `bird-sheet-${skinId}`;
    if (scene.textures.exists(texKey)) return;

    const canvasH = accessory?.height ?? FRAME_H;
    const oy = accessory?.bodyOffsetY ?? 0;
    const alpha = accessory?.alpha ?? 1;

    const g = scene.make.graphics({ x: 0, y: 0, add: false });

    const drawFrame = (ox, pos) => {
        drawOutline(g, ox, oy, alpha);
        drawBody(g, ox, oy, palette, alpha);
        drawWing(g, ox, oy, pos, palette, alpha);
        accessory?.draw?.(g, ox, oy, pos, palette);
    };

    drawFrame(0, 'up');
    drawFrame(FRAME_W, 'mid');
    drawFrame(FRAME_W * 2, 'down');

    g.generateTexture(texKey, FRAME_W * 3, canvasH);
    g.destroy();

    const texture = scene.textures.get(texKey);
    texture.add(0, 0, 0, 0, FRAME_W, canvasH);
    texture.add(1, 0, FRAME_W, 0, FRAME_W, canvasH);
    texture.add(2, 0, FRAME_W * 2, 0, FRAME_W, canvasH);
}
