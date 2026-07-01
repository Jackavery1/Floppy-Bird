import { describe, it, expect, vi } from 'vitest';
import { updateCoyoteTime, resetCoyoteTime, hasCoyoteGrace } from '../src/sceneCoyote.js';
import { GAME_CONFIG } from '../src/config.js';
import { createRoundState } from '../src/roundState.js';

describe('sceneCoyote', () => {
    function makeScene(inGap) {
        return {
            round: createRoundState(),
            bird: {
                x: 100,
                y: 180,
                getBounds: () => ({ x: 86, y: 170, width: 28, height: 20 }),
            },
            pipes: { isBirdInGap: vi.fn(() => inGap) },
        };
    }

    it('resetCoyoteTime remet à zéro', () => {
        const scene = makeScene(false);
        scene.round.coyoteFrames = 3;
        resetCoyoteTime(scene);
        expect(scene.round.coyoteFrames).toBe(0);
    });

    it('updateCoyoteTime recharge dans un gap', () => {
        const scene = makeScene(true);
        updateCoyoteTime(scene, 1);
        expect(scene.pipes.isBirdInGap).toHaveBeenCalledWith(scene.bird.getBounds());
        expect(scene.round.coyoteFrames).toBe(GAME_CONFIG.bird.coyoteTimeFrames);
    });

    it('updateCoyoteTime décrémente hors gap', () => {
        const scene = makeScene(false);
        scene.round.coyoteFrames = 3;
        updateCoyoteTime(scene, 1);
        expect(scene.round.coyoteFrames).toBe(2);
    });

    it('hasCoyoteGrace tant que des frames restent', () => {
        const scene = makeScene(false);
        scene.round.coyoteFrames = 1;
        expect(hasCoyoteGrace(scene)).toBe(true);
        scene.round.coyoteFrames = 0;
        expect(hasCoyoteGrace(scene)).toBe(false);
    });
});
