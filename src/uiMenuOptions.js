import { GAME_CONFIG } from './config.js';
import { cycleSoundLevel, formatSoundLabel, isAudioAvailable } from './audio.js';
import {
    modesHintLine,
    trainingToggleLabel,
    hardcoreToggleLabel,
    optionsButtonLabel,
    classicModeHint,
} from './device.js';
import { buildMetaContext } from './metaContext.js';
import { isHardcoreUnlocked } from './hardcoreUnlock.js';
import {
    addCenteredText,
    applyFittedLabel,
    MIN_TOUCH,
    MENU_BTN_COLOR,
    PANEL_TEXT_MAX_WIDTH,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';
import { buildMenuPanelBackdrop, buildMenuToggleButton, setMenuPanelVisible, syncMenuChromeVisibility } from './uiMenuPanel.js';

/** @param {import('./ui.js').UI} ui */
export function refreshOptionsButtonLabel(ui) {
    if (!ui._optionsBtnLabel) return;
    ui._optionsBtnLabel.setText(optionsButtonLabel(ui._optionsOpen));
}

/** @param {import('./ui.js').UI} ui */
export function refreshHardcoreLockState(ui) {
    if (!ui._hardcoreLabel) return;
    const ctx = buildMetaContext(ui.scene);
    const unlocked = isHardcoreUnlocked(ctx);
    applyHardcoreLabel(ui, ui.scene.hardcoreMode, unlocked);
    if (unlocked) {
        ui._hardcoreHit?.setInteractive?.({ useHandCursor: true });
    } else {
        ui._hardcoreHit?.disableInteractive?.();
    }
}

/** @param {import('./ui.js').UI} ui @param {boolean} visible */
function setOptionsContentVisible(ui, visible) {
    setMenuPanelVisible(ui._optionsPanelElements, visible);
}

const TRAINING_LABEL_STYLE = {
    fontSize: '12px',
    fontStyle: 'bold',
    stroke: '#0d1117',
    strokeThickness: 2,
};

export function applyTrainingLabel(ui, trainingMode) {
    if (!ui._trainingLabel) return;
    const text = trainingToggleLabel(trainingMode);
    applyFittedLabel(ui.scene, ui._trainingLabel, text, {
        ...TRAINING_LABEL_STYLE,
        fill: trainingMode ? '#81D4FA' : '#B0BEC5',
    }, PANEL_TEXT_MAX_WIDTH);
    ui._trainingLabel.setColor(trainingMode ? '#81D4FA' : '#B0BEC5');
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
}

/** @param {import('./ui.js').UI} ui @param {boolean} open */
export function setMenuOptionsOpen(ui, open) {
    ui._optionsOpen = open;
    ui._optionsBackdrop?.setVisible(open);
    setOptionsContentVisible(ui, open);
    refreshOptionsButtonLabel(ui);
    syncMenuChromeVisibility(ui);
}

/** @param {import('./ui.js').UI} ui */
export function toggleMenuOptions(ui) {
    if (ui._optionsOpen) {
        setMenuOptionsOpen(ui, false);
        return;
    }
    ui._closeAllMenuPanels?.();
    setMenuOptionsOpen(ui, true);
}

function soundIcon(label) {
    if (label === 'OFF') return '🔇';
    if (label === 'indisponible') return '🔈';
    return '🔊';
}

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements */
function buildOptionsContent(ui, elements) {
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
        }, 56,
    );
    ui._optionsPanelElements.push(ui._classicHint);
    elements.push(ui._classicHint);

    ui._trainingLabel = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.training,
        trainingToggleLabel(scene.trainingMode), {
            ...TRAINING_LABEL_STYLE,
            fill: scene.trainingMode ? '#81D4FA' : '#B0BEC5',
        }, 56,
    );
    applyTrainingLabel(ui, scene.trainingMode);
    ui._optionsPanelElements.push(ui._trainingLabel);
    elements.push(ui._trainingLabel);

    ui._trainingHit = scene.add.rectangle(
        GAME_CONFIG.centerX, panel.training, 220, MIN_TOUCH, 0x000000, 0,
    );
    ui._trainingHit.setDepth(57);
    ui._trainingHit.setInteractive({ useHandCursor: true });
    ui._trainingHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        scene.toggleTraining();
    });
    ui._optionsPanelElements.push(ui._trainingHit);
    elements.push(ui._trainingHit);

    ui._hardcoreLabel = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.hardcore,
        hardcoreToggleLabel(scene.hardcoreMode, hardcoreUnlocked), {
            ...TRAINING_LABEL_STYLE,
            fill: hardcoreUnlocked
                ? (scene.hardcoreMode ? '#FF8A80' : '#B0BEC5')
                : '#78909C',
        }, 56,
    );
    applyHardcoreLabel(ui, scene.hardcoreMode, hardcoreUnlocked);
    ui._optionsPanelElements.push(ui._hardcoreLabel);
    elements.push(ui._hardcoreLabel);

    ui._hardcoreHit = scene.add.rectangle(
        GAME_CONFIG.centerX, panel.hardcore, 220, MIN_TOUCH, 0x000000, 0,
    );
    ui._hardcoreHit.setDepth(57);
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
        `${soundIcon(formatSoundLabel(isAudioAvailable()))} SON · ${formatSoundLabel(isAudioAvailable())}`,
        { fontSize: '12px', fill: '#ECEFF1', stroke: '#0d1117', strokeThickness: 2 }, 56,
    );
    ui._optionsPanelElements.push(ui._muteText);
    elements.push(ui._muteText);

    ui._muteHit = scene.add.rectangle(
        GAME_CONFIG.centerX, panel.mute, 160, MIN_TOUCH, 0x000000, 0,
    );
    ui._muteHit.setDepth(57);
    if (isAudioAvailable()) {
        ui._muteHit.setInteractive({ useHandCursor: true });
        ui._muteHit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            cycleSoundLevel();
            const label = formatSoundLabel(isAudioAvailable());
            ui._muteText.setText(`${soundIcon(label)} SON · ${label}`);
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
        }, 56,
    );
    ui._optionsPanelElements.push(ui._hint2);
    elements.push(ui._hint2);
}

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements @param {ReturnType<import('./uiLayout.js').computeMenuLayout>} layout */
export function buildMenuOptions(ui, elements, layout) {
    const scene = ui.scene;
    const panel = UI_LAYOUT.optionsPanel;
    ui._optionsOpen = false;

    const btn = buildMenuToggleButton(scene, elements, {
        cx: layout.optionsBtn,
        cy: layout.menuRow,
        width: layout.menuBtnW,
        depth: 53,
        color: MENU_BTN_COLOR,
        stroke: 0x42A5F5,
        labelText: optionsButtonLabel(false),
        labelStroke: '#0D47A1',
        onToggle: () => toggleMenuOptions(ui),
    });
    ui._optionsBtnBg = btn.bg;
    ui._optionsBtnLabel = btn.label;
    ui._optionsBtnHit = btn.hit;

    ui._optionsBackdrop = buildMenuPanelBackdrop(scene, panel);
    elements.push(ui._optionsBackdrop);

    buildOptionsContent(ui, elements);
    setMenuOptionsOpen(ui, false);
}
