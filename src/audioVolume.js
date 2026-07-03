import { STORAGE_KEYS } from './storageKeys.js';

export const VOLUME_STEPS = Object.freeze([1, 0.5, 0.25, 0]);

function readStoredVolume() {
    try {
        return (
            localStorage.getItem(STORAGE_KEYS.volume) ??
            localStorage.getItem(STORAGE_KEYS.volumeLegacy)
        );
    } catch {
        return null;
    }
}

export function getVolume() {
    if (isMuted()) return 0;
    const raw = readStoredVolume();
    const n = Number.parseFloat(raw ?? '');
    if (Number.isFinite(n) && n >= 0 && n <= 1) return n;
    return 1;
}

export function setVolume(level) {
    try {
        localStorage.setItem(STORAGE_KEYS.volume, String(level));
        if (level > 0) setMuted(false);
        else setMuted(true);
    } catch {
        /* quota localStorage */
    }
}

export function isMuted() {
    try {
        return localStorage.getItem(STORAGE_KEYS.muted) === '1';
    } catch {
        return false;
    }
}

export function setMuted(muted) {
    try {
        localStorage.setItem(STORAGE_KEYS.muted, muted ? '1' : '0');
    } catch {
        /* quota localStorage */
    }
}

export function cycleSoundLevel() {
    const current = getVolume();
    const idx = VOLUME_STEPS.indexOf(current);
    const next = VOLUME_STEPS[(idx + 1) % VOLUME_STEPS.length];
    if (next === 0) {
        setMuted(true);
        setVolume(0);
    } else {
        setMuted(false);
        setVolume(next);
    }
}

export function formatSoundLabel(isAvailable = true) {
    if (!isAvailable) return 'indisponible';
    if (isMuted() || getVolume() === 0) return 'OFF';
    return `${Math.round(getVolume() * 100)} %`;
}
