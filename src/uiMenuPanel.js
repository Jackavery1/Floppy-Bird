import { DESIGN_TOKENS, panelChromeTextStyle } from './designTokens.js';
import { bindUnifiedInteractiveFocus } from './uiDomAccessibilityControls.js';
import {
    addCenteredText,
    applyFittedLabel,
    MENU_BTN_HOVER,
    MIN_TOUCH,
    stopUiEvent,
} from './uiLayout.js';
import { buildStyledPanelBackdrop, buildPanelPillButton } from './uiMenuPanelChrome.js';
import { prefersReducedMotion, sceneTween } from './motion.js';

/** @param {import('phaser').Scene} [scene] @param {import('phaser').GameObjects.GameObject[]} elements */
function killPanelTweens(scene, elements) {
    if (!scene?.tweens?.killTweensOf || !elements?.length) return;
    for (const el of elements) {
        if (el) scene.tweens.killTweensOf(el);
    }
}

/** @param {import('phaser').GameObjects.GameObject[]} elements @param {boolean} visible @param {import('phaser').Scene} [scene] */
export function setMenuPanelVisible(elements, visible, scene) {
    if (!elements || elements.length === 0) return;
    killPanelTweens(scene, elements);
    const animateWithTween = scene && !prefersReducedMotion();

    if (visible) {
        elements.forEach((el) => {
            if (!el?.setVisible) return;
            el.setVisible(true);
            if (animateWithTween && el.setAlpha) {
                el.setAlpha(0);
            } else {
                el.setAlpha?.(1);
            }
        });

        if (animateWithTween) {
            const tweenTargets = elements.filter((el) => el?.setAlpha);
            if (tweenTargets.length > 0) {
                sceneTween(scene, {
                    targets: tweenTargets,
                    alpha: 1,
                    duration: 250,
                    ease: 'Cubic.easeOut',
                });
            }
        }
    } else {
        elements.forEach((el) => {
            el?.setVisible?.(false);
            el?.setAlpha?.(1);
        });
    }
}

/** @param {import('./ui.js').UI} ui */
export function syncMenuChromeVisibility(ui) {
    const panelOpen = ui._optionsOpen || ui._scoresOpen || ui._skinsOpen;
    ui._menuChromeElements?.forEach((el) => el?.setVisible?.(!panelOpen));
}

/**
 * @param {import('phaser').Scene} scene
 * @param {{ panelTop: number, panelH: number, w: number }} panel
 * @param {{ fill?: string, stroke?: string }} [theme]
 */
export function buildMenuPanelBackdrop(scene, panel, theme) {
    return buildStyledPanelBackdrop(scene, panel, {
        fill: theme?.fill ?? DESIGN_TOKENS.fondPanneauGameOver,
        stroke: theme?.stroke ?? DESIGN_TOKENS.boutonPause,
    });
}

/**
 * @param {import('phaser').Scene} scene
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {{ cx: number, cy: number, width: number, depth: number, color: number, stroke: number, labelText: string, labelStroke: string, labelStyle?: Phaser.Types.GameObjects.Text.TextStyle, rounded?: boolean, hoverColor?: number, focusKey?: keyof typeof import('./uiDomAccessibilityControlDefs.js').CONTROL_DEFS, onFocus?: () => void, onBlur?: () => void, onToggle: () => void }} cfg
 */
export function buildMenuToggleButton(scene, elements, cfg) {
    if (cfg.rounded) {
        return buildPanelPillButton(scene, elements, cfg);
    }

    const touchW = Math.max(cfg.width, MIN_TOUCH);
    const bg = scene.add.rectangle(cfg.cx, cfg.cy, cfg.width, MIN_TOUCH, cfg.color, 0.88);
    bg.setDepth(cfg.depth);
    bg.setStrokeStyle(2, cfg.stroke, 0.6);
    elements.push(bg);

    const labelStyle =
        cfg.labelStyle ??
        panelChromeTextStyle({
            fill: DESIGN_TOKENS.texteMenu,
            stroke: cfg.labelStroke,
        });
    const labelMaxWidth = cfg.width - 8;
    const label = addCenteredText(scene, cfg.cx, cfg.cy, cfg.labelText, labelStyle, cfg.depth + 1);
    applyFittedLabel(scene, label, cfg.labelText, labelStyle, labelMaxWidth);
    elements.push(label);

    const hit = scene.add.rectangle(cfg.cx, cfg.cy, touchW, MIN_TOUCH, 0x000000, 0);
    hit.setDepth(cfg.depth + 2);
    hit.setInteractive({ useHandCursor: true });
    const onFocus = cfg.onFocus ?? (() => bg.setFillStyle(MENU_BTN_HOVER, 0.88));
    const onBlur = cfg.onBlur ?? (() => bg.setFillStyle(cfg.color, 0.88));
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

    return { bg, label, hit };
}
