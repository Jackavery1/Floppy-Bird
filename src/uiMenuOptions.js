import { optionsButtonLabel } from './device.js';
import { DESIGN_TOKENS } from './designTokens.js';
import { buildMetaContext } from './metaContext.js';
import { isHardcoreUnlocked } from './hardcoreUnlock.js';
import {
    bindOptionsAccessibility,
    setOptionsPanelAccessibility,
} from './uiDomAccessibility.js';
import { MENU_BTN_COLOR, UI_LAYOUT } from './uiLayout.js';
import { buildMenuPanelShell, createMenuPanelController } from './uiMenuPanel.js';
import {
    applyHardcoreLabel,
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
    btnStroke: 0x42a5f5,
    labelStroke: DESIGN_TOKENS.contourOptions,
};

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
    } else {
        ui._hardcoreHit?.disableInteractive?.();
    }
}

/** @param {import('./ui.js').UI} ui @param {boolean} open */
export function setMenuOptionsOpen(ui, open) {
    ui._optionsPanelController?.setOpen(open);
}

/** @param {import('./ui.js').UI} ui */
export function toggleMenuOptions(ui) {
    ui._optionsPanelController?.toggle();
}

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements @param {ReturnType<import('./uiLayout.js').computeMenuLayout>} layout */
export function buildMenuOptions(ui, elements, layout) {
    const panel = UI_LAYOUT.optionsPanel;
    ui._optionsPanelController = createMenuPanelController(ui, controllerCfg);
    buildMenuPanelShell(ui, elements, ui._optionsPanelController, {
        ...PANEL_CFG,
        btnLayout: { cx: layout.optionsBtn, cy: layout.menuRow, width: layout.menuBtnW },
        panelLayout: panel,
        buildContent: (targetUi, targetElements) => {
            buildOptionsContent(targetUi, targetElements);
        },
    });
}
