import { STORAGE_KEYS } from './storageKeys.js';
import { noteStorageWriteFailure } from './storageFail.js';

const DEFAULT = Object.freeze({
    achievements: [],
    selectedSkin: 'classic',
});

function readMeta() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.meta);
        if (!raw) return { ...DEFAULT };
        const parsed = JSON.parse(raw);
        return {
            achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
            selectedSkin: typeof parsed.selectedSkin === 'string' ? parsed.selectedSkin : 'classic',
        };
    } catch {
        return { ...DEFAULT };
    }
}

function writeMeta(meta) {
    try {
        localStorage.setItem(STORAGE_KEYS.meta, JSON.stringify(meta));
    } catch {
        noteStorageWriteFailure();
    }
}

export function loadMeta() {
    return readMeta();
}

export function loadSelectedSkin() {
    return readMeta().selectedSkin;
}

export function saveSelectedSkin(skinId) {
    const meta = readMeta();
    meta.selectedSkin = skinId;
    writeMeta(meta);
}

export function loadUnlockedAchievements() {
    return readMeta().achievements;
}

export function unlockAchievement(id) {
    const meta = readMeta();
    if (meta.achievements.includes(id)) return false;
    meta.achievements.push(id);
    writeMeta(meta);
    return true;
}
