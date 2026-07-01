import { describe, it, expect, vi } from 'vitest';
import { DIFFICULTY } from '../src/config.js';
import { initSceneModes, createSceneModesState } from '../src/sceneModes.js';

vi.mock('../src/dailyChallengeStorage.js', () => ({
    loadDailyChallengeEnabled: vi.fn(() => true),
}));

vi.mock('../src/trainingStorage.js', () => ({
    loadTrainingEnabled: vi.fn(() => false),
}));

vi.mock('../src/hardcoreStorage.js', () => ({
    loadHardcoreEnabled: vi.fn(() => false),
    saveHardcoreEnabled: vi.fn(),
}));

describe('sceneModes', () => {
    it('initialise difficulté normale et modes depuis le stockage', async () => {
        const { loadTrainingEnabled } = await import('../src/trainingStorage.js');
        const { loadHardcoreEnabled } = await import('../src/hardcoreStorage.js');
        vi.mocked(loadTrainingEnabled).mockReturnValueOnce(true);
        vi.mocked(loadHardcoreEnabled).mockReturnValueOnce(false);

        const scene = {};
        initSceneModes(scene);

        expect(scene.difficulty).toBe(DIFFICULTY.NORMAL);
        expect(scene.trainingMode).toBe(true);
        expect(scene.hardcoreMode).toBe(false);
        expect(scene.dailyChallengeMode).toBe(true);
    });

    it('désactive hardcore si training et hardcore actifs', async () => {
        const { loadTrainingEnabled } = await import('../src/trainingStorage.js');
        const { loadHardcoreEnabled, saveHardcoreEnabled } = await import('../src/hardcoreStorage.js');
        vi.mocked(loadTrainingEnabled).mockReturnValueOnce(true);
        vi.mocked(loadHardcoreEnabled).mockReturnValueOnce(true);

        const modes = createSceneModesState();

        expect(modes.hardcoreMode).toBe(false);
        expect(saveHardcoreEnabled).toHaveBeenCalledWith(false);
    });

    it('initSceneModes assigne l’état sur la scène', () => {
        const scene = {};
        initSceneModes(scene);
        expect(scene.difficulty).toBe(DIFFICULTY.NORMAL);
    });
});
