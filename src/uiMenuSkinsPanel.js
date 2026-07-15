import { skinsButtonLabel } from './device.js';
import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';
import {
    bindSkinsAccessibility,
    setSkinsPanelAccessibility,
} from './uiDomAccessibilityPanelFlows.js';
import { UI_LAYOUT } from './uiLayout.js';
import { buildMenuPanelShell, createMenuPanelController } from './uiMenuPanelController.js';
import { buildSkinsTab, refreshSkinsTab } from './uiMenuSkins.js';

const SKINS_BTN_COLOR = hexVersPhaser(DESIGN_TOKENS.boutonSkins);
const SKINS_BTN_STROKE = hexVersPhaser(DESIGN_TOKENS.boutonSkinsStroke);

const PANEL_CFG = {
    openKey: '_skinsOpen',
    backdropKey: '_skinsBackdrop',
    panelElementsKey: '_skinsPanelElements',
    btnBgKey: '_skinsBtnBg',
    btnLabelKey: '_skinsBtnLabel',
    btnHitKey: '_skinsBtnHit',
    btnFocusKey: 'menuSkins',
    buttonLabelFn: skinsButtonLabel,
    btnColor: SKINS_BTN_COLOR,
    btnStroke: SKINS_BTN_STROKE,
    labelStroke: DESIGN_TOKENS.contourSkins,
};

const controllerCfg = {
    ...PANEL_CFG,
    onOpen: (targetUi) => {
        refreshSkinsTab(targetUi);
        bindSkinsAccessibility(targetUi.scene);
        setSkinsPanelAccessibility(targetUi.scene, true);
    },
    onClose: (targetUi) => setSkinsPanelAccessibility(targetUi.scene, false),
};

/** @param {import('./ui.js').UI} ui */
export function refreshSkinsButtonLabel(ui) {
    ui._skinsPanelController?.refreshButtonLabel();
}

/** @param {import('./ui.js').UI} ui @param {boolean} open @param {{ force?: boolean }} [panelOpts] */
export function setMenuSkinsOpen(ui, open, panelOpts) {
    ui._skinsPanelController?.setOpen(open, panelOpts);
}

/** @param {import('./ui.js').UI} ui */
export function toggleMenuSkins(ui) {
    ui._skinsPanelController?.toggle();
}

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements @param {ReturnType<import('./uiLayout.js').computeMenuLayout>} layout */
export function buildMenuSkinsPanel(ui, elements, layout) {
    const panel = UI_LAYOUT.skinsPanel;
    ui._skinsPanelController = createMenuPanelController(ui, controllerCfg);
    buildMenuPanelShell(ui, elements, ui._skinsPanelController, {
        ...PANEL_CFG,
        btnLayout: { cx: layout.skinsBtn, cy: layout.menuRow, width: layout.menuBtnW },
        panelLayout: panel,
        panelTheme: {
            fill: DESIGN_TOKENS.fondPanneauGameOver,
            stroke: DESIGN_TOKENS.boutonSkinsStroke,
        },
        buildContent: (targetUi, targetElements, panelElements) => {
            buildSkinsTab(targetUi, targetElements, panelElements);
        },
    });
}
