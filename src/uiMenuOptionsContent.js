import { GAME_CONFIG } from './config.js';
import { cycleSoundLevel, formatSoundLabel, isAudioAvailable } from './audio.js';
import {
    modesHintLine,
    trainingToggleLabel,
    hardcoreToggleLabel,
    classicModeHint,
} from './device.js';
import { buildMetaContext } from './metaContext.js';
import { isHardcoreUnlocked } from './hardcoreUnlock.js';
import {
    addCenteredText,
    applyFittedLabel,
    DEPTH,
    MIN_TOUCH,
    PANEL_TEXT_MAX_WIDTH,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';
import { setMenuPanelVisible } from './uiMenuPanel.js';
import { drawHardcoreToggleIcon, drawTrainingToggleIcon } from './uiToggleIcons.js';

const TOGGLE_ICON_X = GAME_CONFIG.centerX - 98;

const TRAINING_LABEL_STYLE = {
    fontSize: '12px',
    fontStyle: 'bold',
    stroke: '#0d1117',
    strokeThickness: 2,
};

/** @param {import('./ui.js').UI} ui @param {boolean} visible */
export function setOptionsContentVisible(ui, visible) {
    setMenuPanelVisible(ui._optionsPanelElements, visible);
}

export function applyTrainingLabel(ui, trainingMode) {
    if (!ui._trainingLabel) return;
    const text = trainingToggleLabel(trainingMode);
    applyFittedLabel(ui.scene, ui._trainingLabel, text, {
        ...TRAINING_LABEL_STYLE,
        fill: trainingMode ? '#81D4FA' : '#B0BEC5',
    }, PANEL_TEXT_MAX_WIDTH);
    ui._trainingLabel.setColor(trainingMode ? '#81D4FA' : '#B0BEC5');
    if (ui._trainingIcon) drawTrainingToggleIcon(ui._trainingIcon, trainingMode);
}

export function applyHardcoreLabel(ui, hardcoreMode, unlocked) {
    if (!ui._hardcoreLabel) return;
    const text = hardcoreToggleLabel(hardcoreMode, unlocked);
    applyFittedLabel(ui.scene, ui._hardcoreLabel, text, {
        ...TRAINING_LABEL_STYLE,
        fill: !unlocked ? '#78909C' : (hardcoreMode ? '#FF8A80' : '#B0BEC5'),
    }, PANEL_TEXT_MAX_WIDTH);
    ui._hardcoreLabel.setColor(
        !unlocked ? '#78909C' : (hardcoreMode ? '#FF8A80' : '#B0BEC5'),
    );
    if (ui._hardcoreIcon) drawHardcoreToggleIcon(ui._hardcoreIcon, hardcoreMode, unlocked);
}

function soundIcon(label) {
    if (label === 'OFF') return '🔇';
    if (label === 'indisponible') return '🔈';
    return '🔊';
}

function formatMuteLabel(label) {
    return `${soundIcon(label)} SON · ${label}`;
}

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements */
export function buildOptionsContent(ui, elements) {
    const scene = ui.scene;
    const panel = UI_LAYOUT.optionsPanel;
    ui._optionsPanelElements = [];
    const ctx = buildMetaContext(scene);
    const hardcoreUnlocked = isHardcoreUnlocked(ctx);

    ui._classicHint = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.hintLine,
        classicModeHint(), {
            fontSize: '10px', fill: '#B0BEC5',
            stroke: '#0d1117', strokeThickness: 2,
        }, DEPTH.PANEL_FRAME,
    );
    ui._optionsPanelElements.push(ui._classicHint);
    elements.push(ui._classicHint);

    ui._trainingIcon = scene.add.graphics();
    ui._trainingIcon.setPosition(TOGGLE_ICON_X, panel.training);
    ui._trainingIcon.setDepth(DEPTH.PANEL_PREVIEW);
    drawTrainingToggleIcon(ui._trainingIcon, scene.trainingMode);
    ui._optionsPanelElements.push(ui._trainingIcon);
    elements.push(ui._trainingIcon);

    ui._trainingLabel = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.training,
        trainingToggleLabel(scene.trainingMode), {
            ...TRAINING_LABEL_STYLE,
            fill: scene.trainingMode ? '#81D4FA' : '#B0BEC5',
        }, DEPTH.PANEL_FRAME,
    );
    applyTrainingLabel(ui, scene.trainingMode);
    ui._optionsPanelElements.push(ui._trainingLabel);
    elements.push(ui._trainingLabel);

    ui._trainingHit = scene.add.rectangle(
        GAME_CONFIG.centerX, panel.training, 220, MIN_TOUCH, 0x000000, 0,
    );
    ui._trainingHit.setDepth(DEPTH.PANEL_HIT);
    ui._trainingHit.setInteractive({ useHandCursor: true });
    ui._trainingHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        scene.toggleTraining();
    });
    ui._optionsPanelElements.push(ui._trainingHit);
    elements.push(ui._trainingHit);

    ui._hardcoreIcon = scene.add.graphics();
    ui._hardcoreIcon.setPosition(TOGGLE_ICON_X, panel.hardcore);
    ui._hardcoreIcon.setDepth(DEPTH.PANEL_PREVIEW);
    drawHardcoreToggleIcon(ui._hardcoreIcon, scene.hardcoreMode, hardcoreUnlocked);
    ui._optionsPanelElements.push(ui._hardcoreIcon);
    elements.push(ui._hardcoreIcon);

    ui._hardcoreLabel = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.hardcore,
        hardcoreToggleLabel(scene.hardcoreMode, hardcoreUnlocked), {
            ...TRAINING_LABEL_STYLE,
            fill: hardcoreUnlocked
                ? (scene.hardcoreMode ? '#FF8A80' : '#B0BEC5')
                : '#78909C',
        }, DEPTH.PANEL_FRAME,
    );
    applyHardcoreLabel(ui, scene.hardcoreMode, hardcoreUnlocked);
    ui._optionsPanelElements.push(ui._hardcoreLabel);
    elements.push(ui._hardcoreLabel);

    ui._hardcoreHit = scene.add.rectangle(
        GAME_CONFIG.centerX, panel.hardcore, 220, MIN_TOUCH, 0x000000, 0,
    );
    ui._hardcoreHit.setDepth(DEPTH.PANEL_HIT);
    if (hardcoreUnlocked) {
        ui._hardcoreHit.setInteractive({ useHandCursor: true });
        ui._hardcoreHit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            scene.toggleHardcore();
        });
    }
    ui._optionsPanelElements.push(ui._hardcoreHit);
    elements.push(ui._hardcoreHit);

    ui._muteText = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.mute,
        formatMuteLabel(formatSoundLabel(isAudioAvailable())),
        { fontSize: '12px', fill: '#ECEFF1', stroke: '#0d1117', strokeThickness: 2 }, DEPTH.PANEL_FRAME,
    );
    ui._optionsPanelElements.push(ui._muteText);
    elements.push(ui._muteText);

    ui._muteHit = scene.add.rectangle(
        GAME_CONFIG.centerX, panel.mute, 160, MIN_TOUCH, 0x000000, 0,
    );
    ui._muteHit.setDepth(DEPTH.PANEL_HIT);
    if (isAudioAvailable()) {
        ui._muteHit.setInteractive({ useHandCursor: true });
        ui._muteHit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            cycleSoundLevel();
            const label = formatSoundLabel(isAudioAvailable());
            ui._muteText.setText(formatMuteLabel(label));
        });
    }
    ui._optionsPanelElements.push(ui._muteHit);
    elements.push(ui._muteHit);

    ui._hint2 = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.hint2,
        modesHintLine(), {
            fontSize: '10px', fill: '#78909C',
            stroke: '#0d1117', strokeThickness: 2,
            align: 'center',
        }, DEPTH.PANEL_FRAME,
    );
    ui._optionsPanelElements.push(ui._hint2);
    elements.push(ui._hint2);
}
