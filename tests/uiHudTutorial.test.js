import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    showJumpTutorial,
    showHardcoreTutorial,
    showTrainingTutorial,
    dismissHardcoreTutorial,
    dismissTrainingTutorial,
    dismissJumpTutorial,
} from '../src/ui/hud/uiHudTutorial.js';
import { UI } from '../src/ui/core/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { loadTutorialComplete } from '../src/tutorialStorage.js';
import { skipTutorialIfActive } from '../src/tutorialProgress.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
    prefersReducedMotion: vi.fn(() => false),
}));

vi.mock('../src/tutorialStorage.js', () => ({
    loadTutorialComplete: vi.fn(() => false),
}));

vi.mock('../src/tutorialProgress.js', () => ({
    skipTutorialIfActive: vi.fn(),
}));

vi.mock('../src/ui/a11y/uiDomAccessibilityControls.js', () => ({
    bindAccessibilityAction: vi.fn(),
    bindUnifiedInteractiveFocus: vi.fn(() => ({ attachHit: vi.fn() })),
    setAccessibilityControlLabel: vi.fn(),
    setAccessibilityControlVisible: vi.fn(),
}));

vi.mock('../src/ui/a11y/uiDomAccessibilityLayer.js', () => ({
    syncAccessibilityLayer: vi.fn(),
}));

describe('uiHudTutorial', () => {
    let ui;

    beforeEach(() => {
        vi.mocked(loadTutorialComplete).mockReturnValue(false);
        ui = new UI(createBaseScene({ round: createRoundState(), trainingTimeScale: 0.8 }));
        vi.clearAllMocks();
    });

    it('n’ajoute pas le skip si le tutoriel est déjà complété', () => {
        vi.mocked(loadTutorialComplete).mockReturnValue(true);
        showJumpTutorial(ui);
        expect(ui._tutorialHint).toBeTruthy();
        expect(ui._tutorialSkipHit).toBeFalsy();
    });

    it('skip au pointerdown appelle skipTutorialIfActive', () => {
        showJumpTutorial(ui);
        expect(ui._tutorialSkipHit).toBeTruthy();
        const handlers = ui._tutorialSkipHit.on.mock.calls.filter(([e]) => e === 'pointerdown');
        expect(handlers.length).toBeGreaterThan(0);
        handlers[0][1](null, null, null, { stopPropagation: vi.fn() });
        expect(skipTutorialIfActive).toHaveBeenCalledWith(ui.scene);
    });

    it('place le skip sous la zone jump a11y (96 px)', async () => {
        const { GAME_CONFIG } = await import('../src/config.js');
        const { MIN_CTA_TOUCH, TOUCH_TARGETS } = await import('../src/ui/shared/uiLayout.js');
        showJumpTutorial(ui);
        const skipCall = ui.scene.add.rectangle.mock.calls.find(
            ([x, y, w, h]) =>
                x === TOUCH_TARGETS.tutorialSkip.x &&
                y === TOUCH_TARGETS.tutorialSkip.y &&
                w === 140 &&
                h === MIN_CTA_TOUCH
        );
        expect(skipCall).toBeTruthy();
        const jumpBottom = GAME_CONFIG.centerY + MIN_CTA_TOUCH;
        expect(TOUCH_TARGETS.tutorialSkip.y - MIN_CTA_TOUCH / 2).toBeGreaterThanOrEqual(jumpBottom);
    });

    it('showHardcoreTutorial active le flag et le hint', () => {
        showHardcoreTutorial(ui);
        expect(ui._hardcoreTutorialActive).toBe(true);
        expect(ui._tutorialHint).toBeTruthy();
        expect(ui._tutorialSkipHit).toBeFalsy();
    });

    it('showTrainingTutorial utilise le timeScale scène', () => {
        showTrainingTutorial(ui);
        expect(ui._trainingTutorialActive).toBe(true);
        expect(ui._tutorialHint).toBeTruthy();
    });

    it('dismissHardcoreTutorial no-op puis nettoie après show', () => {
        expect(dismissHardcoreTutorial(ui)).toBe(false);
        showHardcoreTutorial(ui);
        expect(dismissHardcoreTutorial(ui)).toBe(true);
        expect(ui._hardcoreTutorialActive).toBe(false);
        expect(ui._tutorialHint).toBeNull();
    });

    it('dismissTrainingTutorial no-op puis nettoie après show', () => {
        expect(dismissTrainingTutorial(ui)).toBe(false);
        showTrainingTutorial(ui);
        expect(dismissTrainingTutorial(ui)).toBe(true);
        expect(ui._trainingTutorialActive).toBe(false);
        expect(dismissJumpTutorial(ui)).toBe(false);
    });
});
