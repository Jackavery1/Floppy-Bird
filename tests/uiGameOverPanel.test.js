import { describe, it, expect, vi } from 'vitest';
import { buildGameOverShell } from '../src/uiGameOverPanel.js';
import { GAME_OVER_PANEL } from '../src/uiLayout.js';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/uiGameOverDecor.js', () => ({
    drawPlaqueCorners: vi.fn(),
}));

describe('uiGameOverPanel', () => {
    it('buildGameOverShell crée overlay et panneau', () => {
        const scene = createBaseScene();
        const ui = {
            createOverlay: vi.fn(() => ({ setDepth: vi.fn() })),
        };
        const result = buildGameOverShell(scene, ui);
        expect(ui.createOverlay).toHaveBeenCalledWith(0.75, expect.any(Number));
        expect(scene.add.graphics).toHaveBeenCalled();
        expect(result.cx).toBe(GAME_OVER_PANEL.x + GAME_OVER_PANEL.w / 2);
        expect(result.P).toBe(GAME_OVER_PANEL);
    });
});
