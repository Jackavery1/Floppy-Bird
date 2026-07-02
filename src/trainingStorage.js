import { STORAGE_KEYS, trainingBestKey } from './storageKeys.js';
import { routedSkinId } from './skinStorageRouting.js';

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

export function loadBestTrainingScore(skinId = null) {
    try {
        const raw = localStorage.getItem(trainingBestKey(routedSkinId(skinId)));
        const n = parseInt(raw ?? '0', 10);
        return Number.isFinite(n) && n >= 0 ? n : 0;
    } catch {
        return 0;
    }
}

/** @param {number} score @param {string|null} [skinId] */
export function saveBestTrainingScore(score, skinId = null) {
    if (!Number.isFinite(score) || score <= 0) return;
    const best = loadBestTrainingScore(skinId);
    if (score <= best) return;
    try {
        localStorage.setItem(trainingBestKey(routedSkinId(skinId)), String(score));
    } catch { /* quota */ }
}
