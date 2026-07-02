import { GAME_CONFIG } from './config.js';
import { formatDailyHudLabel } from './dailyChallenge.js';
import { getSkinPattern } from './skinPatterns.js';
import { getSkin } from './skins/index.js';
import {
    addCenteredText,
    DEPTH,
    MIN_TOUCH,
    PAUSE_BTN_COLOR,
    PAUSE_BTN_HOVER,
    PAUSE_BTN_VISUAL,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';
import { dismissJumpTutorial } from './uiHudFeedback.js';
import { showInGameScore } from './uiHudScore.js';

export function destroyInGameControls(ui) {
    ui._inGameControlElements.forEach(e => e?.destroy());
    ui._inGameControlElements = [];
    ui._pauseBtnGraphics = null;
    ui._trainingBadge = null;
    ui._hardcoreBadge = null;
    dismissJumpTutorial(ui);
}

export function createInGameControls(ui, { trainingMode, hardcoreMode, dailyMode, dailyGoal, activeSkinId, onPause }) {
    destroyInGameControls(ui);
    const elements = [];
    const { playing } = UI_LAYOUT;
    let badgeY = playing.trainingBadgeY;

    if (dailyMode && dailyGoal > 0) {
        const skinLabel = activeSkinId ? getSkin(activeSkinId).label : '';
        const pattern = activeSkinId ? getSkinPattern(activeSkinId).tagline : '';
        ui._dailyBadge = addCenteredText(
            ui.scene, GAME_CONFIG.centerX, badgeY,
            `${formatDailyHudLabel(ui.scoreValue ?? 0, dailyGoal)} · ${skinLabel}`, {
                fontSize: '10px',
                fill: '#CE93D8',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2,
            }, DEPTH.HUD_BADGE,
        );
        elements.push(ui._dailyBadge);
        badgeY += 14;
        ui._dailyPatternBadge = addCenteredText(
            ui.scene, GAME_CONFIG.centerX, badgeY,
            pattern, {
                fontSize: '9px',
                fill: '#B39DDB',
                stroke: '#000000',
                strokeThickness: 2,
            }, DEPTH.HUD_BADGE,
        );
        elements.push(ui._dailyPatternBadge);
        badgeY += 14;
    }

    if (trainingMode) {
        ui._trainingBadge = addCenteredText(
            ui.scene, GAME_CONFIG.centerX, badgeY,
            'ENTRAÎNEMENT', {
                fontSize: '10px',
                fill: '#81D4FA',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2,
            }, DEPTH.HUD_BADGE,
        );
        elements.push(ui._trainingBadge);
        badgeY += 14;
    }

    if (hardcoreMode) {
        ui._hardcoreBadge = addCenteredText(
            ui.scene, GAME_CONFIG.centerX, badgeY,
            'HARDCORE', {
                fontSize: '10px',
                fill: '#FF8A80',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2,
            }, DEPTH.HUD_BADGE,
        );
        elements.push(ui._hardcoreBadge);
        badgeY += 14;
    }

    const scoreY = badgeY > playing.trainingBadgeY
        ? badgeY + 10
        : UI_LAYOUT.scoreHud;
    showInGameScore(ui, scoreY);

    ui._pauseBtnGraphics = ui.scene.add.graphics().setDepth(DEPTH.PAUSE_ICON);
    elements.push(ui._pauseBtnGraphics);
    drawPauseButton(ui, PAUSE_BTN_COLOR);

    const pauseHit = ui.scene.add.rectangle(
        playing.pauseBtnX, playing.pauseBtnY, MIN_TOUCH, MIN_TOUCH, 0x000000, 0,
    );
    pauseHit.setDepth(DEPTH.PAUSE_ICON_HIT);
    pauseHit.setInteractive({ useHandCursor: true });
    pauseHit.on('pointerover', () => drawPauseButton(ui, PAUSE_BTN_HOVER));
    pauseHit.on('pointerout', () => drawPauseButton(ui, PAUSE_BTN_COLOR));
    pauseHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        onPause();
    });
    elements.push(pauseHit);

    ui._inGameControlElements = elements;
    return elements;
}

function drawPauseButton(ui, fillColor) {
    if (!ui._pauseBtnGraphics) return;
    const { playing } = UI_LAYOUT;
    const g = ui._pauseBtnGraphics;
    const size = PAUSE_BTN_VISUAL;
    g.clear();
    g.fillStyle(fillColor, 1);
    g.fillRoundedRect(playing.pauseBtnX - size / 2, playing.pauseBtnY - size / 2, size, size, 5);
    g.fillStyle(0xffffff, 1);
    const barW = 6;
    const barH = 20;
    const gap = 6;
    g.fillRect(playing.pauseBtnX - gap / 2 - barW, playing.pauseBtnY - barH / 2, barW, barH);
    g.fillRect(playing.pauseBtnX + gap / 2, playing.pauseBtnY - barH / 2, barW, barH);
}
