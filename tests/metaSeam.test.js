import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMetaSeam } from '../src/testSeam/metaSeam.js';
import { GAME_STATE } from '../src/gameState.js';

describe('metaSeam', () => {
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

    it('getOnboardingMetrics agrège tutoriel et parties démarrées', () => {
        const seam = createMetaSeam(() => undefined);
        const metrics = seam.getOnboardingMetrics();
        expect(metrics).toMatchObject({
            tutorialStep: expect.any(Number),
            tutorialComplete: expect.any(Boolean),
            roundsStarted: expect.any(Number),
            skipAfterRounds: expect.any(Number),
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

    it('saveDailyCompletion expose un ✓ non rétrogradable', () => {
        const seam = createMetaSeam(() => undefined);
        expect(seam.saveDailyCompletion({ goal: 5, score: 8 })).toBe(true);
        expect(seam.isDailyCompletedToday()).toBe(true);
        expect(seam.saveDailyCompletion({ goal: 5, score: 1 })).toBe(true);
        expect(seam.isDailyCompletedToday()).toBe(true);
    });

    it('simulateSkinUnlockAtScore signale les skins nouvellement débloqués', () => {
        const newly = [];
        const scene = {
            trainingMode: false,
            difficulty: 'normal',
            hardcoreMode: false,
            round: { score: 0, unlockedSkinIdsAtStart: ['classic'] },
            achievementNotifier: (list) => newly.push(...list),
        };
        const seam = createMetaSeam(() => scene);
        const result = seam.simulateSkinUnlockAtScore(10);
        expect(result.after.length).toBeGreaterThan(result.before.length);
        expect(result.newly.some((n) => n.kind === 'skin')).toBe(true);
        expect(newly.some((n) => n.kind === 'skin')).toBe(true);
    });
});
