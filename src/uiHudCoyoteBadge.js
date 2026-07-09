import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hudTextStyle } from './designTokens.js';
import { layoutHudSecondaryBadges } from './uiHudBadgeLayout.js';
import { addCenteredText, DEPTH, FONT_SIZE_BADGE } from './uiLayout.js';

/** @param {import('./ui.js').UI} ui @param {boolean} active */
export function updateCoyoteHudBadge(ui, active) {
    if (!active) {
        if (ui._coyoteHudBadge) ui._coyoteHudBadge.setVisible(false);
        return;
    }

    if (!ui._coyoteHudBadge) {
        ui._coyoteHudBadge = addCenteredText(
            ui.scene,
            GAME_CONFIG.centerX,
            0,
            'GRÂCE',
            hudTextStyle({
                fontSize: FONT_SIZE_BADGE,
                fill: DESIGN_TOKENS.bannerCoyote,
                fontStyle: 'bold',
            }),
            DEPTH.HUD_BADGE
        );
        ui._inGameControlElements?.push(ui._coyoteHudBadge);
    }

    ui._coyoteHudBadge.setVisible(true);
    layoutHudSecondaryBadges(ui);
}

/** @param {import('./ui.js').UI} ui */
export function destroyCoyoteHudBadge(ui) {
    ui._coyoteHudBadge?.destroy();
    ui._coyoteHudBadge = null;
}
