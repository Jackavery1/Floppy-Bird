import { describe, it, expect, vi } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { DIFFICULTY } from '../src/config.js';
import { initSceneCore } from '../src/sceneContext.js';

vi.mock('../src/trainingStorage.js', () => ({
    loadTrainingEnabled: vi.fn(() => false),
    loadTrainingTimeScale: vi.fn(() => 0.8),
}));

vi.mock('../src/hardcoreStorage.js', () => ({
    loadHardcoreEnabled: vi.fn(() => false),
    saveHardcoreEnabled: vi.fn(),
}));

describe('sceneContext', () => {
    it('initSceneCore initialise tous les champs SceneContext', async () => {
        const scene = {};
        initSceneCore(scene);

        expect(scene.bird).toBeNull();
        expect(scene.pipes).toBeNull();
        expect(scene.ui).toBeNull();
        expect(scene.scoreEffects).toBeNull();
        expect(scene.ghost).toBeNull();
        expect(scene.state).toBe(GAME_STATE.MENU);
        expect(scene.difficulty).toBe(DIFFICULTY.NORMAL);
        expect(scene.trainingMode).toBe(false);
        expect(scene.hardcoreMode).toBe(false);
        expect(scene.dailyChallengeMode).toBe(false);
        expect(scene.round).toBeTruthy();
        expect(scene.round.score).toBe(0);
        expect(scene._clouds).toEqual([]);
        expect(scene._groundSprite).toBeNull();
        expect(scene.fps).toBeNull();
        expect(scene.achievementNotifier).toBeUndefined();
    });
});
