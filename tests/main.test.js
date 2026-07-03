import { describe, it, expect, vi } from 'vitest';

const Phaser = { AUTO: 'AUTO' };
const initGame = vi.fn();
const onGameReady = vi.fn();

vi.mock('phaser', () => ({ default: Phaser }));
vi.mock('../src/phaserBootstrap.js', () => ({ initGame }));
vi.mock('../src/appBootstrap.js', () => ({ onGameReady }));

describe('main', () => {
    it('bootstrap Phaser et enregistre onGameReady', async () => {
        vi.resetModules();
        await import('../src/main.js');
        expect(initGame).toHaveBeenCalledWith(Phaser, onGameReady);
    });
});
