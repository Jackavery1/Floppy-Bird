import { describe, it, expect, vi, afterEach } from 'vitest';
import { updateSpawnInvincibilityVisual } from '../src/sceneSpawnFeedback.js';
import { createRoundState } from '../src/roundState.js';

describe('sceneSpawnFeedback', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('pulse l’alpha du bird pendant l’invincibilité spawn', () => {
        const sprite = {
            alpha: 1,
            setAlpha: vi.fn((v) => {
                sprite.alpha = v;
            }),
        };
        const scene = {
            round: createRoundState(),
            bird: { sprite },
            time: { now: 100 },
        };
        scene.round.spawnInvincible = true;

        updateSpawnInvincibilityVisual(scene);

        expect(sprite.setAlpha).toHaveBeenCalled();
        expect(sprite.alpha).toBeLessThan(1);
        expect(sprite.alpha).toBeGreaterThan(0.5);
    });

    it('restaure alpha 1 hors invincibilité', () => {
        const sprite = {
            alpha: 0.6,
            setAlpha: vi.fn((v) => {
                sprite.alpha = v;
            }),
        };
        const scene = {
            round: createRoundState(),
            bird: { sprite },
            time: { now: 0 },
        };

        updateSpawnInvincibilityVisual(scene);

        expect(sprite.setAlpha).toHaveBeenCalledWith(1);
    });

    it('alpha fixe si prefers-reduced-motion', async () => {
        vi.stubGlobal(
            'matchMedia',
            vi.fn(() => ({ matches: true }))
        );
        const sprite = {
            alpha: 1,
            setAlpha: vi.fn((v) => {
                sprite.alpha = v;
            }),
        };
        const scene = {
            round: createRoundState(),
            bird: { sprite },
            time: { now: 100 },
        };
        scene.round.spawnInvincible = true;

        updateSpawnInvincibilityVisual(scene);

        expect(sprite.setAlpha).toHaveBeenCalledWith(0.75);
    });
});
