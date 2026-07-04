import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser, hudTextStyle } from './designTokens.js';
import { addCenteredText, DEPTH, MENU_BTN_HOVER, MIN_TOUCH, stopUiEvent } from './uiLayout.js';

/** @param {import('phaser').GameObjects.GameObject[]} elements */
export function setMenuPanelVisible(elements, visible) {
    elements?.forEach((el) => el?.setVisible?.(visible));
}

/** @param {import('./ui.js').UI} ui */
export function syncMenuChromeVisibility(ui) {
    const panelOpen = ui._optionsOpen || ui._scoresOpen || ui._skinsOpen;
    ui._menuChromeElements?.forEach((el) => el?.setVisible?.(!panelOpen));
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
        hexVersPhaser(DESIGN_TOKENS.contourMenu),
        0.94
    );
    backdrop.setDepth(DEPTH.PANEL_BACKDROP);
    backdrop.setStrokeStyle(2, hexVersPhaser(DESIGN_TOKENS.boutonPause), 0.9);
    backdrop.setVisible(false);
    return backdrop;
}

/**
 * @param {import('phaser').Scene} scene
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {{ cx: number, cy: number, width: number, depth: number, color: number, stroke: number, labelText: string, labelStroke: string, onToggle: () => void }} cfg
 */
export function buildMenuToggleButton(scene, elements, cfg) {
    const touchW = Math.max(cfg.width, MIN_TOUCH);
    const bg = scene.add.rectangle(cfg.cx, cfg.cy, cfg.width, MIN_TOUCH, cfg.color, 0.88);
    bg.setDepth(cfg.depth);
    bg.setStrokeStyle(2, cfg.stroke, 0.6);
    elements.push(bg);

    const label = addCenteredText(
        scene,
        cfg.cx,
        cfg.cy,
        cfg.labelText,
        hudTextStyle({
            fontSize: '11px',
            fill: DESIGN_TOKENS.texteMenu,
            fontStyle: 'bold',
            stroke: cfg.labelStroke,
        }),
        cfg.depth + 1
    );
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
        ui[cfg.openKey] = open;
        ui[cfg.backdropKey]?.setVisible(open);
        if (cfg.setContentVisible) {
            cfg.setContentVisible(ui, open);
        } else {
            setMenuPanelVisible(ui[cfg.panelElementsKey], open);
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
        onToggle: () => controller.toggle(),
    });
    ui[cfg.btnBgKey] = btn.bg;
    ui[cfg.btnLabelKey] = btn.label;
    ui[cfg.btnHitKey] = btn.hit;

    ui[cfg.backdropKey] = buildMenuPanelBackdrop(scene, cfg.panelLayout);
    elements.push(ui[cfg.backdropKey]);

    cfg.buildContent(ui, elements, ui[cfg.panelElementsKey]);
    controller.setOpen(false);
}
