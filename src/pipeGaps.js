import { GAME_CONFIG, getScriptedPipeGapY } from './config.js';
import { maxGapDeltaForScore } from './gapDifficulty.js';
import { Utils } from './utils.js';

export function effectiveGapDeltaCap(maxDelta, prevGapDelta, targetDelta) {
    const { minGapDelta, consecutiveGapDeltaFactor, consecutiveGapDeltaThreshold } =
        GAME_CONFIG.pipes;
    if (prevGapDelta === 0 || targetDelta === 0) return maxDelta;
    if (Math.sign(targetDelta) !== Math.sign(prevGapDelta)) return maxDelta;
    if (Math.abs(prevGapDelta) < maxDelta * consecutiveGapDeltaThreshold) return maxDelta;
    return Math.max(minGapDelta, Math.floor(maxDelta * consecutiveGapDeltaFactor));
}

export function smoothGapY(rawY, lastGapY, maxDelta, minY, maxY, prevGapDelta = 0) {
    const clamped = Utils.clamp(rawY, minY, maxY);
    if (lastGapY == null) return clamped;
    const targetDelta = clamped - lastGapY;
    const cap = effectiveGapDeltaCap(maxDelta, prevGapDelta, targetDelta);
    return Utils.clamp(clamped, lastGapY - cap, lastGapY + cap);
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
 * @param {number} [ctx.prevGapDelta]
 * @returns {{ gapY: number, gapIndex: number, lastGapY: number, gapDelta: number }}
 */
export function resolveNextGapY({
    gapIndex,
    lastGapY,
    dailyRng,
    pipeGap,
    runScore,
    prevGapDelta = 0,
}) {
    const scriptedY = dailyRng ? null : getScriptedPipeGapY(gapIndex, pipeGap);
    if (scriptedY !== null) {
        const gapDelta = lastGapY != null ? scriptedY - lastGapY : 0;
        return { gapY: scriptedY, gapIndex: gapIndex + 1, lastGapY: scriptedY, gapDelta };
    }

    const { min, max } = gapBounds(pipeGap);
    const raw = randomGapY(dailyRng, pipeGap);
    const maxDelta = maxGapDeltaForScore(runScore);
    const gapY = smoothGapY(raw, lastGapY, maxDelta, min, max, prevGapDelta);
    const gapDelta = lastGapY != null ? gapY - lastGapY : 0;
    return { gapY, gapIndex, lastGapY: gapY, gapDelta };
}
