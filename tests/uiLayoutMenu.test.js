import { describe, it, expect } from 'vitest';
import {
    computeMenuLayout,
    UI_LAYOUT,
    MIN_TOUCH,
    MIN_CTA_TOUCH,
    MENU_SECONDARY_HIT,
    TOUCH_TARGETS,
    panelCloseBtnY,
    PANEL_CLOSE_INSET,
    SPACING,
    GAME_OVER_PANEL,
    gameOverMenuBtnY,
    gameOverRestartBtnY,
} from '../src/ui/shared/uiLayout.js';
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
        expect(optionsPanel.panelTop + optionsPanel.panelH).toBeLessThanOrEqual(
            GAME_CONFIG.height - 8
        );
        expect(optionsPanel.closeBtn + MIN_TOUCH / 2).toBeLessThanOrEqual(GAME_CONFIG.height - 4);
        const lastControlY = optionsPanel.controlsFirst + 7 * optionsPanel.controlsGap;
        expect(lastControlY).toBeLessThanOrEqual(GAME_CONFIG.height - 8);
        expect(scoresPanel.scoresAchievements).toBeLessThanOrEqual(GAME_CONFIG.height - 8);
        expect(skinsPanel.closeBtn).toBeLessThanOrEqual(GAME_CONFIG.height - 8);
        expect(optionsPanel.hardcore - optionsPanel.training).toBeGreaterThanOrEqual(44);
        expect(skinsPanel.panelTop + skinsPanel.panelH).toBeLessThanOrEqual(GAME_CONFIG.height - 8);
    });

    it('les zones tactiles du menu ne se chevauchent pas', () => {
        const { menu } = UI_LAYOUT;
        const diffBottom = menu.difficulty + MIN_TOUCH / 2;
        const startTop = menu.start - MIN_CTA_TOUCH / 2;
        expect(startTop).toBeGreaterThanOrEqual(diffBottom);
        const dailyBottom = menu.dailyBtn + MIN_TOUCH / 2;
        const menuRowTop = menu.menuRow - MENU_SECONDARY_HIT / 2;
        expect(menuRowTop).toBeGreaterThanOrEqual(dailyBottom + 8);
        const menuRowBottom = menu.menuRow + MENU_SECONDARY_HIT / 2;
        const hintTop = menu.hint1 - 16;
        expect(hintTop).toBeGreaterThanOrEqual(menuRowBottom);
    });

    it('la rangée SCORES · OPT. · STYLE est centrée', () => {
        const { scoresBtn, optionsBtn, skinsBtn, menuBtnW } = UI_LAYOUT.menu;
        expect(optionsBtn).toBe(GAME_CONFIG.centerX);
        expect(scoresBtn).toBeLessThan(optionsBtn);
        expect(skinsBtn).toBeGreaterThan(optionsBtn);
        expect(menuBtnW).toBeGreaterThanOrEqual(MIN_TOUCH);
        const half = menuBtnW / 2;
        expect(scoresBtn - half).toBeGreaterThanOrEqual(0);
        expect(skinsBtn + half).toBeLessThanOrEqual(GAME_CONFIG.width);
        expect(optionsBtn - scoresBtn).toBeGreaterThan(menuBtnW);
        expect(skinsBtn - optionsBtn).toBeGreaterThan(menuBtnW);
    });

    it('les boutons RETOUR des panneaux sont centrés en bas', () => {
        const { optionsPanel, scoresPanel, skinsPanel } = UI_LAYOUT;
        expect(TOUCH_TARGETS.menuOptionsClose).toEqual({
            x: GAME_CONFIG.centerX,
            y: optionsPanel.closeBtn,
        });
        expect(TOUCH_TARGETS.menuScoresClose).toEqual({
            x: GAME_CONFIG.centerX,
            y: scoresPanel.closeBtn,
        });
        expect(TOUCH_TARGETS.menuSkinsClose).toEqual({
            x: GAME_CONFIG.centerX,
            y: skinsPanel.closeBtn,
        });
    });

    it('les boutons RETOUR tiennent dans le fond du panneau', () => {
        for (const panel of [UI_LAYOUT.optionsPanel, UI_LAYOUT.scoresPanel, UI_LAYOUT.skinsPanel]) {
            const bottom = panel.panelTop + panel.panelH;
            expect(panel.closeBtn).toBe(panelCloseBtnY(panel.panelTop, panel.panelH));
            expect(panel.closeBtn + MIN_TOUCH / 2).toBeLessThanOrEqual(bottom - PANEL_CLOSE_INSET);
            expect(panel.closeBtn - MIN_TOUCH / 2).toBeGreaterThan(panel.panelTop + SPACING.sm);
        }
    });

    it('les onglets options tiennent dans le panneau', () => {
        const { optionsPanel } = UI_LAYOUT;
        const left = GAME_CONFIG.centerX - optionsPanel.w / 2;
        const right = left + optionsPanel.w;
        const half = optionsPanel.tabBtnW / 2;
        expect(optionsPanel.tabControlsX - half).toBeGreaterThanOrEqual(
            left + optionsPanel.tabInset
        );
        expect(optionsPanel.tabPreferencesX + half).toBeLessThanOrEqual(
            right - optionsPanel.tabInset
        );
        expect(optionsPanel.tabPreferencesX).toBeGreaterThan(optionsPanel.tabControlsX);
    });

    it('les boutons RETOUR des panneaux sont hors de la bande tactile de menuRow', () => {
        const band = [
            UI_LAYOUT.menu.menuRow - MENU_SECONDARY_HIT / 2,
            UI_LAYOUT.menu.menuRow + MENU_SECONDARY_HIT / 2,
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

    it('les boutons game over tiennent dans le panneau', () => {
        const bottom = GAME_OVER_PANEL.y + GAME_OVER_PANEL.h;
        const menuY = gameOverMenuBtnY();
        const restartY = gameOverRestartBtnY();
        expect(menuY + MIN_TOUCH / 2).toBeLessThanOrEqual(bottom - PANEL_CLOSE_INSET);
        expect(restartY + MIN_CTA_TOUCH / 2).toBeLessThanOrEqual(
            menuY - MIN_CTA_TOUCH / 2 - SPACING.sm
        );
        expect(TOUCH_TARGETS.gameOverMenu.y).toBe(menuY);
        expect(TOUCH_TARGETS.gameOverRestart.y).toBe(restartY);
    });
});
