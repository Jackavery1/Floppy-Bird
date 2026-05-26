import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';
import { DIFFICULTY } from '../src/gameConstants.js';

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

describe('GameScene (smoke)', () => {
    beforeEach(() => {
        vi.resetModules();
    });

    it('démarre en état MENU avec difficulté normal', async () => {
        const { GameScene } = await import('../src/GameScene.js');
        const scene = new GameScene();
        expect(scene.state).toBe(GAME_STATE.MENU);
        expect(scene.score).toBe(0);
        expect(scene.difficulty).toBe(DIFFICULTY.NORMAL);
    });

    it('expose _frameStep comme fonction', async () => {
        const { GameScene } = await import('../src/GameScene.js');
        const scene = new GameScene();
        expect(typeof scene._frameStep).toBe('function');
    });
});
