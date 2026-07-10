import './helpers/gameSceneMocks.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { DIFFICULTY } from '../src/config.js';
import { GameScene } from '../src/GameScene.js';
import { preloadTexturesEssential } from '../src/textures/index.js';
import { preloadDecorTextures } from '../src/textures/decorPreload.js';
import { setupSceneWorld } from '../src/sceneSetup.js';
import { triggerDeath } from '../src/sceneDeath.js';
import { processJumpBuffer, tickJumpBuffer } from '../src/sceneJumpBuffer.js';
import { checkCollisions } from '../src/sceneBootstrap.js';
import { checkScorePipes } from '../src/sceneRound.js';
import { updateClouds, updateGround } from '../src/sceneBackground.js';
import { createPlayingGameScene } from './helpers/gameSceneHarness.js';

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

    it('create charge les textures puis initialise le monde', async () => {
        const scene = new GameScene();
        scene.create();
        expect(preloadTexturesEssential).toHaveBeenCalledWith(scene);
        await vi.waitFor(() => {
            expect(setupSceneWorld).toHaveBeenCalledWith(scene);
        });
        expect(preloadDecorTextures).toHaveBeenCalledWith(scene);
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

    it('délègue showMenu au module sceneFlow', async () => {
        const { showMenu } = await import('../src/sceneFlow.js');
        const scene = new GameScene();
        scene.showMenu();
        expect(showMenu).toHaveBeenCalledWith(scene);
    });

    it('délègue startGame au module sceneFlow', async () => {
        const { startGame } = await import('../src/sceneFlow.js');
        const scene = new GameScene();
        scene.startGame();
        expect(startGame).toHaveBeenCalledWith(scene);
    });

    it('délègue beginRound au module sceneBeginRound', async () => {
        const { beginRound } = await import('../src/sceneBeginRound.js');
        const scene = new GameScene();
        scene.beginRound({ daily: true });
        expect(beginRound).toHaveBeenCalledWith(scene, { daily: true });
    });

    it('délègue changeDifficulty au module sceneFlow', async () => {
        const { changeDifficulty } = await import('../src/sceneFlow.js');
        const scene = new GameScene();
        scene.changeDifficulty(DIFFICULTY.HARD);
        expect(changeDifficulty).toHaveBeenCalledWith(scene, DIFFICULTY.HARD);
    });

    it('délègue toggleTraining au module sceneFlow', async () => {
        const { toggleTraining } = await import('../src/sceneFlow.js');
        const scene = new GameScene();
        scene.toggleTraining();
        expect(toggleTraining).toHaveBeenCalledWith(scene);
    });

    it('délègue toggleHardcore au module sceneFlow', async () => {
        const { toggleHardcore } = await import('../src/sceneFlow.js');
        const scene = new GameScene();
        scene.toggleHardcore();
        expect(toggleHardcore).toHaveBeenCalledWith(scene);
    });

    it('délègue cycleTrainingSpeed au module sceneFlow', async () => {
        const { cycleTrainingSpeed } = await import('../src/sceneFlow.js');
        const scene = new GameScene();
        scene.cycleTrainingSpeed();
        expect(cycleTrainingSpeed).toHaveBeenCalledWith(scene);
    });

    it('délègue launchDailyChallenge au module sceneFlow', async () => {
        const { launchDailyChallenge } = await import('../src/sceneFlow.js');
        const scene = new GameScene();
        scene.launchDailyChallenge();
        expect(launchDailyChallenge).toHaveBeenCalledWith(scene);
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
        const scene = createPlayingGameScene(GameScene);

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

    it('le sol n’écourte pas pendant l’invincibilité spawn classique', () => {
        const scene = createPlayingGameScene(GameScene, { hardcoreMode: false });
        scene.round.spawnInvincible = true;
        scene.bird.isHittingGround = vi.fn(() => true);

        scene.update();

        expect(triggerDeath).not.toHaveBeenCalled();
        expect(checkCollisions).toHaveBeenCalledWith(scene);
    });

    it('le sol n’écourte pas pendant l’invincibilité spawn en hardcore', () => {
        const scene = createPlayingGameScene(GameScene, { hardcoreMode: true });
        scene.round.spawnInvincible = true;
        scene.bird.isHittingGround = vi.fn(() => true);

        scene.update();

        expect(triggerDeath).not.toHaveBeenCalled();
        expect(checkCollisions).toHaveBeenCalledWith(scene);
    });
});
