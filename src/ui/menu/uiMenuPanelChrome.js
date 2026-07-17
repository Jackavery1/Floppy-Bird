import { GAME_CONFIG } from '../../config.js';
import { DESIGN_TOKENS, hexVersPhaser, panelChromeTextStyle } from '../../designTokens.js';
import { bindUnifiedInteractiveFocus } from '../a11y/uiDomAccessibilityControls.js';
import { drawPanelPillButton } from '../shared/uiPhaserComponents.js';
import { addCenteredText, DEPTH, MIN_TOUCH, stopUiEvent } from '../shared/uiLayout.js';

export const PANEL_SHELL_RADIUS = 10;

export { drawPanelPillButton };

/**
 * @param {import('phaser').Scene} scene
 * @param {{ panelTop: number, panelH: number, w: number }} panel
 * @param {{ fill: string, stroke: string, radius?: number }} theme
 */
export function buildStyledPanelBackdrop(scene, panel, theme) {
    const x = GAME_CONFIG.centerX - panel.w / 2;
    const y = panel.panelTop;
    const radius = theme.radius ?? PANEL_SHELL_RADIUS;
    const fill = hexVersPhaser(theme.fill);
    const stroke = hexVersPhaser(theme.stroke);

    const frame = scene.add.graphics().setDepth(DEPTH.PANEL_BACKDROP);
    frame.fillStyle(fill, 0.94);
    frame.fillRoundedRect(x, y, panel.w, panel.panelH, radius);
    frame.lineStyle(2, stroke, 0.88);
    frame.strokeRoundedRect(x, y, panel.w, panel.panelH, radius);
    frame.lineStyle(1, stroke, 0.24);
    frame.strokeRoundedRect(x + 4, y + 4, panel.w - 8, panel.panelH - 8, Math.max(radius - 3, 4));

    const hit = scene.add.rectangle(
        GAME_CONFIG.centerX,
        y + panel.panelH / 2,
        panel.w,
        panel.panelH,
        0,
        0
    );
    hit.setDepth(DEPTH.PANEL_BACKDROP);
    hit.setInteractive();
    hit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
    });

    const backdrop = {
        frame,
        hit,
        setVisible(visible) {
            frame.setVisible(visible);
            hit.setVisible(visible);
        },
        setDepth(depth) {
            frame.setDepth(depth);
            hit.setDepth(depth);
        },
    };
    backdrop.setVisible(false);
    return backdrop;
}

/**
 * @param {import('phaser').Scene} scene
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {{
 *   cx: number, cy: number, width: number, depth: number,
 *   height?: number,
 *   color: number, stroke: number, hoverColor?: number,
 *   labelText: string, labelStroke: string,
 *   labelStyle?: Phaser.Types.GameObjects.Text.TextStyle,
 *   focusKey?: keyof typeof import('../a11y/uiDomAccessibilityControlDefs.js').CONTROL_DEFS,
 *   onToggle: () => void,
 * }} cfg
 */
export function buildPanelPillButton(scene, elements, cfg) {
    const touchW = Math.max(cfg.width, MIN_TOUCH);
    const h = Math.max(cfg.height ?? MIN_TOUCH, MIN_TOUCH);
    const bg = scene.add.graphics().setDepth(cfg.depth);
    const hoverColor = cfg.hoverColor ?? hexVersPhaser(DESIGN_TOKENS.boutonMenuHover);

    const paint = (fill, fillAlpha = 0.9) => {
        drawPanelPillButton(bg, cfg.cx, cfg.cy, cfg.width, h, fill, fillAlpha, cfg.stroke, 0.62);
    };
    paint(cfg.color);

    const labelStyle =
        cfg.labelStyle ??
        panelChromeTextStyle({
            fill: DESIGN_TOKENS.texteMenu,
            fontStyle: 'bold',
            stroke: cfg.labelStroke,
        });
    const label = addCenteredText(scene, cfg.cx, cfg.cy, cfg.labelText, labelStyle, cfg.depth + 1);
    elements.push(bg, label);

    const hit = scene.add.rectangle(cfg.cx, cfg.cy, touchW, h, 0x000000, 0);
    hit.setDepth(cfg.depth + 2);
    hit.setInteractive({ useHandCursor: true });
    const onFocus = () => paint(hoverColor, 0.95);
    const onBlur = () => paint(cfg.color);
    if (cfg.focusKey) {
        bindUnifiedInteractiveFocus(cfg.focusKey, onFocus, onBlur).attachHit(hit);
    } else {
        hit.on('pointerover', onFocus);
        hit.on('pointerout', onBlur);
    }
    hit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        cfg.onToggle();
    });
    elements.push(hit);

    return { bg, label, hit, paint };
}
