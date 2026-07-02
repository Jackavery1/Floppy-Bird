import { describe, it, expect, vi } from 'vitest';
import { buildGameOverUI } from '../src/uiGameOver.js';
import { createBaseScene } from './helpers/phaserMock.js';

function makeUi(overrides = {}) {
    return {
        hideInGameScore: vi.fn(),
        createOverlay: vi.fn(() => ({ setAlpha: vi.fn(), destroy: vi.fn() })),
        highScore: 20,
        _currentDifficulty: 'normal',
        drawGameOverMenuButton: vi.fn(),
        _menuBtnGraphics: { destroy: vi.fn() },
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
            false,
        );
        expect(elements.length).toBeGreaterThan(5);
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
            10,
        );
        expect(elements.length).toBeGreaterThan(5);
    });

    it('classement commun (skin classique) : affiche une icône par entrée', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        const rectCallsBefore = scene.add.rectangle.mock.calls.length;
        buildGameOverUI(
            scene, ui, 10,
            {
                entries: [
                    { score: 48, id: 'a', skinId: 'ruby' },
                    { score: 34, id: 'b', skinId: 'ocean' },
                ],
                highlightId: null,
            },
            false, false, false, 0, 'classic',
        );
        expect(scene.add.rectangle.mock.calls.length).toBeGreaterThan(rectCallsBefore + 1);
    });

    it('skin spécial : classement dédié titré avec le nom du skin, sans icône par entrée', () => {
        const scene = createBaseScene();
        const ui = makeUi();
        buildGameOverUI(
            scene, ui, 40,
            { entries: [{ score: 40, id: 'a', skinId: 'cosmos' }], highlightId: null },
            false, false, false, 0, 'cosmos',
        );
        const titles = scene.add.text.mock.calls.map(call => call[2]);
        expect(titles.some(t => t.includes('COSMOS'))).toBe(true);
    });
});
