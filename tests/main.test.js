import { describe, it, expect, vi } from 'vitest';

vi.mock('../src/GameScene.js', () => ({
    GameScene: class GameScene {},
}));

vi.mock('phaser', () => {
    const Phaser = {
        AUTO: 'AUTO',
        Scale: { NONE: 0, NO_CENTER: 0 },
        Scene: class Scene {},
        Game: vi.fn(function Game() {
            this.events = {
                once: vi.fn((event, cb) => {
                    if (event === 'ready') cb();
                }),
            };
        }),
    };
    return { default: Phaser };
});

const onGameReady = vi.fn();
vi.mock('../src/appBootstrap.js', () => ({ onGameReady }));

describe('main', () => {
    it('bootstrap Phaser et enregistre onGameReady', async () => {
        vi.resetModules();
        const Phaser = (await import('phaser')).default;
        await import('../src/main.js');
        expect(Phaser.Game).toHaveBeenCalled();
        expect(onGameReady).toHaveBeenCalled();
    }, 10_000);
});
