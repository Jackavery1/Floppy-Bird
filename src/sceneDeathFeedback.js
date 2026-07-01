import { SOUND } from './config.js';
import { playSound } from './audio.js';
import { hapticMedium } from './haptics.js';

/** @typedef {import('./sceneTypes.js').SceneContext} SceneContext */

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
}
