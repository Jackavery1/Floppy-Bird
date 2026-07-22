import { getBackgroundPeriod } from './backgroundTextures.js';

const SUN_W = 52;
const SUN_H = 52;
const MOON_W = 44;
const MOON_H = 44;

/** @param {import('phaser').GameObjects.Graphics} g */
function drawSunTexture(g) {
    const cx = SUN_W / 2;
    const cy = SUN_H / 2;
    g.fillStyle(0xffd54f, 0.18);
    g.fillCircle(cx, cy, 24);
    g.fillStyle(0xffd54f, 0.32);
    g.fillCircle(cx, cy, 18);
    g.fillStyle(0xffeb3b, 1);
    g.fillCircle(cx, cy, 14);
    g.lineStyle(2, 0xffeb3b, 0.55);
    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const x1 = cx + Math.cos(a) * 17;
        const y1 = cy + Math.sin(a) * 17;
        const x2 = cx + Math.cos(a) * 22;
        const y2 = cy + Math.sin(a) * 22;
        g.lineBetween(x1, y1, x2, y2);
    }
}

/** @param {import('phaser').GameObjects.Graphics} g */
function drawMoonTexture(g) {
    const cx = MOON_W / 2;
    const cy = MOON_H / 2;
    g.fillStyle(0xfffde7, 1);
    g.fillCircle(cx, cy, 15);
    g.fillStyle(0xe8eaf6, 0.45);
    g.fillCircle(cx - 5, cy - 4, 4);
    g.fillCircle(cx + 4, cy + 3, 3);
    g.fillStyle(0x1e3a6e, 1);
    g.fillCircle(cx + 7, cy - 5, 13);
}

/** @param {import('phaser').Scene} scene */
export function createCelestialTextures(scene) {
    if (!scene.textures.exists('sun')) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        drawSunTexture(g);
        g.generateTexture('sun', SUN_W, SUN_H);
        g.destroy();
    }
    if (!scene.textures.exists('moon')) {
        const g = scene.make.graphics({ x: 0, y: 0, add: false });
        drawMoonTexture(g);
        g.generateTexture('moon', MOON_W, MOON_H);
        g.destroy();
    }
}

/** Position coin haut-droit — hors de la trajectoire de l'oiseau. */
const CELESTIAL_ANCHOR = Object.freeze({ x: 238, y: 54 });

/** @param {import('phaser').Scene} scene */
export function createCelestialSprite(scene) {
    const isNight = getBackgroundPeriod() === 'night';
    const key = isNight ? 'moon' : 'sun';
    const sprite = scene.add.sprite(CELESTIAL_ANCHOR.x, CELESTIAL_ANCHOR.y, key);
    sprite.setAlpha(isNight ? 0.92 : 0.95);
    return sprite;
}
