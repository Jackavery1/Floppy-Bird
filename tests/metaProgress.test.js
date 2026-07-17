import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listUnlockedSkins, cycleUnlockedSkin, SKINS } from '../src/skins/index.js';
import { evaluateAchievements } from '../src/metaProgress.js';
import { loadMeta, unlockAchievement } from '../src/metaStorage.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/storage.js', () => ({
    loadHighScore: vi.fn(() => 0),
}));

const store = new Map();

beforeEach(() => {
    store.clear();
    vi.stubGlobal('localStorage', {
        getItem: (key) => store.get(key) ?? null,
        setItem: (key, value) => {
            store.set(key, value);
        },
        removeItem: (key) => {
            store.delete(key);
        },
        clear: () => {
            store.clear();
        },
    });
});

describe('skins', () => {
    it('classic toujours débloqué', () => {
        const ctx = {
            bestScoreAny: 0,
            bestHardcoreScore: 0,
            score: 0,
            hardcore: false,
            dailyChallenge: true,
            unlockedSkinCount: 1,
        };
        expect(listUnlockedSkins(ctx)).toContain('classic');
    });

    it('ruby se débloque à 10 points record', () => {
        const ctx = {
            bestScoreAny: 10,
            bestHardcoreScore: 0,
            score: 0,
            hardcore: false,
            dailyChallenge: true,
            unlockedSkinCount: 2,
        };
        expect(SKINS.ruby.unlock(ctx)).toBe(true);
        expect(listUnlockedSkins(ctx)).toContain('ruby');
    });

    it('cycleUnlockedSkin avance sur les skins débloqués', () => {
        const ctx = {
            bestScoreAny: 10,
            bestHardcoreScore: 0,
            score: 0,
            hardcore: false,
            dailyChallenge: true,
            unlockedSkinCount: 2,
        };
        expect(cycleUnlockedSkin('classic', ctx, 1)).toBe('lavande');
        expect(cycleUnlockedSkin('ruby', ctx, 1)).toBe('classic');
    });
});

describe('metaProgress achievements', () => {
    it('débloque premier vol à 1 point', () => {
        const round = createRoundState();
        round.score = 1;
        const scene = {
            round,
            trainingMode: false,
            hardcoreMode: false,
        };
        const newly = evaluateAchievements(scene);
        expect(newly.some((a) => a.id === 'first_flight')).toBe(true);
        expect(loadMeta().achievements).toContain('first_flight');
    });

    it('ignore les succès déjà débloqués', () => {
        unlockAchievement('first_flight');
        const round = createRoundState();
        round.score = 5;
        const scene = { round, trainingMode: false, hardcoreMode: false };
        const newly = evaluateAchievements(scene);
        expect(newly.some((a) => a.id === 'first_flight')).toBe(false);
    });

    it('ne débloque rien en mode entraînement', () => {
        const round = createRoundState();
        round.score = 25;
        const scene = { round, trainingMode: true, hardcoreMode: false };
        expect(evaluateAchievements(scene)).toEqual([]);
    });

    it('débloque hardcore_hero en hardcore à 8 points', () => {
        const round = createRoundState();
        round.score = 8;
        const scene = { round, trainingMode: false, hardcoreMode: true };
        const newly = evaluateAchievements(scene);
        expect(newly.some((a) => a.id === 'hardcore_hero')).toBe(true);
    });

    it('respecte le filtre timing roundEnd', () => {
        const round = createRoundState();
        round.score = 25;
        const scene = {
            round,
            trainingMode: false,
            hardcoreMode: false,
            dailyChallengeMode: false,
            dailyGoal: 0,
            dailyGoalCelebrated: false,
        };
        const atScore = evaluateAchievements(scene, { timing: 'score' });
        expect(atScore.some((a) => a.id === 'daily_flyer')).toBe(false);
        const atRoundEnd = evaluateAchievements(scene, { timing: 'roundEnd' });
        expect(atRoundEnd.every((a) => (a.timing ?? 'score') === 'roundEnd')).toBe(true);
    });
});
