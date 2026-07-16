import { describe, it, expect } from 'vitest';
import {
    isHardcoreUnlocked,
    HARDCORE_UNLOCK_HINT,
    HARDCORE_UNLOCK_SCORE,
} from '../src/hardcoreUnlock.js';

describe('hardcoreUnlock', () => {
    it(`reste verrouillé sous le seuil (${HARDCORE_UNLOCK_SCORE})`, () => {
        expect(isHardcoreUnlocked({ bestScoreAny: HARDCORE_UNLOCK_SCORE - 1 })).toBe(false);
    });

    it(`se débloque à ${HARDCORE_UNLOCK_SCORE} points`, () => {
        expect(isHardcoreUnlocked({ bestScoreAny: HARDCORE_UNLOCK_SCORE })).toBe(true);
    });

    it('expose un hint lisible', () => {
        expect(HARDCORE_UNLOCK_HINT).toMatch(String(HARDCORE_UNLOCK_SCORE));
    });
});
