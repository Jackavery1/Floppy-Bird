import { GAME_CONFIG, getDifficultyForRound } from './config.js';
import { effectivePipeGapForScore } from './gapDifficulty.js';
import { DESIGN_TOKENS } from './designTokens.js';
import { layoutHudSecondaryBadges } from './uiHudBadgeLayout.js';
import { addCenteredText, DEPTH, FONT_SIZE_BADGE } from './uiLayout.js';

/** @param {import('./ui.js').UI} ui @param {number} score */
export function updateGapHudBadge(ui, score) {
    const seuil = GAME_CONFIG.round.gapTightenAfterScore;
    if (score < seuil) {
        if (ui._gapHudBadge) ui._gapHudBadge.setVisible(false);
        return;
    }

    const scene = ui.scene;
    const baseGap = getDifficultyForRound(scene.difficulty, scene.hardcoreMode).gap;
    const gapPx = effectivePipeGapForScore(baseGap, score);

    if (!ui._gapHudBadge) {
        ui._gapHudBadge = addCenteredText(
            ui.scene,
            GAME_CONFIG.centerX,
            0,
            '',
            {
                fontSize: FONT_SIZE_BADGE,
                fill: DESIGN_TOKENS.accentGap,
                fontStyle: 'bold',
                stroke: DESIGN_TOKENS.contourHud,
                strokeThickness: 2,
            },
            DEPTH.HUD_BADGE
        );
        ui._inGameControlElements?.push(ui._gapHudBadge);
    }

    ui._gapHudBadge.setText(`ÉCART ${gapPx}px`);
    ui._gapHudBadge.setVisible(true);
    layoutHudSecondaryBadges(ui);
}

/** @param {import('./ui.js').UI} ui */
export function destroyGapHudBadge(ui) {
    ui._gapHudBadge?.destroy();
    ui._gapHudBadge = null;
}
