import { prefersReducedMotion } from './motion.js';

function hapticsAllowed() {
    return !prefersReducedMotion();
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
