import { GAME_CONFIG } from '../../config.js';
import { trainingSpeedLabel } from '../../device.js';
import { DESIGN_TOKENS } from '../../designTokens.js';
import { bindUnifiedInteractiveFocus } from '../a11y/uiDomAccessibilityControls.js';
import { addCenteredText, DEPTH, MIN_TOUCH, stopUiEvent } from '../shared/uiLayout.js';
import { applyTrainingSpeedLabel, TRAINING_LABEL_STYLE } from './uiMenuOptionsLabels.js';

/**
 * @param {import('../core/ui.js').UI} ui
 * @param {( ...objs: import('phaser').GameObjects.GameObject[]) => void} add
 * @param {{ trainingSpeed: number }} panel
 */
export function buildTrainingSpeedControl(ui, add, panel) {
    const scene = ui.scene;

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
    bindUnifiedInteractiveFocus(
        'menuTrainingSpeed',
        () => ui._trainingSpeedLabel.setAlpha(1),
        () => ui._trainingSpeedLabel.setAlpha(scene.trainingMode ? 0.92 : 0.85)
    ).attachHit(ui._trainingSpeedHit);
    ui._trainingSpeedHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        scene.cycleTrainingSpeed();
    });
    add(ui._trainingSpeedHit);
}
