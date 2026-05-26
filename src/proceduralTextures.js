import { GAME_CONFIG } from './config.js';

const SKY_COLOR = 0x70C5CE;

export function preloadTextures(scene) {
    createBirdSpriteSheet(scene);
    createPipeSprites(scene);
    createBackgroundSprite(scene);
    createCloudTexture(scene);
    createStarTexture(scene);
    createGroundTexture(scene);
}

// ─── BIRD ────────────────────────────────────────────────────────────────────
// 3 frames × 38px wide = 114px total, 28px tall

function createBirdSpriteSheet(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });

    const drawOutline = (ox) => {
        g.fillStyle(0x000000, 1);
        g.fillRect(ox + 4,  1, 26, 26);  // body core outline
        g.fillRect(ox + 1,  4, 32, 20);  // body mid outline
        g.fillRect(ox + 0,  6, 36, 16);  // body wide outline
        g.fillRect(ox + 31, 9,  9, 13);  // beak outline
    };

    const drawBody = (ox) => {
        // Main body (yellow)
        g.fillStyle(0xFFCC00, 1);
        g.fillRect(ox + 6, 3, 22, 22);
        g.fillRect(ox + 3, 6, 28, 16);
        g.fillRect(ox + 2, 8, 32, 12);
        // Belly highlight
        g.fillStyle(0xFFEE88, 1);
        g.fillRect(ox + 15, 11, 11, 9);
        // Eye white
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(ox + 22, 4, 9, 11);
        // Pupil
        g.fillStyle(0x111111, 1);
        g.fillRect(ox + 25, 7, 5, 5);
        // Eye glint
        g.fillStyle(0xFFFFFF, 1);
        g.fillRect(ox + 26, 7, 2, 2);
        // Beak top
        g.fillStyle(0xFF8800, 1);
        g.fillRect(ox + 33, 11, 5, 8);
        // Beak bottom
        g.fillStyle(0xCC5500, 1);
        g.fillRect(ox + 33, 16, 5, 4);
    };

    const drawWing = (ox, pos) => {
        g.fillStyle(0xFFAA00, 1);
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

    // Frame 0 — wing up
    drawOutline(0);   drawBody(0);   drawWing(0,  'up');
    // Frame 1 — wing mid
    drawOutline(38);  drawBody(38);  drawWing(38, 'mid');
    // Frame 2 — wing down
    drawOutline(76);  drawBody(76);  drawWing(76, 'down');

    g.generateTexture('bird-sheet', 114, 28);
    g.destroy();

    const texture = scene.textures.get('bird-sheet');
    texture.add(0, 0,  0,  0, 38, 28);
    texture.add(1, 0, 38,  0, 38, 28);
    texture.add(2, 0, 76,  0, 38, 28);
}

// ─── PIPES ───────────────────────────────────────────────────────────────────
// Palette fidèle à l'original : vert vif #74BF2E, cap protrude de 8px chaque côté

function createPipeSprites(scene) {
    const W = 64;
    const BW = 48;               // body width
    const BX = (W - BW) / 2;    // = 8, centred
    const H = 500;
    const CAP_H = 20;

    const PIPE_MAIN  = 0x74BF2E;
    const PIPE_LIGHT = 0x8ED94A;
    const PIPE_DARK  = 0x5AA022;
    const PIPE_EDGE  = 0x3A7A0A;

    const drawBody = (g, yStart, yEnd) => {
        const h = yEnd - yStart;
        // 1px side borders
        g.fillStyle(PIPE_EDGE, 1);
        g.fillRect(BX - 1, yStart, 1, h);
        g.fillRect(BX + BW, yStart, 1, h);
        // Main body
        g.fillStyle(PIPE_MAIN, 1);
        g.fillRect(BX, yStart, BW, h);
        // Left highlight (8px)
        g.fillStyle(PIPE_LIGHT, 1);
        g.fillRect(BX, yStart, 8, h);
        // Right shadow (6px)
        g.fillStyle(PIPE_DARK, 1);
        g.fillRect(BX + BW - 6, yStart, 6, h);
    };

    const drawCap = (g, yStart) => {
        // Full-width cap (64px)
        g.fillStyle(PIPE_MAIN, 1);
        g.fillRect(0, yStart, W, CAP_H);
        // Left highlight (10px)
        g.fillStyle(PIPE_LIGHT, 1);
        g.fillRect(0, yStart, 10, CAP_H);
        // Right shadow (8px)
        g.fillStyle(PIPE_DARK, 1);
        g.fillRect(W - 8, yStart, 8, CAP_H);
        // 2px borders (top and bottom of cap)
        g.fillStyle(PIPE_EDGE, 1);
        g.fillRect(0, yStart,              W, 2);
        g.fillRect(0, yStart + CAP_H - 2,  W, 2);
    };

    // Top pipe: body fills top → (H-CAP_H), cap sits at bottom
    const gTop = scene.make.graphics({ x: 0, y: 0, add: false });
    drawBody(gTop, 0, H - CAP_H);
    drawCap(gTop, H - CAP_H);
    gTop.generateTexture('pipe-top', W, H);
    gTop.destroy();

    // Bottom pipe: cap at top, then body
    const gBot = scene.make.graphics({ x: 0, y: 0, add: false });
    drawCap(gBot, 0);
    drawBody(gBot, CAP_H, H);
    gBot.generateTexture('pipe-bottom', W, H);
    gBot.destroy();
}

// ─── BACKGROUND ──────────────────────────────────────────────────────────────

let cachedBackgroundPeriod = null;

function getBackgroundPeriod() {
    const hour = new Date().getHours();
    return hour >= 6 && hour < 20 ? 'day' : 'night';
}

function createBackgroundSprite(scene) {
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

    const hour = new Date().getHours();
    if (hour >= 6 && hour < 20) {
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

// ─── CLOUD ───────────────────────────────────────────────────────────────────

function createCloudTexture(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x000000, 0.08);
    g.fillEllipse(65, 56, 110, 18);
    g.fillStyle(0xFFFFFF, 1);
    g.fillEllipse(60, 34, 120, 52);
    g.fillStyle(0xF5F5F5, 1);
    g.fillEllipse(30, 44, 80, 44);
    g.fillEllipse(92, 42, 88, 48);
    g.fillStyle(0xFFFFFF, 1);
    g.fillEllipse(60, 24, 72, 40);
    g.generateTexture('cloud', 140, 70);
    g.destroy();
}

// ─── STAR (score particles) ───────────────────────────────────────────────────

function createStarTexture(scene) {
    const g = scene.make.graphics({ x: 0, y: 0, add: false });
    const cx = 8, cy = 8, outerR = 6, innerR = 2.5, points = 5;
    const starPoints = [];
    for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI / points) - Math.PI / 2;
        const r = i % 2 === 0 ? outerR : innerR;
        starPoints.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
    }
    g.fillStyle(0xFFD700, 1);
    g.fillPoints(starPoints, true);
    g.generateTexture('star', 16, 16);
    g.destroy();
}

// ─── GROUND (tileable, scrolls horizontally) ──────────────────────────────────
// BLADE_H px of blade area above the grass band, then GRASS_H px of solid grass.
// Computed once; GameScene uses a TileSprite that scrolls tilePositionX.

export const GROUND_BLADE_H = 10;   // px of blade space above the grass band
const GRASS_H = 20;
export const GROUND_TILE_H = GROUND_BLADE_H + GRASS_H; // 30

function createGroundTexture(scene) {
    const W = GAME_CONFIG.width;

    // Deterministic LCG so blades are identical every session
    let seed = 42317;
    const rand = () => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return seed / 0xFFFFFFFF;
    };
    const randInt = (lo, hi) => Math.floor(rand() * (hi - lo + 1)) + lo;

    const g = scene.make.graphics({ x: 0, y: 0, add: false });

    // Solid grass band
    g.fillStyle(0x74BF2E, 1);
    g.fillRect(0, GROUND_BLADE_H, W, GRASS_H);

    // Thin darker strip at very bottom for depth
    g.fillStyle(0x5AAD23, 1);
    g.fillRect(0, GROUND_BLADE_H + GRASS_H - 2, W, 2);

    // Separation line at top of grass band
    g.fillStyle(0x5AAD23, 1);
    g.fillRect(0, GROUND_BLADE_H, W, 2);

    // Grass blades — computed once, drawn into texture
    const bladeColors = [0x5AAD23, 0x68CC2A];
    for (let x = 0; x < W; x += 6) {
        const h = randInt(4, 10);
        const w = randInt(4, 7);
        const col = bladeColors[Math.round(rand())];
        g.fillStyle(col, 1);
        g.fillRoundedRect(x, GROUND_BLADE_H - h, w, h, 2);
    }

    // Decorative flowers at fixed positions
    const flowers = [
        { x: 48,  color: 0xFFEB3B },
        { x: 130, color: 0xFF7043 },
        { x: 252, color: 0xFFEB3B },
        { x: 390, color: 0xFF7043 },
    ];
    flowers.forEach(({ x: fx, color }) => {
        const fy = GROUND_BLADE_H - 4;
        g.fillStyle(color, 1);
        g.fillCircle(fx,     fy,     2);  // left petal
        g.fillCircle(fx + 4, fy,     2);  // right petal
        g.fillCircle(fx + 2, fy - 2, 2); // top petal
        g.fillCircle(fx + 2, fy + 2, 2); // bottom petal
        g.fillStyle(0xFFFFFF, 1);
        g.fillCircle(fx + 2, fy, 1.5);   // centre
    });

    g.generateTexture('ground', W, GROUND_TILE_H);
    g.destroy();
}
