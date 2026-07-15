import { cycleSoundLevel, formatSoundLabel, isAudioAvailable } from './audio.js';
import { DESIGN_TOKENS, menuTextStyle } from './designTokens.js';
import { FONT_SIZE_HINT } from './uiLayoutConstants.js';
import {
    bindAccessibilityAction,
    bindUnifiedInteractiveFocus,
} from './uiDomAccessibilityControls.js';
import { addCenteredText, DEPTH, MIN_TOUCH, stopUiEvent } from './uiLayout.js';
import { GAME_CONFIG } from './config.js';

function iconeSon(label) {
    if (label === 'OFF') return '🔇';
    if (label === 'indisponible') return '🔈';
    return '🔊';
}

function libelleMute(label) {
    return `${iconeSon(label)} SON · ${label}`;
}

/** @param {import('./ui.js').UI} ui */
function cycleMuteLabel(ui) {
    if (!isAudioAvailable()) return;
    cycleSoundLevel();
    ui._muteText.setText(libelleMute(formatSoundLabel(isAudioAvailable())));
}

/**
 * @param {import('./ui.js').UI} ui
 * @param {(...objs: import('phaser').GameObjects.GameObject[]) => void} add
 * @param {number} y
 */
export function buildMuteControls(ui, add, y) {
    const scene = ui.scene;

    ui._muteText = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        y,
        libelleMute(formatSoundLabel(isAudioAvailable())),
        menuTextStyle({ fontSize: FONT_SIZE_HINT, fill: DESIGN_TOKENS.texteClair }),
        DEPTH.PANEL_FRAME
    );
    add(ui._muteText);

    ui._muteHit = scene.add.rectangle(GAME_CONFIG.centerX, y, 160, MIN_TOUCH, 0x000000, 0);
    ui._muteHit.setDepth(DEPTH.PANEL_HIT);
    if (isAudioAvailable()) {
        ui._muteHit.setInteractive({ useHandCursor: true });
        bindUnifiedInteractiveFocus(
            'menuMute',
            () => ui._muteText.setAlpha(1),
            () => ui._muteText.setAlpha(0.92)
        ).attachHit(ui._muteHit);
        ui._muteHit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            cycleMuteLabel(ui);
        });
        bindAccessibilityAction('menuMute', () => cycleMuteLabel(ui));
    }
    add(ui._muteHit);
}
