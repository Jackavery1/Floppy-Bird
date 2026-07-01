import { describe, it, expect } from 'vitest';
import { diffButtonCenter, diffLabelColor } from '../src/uiLayout.js';
import { DIFFICULTY } from '../src/config.js';

describe('uiLayout', () => {
    it('calcule le centre des boutons difficulté', () => {
        expect(diffButtonCenter(0)).toBe(32 + 34);
        expect(diffButtonCenter(1)).toBe(110 + 34);
    });

    it('colore le bouton actif en noir', () => {
        expect(diffLabelColor(DIFFICULTY.NORMAL, DIFFICULTY.NORMAL)).toBe('#000000');
        expect(diffLabelColor(DIFFICULTY.NORMAL, DIFFICULTY.HARD)).toBe('#ff8888');
    });

    it('expose les cibles tactiles pour les tests e2e', async () => {
        const { TOUCH_TARGETS, UI_LAYOUT } = await import('../src/uiLayout.js');
        expect(TOUCH_TARGETS.pauseButton).toEqual({
            x: UI_LAYOUT.playing.pauseBtnX,
            y: UI_LAYOUT.playing.pauseBtnY,
        });
        expect(TOUCH_TARGETS.pauseResume.y).toBe(UI_LAYOUT.pause.resumeBtn);
    });
});
