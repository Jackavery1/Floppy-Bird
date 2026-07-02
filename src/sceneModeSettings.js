import { saveTrainingEnabled } from './trainingStorage.js';
import { saveHardcoreEnabled } from './hardcoreStorage.js';
import { applyTrainingTimeScale } from './sceneBootstrap.js';
import { buildMetaContext } from './metaContext.js';
import { isHardcoreUnlocked } from './hardcoreUnlock.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene @param {boolean} enabled */
export function setTrainingMode(scene, enabled) {
    scene.trainingMode = enabled;
    saveTrainingEnabled(enabled);

    if (enabled && scene.hardcoreMode) {
        scene.hardcoreMode = false;
        saveHardcoreEnabled(false);
        scene.ui.updateHardcoreLabel(false);
    }

    applyTrainingTimeScale(scene);
    scene.ui.updateTrainingLabel(enabled);
    scene.ui.refreshHardcoreLockState();
    scene.ui.refreshHighScore(scene.difficulty, scene.hardcoreMode);
}

/** @param {SceneContext} scene @param {boolean} enabled */
export function setHardcoreMode(scene, enabled) {
    const ctx = buildMetaContext(scene);
    if (enabled && !isHardcoreUnlocked(ctx)) {
        return;
    }

    scene.hardcoreMode = enabled;
    saveHardcoreEnabled(enabled);

    if (enabled && scene.trainingMode) {
        scene.trainingMode = false;
        saveTrainingEnabled(false);
        scene.ui.updateTrainingLabel(false);
        applyTrainingTimeScale(scene);
    }

    scene.ui.updateHardcoreLabel(enabled);
}

/** @param {SceneContext} scene */
export function toggleTrainingMode(scene) {
    setTrainingMode(scene, !scene.trainingMode);
}

/** @param {SceneContext} scene */
export function toggleHardcoreMode(scene) {
    const ctx = buildMetaContext(scene);
    if (!isHardcoreUnlocked(ctx)) return;
    setHardcoreMode(scene, !scene.hardcoreMode);
}
