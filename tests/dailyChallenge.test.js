import { describe, it, expect } from 'vitest';
import { getDailyChallengeCode, getDailyChallengeLabel } from '../src/dailyChallenge.js';

describe('dailyChallenge', () => {
    it('getDailyChallengeCode est stable pour une date', () => {
        const date = new Date(2026, 5, 29);
        expect(getDailyChallengeCode(date)).toBe(getDailyChallengeCode(date));
    });

    it('getDailyChallengeLabel formate le défi', () => {
        const label = getDailyChallengeLabel(new Date(2026, 0, 1));
        expect(label).toMatch(/^Défi du jour #\d{4}$/);
    });
});
