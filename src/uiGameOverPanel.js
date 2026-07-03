import { drawPlaqueCorners } from './uiGameOverDecor.js';
import { DEPTH, GAME_OVER_PANEL } from './uiLayout.js';

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
    panel.fillStyle(0x141e30, 0.92);
    panel.fillRoundedRect(P.x, P.y, P.w, P.h, P.radius);
    panel.lineStyle(2, 0xffd700, 1);
    panel.strokeRoundedRect(P.x, P.y, P.w, P.h, P.radius);
    panel.lineStyle(1, 0xffd700, 0.25);
    panel.strokeRoundedRect(P.x + 5, P.y + 5, P.w - 10, P.h - 10, Math.max(P.radius - 4, 2));
    drawPlaqueCorners(panel, P);

    return { overlay, panel, cx, y, P };
}
