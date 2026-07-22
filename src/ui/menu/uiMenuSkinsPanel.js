import { skinsButtonLabel } from '../../device.js';
import { DESIGN_TOKENS, hexVersPhaser } from '../../designTokens.js';
import {
    bindSkinsAccessibility,
    setSkinsPanelAccessibility,
} from '../a11y/uiDomAccessibilityPanelFlows.js';
import { createSecondaryMenuPanel } from './uiMenuSecondaryPanel.js';
import { buildSkinsTab, refreshSkinsTab } from './uiMenuSkins.js';

const PANEL_CFG = {
    openKey: '_skinsOpen',
    backdropKey: '_skinsBackdrop',
    panelElementsKey: '_skinsPanelElements',
    btnBgKey: '_skinsBtnBg',
    btnLabelKey: '_skinsBtnLabel',
    btnHitKey: '_skinsBtnHit',
    btnFocusKey: 'menuSkins',
    buttonLabelFn: skinsButtonLabel,
    btnColor: hexVersPhaser(DESIGN_TOKENS.boutonSkins),
    btnHover: hexVersPhaser(DESIGN_TOKENS.boutonSkinsHover),
    btnStroke: hexVersPhaser(DESIGN_TOKENS.boutonSkinsStroke),
    labelStroke: DESIGN_TOKENS.contourSkins,
};

const skinsPanel = createSecondaryMenuPanel({
    controllerKey: '_skinsPanelController',
    panelLayoutKey: 'skinsPanel',
    btnLayoutKey: 'skinsBtn',
    panelCfg: PANEL_CFG,
    themeStroke: DESIGN_TOKENS.boutonSkinsStroke,
    refreshTab: refreshSkinsTab,
    bindA11y: bindSkinsAccessibility,
    setA11y: setSkinsPanelAccessibility,
    buildTab: buildSkinsTab,
});

/** @param {import('../core/ui.js').UI} ui @param {boolean} open @param {{ force?: boolean }} [panelOpts] */
export function setMenuSkinsOpen(ui, open, panelOpts) {
    skinsPanel.setOpen(ui, open, panelOpts);
}

/** @param {import('../core/ui.js').UI} ui */
export function toggleMenuSkins(ui) {
    skinsPanel.toggle(ui);
}

/** @param {import('../core/ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements @param {ReturnType<import('../shared/uiLayout.js').computeMenuLayout>} layout */
export function buildMenuSkinsPanel(ui, elements, layout) {
    skinsPanel.build(ui, elements, layout);
}
