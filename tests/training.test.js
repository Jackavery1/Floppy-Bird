import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GhostReplay, interpolateGhostY, loadGhostData, saveGhostData } from '../src/training.js';
import { GAME_CONFIG } from '../src/config.js';

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

    it('GhostReplay enregistre les sauts et sauvegarde un meilleur run', () => {
        const sprite = {
            setDisplaySize: vi.fn(),
            setAlpha: vi.fn(),
            setDepth: vi.fn(),
            setTint: vi.fn(),
            setPosition: vi.fn(),
            setFrame: vi.fn(),
            destroy: vi.fn(),
        };
        const scene = {
            trainingMode: true,
            time: { now: 0 },
            bird: { y: 250 },
            add: { sprite: vi.fn(() => sprite) },
        };
        const ghost = new GhostReplay(scene);
        ghost.beginRound();
        scene.time.now = 100;
        ghost.recordJump();
        ghost.update(GAME_CONFIG.training.sampleEveryFrames);
        ghost.finishRound(5);
        const saved = loadGhostData();
        expect(saved.score).toBe(5);
        expect(saved.path.some(p => p.j === 1)).toBe(true);
    });
});
