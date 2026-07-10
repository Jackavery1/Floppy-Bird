import { resolveNextGapY } from './pipeGaps.js';
import { maxGapDeltaForScore } from './gapDifficulty.js';
import { GAME_CONFIG } from './config.js';

const DEFAULT_PIPE_GAP = GAME_CONFIG.getDifficulty('normal').gap;

/**
 * Échantillonne une séquence de gaps (tests / seam e2e).
 * @param {number} count
 * @param {object} [opts]
 * @param {number} [opts.gapIndex]
 * @param {number | null} [opts.lastGapY]
 * @param {number} [opts.runScore]
 * @param {number} [opts.gapJitterSeed]
 * @param {number} [opts.pipeGap]
 */
export function sampleGapSequence(count, opts = {}) {
    let gapIndex = opts.gapIndex ?? 99;
    let lastGapY = opts.lastGapY ?? 200;
    let prevGapDelta = 0;
    const runScore = opts.runScore ?? 15;
    const pipeGap = opts.pipeGap ?? DEFAULT_PIPE_GAP;
    const gapJitterSeed = opts.gapJitterSeed ?? 4242;
    const gaps = [];
    const deltas = [];

    for (let i = 0; i < count; i++) {
        const result = resolveNextGapY({
            gapIndex,
            lastGapY,
            dailyRng: null,
            pipeGap,
            runScore,
            prevGapDelta,
            gapJitterSeed,
        });
        if (lastGapY != null) deltas.push(result.gapY - lastGapY);
        gaps.push(result.gapY);
        gapIndex = result.gapIndex;
        lastGapY = result.lastGapY;
        prevGapDelta = result.gapDelta;
    }

    const maxDelta = maxGapDeltaForScore(runScore);
    const maxObservedDelta =
        deltas.length > 0 ? Math.max(...deltas.map((d) => Math.abs(d))) : 0;

    return {
        gaps,
        deltas,
        maxObservedDelta,
        maxAllowedDelta: maxDelta,
        spread: gaps.length > 1 ? Math.max(...gaps) - Math.min(...gaps) : 0,
    };
}
