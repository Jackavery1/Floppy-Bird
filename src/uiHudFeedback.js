import { GAME_CONFIG } from './config.js';
import { jumpTutorialText } from './device.js';
import { sceneTween } from './motion.js';
import { addCenteredText, DEPTH } from './uiLayout.js';

function showTransientBanner(ui, key, text, y, style, fadeY = y - 18) {
    if (ui[key]) return;
    const banner = addCenteredText(ui.scene, GAME_CONFIG.centerX, y, text, style, DEPTH.RECORD_BANNER);
    ui[key] = banner;
    sceneTween(ui.scene, {
        targets: banner,
        scaleX: { from: 0.85, to: 1.05 },
        scaleY: { from: 0.85, to: 1.05 },
        duration: 180,
        yoyo: true,
        repeat: 1,
        ease: 'Back.easeOut',
    });
    sceneTween(ui.scene, {
        targets: banner,
        alpha: { from: 1, to: 0 },
        y: fadeY,
        duration: 1200,
        delay: 500,
        ease: 'Power2',
        onComplete: () => {
            banner.destroy();
            if (ui[key] === banner) ui[key] = null;
        },
    });
}

export function showRecordBroken(ui) {
    showTransientBanner(ui, '_recordBanner', 'NOUVEAU RECORD !', 90, {
        fontSize: '16px',
        fill: '#FDD835',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
    }, 72);
}

export function showDifficultyEscalation(ui) {
    showTransientBanner(ui, '_escalationBanner', 'DIFFICULTÉ ↑', 104, {
        fontSize: '13px',
        fill: '#FF8A65',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
    });
}

export function showScoreStreak(ui, score) {
    const label = score >= 15 ? 'EN FEU !' : `SÉRIE ×${score}`;
    showTransientBanner(ui, '_streakBanner', label, 112, {
        fontSize: '14px',
        fill: '#FFAB40',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
    });
}

export function showDailyGoalReached(ui) {
    if (ui._dailyGoalBanner) return;
    const banner = addCenteredText(ui.scene, GAME_CONFIG.centerX, 118, 'OBJECTIF ATTEINT !', {
        fontSize: '15px',
        fill: '#81C784',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
    }, DEPTH.RECORD_BANNER);
    ui._dailyGoalBanner = banner;
    sceneTween(ui.scene, {
        targets: banner,
        scaleX: { from: 0.85, to: 1.05 },
        scaleY: { from: 0.85, to: 1.05 },
        duration: 180,
        yoyo: true,
        repeat: 1,
        ease: 'Back.easeOut',
    });
    sceneTween(ui.scene, {
        targets: banner,
        alpha: { from: 1, to: 0 },
        y: 100,
        duration: 1200,
        delay: 700,
        ease: 'Power2',
        onComplete: () => {
            banner.destroy();
            if (ui._dailyGoalBanner === banner) ui._dailyGoalBanner = null;
        },
    });
    showFlash(ui);
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
        }, DEPTH.HUD_TUTORIAL,
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
    flash.setDepth(DEPTH.FLASH);
    sceneTween(ui.scene, {
        targets: flash,
        alpha: { from: 0.8, to: 0 },
        duration: 166,
        ease: 'Power1',
        onComplete: () => flash.destroy(),
    });
}
