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

    it('un skin spécial en entraînement a son propre record, sans polluer le commun', () => {
        saveBestTrainingScore(10, 'tempete');
        expect(loadBestTrainingScore('tempete')).toBe(10);
        expect(loadBestTrainingScore()).toBe(0);
        expect(loadBestTrainingScore('classic')).toBe(0);
    });
});
