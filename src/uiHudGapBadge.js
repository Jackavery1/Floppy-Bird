import { GAME_CONFIG, getDifficultyForRound } from './config.js';
import { effectivePipeGapForScore } from './gapDifficulty.js';
import { DESIGN_TOKENS, hudTextStyle } from './designTokens.js';
import { layoutHudSecondaryBadges } from './uiHudBadgeLayout.js';
import { addCenteredText, DEPTH, FONT_SIZE_BADGE } from './uiLayout.js';

/** @param {import('./ui.js').UI} ui @param {number} score */
export function updateGapHudBadge(ui, score) {
    const seuil = GAME_CONFIG.round.gapTightenAfterScore;
    const previewAt = seuil - GAME_CONFIG.round.difficultyPreviewOffset;
    if (score < previewAt) {
        if (ui._gapHudBadge) ui._gapHudBadge.setVisible(false);
        return;
    }

    const scene = ui.scene;
    const baseGap = getDifficultyForRound(scene.difficulty, scene.hardcoreMode).gap;
    const gapPx =
        score >= seuil
            ? effectivePipeGapForScore(baseGap, score)
            : effectivePipeGapForScore(baseGap, seuil);
    const label = score >= seuil ? `ÉCART ${gapPx}px` : `ÉCART ↓ ${gapPx}px au score ${seuil}`;

    if (!ui._gapHudBadge) {
        ui._gapHudBadge = addCenteredText(
            ui.scene,
            GAME_CONFIG.centerX,
            0,
            '',
            hudTextStyle({
                fontSize: FONT_SIZE_BADGE,
                fill: DESIGN_TOKENS.accentGap,
                fontStyle: 'bold',
            }),
            DEPTH.HUD_BADGE
        );
        ui._inGameControlElements?.push(ui._gapHudBadge);
    }

    ui._gapHudBadge.setText(label);
    ui._gapHudBadge.setVisible(true);
    layoutHudSecondaryBadges(ui);
}

/** @param {import('./ui.js').UI} ui */
export function destroyGapHudBadge(ui) {
    ui._gapHudBadge?.destroy();
    ui._gapHudBadge = null;
}
