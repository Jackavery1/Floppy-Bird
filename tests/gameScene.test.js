import { describe, it, expect, vi } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { DIFFICULTY } from '../src/config.js';

vi.mock('phaser', () => {
    class Scene {
        constructor(config) {
            this.sys = { settings: config };
        }
    }
    return {
        default: {
            Scene,
            AUTO: 0,
            Scale: { NONE: 0, NO_CENTER: 0 },
        },
    };
});

vi.mock('../src/proceduralTextures.js', () => ({
    preloadTextures: vi.fn(),
}));

vi.mock('../src/sceneSetup.js', () => ({
    setupSceneWorld: vi.fn(),
}));

vi.mock('../src/sceneDeath.js', () => ({
    triggerDeath: vi.fn(),
    updateDying: vi.fn(),
}));

vi.mock('../src/trainingStorage.js', () => ({
    loadTrainingEnabled: vi.fn(() => false),
}));

describe('GameScene', () => {
    it('démarre en état MENU avec difficulté normal', async () => {
        const { GameScene } = await import('../src/GameScene.js');
        const scene = new GameScene();
        expect(scene.state).toBe(GAME_STATE.MENU);
        expect(scene.difficulty).toBe(DIFFICULTY.NORMAL);
    });

    it('preload charge les textures', async () => {
        const { preloadTextures } = await import('../src/proceduralTextures.js');
        const { GameScene } = await import('../src/GameScene.js');
        const scene = new GameScene();
        scene.preload();
        expect(preloadTextures).toHaveBeenCalledWith(scene);
    });

    it('create initialise le monde', async () => {
        const { setupSceneWorld } = await import('../src/sceneSetup.js');
        const { GameScene } = await import('../src/GameScene.js');
        const scene = new GameScene();
        scene.create();
        expect(setupSceneWorld).toHaveBeenCalledWith(scene);
    });

    it('délègue triggerDeath au module sceneDeath', async () => {
        const { triggerDeath } = await import('../src/sceneDeath.js');
        const { GameScene } = await import('../src/GameScene.js');
        const scene = new GameScene();
        scene.triggerDeath();
        expect(triggerDeath).toHaveBeenCalledWith(scene);
    });
});
