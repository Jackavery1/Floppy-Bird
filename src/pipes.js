import { GAME_CONFIG, getScriptedPipeGapY } from './config.js';
import { maxGapDeltaForScore } from './gapDifficulty.js';
import { Utils } from './utils.js';

export function smoothGapY(rawY, lastGapY, maxDelta, minY, maxY) {
    const clamped = Utils.clamp(rawY, minY, maxY);
    if (lastGapY == null) return clamped;
    return Utils.clamp(clamped, lastGapY - maxDelta, lastGapY + maxDelta);
}

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
        this._spawnCounter = 0;
        this._gapIndex = 0;
        this._lastGapY = null;
        this._autoSpawnEnabled = false;
        this._baseSpeed = normal.speed;
        this._dailyRng = null;
        this._runScore = 0;
    }

    _maxGapDelta() {
        return maxGapDeltaForScore(this._runScore);
    }

    _gapBounds() {
        const margin = GAME_CONFIG.pipes.spawnMarginY;
        return {
            min: margin,
            max: GAME_CONFIG.groundY - this.pipeGap - margin,
        };
    }

    _randomGapY() {
        const { min, max } = this._gapBounds();
        if (this._dailyRng) {
            return Utils.seededRandomInt(this._dailyRng, min, max);
        }
        return Utils.randomInt(min, max);
    }

    _resolveGapY() {
        const scriptedY = getScriptedPipeGapY(this._gapIndex, this.pipeGap);
        if (scriptedY !== null) {
            this._gapIndex++;
            this._lastGapY = scriptedY;
            return scriptedY;
        }

        const { min, max } = this._gapBounds();
        const raw = this._randomGapY();
        const smoothed = smoothGapY(
            raw,
            this._lastGapY,
            this._maxGapDelta(),
            min,
            max,
        );
        this._lastGapY = smoothed;
        return smoothed;
    }

    _createPipe(texture, originY, y) {
        const pipe = this.scene.add.sprite(GAME_CONFIG.width + this.pipeWidth, y, texture);
        pipe.setDisplaySize(this.pipeWidth, this.pipeHeight);
        pipe.setOrigin(0.5, originY);
        pipe.setDepth(5);
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
        this._autoSpawnEnabled = true;
        this._spawnCounter = 0;
    }

    _scrollPipes(array, step) {
        for (let i = array.length - 1; i >= 0; i--) {
            const pipe = array[i];
            pipe.x -= this.pipeSpeed * step;
            if (pipe.x < -this.pipeWidth) {
                pipe.destroy();
                array.splice(i, 1);
            }
        }
    }

    update(step = 1) {
        this._scrollPipes(this.topPipes, step);
        this._scrollPipes(this.bottomPipes, step);

        if (!this._autoSpawnEnabled) return;

        this._spawnCounter += step;
        if (this._spawnCounter >= this.pipeInterval) {
            this.spawn();
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

    isBirdInGap(birdX, birdY) {
        for (let i = 0; i < this.topPipes.length; i++) {
            const top = this.topPipes[i];
            const bottom = this.bottomPipes[i];
            if (!bottom) continue;
            const halfW = this.pipeWidth / 2 + 4;
            if (birdX < top.x - halfW || birdX > top.x + halfW) continue;
            const gapTop = top.y;
            const gapBottom = bottom.y;
            if (birdY >= gapTop && birdY <= gapBottom) return true;
        }
        return false;
    }

    setDifficulty(difficulty = 'normal') {
        this.applyRoundDifficulty(GAME_CONFIG.getDifficulty(difficulty));
    }

    applyRoundDifficulty({ speed, gap, pipeInterval }) {
        this._baseSpeed = speed;
        this.pipeSpeed = speed;
        this.pipeGap = gap;
        this.pipeInterval = pipeInterval;
    }

    setDailySeed(seed) {
        this._dailyRng = seed != null ? Utils.createSeededRandom(seed) : null;
        this._gapIndex = 0;
        this._lastGapY = null;
    }

    applySpeedForScore(score) {
        this._runScore = score;
        const { speedBoostEvery, speedBoostPercent } = GAME_CONFIG.round;
        const boosts = Math.floor(score / speedBoostEvery);
        this.pipeSpeed = this._baseSpeed * (1 + boosts * speedBoostPercent);
    }

    reset() {
        for (const pipe of [...this.topPipes, ...this.bottomPipes]) {
            pipe.destroy();
        }
        this.topPipes.length = 0;
        this.bottomPipes.length = 0;
        this._spawnCounter = 0;
        this._gapIndex = 0;
        this._lastGapY = null;
        this._autoSpawnEnabled = false;
        this._dailyRng = null;
        this._runScore = 0;
    }

    destroy() {
        this.reset();
    }
}
