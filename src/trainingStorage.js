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

export function loadBestTrainingScore() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.trainingBest);
        const n = parseInt(raw ?? '0', 10);
        return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch {
        return 0;
    }
}

/** @param {number} score */
export function saveBestTrainingScore(score) {
    if (!Number.isFinite(score) || score <= 0) return;
    const best = loadBestTrainingScore();
    if (score <= best) return;
    try {
        localStorage.setItem(STORAGE_KEYS.trainingBest, String(score));
    } catch { /* quota */ }
}
