import { describe, it, expect } from 'vitest';
import { applySkinPatternToDifficulty, getSkinPattern } from '../src/skinPatterns.js';

describe('skinPatterns', () => {
    it('getSkinPattern retourne classic par défaut', () => {
        const pattern = getSkinPattern('classic');
        expect(pattern.tagline).toBe('Équilibré');
        expect(pattern.gravityMult).toBe(1);
    });

    it('applySkinPatternToDifficulty modifie gravité et saut', () => {
        const base = {
            gravity: 0.38,
            jumpPower: -6.1,
            pipeSpeed: 2,
            gapSize: 120,
        };
        const result = applySkinPatternToDifficulty(base, 'ocean');
        expect(result.gravity).toBeLessThan(base.gravity);
        expect(result.jumpPower).toBeLessThan(base.jumpPower);
    });
});
