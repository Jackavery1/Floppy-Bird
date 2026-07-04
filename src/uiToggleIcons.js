import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';

const TRAINING_ON = hexVersPhaser(DESIGN_TOKENS.boutonOptionsStroke);
const TRAINING_INNER = hexVersPhaser(DESIGN_TOKENS.toggleTrainingInner);
const STROKE_OFF = hexVersPhaser(DESIGN_TOKENS.texteHintMenu);
const LOCKED = hexVersPhaser(DESIGN_TOKENS.texteSecondaire);
const LOCKED_DARK = hexVersPhaser(DESIGN_TOKENS.texteVerrouille);
const HARDCORE_ON = hexVersPhaser(DESIGN_TOKENS.toggleHardcoreOn);
const HARDCORE_INNER = hexVersPhaser(DESIGN_TOKENS.toggleHardcoreInner);

/** @param {import('phaser').GameObjects.Graphics} g @param {boolean} enabled */
export function drawTrainingToggleIcon(g, enabled) {
    g.clear();
    const s = 10;
    const half = s / 2;
    if (enabled) {
        g.fillStyle(TRAINING_ON, 1);
        g.fillRect(-half, -half, s, s);
        g.fillStyle(TRAINING_INNER, 1);
        g.fillRect(-half + 2, -half + 2, s - 4, s - 4);
    } else {
        g.lineStyle(2, STROKE_OFF, 1);
        g.strokeRect(-half, -half, s, s);
    }
}

/** @param {import('phaser').GameObjects.Graphics} g @param {boolean} enabled @param {boolean} unlocked */
export function drawHardcoreToggleIcon(g, enabled, unlocked) {
    g.clear();
    if (!unlocked) {
        g.fillStyle(LOCKED, 1);
        g.fillRect(-5, -1, 10, 7);
        g.fillRect(-6, -5, 12, 5);
        g.fillStyle(LOCKED_DARK, 1);
        g.fillRect(-2, -3, 4, 3);
        return;
    }
    const s = 10;
    const half = s / 2;
    if (enabled) {
        g.fillStyle(HARDCORE_ON, 1);
        g.fillRect(-half, -half, s, s);
        g.fillStyle(HARDCORE_INNER, 1);
        g.fillRect(-half + 2, -half + 2, s - 4, s - 4);
    } else {
        g.lineStyle(2, STROKE_OFF, 1);
        g.strokeRect(-half, -half, s, s);
    }
}
