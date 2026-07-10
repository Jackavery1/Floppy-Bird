import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    enterPauseAccessibility,
    exitPauseAccessibility,
    hideAccessibilityForRoundStart,
    openMenuAccessibility,
} from '../src/sceneA11ySync.js';

vi.mock('../src/uiDomAccessibility.js', () => ({
    announceAccessibility: vi.fn(),
    hideAllAccessibilityControls: vi.fn(),
    setAccessibilityControlVisible: vi.fn(),
    setupMenuAccessibility: vi.fn(),
    syncAccessibilityLayer: vi.fn(),
}));

describe('sceneA11ySync', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('openMenuAccessibility configure le menu et annonce', async () => {
        const { setupMenuAccessibility, announceAccessibility } =
            await import('../src/uiDomAccessibility.js');
        const scene = { game: { canvas: null } };
        openMenuAccessibility(scene);
        expect(setupMenuAccessibility).toHaveBeenCalledWith(scene);
        expect(announceAccessibility).toHaveBeenCalledWith('Menu principal');
    });

    it('hideAccessibilityForRoundStart masque tous les contrôles', async () => {
        const { hideAllAccessibilityControls } = await import('../src/uiDomAccessibility.js');
        hideAccessibilityForRoundStart();
        expect(hideAllAccessibilityControls).toHaveBeenCalled();
    });

    it('enterPauseAccessibility affiche les contrôles pause', async () => {
        const { setAccessibilityControlVisible, syncAccessibilityLayer, announceAccessibility } =
            await import('../src/uiDomAccessibility.js');
        const scene = { game: { canvas: null } };
        enterPauseAccessibility(scene);
        expect(setAccessibilityControlVisible).toHaveBeenCalledWith('pause', false);
        expect(syncAccessibilityLayer).toHaveBeenCalledWith(scene.game);
        expect(announceAccessibility).toHaveBeenCalledWith('Partie en pause');
    });

    it('exitPauseAccessibility réactive les contrôles en jeu', async () => {
        const { setAccessibilityControlVisible, syncAccessibilityLayer, announceAccessibility } =
            await import('../src/uiDomAccessibility.js');
        const scene = { game: { canvas: null } };
        exitPauseAccessibility(scene);
        expect(setAccessibilityControlVisible).toHaveBeenCalledWith('pause', true);
        expect(syncAccessibilityLayer).toHaveBeenCalledWith(scene.game);
        expect(announceAccessibility).toHaveBeenCalledWith('Partie reprise');
    });
});
