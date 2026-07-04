import { STORAGE_KEYS } from './storageKeys.js';

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

export function resetCoyoteHintSeen() {
    try {
        localStorage.removeItem(STORAGE_KEYS.coyoteHintSeen);
    } catch {
        /* quota localStorage */
    }
}

export function loadPipeDeathCount() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.pipeDeathCount);
        if (stored != null) {
            const count = Number.parseInt(stored, 10);
            if (!Number.isNaN(count)) return Math.max(0, count);
        }
    } catch {
        /* quota localStorage */
    }
    return 0;
}

/** @returns {number} nouveau total */
export function recordPipeDeathForCoyoteHint() {
    const next = loadPipeDeathCount() + 1;
    try {
        localStorage.setItem(STORAGE_KEYS.pipeDeathCount, String(next));
        if (next > 0 && next % 3 === 0) {
            resetCoyoteHintSeen();
        }
    } catch {
        /* quota localStorage */
    }
    return next;
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
        /* quota localStorage */
    }
    return next;
}
