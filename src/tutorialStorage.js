import { STORAGE_KEYS } from './storageKeys.js';
import { noteStorageWriteFailure } from './storageFail.js';

const TUTORIAL_STEPS = 3;

/** Nombre de parties avant auto-skip du tutoriel implicite. */
export const SKIP_TUTORIAL_AFTER_ROUNDS = 3;

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
        noteStorageWriteFailure();
    }
    return clamped;
}

export function loadTutorialSeen() {
    return loadTutorialComplete();
}

export function markTutorialSeen() {
    setTutorialProgress(TUTORIAL_STEPS);
}

export function loadRoundsStarted() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.roundsStarted);
        if (stored != null) {
            const count = Number.parseInt(stored, 10);
            if (!Number.isNaN(count)) return Math.max(0, count);
        }
    } catch {
        /* quota localStorage */
    }
    return 0;
}

export function incrementRoundsStarted() {
    const next = loadRoundsStarted() + 1;
    try {
        localStorage.setItem(STORAGE_KEYS.roundsStarted, String(next));
    } catch {
        noteStorageWriteFailure();
    }
    return next;
}
