import { describe, it, expect, vi, afterEach } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';

describe('appBootstrap', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('resizeGameCanvas applique le letterbox au canvas', async () => {
        vi.stubGlobal('window', {
            innerWidth: 800,
            innerHeight: 600,
            visualViewport: null,
        });
        vi.stubGlobal('document', {
            body: { style: { paddingTop: '0', paddingRight: '0', paddingBottom: '0', paddingLeft: '0' } },
        });
        vi.stubGlobal('getComputedStyle', () => ({
            paddingTop: '0',
            paddingRight: '0',
            paddingBottom: '0',
            paddingLeft: '0',
        }));

        const canvas = { width: 0, height: 0, style: {} };
        const { resizeGameCanvas } = await import('../src/appBootstrap.js');
        const result = resizeGameCanvas({ canvas });

        expect(canvas.width).toBe(GAME_CONFIG.width);
        expect(canvas.height).toBe(GAME_CONFIG.height);
        expect(result.targetW).toBeGreaterThan(0);
        expect(result.targetH).toBeGreaterThan(0);
    });

    it('hideLoadingScreen masque le chargement et marque le document', async () => {
        const loading = { classList: { add: vi.fn() } };
        const doc = {
            getElementById: vi.fn(() => loading),
            documentElement: { classList: { add: vi.fn() } },
        };
        const { hideLoadingScreen } = await import('../src/appBootstrap.js');
        hideLoadingScreen(doc);

        expect(loading.classList.add).toHaveBeenCalledWith('hidden');
        expect(doc.documentElement.classList.add).toHaveBeenCalledWith('game-ready');
    });

    it('onGameReady enchaîne resize, listeners et masquage', async () => {
        const addListener = vi.fn();
        vi.stubGlobal('window', {
            innerWidth: 390,
            innerHeight: 844,
            addEventListener: addListener,
            visualViewport: { addEventListener: addListener },
        });
        const loading = { classList: { add: vi.fn() } };
        vi.stubGlobal('document', {
            getElementById: vi.fn(() => loading),
            documentElement: { classList: { add: vi.fn() } },
            body: { style: {} },
        });
        vi.stubGlobal('getComputedStyle', () => ({
            paddingTop: '0', paddingRight: '0', paddingBottom: '0', paddingLeft: '0',
        }));

        const game = { canvas: { width: 0, height: 0, style: {} } };
        const { onGameReady } = await import('../src/appBootstrap.js');
        onGameReady(game);

        expect(addListener).toHaveBeenCalled();
        expect(loading.classList.add).toHaveBeenCalledWith('hidden');
    });
});
