import Phaser from 'phaser';
import { GAME_CONFIG } from './config.js';
import {
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
    tickPipeSpawnFallback,
} from './sceneRound.js';
import { frameStep, checkCollisions } from './sceneBootstrap.js';
import { processJumpBuffer, tickJumpBuffer } from './sceneJumpBuffer.js';
import { updateCoyoteTime } from './sceneCoyote.js';
import { triggerDeath, updateDying } from './sceneDeath.js';
import { updateSpawnInvincibilityVisual } from './sceneSpawnFeedback.js';
import {
    showMenu,
    startGame,
    returnToMenu,
    togglePause,
    handlePrimaryAction,
    changeDifficulty,
    toggleTraining,
    toggleHardcore,
    launchDailyChallenge,
} from './sceneFlow.js';
import { beginRound } from './sceneBeginRound.js';
import { initSceneCore } from './sceneContext.js';
import { setupSceneWorld } from './sceneSetup.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        initSceneCore(this);
    }

    create() {
        preloadTextures(this);
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
            tickPipeSpawnFallback(this, this.game.loop.delta);
            this.pipes.update(step);
            this.ghost.update(step);
            updateCoyoteTime(this, step);
            checkCollisions(this);
            checkScorePipes(this);
            updateSpawnInvincibilityVisual(this);

            if (this.bird.isOutOfBounds() || this.bird.isHittingGround()) {
                this.triggerDeath();
            }

            tickJumpBuffer(this);
        } else if (shouldUpdateDying(this.state)) {
            updateDying(this);
        }
    }

    triggerDeath() { triggerDeath(this); }
    handlePrimaryAction() { handlePrimaryAction(this); }
    changeDifficulty(d) { changeDifficulty(this, d); }
    toggleTraining() { toggleTraining(this); }
    toggleHardcore() { toggleHardcore(this); }
    launchDailyChallenge() { launchDailyChallenge(this); }
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
