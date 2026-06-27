import { describe, it, expect, vi } from 'vitest';
import { frameStep, checkCollisions } from '../src/sceneBootstrap.js';

describe('sceneBootstrap', () => {
    it('frameStep normalise le delta à 60 FPS', () => {
        const scene = { game: { loop: { delta: 16.67 } } };
        expect(frameStep(scene)).toBeCloseTo(1, 0);
    });

    it('checkCollisions ignore si invincible', () => {
        const scene = {
            _spawnInvincible: true,
            pipes: { checkCollisionWithBird: vi.fn(() => true) },
            triggerDeath: vi.fn(),
        };
        checkCollisions(scene);
        expect(scene.triggerDeath).not.toHaveBeenCalled();
    });

    it('checkCollisions déclenche la mort sur collision', () => {
        const scene = {
            _spawnInvincible: false,
            bird: { getBounds: () => ({}) },
            pipes: { checkCollisionWithBird: vi.fn(() => true) },
            triggerDeath: vi.fn(),
        };
        checkCollisions(scene);
        expect(scene.triggerDeath).toHaveBeenCalled();
    });
});
