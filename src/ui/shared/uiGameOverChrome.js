import { DESIGN_TOKENS, hexVersPhaser } from '../../designTokens.js';

const LISERÉ_PHASER = hexVersPhaser(DESIGN_TOKENS.liseréGameOver);

/**
 * Cadre panneau game over (skeleton HUD + panneau réel).
 * @param {import('phaser').GameObjects.Graphics} graphics
 * @param {{ x: number, y: number, w: number, h: number, radius: number }} P
 * @param {{ fillAlpha?: number, strokeAlpha?: number, innerStrokeAlpha?: number }} [opts]
 */
export function drawGameOverPanelFrame(graphics, P, opts = {}) {
    const { fillAlpha = 0.92, strokeAlpha = 1, innerStrokeAlpha = 0.25 } = opts;
    const fond = hexVersPhaser(DESIGN_TOKENS.fondPanneauGameOver);
    const liseré = hexVersPhaser(DESIGN_TOKENS.liseréGameOver);
    graphics.fillStyle(fond, fillAlpha);
    graphics.fillRoundedRect(P.x, P.y, P.w, P.h, P.radius);
    graphics.lineStyle(2, liseré, strokeAlpha);
    graphics.strokeRoundedRect(P.x, P.y, P.w, P.h, P.radius);
    if (innerStrokeAlpha > 0) {
        graphics.lineStyle(1, liseré, innerStrokeAlpha);
        graphics.strokeRoundedRect(P.x + 5, P.y + 5, P.w - 10, P.h - 10, Math.max(P.radius - 4, 2));
    }
}

/** Petits liserés dorés dans les coins du panneau, façon plaque de trophée. */
export function drawPlaqueCorners(g, P) {
    const inset = 7;
    const len = 10;
    const t = 2;
    g.fillStyle(LISERÉ_PHASER, 0.55);
    const corners = [
        [P.x + inset, P.y + inset, len, t],
        [P.x + inset, P.y + inset, t, len],
        [P.x + P.w - inset - len, P.y + inset, len, t],
        [P.x + P.w - inset - t, P.y + inset, t, len],
        [P.x + inset, P.y + P.h - inset - t, len, t],
        [P.x + inset, P.y + P.h - inset - len, t, len],
        [P.x + P.w - inset - len, P.y + P.h - inset - t, len, t],
        [P.x + P.w - inset - t, P.y + P.h - inset - len, t, len],
    ];
    corners.forEach(([x, y, w, h]) => g.fillRect(x, y, w, h));
}
