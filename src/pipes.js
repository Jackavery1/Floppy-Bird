import { GAME_CONFIG, getScriptedPipeGapY } from './config.js';
import { Utils } from './utils.js';

export class Pipes {
    constructor(scene) {
        this.scene = scene;
        const pipeCfg = GAME_CONFIG.pipes;
        const normal = GAME_CONFIG.getDifficulty('normal');

        this.pipeSpeed = normal.speed;
        this.pipeGap = normal.gap;
        this.pipeInterval = normal.pipeInterval;
        this.pipeWidth = pipeCfg.width;
        this.pipeBodyWidth = pipeCfg.bodyWidth;
        this.pipeHeight = GAME_CONFIG.height + pipeCfg.capMargin;

        this.topPipes = [];
        this.bottomPipes = [];
        this._topPool = [];
        this._bottomPool = [];
        this._spawnCounter = 0;
        this._gapIndex = 0;
    }

    _randomGapY() {
        const margin = GAME_CONFIG.pipes.spawnMarginY;
        return Utils.randomInt(margin, GAME_CONFIG.groundY - this.pipeGap - margin);
    }

    _resolveGapY() {
        const y = getScriptedPipeGapY(this._gapIndex, this.pipeGap);
        if (y !== null) {
            this._gapIndex++;
            return y;
        }
        return this._randomGapY();
    }

    _acquireFromPool(pool, texture, originY) {
        let pipe = pool.pop();
        if (!pipe) {
            pipe = this.scene.add.sprite(0, 0, texture);
            pipe.setDisplaySize(this.pipeWidth, this.pipeHeight);
            pipe.setOrigin(0.5, originY);
        }
        pipe.setActive(true).setVisible(true);
        return pipe;
    }

    _releaseToPool(pool, pipe) {
        pipe.setActive(false).setVisible(false);
        if (pool.length < GAME_CONFIG.pipes.poolSize) {
            pool.push(pipe);
        } else {
            pipe.destroy();
        }
    }

    _createPipe(texture, originY, y) {
        const pool = texture === 'pipe-top' ? this._topPool : this._bottomPool;
        const pipe = this._acquireFromPool(pool, texture, originY);
        pipe.setTexture(texture);
        pipe.setDisplaySize(this.pipeWidth, this.pipeHeight);
        pipe.setOrigin(0.5, originY);
        pipe.x = GAME_CONFIG.width + this.pipeWidth;
        pipe.y = y;
        return pipe;
    }

    spawnPipePair(gapY) {
        const topPipe = this._createPipe('pipe-top', 1, gapY - this.pipeGap / 2);
        topPipe.scored = false;
        this.topPipes.push(topPipe);

        const bottomPipe = this._createPipe('pipe-bottom', 0, gapY + this.pipeGap / 2);
        this.bottomPipes.push(bottomPipe);
    }

    spawn() {
        this.spawnPipePair(this._resolveGapY());
    }

    _scrollPipes(array, pool, step) {
        for (let i = array.length - 1; i >= 0; i--) {
            const pipe = array[i];
            pipe.x -= this.pipeSpeed * step;
            if (pipe.x < -this.pipeWidth) {
                this._releaseToPool(pool, pipe);
                array.splice(i, 1);
            }
        }
    }

    update(step = 1) {
        this._scrollPipes(this.topPipes, this._topPool, step);
        this._scrollPipes(this.bottomPipes, this._bottomPool, step);

        this._spawnCounter += step;
        if (this._spawnCounter >= this.pipeInterval) {
            this.spawn();
            this._spawnCounter = 0;
        }
    }

    _colliderFor(pipe, type) {
        const colW = this.pipeBodyWidth;
        if (type === 'top') {
            return { x: pipe.x - colW / 2, y: 0, width: colW, height: pipe.y };
        }
        return {
            x: pipe.x - colW / 2,
            y: pipe.y,
            width: colW,
            height: GAME_CONFIG.height - pipe.y,
        };
    }

    _checkPipeGroup(pipes, type, birdBounds) {
        for (const pipe of pipes) {
            if (Utils.checkCollision(birdBounds, this._colliderFor(pipe, type))) {
                return true;
            }
        }
        return false;
    }

    checkCollisionWithBird(birdBounds) {
        return (
            this._checkPipeGroup(this.topPipes, 'top', birdBounds) ||
            this._checkPipeGroup(this.bottomPipes, 'bottom', birdBounds)
        );
    }

    setDifficulty(difficulty = 'normal') {
        const config = GAME_CONFIG.getDifficulty(difficulty);
        this.pipeSpeed = config.speed;
        this.pipeGap = config.gap;
        this.pipeInterval = config.pipeInterval;
        if (this.scene.bird) {
            this.scene.bird.applyDifficulty(config);
        }
    }

    _drainActive(array, pool) {
        for (let i = array.length - 1; i >= 0; i--) {
            this._releaseToPool(pool, array[i]);
            array.splice(i, 1);
        }
    }

    reset() {
        this._drainActive(this.topPipes, this._topPool);
        this._drainActive(this.bottomPipes, this._bottomPool);
        this._spawnCounter = 0;
        this._gapIndex = 0;
    }

    destroy() {
        this.reset();
        this._topPool.forEach(p => p.destroy());
        this._bottomPool.forEach(p => p.destroy());
        this._topPool.length = 0;
        this._bottomPool.length = 0;
    }
}
