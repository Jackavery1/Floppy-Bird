import { describe, it, expect, vi } from 'vitest';
import {
    frameStep,
    splitPhysicsSteps,
    checkCollisions,
    warnFileProtocol,
    primeAudio,
    applyTrainingTimeScale,
} from '../src/sceneBootstrap.js';
import { createRoundState } from '../src/roundState.js';

describe('sceneBootstrap', () => {
    it('frameStep normalise le delta à 60 FPS', () => {
        const scene = { game: { loop: { delta: 16.67 } }, trainingMode: false };
        expect(frameStep(scene)).toBeCloseTo(1, 0);
    });

    it('frameStep ralentit en mode entraînement', () => {
        const scene = {
            game: { loop: { delta: 16.67 } },
            trainingMode: true,
            trainingTimeScale: 0.8,
        };
        expect(frameStep(scene)).toBeCloseTo(0.8, 2);
    });

    it('splitPhysicsSteps découpe les gros deltas en sous-étapes', () => {
        expect(splitPhysicsSteps(2.5)).toEqual([1, 1, 0.5]);
        expect(splitPhysicsSteps(0)).toEqual([]);
        expect(splitPhysicsSteps(0.8)).toEqual([0.8]);
    });

    it('checkCollisions ignore si invincible', () => {
        const round = createRoundState();
        round.spawnInvincible = true;
        const scene = {
            round,
            pipes: { checkCollisionWithBird: vi.fn(() => true) },
            triggerDeath: vi.fn(),
        };
        checkCollisions(scene);
        expect(scene.triggerDeath).not.toHaveBeenCalled();
    });

    it('checkCollisions déclenche la mort sur collision', () => {
        const scene = {
            round: createRoundState(),
            bird: { getBounds: () => ({}) },
            pipes: { checkCollisionWithBird: vi.fn(() => true) },
            triggerDeath: vi.fn(),
        };
        checkCollisions(scene);
        expect(scene.triggerDeath).toHaveBeenCalledWith('pipe');
    });

    it('checkCollisions ignore la collision avec coyote time actif', () => {
        const round = createRoundState();
        round.coyoteFrames = 2;
        const scene = {
            round,
            bird: { getBounds: () => ({}) },
            pipes: { checkCollisionWithBird: vi.fn(() => true) },
            triggerDeath: vi.fn(),
        };
        checkCollisions(scene);
        expect(scene.triggerDeath).not.toHaveBeenCalled();
    });

    it('warnFileProtocol ajoute un avertissement en file://', () => {
        const stored = {};
        vi.stubGlobal('location', { protocol: 'file:' });
        vi.stubGlobal('document', {
            getElementById: vi.fn(() => null),
            createElement: vi.fn(() => ({
                id: '',
                textContent: '',
            })),
            body: {
                prepend: vi.fn((el) => {
                    stored.warn = el;
                }),
            },
        });
        warnFileProtocol();
        expect(stored.warn?.textContent).toMatch(/serveur requis/i);
        vi.unstubAllGlobals();
    });

    it('primeAudio enregistre reprise sur pointer et clavier', () => {
        const resume = vi.fn();
        const scene = {
            input: {
                once: vi.fn((event, cb) => {
                    if (event === 'pointerdown' || event === 'keydown') cb();
                }),
                keyboard: { once: vi.fn((event, cb) => cb()) },
            },
        };
        primeAudio(scene, resume);
        expect(resume).toHaveBeenCalledTimes(2);
    });

    it('applyTrainingTimeScale reflète le timeScale entraînement', () => {
        const scene = { trainingMode: true, trainingTimeScale: 0.6, time: { timeScale: 1 } };
        applyTrainingTimeScale(scene);
        expect(scene.time.timeScale).toBe(0.6);
    });
});
