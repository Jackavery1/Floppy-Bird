import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hudTextStyle } from './designTokens.js';
import {
    jumpTutorialText,
    gapTutorialText,
    scoreTutorialText,
    hardcoreTutorialText,
    trainingTutorialText,
    skipTutorialHint,
} from './device.js';
import { skipTutorialIfActive } from './tutorialProgress.js';
import { loadTutorialComplete } from './tutorialStorage.js';
import { sceneTween } from './motion.js';
import { addCenteredText, DEPTH, FONT_SIZE_HINT, MIN_TOUCH, stopUiEvent } from './uiLayout.js';

function dismissSkipTutorialControl(ui) {
    ui._tutorialSkipLabel?.destroy();
    ui._tutorialSkipLabel = null;
    ui._tutorialSkipHit?.destroy();
    ui._tutorialSkipHit = null;
}

function addSkipTutorialControl(ui) {
    if (loadTutorialComplete()) return;
    dismissSkipTutorialControl(ui);
    const skipY = GAME_CONFIG.centerY + 24;
    const skipHint = skipTutorialHint();
    ui._tutorialSkipLabel = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        skipY,
        skipHint,
        hudTextStyle({
            fontSize: FONT_SIZE_HINT,
            fill: DESIGN_TOKENS.texteHintMenu,
            fontStyle: 'italic',
        }),
        DEPTH.HUD_TUTORIAL
    );
    ui._tutorialSkipHit = ui.scene.add.rectangle(
        GAME_CONFIG.centerX,
        skipY,
        120,
        MIN_TOUCH,
        0x000000,
        0
    );
    ui._tutorialSkipHit.setDepth(DEPTH.HUD_TUTORIAL + 1);
    ui._tutorialSkipHit.setInteractive({ useHandCursor: true });
    ui._tutorialSkipHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        skipTutorialIfActive(ui.scene);
    });
}

function showPulsingTutorialHint(ui, text, { skippable = false } = {}) {
    dismissGameplayTutorial(ui);
    ui._tutorialHint = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        GAME_CONFIG.centerY - 30,
        text,
        hudTextStyle({
            fontSize: '14px',
            fill: DESIGN_TOKENS.texteHud,
            fontStyle: 'bold',
        }),
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
    if (skippable) addSkipTutorialControl(ui);
}

export function showJumpTutorial(ui) {
    showPulsingTutorialHint(ui, jumpTutorialText(), { skippable: true });
}

export function showGapTutorial(ui) {
    showPulsingTutorialHint(ui, gapTutorialText(), { skippable: true });
}

export function showScoreTutorial(ui) {
    showPulsingTutorialHint(ui, scoreTutorialText(), { skippable: true });
}

export function showHardcoreTutorial(ui) {
    ui._hardcoreTutorialActive = true;
    showPulsingTutorialHint(ui, hardcoreTutorialText());
}

export function showTrainingTutorial(ui) {
    ui._trainingTutorialActive = true;
    showPulsingTutorialHint(ui, trainingTutorialText(ui.scene?.trainingTimeScale));
}

export function dismissHardcoreTutorial(ui) {
    if (!ui._hardcoreTutorialActive) return false;
    ui._hardcoreTutorialActive = false;
    return dismissGameplayTutorial(ui);
}

export function dismissTrainingTutorial(ui) {
    if (!ui._trainingTutorialActive) return false;
    ui._trainingTutorialActive = false;
    return dismissGameplayTutorial(ui);
}

export function dismissGameplayTutorial(ui) {
    return dismissJumpTutorial(ui);
}

export function dismissJumpTutorial(ui) {
    dismissSkipTutorialControl(ui);
    if (!ui._tutorialHint) return false;
    ui._tutorialHint.destroy();
    ui._tutorialHint = null;
    return true;
}
