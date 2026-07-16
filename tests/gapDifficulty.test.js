import { describe, it, expect } from 'vitest';
import {
    maxGapDeltaForScore,
    effectivePipeGapForScore,
    speedBoostMultiplierForScore,
} from '../src/gapDifficulty.js';
import { GAME_CONFIG } from '../src/config.js';

describe('gapDifficulty', () => {
    const { gapTightenAfterScore, gapTightenEvery, gapTightenStep } = GAME_CONFIG.round;

    it('maxGapDeltaForScore reste au max avant le seuil', () => {
        expect(maxGapDeltaForScore(gapTightenAfterScore - 1)).toBe(GAME_CONFIG.pipes.maxGapDelta);
    });

    it('maxGapDeltaForScore resserre dès gapTightenAfterScore', () => {
        expect(maxGapDeltaForScore(gapTightenAfterScore)).toBe(
            GAME_CONFIG.pipes.maxGapDelta - gapTightenStep
        );
        expect(maxGapDeltaForScore(gapTightenAfterScore + gapTightenEvery)).toBe(
            GAME_CONFIG.pipes.maxGapDelta - 2 * gapTightenStep
        );
        expect(maxGapDeltaForScore(50)).toBe(GAME_CONFIG.pipes.minGapDelta);
    });

    it('maxGapDeltaForScore ne descend pas sous le minimum', () => {
        expect(maxGapDeltaForScore(999)).toBe(GAME_CONFIG.pipes.minGapDelta);
    });

    it('effectivePipeGapForScore resserre le gap physique dès le seuil', () => {
        const base = GAME_CONFIG.getDifficulty('normal').gap;
        expect(effectivePipeGapForScore(base, gapTightenAfterScore - 1)).toBe(base);
        expect(effectivePipeGapForScore(base, gapTightenAfterScore)).toBe(base - gapTightenStep);
        expect(effectivePipeGapForScore(base, gapTightenAfterScore + gapTightenEvery)).toBe(
            base - 2 * gapTightenStep
        );
        expect(effectivePipeGapForScore(base, 999)).toBe(GAME_CONFIG.pipes.minPipeGap);
    });

    it('speedBoostMultiplierForScore plafonne à score 50+', () => {
        expect(speedBoostMultiplierForScore(0)).toBe(1);
        expect(speedBoostMultiplierForScore(10)).toBeCloseTo(1.03);
        expect(speedBoostMultiplierForScore(50)).toBeCloseTo(1.15);
        expect(speedBoostMultiplierForScore(100)).toBeCloseTo(1.15);
    });

    it('ne fait pas coincider premier gap tighten et palier vitesse', () => {
        expect(gapTightenAfterScore % GAME_CONFIG.round.speedBoostEvery).not.toBe(0);
    });
});
