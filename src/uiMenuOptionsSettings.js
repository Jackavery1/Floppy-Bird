import { buildMuteControls } from './uiMenuOptionsMute.js';
import { UI_LAYOUT } from './uiLayout.js';
import { beginOptionsSection } from './uiMenuOptionsSection.js';
import { buildModeControls } from './uiMenuOptionsModes.js';

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements */
export function buildSettingsSection(ui, _elements) {
    const panel = UI_LAYOUT.optionsPanel;
    const { add } = beginOptionsSection(ui, ui.scene, '_optionsSettingsElements');
    buildMuteControls(ui, add, panel.settingsMute);
    buildModeControls(ui, add, panel);
}
