import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';
import { DEPTH, MENU_BTN_COLOR, UI_LAYOUT } from './uiLayout.js';
import { buildMenuToggleButton } from './uiMenuPanel.js';
import { buildControlsSection } from './uiMenuOptionsControls.js';
import { buildSettingsSection } from './uiMenuOptionsSettings.js';
import { buildOptionsTabs, setOptionsTab } from './uiMenuOptionsTabs.js';

const OPTIONS_BTN_STROKE = hexVersPhaser(DESIGN_TOKENS.boutonOptionsStroke);

export {
    applyHardcoreLabel,
    applyTrainingLabel,
    setOptionsContentVisible,
} from './uiMenuOptionsLabels.js';

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject} el */
function pushOptionsChrome(ui, el) {
    ui._optionsPanelRoot?.add(el);
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

    ui._optionsPanelRoot = ui.scene.add.container(0, 0);
    ui._optionsPanelRoot.setDepth(DEPTH.PANEL_BACKDROP);
    ui._optionsPanelRoot.setVisible(false);
    elements.push(ui._optionsPanelRoot);

    buildOptionsTabs(ui, pushOptionsChrome);
    buildControlsSection(ui, elements);
    buildSettingsSection(ui, elements);

    const closeBtn = buildMenuToggleButton(ui.scene, [], {
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
    for (const el of [closeBtn.bg, closeBtn.label, closeBtn.hit]) {
        ui._optionsPanelRoot.add(el);
    }
    ui._optionsPanelElements.push(closeBtn.bg, closeBtn.label, closeBtn.hit);
    ui._optionsChromeElements.push(closeBtn.bg, closeBtn.label, closeBtn.hit);
    ui._optionsCloseHit = closeBtn.hit;

    setOptionsTab(ui, ui._optionsActiveTab ?? 'preferences');
}

/** @param {import('./ui.js').UI} ui */
export function attachOptionsBackdropToRoot(ui) {
    const root = ui._optionsPanelRoot;
    const backdrop = ui._optionsBackdrop;
    if (!root || !backdrop?.frame || !backdrop?.hit) return;
    root.addAt(backdrop.frame, 0);
    root.addAt(backdrop.hit, 1);
}
