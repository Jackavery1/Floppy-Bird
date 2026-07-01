import { describe, it, expect, vi } from 'vitest';
import { frameStep, checkCollisions } from '../src/sceneBootstrap.js';
import { createRoundState } from '../src/roundState.js';

describe('sceneBootstrap', () => {
    it('frameStep normalise le delta à 60 FPS', () => {
        const scene = { game: { loop: { delta: 16.67 } }, trainingMode: false };
        expect(frameStep(scene)).toBeCloseTo(1, 0);
    });

    it('frameStep ralentit en mode entraînement', () => {
        const scene = { game: { loop: { delta: 16.67 } }, trainingMode: true };
        expect(frameStep(scene)).toBeCloseTo(0.65, 2);
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
        expect(scene.triggerDeath).toHaveBeenCalled();
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
});
