import { GAME_CONFIG } from './config.js';
import { optionsControlsHint } from './device.js';
import { DESIGN_TOKENS, hexVersPhaser, menuTextStyle } from './designTokens.js';
import { addCenteredText, DEPTH, FONT_SIZE_HINT, MENU_BTN_COLOR, UI_LAYOUT } from './uiLayout.js';
import { buildMenuToggleButton } from './uiMenuPanel.js';
import { buildModeControls } from './uiMenuOptionsModes.js';
import { buildMuteControls } from './uiMenuOptionsMute.js';

export {
    applyHardcoreLabel,
    applyTrainingLabel,
    setOptionsContentVisible,
} from './uiMenuOptionsLabels.js';

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements */
export function buildOptionsContent(ui, elements) {
    const scene = ui.scene;
    const panel = UI_LAYOUT.optionsPanel;
    ui._optionsPanelElements = [];

    buildModeControls(ui, elements, panel);
    buildMuteControls(ui, elements, panel.mute);

    ui._hint2 = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.hint2,
        optionsControlsHint(),
        menuTextStyle({
            fontSize: FONT_SIZE_HINT,
            fill: DESIGN_TOKENS.texteSecondaire,
            align: 'center',
        }),
        DEPTH.PANEL_FRAME
    );
    ui._optionsPanelElements.push(ui._hint2);
    elements.push(ui._hint2);

    const closeBtn = buildMenuToggleButton(scene, elements, {
        cx: GAME_CONFIG.centerX,
        cy: panel.closeBtn,
        width: 160,
        depth: DEPTH.PANEL_FRAME,
        color: MENU_BTN_COLOR,
        stroke: hexVersPhaser(DESIGN_TOKENS.boutonOptionsStroke),
        labelText: '◂ RETOUR',
        labelStroke: DESIGN_TOKENS.contourOptions,
        onToggle: () => ui._optionsPanelController?.setOpen(false),
    });
    ui._optionsPanelElements.push(closeBtn.bg, closeBtn.label, closeBtn.hit);
    ui._optionsCloseHit = closeBtn.hit;
}
