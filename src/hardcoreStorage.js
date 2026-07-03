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
