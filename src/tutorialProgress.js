import {
    loadTutorialProgress,
    loadTutorialComplete,
    setTutorialProgress,
} from './tutorialStorage.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function showTutorialForProgress(scene) {
    if (loadTutorialComplete()) return;
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
