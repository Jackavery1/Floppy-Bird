import { describe, it, expect } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import {
    UI_LAYOUT,
    GAME_OVER_PANEL,
    layoutX,
    layoutDiffButtonCenter,
} from '../src/uiLayout.js';

describe('uiLayout', () => {
    it('layoutX correspond au centre du canvas 288px', () => {
        expect(layoutX()).toBe(GAME_CONFIG.width / 2);
        expect(layoutX()).toBe(144);
    });

    it('place les boutons difficulté aux centres attendus', () => {
        const { diffBtn } = UI_LAYOUT;
        expect(layoutDiffButtonCenter(0)).toBe(diffBtn.x[0] + diffBtn.width / 2);
        expect(layoutDiffButtonCenter(1)).toBe(diffBtn.x[1] + diffBtn.width / 2);
        expect(layoutDiffButtonCenter(2)).toBe(diffBtn.x[2] + diffBtn.width / 2);
        expect(diffBtn.x).toEqual([32, 110, 188]);
        expect(diffBtn.width).toBe(68);
        expect(diffBtn.height).toBe(26);
    });

    it('panneau game over tient dans le canvas', () => {
        expect(GAME_OVER_PANEL.x).toBeGreaterThanOrEqual(0);
        expect(GAME_OVER_PANEL.y + GAME_OVER_PANEL.h).toBeLessThanOrEqual(GAME_CONFIG.height);
        expect(GAME_OVER_PANEL.x + GAME_OVER_PANEL.w).toBeLessThanOrEqual(GAME_CONFIG.width);
    });

    it('grille menu reste dans les limites verticales', () => {
        const { menu } = UI_LAYOUT;
        expect(menu.title).toBeGreaterThan(0);
        expect(menu.hint2).toBeLessThan(GAME_CONFIG.height);
    });
});
