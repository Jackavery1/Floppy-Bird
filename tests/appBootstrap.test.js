import { describe, it, expect, vi, afterEach } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import { computeLetterboxSize } from '../src/viewport.js';

vi.mock('../src/uiDomAccessibility.js', () => ({
    initAccessibilityLayer: vi.fn(),
    syncAccessibilityLayer: vi.fn(),
    bindAccessibilityAction: vi.fn(),
    setAccessibilityControlVisible: vi.fn(),
    setupMenuAccessibility: vi.fn(),
    announceAccessibility: vi.fn(),
    hideAllAccessibilityControls: vi.fn(),
}));

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
            body: { clientWidth: 800, clientHeight: 600, style: {} },
        });
        vi.stubGlobal('getComputedStyle', () => ({
            paddingTop: '0',
            paddingRight: '0',
            paddingBottom: '0',
            paddingLeft: '0',
        }));

        const canvas = { width: 0, height: 0, style: {}, parentElement: { style: {} } };
        const { resizeGameCanvas } = await import('../src/appBootstrap.js');
        const result = resizeGameCanvas({ canvas });

        expect(canvas.width).toBe(GAME_CONFIG.width);
        expect(canvas.height).toBe(GAME_CONFIG.height);
        expect(result.targetW).toBeGreaterThan(0);
        expect(result.targetH).toBeGreaterThan(0);
    });

    it('resizeGameCanvas letterbox sur le client body', async () => {
        vi.stubGlobal('window', {
            innerWidth: 390,
            innerHeight: 844,
            visualViewport: { width: 390, height: 844, offsetTop: 0, offsetLeft: 0 },
        });
        vi.stubGlobal('document', {
            body: {
                clientWidth: 390,
                clientHeight: 766,
                style: { paddingTop: '44px', paddingBottom: '34px' },
            },
        });
        vi.stubGlobal('getComputedStyle', () => ({
            paddingTop: '44',
            paddingRight: '0',
            paddingBottom: '34',
            paddingLeft: '0',
        }));

        const canvas = { width: 0, height: 0, style: {}, parentElement: { style: {} } };
        const { resizeGameCanvas } = await import('../src/appBootstrap.js');
        const result = resizeGameCanvas({ canvas });
        const expectedH = computeLetterboxSize(
            390,
            766,
            GAME_CONFIG.width,
            GAME_CONFIG.height
        ).height;
        expect(result.targetH).toBe(expectedH);
    });

    it('resizeGameCanvas réduit le letterbox quand visualViewport rétrécit (clavier)', async () => {
        vi.stubGlobal('window', {
            innerWidth: 390,
            innerHeight: 844,
            visualViewport: { width: 390, height: 620, offsetTop: 22, offsetLeft: 0 },
        });
        vi.stubGlobal('document', {
            body: { clientWidth: 390, clientHeight: 844, style: {} },
        });
        vi.stubGlobal('getComputedStyle', () => ({
            paddingTop: '0',
            paddingRight: '0',
            paddingBottom: '0',
            paddingLeft: '0',
        }));

        const container = { style: {} };
        const canvas = { width: 0, height: 0, style: {}, parentElement: container };
        const { resizeGameCanvas } = await import('../src/appBootstrap.js');
        const result = resizeGameCanvas({ canvas });
        const expectedH = computeLetterboxSize(
            390,
            620,
            GAME_CONFIG.width,
            GAME_CONFIG.height
        ).height;
        expect(result.targetH).toBe(expectedH);
        expect(container.style.top).toBe('22px');
        expect(parseFloat(container.style.left)).toBeGreaterThanOrEqual(0);
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

    it('onGameReady synchronise le thème shell puis masque le chargement', async () => {
        vi.stubEnv('DEV', false);
        vi.stubEnv('VITE_ENABLE_TEST_SEAM', '');
        const addListener = vi.fn();
        vi.stubGlobal('window', {
            innerWidth: 390,
            innerHeight: 844,
            addEventListener: addListener,
            visualViewport: { addEventListener: addListener },
        });
        const loading = { classList: { add: vi.fn() } };
        const rootStyle = { setProperty: vi.fn() };
        vi.stubGlobal('document', {
            getElementById: vi.fn(() => loading),
            documentElement: { style: rootStyle, classList: { add: vi.fn() } },
            body: { clientWidth: 390, clientHeight: 844, style: {} },
            querySelector: vi.fn(() => ({ setAttribute: vi.fn() })),
        });
        vi.stubGlobal('getComputedStyle', () => ({
            paddingTop: '0',
            paddingRight: '0',
            paddingBottom: '0',
            paddingLeft: '0',
        }));

        const game = { canvas: { width: 0, height: 0, style: {}, parentElement: { style: {} } } };
        const { onGameReady } = await import('../src/appBootstrap.js');
        onGameReady(game);

        expect(rootStyle.setProperty).toHaveBeenCalled();
        expect(addListener).toHaveBeenCalled();
        expect(loading.classList.add).toHaveBeenCalledWith('hidden');
    });

    it('shouldInstallTestSeam est false sans DEV ni VITE_ENABLE_TEST_SEAM', async () => {
        vi.stubEnv('DEV', false);
        vi.stubEnv('VITE_ENABLE_TEST_SEAM', '');
        const { shouldInstallTestSeam } = await import('../src/appBootstrap.js');
        expect(shouldInstallTestSeam()).toBe(false);
    });

    it('shouldInstallTestSeam est true avec VITE_ENABLE_TEST_SEAM', async () => {
        vi.stubEnv('DEV', false);
        vi.stubEnv('VITE_ENABLE_TEST_SEAM', 'true');
        const { shouldInstallTestSeam } = await import('../src/appBootstrap.js');
        expect(shouldInstallTestSeam()).toBe(true);
    });
});
