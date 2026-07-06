import { GAME_CONFIG } from './config.js';

/** @param {number} score */
function gapTightenTiers(score) {
    const { gapTightenAfterScore, gapTightenEvery } = GAME_CONFIG.round;
    if (score < gapTightenAfterScore) return 0;
    return 1 + Math.floor((score - gapTightenAfterScore) / gapTightenEvery);
}

/** @param {number} score */
export function maxGapDeltaForScore(score) {
    const { maxGapDelta, minGapDelta } = GAME_CONFIG.pipes;
    const { gapTightenStep } = GAME_CONFIG.round;
    const tiers = gapTightenTiers(score);
    if (tiers === 0) return maxGapDelta;
    return Math.max(minGapDelta, maxGapDelta - tiers * gapTightenStep);
}

/** @param {number} score */
export function speedBoostMultiplierForScore(score) {
    const { speedBoostEvery, speedBoostPercent, speedBoostMaxBoosts } = GAME_CONFIG.round;
    let boosts = Math.floor(score / speedBoostEvery);
    if (speedBoostMaxBoosts != null) {
        boosts = Math.min(boosts, speedBoostMaxBoosts);
    }
    return 1 + boosts * speedBoostPercent;
}

/** @param {number} baseGap @param {number} score */
export function effectivePipeGapForScore(baseGap, score) {
    const { gapTightenStep } = GAME_CONFIG.round;
    const { minPipeGap } = GAME_CONFIG.pipes;
    const tiers = gapTightenTiers(score);
    if (tiers === 0) return baseGap;
    return Math.max(minPipeGap, baseGap - tiers * gapTightenStep);
}
