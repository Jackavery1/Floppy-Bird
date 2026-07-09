import { describe, it, expect, vi } from 'vitest';
import { createPipeSprite, spawnPipePairAtGap } from '../src/pipeSpawn.js';
import { GAME_CONFIG } from '../src/config.js';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/textures/pipeTextures.js', () => ({
    ensurePipeTextures: vi.fn(),
}));

describe('pipeSpawn', () => {
    it('createPipeSprite positionne un tuyau à droite du canvas', () => {
        const scene = createBaseScene();
        const pipe = createPipeSprite(scene, {
            texture: 'pipe-top',
            originY: 1,
            y: 120,
            pipeWidth: 40,
            pipeHeight: 600,
        });
        expect(scene.add.sprite).toHaveBeenCalled();
        expect(pipe.setDisplaySize).toHaveBeenCalledWith(40, 600);
        expect(pipe.setOrigin).toHaveBeenCalledWith(0.5, 1);
    });

    it('spawnPipePairAtGap ajoute une paire haut/bas', () => {
        const scene = createBaseScene();
        const state = {
            pipeGap: GAME_CONFIG.getDifficulty('normal').gap,
            pipeWidth: 40,
            pipeHeight: 600,
            topPipes: [],
            bottomPipes: [],
        };
        spawnPipePairAtGap(scene, state, 256);
        expect(state.topPipes).toHaveLength(1);
        expect(state.bottomPipes).toHaveLength(1);
        expect(state.topPipes[0].scored).toBe(false);
    });
});
