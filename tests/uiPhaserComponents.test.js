import { describe, it, expect, vi } from 'vitest';
import {
    BIRD_COLLISION_INSET,
    drawPauseChrome,
    drawTokenPanel,
} from '../src/ui/shared/uiPhaserComponents.js';

describe('uiPhaserComponents', () => {
    it('documente les insets hitbox oiseau', () => {
        expect(BIRD_COLLISION_INSET).toEqual({ x: 3, y: 2 });
    });

    it('drawTokenPanel trace un panneau arrondi', () => {
        const g = {
            fillStyle: vi.fn(),
            fillRoundedRect: vi.fn(),
            lineStyle: vi.fn(),
            strokeRoundedRect: vi.fn(),
        };
        drawTokenPanel(g, 10, 20, 100, 80, 'fondPanneauGameOver', 'liseréGameOver', 8);
        expect(g.fillRoundedRect).toHaveBeenCalledWith(10, 20, 100, 80, 8);
        expect(g.strokeRoundedRect).toHaveBeenCalled();
    });

    it('drawPauseChrome dessine le bouton pause', () => {
        const g = {
            clear: vi.fn(),
            fillStyle: vi.fn(),
            fillRoundedRect: vi.fn(),
            fillRect: vi.fn(),
        };
        drawPauseChrome(g, 50, 60, 44, 0x37474f);
        expect(g.clear).toHaveBeenCalled();
        expect(g.fillRoundedRect).toHaveBeenCalled();
        expect(g.fillRect).toHaveBeenCalledTimes(2);
    });
});
