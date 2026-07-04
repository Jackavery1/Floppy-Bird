import { describe, it, expect } from 'vitest';
import { maxGapDeltaForScore, effectivePipeGapForScore, speedBoostMultiplierForScore } from '../src/gapDifficulty.js';
import { GAME_CONFIG } from '../src/config.js';

describe('gapDifficulty', () => {
    it('maxGapDeltaForScore reste au max avant le seuil', () => {
        expect(maxGapDeltaForScore(19)).toBe(GAME_CONFIG.pipes.maxGapDelta);
    });

    it('maxGapDeltaForScore resserre après 20 points', () => {
        expect(maxGapDeltaForScore(20)).toBe(GAME_CONFIG.pipes.maxGapDelta);
        expect(maxGapDeltaForScore(30)).toBe(
            GAME_CONFIG.pipes.maxGapDelta - GAME_CONFIG.round.gapTightenStep
        );
        expect(maxGapDeltaForScore(50)).toBe(
            GAME_CONFIG.pipes.maxGapDelta - 3 * GAME_CONFIG.round.gapTightenStep
        );
    });

    it('maxGapDeltaForScore ne descend pas sous le minimum', () => {
        expect(maxGapDeltaForScore(999)).toBe(GAME_CONFIG.pipes.minGapDelta);
    });

    it('effectivePipeGapForScore resserre le gap physique après 20 points', () => {
        const base = 112;
        expect(effectivePipeGapForScore(base, 19)).toBe(base);
        expect(effectivePipeGapForScore(base, 30)).toBe(base - GAME_CONFIG.round.gapTightenStep);
        expect(effectivePipeGapForScore(base, 999)).toBe(GAME_CONFIG.pipes.minPipeGap);
    });

    it('speedBoostMultiplierForScore plafonne à score 50+', () => {
        expect(speedBoostMultiplierForScore(0)).toBe(1);
        expect(speedBoostMultiplierForScore(10)).toBeCloseTo(1.03);
        expect(speedBoostMultiplierForScore(50)).toBeCloseTo(1.15);
        expect(speedBoostMultiplierForScore(100)).toBeCloseTo(1.15);
    });
});
