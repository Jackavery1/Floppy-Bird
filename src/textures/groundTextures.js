import { GAME_CONFIG } from '../config.js';

export const GROUND_BLADE_H = 10;
const GRASS_H = 20;
export const GROUND_TILE_H = GROUND_BLADE_H + GRASS_H;

export function createGroundTexture(scene) {
    const W = GAME_CONFIG.width;

    let seed = 42317;
    const rand = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 0xFFFFFFFF;
    };
    const randInt = (lo, hi) => Math.floor(rand() * (hi - lo + 1)) + lo;

    const g = scene.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(0x74BF2E, 1);
    g.fillRect(0, GROUND_BLADE_H, W, GRASS_H);

    g.fillStyle(0x5AAD23, 1);
    g.fillRect(0, GROUND_BLADE_H + GRASS_H - 2, W, 2);
    g.fillRect(0, GROUND_BLADE_H, W, 2);

    const bladeColors = [0x5AAD23, 0x68CC2A];
    for (let x = 0; x < W; x += 6) {
        const h = randInt(4, 10);
        const w = randInt(4, 7);
        const col = bladeColors[Math.round(rand())];
        g.fillStyle(col, 1);
        g.fillRoundedRect(x, GROUND_BLADE_H - h, w, h, 2);
    }

    const flowers = [
        { x: 48,  color: 0xFFEB3B },
        { x: 130, color: 0xFF7043 },
        { x: 252, color: 0xFFEB3B },
        { x: 390, color: 0xFF7043 },
    ];
    flowers.forEach(({ x: fx, color }) => {
        const fy = GROUND_BLADE_H - 4;
        g.fillStyle(color, 1);
        g.fillCircle(fx,     fy,     2);
        g.fillCircle(fx + 4, fy,     2);
        g.fillCircle(fx + 2, fy - 2, 2);
        g.fillCircle(fx + 2, fy + 2, 2);
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(fx + 2, fy, 1.5);
    });

    g.generateTexture('ground', W, GROUND_TILE_H);
    g.destroy();
}
