import { GAME_CONFIG } from './config.js';

/** @param {number} score */
export function maxGapDeltaForScore(score) {
    const { maxGapDelta, minGapDelta } = GAME_CONFIG.pipes;
    const { gapTightenAfterScore, gapTightenEvery, gapTightenStep } = GAME_CONFIG.round;
    if (score < gapTightenAfterScore) return maxGapDelta;
    const tiers = Math.floor((score - gapTightenAfterScore) / gapTightenEvery);
    return Math.max(minGapDelta, maxGapDelta - tiers * gapTightenStep);
}
