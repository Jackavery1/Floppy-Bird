import { describe, it, expect, vi } from 'vitest';
import { buildGameOverUI } from '../src/uiGameOver.js';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn((scene, config) => {
        config.onUpdate?.();
        config.onComplete?.();
    }),
    prefersReducedMotion: vi.fn(() => false),
}));

function makeUi(overrides = {}) {
    return {
        hideInGameScore: vi.fn(),
        createOverlay: vi.fn(() => ({ setAlpha: vi.fn(), destroy: vi.fn() })),
        highScore: 20,
        _currentDifficulty: 'normal',
        drawGameOverMenuButton: vi.fn(),
        drawGameOverRestartButton: vi.fn(),
        _menuBtnGraphics: { destroy: vi.fn() },
        _restartBtnGraphics: { destroy: vi.fn() },
        ...overrides,
    };
}

describe('uiGameOver', () => {
    it('buildGameOverUI construit le panneau game over', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const { elements } = buildGameOverUI(
            scene,
            ui,
            10,
            { entries: [{ score: 10, id: 'a', skinId: 'classic' }], highlightId: 'a' },
            false,
            false
        );
        expect(elements.length).toBeGreaterThan(5);
        expect(ui.drawGameOverRestartButton).toHaveBeenCalled();
        expect(ui.drawGameOverMenuButton).toHaveBeenCalled();
    });

    it('buildGameOverUI affiche le récap daily sans TOP 5', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const { elements } = buildGameOverUI(
            scene,
            ui,
            8,
            { entries: [], highlightId: null },
            false,
            false,
            false,
            10
        );
        expect(elements.length).toBeGreaterThan(5);
    });

    it('classement commun (skin classique) : affiche une icône par entrée', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const rectCallsBefore = scene.add.rectangle.mock.calls.length;
        buildGameOverUI(
            scene,
            ui,
            10,
            {
                entries: [
                    { score: 48, id: 'a', skinId: 'ruby' },
                    { score: 34, id: 'b', skinId: 'ocean' },
                ],
                highlightId: null,
            },
            false,
            false,
            false,
            0,
            'classic'
        );
        expect(scene.add.rectangle.mock.calls.length).toBeGreaterThan(rectCallsBefore + 1);
    });

    it('buildGameOverUI affiche la cause de mort', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        buildGameOverUI(
            scene,
            ui,
            5,
            { entries: [], highlightId: null },
            false,
            false,
            false,
            0,
            'classic',
            'pipe'
        );
        const texts = scene.add.text.mock.calls.map((call) => call[2]);
        expect(texts).toContain('Collision tuyau');
    });

    it('skin spécial : classement dédié titré avec le nom du skin, sans icône par entrée', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        buildGameOverUI(
            scene,
            ui,
            40,
            { entries: [{ score: 40, id: 'a', skinId: 'cosmos' }], highlightId: null },
            false,
            false,
            false,
            0,
            'cosmos'
        );
        const titles = scene.add.text.mock.calls.map((call) => call[2]);
        expect(titles.some((t) => t.includes('COSMOS'))).toBe(true);
    });

    it('fadeIn anime le score depuis zéro', async () => {
        const { sceneTween } = await import('../src/motion.js');
        const scene = createBaseScene();
        const ui = makeUi();
        buildGameOverUI(scene, ui, 7, { entries: [], highlightId: null }, true, false);
        expect(sceneTween).toHaveBeenCalled();
        const scoreTween = sceneTween.mock.calls.find(([, cfg]) => cfg.targets?.v != null);
        expect(scoreTween).toBeTruthy();
    });

    it('nouveau record sans fadeIn déclenche les confettis', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const rectBefore = scene.add.rectangle.mock.calls.length;
        buildGameOverUI(scene, ui, 25, { entries: [], highlightId: null }, false, true);
        expect(scene.add.rectangle.mock.calls.length).toBeGreaterThan(rectBefore);
    });

    it('hardcore affiche HC dans le libellé record spécial', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        buildGameOverUI(
            scene,
            ui,
            15,
            { entries: [], highlightId: null },
            false,
            false,
            true,
            0,
            'cosmos'
        );
        const texts = scene.add.text.mock.calls.map((call) => call[2]);
        expect(texts.some((t) => String(t).includes('HC'))).toBe(true);
    });
});
