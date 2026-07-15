import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    announceScoreLive,
    resetScoreAnnounceState,
    shouldAnnounceScore,
} from '../src/sceneScoreAnnounce.js';

vi.mock('../src/sceneA11ySync.js', () => ({
    announceScoreReached: vi.fn(),
}));

describe('sceneScoreAnnounce', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        resetScoreAnnounceState();
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('annonce le 1er point et les multiples de 5 immédiatement', async () => {
        const { announceScoreReached } = await import('../src/sceneA11ySync.js');
        expect(shouldAnnounceScore(1)).toBe(true);
        expect(shouldAnnounceScore(5)).toBe(true);
        expect(shouldAnnounceScore(10)).toBe(true);
        expect(shouldAnnounceScore(25)).toBe(true);

        announceScoreLive(1);
        announceScoreLive(5);
        expect(announceScoreReached).toHaveBeenCalledWith(1);
        expect(announceScoreReached).toHaveBeenCalledWith(5);
    });

    it('debounce les scores inter-paliers', async () => {
        const { announceScoreReached } = await import('../src/sceneA11ySync.js');
        expect(shouldAnnounceScore(2)).toBe(false);
        expect(shouldAnnounceScore(7)).toBe(false);

        announceScoreLive(2);
        expect(announceScoreReached).not.toHaveBeenCalled();
        vi.advanceTimersByTime(700);
        expect(announceScoreReached).toHaveBeenCalledWith(2);
    });

    it('annule le debounce quand un palier est atteint', async () => {
        const { announceScoreReached } = await import('../src/sceneA11ySync.js');
        announceScoreLive(3);
        announceScoreLive(5);
        vi.advanceTimersByTime(700);
        expect(announceScoreReached).toHaveBeenCalledTimes(1);
        expect(announceScoreReached).toHaveBeenCalledWith(5);
    });

    it('resetScoreAnnounceState annule le debounce en cours', async () => {
        const { announceScoreReached } = await import('../src/sceneA11ySync.js');
        announceScoreLive(4);
        resetScoreAnnounceState();
        vi.advanceTimersByTime(700);
        expect(announceScoreReached).not.toHaveBeenCalled();
    });
});
