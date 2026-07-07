import { DESIGN_TOKENS, hexVersPhaser, menuHomeTextStyle } from './designTokens.js';
import {
    DEPTH,
    MENU_BTN_COLOR,
    MIN_TOUCH,
    stopUiEvent,
    UI_LAYOUT,
    addCenteredText,
    applyFittedLabel,
} from './uiLayout.js';
import { setOptionsSectionVisible } from './uiMenuOptionsSection.js';
import { drawPanelPillButton } from './uiMenuPanelChrome.js';

/** @typedef {'controls' | 'settings' | 'modes'} OptionsTabId */

const TAB_INACTIVE = hexVersPhaser(DESIGN_TOKENS.boutonPause);
const TAB_STROKE = hexVersPhaser(DESIGN_TOKENS.boutonOptionsStroke);
const TAB_HOVER = hexVersPhaser(DESIGN_TOKENS.boutonMenuHover);

const TABS = Object.freeze([
    { id: 'controls', label: 'CONTR.', cxKey: 'tabControlsX' },
    { id: 'settings', label: 'RÉGL.', cxKey: 'tabSettingsX' },
    { id: 'modes', label: 'MODES', cxKey: 'tabModesX' },
]);

const TAB_LABEL_STYLE = menuHomeTextStyle({
    fontSize: '12px',
    stroke: DESIGN_TOKENS.contourOptions,
});

/** @param {import('./ui.js').UI} ui @param {OptionsTabId} tab */
export function setOptionsTab(ui, tab) {
    ui._optionsActiveTab = tab;
    const panelOpen = ui._optionsOpen === true;
    const sections = {
        controls: ui._optionsControlsElements,
        settings: ui._optionsSettingsElements,
        modes: ui._optionsModesElements,
    };
    for (const [id, els] of Object.entries(sections)) {
        setOptionsSectionVisible(els, panelOpen && id === tab);
    }
    ui._optionsTabButtons?.forEach(({ id, paint, label }) => {
        const active = id === tab;
        paint(active ? MENU_BTN_COLOR : TAB_INACTIVE, active ? 0.95 : 0.78);
        label.setColor(active ? DESIGN_TOKENS.texteMenu : DESIGN_TOKENS.texteHintMenu);
    });
}

/**
 * @param {import('./ui.js').UI} ui
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {(ui: import('./ui.js').UI, elements: import('phaser').GameObjects.GameObject[], el: import('phaser').GameObjects.GameObject) => void} pushChrome
 */
export function buildOptionsTabs(ui, elements, pushChrome) {
    const scene = ui.scene;
    const panel = UI_LAYOUT.optionsPanel;
    ui._optionsTabButtons = [];
    ui._optionsActiveTab = 'modes';

    const pushTab = (el) => pushChrome(ui, elements, el);

    TABS.forEach(({ id, label, cxKey }) => {
        const cx = panel[cxKey];
        const cy = panel.tabRow;
        const w = panel.tabBtnW;
        const h = MIN_TOUCH;
        const bg = scene.add.graphics().setDepth(DEPTH.PANEL_FRAME);

        const paint = (fill, fillAlpha = 0.78) => {
            drawPanelPillButton(bg, cx, cy, w, h, fill, fillAlpha, TAB_STROKE, 0.58);
        };
        paint(TAB_INACTIVE);

        pushTab(bg);

        const text = addCenteredText(scene, cx, cy, label, TAB_LABEL_STYLE, DEPTH.PANEL_FRAME + 1);
        applyFittedLabel(scene, text, label, TAB_LABEL_STYLE, w - 10);
        pushTab(text);

        const hit = scene.add.rectangle(cx, cy, w, h, 0x000000, 0);
        hit.setDepth(DEPTH.PANEL_HIT);
        hit.setInteractive({ useHandCursor: true });
        hit.on('pointerover', () => {
            if (ui._optionsActiveTab !== id) paint(TAB_HOVER, 0.88);
        });
        hit.on('pointerout', () => {
            if (ui._optionsActiveTab !== id) paint(TAB_INACTIVE, 0.78);
        });
        hit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            setOptionsTab(ui, id);
        });
        pushTab(hit);

        ui._optionsTabButtons.push({ id, bg, label: text, hit, paint });
    });

    setOptionsTab(ui, 'modes');
}
