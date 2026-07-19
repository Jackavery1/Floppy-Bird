import { cycleSoundLevel, formatSoundLabel, isAudioAvailable } from '../../audio.js';
import { DESIGN_TOKENS, menuTextStyle } from '../../designTokens.js';
import { FONT_SIZE_HINT } from '../shared/uiLayoutConstants.js';
import {
    announceAccessibility,
    bindAccessibilityAction,
    bindUnifiedInteractiveFocus,
    setAccessibilityControlLabel,
} from '../a11y/uiDomAccessibilityControls.js';
import { addCenteredText, DEPTH, MIN_TOUCH, stopUiEvent } from '../shared/uiLayout.js';
import { GAME_CONFIG } from '../../config.js';

function libelleMute(label) {
    return `SON · ${label}`;
}

function muteA11yLabel(label) {
    return `Son ${label}`;
}

/** @param {import('../core/ui.js').UI} ui */
function cycleMuteLabel(ui) {
    if (!isAudioAvailable()) return;
    cycleSoundLevel();
    const label = formatSoundLabel(isAudioAvailable());
    ui._muteText.setText(libelleMute(label));
    setAccessibilityControlLabel('menuMute', muteA11yLabel(label));
    announceAccessibility(muteA11yLabel(label));
}

/**
 * @param {import('../core/ui.js').UI} ui
 * @param {(...objs: import('phaser').GameObjects.GameObject[]) => void} add
 * @param {number} y
 */
export function buildMuteControls(ui, add, y) {
    const scene = ui.scene;
    const initialLabel = formatSoundLabel(isAudioAvailable());

    ui._muteText = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        y,
        libelleMute(initialLabel),
        menuTextStyle({ fontSize: FONT_SIZE_HINT, fill: DESIGN_TOKENS.texteClair }),
        DEPTH.PANEL_FRAME
    );
    add(ui._muteText);

    ui._muteHit = scene.add.rectangle(GAME_CONFIG.centerX, y, 160, MIN_TOUCH, 0x000000, 0);
    ui._muteHit.setDepth(DEPTH.PANEL_HIT);
    if (isAudioAvailable()) {
        setAccessibilityControlLabel('menuMute', muteA11yLabel(initialLabel));
        ui._muteHit.setInteractive({ useHandCursor: true });
        bindUnifiedInteractiveFocus(
            'menuMute',
            () => {
                ui._muteText.setAlpha(1);
                ui._muteText.setScale(1.06);
            },
            () => {
                ui._muteText.setAlpha(1);
                ui._muteText.setScale(1);
            }
        ).attachHit(ui._muteHit);
        ui._muteHit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            cycleMuteLabel(ui);
        });
        bindAccessibilityAction('menuMute', () => cycleMuteLabel(ui));
    }
    add(ui._muteHit);
}
