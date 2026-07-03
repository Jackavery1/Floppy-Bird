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

    it('clés hardcore séparées', () => {
        expect(highScoreKey('normal', true)).toBe('flappy-bird-high-score-hardcore-normal');
        expect(leaderboardKey('hard', true)).toBe('flappy-bird-leaderboard-hardcore-hard');
    });

    it('un skinId ajoute un suffixe dédié (classement/record par skin spécial)', () => {
        expect(highScoreKey('normal', false, 'cosmos')).toBe(
            'flappy-bird-high-score-normal-skin-cosmos'
        );
        expect(leaderboardKey('hard', true, 'phoenix')).toBe(
            'flappy-bird-leaderboard-hardcore-hard-skin-phoenix'
        );
    });

    it('sans skinId, les clés restent identiques à avant (rétro-compatibilité)', () => {
        expect(highScoreKey('normal', false, null)).toBe(highScoreKey('normal', false));
        expect(leaderboardKey('hard', true, null)).toBe(leaderboardKey('hard', true));
    });
});
