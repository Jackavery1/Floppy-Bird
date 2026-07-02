import { SOUND } from './config.js';
import { playSound } from './audio.js';
import { hapticLight, hapticMedium } from './haptics.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

export function playJumpFeedback() {
    playSound(SOUND.JUMP);
    hapticLight();
}

/** @param {number} score */
export function playScoreFeedback(score) {
    playSound(SOUND.SCORE, score);
    hapticLight();
}

/** @param {SceneContext} scene */
export function playDeathImpactFeedback(scene) {
    playSound(SOUND.GAME_OVER);
    hapticMedium();
    scene.ui.hideInGameScore();
    scene.cameras.main.shake(200, 0.015);
    scene.ui.showFlash();
}

export function playGroundImpactFeedback() {
    playSound(SOUND.GROUND);
    hapticLight();
}
