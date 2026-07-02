import { scoresButtonLabel } from './device.js';
import { MENU_BTN_COLOR, UI_LAYOUT } from './uiLayout.js';
import { buildMenuPanelBackdrop, buildMenuToggleButton, setMenuPanelVisible, syncMenuChromeVisibility } from './uiMenuPanel.js';
import { buildScoresTab, refreshScoresTab } from './uiMenuScores.js';

const SCORES_BTN_STROKE = 0x42A5F5;

/** @param {import('./ui.js').UI} ui */
export function refreshScoresButtonLabel(ui) {
    if (!ui._scoresBtnLabel) return;
    ui._scoresBtnLabel.setText(scoresButtonLabel(ui._scoresOpen));
}

/** @param {import('./ui.js').UI} ui @param {boolean} open */
export function setMenuScoresOpen(ui, open) {
    ui._scoresOpen = open;
    ui._scoresBackdrop?.setVisible(open);
    setMenuPanelVisible(ui._scoresPanelElements, open);
    refreshScoresButtonLabel(ui);
    if (open) refreshScoresTab(ui);
    syncMenuChromeVisibility(ui);
}

/** @param {import('./ui.js').UI} ui */
export function toggleMenuScores(ui) {
    if (ui._scoresOpen) {
        setMenuScoresOpen(ui, false);
        return;
    }
    ui._closeAllMenuPanels?.();
    setMenuScoresOpen(ui, true);
}

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements @param {ReturnType<import('./uiLayout.js').computeMenuLayout>} layout */
export function buildMenuScoresPanel(ui, elements, layout) {
    const scene = ui.scene;
    const panel = UI_LAYOUT.scoresPanel;
    ui._scoresOpen = false;
    ui._scoresPanelElements = [];

    const btn = buildMenuToggleButton(scene, elements, {
        cx: layout.scoresBtn,
        cy: layout.menuRow,
        width: layout.menuBtnW,
        depth: 60,
        color: MENU_BTN_COLOR,
        stroke: SCORES_BTN_STROKE,
        labelText: scoresButtonLabel(false),
        labelStroke: '#0D47A1',
        onToggle: () => toggleMenuScores(ui),
    });
    ui._scoresBtnBg = btn.bg;
    ui._scoresBtnLabel = btn.label;
    ui._scoresBtnHit = btn.hit;

    ui._scoresBackdrop = buildMenuPanelBackdrop(scene, panel);
    elements.push(ui._scoresBackdrop);

    buildScoresTab(ui, elements, ui._scoresPanelElements);
    setMenuScoresOpen(ui, false);
}
