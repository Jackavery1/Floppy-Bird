import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { DIFFICULTY } from '../src/config.js';
import { createRoundState } from '../src/roundState.js';

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
    saveHardcoreEnabled: vi.fn(),
}));

vi.mock('../src/storage.js', () => ({
    loadHighScore: vi.fn(() => 0),
}));

vi.mock('../src/sceneBackground.js', () => ({
    updateClouds: vi.fn(),
    updateGround: vi.fn(),
}));

vi.mock('../src/sceneBootstrap.js', () => ({
    frameStep: vi.fn(() => 1),
    splitPhysicsSteps: vi.fn((step) => [step]),
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
    tickPipeSpawnFallback: vi.fn(),
}));

vi.mock('../src/sceneCoyote.js', () => ({
    updateCoyoteTime: vi.fn(),
    updateCoyoteVisual: vi.fn(),
    hasCoyoteGrace: vi.fn(() => false),
}));

vi.mock('../src/sceneFlow.js', () => ({
    showMenu: vi.fn(),
    beginRound: vi.fn(),
    startGame: vi.fn(),
    returnToMenu: vi.fn(),
    togglePause: vi.fn(),
    handlePrimaryAction: vi.fn(),
    changeDifficulty: vi.fn(),
    toggleTraining: vi.fn(),
    toggleHardcore: vi.fn(),
    launchDailyChallenge: vi.fn(),
}));

import { GameScene } from '../src/GameScene.js';
import { preloadTextures } from '../src/textures/index.js';
import { setupSceneWorld } from '../src/sceneSetup.js';
import { triggerDeath } from '../src/sceneDeath.js';
import { processJumpBuffer, tickJumpBuffer } from '../src/sceneJumpBuffer.js';
import { checkCollisions } from '../src/sceneBootstrap.js';
import { checkScorePipes } from '../src/sceneRound.js';
import { updateClouds, updateGround } from '../src/sceneBackground.js';
import { hasCoyoteGrace } from '../src/sceneCoyote.js';

describe('GameScene', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('démarre en état MENU avec difficulté normal', () => {
        const scene = new GameScene();
        expect(scene.state).toBe(GAME_STATE.MENU);
        expect(scene.difficulty).toBe(DIFFICULTY.NORMAL);
        expect(scene.round.score).toBe(0);
    });

    it('create charge les textures puis initialise le monde', () => {
        const scene = new GameScene();
        scene.create();
        expect(preloadTextures).toHaveBeenCalledWith(scene);
        expect(setupSceneWorld).toHaveBeenCalledWith(scene);
    });

    it('délègue handlePrimaryAction au module sceneFlow', async () => {
        const { handlePrimaryAction } = await import('../src/sceneFlow.js');
        const scene = new GameScene();
        scene.handlePrimaryAction();
        expect(handlePrimaryAction).toHaveBeenCalledWith(scene);
    });

    it('délègue togglePause au module sceneFlow', async () => {
        const { togglePause } = await import('../src/sceneFlow.js');
        const scene = new GameScene();
        scene.togglePause();
        expect(togglePause).toHaveBeenCalledWith(scene);
    });

    it('délègue returnToMenu au module sceneFlow', async () => {
        const { returnToMenu } = await import('../src/sceneFlow.js');
        const scene = new GameScene();
        scene.returnToMenu();
        expect(returnToMenu).toHaveBeenCalledWith(scene);
    });

    it('délègue triggerDeath au module sceneDeath', () => {
        const scene = new GameScene();
        scene.triggerDeath();
        expect(triggerDeath).toHaveBeenCalledWith(scene, 'pipe');
    });

    it('triggerDeath transmet la cause sol ou plafond', () => {
        const scene = new GameScene();
        scene.triggerDeath('ground');
        expect(triggerDeath).toHaveBeenCalledWith(scene, 'ground');
    });

    it('update délègue la boucle gameplay en état PLAYING', () => {
        const scene = new GameScene();
        scene.state = GAME_STATE.PLAYING;
        scene.game = { loop: { delta: 16.67, actualFps: 60 } };
        scene.bird = {
            update: vi.fn(),
            x: 50,
            y: 256,
            isOutOfBounds: vi.fn(() => false),
            isHittingGround: vi.fn(() => false),
        };
        scene.pipes = { update: vi.fn(), pipeSpeed: 2.7, isBirdInGap: vi.fn(() => false) };
        scene.ghost = { update: vi.fn() };
        scene.round = createRoundState();
        scene._clouds = [];

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

    it('le sol n’écourte pas pendant l’invincibilité spawn', () => {
        const scene = new GameScene();
        scene.state = GAME_STATE.PLAYING;
        scene.game = { loop: { delta: 16.67, actualFps: 60 } };
        scene.round = createRoundState();
        scene.round.spawnInvincible = true;
        scene.bird = {
            update: vi.fn(),
            isOutOfBounds: vi.fn(() => false),
            isHittingGround: vi.fn(() => true),
        };
        scene.pipes = { update: vi.fn(), pipeSpeed: 2.7, isBirdInGap: vi.fn(() => false) };
        scene.ghost = { update: vi.fn() };
        scene._clouds = [];

        scene.update();

        expect(triggerDeath).not.toHaveBeenCalled();
        expect(checkCollisions).toHaveBeenCalledWith(scene);
    });

    it('le coyote time protège aussi plafond et sol', () => {
        const scene = new GameScene();
        scene.state = GAME_STATE.PLAYING;
        scene.game = { loop: { delta: 16.67, actualFps: 60 } };
        scene.round = createRoundState();
        scene.bird = {
            update: vi.fn(),
            isOutOfBounds: vi.fn(() => true),
            isHittingGround: vi.fn(() => false),
        };
        scene.pipes = { update: vi.fn(), pipeSpeed: 2.7 };
        scene.ghost = { update: vi.fn() };
        scene._clouds = [];
        vi.mocked(hasCoyoteGrace).mockReturnValue(true);

        scene.update();

        expect(triggerDeath).not.toHaveBeenCalled();
    });

    it('le sol déclenche une mort différenciée', () => {
        vi.mocked(hasCoyoteGrace).mockReturnValue(false);
        const scene = new GameScene();
        scene.state = GAME_STATE.PLAYING;
        scene.game = { loop: { delta: 16.67, actualFps: 60 } };
        scene.round = createRoundState();
        scene.bird = {
            update: vi.fn(),
            isOutOfBounds: vi.fn(() => false),
            isHittingGround: vi.fn(() => true),
        };
        scene.pipes = { update: vi.fn(), pipeSpeed: 2.7, isBirdInGap: vi.fn(() => false) };
        scene.ghost = { update: vi.fn() };
        scene._clouds = [];

        scene.update();

        expect(triggerDeath).toHaveBeenCalledWith(scene, 'ground');
    });
});
