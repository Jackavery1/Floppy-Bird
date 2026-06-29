import Phaser from 'phaser';
import { GAME_CONFIG, DIFFICULTY } from './config.js';
import {
    GAME_STATE,
    shouldUpdateDying,
    shouldUpdateGameplay,
    shouldAnimateBackground,
} from './gameState.js';
import { preloadTextures } from './textures/index.js';
import { updateClouds, updateGround } from './sceneBackground.js';
import {
    checkScorePipes,
    cancelPipeSpawnTimer,
    clearSpawnInvincibility,
} from './sceneRound.js';
import { loadTrainingEnabled } from './trainingStorage.js';
import { loadHardcoreEnabled, saveHardcoreEnabled } from './hardcoreStorage.js';
import { frameStep, checkCollisions } from './sceneBootstrap.js';
import { processJumpBuffer, tickJumpBuffer } from './sceneJumpBuffer.js';
import { triggerDeath, updateDying } from './sceneDeath.js';
import {
    showMenu,
    beginRound,
    startGame,
    returnToMenu,
    togglePause,
    handlePrimaryAction,
    changeDifficulty,
    toggleTraining,
    toggleHardcore,
} from './sceneFlow.js';
import { setupSceneWorld } from './sceneSetup.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.bird = null;
        this.pipes = null;
        this.ui = null;
        this.scoreEffects = null;
        this.ghost = null;

        this.state = GAME_STATE.MENU;
        this.score = 0;
        this.difficulty = DIFFICULTY.NORMAL;
        this.trainingMode = loadTrainingEnabled();
        this.hardcoreMode = loadHardcoreEnabled();
        if (this.trainingMode && this.hardcoreMode) {
            this.hardcoreMode = false;
            saveHardcoreEnabled(false);
        }

        this.menuElements = [];
        this.gameOverElements = [];
        this._pauseElements = [];

        this._clouds = [];
        this._groundSprite = null;
        this._dyingFalling = false;
        this._dyingGrounded = false;
        this._leaderboardData = null;
        this._pipeSpawnTimer = null;
        this._jumpBufferFrames = 0;
        this._spawnInvincible = false;
        this._spawnInvincibleTimer = null;
        this._roundHighScore = 0;
        this._recordNotified = false;
        this._isNewRecord = false;

        this.fps = null;
    }

    preload() {
        preloadTextures(this);
    }

    create() {
        setupSceneWorld(this);
    }

    update() {
        if (GAME_CONFIG.debug && this.fps) {
            this.fps.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
        }

        const step = frameStep(this);

        if (shouldAnimateBackground(this.state)) {
            updateClouds(this._clouds);
        }
        updateGround(this.state, this._groundSprite, this.pipes?.pipeSpeed ?? 0, step);

        if (shouldUpdateGameplay(this.state)) {
            processJumpBuffer(this);
            this.bird.update(step);
            this.pipes.update(step);
            this.ghost.update(step);
            checkCollisions(this);
            checkScorePipes(this);

            if ((!this._spawnInvincible && this.bird.isOutOfBounds())
                || (!this._spawnInvincible && this.bird.isHittingGround())) {
                this.triggerDeath();
            }
        } else if (shouldUpdateDying(this.state)) {
            updateDying(this);
        }

        tickJumpBuffer(this);
    }

    triggerDeath() { triggerDeath(this); }
    handlePrimaryAction() { handlePrimaryAction(this); }
    changeDifficulty(d) { changeDifficulty(this, d); }
    toggleTraining() { toggleTraining(this); }
    toggleHardcore() { toggleHardcore(this); }
    showMenu() { showMenu(this); }
    beginRound(opts) { beginRound(this, opts); }
    startGame() { startGame(this); }
    returnToMenu() { returnToMenu(this); }
    togglePause() { togglePause(this); }

    shutdown() {
        cancelPipeSpawnTimer(this);
        clearSpawnInvincibility(this);
        if (this.ghost) this.ghost.destroy();
        if (this.bird) this.bird.destroy();
        if (this.pipes) this.pipes.destroy();
        if (this.scoreEffects) this.scoreEffects.destroy();
        if (this.ui) this.ui.destroy();
    }
}
