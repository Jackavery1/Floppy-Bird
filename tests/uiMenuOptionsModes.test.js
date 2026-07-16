import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildModeControls } from '../src/ui/menu/uiMenuOptionsModes.js';
import { UI } from '../src/ui/core/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { UI_LAYOUT } from '../src/ui/shared/uiLayout.js';
import { isHardcoreUnlocked } from '../src/hardcoreUnlock.js';

vi.mock('../src/hardcoreUnlock.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        isHardcoreUnlocked: vi.fn(() => true),
    };
});

vi.mock('../src/ui/a11y/uiDomAccessibilityControls.js', () => ({
    bindUnifiedInteractiveFocus: vi.fn(() => ({
        attachHit: vi.fn(),
    })),
}));

describe('uiMenuOptionsModes', () => {
    let scene;
    let ui;
    let added;

    beforeEach(() => {
        scene = createBaseScene({
            round: createRoundState(),
            trainingMode: false,
            hardcoreMode: false,
            toggleTraining: vi.fn(),
            toggleHardcore: vi.fn(),
        });
        ui = new UI(scene);
        ui._optionsPanelElements = [];
        added = [];
        buildModeControls(ui, (...objs) => added.push(...objs), UI_LAYOUT.optionsPanel);
    });

    it('crée les contrôles entraînement et hardcore', () => {
        expect(ui._trainingLabel).toBeTruthy();
        expect(ui._trainingHit).toBeTruthy();
        expect(ui._hardcoreLabel).toBeTruthy();
        expect(ui._hardcoreHit).toBeTruthy();
        expect(added.length).toBeGreaterThan(0);
    });

    it('refléte le mode entraînement actif', () => {
        expect(ui._trainingLabel.setText).toHaveBeenCalled();
    });

    it('bascule l’entraînement au clic', () => {
        const handlers = ui._trainingHit.on.mock.calls.filter(([event]) => event === 'pointerdown');
        handlers[0][1](null, null, null, { stopPropagation: vi.fn() });
        expect(scene.toggleTraining).toHaveBeenCalled();
    });

    it('bascule le hardcore au clic quand débloqué', () => {
        const handlers = ui._hardcoreHit.on.mock.calls.filter(([event]) => event === 'pointerdown');
        handlers[0][1](null, null, null, { stopPropagation: vi.fn() });
        expect(scene.toggleHardcore).toHaveBeenCalled();
    });

    it('désactive le hardcore quand verrouillé', () => {
        vi.mocked(isHardcoreUnlocked).mockReturnValue(false);
        const lockedScene = createBaseScene({
            round: createRoundState(),
            trainingMode: false,
            hardcoreMode: false,
            toggleTraining: vi.fn(),
            toggleHardcore: vi.fn(),
        });
        const lockedUi = new UI(lockedScene);
        buildModeControls(lockedUi, () => {}, UI_LAYOUT.optionsPanel);
        expect(lockedUi._hardcoreHit.setInteractive).not.toHaveBeenCalled();
    });
});
