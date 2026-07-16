import { DESIGN_TOKENS } from '../../designTokens.js';
import { UI_LAYOUT } from '../shared/uiLayout.js';
import { buildMenuPanelShell, createMenuPanelController } from './uiMenuPanelController.js';

/**
 * Factory panneaux secondaires menu (scores / skins) — même squelette, configs distinctes.
 * @param {{
 *   controllerKey: string,
 *   panelLayoutKey: 'scoresPanel' | 'skinsPanel',
 *   btnLayoutKey: 'scoresBtn' | 'skinsBtn',
 *   panelCfg: object,
 *   themeStroke: string,
 *   refreshTab: (ui: import('../core/ui.js').UI) => void,
 *   bindA11y: (scene: import('../../sceneTypes.js').SceneContext) => void,
 *   setA11y: (scene: import('../../sceneTypes.js').SceneContext, open: boolean) => void,
 *   buildTab: (ui: import('../core/ui.js').UI, elements: import('phaser').GameObjects.GameObject[], panelElements: import('phaser').GameObjects.GameObject[]) => void,
 * }} opts
 */
export function createSecondaryMenuPanel(opts) {
    const {
        controllerKey,
        panelLayoutKey,
        btnLayoutKey,
        panelCfg,
        themeStroke,
        refreshTab,
        bindA11y,
        setA11y,
        buildTab,
    } = opts;

    const controllerCfg = {
        ...panelCfg,
        onOpen: (targetUi) => {
            refreshTab(targetUi);
            bindA11y(targetUi.scene);
            setA11y(targetUi.scene, true);
        },
        onClose: (targetUi) => setA11y(targetUi.scene, false),
    };

    return {
        /** @param {import('../core/ui.js').UI} ui */
        refreshButtonLabel(ui) {
            ui[controllerKey]?.refreshButtonLabel();
        },
        /** @param {import('../core/ui.js').UI} ui @param {boolean} open @param {{ force?: boolean }} [panelOpts] */
        setOpen(ui, open, panelOpts) {
            ui[controllerKey]?.setOpen(open, panelOpts);
        },
        /** @param {import('../core/ui.js').UI} ui */
        toggle(ui) {
            ui[controllerKey]?.toggle();
        },
        /**
         * @param {import('../core/ui.js').UI} ui
         * @param {import('phaser').GameObjects.GameObject[]} elements
         * @param {ReturnType<import('../shared/uiLayout.js').computeMenuLayout>} layout
         */
        build(ui, elements, layout) {
            ui[controllerKey] = createMenuPanelController(ui, controllerCfg);
            buildMenuPanelShell(ui, elements, ui[controllerKey], {
                ...panelCfg,
                btnLayout: {
                    cx: layout[btnLayoutKey],
                    cy: layout.menuRow,
                    width: layout.menuBtnW,
                },
                panelLayout: UI_LAYOUT[panelLayoutKey],
                panelTheme: {
                    fill: DESIGN_TOKENS.fondPanneauGameOver,
                    stroke: themeStroke,
                },
                buildContent: (targetUi, targetElements, panelElements) => {
                    buildTab(targetUi, targetElements, panelElements);
                },
            });
        },
    };
}
