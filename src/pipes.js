import { GAME_CONFIG } from './config.js';
import { maxGapDeltaForScore, effectivePipeGapForScore, speedBoostMultiplierForScore } from './gapDifficulty.js';
import { resolveNextGapY } from './pipeGaps.js';
import { collidesWithPipeGroup, isBirdInPipeGap } from './pipeCollision.js';
import { spawnPipePairAtGap } from './pipeSpawn.js';
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
        this._spawnCounter = 0;
        this._gapIndex = 0;
        this._lastGapY = null;
        this._prevGapDelta = 0;
        this._autoSpawnEnabled = false;
        this._baseSpeed = normal.speed;
        this._baseGap = normal.gap;
        this._dailyRng = null;
        this._gapJitterSeed = 0;
        this._runScore = 0;
        this._onSpawn = null;
    }

    _maxGapDelta() {
        return maxGapDeltaForScore(this._runScore);
    }

    _resolveGapY() {
        const next = resolveNextGapY({
            gapIndex: this._gapIndex,
            lastGapY: this._lastGapY,
            dailyRng: this._dailyRng,
            pipeGap: this.pipeGap,
            runScore: this._runScore,
            prevGapDelta: this._prevGapDelta,
            gapJitterSeed: this._gapJitterSeed,
        });
        this._gapIndex = next.gapIndex;
        this._lastGapY = next.lastGapY;
        this._prevGapDelta = next.gapDelta ?? 0;
        return next.gapY;
    }

    spawnPipePair(gapY) {
        spawnPipePairAtGap(this.scene, this, gapY);
    }

    spawn() {
        this.spawnPipePair(this._resolveGapY());
        this._autoSpawnEnabled = true;
        this._spawnCounter = 0;
        if (this._onSpawn) this._onSpawn(this.topPipes.length);
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

    checkCollisionWithBird(birdBounds) {
        return (
            collidesWithPipeGroup(this.topPipes, 'top', birdBounds, this.pipeBodyWidth) ||
            collidesWithPipeGroup(this.bottomPipes, 'bottom', birdBounds, this.pipeBodyWidth)
        );
    }

    isBirdInGap(birdBounds) {
        return isBirdInPipeGap(birdBounds, this.topPipes, this.bottomPipes, this.pipeBodyWidth);
    }

    setDifficulty(difficulty = 'normal') {
        this.applyRoundDifficulty(GAME_CONFIG.getDifficulty(difficulty));
    }

    applyRoundDifficulty({ speed, gap, pipeInterval }) {
        this._baseSpeed = speed;
        this._baseGap = gap;
        this.pipeSpeed = speed;
        this.pipeGap = gap;
        this.pipeInterval = pipeInterval;
    }

    setDailySeed(seed) {
        this._dailyRng = seed != null ? Utils.createSeededRandom(seed) : null;
        this._gapIndex = 0;
        this._lastGapY = null;
        this._prevGapDelta = 0;
    }

    setGapJitterSeed(seed) {
        this._gapJitterSeed = seed ?? 0;
    }

    setSpawnHandler(handler) {
        this._onSpawn = typeof handler === 'function' ? handler : null;
    }

    applySpeedForScore(score) {
        this._runScore = score;
        this.pipeSpeed = this._baseSpeed * speedBoostMultiplierForScore(score);
        this.pipeGap = effectivePipeGapForScore(this._baseGap, score);
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
        this._prevGapDelta = 0;
        this._autoSpawnEnabled = false;
        this._dailyRng = null;
        this._gapJitterSeed = 0;
        this._runScore = 0;
    }

    destroy() {
        this.reset();
    }
}
