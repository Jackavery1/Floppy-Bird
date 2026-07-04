import { STORAGE_KEYS, trainingBestKey } from './storageKeys.js';
import { routedSkinId } from './skinStorageRouting.js';
import { loadBoolFlag, saveBoolFlag } from './boolStorage.js';

export function loadTrainingEnabled() {
    return loadBoolFlag(STORAGE_KEYS.training);
}

export function saveTrainingEnabled(enabled) {
    saveBoolFlag(STORAGE_KEYS.training, enabled);
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
    } catch {
        /* quota localStorage */
    }
}
