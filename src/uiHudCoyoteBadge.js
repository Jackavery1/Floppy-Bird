import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS } from './designTokens.js';
import { addCenteredText, DEPTH, FONT_SIZE_BADGE } from './uiLayout.js';

/** @param {import('./ui.js').UI} ui @param {boolean} active */
export function updateCoyoteHudBadge(ui, active) {
    if (!active) {
        if (ui._coyoteHudBadge) ui._coyoteHudBadge.setVisible(false);
        return;
    }

    const y = (ui.scoreText?.y ?? ui._scoreHudY ?? 68) + 28;

    if (!ui._coyoteHudBadge) {
        ui._coyoteHudBadge = addCenteredText(
            ui.scene,
            GAME_CONFIG.centerX,
            y,
            'GRÂCE',
            {
                fontSize: FONT_SIZE_BADGE,
                fill: DESIGN_TOKENS.bannerCoyote,
                fontStyle: 'bold',
                stroke: DESIGN_TOKENS.contourHud,
                strokeThickness: 2,
            },
            DEPTH.HUD_BADGE
        );
        ui._inGameControlElements?.push(ui._coyoteHudBadge);
    }

    ui._coyoteHudBadge.setY(y);
    ui._coyoteHudBadge.setVisible(true);
}

/** @param {import('./ui.js').UI} ui */
export function destroyCoyoteHudBadge(ui) {
    ui._coyoteHudBadge?.destroy();
    ui._coyoteHudBadge = null;
}
