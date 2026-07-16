import { isMuted, getVolume } from './audioVolume.js';
import { prefersReducedMotion } from './motion.js';

function hapticsAllowed() {
    if (prefersReducedMotion()) return false;
    if (isMuted() || getVolume() === 0) return false;
    return true;
}

export function hapticLight() {
    if (!hapticsAllowed()) return;
    try {
        navigator.vibrate?.(12);
    } catch {
        /* non pris en charge */
    }
}

export function hapticMedium() {
    if (!hapticsAllowed()) return;
    try {
        navigator.vibrate?.(28);
    } catch {
        /* non pris en charge */
    }
}
