import { describe, it, expect, vi } from 'vitest';
import { DIFFICULTY } from '../src/config.js';
import { createSceneModesState } from '../src/sceneModes.js';

vi.mock('../src/trainingStorage.js', () => ({
    loadTrainingEnabled: vi.fn(() => false),
    loadTrainingTimeScale: vi.fn(() => 0.8),
}));

vi.mock('../src/hardcoreStorage.js', () => ({
    loadHardcoreEnabled: vi.fn(() => false),
    saveHardcoreEnabled: vi.fn(),
}));

vi.mock('../src/highScores.js', () => ({
    loadHighScore: vi.fn(() => 0),
    loadBestScoreAny: vi.fn(() => 0),
    loadBestHardcoreScore: vi.fn(() => 0),
}));

describe('sceneModes', () => {
    it('initialise difficulté normale et playMode classique', async () => {
        const { loadTrainingEnabled } = await import('../src/trainingStorage.js');
        vi.mocked(loadTrainingEnabled).mockReturnValueOnce(true);

        const modes = createSceneModesState();

        expect(modes.difficulty).toBe(DIFFICULTY.NORMAL);
        expect(modes.trainingMode).toBe(true);
        expect(modes.playMode).toBe('classic');
        expect(modes.dailyChallengeMode).toBe(false);
    });

    it('désactive hardcore si training et hardcore actifs', async () => {
        const { loadTrainingEnabled } = await import('../src/trainingStorage.js');
        const { loadHardcoreEnabled, saveHardcoreEnabled } =
            await import('../src/hardcoreStorage.js');
        const { loadBestScoreAny } = await import('../src/highScores.js');
        const { HARDCORE_UNLOCK_SCORE } = await import('../src/hardcoreUnlock.js');
        vi.mocked(loadTrainingEnabled).mockReturnValueOnce(true);
        vi.mocked(loadHardcoreEnabled).mockReturnValueOnce(true);
        vi.mocked(loadBestScoreAny).mockReturnValue(HARDCORE_UNLOCK_SCORE);

        const modes = createSceneModesState();

        expect(modes.hardcoreMode).toBe(false);
        expect(saveHardcoreEnabled).toHaveBeenCalledWith(false);
    });

    it('désactive hardcore si non débloqué', async () => {
        const { loadHardcoreEnabled, saveHardcoreEnabled } =
            await import('../src/hardcoreStorage.js');
        const { loadBestScoreAny } = await import('../src/highScores.js');
        vi.mocked(loadHardcoreEnabled).mockReturnValueOnce(true);
        vi.mocked(loadBestScoreAny).mockReturnValue(0);

        const modes = createSceneModesState();

        expect(modes.hardcoreMode).toBe(false);
        expect(saveHardcoreEnabled).toHaveBeenCalledWith(false);
    });
});
