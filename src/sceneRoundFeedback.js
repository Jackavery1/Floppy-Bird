import { SOUND } from './config.js';
import { playSound } from './audio.js';
import { hapticLight } from './haptics.js';

/** @param {number} score */
export function playScoreFeedback(score) {
    playSound(SOUND.SCORE, score);
    hapticLight();
}
