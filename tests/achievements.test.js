import { describe, it, expect } from 'vitest';
import { ACHIEVEMENTS } from '../src/achievements.js';
import { buildMetaContext } from '../src/metaContext.js';
import { createRoundState } from '../src/roundState.js';

describe('achievements', () => {
    it('expose 5 définitions uniques', () => {
        const ids = ACHIEVEMENTS.map(a => a.id);
        expect(new Set(ids).size).toBe(ACHIEVEMENTS.length);
        expect(ACHIEVEMENTS.length).toBe(6);
    });

    it('chaque définition a id, title, desc et check', () => {
        for (const def of ACHIEVEMENTS) {
            expect(def.id).toBeTruthy();
            expect(def.title).toBeTruthy();
            expect(def.desc).toBeTruthy();
            expect(typeof def.check).toBe('function');
        }
    });

    it('premier vol se déclenche à 1 point', () => {
        const def = ACHIEVEMENTS.find(a => a.id === 'first_flight');
        const ctx = buildMetaContext({
            round: createRoundState(),
            trainingMode: false,
            hardcoreMode: false,
        });
        ctx.score = 1;
        expect(def.check(ctx)).toBe(true);
        ctx.score = 0;
        expect(def.check(ctx)).toBe(false);
    });

    it('hardcore hero exige hardcore et score >= 5', () => {
        const def = ACHIEVEMENTS.find(a => a.id === 'hardcore_hero');
        const ctx = buildMetaContext({
            round: createRoundState(),
            trainingMode: false,
            hardcoreMode: true,
        });
        ctx.score = 5;
        expect(def.check(ctx)).toBe(true);
        ctx.hardcore = false;
        expect(def.check(ctx)).toBe(false);
    });
});
