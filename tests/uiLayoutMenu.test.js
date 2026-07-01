import { describe, it, expect } from 'vitest';
import { computeMenuLayout, UI_LAYOUT } from '../src/uiLayout.js';
import { GAME_CONFIG } from '../src/config.js';

describe('uiLayout menu', () => {
    it('computeMenuLayout expose le menu principal épuré', () => {
        const layout = computeMenuLayout();
        expect(layout.title).toBe(UI_LAYOUT.menu.title);
        expect(layout.difficulty).toBeLessThan(layout.start);
        expect(layout.optionsBtn).toBeGreaterThan(layout.start);
        expect(layout.hint1).toBeLessThanOrEqual(GAME_CONFIG.height - 8);
    });

    it('le panneau options tient dans le canvas', () => {
        const panel = UI_LAYOUT.optionsPanel;
        expect(panel.hint2).toBeLessThanOrEqual(GAME_CONFIG.height - 8);
        expect(panel.training - panel.daily).toBeGreaterThanOrEqual(36);
    });
});
