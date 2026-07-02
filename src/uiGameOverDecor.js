import { sceneTween } from './motion.js';
import { Utils } from './utils.js';
import { DEPTH } from './uiLayout.js';

const CONFETTI_COLORS = [0xFFD700, 0xFF6F91, 0x64B5F6, 0x81C784, 0xFFFFFF];

/** Assombrit une couleur hex d'un facteur (0-1). */
export function shade(color, factor) {
    const r = Math.floor(((color >> 16) & 0xFF) * factor);
    const g = Math.floor(((color >> 8) & 0xFF) * factor);
    const b = Math.floor((color & 0xFF) * factor);
    return (r << 16) | (g << 8) | b;
}

/** Petits liserés dorés dans les coins du panneau, façon plaque de trophée. */
export function drawPlaqueCorners(g, P) {
    const inset = 7;
    const len = 10;
    const t = 2;
    g.fillStyle(0xFFD700, 0.55);
    const corners = [
        [P.x + inset, P.y + inset, len, t], [P.x + inset, P.y + inset, t, len],
        [P.x + P.w - inset - len, P.y + inset, len, t], [P.x + P.w - inset - t, P.y + inset, t, len],
        [P.x + inset, P.y + P.h - inset - t, len, t], [P.x + inset, P.y + P.h - inset - len, t, len],
        [P.x + P.w - inset - len, P.y + P.h - inset - t, len, t], [P.x + P.w - inset - t, P.y + P.h - inset - len, t, len],
    ];
    corners.forEach(([x, y, w, h]) => g.fillRect(x, y, w, h));
}

/** Fine ligne de séparation entre deux blocs du panneau. */
export function drawDivider(scene, cx, y, width, depth) {
    const line = scene.add.rectangle(cx, y, width, 1, 0xFFD700, 0.18);
    line.setDepth(depth);
    return line;
}

/** Pluie de confettis courte (nouveau record uniquement). */
export function spawnConfetti(scene, cx, topY, elements) {
    for (let i = 0; i < 12; i++) {
        const startX = cx + Utils.randomInt(-95, 95);
        const size = Utils.randomInt(3, 6);
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const piece = scene.add.rectangle(startX, topY, size, size, color, 0.95);
        piece.setDepth(DEPTH.PANEL_TOP);
        elements.push(piece);
        sceneTween(scene, {
            targets: piece,
            y: topY + Utils.randomInt(170, 250),
            x: startX + Utils.randomInt(-30, 30),
            angle: Utils.randomInt(-180, 180),
            alpha: 0,
            duration: Utils.randomInt(900, 1400),
            delay: Utils.randomInt(0, 220),
            ease: 'Cubic.easeIn',
        });
    }
}
