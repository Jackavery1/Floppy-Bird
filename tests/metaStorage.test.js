import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    loadMeta,
    loadSelectedSkin,
    saveSelectedSkin,
    unlockAchievement,
    loadUnlockedAchievements,
} from '../src/metaStorage.js';

const store = new Map();

beforeEach(() => {
    store.clear();
    vi.stubGlobal('localStorage', {
        getItem: (key) => store.get(key) ?? null,
        setItem: (key, value) => {
            store.set(key, value);
        },
        removeItem: (key) => {
            store.delete(key);
        },
        clear: () => {
            store.clear();
        },
    });
});

describe('metaStorage', () => {
    it('loadMeta retourne les défauts', () => {
        const meta = loadMeta();
        expect(meta.achievements).toEqual([]);
        expect(meta.selectedSkin).toBe('classic');
    });

    it('unlockAchievement persiste et ignore les doublons', () => {
        expect(unlockAchievement('first_flight')).toBe(true);
        expect(unlockAchievement('first_flight')).toBe(false);
        expect(loadUnlockedAchievements()).toContain('first_flight');
    });

    it('saveSelectedSkin persiste le skin', () => {
        saveSelectedSkin('ruby');
        expect(loadSelectedSkin()).toBe('ruby');
    });
});
