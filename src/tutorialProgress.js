import {
    loadTutorialProgress,
    loadTutorialComplete,
    loadRoundsStarted,
    setTutorialProgress,
    markTutorialSeen,
    SKIP_TUTORIAL_AFTER_ROUNDS,
} from './tutorialStorage.js';
import { loadHardcoreTutorialSeen, markHardcoreTutorialSeen } from './hardcoreStorage.js';
import { loadTrainingTutorialSeen, markTrainingTutorialSeen } from './trainingStorage.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function showTutorialForProgress(scene) {
    if (loadTutorialComplete()) return;
    if (loadRoundsStarted() >= SKIP_TUTORIAL_AFTER_ROUNDS) {
        markTutorialSeen();
        return;
    }
    const step = loadTutorialProgress();
    if (step === 0) scene.ui.showJumpTutorial();
    else if (step === 1) scene.ui.showGapTutorial();
}

/** @param {SceneContext} scene */
export function onTutorialJump(scene) {
    if (loadTutorialProgress() !== 0) return;
    scene.ui.dismissGameplayTutorial();
    setTutorialProgress(1);
    scene.ui.showGapTutorial();
}

/** @param {SceneContext} scene */
export function onTutorialFirstScore(scene) {
    if (loadTutorialComplete()) return;
    scene.ui.dismissGameplayTutorial();
    setTutorialProgress(2);
    scene.ui.showScoreTutorial();
    scene.time.delayedCall(2800, () => {
        if (loadTutorialProgress() === 2) {
            scene.ui.dismissGameplayTutorial();
            setTutorialProgress(3);
        }
    });
}

/** @param {SceneContext} scene */
export function showHardcoreTutorialIfNeeded(scene) {
    if (!scene.hardcoreMode || !loadTutorialComplete()) return;
    if (loadHardcoreTutorialSeen()) return;
    scene.ui.showHardcoreTutorial?.();
    markHardcoreTutorialSeen();
}

/** @param {SceneContext} scene */
export function showTrainingTutorialIfNeeded(scene) {
    if (!scene.trainingMode || !loadTutorialComplete()) return;
    if (loadTrainingTutorialSeen()) return;
    scene.ui.showTrainingTutorial?.();
    markTrainingTutorialSeen();
}

/** @param {SceneContext} scene */
export function onHardcoreTutorialJump(scene) {
    scene.ui.dismissHardcoreTutorial?.();
}

/** @param {SceneContext} scene */
export function onTrainingTutorialJump(scene) {
    scene.ui.dismissTrainingTutorial?.();
}

/** @param {SceneContext} scene */
export function skipTutorial(scene) {
    if (loadTutorialComplete()) return false;
    markTutorialSeen();
    scene.ui.dismissGameplayTutorial();
    return true;
}

/** @param {SceneContext} scene */
export function skipTutorialIfActive(scene) {
    if (loadTutorialComplete()) return false;
    return skipTutorial(scene);
}
