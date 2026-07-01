import { GAME_CONFIG } from './config.js';
import { jumpTutorialText } from './device.js';
import { sceneTween } from './motion.js';
import {
    addCenteredText,
    MIN_TOUCH,
    PAUSE_BTN_COLOR,
    PAUSE_BTN_HOVER,
    PAUSE_BTN_VISUAL,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';

export function createScoreDisplay(ui) {
    if (ui.scoreText) ui.scoreText.destroy();
    ui.scoreValue = 0;
    ui.scoreText = addCenteredText(ui.scene, GAME_CONFIG.centerX, UI_LAYOUT.scoreHud, '0', {
        fontSize: '40px',
        fill: '#ffffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 3,
    }, 100);
}

export function hideInGameScore(ui) {
    if (ui.scoreText) {
        ui.scoreText.setVisible(false);
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

export function createInGameControls(ui, { trainingMode, hardcoreMode, onPause }) {
    destroyInGameControls(ui);
    const elements = [];
    const { playing } = UI_LAYOUT;

    if (trainingMode) {
        ui._trainingBadge = addCenteredText(
            ui.scene, GAME_CONFIG.centerX, playing.trainingBadgeY,
            'ENTRAÎNEMENT', {
                fontSize: '10px',
                fill: '#81D4FA',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2,
            }, 99,
        );
        elements.push(ui._trainingBadge);
    }

    if (hardcoreMode) {
        ui._hardcoreBadge = addCenteredText(
            ui.scene, GAME_CONFIG.centerX, playing.hardcoreBadgeY,
            'HARDCORE', {
                fontSize: '10px',
                fill: '#FF8A80',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2,
            }, 99,
        );
        elements.push(ui._hardcoreBadge);
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
    if (ui.scoreText) {
        ui.scoreText.setText(String(ui.scoreValue));
        sceneTween(ui.scene, {
            targets: ui.scoreText,
            scaleX: 1.4,
            scaleY: 1.4,
            duration: 100,
            yoyo: true,
            ease: 'Quad.easeOut',
        });
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
