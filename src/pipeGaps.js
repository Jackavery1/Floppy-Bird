import { GAME_CONFIG, getScriptedPipeGapY } from './config.js';
import { maxGapDeltaForScore } from './gapDifficulty.js';
import { Utils } from './utils.js';

export function smoothGapY(rawY, lastGapY, maxDelta, minY, maxY) {
    const clamped = Utils.clamp(rawY, minY, maxY);
    if (lastGapY == null) return clamped;
    return Utils.clamp(clamped, lastGapY - maxDelta, lastGapY + maxDelta);
}

export function gapBounds(pipeGap) {
    const margin = GAME_CONFIG.pipes.spawnMarginY;
    return {
        min: margin,
        max: GAME_CONFIG.groundY - pipeGap - margin,
    };
}

export function randomGapY(dailyRng, pipeGap) {
    const { min, max } = gapBounds(pipeGap);
    if (dailyRng) {
        return Utils.seededRandomInt(dailyRng, min, max);
    }
    return Utils.randomInt(min, max);
}

/**
 * @param {object} ctx
 * @param {number} ctx.gapIndex
 * @param {number | null} ctx.lastGapY
 * @param {(() => number) | null} ctx.dailyRng
 * @param {number} ctx.pipeGap
 * @param {number} ctx.runScore
 * @returns {{ gapY: number, gapIndex: number, lastGapY: number }}
 */
export function resolveNextGapY({ gapIndex, lastGapY, dailyRng, pipeGap, runScore }) {
    const scriptedY = getScriptedPipeGapY(gapIndex, pipeGap);
    if (scriptedY !== null) {
        return { gapY: scriptedY, gapIndex: gapIndex + 1, lastGapY: scriptedY };
    }

    const { min, max } = gapBounds(pipeGap);
    const raw = randomGapY(dailyRng, pipeGap);
    const maxDelta = maxGapDeltaForScore(runScore);
    const gapY = smoothGapY(raw, lastGapY, maxDelta, min, max);
    return { gapY, gapIndex, lastGapY: gapY };
}
