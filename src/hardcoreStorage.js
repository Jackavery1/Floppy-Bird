import { STORAGE_KEYS } from './storageKeys.js';

export function loadHardcoreEnabled() {
    try {
        return localStorage.getItem(STORAGE_KEYS.hardcore) === '1';
    } catch {
        return false;
    }
}

export function saveHardcoreEnabled(enabled) {
    try {
        localStorage.setItem(STORAGE_KEYS.hardcore, enabled ? '1' : '0');
    } catch {
        /* quota localStorage */
    }
}

export function loadHardcoreTutorialSeen() {
    try {
        return localStorage.getItem(STORAGE_KEYS.hardcoreTutorialSeen) === '1';
    } catch {
        return false;
    }
}

export function markHardcoreTutorialSeen() {
    try {
        localStorage.setItem(STORAGE_KEYS.hardcoreTutorialSeen, '1');
    } catch {
        /* quota localStorage */
    }
}
