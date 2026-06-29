import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';

vi.mock('../src/GameScene.js', () => ({
    GameScene: class GameScene {},
}));

describe('phaserBootstrap', () => {
    let Phaser;
    let onReady;

    beforeEach(() => {
        vi.resetModules();
        onReady = vi.fn();
        Phaser = {
            AUTO: 'AUTO',
            Scale: { NONE: 0, NO_CENTER: 0 },
            Game: vi.fn(function Game() {
                this.events = {
                    once: vi.fn((event, cb) => {
                        if (event === 'ready') cb();
                    }),
                };
            }),
        };
    });

    it('createPhaserGameConfig expose les dimensions du jeu', async () => {
        const { createPhaserGameConfig } = await import('../src/phaserBootstrap.js');
        const config = createPhaserGameConfig(Phaser);
        expect(config.width).toBe(GAME_CONFIG.width);
        expect(config.height).toBe(GAME_CONFIG.height);
        expect(config.parent).toBe('game-container');
    });

    it('initGame instancie Phaser et appelle onReady', async () => {
        const { initGame } = await import('../src/phaserBootstrap.js');
        const game = initGame(Phaser, onReady);
        expect(Phaser.Game).toHaveBeenCalled();
        expect(onReady).toHaveBeenCalledWith(game);
    });
});
