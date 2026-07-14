import { drawPlaqueCorners } from './uiGameOverDecor.js';
import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';
import { DEPTH, GAME_OVER_PANEL } from './uiLayout.js';

/**
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
        graphics.strokeRoundedRect(
            P.x + 5,
            P.y + 5,
            P.w - 10,
            P.h - 10,
            Math.max(P.radius - 4, 2)
        );
    }
}

/**
 * Panneau doré et overlay du game over.
 * @param {import('phaser').Scene} scene
 * @param {import('./ui.js').UI} ui
 * @param {typeof GAME_OVER_PANEL} [P]
 */
export function buildGameOverShell(scene, ui, P = GAME_OVER_PANEL) {
    const cx = P.x + P.w / 2;
    const y = (offset) => P.y + offset;
    const overlay = ui.createOverlay(0.75, DEPTH.OVERLAY_DIM);

    const panel = scene.add.graphics().setDepth(DEPTH.MENU_PANEL);
    drawGameOverPanelFrame(panel, P);
    drawPlaqueCorners(panel, P);

    return { overlay, panel, cx, y, P };
}
