import { describe, it, expect } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import { applyDailyRoundDifficulty } from '../src/dailyChallengeDifficulty.js';
import { applySkinPatternToDifficulty } from '../src/skinPatterns.js';

describe('dailyChallengeDifficulty', () => {
    const base = GAME_CONFIG.getDifficulty('normal');

    it('resserre gaps, accélère et densifie les tuyaux vs pattern seul', () => {
        const patterned = applySkinPatternToDifficulty(base, 'classic');
        const daily = applyDailyRoundDifficulty(base, 'classic');
        expect(daily.gap).toBeLessThan(patterned.gap);
        expect(daily.speed).toBeGreaterThan(patterned.speed);
        expect(daily.pipeInterval).toBeLessThan(patterned.pipeInterval);
    });

    it('borne les patterns trop permissifs (cosmos)', () => {
        const raw = applySkinPatternToDifficulty(base, 'cosmos');
        const daily = applyDailyRoundDifficulty(base, 'cosmos');
        expect(daily.gravity).toBeGreaterThan(raw.gravity);
        expect(Math.abs(daily.jumpPower)).toBeLessThanOrEqual(Math.abs(raw.jumpPower));
        expect(daily.speed).toBeGreaterThan(raw.speed);
    });

    it('respecte le plancher minPipeGap', () => {
        const hard = GAME_CONFIG.getDifficulty('hard');
        const daily = applyDailyRoundDifficulty(hard, 'tempete');
        expect(daily.gap).toBeGreaterThanOrEqual(GAME_CONFIG.pipes.minPipeGap);
    });

    it('garde une marge spawn avant le 1er tuyau', () => {
        const margin = GAME_CONFIG.round.pipeSpawnDelayMs - GAME_CONFIG.daily.spawnInvincibilityMs;
        expect(margin).toBeGreaterThanOrEqual(400);
        expect(GAME_CONFIG.daily.spawnInvincibilityMs).toBeLessThan(
            GAME_CONFIG.round.spawnInvincibilityMs
        );
    });
});
