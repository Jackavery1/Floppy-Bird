import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { interpolateGhostY, loadGhostData, saveGhostData } from '../src/training.js';

describe('training', () => {
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

    it('interpolateGhostY interpole entre deux points', () => {
        const path = [{ t: 0, y: 100 }, { t: 100, y: 200 }];
        expect(interpolateGhostY(path, 50)).toBe(150);
        expect(interpolateGhostY(path, 0)).toBe(100);
        expect(interpolateGhostY(path, 200)).toBe(200);
    });

    it('persiste le parcours fantôme avec le score', () => {
        saveGhostData(12, [{ t: 0, y: 256 }, { t: 50, y: 240 }]);
        const saved = loadGhostData();
        expect(saved.score).toBe(12);
        expect(saved.path).toHaveLength(2);
    });

    it('loadGhostData migre le format legacy tableau', () => {
        store['flappy-bird-ghost'] = JSON.stringify([{ t: 0, y: 200 }]);
        expect(loadGhostData().path).toHaveLength(1);
        expect(loadGhostData().score).toBe(0);
    });
});
