import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { loadTrainingEnabled, saveTrainingEnabled } from '../src/trainingStorage.js';

describe('trainingStorage', () => {
    let store;

    beforeEach(() => {
        store = {};
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => { store[k] = v; },
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('charge false par défaut', () => {
        expect(loadTrainingEnabled()).toBe(false);
    });

    it('persiste l’état entraînement', () => {
        saveTrainingEnabled(true);
        expect(loadTrainingEnabled()).toBe(true);
    });
});
