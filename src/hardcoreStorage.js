import { STORAGE_KEYS } from './storageKeys.js';
import { loadBoolFlag, saveBoolFlag } from './boolStorage.js';

export function loadHardcoreEnabled() {
    return loadBoolFlag(STORAGE_KEYS.hardcore);
}

export function saveHardcoreEnabled(enabled) {
    saveBoolFlag(STORAGE_KEYS.hardcore, enabled);
}

export function loadHardcoreTutorialSeen() {
    return loadBoolFlag(STORAGE_KEYS.hardcoreTutorialSeen);
}

export function markHardcoreTutorialSeen() {
    saveBoolFlag(STORAGE_KEYS.hardcoreTutorialSeen, true);
}
