import { describe, it, expect, vi, afterEach } from 'vitest';
import { DIFFICULTY } from '../src/config.js';
import { focusHandlers, blurHandlers } from '../src/uiDomAccessibilityState.js';
import {
    bindMenuAccessibilityFocusVisuals,
    bindOptionsAccessibilityFocusVisuals,
    bindPlayingAccessibilityFocusVisuals,
    bindScoresAccessibilityFocusVisuals,
    bindSkinsAccessibilityFocusVisuals,
} from '../src/uiDomAccessibilityFocusVisuals.js';
import { drawDiffButtons } from '../src/uiMenuLayout.js';

vi.mock('../src/uiMenuLayout.js', () => ({
    drawDiffButtons: vi.fn(),
}));

vi.mock('../src/metaStorage.js', () => ({
    loadSelectedSkin: vi.fn(() => 'classic'),
}));

vi.mock('../src/uiMenuSkinsRefresh.js', () => ({
    refreshSkinsTab: vi.fn(),
}));

function clearHandlers() {
    for (const key of Object.keys(focusHandlers)) delete focusHandlers[key];
    for (const key of Object.keys(blurHandlers)) delete blurHandlers[key];
}

function menuUi(overrides = {}) {
    return {
        _currentDifficulty: DIFFICULTY.NORMAL,
        _menuLayout: { difficulty: 120 },
        _focusedDifficulty: null,
        _scoresBtnBg: { setFillStyle: vi.fn() },
        _optionsBtnBg: { setFillStyle: vi.fn() },
        _skinsBtnBg: { setFillStyle: vi.fn() },
        _dailyBtnBg: { setFillStyle: vi.fn() },
        _startText: { setScale: vi.fn() },
        ...overrides,
    };
}

describe('uiDomAccessibilityFocusVisuals', () => {
    afterEach(() => {
        clearHandlers();
        vi.clearAllMocks();
    });

    it('bindMenuAccessibilityFocusVisuals redessine la difficulté au focus clavier', () => {
        const ui = menuUi();

        bindMenuAccessibilityFocusVisuals(ui);
        focusHandlers['a11y-diff-hard']?.();

        expect(ui._focusedDifficulty).toBe(DIFFICULTY.HARD);
        expect(drawDiffButtons).toHaveBeenCalledWith(ui, DIFFICULTY.NORMAL, ui._menuLayout);

        blurHandlers['a11y-diff-hard']?.();
        expect(ui._focusedDifficulty).toBeNull();
    });

    it('bindMenuAccessibilityFocusVisuals applique le hover fill aux boutons menu', () => {
        const ui = menuUi();

        bindMenuAccessibilityFocusVisuals(ui);
        focusHandlers['a11y-scores']?.();
        blurHandlers['a11y-scores']?.();

        expect(ui._scoresBtnBg.setFillStyle).toHaveBeenCalledTimes(2);
        focusHandlers['a11y-daily']?.();
        expect(ui._dailyBtnBg.setFillStyle).toHaveBeenCalled();
    });

    it('bindMenuAccessibilityFocusVisuals scale le CTA start au focus', () => {
        const ui = menuUi();

        bindMenuAccessibilityFocusVisuals(ui);
        focusHandlers['a11y-start']?.();
        blurHandlers['a11y-start']?.();

        expect(ui._startText.setScale).toHaveBeenCalledWith(1.05);
        expect(ui._startText.setScale).toHaveBeenCalledWith(1);
    });

    it('ne redessine pas la difficulté au blur si une autre touche est focus', () => {
        const ui = menuUi();

        bindMenuAccessibilityFocusVisuals(ui);
        focusHandlers['a11y-diff-hard']?.();
        drawDiffButtons.mockClear();
        ui._focusedDifficulty = DIFFICULTY.EASY;
        blurHandlers['a11y-diff-hard']?.();

        expect(drawDiffButtons).not.toHaveBeenCalled();
        expect(ui._focusedDifficulty).toBe(DIFFICULTY.EASY);
    });

    it('bindPlayingAccessibilityFocusVisuals scale le score au focus saut', () => {
        const ui = { scoreText: { setScale: vi.fn() } };

        bindPlayingAccessibilityFocusVisuals(ui);
        focusHandlers['a11y-jump']?.();
        blurHandlers['a11y-jump']?.();

        expect(ui.scoreText.setScale).toHaveBeenCalledWith(1.08);
        expect(ui.scoreText.setScale).toHaveBeenCalledWith(1);
    });

    it('ignore un ui null ou sans handlers optionnels', () => {
        expect(() => bindMenuAccessibilityFocusVisuals(null)).not.toThrow();
        expect(() => bindOptionsAccessibilityFocusVisuals(null)).not.toThrow();
        expect(() => bindScoresAccessibilityFocusVisuals(null)).not.toThrow();
        expect(() => bindSkinsAccessibilityFocusVisuals(null)).not.toThrow();
        expect(() => bindPlayingAccessibilityFocusVisuals(null)).not.toThrow();
    });

    it('bindOptionsAccessibilityFocusVisuals modifie alpha et onglets inactifs', () => {
        const paint = vi.fn();
        const ui = {
            _trainingLabel: { setAlpha: vi.fn() },
            _hardcoreLabel: { setAlpha: vi.fn() },
            _trainingSpeedLabel: { setAlpha: vi.fn() },
            _muteText: { setAlpha: vi.fn() },
            _optionsClosePaint: vi.fn(),
            _optionsTabButtons: [{ id: 'controls', paint }],
            _optionsActiveTab: 'preferences',
        };

        bindOptionsAccessibilityFocusVisuals(ui);
        focusHandlers['a11y-training']?.();
        blurHandlers['a11y-training']?.();
        focusHandlers['a11y-options-tab-controls']?.();
        blurHandlers['a11y-options-tab-controls']?.();
        focusHandlers['a11y-options-close']?.();

        expect(ui._trainingLabel.setAlpha).toHaveBeenCalledWith(1);
        expect(ui._trainingLabel.setAlpha).toHaveBeenCalledWith(0.92);
        expect(paint).toHaveBeenCalled();
        expect(ui._optionsClosePaint).toHaveBeenCalled();
    });

    it('bindOptionsTabFocusVisuals ignore le hover si onglet déjà actif', () => {
        const paint = vi.fn();
        const ui = {
            _optionsTabButtons: [{ id: 'controls', paint }],
            _optionsActiveTab: 'controls',
        };

        bindOptionsAccessibilityFocusVisuals(ui);
        focusHandlers['a11y-options-tab-controls']?.();

        expect(paint).not.toHaveBeenCalled();
    });

    it('bindScoresAccessibilityFocusVisuals peint le bouton fermer', () => {
        const paint = vi.fn();
        bindScoresAccessibilityFocusVisuals({ _scoresClosePaint: paint });

        focusHandlers['a11y-scores-close']?.();
        blurHandlers['a11y-scores-close']?.();

        expect(paint).toHaveBeenCalledTimes(2);
    });

    it('bindSkinsAccessibilityFocusVisuals surligne le skin sélectionné au cycle', async () => {
        const { loadSelectedSkin } = await import('../src/metaStorage.js');
        const { refreshSkinsTab } = await import('../src/uiMenuSkinsRefresh.js');
        const frame = { setStrokeStyle: vi.fn() };
        const ui = {
            _skinsClosePaint: vi.fn(),
            _skinCells: [{ skinId: 'classic', frame }],
        };

        bindSkinsAccessibilityFocusVisuals(ui);
        focusHandlers['a11y-skin-prev']?.();
        blurHandlers['a11y-skin-prev']?.();

        expect(loadSelectedSkin).toHaveBeenCalled();
        expect(frame.setStrokeStyle).toHaveBeenCalled();
        expect(refreshSkinsTab).toHaveBeenCalledWith(ui);
    });

    it('bindAccessibilityFocus enregistre focus et blur', async () => {
        const { bindAccessibilityFocus, bindUnifiedInteractiveFocus } =
            await import('../src/uiDomAccessibilityControls.js');
        const onFocus = vi.fn();
        const onBlur = vi.fn();
        bindAccessibilityFocus('menuScores', onFocus, onBlur);

        focusHandlers['a11y-scores']?.();
        blurHandlers['a11y-scores']?.();

        expect(onFocus).toHaveBeenCalledOnce();
        expect(onBlur).toHaveBeenCalledOnce();

        const onActive = vi.fn();
        const onIdle = vi.fn();
        const hit = { on: vi.fn() };
        bindUnifiedInteractiveFocus('menuOptions', onActive, onIdle).attachHit(hit);
        expect(hit.on).toHaveBeenCalledWith('pointerover', onActive);
        expect(hit.on).toHaveBeenCalledWith('pointerout', onIdle);
        focusHandlers['a11y-options']?.();
        expect(onActive).toHaveBeenCalledOnce();
    });
});
