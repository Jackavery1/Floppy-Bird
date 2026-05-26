import { describe, it, expect } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';

describe('GAME_STATE', () => {
    it('expose des constantes uniques', () => {
        const values = Object.values(GAME_STATE);
        expect(new Set(values).size).toBe(values.length);
    });

    it('est figé', () => {
        expect(() => { GAME_STATE.MENU = 'hack'; }).toThrow();
    });
});
