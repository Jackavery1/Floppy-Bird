import { buildMuteControls } from './uiMenuOptionsMute.js';
import { GAME_CONFIG } from './config.js';
import { classicModeHint } from './device.js';
import { DESIGN_TOKENS, panelChromeTextStyle } from './designTokens.js';
import { addCenteredText, DEPTH, FONT_SIZE_HINT, UI_LAYOUT } from './uiLayout.js';
import { beginOptionsSection } from './uiMenuOptionsSection.js';

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements */
export function buildSettingsSection(ui, elements) {
    const panel = UI_LAYOUT.optionsPanel;
    const { add } = beginOptionsSection(ui, ui.scene, elements, '_optionsSettingsElements');
    buildMuteControls(ui, add, panel.settingsMute);

    const classicHint = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        panel.settingsMute + 44,
        classicModeHint(),
        panelChromeTextStyle({
            fontSize: FONT_SIZE_HINT,
            fill: DESIGN_TOKENS.texteSecondaire,
            fontStyle: 'italic',
        }),
        DEPTH.PANEL_FRAME
    );
    classicHint.setWordWrapWidth?.(panel.w - 36);
    add(classicHint);
}
