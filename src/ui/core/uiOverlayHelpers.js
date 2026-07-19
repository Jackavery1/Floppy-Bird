import { GAME_CONFIG } from '../../config.js';
import { Utils } from '../../utils.js';
import {
    DEPTH,
    GAME_OVER_RESTART_BTN_COLOR,
    GAME_OVER_RESTART_BTN_WIDTH,
    GAME_OVER_RESTART_BTN_HEIGHT,
    MENU_BTN_COLOR,
    UI_LAYOUT,
} from '../shared/uiLayout.js';

/** @param {import('./ui.js').UI} ui @param {'menu' | 'pause' | 'gameOver'} key */
export function clearOverlay(ui, key) {
    Utils.clearElements(ui._overlays[key]);
}

/**
 * @param {import('./ui.js').UI} ui
 * @param {'menu' | 'pause' | 'gameOver'} key
 * @param {import('phaser').GameObjects.GameObject[]} elements
 */
export function setOverlay(ui, key, elements) {
    clearOverlay(ui, key);
    ui._overlays[key].push(...elements);
}

/**
 * @param {import('./ui.js').UI} ui
 * @param {number} [alpha]
 * @param {number} [depth]
 * @param {number} [color]
 */
export function createOverlay(ui, alpha = 0.7, depth = DEPTH.OVERLAY_DIM, color = 0x000000) {
    return ui.scene.add
        .rectangle(
            GAME_CONFIG.centerX,
            GAME_CONFIG.centerY,
            GAME_CONFIG.width,
            GAME_CONFIG.height,
            color,
            alpha
        )
        .setDepth(depth);
}

/** @param {import('./ui.js').UI} ui @param {number} restartBtnY @param {number} [fillColor] */
export function drawGameOverRestartButton(
    ui,
    restartBtnY,
    fillColor = GAME_OVER_RESTART_BTN_COLOR
) {
    const g = ui._restartBtnGraphics;
    if (!g) return;
    g.clear();
    g.fillStyle(fillColor, 1);
    g.fillRoundedRect(
        GAME_CONFIG.centerX - GAME_OVER_RESTART_BTN_WIDTH / 2,
        restartBtnY - GAME_OVER_RESTART_BTN_HEIGHT / 2,
        GAME_OVER_RESTART_BTN_WIDTH,
        GAME_OVER_RESTART_BTN_HEIGHT,
        UI_LAYOUT.menuBtn.radius
    );
}

/** @param {import('./ui.js').UI} ui @param {number} menuBtnY @param {number} [fillColor] */
export function drawGameOverMenuButton(ui, menuBtnY, fillColor = MENU_BTN_COLOR) {
    const { menuBtn } = UI_LAYOUT;
    const g = ui._menuBtnGraphics;
    if (!g) return;
    g.clear();
    g.fillStyle(fillColor, 1);
    g.fillRoundedRect(
        GAME_CONFIG.centerX - menuBtn.width / 2,
        menuBtnY - menuBtn.height / 2,
        menuBtn.width,
        menuBtn.height,
        menuBtn.radius
    );
}
