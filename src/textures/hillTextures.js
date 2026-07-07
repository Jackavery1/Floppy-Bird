import { GAME_CONFIG } from '../config.js';
import { getBackgroundPeriod } from './backgroundTextures.js';

export const HILLS_FAR_H = 72;
export const HILLS_NEAR_H = 96;
const TILE_W = GAME_CONFIG.width;

/** @typedef {{ far: number, near: number }} HillPalette */

/** @param {'day'|'night'} period */
function hillPalette(period) {
    return period === 'day'
        ? { far: 0x6d9f4a, near: 0x4e7c31 }
        : { far: 0x2a4538, near: 0x1a2e26 };
}

/**
 * Silhouettes de collines en dômes — tileable horizontalement.
 * @param {import('phaser').GameObjects.Graphics} g
 * @param {number} w
 * @param {number} h
 * @param {number} color
 * @param {{ cx: number, rx: number, ry: number }[]} bumps
 */
function drawHillTile(g, w, h, color, bumps) {
    g.fillStyle(color, 1);
    bumps.forEach(({ cx, rx, ry }) => {
        g.fillEllipse(cx, h, rx * 2, ry * 2);
    });
    g.fillRect(0, h - 4, w, 4);
}

/** @param {import('phaser').Scene} scene */
export function createHillTextures(scene) {
    const period = getBackgroundPeriod();
    const { far, near } = hillPalette(period);

    if (scene.textures.exists('hills_far')) scene.textures.remove('hills_far');
    if (scene.textures.exists('hills_near')) scene.textures.remove('hills_near');

    const gFar = scene.make.graphics({ x: 0, y: 0, add: false });
    drawHillTile(gFar, TILE_W, HILLS_FAR_H, far, [
        { cx: 36, rx: 52, ry: 34 },
        { cx: 128, rx: 44, ry: 28 },
        { cx: 220, rx: 58, ry: 36 },
        { cx: 300, rx: 48, ry: 30 },
    ]);
    gFar.generateTexture('hills_far', TILE_W, HILLS_FAR_H);
    gFar.destroy();

    const gNear = scene.make.graphics({ x: 0, y: 0, add: false });
    drawHillTile(gNear, TILE_W, HILLS_NEAR_H, near, [
        { cx: 24, rx: 64, ry: 46 },
        { cx: 108, rx: 52, ry: 40 },
        { cx: 198, rx: 70, ry: 50 },
        { cx: 278, rx: 56, ry: 42 },
    ]);
    gNear.generateTexture('hills_near', TILE_W, HILLS_NEAR_H);
    gNear.destroy();
}
