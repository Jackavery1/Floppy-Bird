import { STORAGE_KEYS } from './storageKeys.js';

export function loadDailyChallengeEnabled() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.dailyChallenge);
        if (raw === null) return true;
        return raw === '1';
    } catch {
        return true;
    }
}

export function saveDailyChallengeEnabled(enabled) {
    try {
        localStorage.setItem(STORAGE_KEYS.dailyChallenge, enabled ? '1' : '0');
    } catch { /* quota */ }
}
