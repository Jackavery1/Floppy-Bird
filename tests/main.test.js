import { describe, it, expect, vi } from 'vitest';

const Phaser = { AUTO: 'AUTO' };
const initGame = vi.fn();
const onGameReady = vi.fn();
const ensureTitleFontLoaded = vi.fn(async () => {});

vi.mock('phaser', () => ({ default: Phaser }));
vi.mock('../src/phaserBootstrap.js', () => ({ initGame, showBootFailure: vi.fn() }));
vi.mock('../src/appBootstrap.js', () => ({ onGameReady, ensureTitleFontLoaded }));

describe('main', () => {
    it('bootstrap Phaser et enregistre onGameReady', async () => {
        vi.resetModules();
        await import('../src/main.js');
        expect(ensureTitleFontLoaded).toHaveBeenCalled();
        expect(initGame).toHaveBeenCalledWith(Phaser, onGameReady);
    }, 10_000);
});
