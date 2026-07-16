import { DIFFICULTY } from '../../config.js';
import { setAccessibilityControlPressed } from './uiDomAccessibilityControls.js';

/** @param {import('../../sceneTypes.js').SceneContext} scene */
export function syncMenuToggleAccessibility(scene) {
    if (!scene) return;
    setAccessibilityControlPressed('menuDiffEasy', scene.difficulty === DIFFICULTY.EASY);
    setAccessibilityControlPressed('menuDiffNormal', scene.difficulty === DIFFICULTY.NORMAL);
    setAccessibilityControlPressed('menuDiffHard', scene.difficulty === DIFFICULTY.HARD);
    setAccessibilityControlPressed('menuTraining', !!scene.trainingMode);
    setAccessibilityControlPressed('menuHardcore', !!scene.hardcoreMode);
}
