import { GAME_CONFIG } from './config.js';
import { STORAGE_KEYS, trainingBestKey } from './storageKeys.js';
import { routedSkinId } from './skinStorageRouting.js';
import { loadBoolFlag, saveBoolFlag } from './boolStorage.js';

export function loadTrainingEnabled() {
    return loadBoolFlag(STORAGE_KEYS.training);
}

export function saveTrainingEnabled(enabled) {
    saveBoolFlag(STORAGE_KEYS.training, enabled);
}

export function loadTrainingTutorialSeen() {
    return loadBoolFlag(STORAGE_KEYS.trainingTutorialSeen);
}

export function markTrainingTutorialSeen() {
    saveBoolFlag(STORAGE_KEYS.trainingTutorialSeen, true);
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

function normalizeTrainingTimeScale(value) {
    const steps = GAME_CONFIG.training.timeScaleSteps;
    const n = typeof value === 'number' ? value : Number.parseFloat(value);
    if (steps.includes(n)) return n;
    return GAME_CONFIG.training.timeScale;
}

export function loadTrainingTimeScale() {
    try {
        return normalizeTrainingTimeScale(localStorage.getItem(STORAGE_KEYS.trainingTimeScale));
    } catch {
        return GAME_CONFIG.training.timeScale;
    }
}

/** @param {number} scale */
export function saveTrainingTimeScale(scale) {
    try {
        localStorage.setItem(
            STORAGE_KEYS.trainingTimeScale,
            String(normalizeTrainingTimeScale(scale))
        );
    } catch {
        /* quota localStorage */
    }
}

/** @param {number} current */
export function cycleTrainingTimeScale(current) {
    const steps = GAME_CONFIG.training.timeScaleSteps;
    const normalized = normalizeTrainingTimeScale(current);
    const index = steps.indexOf(normalized);
    return steps[(index + 1) % steps.length];
}
