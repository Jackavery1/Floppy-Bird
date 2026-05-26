import Phaser from 'phaser';
import { GAME_CONFIG } from './config.js';
import { GAME_STATE } from './gameState.js';
import {
    canChangeDifficulty,
    canHandlePrimaryAction,
    canReturnToMenu,
    canTogglePause,
    canTriggerDeath,
    shouldStartGameOnPrimary,
    shouldUpdateDying,
    shouldUpdateGameplay,
    shouldScrollGround,
} from './gameStateRules.js';
import { Utils } from './utils.js';
import { preloadTextures, GROUND_BLADE_H, GROUND_TILE_H } from './proceduralTextures.js';
import { resumeAudio, playSound } from './audio.js';
import { SOUND, DIFFICULTY } from './gameConstants.js';
import { Bird } from './bird.js';
import { Pipes } from './pipes.js';
import { UI } from './ui.js';
import { ScorePopupPool } from './ScorePopupPool.js';
import { ScoreParticlePool } from './ScoreParticlePool.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.bird = null;
        this.pipes = null;
        this.ui = null;
        this.scorePopups = null;
        this.scoreParticles = null;

        this.state = GAME_STATE.MENU;
        this.score = 0;
        this.difficulty = DIFFICULTY.NORMAL;

        this.menuElements = [];
        this.gameOverElements = [];
        this._pauseElements = [];

        this._clouds = [];
        this._groundSprite = null;
        this._dyingFalling = false;
        this._dyingGrounded = false;
        this._leaderboardData = null;

        this.fps = null;
    }

    preload() {
        preloadTextures(this);
    }

    create() {
        this._warnFileProtocol();
        this._primeAudio();
        this._setupInput();

        const bg = this.add.sprite(GAME_CONFIG.centerX, GAME_CONFIG.centerY, 'background');
        bg.setDisplaySize(GAME_CONFIG.width, GAME_CONFIG.height);
        bg.setDepth(0);

        this._initClouds();
        this._createGround();

        this.anims.create({
            key: 'bird-bat',
            frames: [
                { key: 'bird-sheet', frame: 0 },
                { key: 'bird-sheet', frame: 1 },
                { key: 'bird-sheet', frame: 2 },
                { key: 'bird-sheet', frame: 1 },
            ],
            frameRate: 10,
            repeat: 0,
        });

        this.bird = new Bird(this, GAME_CONFIG.bird.startX, GAME_CONFIG.centerY);
        this.pipes = new Pipes(this);
        this.ui = new UI(this);
        this.scorePopups = new ScorePopupPool(this);
        this.scoreParticles = new ScoreParticlePool(this);

        this.showMenu();

        if (GAME_CONFIG.debug) {
            this.fps = this.add.text(10, 10, '', {
                fontSize: '14px', fill: '#fff', fontFamily: 'monospace',
            });
            this.fps.setDepth(100);
        }

        this.events.once('shutdown', this.shutdown, this);
    }

    _initClouds() {
        this._clouds = [];
        for (let i = 0; i < 5; i++) {
            const x = (i / 5) * GAME_CONFIG.width + Math.random() * 60;
            const y = 60 + Math.random() * 160;
            const cloud = this.add.sprite(x, y, 'cloud');
            cloud.setDepth(1);
            cloud.setAlpha(0.88);
            cloud._speed = 0.3 + Math.random() * 0.2;
            this._clouds.push(cloud);
        }
    }

    _updateClouds() {
        for (const cloud of this._clouds) {
            cloud.x -= cloud._speed;
            if (cloud.x < -80) {
                cloud.x = GAME_CONFIG.width + 80;
                cloud.y = 60 + Math.random() * 160;
            }
        }
    }

    _createGround() {
        const gY = GAME_CONFIG.groundY;
        const centerY = gY - GROUND_BLADE_H + GROUND_TILE_H / 2;
        this._groundSprite = this.add.tileSprite(
            GAME_CONFIG.centerX,
            centerY,
            GAME_CONFIG.width,
            GROUND_TILE_H,
            'ground',
        );
        this._groundSprite.setDepth(8);
    }

    _frameStep() {
        return (this.game.loop.delta / 1000) * 60;
    }

    _updateGround(step = 1) {
        if (shouldScrollGround(this.state) && this._groundSprite) {
            this._groundSprite.tilePositionX += this.pipes.pipeSpeed * step;
        }
    }

    _warnFileProtocol() {
        if (location.protocol !== 'file:') return;
        if (document.getElementById('file-protocol-warn')) return;
        const warn = document.createElement('div');
        warn.id = 'file-protocol-warn';
        warn.textContent = 'Lance le jeu avec npm run dev (serveur requis pour scores et PWA).';
        document.body.prepend(warn);
    }

    _primeAudio() {
        const resume = () => resumeAudio();
        this.input.once('pointerdown', resume);
        this.input.keyboard.once('keydown', resume);
    }

    _setupInput() {
        this.input.keyboard.on('keydown-SPACE', () => this.handlePrimaryAction());

        this.input.on('pointerdown', (pointer) => {
            const hits = this.input.hitTestPointer(pointer);
            if (hits.some(obj => obj.input?.enabled)) return;
            this.handlePrimaryAction();
        });

        this.input.on('pointerdown', () => resumeAudio());

        this.input.keyboard.on('keydown-ESC', () => {
            if (canTogglePause(this.state)) this.togglePause();
        });

        this.input.keyboard.on('keydown-M', () => {
            if (canReturnToMenu(this.state)) this.returnToMenu();
        });

        this.input.keyboard.on('keydown-ONE',   () => this.changeDifficulty(DIFFICULTY.EASY));
        this.input.keyboard.on('keydown-TWO',   () => this.changeDifficulty(DIFFICULTY.NORMAL));
        this.input.keyboard.on('keydown-THREE', () => this.changeDifficulty(DIFFICULTY.HARD));
    }

    update() {
        if (GAME_CONFIG.debug && this.fps) {
            this.fps.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
        }

        const step = this._frameStep();

        this._updateClouds();
        this._updateGround(step);

        if (shouldUpdateGameplay(this.state)) {
            this.bird.update(step);
            this.pipes.update(step);
            this.checkCollisions();
            this.checkScore();

            if (this.bird.isOutOfBounds() || this.bird.isHittingGround()) {
                this.triggerDeath();
            }
        } else if (shouldUpdateDying(this.state)) {
            this._updateDying();
        }
    }

    triggerDeath() {
        if (!canTriggerDeath(this.state)) return;
        this.state = GAME_STATE.DYING;
        this._dyingFalling = false;
        this._dyingGrounded = false;

        playSound(SOUND.GAME_OVER);
        this.ui.hideInGameScore();
        this.cameras.main.shake(200, 0.015);
        this.ui.showFlash();
        this.ui.saveHighScore(this.score);
        this._leaderboardData = this.ui.saveToLeaderboard(this.score);

        this.time.delayedCall(166, () => {
            if (this.state === GAME_STATE.DYING) {
                this._dyingFalling = true;
            }
        });
    }

    _updateDying() {
        if (!this._dyingFalling || this._dyingGrounded) return;

        const step = this._frameStep();
        this.bird.velocityY = Math.min(
            this.bird.velocityY + this.bird.gravity * step,
            this.bird.maxFallSpeed,
        );
        this.bird.y += this.bird.velocityY * step;
        this.bird.sprite.setPosition(this.bird.x, this.bird.y);
        this.bird.sprite.setRotation(Math.PI / 2.2);

        if (this.bird.y + GAME_CONFIG.bird.height / 2 >= GAME_CONFIG.groundY) {
            this.bird.y = GAME_CONFIG.groundY - GAME_CONFIG.bird.height / 2;
            this.bird.sprite.setPosition(this.bird.x, this.bird.y);
            this._dyingGrounded = true;
            this._finishDying();
        }
    }

    _finishDying() {
        playSound(SOUND.GROUND);
        this.state = GAME_STATE.GAME_OVER;
        const { elements } = this.ui.showGameOver(this.score, this._leaderboardData, true);
        this.gameOverElements.push(...elements);
    }

    handlePrimaryAction() {
        if (!canHandlePrimaryAction(this.state)) return;

        if (shouldStartGameOnPrimary(this.state)) {
            this.startGame();
        } else if (this.state === GAME_STATE.PLAYING) {
            this.bird.jump();
        }
    }

    changeDifficulty(difficulty) {
        if (!canChangeDifficulty(this.state)) return;
        this.difficulty = difficulty;
        this.ui.updateDifficultyButtons(difficulty);
    }

    showMenu() {
        this._clearPauseElements();
        this.state = GAME_STATE.MENU;
        this.score = 0;
        Utils.clearElements(this.menuElements);

        const elements = this.ui.showMenu(this.difficulty);
        this.menuElements.push(...elements);
    }

    beginRound({ resetBird = false } = {}) {
        this._clearPauseElements();
        this.state = GAME_STATE.PLAYING;
        this.score = 0;

        if (resetBird) {
            this.bird.reset(GAME_CONFIG.bird.startX, GAME_CONFIG.centerY);
        }

        this.pipes.reset();
        this.pipes.setDifficulty(this.difficulty);
        this.ui.createScoreDisplay();
        this.pipes.spawn();
    }

    startGame() {
        if (this.state === GAME_STATE.MENU) {
            Utils.clearElements(this.menuElements);
            this.beginRound({ resetBird: true });
        } else if (this.state === GAME_STATE.GAME_OVER) {
            Utils.clearElements(this.gameOverElements);
            this.beginRound({ resetBird: true });
        }
    }

    returnToMenu() {
        if (!canReturnToMenu(this.state)) return;
        this._clearPauseElements();
        if (this.state === GAME_STATE.GAME_OVER) {
            Utils.clearElements(this.gameOverElements);
        }
        this.bird.reset(GAME_CONFIG.bird.startX, GAME_CONFIG.centerY);
        this.pipes.reset();
        this.showMenu();
    }

    checkCollisions() {
        if (this.pipes.checkCollisionWithBird(this.bird.getBounds())) {
            this.triggerDeath();
        }
    }

    checkScore() {
        const birdX = this.bird.x;
        this.pipes.topPipes.forEach(pipe => {
            if (!pipe.scored && birdX > pipe.x + this.pipes.pipeWidth / 2) {
                pipe.scored = true;
                this.score++;
                this.ui.updateScore(this.score);
                playSound(SOUND.SCORE);
                this.scorePopups.show(this.bird.x + 25, this.bird.y - 10);
                this.scoreParticles.show(this.bird.x, this.bird.y);
            }
        });
    }

    togglePause() {
        if (this.state === GAME_STATE.PLAYING) {
            this.state = GAME_STATE.PAUSED;
            const pauseUI = this.ui.showPause();
            this._pauseElements = pauseUI.elements;
        } else if (this.state === GAME_STATE.PAUSED) {
            this.state = GAME_STATE.PLAYING;
            this._clearPauseElements();
        }
    }

    _clearPauseElements() {
        if (this._pauseElements?.length) {
            this._pauseElements.forEach(e => e?.destroy());
            this._pauseElements = [];
        }
    }

    shutdown() {
        if (this.bird) this.bird.destroy();
        if (this.pipes) this.pipes.destroy();
        if (this.scorePopups) this.scorePopups.destroy();
        if (this.scoreParticles) this.scoreParticles.destroy();
        if (this.ui) this.ui.destroy();
    }
}
