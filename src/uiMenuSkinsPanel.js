import { skinsButtonLabel } from './device.js';
import { UI_LAYOUT } from './uiLayout.js';
import { buildMenuPanelBackdrop, buildMenuToggleButton, setMenuPanelVisible, syncMenuChromeVisibility } from './uiMenuPanel.js';
import { buildSkinsTab, refreshSkinsTab } from './uiMeta.js';

const SKINS_BTN_COLOR = 0x00897B;
const SKINS_BTN_STROKE = 0x4DB6AC;

/** @param {import('./ui.js').UI} ui */
export function refreshSkinsButtonLabel(ui) {
    if (!ui._skinsBtnLabel) return;
    ui._skinsBtnLabel.setText(skinsButtonLabel(ui._skinsOpen));
}

/** @param {import('./ui.js').UI} ui @param {boolean} open */
export function setMenuSkinsOpen(ui, open) {
    ui._skinsOpen = open;
    ui._skinsBackdrop?.setVisible(open);
    setMenuPanelVisible(ui._skinsPanelElements, open);
    refreshSkinsButtonLabel(ui);
    if (open) refreshSkinsTab(ui);
    syncMenuChromeVisibility(ui);
}

/** @param {import('./ui.js').UI} ui */
export function toggleMenuSkins(ui) {
    if (ui._skinsOpen) {
        setMenuSkinsOpen(ui, false);
        return;
    }
    ui._closeAllMenuPanels?.();
    setMenuSkinsOpen(ui, true);
}

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements @param {ReturnType<import('./uiLayout.js').computeMenuLayout>} layout */
export function buildMenuSkinsPanel(ui, elements, layout) {
    const scene = ui.scene;
    const panel = UI_LAYOUT.skinsPanel;
    ui._skinsOpen = false;
    ui._skinsPanelElements = [];

    const btn = buildMenuToggleButton(scene, elements, {
        cx: layout.skinsBtn,
        cy: layout.menuRow,
        width: layout.menuBtnW,
        depth: 60,
        color: SKINS_BTN_COLOR,
        stroke: SKINS_BTN_STROKE,
        labelText: skinsButtonLabel(false),
        labelStroke: '#004D40',
        onToggle: () => toggleMenuSkins(ui),
    });
    ui._skinsBtnBg = btn.bg;
    ui._skinsBtnLabel = btn.label;
    ui._skinsBtnHit = btn.hit;

    ui._skinsBackdrop = buildMenuPanelBackdrop(scene, panel);
    elements.push(ui._skinsBackdrop);

    buildSkinsTab(ui, elements, ui._skinsPanelElements);
    setMenuSkinsOpen(ui, false);
}
