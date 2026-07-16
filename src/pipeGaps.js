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

export function applyScriptedGapJitter(scriptedY, gapIndex, jitterSeed, pipeGap) {
    const maxJitter = GAME_CONFIG.pipes.scriptedGapJitterPx ?? 0;
    if (!maxJitter || jitterSeed == null || jitterSeed === 0) return scriptedY;
    const rng = Utils.createSeededRandom((jitterSeed + gapIndex * 7919) >>> 0);
    const delta = Utils.seededRandomInt(rng, -maxJitter, maxJitter);
    const { min, max } = gapBounds(pipeGap);
    return Utils.clamp(scriptedY + delta, min, max);
}

/** @param {number} jitterSeed @param {number} count */
export function buildScriptedGapOrder(jitterSeed, count) {
    const order = Array.from({ length: count }, (_, i) => i);
    if (!jitterSeed) return order;
    const rng = Utils.createSeededRandom(jitterSeed >>> 0);
    for (let i = count - 1; i > 0; i--) {
        const j = Utils.seededRandomInt(rng, 0, i);
        [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
}

/**
 * @param {object} ctx
 * @param {number} ctx.gapIndex
 * @param {number | null} ctx.lastGapY
 * @param {(() => number) | null} ctx.dailyRng
 * @param {number} ctx.pipeGap
 * @param {number} ctx.runScore
 * @param {number} [ctx.prevGapDelta]
 * @param {number} [ctx.gapJitterSeed]
 * @returns {{ gapY: number, gapIndex: number, lastGapY: number, gapDelta: number }}
 */
export function resolveNextGapY({
    gapIndex,
    lastGapY,
    dailyRng,
    pipeGap,
    runScore,
    prevGapDelta = 0,
    gapJitterSeed = 0,
}) {
    const scriptedCount = GAME_CONFIG.level.pipeGaps.length;
    let scriptedY = null;
    if (!dailyRng && gapIndex < scriptedCount) {
        const slot = buildScriptedGapOrder(gapJitterSeed, scriptedCount)[gapIndex];
        scriptedY = getScriptedPipeGapY(slot, pipeGap);
    }
    if (scriptedY !== null) {
        const { min, max } = gapBounds(pipeGap);
        const raw = applyScriptedGapJitter(scriptedY, gapIndex, gapJitterSeed, pipeGap);
        const maxDelta = maxGapDeltaForScore(runScore);
        const gapY = smoothGapY(raw, lastGapY, maxDelta, min, max, prevGapDelta);
        const gapDelta = lastGapY != null ? gapY - lastGapY : 0;
        return { gapY, gapIndex: gapIndex + 1, lastGapY: gapY, gapDelta };
    }

    const { min, max } = gapBounds(pipeGap);
    const raw = randomGapY(dailyRng, pipeGap);
    const maxDelta = maxGapDeltaForScore(runScore);
    const gapY = smoothGapY(raw, lastGapY, maxDelta, min, max, prevGapDelta);
    const gapDelta = lastGapY != null ? gapY - lastGapY : 0;
    return { gapY, gapIndex, lastGapY: gapY, gapDelta };
}
