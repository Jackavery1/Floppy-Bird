import { GAME_CONFIG } from './config.js';
import {
    jumpTutorialText,
    gapTutorialText,
    scoreTutorialText,
    hardcoreTutorialText,
} from './device.js';
import { sceneTween } from './motion.js';
import { addCenteredText, DEPTH } from './uiLayout.js';

function showPulsingTutorialHint(ui, text) {
    dismissGameplayTutorial(ui);
    ui._tutorialHint = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        GAME_CONFIG.centerY - 30,
        text,
        {
            fontSize: '14px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
        },
        DEPTH.HUD_TUTORIAL
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

export function showJumpTutorial(ui) {
    showPulsingTutorialHint(ui, jumpTutorialText());
}

export function showGapTutorial(ui) {
    showPulsingTutorialHint(ui, gapTutorialText());
}

export function showScoreTutorial(ui) {
    showPulsingTutorialHint(ui, scoreTutorialText());
}

export function showHardcoreTutorial(ui) {
    ui._hardcoreTutorialActive = true;
    showPulsingTutorialHint(ui, hardcoreTutorialText());
}

export function dismissHardcoreTutorial(ui) {
    if (!ui._hardcoreTutorialActive) return false;
    ui._hardcoreTutorialActive = false;
    return dismissGameplayTutorial(ui);
}

export function dismissGameplayTutorial(ui) {
    return dismissJumpTutorial(ui);
}

export function dismissJumpTutorial(ui) {
    if (!ui._tutorialHint) return false;
    ui._tutorialHint.destroy();
    ui._tutorialHint = null;
    return true;
}
