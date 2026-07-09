import { hardcoreToggleLabel, trainingSpeedLabel, trainingToggleLabel } from './device.js';
import { DESIGN_TOKENS, menuTextStyle } from './designTokens.js';
import { applyFittedLabel, PANEL_TEXT_MAX_WIDTH } from './uiLayout.js';
import { setMenuPanelVisible } from './uiMenuPanel.js';
import { setOptionsTab } from './uiMenuOptionsTabs.js';
import { setOptionsSectionVisible } from './uiMenuOptionsSection.js';
import { drawHardcoreToggleIcon, drawTrainingToggleIcon } from './uiToggleIcons.js';

export const TOGGLE_ICON_X_OFFSET = -98;

export const TRAINING_LABEL_STYLE = menuTextStyle({
    fontSize: '12px',
    fontStyle: 'bold',
});

function trainingFill(active) {
    return active ? DESIGN_TOKENS.badgeTraining : DESIGN_TOKENS.texteHintMenu;
}

function hardcoreFill(active, unlocked) {
    if (!unlocked) return DESIGN_TOKENS.texteSecondaire;
    return active ? DESIGN_TOKENS.badgeHardcore : DESIGN_TOKENS.texteHintMenu;
}

function hideAllOptionsSections(ui) {
    for (const section of [
        ui._optionsControlsElements,
        ui._optionsSettingsElements,
        ui._optionsModesElements,
    ]) {
        setOptionsSectionVisible(section, false);
    }
}

/** @param {import('./ui.js').UI} ui @param {boolean} visible */
export function setOptionsContentVisible(ui, visible) {
    if (!visible) {
        hideAllOptionsSections(ui);
        setMenuPanelVisible(ui._optionsChromeElements, false, ui.scene);
        setMenuPanelVisible(ui._optionsPanelElements, false, ui.scene);
        return;
    }
    setMenuPanelVisible(ui._optionsChromeElements, true, ui.scene);
    setOptionsTab(ui, ui._optionsActiveTab ?? 'preferences');
}

export function applyTrainingLabel(ui, trainingMode) {
    if (!ui._trainingLabel) return;
    const text = trainingToggleLabel(trainingMode);
    const fill = trainingFill(trainingMode);
    applyFittedLabel(
        ui.scene,
        ui._trainingLabel,
        text,
        { ...TRAINING_LABEL_STYLE, fill },
        PANEL_TEXT_MAX_WIDTH
    );
    ui._trainingLabel.setColor(fill);
    if (ui._trainingIcon) drawTrainingToggleIcon(ui._trainingIcon, trainingMode);
}

export function applyHardcoreLabel(ui, hardcoreMode, unlocked) {
    if (!ui._hardcoreLabel) return;
    const text = hardcoreToggleLabel(hardcoreMode, unlocked);
    const fill = hardcoreFill(hardcoreMode, unlocked);
    applyFittedLabel(
        ui.scene,
        ui._hardcoreLabel,
        text,
        { ...TRAINING_LABEL_STYLE, fill },
        PANEL_TEXT_MAX_WIDTH
    );
    ui._hardcoreLabel.setColor(fill);
    if (ui._hardcoreIcon) drawHardcoreToggleIcon(ui._hardcoreIcon, hardcoreMode, unlocked);
}

/** @param {import('./ui.js').UI} ui @param {number} scale @param {boolean} [trainingMode] */
export function applyTrainingSpeedLabel(ui, scale, trainingMode = ui.scene?.trainingMode) {
    if (!ui._trainingSpeedLabel) return;
    const active = Boolean(trainingMode);
    const fill = active ? DESIGN_TOKENS.badgeTraining : DESIGN_TOKENS.texteSecondaire;
    const text = trainingSpeedLabel(scale);
    applyFittedLabel(
        ui.scene,
        ui._trainingSpeedLabel,
        text,
        { ...TRAINING_LABEL_STYLE, fill },
        PANEL_TEXT_MAX_WIDTH
    );
    ui._trainingSpeedLabel.setColor(fill);
    ui._trainingSpeedLabel.setAlpha(active ? 1 : 0.75);
    if (ui._trainingSpeedHit) {
        if (active) ui._trainingSpeedHit.setInteractive({ useHandCursor: true });
        else ui._trainingSpeedHit.disableInteractive();
    }
}
