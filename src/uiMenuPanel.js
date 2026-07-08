import { DESIGN_TOKENS, panelChromeTextStyle } from './designTokens.js';
import { addCenteredText, DEPTH, MENU_BTN_HOVER, MIN_TOUCH, stopUiEvent } from './uiLayout.js';
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
 * @param {{ cx: number, cy: number, width: number, depth: number, color: number, stroke: number, labelText: string, labelStroke: string, labelStyle?: Phaser.Types.GameObjects.Text.TextStyle, rounded?: boolean, hoverColor?: number, onToggle: () => void }} cfg
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
    const label = addCenteredText(scene, cfg.cx, cfg.cy, cfg.labelText, labelStyle, cfg.depth + 1);
    elements.push(label);

    const hit = scene.add.rectangle(cfg.cx, cfg.cy, touchW, MIN_TOUCH, 0x000000, 0);
    hit.setDepth(cfg.depth + 2);
    hit.setInteractive({ useHandCursor: true });
    hit.on('pointerover', () => {
        bg.setFillStyle(MENU_BTN_HOVER, 0.88);
    });
    hit.on('pointerout', () => {
        bg.setFillStyle(cfg.color, 0.88);
    });
    hit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        cfg.onToggle();
    });
    elements.push(hit);

    return { bg, label, hit };
}

/**
 * @param {import('./ui.js').UI} ui
 * @param {{
 *   openKey: string,
 *   backdropKey: string,
 *   panelElementsKey: string,
 *   btnLabelKey: string,
 *   buttonLabelFn: (open: boolean) => string,
 *   setContentVisible?: (ui: import('./ui.js').UI, open: boolean) => void,
 *   onOpen?: (ui: import('./ui.js').UI) => void,
 *   onClose?: (ui: import('./ui.js').UI) => void,
 * }} cfg
 */
export function createMenuPanelController(ui, cfg) {
    function refreshButtonLabel() {
        if (!ui[cfg.btnLabelKey]) return;
        ui[cfg.btnLabelKey].setText(cfg.buttonLabelFn(ui[cfg.openKey]));
    }

    function setOpen(open) {
        const wasOpen = ui[cfg.openKey];
        if (wasOpen === open) return;
        ui[cfg.openKey] = open;
        ui[cfg.backdropKey]?.setVisible(open);
        if (cfg.setContentVisible) {
            cfg.setContentVisible(ui, open);
        } else {
            setMenuPanelVisible(ui[cfg.panelElementsKey], open, ui.scene);
        }
        refreshButtonLabel();
        if (open && cfg.onOpen) cfg.onOpen(ui);
        if (wasOpen && !open && cfg.onClose) cfg.onClose(ui);
        syncMenuChromeVisibility(ui);
    }

    function toggle() {
        if (ui[cfg.openKey]) {
            setOpen(false);
            return;
        }
        ui._closeAllMenuPanels?.();
        setOpen(true);
    }

    return { refreshButtonLabel, setOpen, toggle };
}

/**
 * @param {import('./ui.js').UI} ui
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {{ refreshButtonLabel: () => void, setOpen: (open: boolean) => void, toggle: () => void }} controller
 * @param {{
 *   openKey: string,
 *   backdropKey: string,
 *   panelElementsKey: string,
 *   btnBgKey: string,
 *   btnLabelKey: string,
 *   btnHitKey: string,
 *   buttonLabelFn: (open: boolean) => string,
 *   btnLayout: { cx: number, cy: number, width: number },
 *   panelLayout: { panelTop: number, panelH: number, w: number },
 *   btnColor: number,
 *   btnStroke: number,
 *   labelStroke: string,
 *   panelTheme?: { fill: string, stroke: string },
 *   buildContent: (ui: import('./ui.js').UI, elements: import('phaser').GameObjects.GameObject[], panelElements: import('phaser').GameObjects.GameObject[]) => void,
 * }} cfg
 */
export function buildMenuPanelShell(ui, elements, controller, cfg) {
    const scene = ui.scene;
    ui[cfg.openKey] = false;
    ui[cfg.panelElementsKey] = [];

    const btn = buildMenuToggleButton(scene, elements, {
        cx: cfg.btnLayout.cx,
        cy: cfg.btnLayout.cy,
        width: cfg.btnLayout.width,
        depth: DEPTH.MENU_ROW_BTN,
        color: cfg.btnColor,
        stroke: cfg.btnStroke,
        labelText: cfg.buttonLabelFn(false),
        labelStroke: cfg.labelStroke,
        labelStyle: panelChromeTextStyle({
            fill: DESIGN_TOKENS.texteMenu,
            stroke: cfg.labelStroke,
        }),
        onToggle: () => controller.toggle(),
    });
    ui[cfg.btnBgKey] = btn.bg;
    ui[cfg.btnLabelKey] = btn.label;
    ui[cfg.btnHitKey] = btn.hit;

    ui[cfg.backdropKey] = buildMenuPanelBackdrop(scene, cfg.panelLayout, cfg.panelTheme);
    elements.push(ui[cfg.backdropKey].frame, ui[cfg.backdropKey].hit);

    cfg.buildContent(ui, elements, ui[cfg.panelElementsKey]);
    setMenuPanelVisible(ui[cfg.panelElementsKey], false);
    ui[cfg.backdropKey]?.setVisible(false);
    ui[cfg.openKey] = false;
}
