import { describe, it, expect, vi } from 'vitest';
import { resolvePlaySkin } from '../src/playSkin.js';

vi.mock('../src/metaStorage.js', () => ({
    loadSelectedSkin: vi.fn(() => 'neon'),
}));

vi.mock('../src/metaContext.js', () => ({
    buildMetaContext: vi.fn(() => ({
        bestScoreAny: 5,
        unlockedSkinCount: 1,
    })),
}));

vi.mock('../src/skins/index.js', () => ({
    listUnlockedSkins: vi.fn(() => ['classic']),
}));

vi.mock('../src/dailyChallenge.js', () => ({
    getDailyChallengeSkin: vi.fn(() => 'mushu'),
}));

describe('playSkin', () => {
    it('utilise le skin du défi en mode daily', () => {
        const scene = { playMode: 'daily', round: { score: 0 }, hardcoreMode: false, dailyChallengeMode: true };
        expect(resolvePlaySkin(scene)).toBe('mushu');
    });

    it('retombe sur classique si skin sélectionné verrouillé', () => {
        const scene = { playMode: 'classic', round: { score: 0 }, hardcoreMode: false, dailyChallengeMode: false };
        expect(resolvePlaySkin(scene)).toBe('classic');
    });
});
