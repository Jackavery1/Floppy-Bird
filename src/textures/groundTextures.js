import { GAME_CONFIG } from '../config.js';
import { getBackgroundPeriod } from './backgroundTextures.js';

export const GROUND_BLADE_H = 10;
const GRASS_H = 20;
const DIRT_H = 6;
export const GROUND_TILE_H = GROUND_BLADE_H + GRASS_H + DIRT_H;

function hillUnderlayColor() {
    return getBackgroundPeriod() === 'day' ? 0x4e7c31 : 0x1a2e26;
}

export function createGroundTexture(scene) {
    const W = GAME_CONFIG.width;

    let seed = 42317;
    const rand = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 0xffffffff;
    };
    const randInt = (lo, hi) => Math.floor(rand() * (hi - lo + 1)) + lo;

    const g = scene.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(hillUnderlayColor(), 1);
    g.fillRect(0, 0, W, GROUND_BLADE_H);

    g.fillStyle(0x74bf2e, 1);
    g.fillRect(0, GROUND_BLADE_H, W, GRASS_H);

    g.fillStyle(0x5aad23, 1);
    g.fillRect(0, GROUND_BLADE_H + GRASS_H - 2, W, 2);
    g.fillRect(0, GROUND_BLADE_H, W, 2);

    g.fillStyle(0x6d4c2e, 1);
    g.fillRect(0, GROUND_BLADE_H + GRASS_H, W, DIRT_H);
    g.fillStyle(0x5a3d24, 1);
    g.fillRect(0, GROUND_BLADE_H + GRASS_H, W, 2);

    const bladeColors = [0x5aad23, 0x68cc2a];
    for (let x = 0; x < W; x += 6) {
        const h = randInt(4, 10);
        const w = randInt(4, 7);
        const col = bladeColors[Math.round(rand())];
        g.fillStyle(col, 1);
        g.fillRoundedRect(x, GROUND_BLADE_H - h, w, h, 2);
    }

    const flowers = [
        { x: 48, color: 0xffeb3b },
        { x: 130, color: 0xff7043 },
        { x: 210, color: 0xffeb3b },
        { x: 268, color: 0xff7043 },
    ];
    flowers.forEach(({ x: fx, color }) => {
        const fy = GROUND_BLADE_H - 4;
        g.fillStyle(color, 1);
        g.fillCircle(fx, fy, 2);
        g.fillCircle(fx + 4, fy, 2);
        g.fillCircle(fx + 2, fy - 2, 2);
        g.fillCircle(fx + 2, fy + 2, 2);
        g.fillStyle(0xffffff, 1);
        g.fillCircle(fx + 2, fy, 1.5);
    });

    g.generateTexture('ground', W, GROUND_TILE_H);
    g.destroy();
}
