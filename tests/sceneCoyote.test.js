import { describe, it, expect, vi } from 'vitest';
import {
    updateCoyoteTime,
    resetCoyoteTime,
    hasCoyoteGrace,
    updateCoyoteVisual,
} from '../src/sceneCoyote.js';
import { GAME_CONFIG } from '../src/config.js';
import { DESIGN_TOKENS, hexVersPhaser } from '../src/designTokens.js';
import { GAME_STATE } from '../src/gameState.js';
import { createRoundState } from '../src/roundState.js';
import { createBaseScene } from './helpers/phaserMock.js';

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

    it('updateCoyoteTime réduit le coyote en hardcore', () => {
        const scene = makeScene(true);
        scene.hardcoreMode = true;
        updateCoyoteTime(scene, 1);
        expect(scene.round.coyoteFrames).toBe(GAME_CONFIG.hardcore.coyoteTimeFrames);
        expect(scene.round.coyoteFrames).toBeLessThan(GAME_CONFIG.bird.coyoteTimeFrames);
    });

    it('updateCoyoteTime décrémente hors gap', () => {
        const scene = makeScene(false);
        scene.round.coyoteFrames = 4;
        scene.ui = {};
        updateCoyoteTime(scene, 1);
        expect(scene.round.coyoteFrames).toBe(3);
    });

    it('hasCoyoteGrace tant que des frames restent', () => {
        const scene = makeScene(false);
        scene.round.coyoteFrames = 1;
        expect(hasCoyoteGrace(scene)).toBe(true);
        scene.round.coyoteFrames = 0;
        expect(hasCoyoteGrace(scene)).toBe(false);
    });

    it('updateCoyoteVisual teinte l’oiseau pendant le coyote', () => {
        const scene = makeScene(false);
        scene.state = GAME_STATE.PLAYING;
        scene.bird.sprite = { setTint: vi.fn(), clearTint: vi.fn() };
        scene.ui = {
            scene: createBaseScene(),
            scoreText: { y: 68 },
            _inGameControlElements: [],
        };
        scene.round.coyoteFrames = 2;
        updateCoyoteVisual(scene);
        expect(scene.bird.sprite.setTint).toHaveBeenCalledWith(
            hexVersPhaser(DESIGN_TOKENS.teinteCoyoteActif)
        );

        scene.round.coyoteFrames = 0;
        updateCoyoteVisual(scene);
        expect(scene.bird.sprite.clearTint).toHaveBeenCalled();
    });
});
