import { hardcoreToggleLabel, trainingToggleLabel } from './device.js';
import { applyFittedLabel, PANEL_TEXT_MAX_WIDTH } from './uiLayout.js';
import { setMenuPanelVisible } from './uiMenuPanel.js';
import { drawHardcoreToggleIcon, drawTrainingToggleIcon } from './uiToggleIcons.js';

export const TOGGLE_ICON_X_OFFSET = -98;

export const TRAINING_LABEL_STYLE = {
    fontSize: '12px',
    fontStyle: 'bold',
    stroke: '#0d1117',
    strokeThickness: 2,
};

/** @param {import('./ui.js').UI} ui @param {boolean} visible */
export function setOptionsContentVisible(ui, visible) {
    setMenuPanelVisible(ui._optionsPanelElements, visible);
}

export function applyTrainingLabel(ui, trainingMode) {
    if (!ui._trainingLabel) return;
    const text = trainingToggleLabel(trainingMode);
    applyFittedLabel(
        ui.scene,
        ui._trainingLabel,
        text,
        {
            ...TRAINING_LABEL_STYLE,
            fill: trainingMode ? '#81D4FA' : '#B0BEC5',
        },
        PANEL_TEXT_MAX_WIDTH
    );
    ui._trainingLabel.setColor(trainingMode ? '#81D4FA' : '#B0BEC5');
    if (ui._trainingIcon) drawTrainingToggleIcon(ui._trainingIcon, trainingMode);
}

export function applyHardcoreLabel(ui, hardcoreMode, unlocked) {
    if (!ui._hardcoreLabel) return;
    const text = hardcoreToggleLabel(hardcoreMode, unlocked);
    applyFittedLabel(
        ui.scene,
        ui._hardcoreLabel,
        text,
        {
            ...TRAINING_LABEL_STYLE,
            fill: !unlocked ? '#78909C' : hardcoreMode ? '#FF8A80' : '#B0BEC5',
        },
        PANEL_TEXT_MAX_WIDTH
    );
    ui._hardcoreLabel.setColor(!unlocked ? '#78909C' : hardcoreMode ? '#FF8A80' : '#B0BEC5');
    if (ui._hardcoreIcon) drawHardcoreToggleIcon(ui._hardcoreIcon, hardcoreMode, unlocked);
}
