import { describe, it, expect } from 'vitest';
import { createRoundState } from '../src/roundState.js';

describe('roundState', () => {
    it('resetForRound remet les champs de manche', () => {
        const round = createRoundState();
        round.score = 12;
        round.recordNotified = true;
        round.isNewRecord = true;
        round.coyoteFrames = 3;
        round.dyingFalling = true;
        round.resetForRound();
        expect(round.score).toBe(0);
        expect(round.recordNotified).toBe(false);
        expect(round.isNewRecord).toBe(false);
        expect(round.coyoteFrames).toBe(0);
        expect(round.dyingFalling).toBe(false);
    });

    it('resetDeathAnimation remet l’animation de chute', () => {
        const round = createRoundState();
        round.dyingFalling = true;
        round.dyingGrounded = true;
        round.resetDeathAnimation();
        expect(round.dyingFalling).toBe(false);
        expect(round.dyingGrounded).toBe(false);
    });
});
