import { describe, it, expect, vi } from 'vitest';
import {
    setTrainingMode,
    setHardcoreMode,
    toggleTrainingMode,
    toggleHardcoreMode,
} from '../src/sceneModeSettings.js';

vi.mock('../src/trainingStorage.js', () => ({
    saveTrainingEnabled: vi.fn(),
    loadTrainingEnabled: vi.fn(() => false),
    loadBestTrainingScore: vi.fn(() => 0),
}));

vi.mock('../src/hardcoreStorage.js', () => ({
    saveHardcoreEnabled: vi.fn(),
}));

vi.mock('../src/storage.js', () => ({
    loadHighScore: vi.fn(() => 15),
}));

vi.mock('../src/sceneBootstrap.js', () => ({
    applyTrainingTimeScale: vi.fn(),
}));

describe('sceneModeSettings', () => {
    function makeScene() {
        return {
            trainingMode: false,
            hardcoreMode: false,
            difficulty: 'normal',
            dailyChallengeMode: false,
            playMode: 'classic',
            round: { score: 0 },
            ui: {
                updateTrainingLabel: vi.fn(),
                updateHardcoreLabel: vi.fn(),
                refreshHardcoreLockState: vi.fn(),
                refreshHighScore: vi.fn(),
            },
        };
    }

    it('setTrainingMode persiste et met à jour l’UI', async () => {
        const { saveTrainingEnabled } = await import('../src/trainingStorage.js');
        const scene = makeScene();
        setTrainingMode(scene, true);
        expect(scene.trainingMode).toBe(true);
        expect(saveTrainingEnabled).toHaveBeenCalledWith(true);
        expect(scene.ui.updateTrainingLabel).toHaveBeenCalledWith(true);
    });

    it('setTrainingMode désactive le hardcore (exclusifs)', async () => {
        const { saveHardcoreEnabled } = await import('../src/hardcoreStorage.js');
        const scene = makeScene();
        scene.hardcoreMode = true;
        setTrainingMode(scene, true);
        expect(scene.hardcoreMode).toBe(false);
        expect(saveHardcoreEnabled).toHaveBeenCalledWith(false);
    });

    it('setHardcoreMode désactive l’entraînement (exclusifs)', async () => {
        const { saveTrainingEnabled } = await import('../src/trainingStorage.js');
        const scene = makeScene();
        scene.trainingMode = true;
        setHardcoreMode(scene, true);
        expect(scene.trainingMode).toBe(false);
        expect(saveTrainingEnabled).toHaveBeenCalledWith(false);
    });

    it('toggleTrainingMode bascule l’état', () => {
        const scene = makeScene();
        toggleTrainingMode(scene);
        expect(scene.trainingMode).toBe(true);
    });

    it('toggleHardcoreMode bascule l’état', () => {
        const scene = makeScene();
        toggleHardcoreMode(scene);
        expect(scene.hardcoreMode).toBe(true);
    });
});
