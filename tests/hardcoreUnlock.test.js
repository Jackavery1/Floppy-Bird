import { describe, it, expect } from 'vitest';
import { isHardcoreUnlocked, HARDCORE_UNLOCK_HINT } from '../src/hardcoreUnlock.js';

describe('hardcoreUnlock', () => {
    it('reste verrouillé sous le seuil', () => {
        expect(isHardcoreUnlocked({ bestScoreAny: 9 })).toBe(false);
    });

    it('se débloque à 10 points', () => {
        expect(isHardcoreUnlocked({ bestScoreAny: 10 })).toBe(true);
    });

    it('expose un hint lisible', () => {
        expect(HARDCORE_UNLOCK_HINT).toMatch(/10/);
    });
});
