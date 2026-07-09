import { describe, it, expect, vi } from 'vitest';
import { scheduleRemainingBirdTextures } from '../src/uiMenuSkinsTextures.js';

vi.mock('../src/textures/index.js', () => ({
    ensureBirdTextures: vi.fn(),
}));

describe('uiMenuSkinsTextures', () => {
    it('charge les textures manquantes par lots', async () => {
        const { ensureBirdTextures } = await import('../src/textures/index.js');
        const delayed = [];
        const scene = {
            textures: { exists: vi.fn((key) => key === 'bird-sheet-classic') },
            time: {
                delayedCall: vi.fn((_ms, cb) => {
                    delayed.push(cb);
                    return { remove: vi.fn() };
                }),
            },
        };
        scheduleRemainingBirdTextures(scene, [
            'classic',
            'neon',
            'retro',
            'gold',
            'pixel',
            'ember',
        ]);
        expect(ensureBirdTextures).toHaveBeenCalledWith(scene, ['neon', 'retro', 'gold', 'pixel']);
        expect(delayed.length).toBe(1);
        delayed[0]();
        expect(ensureBirdTextures).toHaveBeenNthCalledWith(2, scene, ['ember']);
    });

    it('ignore si toutes les textures existent déjà', async () => {
        const { ensureBirdTextures } = await import('../src/textures/index.js');
        vi.mocked(ensureBirdTextures).mockClear();
        const scene = {
            textures: { exists: vi.fn(() => true) },
            time: { delayedCall: vi.fn() },
        };
        scheduleRemainingBirdTextures(scene, ['classic', 'neon']);
        expect(ensureBirdTextures).not.toHaveBeenCalled();
        expect(scene.time.delayedCall).not.toHaveBeenCalled();
    });
});
