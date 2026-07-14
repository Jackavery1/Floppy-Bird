import { describe, it, expect } from 'vitest';
import { createMetaSeam } from '../src/testSeam/metaSeam.js';
import { GAME_STATE } from '../src/gameState.js';

describe('metaSeam', () => {
    it('getLastDeathMetrics retourne null sans mort enregistrée', () => {
        const seam = createMetaSeam(() => ({ round: { lastDeathMetrics: null } }));
        expect(seam.getLastDeathMetrics()).toBeNull();
    });

    it('getLastDeathMetrics expose cause score et elapsedMs', () => {
        const seam = createMetaSeam(() => ({
            round: {
                lastDeathMetrics: {
                    cause: 'pipe',
                    score: 2,
                    elapsedMs: 4200,
                    isEarlyDeath: true,
                    beforeFirstPipe: false,
                },
            },
        }));
        expect(seam.getLastDeathMetrics()).toEqual({
            cause: 'pipe',
            score: 2,
            elapsedMs: 4200,
            isEarlyDeath: true,
            beforeFirstPipe: false,
        });
    });

    it('getRoundRuntime expose score et elapsedMs depuis startedAt', () => {
        const scene = {
            state: GAME_STATE.PLAYING,
            round: { score: 3, startedAt: 1000 },
            time: { now: 2500 },
        };
        const seam = createMetaSeam(() => scene);
        expect(seam.getRoundRuntime()).toEqual({
            state: GAME_STATE.PLAYING,
            score: 3,
            startedAt: 1000,
            elapsedMs: 1500,
        });
    });

    it('getRoundRuntime retourne null sans scène', () => {
        const seam = createMetaSeam(() => undefined);
        expect(seam.getRoundRuntime()).toBeNull();
    });

    it('getRoundRuntime elapsedMs vaut 0 avant démarrage de manche', () => {
        const scene = {
            state: GAME_STATE.MENU,
            round: { score: 0, startedAt: 0 },
            time: { now: 5000 },
        };
        const seam = createMetaSeam(() => scene);
        expect(seam.getRoundRuntime()?.elapsedMs).toBe(0);
    });
});
