import { describe, it, expect, vi, afterEach } from 'vitest';
import { DIFFICULTY } from '../src/config.js';
import { focusHandlers, blurHandlers } from '../src/ui/a11y/uiDomAccessibilityState.js';
import {
    bindMenuAccessibilityFocusVisuals,
    bindOptionsAccessibilityFocusVisuals,
    bindPlayingAccessibilityFocusVisuals,
    bindScoresAccessibilityFocusVisuals,
    bindSkinsAccessibilityFocusVisuals,
} from '../src/ui/a11y/uiDomAccessibilityFocusVisuals.js';

vi.mock('../src/metaStorage.js', () => ({
    loadSelectedSkin: vi.fn(() => 'classic'),
}));

vi.mock('../src/ui/menu/uiMenuSkinsRefresh.js', () => ({
    refreshSkinsTab: vi.fn(),
}));

function clearHandlers() {
    for (const key of Object.keys(focusHandlers)) delete focusHandlers[key];
    for (const key of Object.keys(blurHandlers)) delete blurHandlers[key];
}

function menuUi(overrides = {}) {
    return {
        _startText: { setScale: vi.fn() },
        ...overrides,
    };
}

describe('uiDomAccessibilityFocusVisuals', () => {
    afterEach(() => {
        clearHandlers();
        vi.clearAllMocks();
    });

    it('bindMenuAccessibilityFocusVisuals scale le CTA jouer au focus clavier', () => {
        const ui = menuUi();
        bindMenuAccessibilityFocusVisuals(ui);
        focusHandlers['a11y-start']?.();
        blurHandlers['a11y-start']?.();
        expect(ui._startText.setScale).toHaveBeenCalledWith(1.05);
        expect(ui._startText.setScale).toHaveBeenCalledWith(1);
    });

    it('bindMenuAccessibilityFocusVisuals surligne la difficulté au focus', () => {
        const hit = { on: vi.fn() };
        const ui = menuUi({
            _diffBtnLabels: [{ diff: DIFFICULTY.NORMAL, hitZone: hit }],
            _diffBtnGraphics: {
                clear: vi.fn(),
                fillStyle: vi.fn(),
                fillRoundedRect: vi.fn(),
            },
            _currentDifficulty: DIFFICULTY.EASY,
            _menuLayout: { difficulty: 200 },
        });
        bindMenuAccessibilityFocusVisuals(ui);
        focusHandlers['a11y-diff-normal']?.();
        expect(ui._focusedDifficulty).toBe(DIFFICULTY.NORMAL);
        expect(ui._hoveredDifficulty).toBe(DIFFICULTY.NORMAL);
        blurHandlers['a11y-diff-normal']?.();
        expect(ui._focusedDifficulty).toBeNull();
        expect(hit.on).toHaveBeenCalledWith('pointerover', expect.any(Function));
        expect(hit.on).toHaveBeenCalledWith('pointerout', expect.any(Function));
    });

    it('bindMenuAccessibilityFocusVisuals ignore un ui sans _startText', () => {
        expect(() => bindMenuAccessibilityFocusVisuals({})).not.toThrow();
    });

    it('bindOptionsAccessibilityFocusVisuals ignore un ui incomplet', () => {
        expect(() => bindOptionsAccessibilityFocusVisuals(null)).not.toThrow();
        expect(() => bindScoresAccessibilityFocusVisuals(null)).not.toThrow();
        expect(() => bindSkinsAccessibilityFocusVisuals(null)).not.toThrow();
        expect(() => bindPlayingAccessibilityFocusVisuals(null)).not.toThrow();
    });

    it('bindPlayingAccessibilityFocusVisuals scale le score au focus saut', () => {
        const ui = { scoreText: { setScale: vi.fn() } };

        bindPlayingAccessibilityFocusVisuals(ui);
        focusHandlers['a11y-jump']?.();
        blurHandlers['a11y-jump']?.();

        expect(ui.scoreText.setScale).toHaveBeenCalledWith(1.08);
        expect(ui.scoreText.setScale).toHaveBeenCalledWith(1);
    });

    it('bindScoresAccessibilityFocusVisuals relie le bouton fermer', () => {
        const paint = vi.fn();
        const hit = { on: vi.fn() };
        bindScoresAccessibilityFocusVisuals({ _scoresCloseHit: hit, _scoresClosePaint: paint });
        focusHandlers['a11y-scores-close']?.();
        blurHandlers['a11y-scores-close']?.();
        expect(paint).toHaveBeenCalledTimes(2);
        expect(hit.on).toHaveBeenCalledWith('pointerover', expect.any(Function));
    });

    it('bindOptionsAccessibilityFocusVisuals relie le bouton fermer', () => {
        const paint = vi.fn();
        const hit = { on: vi.fn() };
        bindOptionsAccessibilityFocusVisuals({ _optionsCloseHit: hit, _optionsClosePaint: paint });
        focusHandlers['a11y-options-close']?.();
        blurHandlers['a11y-options-close']?.();
        expect(paint).toHaveBeenCalledTimes(2);
    });

    it('bindSkinsAccessibilityFocusVisuals surligne le skin sélectionné au cycle', async () => {
        const { loadSelectedSkin } = await import('../src/metaStorage.js');
        const { refreshSkinsTab } = await import('../src/ui/menu/uiMenuSkinsRefresh.js');
        const frame = { setStrokeStyle: vi.fn() };
        const ui = {
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
            await import('../src/ui/a11y/uiDomAccessibilityControls.js');
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
