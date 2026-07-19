import { isHapticsEnabled, toggleHaptics } from '../../haptics.js';
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

function formatHapticsLabel(enabled) {
    return enabled ? 'ON' : 'OFF';
}

function libelleHaptics(enabled) {
    return `VIBRATION · ${formatHapticsLabel(enabled)}`;
}

function hapticsA11yLabel(enabled) {
    return `Vibration ${formatHapticsLabel(enabled)}`;
}

/** @param {import('../core/ui.js').UI} ui */
function cycleHapticsLabel(ui) {
    const enabled = toggleHaptics();
    ui._hapticsText.setText(libelleHaptics(enabled));
    setAccessibilityControlLabel('menuHaptics', hapticsA11yLabel(enabled));
    announceAccessibility(hapticsA11yLabel(enabled));
}

/**
 * @param {import('../core/ui.js').UI} ui
 * @param {(...objs: import('phaser').GameObjects.GameObject[]) => void} add
 * @param {number} y
 */
export function buildHapticsControls(ui, add, y) {
    const scene = ui.scene;
    const initial = isHapticsEnabled();

    ui._hapticsText = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        y,
        libelleHaptics(initial),
        menuTextStyle({ fontSize: FONT_SIZE_HINT, fill: DESIGN_TOKENS.texteClair }),
        DEPTH.PANEL_FRAME
    );
    add(ui._hapticsText);

    ui._hapticsHit = scene.add.rectangle(GAME_CONFIG.centerX, y, 180, MIN_TOUCH, 0x000000, 0);
    ui._hapticsHit.setDepth(DEPTH.PANEL_HIT);
    setAccessibilityControlLabel('menuHaptics', hapticsA11yLabel(initial));
    ui._hapticsHit.setInteractive({ useHandCursor: true });
    bindUnifiedInteractiveFocus(
        'menuHaptics',
        () => {
            ui._hapticsText.setAlpha(1);
            ui._hapticsText.setScale(1.06);
        },
        () => {
            ui._hapticsText.setAlpha(1);
            ui._hapticsText.setScale(1);
        }
    ).attachHit(ui._hapticsHit);
    ui._hapticsHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        cycleHapticsLabel(ui);
    });
    bindAccessibilityAction('menuHaptics', () => cycleHapticsLabel(ui));
    add(ui._hapticsHit);
}
