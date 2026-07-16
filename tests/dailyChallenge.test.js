import { describe, it, expect } from 'vitest';
import {
    getDailyChallengeCode,
    getDailyChallengeSeed,
    getDailyChallengeSkin,
    getDailyChallengeGoal,
    formatDailyMenuButtonLabel,
    formatDailyMenuSubtitle,
    formatDailyHudLabel,
    formatDailyStartBanner,
    getDailyChallengeSummary,
} from '../src/dailyChallenge.js';
import { DIFFICULTY } from '../src/config.js';
import { getSkinPattern } from '../src/skinPatterns.js';

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

    it('getDailyChallengeGoal applique les bases relevées + bonus skin', () => {
        const skinId = getDailyChallengeSkin(date);
        const offset = getSkinPattern(skinId).goalOffset ?? 0;
        expect(getDailyChallengeGoal(DIFFICULTY.EASY, date)).toBe(15 + offset);
        expect(getDailyChallengeGoal(DIFFICULTY.NORMAL, date)).toBe(22 + offset);
        expect(getDailyChallengeGoal(DIFFICULTY.HARD, date)).toBe(30 + offset);
    });

    it('formatDailyMenuButtonLabel affiche Défi du jour', () => {
        const label = formatDailyMenuButtonLabel(DIFFICULTY.NORMAL, date);
        expect(label).toBe('Défi du jour');
    });

    it('formatDailyMenuSubtitle décrit le pattern', () => {
        const sub = formatDailyMenuSubtitle(DIFFICULTY.NORMAL, date);
        const summary = getDailyChallengeSummary(DIFFICULTY.NORMAL, date);
        expect(sub).toContain(summary.skinLabel);
        expect(sub).toContain(summary.patternTag);
        expect(sub).toMatch(/\d+ pts/);
    });

    it('formatDailyStartBanner inclut skin et pattern', () => {
        const summary = getDailyChallengeSummary(DIFFICULTY.NORMAL, date);
        const banner = formatDailyStartBanner({
            skinLabel: summary.skinLabel,
            patternTag: summary.patternTag,
            goal: summary.goal,
        });
        expect(banner).toContain(summary.skinLabel);
        expect(banner).toContain(summary.patternTag);
        expect(banner).toContain(`OBJECTIF : ${summary.goal} pts`);
    });

    it('formatDailyHudLabel inclut le code du jour', () => {
        const code = getDailyChallengeCode(date);
        expect(formatDailyHudLabel(3, 10, date)).toBe(`DÉFI #${code} · 3/10`);
    });
});
