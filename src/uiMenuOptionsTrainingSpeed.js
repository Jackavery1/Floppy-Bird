import { GAME_CONFIG } from './config.js';
import { trainingSpeedLabel } from './device.js';
import { DESIGN_TOKENS } from './designTokens.js';
import { addCenteredText, DEPTH, MIN_TOUCH, stopUiEvent } from './uiLayout.js';
import { beginOptionsSection } from './uiMenuOptionsSection.js';
import { applyTrainingSpeedLabel, TRAINING_LABEL_STYLE } from './uiMenuOptionsLabels.js';

/**
 * @param {import('./ui.js').UI} ui
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {{ trainingSpeed: number }} panel
 */
export function buildTrainingSpeedControl(ui, elements, panel) {
    const scene = ui.scene;
    const { add } = beginOptionsSection(ui, scene, elements, '_optionsModesElements');

    ui._trainingSpeedLabel = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.trainingSpeed,
        trainingSpeedLabel(scene.trainingTimeScale),
        {
            ...TRAINING_LABEL_STYLE,
            fill: scene.trainingMode ? DESIGN_TOKENS.badgeTraining : DESIGN_TOKENS.texteSecondaire,
        },
        DEPTH.PANEL_FRAME
    );
    applyTrainingSpeedLabel(ui, scene.trainingTimeScale, scene.trainingMode);
    add(ui._trainingSpeedLabel);

    ui._trainingSpeedHit = scene.add.rectangle(
        GAME_CONFIG.centerX,
        panel.trainingSpeed,
        220,
        MIN_TOUCH,
        0x000000,
        0
    );
    ui._trainingSpeedHit.setDepth(DEPTH.PANEL_HIT);
    ui._trainingSpeedHit.setInteractive({ useHandCursor: true });
    ui._trainingSpeedHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        scene.cycleTrainingSpeed();
    });
    add(ui._trainingSpeedHit);
}
