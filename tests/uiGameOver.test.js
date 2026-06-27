import { describe, it, expect, vi } from 'vitest';
import { buildGameOverUI } from '../src/uiGameOver.js';
import { createBaseScene } from './helpers/phaserMock.js';

describe('uiGameOver', () => {
    it('buildGameOverUI construit le panneau game over', () => {
        const scene = createBaseScene();
        const ui = {
            hideInGameScore: vi.fn(),
            createOverlay: vi.fn(() => ({ setAlpha: vi.fn(), destroy: vi.fn() })),
            highScore: 20,
            _currentDifficulty: 'normal',
            drawGameOverMenuButton: vi.fn(),
            _menuBtnGraphics: { destroy: vi.fn() },
        };
        const { elements } = buildGameOverUI(
            scene,
            ui,
            10,
            { entries: [{ score: 10, id: 'a' }], highlightId: 'a' },
            false,
            false,
        );
        expect(elements.length).toBeGreaterThan(5);
        expect(ui.drawGameOverMenuButton).toHaveBeenCalled();
    });
});
