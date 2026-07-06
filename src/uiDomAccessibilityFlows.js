import { DIFFICULTY } from './config.js';
import {
    bindAccessibilityAction,
    announceAccessibility,
    setAccessibilityControlVisible,
} from './uiDomAccessibilityControls.js';
import {
    GAME_OVER_CONTROL_KEYS,
    MENU_CONTROL_KEYS,
    OPTIONS_CONTROL_KEYS,
    SCORES_PANEL_CONTROL_KEYS,
    SKINS_PANEL_CONTROL_KEYS,
} from './uiDomAccessibilityDefs.js';
import { syncAccessibilityLayer } from './uiDomAccessibilityLayer.js';

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function setupMenuAccessibility(scene) {
    bindAccessibilityAction('menuStart', () => scene.handlePrimaryAction());
    bindAccessibilityAction('menuDaily', () => scene.launchDailyChallenge());
    bindAccessibilityAction('menuScores', () => scene.ui.toggleMenuScoresPanel());
    bindAccessibilityAction('menuOptions', () => scene.ui.toggleMenuOptionsPanel());
    bindAccessibilityAction('menuSkins', () => scene.ui.toggleMenuSkinsPanel());
    bindAccessibilityAction('menuDiffEasy', () => scene.changeDifficulty(DIFFICULTY.EASY));
    bindAccessibilityAction('menuDiffNormal', () => scene.changeDifficulty(DIFFICULTY.NORMAL));
    bindAccessibilityAction('menuDiffHard', () => scene.changeDifficulty(DIFFICULTY.HARD));
    for (const key of MENU_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key), true);
    }
    syncAccessibilityLayer(scene.game);
}

function hideAllSubPanelControls() {
    for (const key of OPTIONS_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key), false);
    }
    for (const key of SCORES_PANEL_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key), false);
    }
    for (const key of SKINS_PANEL_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key), false);
    }
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {boolean} open */
export function setScoresPanelAccessibility(scene, open) {
    for (const key of MENU_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key), !open);
    }
    hideAllSubPanelControls();
    for (const key of SCORES_PANEL_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key), open);
    }
    syncAccessibilityLayer(scene.game);
    if (open) announceAccessibility('Panneau scores ouvert');
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {boolean} open */
export function setSkinsPanelAccessibility(scene, open) {
    for (const key of MENU_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key), !open);
    }
    hideAllSubPanelControls();
    for (const key of SKINS_PANEL_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key), open);
    }
    syncAccessibilityLayer(scene.game);
    if (open) announceAccessibility('Panneau skins ouvert');
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function bindSkinsAccessibility(scene) {
    bindAccessibilityAction('menuSkinsPrev', () => scene.ui.cycleMenuSkin(-1));
    bindAccessibilityAction('menuSkinsNext', () => scene.ui.cycleMenuSkin(1));
    bindAccessibilityAction('menuSkinsClose', () => scene.ui.toggleMenuSkinsPanel());
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {boolean} open */
export function setOptionsPanelAccessibility(scene, open) {
    for (const key of MENU_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key), !open);
    }
    hideAllSubPanelControls();
    for (const key of OPTIONS_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key), open);
    }
    syncAccessibilityLayer(scene.game);
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function bindOptionsAccessibility(scene) {
    bindAccessibilityAction('menuTraining', () => scene.toggleTraining());
    bindAccessibilityAction('menuHardcore', () => scene.toggleHardcore());
    bindAccessibilityAction('menuOptionsClose', () => scene.ui.toggleMenuOptionsPanel());
}

/** @param {import('./sceneTypes.js').SceneContext} scene */
export function bindScoresAccessibility(scene) {
    bindAccessibilityAction('menuScoresClose', () => scene.ui.toggleMenuScoresPanel());
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {{ score: number, isDaily?: boolean }} opts */
export function setupGameOverAccessibility(scene, { score, isDaily = false }) {
    bindAccessibilityAction('gameOverRestart', () => scene.handlePrimaryAction());
    bindAccessibilityAction('gameOverMenu', () => scene.returnToMenu());
    for (const key of GAME_OVER_CONTROL_KEYS) {
        setAccessibilityControlVisible(/** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key), true);
    }
    syncAccessibilityLayer(scene.game);
    const mode = isDaily ? 'défi du jour' : 'partie';
    announceAccessibility(`Game over. Score ${score}. ${mode}. Rejouer ou retour au menu.`);
}
