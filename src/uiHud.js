import { GAME_CONFIG } from './config.js';
import { jumpTutorialText } from './device.js';
import { formatDailyHudLabel } from './dailyChallenge.js';
import { getSkinPattern } from './skinPatterns.js';
import { getSkin } from './skins.js';
import { sceneTween } from './motion.js';
import {
    addCenteredText,
    addReliefText,
    MIN_TOUCH,
    PAUSE_BTN_COLOR,
    PAUSE_BTN_HOVER,
    PAUSE_BTN_VISUAL,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';

export function createScoreDisplay(ui) {
    if (ui.scoreText) ui.scoreText.destroy();
    if (ui._scoreShadow) ui._scoreShadow.destroy();
    ui.scoreValue = 0;

    const scoreStyle = {
        fontSize: '40px',
        fill: '#ffffff',
        fontStyle: 'bold',
        stroke: '#263238',
        strokeThickness: 5,
    };
    const { shadow, label } = addReliefText(
        ui.scene,
        GAME_CONFIG.centerX,
        UI_LAYOUT.scoreHud,
        '0',
        scoreStyle,
        100,
        { dx: 2, dy: 3, fill: '#000000', alpha: 0.45 },
    );
    ui._scoreShadow = shadow;
    ui.scoreText = label;
}

export function hideInGameScore(ui) {
    if (ui.scoreText) {
        ui.scoreText.setVisible(false);
    }
    if (ui._scoreShadow) {
        ui._scoreShadow.setVisible(false);
    }
    destroyInGameControls(ui);
}

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
            }, 99,
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
            }, 99,
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
            }, 99,
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
            }, 99,
        );
        elements.push(ui._hardcoreBadge);
        badgeY += 14;
    }

    const scoreY = badgeY > playing.trainingBadgeY
        ? badgeY + 10
        : UI_LAYOUT.scoreHud;
    if (ui.scoreText) {
        ui.scoreText.setY(scoreY);
        ui._scoreShadow?.setY(scoreY);
    }

    ui._pauseBtnGraphics = ui.scene.add.graphics().setDepth(102);
    elements.push(ui._pauseBtnGraphics);
    drawPauseButton(ui, PAUSE_BTN_COLOR);

    const pauseHit = ui.scene.add.rectangle(
        playing.pauseBtnX, playing.pauseBtnY, MIN_TOUCH, MIN_TOUCH, 0x000000, 0,
    );
    pauseHit.setDepth(103);
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

export function updateScore(ui, newScore) {
    ui.scoreValue = newScore;
    const text = String(ui.scoreValue);
    if (ui.scoreText) {
        ui.scoreText.setText(text);
        ui._scoreShadow?.setText(text);
        const targets = [ui.scoreText, ui._scoreShadow].filter(Boolean);
        sceneTween(ui.scene, {
            targets,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeOut',
        });
    }
    if (ui._dailyBadge && ui.scene?.dailyGoal > 0) {
        ui._dailyBadge.setText(
            `${formatDailyHudLabel(newScore, ui.scene.dailyGoal)} · ${getSkin(ui.scene.activeSkinId ?? 'classic').label}`,
        );
    }
}

export function showRecordBroken(ui) {
    const banner = addCenteredText(ui.scene, GAME_CONFIG.centerX, 90, 'NOUVEAU RECORD !', {
        fontSize: '16px',
        fill: '#FDD835',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
    }, 101);
    sceneTween(ui.scene, {
        targets: banner,
        scaleX: { from: 0.8, to: 1.1 },
        scaleY: { from: 0.8, to: 1.1 },
        duration: 200,
        yoyo: true,
        repeat: 1,
        ease: 'Back.easeOut',
    });
    sceneTween(ui.scene, {
        targets: banner,
        alpha: { from: 1, to: 0 },
        y: 72,
        duration: 1400,
        delay: 600,
        ease: 'Power2',
        onComplete: () => banner.destroy(),
    });
}

export function showJumpTutorial(ui) {
    dismissJumpTutorial(ui);
    ui._tutorialHint = addCenteredText(
        ui.scene, GAME_CONFIG.centerX, GAME_CONFIG.centerY - 30,
        jumpTutorialText(), {
            fontSize: '14px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
        }, 98,
    );
    sceneTween(ui.scene, {
        targets: ui._tutorialHint,
        alpha: { from: 1, to: 0.45 },
        duration: 600,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
    });
}

export function dismissJumpTutorial(ui) {
    if (!ui._tutorialHint) return false;
    ui._tutorialHint.destroy();
    ui._tutorialHint = null;
    return true;
}

export function showFlash(ui) {
    const flash = ui.scene.add.rectangle(
        GAME_CONFIG.centerX, GAME_CONFIG.centerY,
        GAME_CONFIG.width, GAME_CONFIG.height, 0xffffff, 0.8,
    );
    flash.setDepth(200);
    sceneTween(ui.scene, {
        targets: flash,
        alpha: { from: 0.8, to: 0 },
        duration: 166,
        ease: 'Power1',
        onComplete: () => flash.destroy(),
    });
}
