import { CONFETTI_COLORS_PHASER, DESIGN_TOKENS, hexVersPhaser } from '../../designTokens.js';
import { sceneTween } from '../../motion.js';
import { Utils } from '../../utils.js';
import { DEPTH } from '../shared/uiLayout.js';

const LISERÉ_PHASER = hexVersPhaser(DESIGN_TOKENS.liseréGameOver);

/** Assombrit une couleur hex d'un facteur (0-1). */
export function shade(color, factor) {
    const r = Math.floor(((color >> 16) & 0xff) * factor);
    const g = Math.floor(((color >> 8) & 0xff) * factor);
    const b = Math.floor((color & 0xff) * factor);
    return (r << 16) | (g << 8) | b;
}

/** Fine ligne de séparation entre deux blocs du panneau. */
export function drawDivider(scene, cx, y, width, depth) {
    const line = scene.add.rectangle(cx, y, width, 1, LISERÉ_PHASER, 0.18);
    line.setDepth(depth);
    return line;
}

/** Pluie de confettis courte (nouveau record uniquement). */
export function spawnConfetti(scene, cx, topY, elements) {
    for (let i = 0; i < 12; i++) {
        const startX = cx + Utils.randomInt(-95, 95);
        const size = Utils.randomInt(3, 6);
        const color = CONFETTI_COLORS_PHASER[i % CONFETTI_COLORS_PHASER.length];
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
