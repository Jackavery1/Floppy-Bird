import { GAME_CONFIG } from '../config.js';

let cachedBackgroundPeriod = null;

/** @param {Date} [date] */
export function getBackgroundPeriod(date = new Date()) {
    const hour = date.getHours();
    return hour >= 6 && hour < 20 ? 'day' : 'night';
}

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

/** @type {[number, number][]} */
const STAR_POSITIONS = [
    [38, 28],
    [88, 14],
    [148, 48],
    [198, 22],
    [258, 38],
    [308, 9],
    [358, 54],
    [418, 33],
    [68, 78],
    [178, 68],
    [278, 82],
    [388, 58],
    [448, 88],
    [118, 118],
    [348, 98],
    [458, 42],
    [28, 128],
    [218, 108],
    [408, 112],
    [158, 142],
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

/** @param {import('phaser').GameObjects.Graphics} g */
function drawSun(g) {
    g.fillStyle(0xffd54f, 0.22);
    g.fillCircle(380, 80, 46);
    g.fillStyle(0xffd54f, 0.35);
    g.fillCircle(380, 80, 34);
    g.fillStyle(0xffeb3b, 1);
    g.fillCircle(380, 80, 26);
}

/** @param {import('phaser').GameObjects.Graphics} g */
function drawMoon(g) {
    g.fillStyle(0xfffde7, 1);
    g.fillCircle(380, 80, 24);
    g.fillStyle(0x1e3a6e, 1);
    g.fillCircle(392, 72, 20);
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
        drawMoon(g);
    } else {
        drawSun(g);
    }

    g.generateTexture('background', W, H);
    g.destroy();
    cachedBackgroundPeriod = period;
}

/** Couleur de letterbox / chargement alignée sur la période courante. */
export function getBackgroundCanvasColor() {
    return getBackgroundPeriod() === 'day' ? '#87ceeb' : '#1a1a2e';
}
