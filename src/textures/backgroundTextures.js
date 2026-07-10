import { GAME_CONFIG } from '../config.js';
import { DESIGN_TOKENS } from '../designTokens.js';
import { getBackgroundPeriod } from '../backgroundPeriod.js';

let cachedBackgroundPeriod = null;

export { getBackgroundPeriod } from '../backgroundPeriod.js';

export function resetBackgroundCache() {
    cachedBackgroundPeriod = null;
}

/** @typedef {{ y: number, h: number, c: number }} SkyBand */

/** @type {SkyBand[]} */
const NIGHT_BANDS = [
    { y: 0, h: 80, c: 0x1a1a4e },
    { y: 80, h: 80, c: 0x1c2460 },
    { y: 160, h: 100, c: 0x1e3a6e },
    { y: 260, h: 120, c: 0x2d5a8e },
    { y: 380, h: 140, c: 0x4a82b8 },
    { y: 520, h: 160, c: 0x6aafd8 },
    { y: 680, h: 100, c: 0x87ceeb },
    { y: 780, h: 74, c: 0xb8dfc0 },
];

/** @type {SkyBand[]} */
const DAY_BANDS = [
    { y: 0, h: 80, c: 0x0288d1 },
    { y: 80, h: 80, c: 0x039be5 },
    { y: 160, h: 100, c: 0x29b6f6 },
    { y: 260, h: 120, c: 0x4fc3f7 },
    { y: 380, h: 140, c: 0x81d4fa },
    { y: 520, h: 160, c: 0xb3e5fc },
    { y: 680, h: 100, c: 0xe1f5fe },
    { y: 780, h: 74, c: 0xc8e6c9 },
];

/** Positions décoratives des étoiles (x, y) en px canvas — sans lien avec les gaps gameplay. */
export const STAR_POSITIONS = [
    [22, 28],
    [58, 14],
    [104, 48],
    [148, 22],
    [192, 38],
    [236, 12],
    [268, 54],
    [42, 72],
    [118, 68],
    [178, 82],
    [224, 58],
    [72, 108],
    [162, 98],
    [248, 112],
    [32, 128],
    [200, 118],
];

/** @param {import('phaser').GameObjects.Graphics} g @param {SkyBand[]} bands */
function drawSkyBands(g, bands) {
    const W = GAME_CONFIG.width;
    bands.forEach((b) => {
        g.fillStyle(b.c, 1);
        g.fillRect(0, b.y, W, b.h);
    });
}

/** @param {import('phaser').GameObjects.Graphics} g */
function drawStars(g) {
    STAR_POSITIONS.forEach(([sx, sy]) => {
        g.fillStyle(0xffffff, 0.65);
        g.fillCircle(sx, sy, 1.5);
    });
}

export function createBackgroundSprite(scene) {
    const period = getBackgroundPeriod();
    if (cachedBackgroundPeriod === period && scene.textures.exists('background')) {
        return;
    }
    if (scene.textures.exists('background')) {
        scene.textures.remove('background');
    }

    const W = GAME_CONFIG.width;
    const H = GAME_CONFIG.height;
    const g = scene.make.graphics({ x: 0, y: 0, add: false });

    drawSkyBands(g, period === 'day' ? DAY_BANDS : NIGHT_BANDS);

    if (period === 'night') {
        drawStars(g);
    }

    g.generateTexture('background', W, H);
    g.destroy();
    cachedBackgroundPeriod = period;
}

/** Couleur de letterbox / chargement alignée sur la période courante. */
export function getBackgroundCanvasColor() {
    return getBackgroundPeriod() === 'day' ? DESIGN_TOKENS.fondJour : DESIGN_TOKENS.fondNuit;
}
