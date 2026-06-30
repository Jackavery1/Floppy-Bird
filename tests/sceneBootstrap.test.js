import { describe, it, expect, vi } from 'vitest';
import { frameStep, checkCollisions } from '../src/sceneBootstrap.js';

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
