import { GAME_CONFIG } from './config.js';
import {
    DESIGN_TOKENS,
    menuTextStyle,
    panelChromeTextStyle,
    hexVersPhaser,
} from './designTokens.js';
import { pauseResumeHint, menuHint } from './device.js';
import {
    bindAccessibilityAction,
    setAccessibilityControlLabel,
} from './uiDomAccessibilityControls.js';
import { syncAccessibilityLayer } from './uiDomAccessibilityLayer.js';
import { buildPanelPillButton } from './uiMenuPanelChrome.js';
import {
    addCenteredText,
    DEPTH,
    FONT_SIZE_HINT,
    FONT_TITLE,
    MENU_BTN_COLOR,
    MENU_BTN_HOVER,
    UI_LAYOUT,
} from './uiLayout.js';

const PAUSE_BTN_STROKE = hexVersPhaser(DESIGN_TOKENS.contourMenu);

/**
 * @param {import('phaser').Scene} scene
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {{ cy: number, label: string, focusKey: 'pauseResume' | 'pauseMenu', onAction: () => void }} cfg
 */
function buildPauseActionButton(scene, elements, { cy, label, focusKey, onAction }) {
    return buildPanelPillButton(scene, elements, {
        cx: GAME_CONFIG.centerX,
        cy,
        width: UI_LAYOUT.menuBtn.width,
        depth: DEPTH.PAUSE_BTN,
        color: MENU_BTN_COLOR,
        stroke: PAUSE_BTN_STROKE,
        hoverColor: MENU_BTN_HOVER,
        labelText: label,
        labelStroke: DESIGN_TOKENS.contourMenu,
        labelStyle: panelChromeTextStyle({ fontSize: '13px', fill: DESIGN_TOKENS.texteMenu }),
        focusKey,
        onToggle: onAction,
    });
}

export function showPause(ui, { onResume, onMenu }) {
    const { pause } = UI_LAYOUT;
    const overlay = ui.createOverlay(0.65, DEPTH.PAUSE_OVERLAY);
    const elements = [overlay];

    const pauseTitle = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        pause.title,
        'PAUSE',
        menuTextStyle({
            fontFamily: FONT_TITLE,
            fontSize: '18px',
            fill: DESIGN_TOKENS.texteMenu,
            fontStyle: 'normal',
        }),
        DEPTH.PAUSE_TITLE
    );
    elements.push(pauseTitle);

    const pauseHint = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        pause.title + 22,
        `${pauseResumeHint()} · ${menuHint()}`,
        panelChromeTextStyle({
            fontSize: FONT_SIZE_HINT,
            fill: DESIGN_TOKENS.texteSecondaire,
            fontStyle: 'italic',
        }),
        DEPTH.PAUSE_TITLE
    );
    elements.push(pauseHint);

    buildPauseActionButton(ui.scene, elements, {
        cy: pause.resumeBtn,
        label: 'REPRENDRE',
        focusKey: 'pauseResume',
        onAction: onResume,
    });
    buildPauseActionButton(ui.scene, elements, {
        cy: pause.menuBtn,
        label: 'MENU',
        focusKey: 'pauseMenu',
        onAction: onMenu,
    });

    bindAccessibilityAction('pauseResume', onResume);
    bindAccessibilityAction('pauseMenu', onMenu);
    setAccessibilityControlLabel('pauseResume', pauseResumeHint());
    syncAccessibilityLayer(ui.scene.game);

    return { elements };
}
