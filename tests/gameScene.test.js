import { describe, it, expect, vi } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { DIFFICULTY } from '../src/config.js';

vi.mock('phaser', () => {
    class Scene {
        constructor(config) {
            this.sys = { settings: config };
        }
    }
    return {
        default: {
            Scene,
            AUTO: 0,
            Scale: { NONE: 0, NO_CENTER: 0 },
        },
    };
});

vi.mock('../src/textures/index.js', () => ({
    preloadTextures: vi.fn(),
}));

vi.mock('../src/sceneSetup.js', () => ({
    setupSceneWorld: vi.fn(),
}));

vi.mock('../src/sceneDeath.js', () => ({
    triggerDeath: vi.fn(),
    updateDying: vi.fn(),
}));

vi.mock('../src/trainingStorage.js', () => ({
    loadTrainingEnabled: vi.fn(() => false),
}));

vi.mock('../src/hardcoreStorage.js', () => ({
    loadHardcoreEnabled: vi.fn(() => false),
}));

vi.mock('../src/sceneBackground.js', () => ({
    updateClouds: vi.fn(),
    updateGround: vi.fn(),
}));

vi.mock('../src/sceneBootstrap.js', () => ({
    frameStep: vi.fn(() => 1),
    checkCollisions: vi.fn(),
}));

vi.mock('../src/sceneJumpBuffer.js', () => ({
    processJumpBuffer: vi.fn(),
    tickJumpBuffer: vi.fn(),
}));

vi.mock('../src/sceneRound.js', () => ({
    checkScorePipes: vi.fn(),
    cancelPipeSpawnTimer: vi.fn(),
    clearSpawnInvincibility: vi.fn(),
}));

describe('GameScene', () => {
    it('démarre en état MENU avec difficulté normal', async () => {
        const { GameScene } = await import('../src/GameScene.js');
        const scene = new GameScene();
        expect(scene.state).toBe(GAME_STATE.MENU);
        expect(scene.difficulty).toBe(DIFFICULTY.NORMAL);
    });

    it('preload charge les textures', async () => {
        const { preloadTextures } = await import('../src/textures/index.js');
        const { GameScene } = await import('../src/GameScene.js');
        const scene = new GameScene();
        scene.preload();
        expect(preloadTextures).toHaveBeenCalledWith(scene);
    });

    it('create initialise le monde', async () => {
        const { setupSceneWorld } = await import('../src/sceneSetup.js');
        const { GameScene } = await import('../src/GameScene.js');
        const scene = new GameScene();
        scene.create();
        expect(setupSceneWorld).toHaveBeenCalledWith(scene);
    });

    it('délègue triggerDeath au module sceneDeath', async () => {
        const { triggerDeath } = await import('../src/sceneDeath.js');
        const { GameScene } = await import('../src/GameScene.js');
        const scene = new GameScene();
        scene.triggerDeath();
        expect(triggerDeath).toHaveBeenCalledWith(scene);
    });

    it('update délègue la boucle gameplay en état PLAYING', async () => {
        const { processJumpBuffer, tickJumpBuffer } = await import('../src/sceneJumpBuffer.js');
        const { checkCollisions } = await import('../src/sceneBootstrap.js');
        const { checkScorePipes } = await import('../src/sceneRound.js');
        const { updateClouds, updateGround } = await import('../src/sceneBackground.js');
        const { GameScene } = await import('../src/GameScene.js');

        const scene = new GameScene();
        scene.state = GAME_STATE.PLAYING;
        scene.game = { loop: { delta: 16.67, actualFps: 60 } };
        scene.bird = {
            update: vi.fn(),
            isOutOfBounds: vi.fn(() => false),
            isHittingGround: vi.fn(() => false),
        };
        scene.pipes = { update: vi.fn(), pipeSpeed: 2.7 };
        scene.ghost = { update: vi.fn() };
        scene._clouds = [];
        scene._spawnInvincible = false;

        scene.update();

        expect(processJumpBuffer).toHaveBeenCalledWith(scene);
        expect(scene.bird.update).toHaveBeenCalled();
        expect(scene.pipes.update).toHaveBeenCalled();
        expect(scene.ghost.update).toHaveBeenCalled();
        expect(checkCollisions).toHaveBeenCalledWith(scene);
        expect(checkScorePipes).toHaveBeenCalledWith(scene);
        expect(updateClouds).toHaveBeenCalled();
        expect(updateGround).toHaveBeenCalled();
        expect(tickJumpBuffer).toHaveBeenCalledWith(scene);
    });
});
