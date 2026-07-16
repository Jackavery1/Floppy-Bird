import { describe, it, expect } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import { STAR_POSITIONS } from '../src/textures/backgroundTextures.js';

describe('backgroundTextures', () => {
    it('positions étoiles décoratives — [248, 112] est une coordonnée ciel, pas un gap', () => {
        const pipeGap = GAME_CONFIG.getDifficulty('normal').gap;
        expect(pipeGap).toBe(100);
        const star248 = STAR_POSITIONS.find(([x]) => x === 248);
        expect(star248).toEqual([248, 112]);
        expect(star248[1]).not.toBe(pipeGap);
        for (const [x, y] of STAR_POSITIONS) {
            expect(x).toBeGreaterThanOrEqual(0);
            expect(x).toBeLessThanOrEqual(GAME_CONFIG.width);
            expect(y).toBeGreaterThanOrEqual(0);
            expect(y).toBeLessThanOrEqual(GAME_CONFIG.height);
        }
    });
});
