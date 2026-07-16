import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    enterPauseAccessibility,
    exitPauseAccessibility,
    hideAccessibilityForRoundStart,
    announceRoundStarted,
    announceDeathStarted,
    announceScoreReached,
    openMenuAccessibility,
    openGameOverAccessibility,
} from '../src/sceneA11ySync.js';

vi.mock('../src/ui/a11y/uiDomAccessibilityControls.js', () => ({
    announceAccessibility: vi.fn(),
    hideAllAccessibilityControls: vi.fn(),
    setAccessibilityControlVisible: vi.fn(),
}));

vi.mock('../src/ui/a11y/uiDomAccessibilityFlows.js', () => ({
    setupMenuAccessibility: vi.fn(),
    setupGameOverAccessibility: vi.fn(),
}));

vi.mock('../src/ui/a11y/uiDomAccessibilityPanelFlows.js', () => ({
    setOptionsPanelAccessibility: vi.fn(),
}));

vi.mock('../src/ui/a11y/uiDomAccessibilityLayer.js', () => ({
    syncAccessibilityLayer: vi.fn(),
    syncAndFocusAccessibilityLayer: vi.fn(),
}));

describe('sceneA11ySync', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('openMenuAccessibility masque tout puis configure le menu', async () => {
        vi.stubGlobal('localStorage', {
            getItem: (k) => (k.includes('tutorial-progress') ? '3' : null),
            setItem: vi.fn(),
        });
        const { hideAllAccessibilityControls, announceAccessibility } =
            await import('../src/ui/a11y/uiDomAccessibilityControls.js');
        const { setupMenuAccessibility } =
            await import('../src/ui/a11y/uiDomAccessibilityFlows.js');
        const { setOptionsPanelAccessibility } =
            await import('../src/ui/a11y/uiDomAccessibilityPanelFlows.js');
        const scene = { game: { canvas: null } };
        openMenuAccessibility(scene);
        expect(hideAllAccessibilityControls).toHaveBeenCalled();
        expect(setOptionsPanelAccessibility).toHaveBeenCalledWith(scene, false);
        expect(setupMenuAccessibility).toHaveBeenCalledWith(scene);
        expect(announceAccessibility).toHaveBeenCalledWith('Menu principal');
        vi.unstubAllGlobals();
    });

    it('openMenuAccessibility annonce la première partie sur profil vierge', async () => {
        vi.stubGlobal('localStorage', {
            getItem: () => null,
            setItem: vi.fn(),
        });
        const { announceAccessibility } =
            await import('../src/ui/a11y/uiDomAccessibilityControls.js');
        const scene = { game: { canvas: null } };
        openMenuAccessibility(scene);
        expect(announceAccessibility).toHaveBeenCalledWith(
            expect.stringMatching(/Menu principal.*Première partie/i)
        );
        vi.unstubAllGlobals();
    });

    it('hideAccessibilityForRoundStart masque tous les contrôles', async () => {
        const { hideAllAccessibilityControls } =
            await import('../src/ui/a11y/uiDomAccessibilityControls.js');
        hideAccessibilityForRoundStart();
        expect(hideAllAccessibilityControls).toHaveBeenCalled();
    });

    it('enterPauseAccessibility affiche les contrôles pause', async () => {
        const {
            hideAllAccessibilityControls,
            setAccessibilityControlVisible,
            announceAccessibility,
        } = await import('../src/ui/a11y/uiDomAccessibilityControls.js');
        const { syncAndFocusAccessibilityLayer } =
            await import('../src/ui/a11y/uiDomAccessibilityLayer.js');
        const scene = { game: { canvas: null } };
        enterPauseAccessibility(scene);
        expect(hideAllAccessibilityControls).toHaveBeenCalled();
        expect(setAccessibilityControlVisible).toHaveBeenCalledWith('pause', false);
        expect(syncAndFocusAccessibilityLayer).toHaveBeenCalledWith(scene.game);
        expect(announceAccessibility).toHaveBeenCalledWith('Partie en pause');
    });

    it('exitPauseAccessibility réactive les contrôles en jeu', async () => {
        const {
            hideAllAccessibilityControls,
            setAccessibilityControlVisible,
            announceAccessibility,
        } = await import('../src/ui/a11y/uiDomAccessibilityControls.js');
        const { syncAccessibilityLayer } =
            await import('../src/ui/a11y/uiDomAccessibilityLayer.js');
        const scene = { game: { canvas: null } };
        exitPauseAccessibility(scene);
        expect(hideAllAccessibilityControls).toHaveBeenCalled();
        expect(setAccessibilityControlVisible).toHaveBeenCalledWith('pause', true);
        expect(syncAccessibilityLayer).toHaveBeenCalledWith(scene.game);
        expect(announceAccessibility).toHaveBeenCalledWith('Partie reprise');
    });

    it('announceRoundStarted annonce le mode de partie', async () => {
        const { announceAccessibility } =
            await import('../src/ui/a11y/uiDomAccessibilityControls.js');
        announceRoundStarted({
            trainingMode: true,
            dailyChallengeMode: false,
            hardcoreMode: false,
        });
        expect(announceAccessibility).toHaveBeenCalledWith('Partie démarrée. Mode entraînement.');
        announceRoundStarted({
            trainingMode: false,
            dailyChallengeMode: true,
            hardcoreMode: false,
        });
        expect(announceAccessibility).toHaveBeenCalledWith('Partie démarrée. Mode défi du jour.');
    });

    it('announceDeathStarted annonce la cause de mort et le score', async () => {
        const { announceAccessibility } =
            await import('../src/ui/a11y/uiDomAccessibilityControls.js');
        announceDeathStarted('pipe');
        expect(announceAccessibility).toHaveBeenCalledWith('Mort : Collision tuyau.');
        announceDeathStarted('ground', 5);
        expect(announceAccessibility).toHaveBeenCalledWith('Mort : Touché le sol. Score 5.');
    });

    it('announceScoreReached annonce le palier', async () => {
        const { announceAccessibility } =
            await import('../src/ui/a11y/uiDomAccessibilityControls.js');
        announceScoreReached(10);
        expect(announceAccessibility).toHaveBeenCalledWith('Score 10');
        announceScoreReached(0);
        expect(announceAccessibility).toHaveBeenCalledTimes(1);
    });

    it('openGameOverAccessibility délègue au flow DOM', async () => {
        const { setupGameOverAccessibility } =
            await import('../src/ui/a11y/uiDomAccessibilityFlows.js');
        const scene = { game: { canvas: null } };
        openGameOverAccessibility(scene, { score: 7, isDaily: true });
        expect(setupGameOverAccessibility).toHaveBeenCalledWith(scene, { score: 7, isDaily: true });
    });
});
