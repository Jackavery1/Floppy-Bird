import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { GAME_STATE } from '../src/gameState.js';

const actionHandlers = new Map();

vi.mock('../src/ui/a11y/uiDomAccessibilityControls.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        bindAccessibilityAction: vi.fn((key, handler) => {
            actionHandlers.set(key, handler);
        }),
        setAccessibilityControlVisible: actual.setAccessibilityControlVisible,
        setAccessibilityControlLabel: actual.setAccessibilityControlLabel,
        announceAccessibility: vi.fn(),
        syncOptionsTabAccessibility: vi.fn(),
    };
});

vi.mock('../src/ui/a11y/uiDomAccessibilityFocusVisuals.js', () => ({
    bindScoresAccessibilityFocusVisuals: vi.fn(),
    bindSkinsAccessibilityFocusVisuals: vi.fn(),
    bindOptionsAccessibilityFocusVisuals: vi.fn(),
}));

vi.mock('../src/ui/menu/uiMenuOptionsTabs.js', () => ({
    setOptionsTab: vi.fn(),
}));

import {
    bindOptionsAccessibility,
    bindScoresAccessibility,
    bindSkinsAccessibility,
    setOptionsPanelAccessibility,
    setScoresPanelAccessibility,
    setSkinsPanelAccessibility,
} from '../src/ui/a11y/uiDomAccessibilityPanelFlows.js';

describe('uiDomAccessibilityPanelFlows', () => {
    beforeEach(() => {
        actionHandlers.clear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    function stubButtons(ids) {
        const buttons = Object.fromEntries(ids.map((id) => [id, { hidden: true, style: {} }]));
        vi.stubGlobal('document', {
            getElementById: vi.fn((id) => buttons[id] ?? null),
        });
        return buttons;
    }

    function createScene() {
        return {
            state: GAME_STATE.MENU,
            trainingTimeScale: 0.8,
            game: {
                canvas: {
                    getBoundingClientRect: () => ({ left: 0, top: 0, width: 288, height: 512 }),
                },
            },
            ui: {
                toggleMenuScoresPanel: vi.fn(),
                toggleMenuOptionsPanel: vi.fn(),
                toggleMenuSkinsPanel: vi.fn(),
                cycleMenuSkin: vi.fn(),
            },
            toggleTraining: vi.fn(),
            toggleHardcore: vi.fn(),
            cycleTrainingSpeed: vi.fn(),
        };
    }

    it('bindScoresAccessibility branche le retour panneau scores', () => {
        const scene = createScene();
        bindScoresAccessibility(scene);
        actionHandlers.get('menuScoresClose')?.();
        expect(scene.ui.toggleMenuScoresPanel).toHaveBeenCalled();
    });

    it('bindSkinsAccessibility branche cycle et fermeture', () => {
        const scene = createScene();
        bindSkinsAccessibility(scene);
        actionHandlers.get('menuSkinsPrev')?.();
        actionHandlers.get('menuSkinsNext')?.();
        actionHandlers.get('menuSkinsClose')?.();
        expect(scene.ui.cycleMenuSkin).toHaveBeenCalledWith(-1);
        expect(scene.ui.cycleMenuSkin).toHaveBeenCalledWith(1);
        expect(scene.ui.toggleMenuSkinsPanel).toHaveBeenCalled();
    });

    it('bindOptionsAccessibility branche modes et fermeture', () => {
        const scene = createScene();
        bindOptionsAccessibility(scene);
        actionHandlers.get('menuTraining')?.();
        actionHandlers.get('menuHardcore')?.();
        actionHandlers.get('menuTrainingSpeed')?.();
        actionHandlers.get('menuOptionsClose')?.();
        expect(scene.toggleTraining).toHaveBeenCalled();
        expect(scene.toggleHardcore).toHaveBeenCalled();
        expect(scene.cycleTrainingSpeed).toHaveBeenCalled();
        expect(scene.ui.toggleMenuOptionsPanel).toHaveBeenCalled();
    });

    it('setScoresPanelAccessibility masque le menu quand le panneau est ouvert', () => {
        stubButtons(['a11y-start', 'a11y-scores-close']);
        const scene = createScene();
        setScoresPanelAccessibility(scene, true);
        expect(document.getElementById('a11y-start')?.hidden).toBe(true);
        expect(document.getElementById('a11y-scores-close')?.hidden).toBe(false);
    });

    it('setSkinsPanelAccessibility affiche les contrôles skins', () => {
        stubButtons(['a11y-skin-prev', 'a11y-skin-next', 'a11y-skins-close']);
        const scene = createScene();
        setSkinsPanelAccessibility(scene, true);
        expect(document.getElementById('a11y-skin-prev')?.hidden).toBe(false);
    });

    it('setOptionsPanelAccessibility affiche les contrôles options', () => {
        stubButtons(['a11y-options-close', 'a11y-training', 'a11y-hardcore']);
        const scene = createScene();
        setOptionsPanelAccessibility(scene, true);
        expect(document.getElementById('a11y-options-close')?.hidden).toBe(false);
    });
});
