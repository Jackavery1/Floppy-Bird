import { destroyInGameControls } from '../hud/uiHud.js';
import { setMenuPanelVisible, syncMenuChromeVisibility } from './uiMenuPanel.js';
import { setOptionsContentVisible } from './uiMenuOptionsContent.js';
import { setMenuOptionsOpen, teardownOptionsPanel } from './uiMenuOptions.js';
import { setMenuScoresOpen } from './uiMenuScoresPanel.js';
import { setMenuSkinsOpen } from './uiMenuSkinsPanel.js';
import {
    setOptionsPanelAccessibility,
    setScoresPanelAccessibility,
    setSkinsPanelAccessibility,
} from '../a11y/uiDomAccessibilityPanelFlows.js';

/** @param {import('../core/ui.js').UI} ui */
function resetMenuPanelRefs(ui) {
    ui._optionsPanelRoot = null;
    ui._optionsChromeElements = [];
    ui._optionsPanelElements = [];
    ui._optionsControlsElements = [];
    ui._optionsSettingsElements = [];
    ui._scoresPanelElements = [];
    ui._skinsPanelElements = [];
}

/** @param {import('../core/ui.js').UI} ui */
function resetMenuPanelFlags(ui) {
    ui._optionsOpen = false;
    ui._scoresOpen = false;
    ui._skinsOpen = false;
    ui._optionsActiveTab = 'preferences';
}

/** @param {import('../core/ui.js').UI} ui */
function forceHideMenuPanels(ui) {
    setOptionsContentVisible(ui, false);
    if (ui._scoresPanelElements?.length) {
        setMenuPanelVisible(ui._scoresPanelElements, false, ui.scene);
        ui._scoresBackdrop?.setVisible?.(false);
    }
    if (ui._skinsPanelElements?.length) {
        setMenuPanelVisible(ui._skinsPanelElements, false, ui.scene);
        ui._skinsBackdrop?.setVisible?.(false);
    }
}

/** @param {import('../core/ui.js').UI} ui */
function ensureMenuActionRowVisible(ui) {
    if (ui._optionsOpen || ui._scoresOpen || ui._skinsOpen) return;
    syncMenuChromeVisibility(ui);
    for (const el of [
        ui._scoresBtnBg,
        ui._scoresBtnLabel,
        ui._scoresBtnHit,
        ui._optionsBtnBg,
        ui._optionsBtnLabel,
        ui._optionsBtnHit,
        ui._skinsBtnBg,
        ui._skinsBtnLabel,
        ui._skinsBtnHit,
    ]) {
        el?.setVisible?.(true);
        el?.setAlpha?.(1);
    }
}

/** @param {import('../core/ui.js').UI} ui @param {{ force?: boolean }} [opts] */
export function closeAllMenuPanels(ui, opts = {}) {
    const panelOpts = opts.force ? { force: true } : undefined;
    if (opts.force) forceHideMenuPanels(ui);
    setMenuOptionsOpen(ui, false, panelOpts);
    setMenuScoresOpen(ui, false, panelOpts);
    setMenuSkinsOpen(ui, false, panelOpts);
}

/** Réinitialise flags panneaux, options et a11y avant rebuild du menu principal. */
export function prepareMenuRebuild(ui) {
    resetMenuPanelFlags(ui);
    teardownOptionsPanel(ui);
    const scene = ui.scene;
    if (scene) {
        setOptionsPanelAccessibility(scene, false);
        setScoresPanelAccessibility(scene, false);
        setSkinsPanelAccessibility(scene, false);
    }
    for (const key of ['menu', 'pause', 'gameOver']) {
        ui.clearOverlay(key);
    }
    resetMenuPanelRefs(ui);
    destroyInGameControls(ui);
    if (ui._startText?.scene?.tweens) {
        ui.scene.tweens.killTweensOf(ui._startText);
    }
    ui._restartBtnGraphics = null;
    ui._restartBtnText = null;
    ui._menuBtnGraphics = null;
}

export { ensureMenuActionRowVisible };
