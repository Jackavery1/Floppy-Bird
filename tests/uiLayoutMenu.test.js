import { describe, it, expect } from 'vitest';
import { computeMenuLayout, UI_LAYOUT, MIN_TOUCH } from '../src/uiLayout.js';
import { GAME_CONFIG } from '../src/config.js';

describe('uiLayout menu', () => {
    it('computeMenuLayout expose le menu principal épuré', () => {
        const layout = computeMenuLayout();
        expect(layout.title).toBe(UI_LAYOUT.menu.title);
        expect(layout.difficulty).toBeLessThan(layout.start);
        expect(layout.menuRow).toBeGreaterThan(layout.start);
        expect(layout.hint1).toBeLessThanOrEqual(GAME_CONFIG.height - 4);
    });

    it('les panneaux scores, options et skins tiennent dans le canvas', () => {
        const { optionsPanel, scoresPanel, skinsPanel } = UI_LAYOUT;
        expect(optionsPanel.hint2).toBeLessThanOrEqual(GAME_CONFIG.height - 8);
        expect(scoresPanel.scoresAchievements).toBeLessThanOrEqual(GAME_CONFIG.height - 8);
        expect(skinsPanel.skinsHint).toBeLessThanOrEqual(GAME_CONFIG.height - 8);
        expect(optionsPanel.training - optionsPanel.hintLine).toBeGreaterThanOrEqual(32);
        expect(skinsPanel.panelTop + skinsPanel.panelH).toBeLessThanOrEqual(GAME_CONFIG.height - 8);
    });

    it('les zones tactiles du menu ne se chevauchent pas', () => {
        const { menu } = UI_LAYOUT;
        const diffBottom = menu.difficulty + MIN_TOUCH / 2;
        const dailyTop = menu.dailyBtn - MIN_TOUCH / 2;
        expect(dailyTop).toBeGreaterThanOrEqual(diffBottom);
        const menuRowBottom = menu.menuRow + MIN_TOUCH / 2;
        const hintTop = menu.hint1 - 16;
        expect(hintTop).toBeGreaterThanOrEqual(menuRowBottom);
    });

    it('la rangée SCORES · OPTIONS · SKINS est centrée', () => {
        const { scoresBtn, optionsBtn, skinsBtn, menuBtnW } = UI_LAYOUT.menu;
        expect(optionsBtn).toBe(GAME_CONFIG.centerX);
        expect(scoresBtn).toBeLessThan(optionsBtn);
        expect(skinsBtn).toBeGreaterThan(optionsBtn);
        expect(menuBtnW).toBe(MIN_TOUCH * 2);
        const half = menuBtnW / 2;
        expect(scoresBtn - half).toBeGreaterThanOrEqual(0);
        expect(skinsBtn + half).toBeLessThanOrEqual(GAME_CONFIG.width);
    });

    it('les boutons RETOUR des panneaux sont hors de la bande tactile de menuRow', () => {
        const band = [
            UI_LAYOUT.menu.menuRow - MIN_TOUCH / 2,
            UI_LAYOUT.menu.menuRow + MIN_TOUCH / 2,
        ];
        const closeButtons = [
            UI_LAYOUT.optionsPanel.closeBtn,
            UI_LAYOUT.scoresPanel.closeBtn,
            UI_LAYOUT.skinsPanel.closeBtn,
        ];
        closeButtons.forEach((y) => {
            const outside = y + MIN_TOUCH / 2 < band[0] || y - MIN_TOUCH / 2 > band[1];
            expect(outside).toBe(true);
        });
    });
});
