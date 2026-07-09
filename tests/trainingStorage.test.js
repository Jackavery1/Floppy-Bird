import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    loadTrainingEnabled,
    saveTrainingEnabled,
    loadBestTrainingScore,
    saveBestTrainingScore,
} from '../src/trainingStorage.js';

describe('trainingStorage', () => {
    let store;

    beforeEach(() => {
        store = {};
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => {
                store[k] = v;
            },
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

    it('persiste le meilleur score entraînement', () => {
        expect(loadBestTrainingScore()).toBe(0);
        saveBestTrainingScore(8);
        expect(loadBestTrainingScore()).toBe(8);
        saveBestTrainingScore(6);
        expect(loadBestTrainingScore()).toBe(8);
        saveBestTrainingScore(12);
        expect(loadBestTrainingScore()).toBe(12);
    });

    it('persiste et cycle la vitesse entraînement', async () => {
        const { loadTrainingTimeScale, saveTrainingTimeScale, cycleTrainingTimeScale } =
            await import('../src/trainingStorage.js');
        const { GAME_CONFIG } = await import('../src/config.js');
        expect(loadTrainingTimeScale()).toBe(GAME_CONFIG.training.timeScale);
        saveTrainingTimeScale(0.7);
        expect(loadTrainingTimeScale()).toBe(0.7);
        expect(cycleTrainingTimeScale(0.7)).toBe(0.8);
        expect(cycleTrainingTimeScale(1)).toBe(0.6);
    });

    it('un skin spécial en entraînement a son propre record, sans polluer le commun', () => {
        saveBestTrainingScore(10, 'tempete');
        expect(loadBestTrainingScore('tempete')).toBe(10);
        expect(loadBestTrainingScore()).toBe(0);
        expect(loadBestTrainingScore('classic')).toBe(0);
    });
});
