import Phaser from 'phaser';
import { GAME_CONFIG } from './config.js';
import { shouldUpdateDying, shouldUpdateGameplay, shouldAnimateBackground } from './gameState.js';
import { preloadTexturesEssential } from './textures/index.js';
import { updateClouds, updateGround, updateHills } from './sceneBackground.js';
import {
    checkScorePipes,
    cancelPipeSpawnTimer,
    clearSpawnInvincibility,
    tickPipeSpawnFallback,
} from './sceneRound.js';
import { frameStep, splitPhysicsSteps, checkCollisions } from './sceneBootstrap.js';
import { processJumpBuffer, tickJumpBuffer } from './sceneJumpBuffer.js';
import { updateCoyoteTime, updateCoyoteVisual } from './sceneCoyote.js';
import { triggerDeath as runDeath, updateDying } from './sceneDeath.js';
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
    cycleTrainingSpeed,
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
        preloadTexturesEssential(this);
        import('./textures/decorPreload.js').then(({ preloadDecorTextures }) => {
            preloadDecorTextures(this);
            setupSceneWorld(this);
        });
    }

    update() {
        if (GAME_CONFIG.debug && this.fps) {
            this.fps.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
        }

        const step = frameStep(this);

        if (shouldAnimateBackground(this.state)) {
            updateClouds(this._clouds);
            updateHills(this.state, this._hills, this.pipes?.pipeSpeed ?? 0, step);
        }
        updateGround(this.state, this._groundSprite, this.pipes?.pipeSpeed ?? 0, step);

        if (shouldUpdateGameplay(this.state)) {
            processJumpBuffer(this);
            tickPipeSpawnFallback(this, this.game.loop.delta);
            const physicsSteps = splitPhysicsSteps(step);
            for (const subStep of physicsSteps) {
                this.bird.update(subStep);
                this.pipes.update(subStep);
                this.ghost.update(subStep);
                updateCoyoteTime(this, subStep);
                updateCoyoteVisual(this);
                checkCollisions(this);
                checkScorePipes(this);

                const spawnProtectsBounds = this.round.spawnInvincible;
                if (!spawnProtectsBounds) {
                    if (this.bird.isHittingGround()) {
                        this.triggerDeath('ground');
                    } else if (this.bird.isOutOfBounds()) {
                        this.triggerDeath('ceiling');
                    }
                    break;
                }
            }
            updateSpawnInvincibilityVisual(this);
            tickJumpBuffer(this);
        } else if (shouldUpdateDying(this.state)) {
            updateDying(this);
        }
    }

    triggerDeath(cause = 'pipe') {
        runDeath(this, cause);
    }
    handlePrimaryAction() {
        handlePrimaryAction(this);
    }
    changeDifficulty(d) {
        changeDifficulty(this, d);
    }
    toggleTraining() {
        toggleTraining(this);
    }
    toggleHardcore() {
        toggleHardcore(this);
    }
    cycleTrainingSpeed() {
        cycleTrainingSpeed(this);
    }
    launchDailyChallenge() {
        launchDailyChallenge(this);
    }
    showMenu() {
        showMenu(this);
    }
    beginRound(opts) {
        beginRound(this, opts);
    }
    startGame() {
        startGame(this);
    }
    returnToMenu() {
        returnToMenu(this);
    }
    togglePause() {
        togglePause(this);
    }

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
