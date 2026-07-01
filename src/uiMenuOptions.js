import { GAME_CONFIG } from './config.js';
import { cycleSoundLevel, formatSoundLabel, isAudioAvailable } from './audio.js';
import {
    modesHintLine,
    trainingToggleLabel,
    hardcoreToggleLabel,
    dailyToggleLabel,
    optionsButtonLabel,
} from './device.js';
import { getMenuDailySubtitle } from './dailyChallenge.js';
import {
    addCenteredText,
    MIN_TOUCH,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';
import { appendMetaMenu } from './uiMeta.js';

/** @param {import('./ui.js').UI} ui */
export function refreshOptionsButtonLabel(ui, trainingMode, hardcoreMode, dailyChallengeMode) {
    if (!ui._optionsBtnLabel) return;
    ui._optionsBtnLabel.setText(
        optionsButtonLabel(ui._optionsOpen, trainingMode, hardcoreMode, dailyChallengeMode),
    );
}

/** @param {import('./ui.js').UI} ui */
function setOptionsPanelVisible(ui, visible) {
    ui._optionsBackdrop?.setVisible(visible);
    ui._optionsPanelElements?.forEach(el => el?.setVisible?.(visible));
}

/** @param {import('./ui.js').UI} ui */
export function setMenuOptionsOpen(ui, open, trainingMode, hardcoreMode, dailyChallengeMode) {
    ui._optionsOpen = open;
    setOptionsPanelVisible(ui, open);
    refreshOptionsButtonLabel(ui, trainingMode, hardcoreMode, dailyChallengeMode);
}

/** @param {import('./ui.js').UI} ui */
export function toggleMenuOptions(ui, trainingMode, hardcoreMode, dailyChallengeMode) {
    setMenuOptionsOpen(ui, !ui._optionsOpen, trainingMode, hardcoreMode, dailyChallengeMode);
}

/** @param {import('./ui.js').UI} ui @param {import('phaser').GameObjects.GameObject[]} elements */
export function buildMenuOptions(ui, elements, layout, trainingMode, hardcoreMode, dailyChallengeMode) {
    const scene = ui.scene;
    const panel = UI_LAYOUT.optionsPanel;
    ui._optionsOpen = false;
    ui._optionsPanelElements = [];

    ui._optionsBtnLabel = addCenteredText(
        scene, GAME_CONFIG.centerX, layout.optionsBtn,
        optionsButtonLabel(false, trainingMode, hardcoreMode, dailyChallengeMode), {
            fontSize: '11px',
            fill: '#B0BEC5',
            fontStyle: 'bold',
        }, 53,
    );
    elements.push(ui._optionsBtnLabel);

    ui._optionsBtnHit = scene.add.rectangle(
        GAME_CONFIG.centerX, layout.optionsBtn, 220, MIN_TOUCH, 0x000000, 0,
    );
    ui._optionsBtnHit.setDepth(54);
    ui._optionsBtnHit.setInteractive({ useHandCursor: true });
    ui._optionsBtnHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        toggleMenuOptions(ui, scene.trainingMode, scene.hardcoreMode, scene.dailyChallengeMode);
    });
    elements.push(ui._optionsBtnHit);

    ui._optionsBackdrop = scene.add.rectangle(
        GAME_CONFIG.centerX,
        panel.panelTop + panel.panelH / 2,
        panel.w,
        panel.panelH,
        0x0d1117,
        0.92,
    );
    ui._optionsBackdrop.setDepth(55);
    ui._optionsBackdrop.setVisible(false);
    elements.push(ui._optionsBackdrop);

    ui._dailySubtitle = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.daily,
        getMenuDailySubtitle(dailyChallengeMode), { fontSize: '9px', fill: '#aaaaaa' }, 56,
    );
    ui._optionsPanelElements.push(ui._dailySubtitle);
    elements.push(ui._dailySubtitle);

    ui._trainingLabel = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.training,
        trainingToggleLabel(trainingMode), {
            fontSize: '11px',
            fill: trainingMode ? '#81D4FA' : '#888888',
            fontStyle: 'bold',
        }, 56,
    );
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
        hardcoreToggleLabel(hardcoreMode), {
            fontSize: '11px',
            fill: hardcoreMode ? '#FF8A80' : '#888888',
            fontStyle: 'bold',
        }, 56,
    );
    ui._optionsPanelElements.push(ui._hardcoreLabel);
    elements.push(ui._hardcoreLabel);

    ui._hardcoreHit = scene.add.rectangle(
        GAME_CONFIG.centerX, panel.hardcore, 220, MIN_TOUCH, 0x000000, 0,
    );
    ui._hardcoreHit.setDepth(57);
    ui._hardcoreHit.setInteractive({ useHandCursor: true });
    ui._hardcoreHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        scene.toggleHardcore();
    });
    ui._optionsPanelElements.push(ui._hardcoreHit);
    elements.push(ui._hardcoreHit);

    ui._dailyLabel = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.dailyToggle,
        dailyToggleLabel(dailyChallengeMode), {
            fontSize: '11px',
            fill: dailyChallengeMode ? '#CE93D8' : '#888888',
            fontStyle: 'bold',
        }, 56,
    );
    ui._optionsPanelElements.push(ui._dailyLabel);
    elements.push(ui._dailyLabel);

    ui._dailyHit = scene.add.rectangle(
        GAME_CONFIG.centerX, panel.dailyToggle, 220, MIN_TOUCH, 0x000000, 0,
    );
    ui._dailyHit.setDepth(57);
    ui._dailyHit.setInteractive({ useHandCursor: true });
    ui._dailyHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        scene.toggleDailyChallenge();
    });
    ui._optionsPanelElements.push(ui._dailyHit);
    elements.push(ui._dailyHit);

    const metaLayout = { metaSkin: panel.metaSkin, mute: panel.mute };
    appendMetaMenu(ui, elements, metaLayout);
    ui._skinLabel?.setDepth(56);
    ui._achLabel?.setDepth(56);
    ui._skinHit?.setDepth(57);
    ui._optionsPanelElements.push(ui._skinLabel, ui._achLabel, ui._skinHit);

    ui._muteText = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.mute,
        `SON : ${formatSoundLabel(isAudioAvailable())}`, { fontSize: '11px', fill: '#cccccc' }, 56,
    );
    ui._optionsPanelElements.push(ui._muteText);
    elements.push(ui._muteText);

    ui._muteHit = scene.add.rectangle(
        GAME_CONFIG.centerX, panel.mute, 140, MIN_TOUCH, 0x000000, 0,
    );
    ui._muteHit.setDepth(57);
    if (isAudioAvailable()) {
        ui._muteHit.setInteractive({ useHandCursor: true });
        ui._muteHit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            cycleSoundLevel();
            ui._muteText.setText(`SON : ${formatSoundLabel(isAudioAvailable())}`);
        });
    }
    ui._optionsPanelElements.push(ui._muteHit);
    elements.push(ui._muteHit);

    ui._hint2 = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.hint2,
        modesHintLine(), { fontSize: '9px', fill: '#888888' }, 56,
    );
    ui._optionsPanelElements.push(ui._hint2);
    elements.push(ui._hint2);

    setOptionsPanelVisible(ui, false);
}
