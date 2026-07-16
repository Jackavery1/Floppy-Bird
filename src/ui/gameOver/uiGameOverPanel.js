import { drawGameOverPanelFrame, drawPlaqueCorners } from '../shared/uiGameOverChrome.js';
import { DEPTH, GAME_OVER_PANEL } from '../shared/uiLayout.js';

/**
 * Panneau doré et overlay du game over.
 * @param {import('phaser').Scene} scene
 * @param {import('../core/ui.js').UI} ui
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
