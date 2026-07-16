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
            speed: 2,
            gap: 120,
        };
        const result = applySkinPatternToDifficulty(base, 'ocean');
        expect(result.gravity).toBeLessThan(base.gravity);
        expect(result.jumpPower).toBeLessThan(base.jumpPower);
    });

    it('clamp optionnel borne les mults permissifs', () => {
        const base = {
            gravity: 0.38,
            jumpPower: -6.1,
            speed: 2.85,
            gap: 108,
        };
        const raw = applySkinPatternToDifficulty(base, 'cosmos');
        const clamped = applySkinPatternToDifficulty(base, 'cosmos', {
            minGravityMult: 0.92,
            maxJumpMult: 1.05,
            minSpeedMult: 1.04,
        });
        expect(clamped.gravity).toBeGreaterThan(raw.gravity);
        expect(Math.abs(clamped.jumpPower)).toBeLessThan(Math.abs(raw.jumpPower));
        expect(clamped.speed).toBeGreaterThan(raw.speed);
    });
});
