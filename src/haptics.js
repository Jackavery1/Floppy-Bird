import { prefersReducedMotion } from './motion.js';
import { STORAGE_KEYS } from './storageKeys.js';
import { saveBoolFlag } from './boolStorage.js';

export function isHapticsEnabled() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.haptics);
        if (raw === null) return true;
        return raw === '1';
    } catch {
        return true;
    }
}

/** @param {boolean} enabled */
export function setHapticsEnabled(enabled) {
    saveBoolFlag(STORAGE_KEYS.haptics, enabled);
}

export function toggleHaptics() {
    const next = !isHapticsEnabled();
    setHapticsEnabled(next);
    return next;
}

function hapticsAllowed() {
    return !prefersReducedMotion() && isHapticsEnabled();
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

export function hapticHeavy() {
    if (!hapticsAllowed()) return;
    try {
        navigator.vibrate?.([40, 24, 40]);
    } catch {
        /* non pris en charge */
    }
}
