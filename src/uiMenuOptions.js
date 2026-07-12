import { optionsButtonLabel } from './device.js';
import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';
import { buildMetaContext } from './metaContext.js';
import { isHardcoreUnlocked } from './hardcoreUnlock.js';
import {
    bindOptionsAccessibility,
    setAccessibilityControlDisabled,
    setOptionsPanelAccessibility,
} from './uiDomAccessibility.js';
import { MENU_BTN_COLOR, UI_LAYOUT } from './uiLayout.js';
import {
    buildMenuPanelBackdrop,
    buildMenuPanelShell,
    createMenuPanelController,
} from './uiMenuPanel.js';
import {
    applyHardcoreLabel,
    attachOptionsBackdropToRoot,
    buildOptionsContent,
    setOptionsContentVisible,
} from './uiMenuOptionsContent.js';

export { applyHardcoreLabel, applyTrainingLabel } from './uiMenuOptionsContent.js';

const PANEL_CFG = {
    openKey: '_optionsOpen',
    backdropKey: '_optionsBackdrop',
    panelElementsKey: '_optionsPanelElements',
    btnBgKey: '_optionsBtnBg',
    btnLabelKey: '_optionsBtnLabel',
    btnHitKey: '_optionsBtnHit',
    buttonLabelFn: optionsButtonLabel,
    btnColor: MENU_BTN_COLOR,
    btnStroke: hexVersPhaser(DESIGN_TOKENS.boutonOptionsStroke),
    labelStroke: DESIGN_TOKENS.contourOptions,
};

const OPTIONS_PANEL_THEME = {
    fill: DESIGN_TOKENS.fondPanneauGameOver,
    stroke: DESIGN_TOKENS.boutonOptionsStroke,
};

/** @param {import('./ui.js').UI} ui */
export function teardownOptionsPanel(ui) {
    ui._optionsPanelRoot?.destroy?.();
    if (!ui._optionsPanelRoot && ui._optionsBackdrop) {
        ui._optionsBackdrop.frame?.destroy?.();
        ui._optionsBackdrop.hit?.destroy?.();
    }
    ui._optionsPanelRoot = null;
    ui._optionsBackdrop = null;
    ui._optionsPanelBuilt = false;
    ui._optionsPanelElements = [];
    ui._optionsChromeElements = [];
    ui._optionsControlsElements = [];
    ui._optionsSettingsElements = [];
    ui._optionsTabButtons = [];
    ui._trainingLabel = null;
    ui._hardcoreLabel = null;
    ui._trainingIcon = null;
    ui._hardcoreIcon = null;
    ui._trainingSpeedLabel = null;
    ui._trainingSpeedHit = null;
    ui._optionsCloseHit = null;
}

/** @param {import('./ui.js').UI} ui */
export function ensureOptionsPanelBuilt(ui) {
    if (ui._optionsPanelBuilt) return;
    const elements = ui._menuBuildElements;
    if (!elements || !ui.scene) return;

    const panel = UI_LAYOUT.optionsPanel;
    ui._optionsBackdrop = buildMenuPanelBackdrop(ui.scene, panel, OPTIONS_PANEL_THEME);
    buildOptionsContent(ui, elements);
    attachOptionsBackdropToRoot(ui);

    const ctx = buildMetaContext(ui.scene);
    const unlocked = isHardcoreUnlocked(ctx);
    applyHardcoreLabel(ui, ui.scene.hardcoreMode, unlocked);
    refreshHardcoreLockState(ui);

    ui._optionsPanelBuilt = true;
}

const controllerCfg = {
    ...PANEL_CFG,
    panelElementsKey: '_optionsPanelElements',
    setContentVisible: setOptionsContentVisible,
    onOpen: (targetUi) => {
        bindOptionsAccessibility(targetUi.scene);
        setOptionsPanelAccessibility(targetUi.scene, true);
    },
    onClose: (targetUi) => setOptionsPanelAccessibility(targetUi.scene, false),
};

/** @param {import('./ui.js').UI} ui */
export function refreshOptionsButtonLabel(ui) {
    ui._optionsPanelController?.refreshButtonLabel();
}

/** @param {import('./ui.js').UI} ui */
export function refreshHardcoreLockState(ui) {
    if (!ui._hardcoreLabel?.scene) return;
    const ctx = buildMetaContext(ui.scene);
    const unlocked = isHardcoreUnlocked(ctx);
    applyHardcoreLabel(ui, ui.scene.hardcoreMode, unlocked);
    if (unlocked) {
        ui._hardcoreHit?.setInteractive?.({ useHandCursor: true });
        setAccessibilityControlDisabled('menuHardcore', false);
    } else {
        ui._hardcoreHit?.disableInteractive?.();
        setAccessibilityControlDisabled('menuHardcore', true);
    }
}

/** @param {import('./ui.js').UI} ui @param {boolean} open @param {{ force?: boolean }} [panelOpts] */
export function setMenuOptionsOpen(ui, open, panelOpts) {
    ui._optionsPanelController?.setOpen(open, panelOpts);
}

/** @param {import('./ui.js').UI} ui */
export function toggleMenuOptions(ui) {
    ui._optionsPanelController?.toggle();
}

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements @param {ReturnType<import('./uiLayout.js').computeMenuLayout>} layout */
export function buildMenuOptions(ui, elements, layout) {
    teardownOptionsPanel(ui);
    ui._menuBuildElements = elements;
    ui._ensureOptionsPanelBuilt = () => ensureOptionsPanelBuilt(ui);
    ui._optionsPanelController = createMenuPanelController(ui, controllerCfg);
    buildMenuPanelShell(ui, elements, ui._optionsPanelController, {
        ...PANEL_CFG,
        deferPanelContent: true,
        setContentVisible: setOptionsContentVisible,
        btnLayout: { cx: layout.optionsBtn, cy: layout.menuRow, width: layout.menuBtnW },
        panelLayout: UI_LAYOUT.optionsPanel,
        panelTheme: OPTIONS_PANEL_THEME,
        buildContent: () => {},
    });
}
