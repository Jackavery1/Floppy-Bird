import { scoresButtonLabel } from './device.js';
import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';
import { bindScoresAccessibility, setScoresPanelAccessibility } from './uiDomAccessibility.js';
import { MENU_BTN_COLOR, UI_LAYOUT } from './uiLayout.js';
import { buildMenuPanelShell, createMenuPanelController } from './uiMenuPanel.js';
import { buildScoresTab, refreshScoresTab } from './uiMenuScores.js';

const SCORES_BTN_STROKE = hexVersPhaser(DESIGN_TOKENS.boutonOptionsStroke);

const PANEL_CFG = {
    openKey: '_scoresOpen',
    backdropKey: '_scoresBackdrop',
    panelElementsKey: '_scoresPanelElements',
    btnBgKey: '_scoresBtnBg',
    btnLabelKey: '_scoresBtnLabel',
    btnHitKey: '_scoresBtnHit',
    buttonLabelFn: scoresButtonLabel,
    btnColor: MENU_BTN_COLOR,
    btnStroke: SCORES_BTN_STROKE,
    labelStroke: DESIGN_TOKENS.contourOptions,
};

const controllerCfg = {
    ...PANEL_CFG,
    onOpen: (targetUi) => {
        refreshScoresTab(targetUi);
        bindScoresAccessibility(targetUi.scene);
        setScoresPanelAccessibility(targetUi.scene, true);
    },
    onClose: (targetUi) => setScoresPanelAccessibility(targetUi.scene, false),
};

/** @param {import('./ui.js').UI} ui */
export function refreshScoresButtonLabel(ui) {
    ui._scoresPanelController?.refreshButtonLabel();
}

/** @param {import('./ui.js').UI} ui @param {boolean} open */
export function setMenuScoresOpen(ui, open) {
    ui._scoresPanelController?.setOpen(open);
}

/** @param {import('./ui.js').UI} ui */
export function toggleMenuScores(ui) {
    ui._scoresPanelController?.toggle();
}

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements @param {ReturnType<import('./uiLayout.js').computeMenuLayout>} layout */
export function buildMenuScoresPanel(ui, elements, layout) {
    const panel = UI_LAYOUT.scoresPanel;
    ui._scoresPanelController = createMenuPanelController(ui, controllerCfg);
    buildMenuPanelShell(ui, elements, ui._scoresPanelController, {
        ...PANEL_CFG,
        btnLayout: { cx: layout.scoresBtn, cy: layout.menuRow, width: layout.menuBtnW },
        panelLayout: panel,
        buildContent: (targetUi, targetElements, panelElements) => {
            buildScoresTab(targetUi, targetElements, panelElements);
        },
    });
}
