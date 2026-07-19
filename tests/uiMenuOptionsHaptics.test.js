import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildHapticsControls } from '../src/ui/menu/uiMenuOptionsHaptics.js';
import { UI } from '../src/ui/core/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';
import { createRoundState } from '../src/roundState.js';
import { isHapticsEnabled, toggleHaptics } from '../src/haptics.js';
import { bindAccessibilityAction } from '../src/ui/a11y/uiDomAccessibilityControls.js';

vi.mock('../src/haptics.js', () => ({
    isHapticsEnabled: vi.fn(() => true),
    toggleHaptics: vi.fn(() => false),
}));

vi.mock('../src/ui/a11y/uiDomAccessibilityControls.js', () => ({
    announceAccessibility: vi.fn(),
    bindAccessibilityAction: vi.fn(),
    bindUnifiedInteractiveFocus: vi.fn(() => ({
        attachHit: vi.fn(),
    })),
    setAccessibilityControlLabel: vi.fn(),
}));

describe('uiMenuOptionsHaptics', () => {
    let scene;
    let ui;

    beforeEach(() => {
        vi.mocked(isHapticsEnabled).mockReturnValue(true);
        vi.mocked(toggleHaptics).mockReturnValue(false);
        scene = createBaseScene({ round: createRoundState() });
        ui = new UI(scene);
        buildHapticsControls(ui, () => {}, 224);
    });

    it('affiche le libellé vibration', () => {
        const textCall = scene.add.text.mock.calls.find(([, , content]) =>
            String(content).includes('VIBRATION')
        );
        expect(textCall?.[2]).toBe('VIBRATION · ON');
        expect(ui._hapticsHit.setInteractive).toHaveBeenCalled();
    });

    it('bascule la vibration au clic', () => {
        const handlers = ui._hapticsHit.on.mock.calls.filter(([event]) => event === 'pointerdown');
        expect(handlers.length).toBeGreaterThan(0);
        handlers[0][1](null, null, null, { stopPropagation: vi.fn() });
        expect(toggleHaptics).toHaveBeenCalled();
        expect(ui._hapticsText.setText).toHaveBeenCalledWith('VIBRATION · OFF');
        expect(bindAccessibilityAction).toHaveBeenCalledWith('menuHaptics', expect.any(Function));
    });

    it('invoke le callback a11y menuHaptics', () => {
        const bindCall = vi
            .mocked(bindAccessibilityAction)
            .mock.calls.find(([key]) => key === 'menuHaptics');
        expect(bindCall).toBeTruthy();
        bindCall[1]();
        expect(toggleHaptics).toHaveBeenCalled();
    });
});
