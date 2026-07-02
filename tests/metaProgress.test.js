import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listUnlockedSkins, nextUnlockedSkin, SKINS } from '../src/skins/index.js';
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
        setItem: (key, value) => { store.set(key, value); },
        removeItem: (key) => { store.delete(key); },
        clear: () => { store.clear(); },
    });
});

describe('skins', () => {
    it('classic toujours débloqué', () => {
        const ctx = { bestScoreAny: 0, bestHardcoreScore: 0, score: 0, hardcore: false, dailyChallenge: true, unlockedSkinCount: 1 };
        expect(listUnlockedSkins(ctx)).toContain('classic');
    });

    it('ruby se débloque à 10 points record', () => {
        const ctx = { bestScoreAny: 10, bestHardcoreScore: 0, score: 0, hardcore: false, dailyChallenge: true, unlockedSkinCount: 2 };
        expect(SKINS.ruby.unlock(ctx)).toBe(true);
        expect(listUnlockedSkins(ctx)).toContain('ruby');
    });

    it('nextUnlockedSkin cycle les skins débloqués', () => {
        const ctx = { bestScoreAny: 10, bestHardcoreScore: 0, score: 0, hardcore: false, dailyChallenge: true, unlockedSkinCount: 2 };
        expect(nextUnlockedSkin('classic', ctx)).toBe('lavande');
        expect(nextUnlockedSkin('ruby', ctx)).toBe('classic');
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
        expect(newly.some(a => a.id === 'first_flight')).toBe(true);
        expect(loadMeta().achievements).toContain('first_flight');
    });

    it('ignore les succès déjà débloqués', () => {
        unlockAchievement('first_flight');
        const round = createRoundState();
        round.score = 5;
        const scene = { round, trainingMode: false, hardcoreMode: false };
        const newly = evaluateAchievements(scene);
        expect(newly.some(a => a.id === 'first_flight')).toBe(false);
    });
});
