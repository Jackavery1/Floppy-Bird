import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('uiGameOverLoader', () => {
    beforeEach(async () => {
        vi.resetModules();
        const mod = await import('../src/ui/gameOver/uiGameOverLoader.js');
        mod.resetGameOverUILoaderForTests();
    });

    it('buildGameOverUI exige un préchargement', async () => {
        const { buildGameOverUI } = await import('../src/ui/gameOver/uiGameOverLoader.js');
        expect(() => buildGameOverUI()).toThrow(/preloaded/);
    });

    it('preloadGameOverUI charge buildGameOverUI', async () => {
        vi.doMock('../src/ui/gameOver/uiGameOver.js', () => ({
            buildGameOverUI: vi.fn(() => ({ elements: ['mock'] })),
        }));
        const loader = await import('../src/ui/gameOver/uiGameOverLoader.js');
        await loader.preloadGameOverUI();
        expect(loader.buildGameOverUI()).toEqual({ elements: ['mock'] });
    });
});
