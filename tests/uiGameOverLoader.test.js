import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('uiGameOverLoader', () => {
    beforeEach(async () => {
        vi.resetModules();
        const mod = await import('../src/uiGameOverLoader.js');
        mod.resetGameOverUILoaderForTests();
    });

    it('buildGameOverUI exige un préchargement', async () => {
        const { buildGameOverUI } = await import('../src/uiGameOverLoader.js');
        expect(() => buildGameOverUI()).toThrow(/preloaded/);
    });

    it('preloadGameOverUI charge buildGameOverUI', async () => {
        vi.doMock('../src/uiGameOver.js', () => ({
            buildGameOverUI: vi.fn(() => ({ elements: ['mock'] })),
        }));
        const loader = await import('../src/uiGameOverLoader.js');
        await loader.preloadGameOverUI();
        expect(loader.buildGameOverUI()).toEqual({ elements: ['mock'] });
    });
});
