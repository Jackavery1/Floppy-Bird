import { scoresButtonLabel } from '../../device.js';
import { DESIGN_TOKENS, hexVersPhaser } from '../../designTokens.js';
import {
    bindScoresAccessibility,
    setScoresPanelAccessibility,
} from '../a11y/uiDomAccessibilityPanelFlows.js';
import { createSecondaryMenuPanel } from './uiMenuSecondaryPanel.js';
import { buildScoresTab, refreshScoresTab } from './uiMenuScores.js';

const PANEL_CFG = {
    openKey: '_scoresOpen',
    backdropKey: '_scoresBackdrop',
    panelElementsKey: '_scoresPanelElements',
    btnBgKey: '_scoresBtnBg',
    btnLabelKey: '_scoresBtnLabel',
    btnHitKey: '_scoresBtnHit',
    btnFocusKey: 'menuScores',
    buttonLabelFn: scoresButtonLabel,
    btnColor: hexVersPhaser(DESIGN_TOKENS.boutonScores),
    btnHover: hexVersPhaser(DESIGN_TOKENS.boutonScoresHover),
    btnStroke: hexVersPhaser(DESIGN_TOKENS.boutonScoresStroke),
    labelStroke: DESIGN_TOKENS.boutonScoresStroke,
};

const scoresPanel = createSecondaryMenuPanel({
    controllerKey: '_scoresPanelController',
    panelLayoutKey: 'scoresPanel',
    btnLayoutKey: 'scoresBtn',
    panelCfg: PANEL_CFG,
    themeStroke: DESIGN_TOKENS.boutonScoresStroke,
    refreshTab: refreshScoresTab,
    bindA11y: bindScoresAccessibility,
    setA11y: setScoresPanelAccessibility,
    buildTab: buildScoresTab,
});

/** @param {import('../core/ui.js').UI} ui */
export function refreshScoresButtonLabel(ui) {
    scoresPanel.refreshButtonLabel(ui);
}

/** @param {import('../core/ui.js').UI} ui @param {boolean} open @param {{ force?: boolean }} [panelOpts] */
export function setMenuScoresOpen(ui, open, panelOpts) {
    scoresPanel.setOpen(ui, open, panelOpts);
}

/** @param {import('../core/ui.js').UI} ui */
export function toggleMenuScores(ui) {
    scoresPanel.toggle(ui);
}

/** @param {import('../core/ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements @param {ReturnType<import('../shared/uiLayout.js').computeMenuLayout>} layout */
export function buildMenuScoresPanel(ui, elements, layout) {
    scoresPanel.build(ui, elements, layout);
}
