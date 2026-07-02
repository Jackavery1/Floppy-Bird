import { GAME_CONFIG } from './config.js';
import {
    addCenteredText,
    MIN_TOUCH,
    stopUiEvent,
} from './uiLayout.js';

/** @param {import('phaser').GameObjects.GameObject[]} elements */
export function setMenuPanelVisible(elements, visible) {
    elements?.forEach(el => el?.setVisible?.(visible));
}

/** @param {import('./ui.js').UI} ui */
export function syncMenuChromeVisibility(ui) {
    const panelOpen = ui._optionsOpen || ui._scoresOpen || ui._skinsOpen;
    ui._menuChromeElements?.forEach(el => el?.setVisible?.(!panelOpen));
}

/**
 * @param {import('phaser').Scene} scene
 * @param {{ panelTop: number, panelH: number, w: number }} panel
 */
export function buildMenuPanelBackdrop(scene, panel) {
    const backdrop = scene.add.rectangle(
        GAME_CONFIG.centerX,
        panel.panelTop + panel.panelH / 2,
        panel.w,
        panel.panelH,
        0x0d1117,
        0.94,
    );
    backdrop.setDepth(55);
    backdrop.setStrokeStyle(2, 0x37474F, 0.9);
    backdrop.setVisible(false);
    return backdrop;
}

/**
 * @param {import('phaser').Scene} scene
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {{ cx: number, cy: number, width: number, depth: number, color: number, stroke: number, labelText: string, labelStroke: string, onToggle: () => void }} cfg
 */
export function buildMenuToggleButton(scene, elements, cfg) {
    const bg = scene.add.rectangle(
        cfg.cx, cfg.cy, cfg.width, MIN_TOUCH, cfg.color, 0.88,
    );
    bg.setDepth(cfg.depth);
    bg.setStrokeStyle(2, cfg.stroke, 0.6);
    elements.push(bg);

    const label = addCenteredText(scene, cfg.cx, cfg.cy, cfg.labelText, {
        fontSize: '11px',
        fill: '#FFFFFF',
        fontStyle: 'bold',
        stroke: cfg.labelStroke,
        strokeThickness: 2,
    }, cfg.depth + 1);
    elements.push(label);

    const hit = scene.add.rectangle(cfg.cx, cfg.cy, cfg.width, MIN_TOUCH, 0x000000, 0);
    hit.setDepth(cfg.depth + 2);
    hit.setInteractive({ useHandCursor: true });
    hit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        cfg.onToggle();
    });
    elements.push(hit);

    return { bg, label, hit };
}
