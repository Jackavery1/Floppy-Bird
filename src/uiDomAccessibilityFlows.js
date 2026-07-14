import { DIFFICULTY } from './config.js';
import {
    bindAccessibilityAction,
    announceAccessibility,
    hideAllAccessibilityControls,
    setAccessibilityControlLabel,
    setAccessibilityControlVisible,
} from './uiDomAccessibilityControls.js';
import {
    dailyChallengeHint,
    difficultyA11yLabel,
    optionsAccessibilityLabel,
    restartHintForMode,
} from './device.js';
import { GAME_OVER_CONTROL_KEYS, MENU_CONTROL_KEYS } from './uiDomAccessibilityDefs.js';
import { syncAccessibilityLayer } from './uiDomAccessibilityLayer.js';
import { bindMenuAccessibilityFocusVisuals } from './uiDomAccessibilityFocusVisuals.js';
import { syncMenuToggleAccessibility } from './uiDomAccessibilityMenuToggles.js';

export { syncMenuToggleAccessibility } from './uiDomAccessibilityMenuToggles.js';
export {
    setScoresPanelAccessibility,
    setSkinsPanelAccessibility,
    bindSkinsAccessibility,
    setOptionsPanelAccessibility,
    bindOptionsAccessibility,
    bindScoresAccessibility,
} from './uiDomAccessibilityPanelFlows.js';

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
    setAccessibilityControlLabel('menuDaily', dailyChallengeHint());
    setAccessibilityControlLabel('menuOptions', optionsAccessibilityLabel());
    setAccessibilityControlLabel('menuDiffEasy', difficultyA11yLabel('easy'));
    setAccessibilityControlLabel('menuDiffNormal', difficultyA11yLabel('normal'));
    setAccessibilityControlLabel('menuDiffHard', difficultyA11yLabel('hard'));
    for (const key of MENU_CONTROL_KEYS) {
        setAccessibilityControlVisible(
            /** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key),
            true
        );
    }
    syncMenuToggleAccessibility(scene);
    bindMenuAccessibilityFocusVisuals(scene.ui);
    syncAccessibilityLayer(scene.game);
}

/** @param {import('./sceneTypes.js').SceneContext} scene @param {{ score: number, isDaily?: boolean }} opts */
export function setupGameOverAccessibility(scene, { score, isDaily = false }) {
    hideAllAccessibilityControls();
    bindAccessibilityAction('gameOverRestart', () => scene.handlePrimaryAction());
    bindAccessibilityAction('gameOverMenu', () => scene.returnToMenu());
    for (const key of GAME_OVER_CONTROL_KEYS) {
        setAccessibilityControlVisible(
            /** @type {keyof import('./uiDomAccessibilityDefs.js').CONTROL_DEFS} */ (key),
            true
        );
    }
    setAccessibilityControlLabel('gameOverRestart', restartHintForMode(isDaily));
    syncAccessibilityLayer(scene.game);
    const mode = isDaily ? 'défi du jour' : 'partie';
    announceAccessibility(`Game over. Score ${score}. ${mode}. Rejouer ou retour au menu.`);
}
