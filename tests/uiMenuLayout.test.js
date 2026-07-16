import { describe, it, expect, vi } from 'vitest';
import { GAME_CONFIG } from '../src/config.js';
import { UI_LAYOUT } from '../src/ui/shared/uiLayout.js';
import { applyMenuLayout, drawDiffButtons } from '../src/ui/menu/uiMenuLayout.js';
import { bestScoreLabel } from '../src/scoreLabels.js';

function createUiStub() {
    const graphics = { clear: vi.fn(), fillStyle: vi.fn(), fillRoundedRect: vi.fn() };
    return {
        _diffBtnGraphics: graphics,
        _hoveredDifficulty: null,
        _currentDifficulty: 'normal',
        _menuLayout: null,
        _diffBtnLabels: [
            {
                label: { setY: vi.fn(), setColor: vi.fn() },
                diff: 'easy',
                hitZone: { setY: vi.fn(), x: 0 },
            },
            {
                label: { setY: vi.fn(), setColor: vi.fn() },
                diff: 'normal',
                hitZone: { setY: vi.fn(), x: 0 },
            },
            {
                label: { setY: vi.fn(), setColor: vi.fn() },
                diff: 'hard',
                hitZone: { setY: vi.fn(), x: 0 },
            },
        ],
        _startText: { setY: vi.fn() },
        _dailyBtnLabel: { setY: vi.fn() },
        _dailyBtnBg: { setY: vi.fn() },
        _dailyBtnHit: { setY: vi.fn() },
        _scoresBtnLabel: { setY: vi.fn(), setX: vi.fn() },
        _scoresBtnHit: { setY: vi.fn(), x: 0 },
        _scoresBtnBg: { setY: vi.fn(), x: 0 },
        _optionsBtnLabel: { setY: vi.fn(), setX: vi.fn() },
        _optionsBtnHit: { setY: vi.fn(), x: 0 },
        _optionsBtnBg: { setY: vi.fn(), x: 0 },
        _skinsBtnLabel: { setY: vi.fn(), setX: vi.fn() },
        _skinsBtnHit: { setY: vi.fn(), x: 0 },
        _skinsBtnBg: { setY: vi.fn(), x: 0 },
    };
}

describe('uiMenuLayout', () => {
    it('drawDiffButtons dessine trois boutons difficulté', () => {
        const ui = createUiStub();
        const layout = UI_LAYOUT.menu;
        drawDiffButtons(ui, 'normal', layout);
        expect(ui._diffBtnGraphics.fillRoundedRect).toHaveBeenCalledTimes(3);
    });

    it('applyMenuLayout repositionne les contrôles du menu', () => {
        const ui = createUiStub();
        applyMenuLayout(ui, 'hard');
        expect(ui._menuLayout).toEqual(UI_LAYOUT.menu);
        expect(ui._startText.setY).toHaveBeenCalledWith(UI_LAYOUT.menu.start);
        expect(ui._scoresBtnBg.x).toBe(UI_LAYOUT.menu.scoresBtn);
    });

    it('bestScoreLabel distingue classique et hardcore', () => {
        expect(bestScoreLabel('normal', false)).toBe('MEILLEUR (NORMAL)');
        expect(bestScoreLabel('hard', true)).toBe('MEILLEUR HC (DIFFICILE)');
    });

    it('le layout menu reste dans le canvas', () => {
        expect(UI_LAYOUT.menu.hint1).toBeLessThanOrEqual(GAME_CONFIG.height);
    });
});
