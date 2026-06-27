import { GAME_CONFIG } from '../config.js';

let cachedBackgroundPeriod = null;

export function getBackgroundPeriod() {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 20 ? 'day' : 'night';
}

export function resetBackgroundCache() {
    cachedBackgroundPeriod = null;
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

    const bands = [
        { y: 0,   h: 80,  c: 0x1a1a4e },
        { y: 80,  h: 80,  c: 0x1c2460 },
        { y: 160, h: 100, c: 0x1e3a6e },
        { y: 260, h: 120, c: 0x2d5a8e },
        { y: 380, h: 140, c: 0x4a82b8 },
        { y: 520, h: 160, c: 0x6aafd8 },
        { y: 680, h: 100, c: 0x87CEEB },
        { y: 780, h: 74,  c: 0xb8dfc0 },
    ];
    bands.forEach(b => {
        g.fillStyle(b.c, 1);
        g.fillRect(0, b.y, W, b.h);
    });

    const stars = [
        [38, 28], [88, 14], [148, 48], [198, 22], [258, 38],
        [308, 9],  [358, 54], [418, 33], [68, 78], [178, 68],
        [278, 82], [388, 58], [448, 88], [118, 118], [348, 98],
        [458, 42], [28, 128], [218, 108], [408, 112], [158, 142],
    ];
    stars.forEach(([sx, sy]) => {
        g.fillStyle(0xFFFFFF, 0.65);
        g.fillCircle(sx, sy, 1.5);
    });

    if (period === 'day') {
        g.fillStyle(0xFFD700, 0.15);
        g.fillCircle(380, 80, 40);
        g.fillStyle(0xFFD700, 1);
        g.fillCircle(380, 80, 28);
    } else {
        g.fillStyle(0xFFFDE7, 1);
        g.fillCircle(380, 80, 24);
        g.fillStyle(0x1e3a6e, 1);
        g.fillCircle(392, 72, 20);
    }

    g.generateTexture('background', W, H);
    g.destroy();
    cachedBackgroundPeriod = period;
}
