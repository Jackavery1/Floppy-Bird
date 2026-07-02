import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    saveDailyCompletion,
    loadDailyStats,
    isDailyCompletedToday,
} from '../src/dailyChallengeProgress.js';

describe('dailyChallengeProgress stats', () => {
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

    const day = new Date(2026, 0, 15);

    it('compte une réussite par jour maximum', () => {
        saveDailyCompletion({
            goal: 5, score: 6, difficulty: 'normal', skinId: 'classic', date: day,
        });
        expect(loadDailyStats().totalCompletions).toBe(1);
        expect(isDailyCompletedToday(day)).toBe(true);

        saveDailyCompletion({
            goal: 5, score: 10, difficulty: 'normal', skinId: 'classic', date: day,
        });
        expect(loadDailyStats().totalCompletions).toBe(1);
    });

    it('incrémente sur des jours différents', () => {
        saveDailyCompletion({
            goal: 5, score: 6, difficulty: 'normal', skinId: 'classic', date: day,
        });
        saveDailyCompletion({
            goal: 5, score: 7, difficulty: 'normal', skinId: 'classic',
            date: new Date(2026, 0, 16),
        });
        expect(loadDailyStats().totalCompletions).toBe(2);
    });

    it('n’incrémente pas si objectif non atteint', () => {
        saveDailyCompletion({
            goal: 10, score: 4, difficulty: 'normal', skinId: 'classic', date: day,
        });
        expect(loadDailyStats().totalCompletions).toBe(0);
        expect(isDailyCompletedToday(day)).toBe(false);
    });
});
