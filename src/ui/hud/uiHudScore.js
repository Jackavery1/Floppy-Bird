import { GAME_CONFIG } from '../../config.js';
import { formatDailyHudLabel } from '../../dailyChallenge.js';
import { getSkin } from '../../skins/index.js';
import { DESIGN_TOKENS } from '../../designTokens.js';
import { getBackgroundPeriod } from '../../backgroundPeriod.js';
import { sceneTween } from '../../motion.js';
import {
    addReliefText,
    DEPTH,
    FONT_SIZE_SCORE,
    FONT_TITLE,
    UI_LAYOUT,
} from '../shared/uiLayout.js';

const SCORE_RELIEF = Object.freeze({
    dx: 3,
    dy: 4,
    fill: DESIGN_TOKENS.accentTitreOmbre,
    alpha: 0.65,
});

/** Style score HUD — jaune nuit / ambre jour + contour renforcé de jour. */
function scoreHudStyle() {
    const day = getBackgroundPeriod() === 'day';
    return {
        fontFamily: FONT_TITLE,
        fontSize: FONT_SIZE_SCORE,
        fill: day ? DESIGN_TOKENS.accentTitreJour : DESIGN_TOKENS.accentTitre,
        fontStyle: 'normal',
        stroke: day ? DESIGN_TOKENS.contourHud : DESIGN_TOKENS.accentTitreContour,
        strokeThickness: day ? 6 : 4,
    };
}

function destroyScoreHud(ui) {
    ui.scoreText?.destroy();
    ui.scoreText = null;
    ui._scoreTextShadow?.destroy();
    ui._scoreTextShadow = null;
}

function syncScoreHudVisibility(ui, visible) {
    ui.scoreText?.setVisible?.(visible);
    ui._scoreTextShadow?.setVisible?.(visible);
}

function syncScoreHudTransform(ui, { y, scale = 1, depth = DEPTH.SCORE_HUD } = {}) {
    if (ui.scoreText) {
        if (y != null) ui.scoreText.setY(y);
        ui.scoreText.setAlpha?.(1);
        ui.scoreText.setScale?.(scale);
        ui.scoreText.setDepth?.(depth);
    }
    if (ui._scoreTextShadow) {
        if (y != null) ui._scoreTextShadow.setY(y + SCORE_RELIEF.dy);
        ui._scoreTextShadow.setAlpha?.(SCORE_RELIEF.alpha);
        ui._scoreTextShadow.setScale?.(scale);
        ui._scoreTextShadow.setDepth?.(depth - 1);
    }
}

export function createScoreDisplay(ui) {
    destroyScoreHud(ui);
    if (ui._recordBanner) {
        ui._recordBanner.destroy();
        ui._recordBanner = null;
    }
    if (ui._dailyGoalBanner) {
        ui._dailyGoalBanner.destroy();
        ui._dailyGoalBanner = null;
    }
    ui.scoreValue = 0;
    const { shadow, label } = addReliefText(
        ui.scene,
        GAME_CONFIG.centerX,
        UI_LAYOUT.scoreHud,
        '0',
        scoreHudStyle(),
        DEPTH.SCORE_HUD,
        SCORE_RELIEF
    );
    ui.scoreText = label;
    ui._scoreTextShadow = shadow;
    showInGameScore(ui, UI_LAYOUT.scoreHud);
}

/** @param {import('../core/ui.js').UI} ui @param {number} scoreY */
export function showInGameScore(ui, scoreY = UI_LAYOUT.scoreHud) {
    if (!ui.scoreText) return;
    syncScoreHudVisibility(ui, true);
    syncScoreHudTransform(ui, { y: scoreY, scale: 1 });
}

export function updateScore(ui, newScore) {
    ui.scoreValue = newScore;
    const text = String(ui.scoreValue);
    if (ui.scoreText) {
        ui.scoreText.setText(text);
        ui._scoreTextShadow?.setText?.(text);
        const targets = [ui.scoreText, ui._scoreTextShadow].filter(Boolean);
        sceneTween(ui.scene, {
            targets,
            scaleX: 1.35,
            scaleY: 1.35,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeOut',
        });
    }
    if (ui._dailyBadge && ui.scene?.dailyGoal > 0) {
        ui._dailyBadge.setText(
            `${formatDailyHudLabel(newScore, ui.scene.dailyGoal)} · ${getSkin(ui.scene.activeSkinId ?? 'classic').label}`
        );
    }
}
