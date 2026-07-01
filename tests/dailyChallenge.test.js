import { describe, it, expect } from 'vitest';
import { getDailyChallengeCode, getDailyChallengeLabel, getDailyChallengeSeed, getMenuDailySubtitle, getRandomModeLabel } from '../src/dailyChallenge.js';

describe('dailyChallenge', () => {
    it('getDailyChallengeCode est stable pour une date', () => {
        const date = new Date(2026, 5, 29);
        expect(getDailyChallengeCode(date)).toBe(getDailyChallengeCode(date));
    });

    it('getDailyChallengeSeed est stable pour une date', () => {
        const date = new Date(2026, 5, 29);
        expect(getDailyChallengeSeed(date)).toBe(getDailyChallengeSeed(date));
    });

    it('getDailyChallengeLabel formate le défi', () => {
        const label = getDailyChallengeLabel(new Date(2026, 0, 1));
        expect(label).toMatch(/^Défi du jour #\d{4} · séquence partagée$/);
    });

    it('getMenuDailySubtitle bascule selon le mode', () => {
        expect(getMenuDailySubtitle(true, new Date(2026, 0, 1))).toMatch(/Défi du jour/);
        expect(getMenuDailySubtitle(false)).toBe(getRandomModeLabel());
    });
});
