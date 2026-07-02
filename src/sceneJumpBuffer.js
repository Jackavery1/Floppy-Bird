import { GAME_CONFIG } from './config.js';
import { markTutorialSeen } from './tutorialStorage.js';
import { playJumpFeedback } from './sceneFeedback.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function requestJump(scene) {
    if (scene.ui?.dismissJumpTutorial?.()) {
        markTutorialSeen();
    }
    scene.round.jumpBufferFrames = Math.max(
        scene.round.jumpBufferFrames,
        GAME_CONFIG.bird.jumpBufferFrames,
    );
}

/** @param {SceneContext} scene */
export function processJumpBuffer(scene) {
    if (scene.round.jumpBufferFrames <= 0) return;
    scene.bird.bufferJump();
    playJumpFeedback();
    scene.ghost?.recordJump?.();
    scene.round.jumpBufferFrames = 0;
}

/** @param {SceneContext} scene */
export function tickJumpBuffer(scene) {
    if (scene.round.jumpBufferFrames > 0) {
        scene.round.jumpBufferFrames--;
    }
}
