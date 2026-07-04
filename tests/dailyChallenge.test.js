import { describe, it, expect } from 'vitest';
import {
    getDailyChallengeCode,
    getDailyChallengeSeed,
    getDailyChallengeSkin,
    getDailyChallengeGoal,
    formatDailyMenuButtonLabel,
    formatDailyMenuSubtitle,
    formatDailyHudLabel,
} from '../src/dailyChallenge.js';
import { DIFFICULTY } from '../src/config.js';

describe('dailyChallenge', () => {
    const date = new Date(2026, 0, 1);

    it('getDailyChallengeCode est stable pour une date', () => {
        expect(getDailyChallengeCode(date)).toBe(getDailyChallengeCode(date));
    });

    it('getDailyChallengeSeed est stable pour une date', () => {
        expect(getDailyChallengeSeed(date)).toBe(getDailyChallengeSeed(date));
    });

    it('getDailyChallengeSkin est dérivé du seed', () => {
        expect(getDailyChallengeSkin(date)).toBe(getDailyChallengeSkin(date));
    });

    it('getDailyChallengeGoal varie selon la difficulté', () => {
        const easy = getDailyChallengeGoal(DIFFICULTY.EASY, date);
        const hard = getDailyChallengeGoal(DIFFICULTY.HARD, date);
        expect(hard).toBeGreaterThan(easy);
    });

    it('formatDailyMenuButtonLabel inclut skin et objectif', () => {
        const label = formatDailyMenuButtonLabel(DIFFICULTY.NORMAL, date);
        expect(label).toMatch(/DÉFI #\d{4}/);
        expect(label).toMatch(/pts/);
    });

    it('formatDailyMenuSubtitle décrit le pattern', () => {
        const sub = formatDailyMenuSubtitle(DIFFICULTY.NORMAL, date);
        expect(sub).toMatch(/objectif \d+ pts/);
    });

    it('formatDailyHudLabel inclut le code du jour', () => {
        const code = getDailyChallengeCode(date);
        expect(formatDailyHudLabel(3, 10, date)).toBe(`DÉFI #${code} · 3/10`);
    });
});
