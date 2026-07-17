import { DESIGN_TOKENS, hexVersPhaser, panelChromeTextStyle } from '../../designTokens.js';
import {
    announceAccessibility,
    bindUnifiedInteractiveFocus,
} from '../a11y/uiDomAccessibilityControls.js';
import {
    DEPTH,
    FONT_SIZE_HINT,
    MENU_BTN_COLOR,
    MIN_TOUCH,
    stopUiEvent,
    UI_LAYOUT,
    addCenteredText,
    applyFittedLabel,
} from '../shared/uiLayout.js';
import { setOptionsSectionVisible } from './uiMenuOptionsSection.js';
import { drawPanelPillButton } from './uiMenuPanelChrome.js';
import { syncOptionsTabAccessibility } from '../a11y/uiDomAccessibilityControls.js';

/** @typedef {'controls' | 'preferences'} OptionsTabId */

const TAB_INACTIVE = hexVersPhaser(DESIGN_TOKENS.boutonPause);
const TAB_STROKE = hexVersPhaser(DESIGN_TOKENS.boutonOptionsStroke);
const TAB_HOVER = hexVersPhaser(DESIGN_TOKENS.boutonMenuHover);

const TABS = Object.freeze([
    { id: 'controls', label: 'CTRL', cxKey: 'tabControlsX' },
    { id: 'preferences', label: 'REGL', cxKey: 'tabPreferencesX' },
]);

const TAB_LABEL_STYLE = panelChromeTextStyle({
    fontSize: FONT_SIZE_HINT,
    fill: DESIGN_TOKENS.texteMenu,
    fontStyle: 'bold',
    stroke: DESIGN_TOKENS.contourOptions,
});

/** @param {import('../core/ui.js').UI} ui @param {OptionsTabId} tab */
export function setOptionsTab(ui, tab) {
    const previous = ui._optionsActiveTab;
    ui._optionsActiveTab = tab;
    const panelOpen = ui._optionsOpen === true;
    if (!panelOpen) {
        setOptionsSectionVisible(ui._optionsControlsElements, false);
        setOptionsSectionVisible(ui._optionsSettingsElements, false);
    } else {
        setOptionsSectionVisible(ui._optionsControlsElements, tab === 'controls');
        setOptionsSectionVisible(ui._optionsSettingsElements, tab === 'preferences');
        if (previous !== tab) {
            announceAccessibility(tab === 'controls' ? 'Onglet contrôles' : 'Onglet réglages');
        }
    }
    ui._optionsTabButtons?.forEach(({ id, paint, label }) => {
        const active = id === tab;
        paint(active ? MENU_BTN_COLOR : TAB_INACTIVE, active ? 0.95 : 0.78);
        label.setColor(active ? DESIGN_TOKENS.texteMenu : DESIGN_TOKENS.texteHintMenu);
    });
    syncOptionsTabAccessibility(ui);
}

/**
 * @param {import('../core/ui.js').UI} ui
 * @param {(ui: import('../core/ui.js').UI, el: import('phaser').GameObjects.GameObject) => void} pushChrome
 */
export function buildOptionsTabs(ui, pushChrome) {
    const scene = ui.scene;
    const panel = UI_LAYOUT.optionsPanel;
    ui._optionsTabButtons = [];
    ui._optionsActiveTab = 'preferences';

    const pushTab = (el) => pushChrome(ui, el);

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
        applyFittedLabel(scene, text, label, TAB_LABEL_STYLE, w - 12);
        pushTab(text);

        const hit = scene.add.rectangle(cx, cy, w, h, 0x000000, 0);
        hit.setDepth(DEPTH.PANEL_HIT);
        hit.setInteractive({ useHandCursor: true });
        const focusKey = id === 'controls' ? 'menuOptionsTabControls' : 'menuOptionsTabPreferences';
        bindUnifiedInteractiveFocus(
            focusKey,
            () => {
                if (ui._optionsActiveTab !== id) paint(TAB_HOVER, 0.88);
            },
            () => {
                if (ui._optionsActiveTab !== id) paint(TAB_INACTIVE, 0.78);
            }
        ).attachHit(hit);
        hit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            setOptionsTab(ui, id);
        });
        pushTab(hit);

        ui._optionsTabButtons.push({ id, bg, label: text, hit, paint });
    });

    setOptionsTab(ui, 'preferences');
}
