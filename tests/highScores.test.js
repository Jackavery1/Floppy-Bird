import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/storage.js', () => ({
    loadHighScore: vi.fn((diff, hardcore) => {
        if (hardcore) return { easy: 1, normal: 2, hard: 3 }[diff] ?? 0;
        return { easy: 10, normal: 20, hard: 5 }[diff] ?? 0;
    }),
    saveHighScore: vi.fn((score) => score),
}));

describe('highScores', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('délègue loadHighScore et saveHighScore au stockage', async () => {
        const storage = await import('../src/storage.js');
        const { loadHighScore, saveHighScore } = await import('../src/highScores.js');

        expect(loadHighScore('normal', false)).toBe(20);
        expect(storage.loadHighScore).toHaveBeenCalledWith('normal', false);
        expect(saveHighScore(10, 'hard')).toBe(10);
        expect(storage.saveHighScore).toHaveBeenCalledWith(10, 'hard');
    });

    it('loadBestScoreAny prend le max classique', async () => {
        const { loadBestScoreAny } = await import('../src/highScores.js');
        expect(loadBestScoreAny()).toBe(20);
    });

    it('loadBestHardcoreScore prend le max hardcore', async () => {
        const { loadBestHardcoreScore } = await import('../src/highScores.js');
        expect(loadBestHardcoreScore()).toBe(3);
    });
});
