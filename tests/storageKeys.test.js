import { describe, it, expect } from 'vitest';
import { STORAGE_KEYS, highScoreKey, leaderboardKey } from '../src/storageKeys.js';

describe('storageKeys', () => {
    it('expose les clés localStorage du jeu', () => {
        expect(STORAGE_KEYS.highScore).toBe('flappy-bird-high-score');
        expect(STORAGE_KEYS.ghost).toBe('flappy-bird-ghost');
    });

    it('highScoreKey suffixe la difficulté', () => {
        expect(highScoreKey('normal')).toBe('flappy-bird-high-score-normal');
    });

    it('leaderboardKey suffixe la difficulté', () => {
        expect(leaderboardKey('hard')).toBe('flappy-bird-leaderboard-hard');
    });
});
