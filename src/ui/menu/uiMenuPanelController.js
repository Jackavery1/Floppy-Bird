import { DESIGN_TOKENS, panelChromeTextStyle } from '../../designTokens.js';
import { GAME_STATE } from '../../gameState.js';
import { DEPTH, MENU_SECONDARY_HIT, MIN_TOUCH, applyFittedLabel } from '../shared/uiLayout.js';
import {
    buildMenuPanelBackdrop,
    buildMenuToggleButton,
    setMenuPanelVisible,
    syncMenuChromeVisibility,
} from './uiMenuPanel.js';

/**
 * @param {import('../core/ui.js').UI} ui
 * @param {{
 *   openKey: string,
 *   backdropKey: string,
 *   panelElementsKey: string,
 *   btnLabelKey: string,
 *   buttonLabelFn: (open: boolean) => string,
 *   setContentVisible?: (ui: import('../core/ui.js').UI, open: boolean) => void,
 *   onOpen?: (ui: import('../core/ui.js').UI) => void,
 *   onClose?: (ui: import('../core/ui.js').UI) => void,
 * }} cfg
 */
export function createMenuPanelController(ui, cfg) {
    /** @type {{ style?: Phaser.Types.GameObjects.Text.TextStyle, maxWidth?: number }} */
    const labelFit = {};

    function setLabelFit(style, maxWidth) {
        labelFit.style = style;
        labelFit.maxWidth = maxWidth;
    }

    function refreshButtonLabel() {
        if (!ui[cfg.btnLabelKey]) return;
        const text = cfg.buttonLabelFn(ui[cfg.openKey]);
        if (labelFit.style != null && labelFit.maxWidth != null) {
            applyFittedLabel(
                ui.scene,
                ui[cfg.btnLabelKey],
                text,
                labelFit.style,
                labelFit.maxWidth
            );
        } else {
            ui[cfg.btnLabelKey].setText(text);
        }
    }

    /** @param {boolean} open @param {{ force?: boolean }} [panelOpts] */
    function setOpen(open, panelOpts = {}) {
        const force = Boolean(panelOpts.force);
        if (open && ui.scene?.state !== GAME_STATE.MENU) return;
        const wasOpen = ui[cfg.openKey];
        if (!force && wasOpen === open) return;
        ui[cfg.openKey] = open;
        ui[cfg.backdropKey]?.setVisible?.(open);
        if (cfg.setContentVisible) {
            cfg.setContentVisible(ui, open);
        } else {
            setMenuPanelVisible(ui[cfg.panelElementsKey], open, ui.scene);
        }
        refreshButtonLabel();
        if (open && cfg.onOpen) cfg.onOpen(ui);
        if (!open && cfg.onClose && (wasOpen || force)) cfg.onClose(ui);
        syncMenuChromeVisibility(ui);
    }

    function toggle() {
        if (ui.scene?.state !== GAME_STATE.MENU) return;
        if (ui[cfg.openKey]) {
            setOpen(false);
            return;
        }
        ui.closeAllMenuPanels();
        setOpen(true);
    }

    return { refreshButtonLabel, setOpen, toggle, setLabelFit };
}

/**
 * @param {import('../core/ui.js').UI} ui
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {{ refreshButtonLabel: () => void, setOpen: (open: boolean, panelOpts?: { force?: boolean }) => void, toggle: () => void }} controller
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
 *   buildContent: (ui: import('../core/ui.js').UI, elements: import('phaser').GameObjects.GameObject[], panelElements: import('phaser').GameObjects.GameObject[]) => void,
 *   setContentVisible?: (ui: import('../core/ui.js').UI, open: boolean) => void,
 * }} cfg
 */
export function buildMenuPanelShell(ui, elements, controller, cfg) {
    const scene = ui.scene;
    ui[cfg.openKey] = false;
    ui[cfg.panelElementsKey] = [];

    const labelStyle = panelChromeTextStyle({
        fill: DESIGN_TOKENS.texteMenu,
        stroke: cfg.labelStroke,
    });
    const labelMaxWidth = cfg.btnLayout.width - 8;
    controller.setLabelFit?.(labelStyle, labelMaxWidth);

    const btn = buildMenuToggleButton(scene, elements, {
        cx: cfg.btnLayout.cx,
        cy: cfg.btnLayout.cy,
        width: cfg.btnLayout.width,
        height: MIN_TOUCH,
        hitHeight: MENU_SECONDARY_HIT,
        depth: DEPTH.MENU_ROW_BTN,
        color: cfg.btnColor,
        stroke: cfg.btnStroke,
        hoverColor: cfg.btnHover,
        labelText: cfg.buttonLabelFn(false),
        labelStroke: cfg.labelStroke,
        labelStyle,
        focusKey: cfg.btnFocusKey,
        onToggle: () => controller.toggle(),
    });
    ui[cfg.btnBgKey] = btn.bg;
    ui[cfg.btnLabelKey] = btn.label;
    ui[cfg.btnHitKey] = btn.hit;

    if (!cfg.deferPanelContent) {
        ui[cfg.backdropKey] = buildMenuPanelBackdrop(scene, cfg.panelLayout, cfg.panelTheme);
        if (!cfg.attachBackdropToRoot) {
            elements.push(ui[cfg.backdropKey].frame, ui[cfg.backdropKey].hit);
        }

        cfg.buildContent(ui, elements, ui[cfg.panelElementsKey]);
        if (cfg.setContentVisible) {
            cfg.setContentVisible(ui, false);
        } else {
            setMenuPanelVisible(ui[cfg.panelElementsKey], false);
        }
        ui[cfg.backdropKey]?.setVisible(false);
    }
    ui[cfg.openKey] = false;
}
