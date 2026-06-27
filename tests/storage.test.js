import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
    loadHighScore,
    saveHighScore,
    loadLeaderboard,
    saveToLeaderboard,
} from '../src/storage.js';
import { DIFFICULTY } from '../src/config.js';

describe('storage', () => {
    let store;

    beforeEach(() => {
        store = {};
        vi.stubGlobal('localStorage', {
            getItem: (k) => store[k] ?? null,
            setItem: (k, v) => { store[k] = v; },
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('loadHighScore retourne 0 par défaut', () => {
        expect(loadHighScore()).toBe(0);
    });

    it('saveHighScore ne descend pas le record', () => {
        expect(saveHighScore(10)).toBe(10);
        expect(saveHighScore(5, DIFFICULTY.NORMAL, 10)).toBe(10);
        expect(loadHighScore()).toBe(10);
    });

    it('records séparés par difficulté', () => {
        expect(saveHighScore(8, DIFFICULTY.EASY)).toBe(8);
        expect(saveHighScore(15, DIFFICULTY.HARD)).toBe(15);
        expect(loadHighScore(DIFFICULTY.EASY)).toBe(8);
        expect(loadHighScore(DIFFICULTY.HARD)).toBe(15);
        expect(loadHighScore(DIFFICULTY.NORMAL)).toBe(0);
    });

    it('saveToLeaderboard ignore le score 0', () => {
        const { entries, highlightId } = saveToLeaderboard(0);
        expect(entries).toEqual([]);
        expect(highlightId).toBeNull();
    });

    it('saveToLeaderboard enregistre un score positif', () => {
        const { entries, highlightId } = saveToLeaderboard(12);
        expect(entries).toHaveLength(1);
        expect(entries[0].score).toBe(12);
        expect(highlightId).toBeTruthy();
    });

    it('leaderboards séparés par difficulté', () => {
        saveToLeaderboard(5, DIFFICULTY.EASY);
        saveToLeaderboard(20, DIFFICULTY.HARD);
        expect(loadLeaderboard(DIFFICULTY.EASY)[0].score).toBe(5);
        expect(loadLeaderboard(DIFFICULTY.HARD)[0].score).toBe(20);
    });

    it('loadLeaderboard gère le format legacy numérique', () => {
        store['flappy-bird-leaderboard'] = JSON.stringify([8, 15]);
        const entries = loadLeaderboard();
        expect(entries).toHaveLength(2);
        expect(entries[0].score).toBe(8);
    });
});
