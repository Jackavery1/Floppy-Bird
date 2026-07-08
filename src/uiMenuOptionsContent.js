import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';
import { DEPTH, MENU_BTN_COLOR, UI_LAYOUT } from './uiLayout.js';
import { buildMenuToggleButton } from './uiMenuPanel.js';
import { buildControlsSection } from './uiMenuOptionsControls.js';
import { buildModeControls } from './uiMenuOptionsModes.js';
import { buildSettingsSection } from './uiMenuOptionsSettings.js';
import { buildOptionsTabs, setOptionsTab } from './uiMenuOptionsTabs.js';

const OPTIONS_BTN_STROKE = hexVersPhaser(DESIGN_TOKENS.boutonOptionsStroke);

export {
    applyHardcoreLabel,
    applyTrainingLabel,
    setOptionsContentVisible,
} from './uiMenuOptionsLabels.js';

function pushOptionsChrome(ui, elements, el) {
    elements.push(el);
    ui._optionsPanelElements.push(el);
    ui._optionsChromeElements.push(el);
}

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements */
export function buildOptionsContent(ui, elements) {
    const panel = UI_LAYOUT.optionsPanel;
    ui._optionsPanelElements = [];
    ui._optionsChromeElements = [];
    ui._optionsControlsElements = [];
    ui._optionsSettingsElements = [];
    ui._optionsModesElements = [];

    buildOptionsTabs(ui, elements, pushOptionsChrome);
    buildControlsSection(ui, elements);
    buildSettingsSection(ui, elements);
    buildModeControls(ui, elements, panel);

    const closeBtn = buildMenuToggleButton(ui.scene, elements, {
        cx: GAME_CONFIG.centerX,
        cy: panel.closeBtn,
        width: 160,
        depth: DEPTH.PANEL_FRAME,
        color: MENU_BTN_COLOR,
        stroke: OPTIONS_BTN_STROKE,
        hoverColor: hexVersPhaser(DESIGN_TOKENS.boutonMenuHover),
        labelText: '◂ RETOUR',
        labelStroke: DESIGN_TOKENS.contourOptions,
        rounded: true,
        onToggle: () => ui._optionsPanelController?.setOpen(false),
    });
    ui._optionsPanelElements.push(closeBtn.bg, closeBtn.label, closeBtn.hit);
    ui._optionsChromeElements.push(closeBtn.bg, closeBtn.label, closeBtn.hit);
    ui._optionsCloseHit = closeBtn.hit;

    setOptionsTab(ui, ui._optionsActiveTab ?? 'preferences');
}
