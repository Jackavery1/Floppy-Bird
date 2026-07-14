import { GAME_STATE } from './gameState.js';
import {
    enterPauseAccessibility,
    exitPauseAccessibility,
    hideAccessibilityForRoundStart,
} from './sceneA11ySync.js';
import { closeMenuPanelsForRoundStart } from './sceneMenuSync.js';
import { syncShellGameState } from './shellGameState.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

/** @param {SceneContext} scene */
export function applyPlayingState(scene) {
    scene.state = GAME_STATE.PLAYING;
    scene.time.paused = false;
    syncShellGameState(GAME_STATE.PLAYING);
}

/** @param {SceneContext} scene */
export function applyPausedState(scene) {
    scene.state = GAME_STATE.PAUSED;
    scene.time.paused = true;
    syncShellGameState(GAME_STATE.PAUSED);
}

/** @param {SceneContext} scene */
export function clearStaleOverlays(scene) {
    scene.ui.clearOverlay('menu');
    scene.ui.clearOverlay('pause');
}

/** @param {SceneContext} scene */
export function clearPauseOverlay(scene) {
    scene.ui.clearOverlay('pause');
    hideAccessibilityForRoundStart();
}

/** @param {SceneContext} scene */
export function exitMenuForRound(scene) {
    closeMenuPanelsForRoundStart(scene);
    hideAccessibilityForRoundStart();
    scene.ui.clearOverlay('menu');
}

/** @param {SceneContext} scene */
export function exitGameOverForRound(scene) {
    hideAccessibilityForRoundStart();
    scene.ui.clearOverlay('gameOver');
}

/**
 * @param {SceneContext} scene
 * @param {{ onResume: () => void, onMenu: () => void }} callbacks
 */
export function enterPauseOverlay(scene, callbacks) {
    applyPausedState(scene);
    const pauseUI = scene.ui.showPause(callbacks);
    scene.ui.setOverlay('pause', pauseUI.elements);
    enterPauseAccessibility(scene);
}

/** @param {SceneContext} scene */
export function resumeFromPauseOverlay(scene) {
    applyPlayingState(scene);
    clearPauseOverlay(scene);
    exitPauseAccessibility(scene);
}
