import { describe, it, expect, vi } from 'vitest';
import { DIFFICULTY } from '../src/config.js';
import { createSceneModesState } from '../src/sceneModes.js';

vi.mock('../src/trainingStorage.js', () => ({
    loadTrainingEnabled: vi.fn(() => false),
}));

vi.mock('../src/hardcoreStorage.js', () => ({
    loadHardcoreEnabled: vi.fn(() => false),
    saveHardcoreEnabled: vi.fn(),
}));

vi.mock('../src/storage.js', () => ({
    loadHighScore: vi.fn(() => 0),
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
        const { loadHighScore } = await import('../src/storage.js');
        vi.mocked(loadTrainingEnabled).mockReturnValueOnce(true);
        vi.mocked(loadHardcoreEnabled).mockReturnValueOnce(true);
        vi.mocked(loadHighScore).mockReturnValue(15);

        const modes = createSceneModesState();

        expect(modes.hardcoreMode).toBe(false);
        expect(saveHardcoreEnabled).toHaveBeenCalledWith(false);
    });

    it('désactive hardcore si non débloqué', async () => {
        const { loadHardcoreEnabled, saveHardcoreEnabled } =
            await import('../src/hardcoreStorage.js');
        const { loadHighScore } = await import('../src/storage.js');
        vi.mocked(loadHardcoreEnabled).mockReturnValueOnce(true);
        vi.mocked(loadHighScore).mockReturnValue(0);

        const modes = createSceneModesState();

        expect(modes.hardcoreMode).toBe(false);
        expect(saveHardcoreEnabled).toHaveBeenCalledWith(false);
    });
});
