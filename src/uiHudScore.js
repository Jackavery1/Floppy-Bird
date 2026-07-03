import { GAME_CONFIG } from './config.js';
import { formatDailyHudLabel } from './dailyChallenge.js';
import { getSkin } from './skins/index.js';
import { sceneTween } from './motion.js';
import { addCenteredText, DEPTH, UI_LAYOUT } from './uiLayout.js';

const SCORE_STYLE = Object.freeze({
    fontSize: '40px',
    fill: '#ffffff',
    fontStyle: 'bold',
    stroke: '#000000',
    strokeThickness: 4,
});

export function createScoreDisplay(ui) {
    if (ui.scoreText) ui.scoreText.destroy();
    if (ui._scoreShadow) {
        ui._scoreShadow.destroy();
        ui._scoreShadow = null;
    }
    if (ui._recordBanner) {
        ui._recordBanner.destroy();
        ui._recordBanner = null;
    }
    if (ui._dailyGoalBanner) {
        ui._dailyGoalBanner.destroy();
        ui._dailyGoalBanner = null;
    }
    ui.scoreValue = 0;
    ui.scoreText = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        UI_LAYOUT.scoreHud,
        '0',
        SCORE_STYLE,
        DEPTH.SCORE_HUD
    );
    showInGameScore(ui, UI_LAYOUT.scoreHud);
}

/** @param {import('./ui.js').UI} ui @param {number} scoreY */
export function showInGameScore(ui, scoreY = UI_LAYOUT.scoreHud) {
    if (!ui.scoreText) return;
    ui.scoreText.setVisible(true);
    ui.scoreText.setAlpha(1);
    ui.scoreText.setScale?.(1);
    ui.scoreText.setY(scoreY);
    ui.scoreText.setDepth?.(DEPTH.SCORE_HUD);
}

export function updateScore(ui, newScore) {
    ui.scoreValue = newScore;
    const text = String(ui.scoreValue);
    if (ui.scoreText) {
        ui.scoreText.setText(text);
        sceneTween(ui.scene, {
            targets: ui.scoreText,
            scaleX: 1.4,
            scaleY: 1.4,
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
