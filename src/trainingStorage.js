import { STORAGE_KEYS } from './storageKeys.js';

export function loadTrainingEnabled() {
    try {
        return localStorage.getItem(STORAGE_KEYS.training) === '1';
    } catch {
        return false;
    }
}

export function saveTrainingEnabled(enabled) {
    try {
        localStorage.setItem(STORAGE_KEYS.training, enabled ? '1' : '0');
    } catch { /* quota */ }
}
