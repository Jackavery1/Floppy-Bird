import { GAME_CONFIG } from './config.js';

/** @param {number} score */
export function maxGapDeltaForScore(score) {
    const { maxGapDelta, minGapDelta } = GAME_CONFIG.pipes;
    const { gapTightenAfterScore, gapTightenEvery, gapTightenStep } = GAME_CONFIG.round;
    if (score < gapTightenAfterScore) return maxGapDelta;
    const tiers = Math.floor((score - gapTightenAfterScore) / gapTightenEvery);
    return Math.max(minGapDelta, maxGapDelta - tiers * gapTightenStep);
}

/** @param {number} baseGap @param {number} score */
export function effectivePipeGapForScore(baseGap, score) {
    const { gapTightenAfterScore, gapTightenEvery, gapTightenStep } = GAME_CONFIG.round;
    const { minPipeGap } = GAME_CONFIG.pipes;
    if (score < gapTightenAfterScore) return baseGap;
    const tiers = Math.floor((score - gapTightenAfterScore) / gapTightenEvery);
    return Math.max(minPipeGap, baseGap - tiers * gapTightenStep);
}
