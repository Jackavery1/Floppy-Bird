import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    enterPauseAccessibility,
    exitPauseAccessibility,
    hideAccessibilityForRoundStart,
    announceRoundStarted,
    announceDeathStarted,
    openMenuAccessibility,
    openGameOverAccessibility,
} from '../src/sceneA11ySync.js';

vi.mock('../src/uiDomAccessibilityControls.js', () => ({
    announceAccessibility: vi.fn(),
    hideAllAccessibilityControls: vi.fn(),
    setAccessibilityControlVisible: vi.fn(),
}));

vi.mock('../src/uiDomAccessibilityFlows.js', () => ({
    setupMenuAccessibility: vi.fn(),
    setupGameOverAccessibility: vi.fn(),
}));

vi.mock('../src/uiDomAccessibilityPanelFlows.js', () => ({
    setOptionsPanelAccessibility: vi.fn(),
}));

vi.mock('../src/uiDomAccessibilityLayer.js', () => ({
    syncAccessibilityLayer: vi.fn(),
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
        const { hideAllAccessibilityControls, announceAccessibility } = await import(
            '../src/uiDomAccessibilityControls.js'
        );
        const { setupMenuAccessibility } = await import('../src/uiDomAccessibilityFlows.js');
        const { setOptionsPanelAccessibility } = await import(
            '../src/uiDomAccessibilityPanelFlows.js'
        );
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
        const { announceAccessibility } = await import('../src/uiDomAccessibilityControls.js');
        const scene = { game: { canvas: null } };
        openMenuAccessibility(scene);
        expect(announceAccessibility).toHaveBeenCalledWith(
            expect.stringMatching(/Menu principal.*Première partie/i)
        );
        vi.unstubAllGlobals();
    });

    it('hideAccessibilityForRoundStart masque tous les contrôles', async () => {
        const { hideAllAccessibilityControls } = await import(
            '../src/uiDomAccessibilityControls.js'
        );
        hideAccessibilityForRoundStart();
        expect(hideAllAccessibilityControls).toHaveBeenCalled();
    });

    it('enterPauseAccessibility affiche les contrôles pause', async () => {
        const { hideAllAccessibilityControls, setAccessibilityControlVisible, announceAccessibility } =
            await import('../src/uiDomAccessibilityControls.js');
        const { syncAccessibilityLayer } = await import('../src/uiDomAccessibilityLayer.js');
        const scene = { game: { canvas: null } };
        enterPauseAccessibility(scene);
        expect(hideAllAccessibilityControls).toHaveBeenCalled();
        expect(setAccessibilityControlVisible).toHaveBeenCalledWith('pause', false);
        expect(syncAccessibilityLayer).toHaveBeenCalledWith(scene.game);
        expect(announceAccessibility).toHaveBeenCalledWith('Partie en pause');
    });

    it('exitPauseAccessibility réactive les contrôles en jeu', async () => {
        const { hideAllAccessibilityControls, setAccessibilityControlVisible, announceAccessibility } =
            await import('../src/uiDomAccessibilityControls.js');
        const { syncAccessibilityLayer } = await import('../src/uiDomAccessibilityLayer.js');
        const scene = { game: { canvas: null } };
        exitPauseAccessibility(scene);
        expect(hideAllAccessibilityControls).toHaveBeenCalled();
        expect(setAccessibilityControlVisible).toHaveBeenCalledWith('pause', true);
        expect(syncAccessibilityLayer).toHaveBeenCalledWith(scene.game);
        expect(announceAccessibility).toHaveBeenCalledWith('Partie reprise');
    });

    it('announceRoundStarted annonce le mode de partie', async () => {
        const { announceAccessibility } = await import('../src/uiDomAccessibilityControls.js');
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

    it('announceDeathStarted annonce la cause de mort', async () => {
        const { announceAccessibility } = await import('../src/uiDomAccessibilityControls.js');
        announceDeathStarted('pipe');
        expect(announceAccessibility).toHaveBeenCalledWith('Mort : Collision tuyau.');
    });

    it('openGameOverAccessibility délègue au flow DOM', async () => {
        const { setupGameOverAccessibility } = await import('../src/uiDomAccessibilityFlows.js');
        const scene = { game: { canvas: null } };
        openGameOverAccessibility(scene, { score: 7, isDaily: true });
        expect(setupGameOverAccessibility).toHaveBeenCalledWith(scene, { score: 7, isDaily: true });
    });
});
