import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadDailyChallengeEnabled, saveDailyChallengeEnabled } from '../src/dailyChallengeStorage.js';

const store = new Map();

beforeEach(() => {
    store.clear();
    vi.stubGlobal('localStorage', {
        getItem: (key) => store.get(key) ?? null,
        setItem: (key, value) => { store.set(key, value); },
        removeItem: (key) => { store.delete(key); },
        clear: () => { store.clear(); },
    });
});

describe('dailyChallengeStorage', () => {
    it('active le défi par défaut si absent', () => {
        expect(loadDailyChallengeEnabled()).toBe(true);
    });

    it('persiste OFF et ON', () => {
        saveDailyChallengeEnabled(false);
        expect(loadDailyChallengeEnabled()).toBe(false);
        saveDailyChallengeEnabled(true);
        expect(loadDailyChallengeEnabled()).toBe(true);
    });
});
