import { GAME_CONFIG } from './config.js';
import { modesHintLine } from './device.js';
import { addCenteredText, DEPTH, UI_LAYOUT } from './uiLayout.js';
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
        modesHintLine(),
        {
            fontSize: '10px',
            fill: '#78909C',
            stroke: '#0d1117',
            strokeThickness: 2,
            align: 'center',
        },
        DEPTH.PANEL_FRAME
    );
    ui._optionsPanelElements.push(ui._hint2);
    elements.push(ui._hint2);
}
