import { SOUND } from './config.js';
import { playSound } from './audio.js';
import { hapticLight } from './haptics.js';

export function playJumpFeedback() {
    playSound(SOUND.JUMP);
    hapticLight();
}
