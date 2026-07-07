import { buildMuteControls } from './uiMenuOptionsMute.js';
import { UI_LAYOUT } from './uiLayout.js';
import { beginOptionsSection } from './uiMenuOptionsSection.js';

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements */
export function buildSettingsSection(ui, elements) {
    const { add } = beginOptionsSection(ui, ui.scene, elements, '_optionsSettingsElements');
    buildMuteControls(ui, add, UI_LAYOUT.optionsPanel.settingsMute);
}
