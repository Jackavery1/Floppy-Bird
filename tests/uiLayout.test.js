import { describe, it, expect } from 'vitest';
import { diffButtonCenter, diffLabelColor } from '../src/uiLayout.js';
import { DIFFICULTY, GAME_CONFIG } from '../src/config.js';
import { DESIGN_TOKENS } from '../src/designTokens.js';

describe('uiLayout', () => {
    it('calcule le centre des boutons difficulté', () => {
        expect(diffButtonCenter(0)).toBe(32 + 34);
        expect(diffButtonCenter(1)).toBe(110 + 34);
    });

    it('colore le bouton actif en blanc sur fond jaune', () => {
        expect(diffLabelColor(DIFFICULTY.NORMAL, DIFFICULTY.NORMAL)).toBe(
            DESIGN_TOKENS.texteBoutonJaune
        );
        expect(diffLabelColor(DIFFICULTY.NORMAL, DIFFICULTY.HARD)).toBe('#ff8888');
    });

    it('expose les cibles tactiles pour les tests e2e', async () => {
        const {
            TOUCH_TARGETS,
            UI_LAYOUT,
            MIN_TOUCH,
            MIN_CTA_TOUCH,
            GAME_OVER_RESTART_BTN_HEIGHT,
            PAUSE_BTN_VISUAL,
            PAUSE_BTN_INSET,
            FONT_TITLE,
        } = await import('../src/uiLayout.js');
        expect(FONT_TITLE).toContain('Press Start 2P');
        expect(TOUCH_TARGETS.pauseButton).toEqual({
            x: UI_LAYOUT.playing.pauseBtnX,
            y: UI_LAYOUT.playing.pauseBtnY,
        });
        expect(TOUCH_TARGETS.pauseButton.x).toBe(
            GAME_CONFIG.width - MIN_CTA_TOUCH / 2 - PAUSE_BTN_INSET
        );
        expect(TOUCH_TARGETS.pauseResume.y).toBe(UI_LAYOUT.pause.resumeBtn);
        expect(TOUCH_TARGETS.menuStart).toEqual({
            x: GAME_CONFIG.centerX,
            y: UI_LAYOUT.menu.start,
        });
        expect(TOUCH_TARGETS.menuScores).toEqual({
            x: UI_LAYOUT.menu.scoresBtn,
            y: UI_LAYOUT.menu.menuRow,
        });
        expect(TOUCH_TARGETS.scoreHud.y).toBe(UI_LAYOUT.scoreHud);
        expect(PAUSE_BTN_VISUAL).toBe(MIN_TOUCH);
        expect(MIN_CTA_TOUCH).toBe(48);
        expect(GAME_OVER_RESTART_BTN_HEIGHT).toBe(MIN_CTA_TOUCH);
        expect(UI_LAYOUT.menuBtn.height).toBe(MIN_TOUCH);
        expect(UI_LAYOUT.menu.menuBtnW).toBeGreaterThanOrEqual(MIN_TOUCH);
        expect(UI_LAYOUT.diffBtn.height).toBe(MIN_TOUCH);
    });
});
