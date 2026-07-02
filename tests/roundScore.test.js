import { describe, it, expect, vi, beforeEach } from 'vitest';
import { persistRoundScore } from '../src/roundScore.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/storage.js', () => ({
    saveHighScore: vi.fn((score, _diff, current) => Math.max(score, current ?? 0)),
    saveToLeaderboard: vi.fn(() => ({ entries: [{ score: 5, id: 'a' }], highlightId: 'a' })),
}));

vi.mock('../src/trainingStorage.js', () => ({
    saveBestTrainingScore: vi.fn(),
}));

describe('roundScore', () => {
    beforeEach(async () => {
        const { saveHighScore, saveToLeaderboard } = await import('../src/storage.js');
        vi.mocked(saveHighScore).mockClear();
        vi.mocked(saveToLeaderboard).mockClear();
    });

    function makeScene(overrides = {}) {
        const round = createRoundState();
        round.score = 5;
        round.roundHighScore = 3;
        if (overrides.score != null) round.score = overrides.score;
        if (overrides._roundHighScore != null) round.roundHighScore = overrides._roundHighScore;
        const rest = { ...overrides };
        delete rest.score;
        delete rest._roundHighScore;
        return {
            round,
            difficulty: 'normal',
            hardcoreMode: false,
            trainingMode: false,
            activeSkinId: 'classic',
            ...rest,
        };
    }

    it('persistRoundScore enregistre record et leaderboard en mode normal', async () => {
        const { saveHighScore, saveToLeaderboard } = await import('../src/storage.js');
        const scene = makeScene();
        const result = persistRoundScore(scene);

        expect(saveHighScore).toHaveBeenCalledWith(5, 'normal', 3, false, 'classic');
        expect(saveToLeaderboard).toHaveBeenCalledWith(5, 'normal', false, 'classic');
        expect(result.isNewRecord).toBe(true);
        expect(result.leaderboardData.highlightId).toBe('a');
        expect(scene.round.roundHighScore).toBe(5);
    });

    it('persistRoundScore ignore la persistance en mode entraînement', async () => {
        const { saveHighScore, saveToLeaderboard } = await import('../src/storage.js');
        const { saveBestTrainingScore } = await import('../src/trainingStorage.js');
        const scene = makeScene({ trainingMode: true });
        const result = persistRoundScore(scene);

        expect(saveBestTrainingScore).toHaveBeenCalledWith(5, 'classic');
        expect(saveHighScore).not.toHaveBeenCalled();
        expect(saveToLeaderboard).not.toHaveBeenCalled();
        expect(result.isNewRecord).toBe(false);
        expect(result.leaderboardData).toEqual({ entries: [], highlightId: null });
    });

    it('persistRoundScore sans nouveau record si score ≤ record de manche', () => {
        const scene = makeScene({ score: 2, _roundHighScore: 5 });
        const result = persistRoundScore(scene);
        expect(result.isNewRecord).toBe(false);
    });

    it('persistRoundScore resynchronise le record si le classement contient un score plus élevé', async () => {
        const { saveHighScore, saveToLeaderboard } = await import('../src/storage.js');
        vi.mocked(saveHighScore).mockReturnValueOnce(0);
        vi.mocked(saveToLeaderboard).mockReturnValueOnce({
            entries: [{ score: 48, id: 'legacy-48' }, { score: 5, id: 'a' }],
            highlightId: 'a',
        });
        vi.mocked(saveHighScore).mockReturnValueOnce(48);

        const scene = makeScene({ score: 5, _roundHighScore: 0 });
        const result = persistRoundScore(scene);

        expect(scene.round.roundHighScore).toBe(48);
        expect(saveHighScore).toHaveBeenLastCalledWith(48, 'normal', 0, false, 'classic');
        expect(result.leaderboardData.entries[0].score).toBe(48);
    });

    it('persistRoundScore route vers le classement dédié quand un skin spécial est actif', async () => {
        const { saveHighScore, saveToLeaderboard } = await import('../src/storage.js');
        const scene = makeScene({ activeSkinId: 'cosmos' });
        persistRoundScore(scene);

        expect(saveHighScore).toHaveBeenCalledWith(5, 'normal', 3, false, 'cosmos');
        expect(saveToLeaderboard).toHaveBeenCalledWith(5, 'normal', false, 'cosmos');
    });

    it('persistRoundScore utilise "classic" par défaut si activeSkinId absent', async () => {
        const { saveHighScore } = await import('../src/storage.js');
        const scene = makeScene();
        delete scene.activeSkinId;
        persistRoundScore(scene);

        expect(saveHighScore).toHaveBeenCalledWith(5, 'normal', 3, false, 'classic');
    });
});
