import { describe, it, expect } from 'vitest';
import {
    SKIN_IDS,
    SKINS,
    getSkin,
    isSpecialSkin,
    listUnlockedSkins,
    nextUnlockedSkin,
    cycleUnlockedSkin,
} from '../src/skins/index.js';

function baseCtx(overrides = {}) {
    return {
        bestScoreAny: 0,
        bestHardcoreScore: 0,
        bestEasyScore: 0,
        bestNormalScore: 0,
        bestHardScore: 0,
        bestTrainingScore: 0,
        dailyCompletionsTotal: 0,
        ...overrides,
    };
}

/** Contexte avec tous les skins sauf neon débloqués. */
function ctxAllButNeon() {
    return baseCtx({
        bestScoreAny: 30,
        bestHardcoreScore: 28,
        bestEasyScore: 15,
        bestNormalScore: 15,
        bestHardScore: 15,
        bestTrainingScore: 10,
        dailyCompletionsTotal: 3,
    });
}

describe('skins', () => {
    it('expose 16 skins uniques, classique toujours débloqué', () => {
        expect(SKIN_IDS).toHaveLength(16);
        expect(new Set(SKIN_IDS).size).toBe(16);
        expect(SKINS.classic.unlock(baseCtx())).toBe(true);
    });

    it('getSkin retombe sur classique pour un id inconnu', () => {
        expect(getSkin('does-not-exist').id).toBe('classic');
        expect(getSkin(undefined).id).toBe('classic');
    });

    it('couleurs : paliers score classique et normal', () => {
        expect(SKINS.lavande.unlock(baseCtx({ bestScoreAny: 4 }))).toBe(false);
        expect(SKINS.lavande.unlock(baseCtx({ bestScoreAny: 5 }))).toBe(true);
        expect(SKINS.ambre.unlock(baseCtx({ bestScoreAny: 11 }))).toBe(false);
        expect(SKINS.ambre.unlock(baseCtx({ bestScoreAny: 12 }))).toBe(true);
        expect(SKINS.corail.unlock(baseCtx({ bestScoreAny: 25 }))).toBe(true);
        expect(SKINS.minuit.unlock(baseCtx({ bestScoreAny: 14 }))).toBe(false);
        expect(SKINS.minuit.unlock(baseCtx({ bestScoreAny: 15 }))).toBe(true);
    });

    it('ruby/ocean/fantôme gardent leurs seuils historiques', () => {
        expect(SKINS.ruby.unlock(baseCtx({ bestScoreAny: 10 }))).toBe(true);
        expect(SKINS.ocean.unlock(baseCtx({ bestScoreAny: 20 }))).toBe(true);
        expect(SKINS.fantome.unlock(baseCtx({ bestScoreAny: 30 }))).toBe(true);
    });

    it('hardcore : forêt, armure, phénix, cosmos en paliers', () => {
        expect(SKINS.forest.unlock(baseCtx({ bestHardcoreScore: 5 }))).toBe(true);
        expect(SKINS.armure.unlock(baseCtx({ bestHardcoreScore: 15 }))).toBe(true);
        expect(SKINS.phoenix.unlock(baseCtx({ bestHardcoreScore: 19 }))).toBe(false);
        expect(SKINS.phoenix.unlock(baseCtx({ bestHardcoreScore: 20 }))).toBe(true);
        expect(SKINS.cosmos.unlock(baseCtx({ bestHardcoreScore: 28 }))).toBe(true);
    });

    it('mushu exige 15+ dans les 3 difficultés', () => {
        expect(
            SKINS.mushu.unlock(
                baseCtx({
                    bestEasyScore: 15,
                    bestNormalScore: 15,
                    bestHardScore: 14,
                })
            )
        ).toBe(false);
        expect(
            SKINS.mushu.unlock(
                baseCtx({
                    bestEasyScore: 15,
                    bestNormalScore: 15,
                    bestHardScore: 15,
                })
            )
        ).toBe(true);
    });

    it('glace exige 3 défis du jour réussis', () => {
        expect(SKINS.glace.unlock(baseCtx({ dailyCompletionsTotal: 2 }))).toBe(false);
        expect(SKINS.glace.unlock(baseCtx({ dailyCompletionsTotal: 3 }))).toBe(true);
    });

    it('tempête exige 10 pts en entraînement', () => {
        expect(SKINS.tempete.unlock(baseCtx({ bestTrainingScore: 9 }))).toBe(false);
        expect(SKINS.tempete.unlock(baseCtx({ bestTrainingScore: 10 }))).toBe(true);
    });

    it('néon exige les 15 autres skins', () => {
        const almost = ctxAllButNeon();
        almost.bestTrainingScore = 9;
        expect(SKINS.neon.unlock(almost)).toBe(false);

        expect(SKINS.neon.unlock(ctxAllButNeon())).toBe(true);
        expect(listUnlockedSkins(ctxAllButNeon())).toHaveLength(16);
    });

    it('nextUnlockedSkin boucle uniquement sur les skins débloqués', () => {
        const ctx = baseCtx({ bestScoreAny: 10 });
        expect(listUnlockedSkins(ctx)).toEqual(['classic', 'lavande', 'ruby']);
        expect(nextUnlockedSkin('classic', ctx)).toBe('lavande');
        expect(nextUnlockedSkin('ruby', ctx)).toBe('classic');
    });

    it('cycleUnlockedSkin accepte un pas négatif', () => {
        const ctx = baseCtx({ bestScoreAny: 10 });
        expect(cycleUnlockedSkin('lavande', ctx, -1)).toBe('classic');
    });

    it('8 skins classiques (classement commun) et 8 skins spéciaux (classement dédié)', () => {
        const classicIds = SKIN_IDS.filter((id) => !isSpecialSkin(id));
        const specialIds = SKIN_IDS.filter((id) => isSpecialSkin(id));
        expect(classicIds).toEqual([
            'classic',
            'lavande',
            'ruby',
            'ambre',
            'ocean',
            'corail',
            'forest',
            'minuit',
        ]);
        expect(specialIds).toEqual([
            'armure',
            'mushu',
            'phoenix',
            'fantome',
            'glace',
            'tempete',
            'cosmos',
            'neon',
        ]);
        expect(classicIds.every((id) => getSkin(id).family === 'classic')).toBe(true);
        expect(specialIds.every((id) => getSkin(id).family === 'special')).toBe(true);
    });

    it('isSpecialSkin retombe sur classique (non spécial) pour un id inconnu', () => {
        expect(isSpecialSkin('does-not-exist')).toBe(false);
        expect(isSpecialSkin(undefined)).toBe(false);
        expect(isSpecialSkin(null)).toBe(false);
    });
});
