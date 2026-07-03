import { skinsButtonLabel } from './device.js';
import { UI_LAYOUT } from './uiLayout.js';
import { buildMenuPanelShell, createMenuPanelController } from './uiMenuPanel.js';
import { buildSkinsTab, refreshSkinsTab } from './uiMenuSkins.js';

const SKINS_BTN_COLOR = 0x00897b;
const SKINS_BTN_STROKE = 0x4db6ac;

const PANEL_CFG = {
    openKey: '_skinsOpen',
    backdropKey: '_skinsBackdrop',
    panelElementsKey: '_skinsPanelElements',
    btnBgKey: '_skinsBtnBg',
    btnLabelKey: '_skinsBtnLabel',
    btnHitKey: '_skinsBtnHit',
    buttonLabelFn: skinsButtonLabel,
    btnColor: SKINS_BTN_COLOR,
    btnStroke: SKINS_BTN_STROKE,
    labelStroke: '#004D40',
};

const controllerCfg = {
    ...PANEL_CFG,
    onOpen: refreshSkinsTab,
};

/** @param {import('./ui.js').UI} ui */
export function refreshSkinsButtonLabel(ui) {
    ui._skinsPanelController?.refreshButtonLabel();
}

/** @param {import('./ui.js').UI} ui @param {boolean} open */
export function setMenuSkinsOpen(ui, open) {
    ui._skinsPanelController?.setOpen(open);
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
        buildContent: (targetUi, targetElements, panelElements) => {
            buildSkinsTab(targetUi, targetElements, panelElements);
        },
    });
}
