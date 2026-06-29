import { GAME_CONFIG } from './config.js';
import { markTutorialSeen } from './tutorialStorage.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function requestJump(scene) {
    if (scene.ui?.dismissJumpTutorial?.()) {
        markTutorialSeen();
    }
    scene._jumpBufferFrames = Math.max(
        scene._jumpBufferFrames,
        GAME_CONFIG.bird.jumpBufferFrames,
    );
}

/** @param {SceneContext} scene */
export function processJumpBuffer(scene) {
    if (scene._jumpBufferFrames <= 0) return;
    scene.bird.bufferJump();
    scene._jumpBufferFrames = 0;
}

/** @param {SceneContext} scene */
export function tickJumpBuffer(scene) {
    if (scene._jumpBufferFrames > 0) {
        scene._jumpBufferFrames--;
    }
}
