import { GAME_CONFIG } from './config.js';
import { classicModeHint, hardcoreToggleLabel, trainingToggleLabel } from './device.js';
import { DESIGN_TOKENS, menuTextStyle } from './designTokens.js';
import { isHardcoreUnlocked } from './hardcoreUnlock.js';
import { buildMetaContext } from './metaContext.js';
import { addCenteredText, DEPTH, FONT_SIZE_HINT, MIN_TOUCH, stopUiEvent } from './uiLayout.js';
import { drawHardcoreToggleIcon, drawTrainingToggleIcon } from './uiToggleIcons.js';
import {
    applyHardcoreLabel,
    applyTrainingLabel,
    TOGGLE_ICON_X_OFFSET,
    TRAINING_LABEL_STYLE,
} from './uiMenuOptionsLabels.js';

/**
 * @param {import('./ui.js').UI} ui
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {{ hintLine: number; training: number; hardcore: number }} panel
 */
export function buildModeControls(ui, elements, panel) {
    const scene = ui.scene;
    const ctx = buildMetaContext(scene);
    const hardcoreUnlocked = isHardcoreUnlocked(ctx);
    const toggleIconX = GAME_CONFIG.centerX + TOGGLE_ICON_X_OFFSET;

    ui._classicHint = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.hintLine,
        classicModeHint(),
        menuTextStyle({
            fontSize: FONT_SIZE_HINT,
            fill: DESIGN_TOKENS.texteHintMenu,
        }),
        DEPTH.PANEL_FRAME
    );
    ui._optionsPanelElements.push(ui._classicHint);
    elements.push(ui._classicHint);

    ui._trainingIcon = scene.add.graphics();
    ui._trainingIcon.setPosition(toggleIconX, panel.training);
    ui._trainingIcon.setDepth(DEPTH.PANEL_PREVIEW);
    drawTrainingToggleIcon(ui._trainingIcon, scene.trainingMode);
    ui._optionsPanelElements.push(ui._trainingIcon);
    elements.push(ui._trainingIcon);

    ui._trainingLabel = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.training,
        trainingToggleLabel(scene.trainingMode),
        {
            ...TRAINING_LABEL_STYLE,
            fill: scene.trainingMode ? DESIGN_TOKENS.badgeTraining : DESIGN_TOKENS.texteHintMenu,
        },
        DEPTH.PANEL_FRAME
    );
    applyTrainingLabel(ui, scene.trainingMode);
    ui._optionsPanelElements.push(ui._trainingLabel);
    elements.push(ui._trainingLabel);

    ui._trainingHit = scene.add.rectangle(
        GAME_CONFIG.centerX,
        panel.training,
        220,
        MIN_TOUCH,
        0x000000,
        0
    );
    ui._trainingHit.setDepth(DEPTH.PANEL_HIT);
    ui._trainingHit.setInteractive({ useHandCursor: true });
    ui._trainingHit.on('pointerover', () => {
        ui._trainingLabel.setAlpha(1);
    });
    ui._trainingHit.on('pointerout', () => {
        ui._trainingLabel.setAlpha(0.92);
    });
    ui._trainingHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        scene.toggleTraining();
    });
    ui._optionsPanelElements.push(ui._trainingHit);
    elements.push(ui._trainingHit);

    ui._hardcoreIcon = scene.add.graphics();
    ui._hardcoreIcon.setPosition(toggleIconX, panel.hardcore);
    ui._hardcoreIcon.setDepth(DEPTH.PANEL_PREVIEW);
    drawHardcoreToggleIcon(ui._hardcoreIcon, scene.hardcoreMode, hardcoreUnlocked);
    ui._optionsPanelElements.push(ui._hardcoreIcon);
    elements.push(ui._hardcoreIcon);

    ui._hardcoreLabel = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.hardcore,
        hardcoreToggleLabel(scene.hardcoreMode, hardcoreUnlocked),
        {
            ...TRAINING_LABEL_STYLE,
            fill: hardcoreUnlocked
                ? scene.hardcoreMode
                    ? DESIGN_TOKENS.badgeHardcore
                    : DESIGN_TOKENS.texteHintMenu
                : DESIGN_TOKENS.texteSecondaire,
        },
        DEPTH.PANEL_FRAME
    );
    applyHardcoreLabel(ui, scene.hardcoreMode, hardcoreUnlocked);
    ui._optionsPanelElements.push(ui._hardcoreLabel);
    elements.push(ui._hardcoreLabel);

    ui._hardcoreHit = scene.add.rectangle(
        GAME_CONFIG.centerX,
        panel.hardcore,
        220,
        MIN_TOUCH,
        0x000000,
        0
    );
    ui._hardcoreHit.setDepth(DEPTH.PANEL_HIT);
    if (hardcoreUnlocked) {
        ui._hardcoreHit.setInteractive({ useHandCursor: true });
        ui._hardcoreHit.on('pointerover', () => {
            ui._hardcoreLabel.setAlpha(1);
        });
        ui._hardcoreHit.on('pointerout', () => {
            ui._hardcoreLabel.setAlpha(0.92);
        });
        ui._hardcoreHit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            scene.toggleHardcore();
        });
    }
    ui._optionsPanelElements.push(ui._hardcoreHit);
    elements.push(ui._hardcoreHit);
}
