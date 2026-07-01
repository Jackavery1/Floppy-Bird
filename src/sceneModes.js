import { DIFFICULTY } from './config.js';
import { loadTrainingEnabled } from './trainingStorage.js';
import { loadHardcoreEnabled, saveHardcoreEnabled } from './hardcoreStorage.js';
import { loadDailyChallengeEnabled } from './dailyChallengeStorage.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

export function createSceneModesState() {
    const difficulty = DIFFICULTY.NORMAL;
    let trainingMode = loadTrainingEnabled();
    let hardcoreMode = loadHardcoreEnabled();
    const dailyChallengeMode = loadDailyChallengeEnabled();
    if (trainingMode && hardcoreMode) {
        hardcoreMode = false;
        saveHardcoreEnabled(false);
    }
    return { difficulty, trainingMode, hardcoreMode, dailyChallengeMode };
}

/** @param {SceneContext} scene */
export function initSceneModes(scene) {
    Object.assign(scene, createSceneModesState());
}
