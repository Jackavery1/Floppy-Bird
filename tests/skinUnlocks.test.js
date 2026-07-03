import { describe, it, expect } from 'vitest';
import { resolveUnlock } from '../src/skins/skinUnlocks.js';
import { SKIN_DEFINITIONS } from '../src/skins/skinDefinitions.js';
import { SKIN_IDS } from '../src/skins/skinIds.js';

function makeCtx(overrides = {}) {
    return {
        bestScoreAny: 0,
        bestNormalScore: 0,
        bestEasyScore: 0,
        bestHardScore: 0,
        bestHardcoreScore: 0,
        bestTrainingScore: 0,
        dailyCompletionsTotal: 0,
        ...overrides,
    };
}

describe('skinUnlocks', () => {
    it('always débloque classic', () => {
        const unlock = resolveUnlock(SKIN_DEFINITIONS.classic.unlock, {});
        expect(unlock(makeCtx())).toBe(true);
    });

    it('scoreAny respecte le seuil', () => {
        const unlock = resolveUnlock(SKIN_DEFINITIONS.ruby.unlock, {});
        expect(unlock(makeCtx({ bestScoreAny: 9 }))).toBe(false);
        expect(unlock(makeCtx({ bestScoreAny: 10 }))).toBe(true);
    });

    it('minuit utilise le score global comme les autres paliers classiques', () => {
        const unlock = resolveUnlock(SKIN_DEFINITIONS.minuit.unlock, {});
        expect(unlock(makeCtx({ bestScoreAny: 14, bestHardScore: 20 }))).toBe(false);
        expect(unlock(makeCtx({ bestScoreAny: 15, bestHardScore: 0 }))).toBe(true);
    });

    it('neonCollection exige tous les autres skins', () => {
        const skins = Object.fromEntries(
            SKIN_IDS.map((id) => [id, { unlock: () => id === 'classic' }])
        );
        const unlock = resolveUnlock(SKIN_DEFINITIONS.neon.unlock, skins);
        expect(unlock(makeCtx())).toBe(false);
        for (const id of SKIN_IDS) {
            if (id !== 'neon') skins[id].unlock = () => true;
        }
        expect(unlock(makeCtx())).toBe(true);
    });
});
