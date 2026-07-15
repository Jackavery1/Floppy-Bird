import { GAME_STATE } from './gameState.js';
import {
    announceAccessibility,
    bindAccessibilityAction,
    setAccessibilityControlLabel,
    setAccessibilityControlVisible,
} from './uiDomAccessibilityControls.js';
import { hardcoreHint, skinsCycleHint, trainingHint, trainingSpeedLabel } from './device.js';
import {
    MENU_CONTROL_KEYS,
    OPTIONS_CONTROL_KEYS,
    SCORES_PANEL_CONTROL_KEYS,
    SKINS_PANEL_CONTROL_KEYS,
} from './uiDomAccessibilityDefs.js';
import { syncAccessibilityLayer } from './uiDomAccessibilityLayer.js';
import { syncOptionsTabAccessibility } from './uiDomAccessibilityControls.js';
import {
    bindOptionsAccessibilityFocusVisuals,
    bindScoresAccessibilityFocusVisuals,
    bindSkinsAccessibilityFocusVisuals,
} from './uiDomAccessibilityFocusVisuals.js';
import { setOptionsTab } from './uiMenuOptionsTabs.js';
import { syncMenuToggleAccessibility } from './uiDomAccessibilityMenuToggles.js';

/** @param {import('./sceneTypes.js').SceneContext} scene @param {boolean} panelOpen */
function shouldShowMenuControls(scene, panelOpen) {
    return !panelOpen && scene?.state === GAME_STATE.MENU;
}

function hideAllSubPanelControls() {
    for (const key of OPTIONS_CONTROL_KEYS) {
        setAccessibilityControlVisible(
            /** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key),
            false
        );
    }
    for (const key of SCORES_PANEL_CONTROL_KEYS) {
        setAccessibilityControlVisible(
            /** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key),
            false
        );
    }
    for (const key of SKINS_PANEL_CONTROL_KEYS) {
        setAccessibilityControlVisible(
            /** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key),
            false
        );
    }
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {boolean} open */
export function setScoresPanelAccessibility(scene, open) {
    const showMenu = shouldShowMenuControls(scene, open);
    for (const key of MENU_CONTROL_KEYS) {
        setAccessibilityControlVisible(
            /** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key),
            showMenu
        );
    }
    hideAllSubPanelControls();
    for (const key of SCORES_PANEL_CONTROL_KEYS) {
        setAccessibilityControlVisible(
            /** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key),
            open
        );
    }
    syncAccessibilityLayer(scene.game);
    if (open) announceAccessibility('Panneau scores ouvert');
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {boolean} open */
export function setSkinsPanelAccessibility(scene, open) {
    const showMenu = shouldShowMenuControls(scene, open);
    for (const key of MENU_CONTROL_KEYS) {
        setAccessibilityControlVisible(
            /** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key),
            showMenu
        );
    }
    hideAllSubPanelControls();
    for (const key of SKINS_PANEL_CONTROL_KEYS) {
        setAccessibilityControlVisible(
            /** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key),
            open
        );
    }
    syncAccessibilityLayer(scene.game);
    if (open) {
        announceAccessibility(`Panneau skins ouvert. ${skinsCycleHint()}`);
    }
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function bindSkinsAccessibility(scene) {
    bindAccessibilityAction('menuSkinsPrev', () => scene.ui.cycleMenuSkin(-1));
    bindAccessibilityAction('menuSkinsNext', () => scene.ui.cycleMenuSkin(1));
    bindAccessibilityAction('menuSkinsClose', () => scene.ui.toggleMenuSkinsPanel());
    bindSkinsAccessibilityFocusVisuals(scene.ui);
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {boolean} open */
export function setOptionsPanelAccessibility(scene, open) {
    const showMenu = shouldShowMenuControls(scene, open);
    for (const key of MENU_CONTROL_KEYS) {
        setAccessibilityControlVisible(
            /** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key),
            showMenu
        );
    }
    hideAllSubPanelControls();
    for (const key of OPTIONS_CONTROL_KEYS) {
        setAccessibilityControlVisible(
            /** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key),
            open
        );
    }
    if (open) {
        setAccessibilityControlLabel('menuTraining', trainingHint());
        setAccessibilityControlLabel('menuHardcore', hardcoreHint());
        setAccessibilityControlLabel(
            'menuTrainingSpeed',
            trainingSpeedLabel(scene.trainingTimeScale ?? 0.8)
        );
        syncMenuToggleAccessibility(scene);
        syncOptionsTabAccessibility(scene.ui);
        announceAccessibility('Panneau options ouvert');
    }
    syncAccessibilityLayer(scene.game);
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function bindOptionsAccessibility(scene) {
    bindAccessibilityAction('menuOptionsTabControls', () => setOptionsTab(scene.ui, 'controls'));
    bindAccessibilityAction('menuOptionsTabPreferences', () =>
        setOptionsTab(scene.ui, 'preferences')
    );
    bindAccessibilityAction('menuTraining', () => scene.toggleTraining());
    bindAccessibilityAction('menuTrainingSpeed', () => scene.cycleTrainingSpeed());
    bindAccessibilityAction('menuHardcore', () => scene.toggleHardcore());
    bindAccessibilityAction('menuOptionsClose', () => scene.ui.toggleMenuOptionsPanel());
    bindOptionsAccessibilityFocusVisuals(scene.ui);
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function bindScoresAccessibility(scene) {
    bindAccessibilityAction('menuScoresClose', () => scene.ui.toggleMenuScoresPanel());
    bindScoresAccessibilityFocusVisuals(scene.ui);
}
