import { STORAGE_KEYS } from './storageKeys.js';

export function loadTutorialSeen() {
    try {
        return localStorage.getItem(STORAGE_KEYS.tutorialSeen) === '1';
    } catch {
        return false;
    }
}

export function markTutorialSeen() {
    try {
        localStorage.setItem(STORAGE_KEYS.tutorialSeen, '1');
    } catch { /* quota */ }
}
