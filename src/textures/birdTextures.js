import { getSkin } from '../skins.js';

/** @typedef {import('../skins.js').SkinPalette} SkinPalette */

/**
 * @param {import('phaser').Scene} scene
 * @param {string} skinId
 */
export function createBirdSpriteSheet(scene, skinId = 'classic') {
    const { palette } = getSkin(skinId);
    const texKey = `bird-sheet-${skinId}`;
    if (scene.textures.exists(texKey)) return;

    const g = scene.make.graphics({ x: 0, y: 0, add: false });

    const drawOutline = (ox) => {
        g.fillStyle(0x000000, 1);
        g.fillRect(ox + 4,  1, 26, 26);
        g.fillRect(ox + 1,  4, 32, 20);
        g.fillRect(ox + 0,  6, 36, 16);
        g.fillRect(ox + 31, 9,  9, 13);
    };

    /** @param {number} ox @param {SkinPalette} p */
    const drawBody = (ox, p) => {
        g.fillStyle(p.body, 1);
        g.fillRect(ox + 6, 3, 22, 22);
        g.fillRect(ox + 3, 6, 28, 16);
        g.fillRect(ox + 2, 8, 32, 12);
        g.fillStyle(p.bodyHi, 1);
        g.fillRect(ox + 15, 11, 11, 9);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(ox + 22, 4, 9, 11);
        g.fillStyle(0x111111, 1);
        g.fillRect(ox + 25, 7, 5, 5);
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(ox + 26, 7, 2, 2);
        g.fillStyle(p.beak, 1);
        g.fillRect(ox + 33, 11, 5, 8);
        g.fillStyle(p.beakDark, 1);
        g.fillRect(ox + 33, 16, 5, 4);
    };

    /** @param {number} ox @param {'up'|'mid'|'down'} pos @param {SkinPalette} p */
    const drawWing = (ox, pos, p) => {
        g.fillStyle(p.wing, 1);
        if (pos === 'up') {
            g.fillRect(ox + 4, 2, 14, 6);
            g.fillRect(ox + 6, 0, 10, 4);
        } else if (pos === 'mid') {
            g.fillRect(ox + 4, 15, 15, 7);
            g.fillRect(ox + 6, 13, 11, 4);
        } else {
            g.fillRect(ox + 4, 21, 14, 6);
            g.fillRect(ox + 6, 25, 10, 3);
        }
    };

    drawOutline(0);   drawBody(0, palette);   drawWing(0,  'up', palette);
    drawOutline(38);  drawBody(38, palette);  drawWing(38, 'mid', palette);
    drawOutline(76);  drawBody(76, palette);  drawWing(76, 'down', palette);

    g.generateTexture(texKey, 114, 28);
    g.destroy();

    const texture = scene.textures.get(texKey);
    texture.add(0, 0,  0,  0, 38, 28);
    texture.add(1, 0, 38,  0, 38, 28);
    texture.add(2, 0, 76,  0, 38, 28);
}
