import { describe, it, expect, vi } from 'vitest';
import { buildMetaContext } from '../src/metaContext.js';
import { createRoundState } from '../src/roundState.js';

vi.mock('../src/storage.js', () => ({
    loadHighScore: vi.fn(() => 12),
}));

describe('metaContext', () => {
    it('buildMetaContext agrège score, modes et records', () => {
        const round = createRoundState();
        round.score = 3;
        const ctx = buildMetaContext({
            round,
            hardcoreMode: true,
        });
        expect(ctx.score).toBe(3);
        expect(ctx.hardcore).toBe(true);
        expect(ctx.dailyChallenge).toBe(true);
        expect(ctx.bestScoreAny).toBe(12);
        expect(ctx.unlockedSkinCount).toBeGreaterThan(0);
    });
});
