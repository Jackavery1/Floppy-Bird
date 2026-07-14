import './helpers/gameSceneMocks.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { GameScene } from '../src/GameScene.js';
import { triggerDeath } from '../src/sceneDeath.js';
import { hasCoyoteGrace } from '../src/sceneCoyote.js';
import { createPlayingGameScene } from './helpers/gameSceneHarness.js';

describe('GameScene mort et shutdown', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('le coyote time protège le plafond après sortie de gap', () => {
        const scene = createPlayingGameScene(GameScene);
        scene.bird.isOutOfBounds = vi.fn(() => true);
        scene.bird.isHittingGround = vi.fn(() => false);
        vi.mocked(hasCoyoteGrace).mockReturnValue(true);

        scene.update();

        expect(triggerDeath).not.toHaveBeenCalled();
    });

    it('le plafond tue sans coyote actif', () => {
        const scene = createPlayingGameScene(GameScene);
        scene.bird.isOutOfBounds = vi.fn(() => true);
        scene.bird.isHittingGround = vi.fn(() => false);
        vi.mocked(hasCoyoteGrace).mockReturnValue(false);

        scene.update();

        expect(triggerDeath).toHaveBeenCalledWith(scene, 'ceiling');
    });

    it('le sol déclenche une mort différenciée', () => {
        vi.mocked(hasCoyoteGrace).mockReturnValue(false);
        const scene = createPlayingGameScene(GameScene);
        scene.bird.isHittingGround = vi.fn(() => true);

        scene.update();

        expect(triggerDeath).toHaveBeenCalledWith(scene, 'ground');
    });

    it('update délègue updateDying en état DYING', async () => {
        const { updateDying } = await import('../src/sceneDeath.js');
        const scene = new GameScene();
        scene.state = GAME_STATE.DYING;
        scene.game = { loop: { delta: 16.67, actualFps: 60 } };
        scene._clouds = [];
        scene._hills = [];
        scene._groundSprite = {};
        scene.pipes = { pipeSpeed: 0, update: vi.fn() };

        scene.update();

        expect(updateDying).toHaveBeenCalledWith(scene);
    });

    it('shutdown nettoie les ressources', async () => {
        const { cancelPipeSpawnTimer, clearSpawnInvincibility } =
            await import('../src/sceneRound.js');
        const scene = new GameScene();
        scene.ghost = { destroy: vi.fn() };
        scene.bird = { destroy: vi.fn() };
        scene.pipes = { destroy: vi.fn() };
        scene.scoreEffects = { destroy: vi.fn() };
        scene.ui = { destroy: vi.fn() };

        scene.shutdown();

        expect(cancelPipeSpawnTimer).toHaveBeenCalledWith(scene);
        expect(clearSpawnInvincibility).toHaveBeenCalledWith(scene);
        expect(scene.ghost.destroy).toHaveBeenCalled();
        expect(scene.ui.destroy).toHaveBeenCalled();
    });
});
