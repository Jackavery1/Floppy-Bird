import { STORAGE_KEYS } from './storageKeys.js';

const TUTORIAL_STEPS = 3;

export function loadTutorialProgress() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.tutorialProgress);
        if (stored != null) {
            const step = Number.parseInt(stored, 10);
            if (!Number.isNaN(step)) return Math.min(TUTORIAL_STEPS, Math.max(0, step));
        }
        if (localStorage.getItem(STORAGE_KEYS.tutorialSeen) === '1') return TUTORIAL_STEPS;
    } catch {
        /* quota localStorage */
    }
    return 0;
}

export function loadTutorialComplete() {
    return loadTutorialProgress() >= TUTORIAL_STEPS;
}

/** @param {number} step */
export function setTutorialProgress(step) {
    const clamped = Math.min(TUTORIAL_STEPS, Math.max(0, step));
    try {
        localStorage.setItem(STORAGE_KEYS.tutorialProgress, String(clamped));
        if (clamped >= TUTORIAL_STEPS) {
            localStorage.setItem(STORAGE_KEYS.tutorialSeen, '1');
        }
    } catch {
        /* quota localStorage */
    }
    return clamped;
}

export function loadTutorialSeen() {
    return loadTutorialComplete();
}

export function markTutorialSeen() {
    setTutorialProgress(TUTORIAL_STEPS);
}

export function loadCoyoteHintSeen() {
    try {
        return localStorage.getItem(STORAGE_KEYS.coyoteHintSeen) === '1';
    } catch {
        return false;
    }
}

export function markCoyoteHintSeen() {
    try {
        localStorage.setItem(STORAGE_KEYS.coyoteHintSeen, '1');
    } catch {
        /* quota localStorage */
    }
}
