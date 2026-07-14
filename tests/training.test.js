import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    GhostReplay,
    ghostMatchesMode,
    interpolateGhostY,
    loadGhostData,
    saveGhostData,
} from '../src/training.js';
import { GAME_CONFIG } from '../src/config.js';

vi.mock('../src/textures/index.js', () => ({
    ensureBirdTexture: vi.fn(),
}));

describe('training', () => {
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

    it('interpolateGhostY interpole entre deux points', () => {
        const path = [
            { t: 0, y: 100 },
            { t: 100, y: 200 },
        ];
        expect(interpolateGhostY(path, 50)).toBe(150);
        expect(interpolateGhostY(path, 0)).toBe(100);
        expect(interpolateGhostY(path, 200)).toBe(200);
    });

    it('persiste le parcours fantôme avec le score et le mode', () => {
        saveGhostData(
            12,
            [
                { t: 0, y: 256 },
                { t: 50, y: 240 },
            ],
            {
                difficulty: 'hard',
                hardcore: true,
            }
        );
        const saved = loadGhostData();
        expect(saved.score).toBe(12);
        expect(saved.path).toHaveLength(2);
        expect(saved.difficulty).toBe('hard');
        expect(saved.hardcore).toBe(true);
    });

    it('ghostMatchesMode ignore les fantômes d’un autre mode', () => {
        expect(ghostMatchesMode({ difficulty: 'normal', hardcore: false }, 'hard', false)).toBe(
            false
        );
        expect(ghostMatchesMode({ difficulty: null, hardcore: false }, 'hard', false)).toBe(true);
    });

    it('loadGhostData migre le format legacy tableau', () => {
        store['flappy-bird-ghost'] = JSON.stringify([{ t: 0, y: 200 }]);
        expect(loadGhostData().path).toHaveLength(1);
        expect(loadGhostData().score).toBe(0);
    });

    it('GhostReplay enregistre les sauts et sauvegarde un meilleur run', () => {
        saveGhostData(3, [{ t: 0, y: 256 }], { difficulty: 'normal', hardcore: false });
        const sprite = {
            setScale: vi.fn(),
            setAlpha: vi.fn(),
            setDepth: vi.fn(),
            setTint: vi.fn(),
            setPosition: vi.fn(),
            setFrame: vi.fn(),
            destroy: vi.fn(),
        };
        const scene = {
            trainingMode: true,
            difficulty: 'normal',
            hardcoreMode: false,
            time: { now: 0 },
            bird: { y: 250 },
            add: { sprite: vi.fn(() => sprite) },
        };
        const ghost = new GhostReplay(scene);
        ghost.beginRound({ record: true });
        expect(scene.add.sprite).toHaveBeenCalledWith(
            GAME_CONFIG.bird.startX,
            GAME_CONFIG.centerY,
            'bird-sheet-fantome',
            1
        );
        scene.time.now = 100;
        ghost.recordJump();
        ghost.update(GAME_CONFIG.training.sampleEveryFrames);
        ghost.finishRound(5);
        const saved = loadGhostData();
        expect(saved.score).toBe(5);
        expect(saved.path.some((p) => p.j === 1)).toBe(true);
    });

    it('GhostReplay rejoue en daily sans enregistrer', () => {
        saveGhostData(3, [{ t: 0, y: 256 }], { difficulty: 'normal', hardcore: false });
        const sprite = {
            setScale: vi.fn(),
            setAlpha: vi.fn(),
            setDepth: vi.fn(),
            setTint: vi.fn(),
            setPosition: vi.fn(),
            setFrame: vi.fn(),
            destroy: vi.fn(),
        };
        const scene = {
            trainingMode: false,
            playMode: 'daily',
            difficulty: 'normal',
            hardcoreMode: false,
            time: { now: 50 },
            bird: { y: 250 },
            add: { sprite: vi.fn(() => sprite) },
        };
        const ghost = new GhostReplay(scene);
        ghost.beginRound({ record: false });
        expect(scene.add.sprite).toHaveBeenCalled();
        ghost.update(1);
        ghost.finishRound(10);
        expect(loadGhostData().score).toBe(3);
    });

    it('loadGhostData retourne vide si JSON invalide', () => {
        store['flappy-bird-ghost'] = '{bad json';
        expect(loadGhostData().path).toEqual([]);
    });

    it('saveGhostData ignore un parcours vide', () => {
        saveGhostData(5, [], { difficulty: 'normal', hardcore: false });
        expect(store['flappy-bird-ghost']).toBeUndefined();
    });

    it('interpolateGhostY retourne null sans points', () => {
        expect(interpolateGhostY([], 100)).toBeNull();
    });

    it('ghostMatchesMode accepte un fantôme du même mode', () => {
        expect(ghostMatchesMode({ difficulty: 'hard', hardcore: true }, 'hard', true)).toBe(true);
    });

    it('GhostReplay détruit le sprite hors entraînement et hors daily', () => {
        const sprite = { destroy: vi.fn() };
        const scene = {
            trainingMode: false,
            playMode: 'classic',
            difficulty: 'normal',
            hardcoreMode: false,
            time: { now: 0 },
            bird: { y: 250 },
            add: { sprite: vi.fn(() => sprite) },
        };
        const ghost = new GhostReplay(scene);
        ghost.sprite = sprite;
        ghost.beginRound({ record: false });
        expect(sprite.destroy).toHaveBeenCalled();
        expect(ghost.sprite).toBeNull();
    });

    it('GhostReplay ne sauvegarde pas si le score ne bat pas le record', () => {
        saveGhostData(10, [{ t: 0, y: 256 }], { difficulty: 'normal', hardcore: false });
        const sprite = {
            setScale: vi.fn(),
            setAlpha: vi.fn(),
            setDepth: vi.fn(),
            setTint: vi.fn(),
            setPosition: vi.fn(),
            setFrame: vi.fn(),
            destroy: vi.fn(),
        };
        const scene = {
            trainingMode: true,
            difficulty: 'normal',
            hardcoreMode: false,
            time: { now: 0 },
            bird: { y: 250 },
            add: { sprite: vi.fn(() => sprite) },
        };
        const ghost = new GhostReplay(scene);
        ghost.beginRound({ record: true });
        ghost.finishRound(5);
        expect(loadGhostData().score).toBe(10);
    });
});
