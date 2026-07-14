/**
 * Design system Phaser — primitives graphiques alignées sur {@link DESIGN_TOKENS}.
 * Point d’entrée unique pour panneaux, CTA et chrome HUD canvas (complète tokens.html).
 */
import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';
import { UI_LAYOUT } from './uiLayoutConstants.js';

/** Insets hitbox collision oiseau vs sprite visible (équité gameplay). */
export const BIRD_COLLISION_INSET = Object.freeze({ x: 3, y: 2 });

/** Couleurs debug : hitbox collision vs enveloppe sprite. */
export const DEBUG_HITBOX_COLORS = Object.freeze({
    collision: 0x00ff88,
    sprite: 0x44ccff,
    pipe: 0xff6644,
});

/**
 * @param {import('phaser').GameObjects.Graphics} g
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {keyof typeof DESIGN_TOKENS} fillKey
 * @param {keyof typeof DESIGN_TOKENS} strokeKey
 * @param {number} [radius]
 * @param {number} [fillAlpha]
 */
export function drawTokenPanel(g, x, y, w, h, fillKey, strokeKey, radius = 10, fillAlpha = 0.94) {
    const fill = hexVersPhaser(DESIGN_TOKENS[fillKey]);
    const stroke = hexVersPhaser(DESIGN_TOKENS[strokeKey]);
    g.fillStyle(fill, fillAlpha);
    g.fillRoundedRect(x, y, w, h, radius);
    g.lineStyle(2, stroke, 0.88);
    g.strokeRoundedRect(x, y, w, h, radius);
}

/**
 * @param {import('phaser').GameObjects.Graphics} g
 * @param {number} cx
 * @param {number} cy
 * @param {number} w
 * @param {number} h
 * @param {number} fill
 * @param {number} fillAlpha
 * @param {number} stroke
 * @param {number} strokeAlpha
 * @param {number} [radius]
 */
export function drawPanelPillButton(
    g,
    cx,
    cy,
    w,
    h,
    fill,
    fillAlpha,
    stroke,
    strokeAlpha,
    radius = UI_LAYOUT.menuBtn.radius
) {
    const x = cx - w / 2;
    const y = cy - h / 2;
    g.clear();
    g.fillStyle(fill, fillAlpha);
    g.fillRoundedRect(x, y, w, h, radius);
    g.lineStyle(2, stroke, strokeAlpha);
    g.strokeRoundedRect(x, y, w, h, radius);
}

/**
 * @param {import('phaser').GameObjects.Graphics} g
 * @param {number} cx
 * @param {number} cy
 * @param {number} size
 * @param {number} fillColor
 */
export function drawPauseChrome(g, cx, cy, size, fillColor) {
    g.clear();
    g.fillStyle(fillColor, 1);
    g.fillRoundedRect(cx - size / 2, cy - size / 2, size, size, 5);
    g.fillStyle(0xffffff, 1);
    const barW = 6;
    const barH = 20;
    const gap = 6;
    g.fillRect(cx - gap / 2 - barW, cy - barH / 2, barW, barH);
    g.fillRect(cx + gap / 2, cy - barH / 2, barW, barH);
}
