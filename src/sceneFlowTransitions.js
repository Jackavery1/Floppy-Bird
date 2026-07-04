import { GAME_STATE } from './gameState.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function applyPlayingState(scene) {
    scene.state = GAME_STATE.PLAYING;
    scene.time.paused = false;
}

/** @param {SceneContext} scene */
export function applyPausedState(scene) {
    scene.state = GAME_STATE.PAUSED;
    scene.time.paused = true;
}

/** @param {SceneContext} scene */
export function resumeClock(scene) {
    scene.time.paused = false;
}
