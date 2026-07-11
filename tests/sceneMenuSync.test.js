import { describe, it, expect, vi } from 'vitest';
import {
    prepareMenuForDisplay,
    closeMenuPanelsForRoundStart,
    openMainMenu,
} from '../src/sceneMenuSync.js';
import { GAME_STATE } from '../src/gameState.js';

vi.mock('../src/sceneA11ySync.js', () => ({
    openMenuAccessibility: vi.fn(),
}));

describe('sceneMenuSync', () => {
    it('prepareMenuForDisplay délègue à la façade UI', () => {
        const prepare = vi.fn();
        prepareMenuForDisplay({ ui: { _prepareMenuRebuild: prepare } });
        expect(prepare).toHaveBeenCalled();
    });

    it('closeMenuPanelsForRoundStart ferme les panneaux menu', () => {
        const close = vi.fn();
        closeMenuPanelsForRoundStart({ ui: { _closeAllMenuPanels: close } });
        expect(close).toHaveBeenCalledWith({ force: true });
    });

    it('openMainMenu reconstruit le menu principal', async () => {
        const { openMenuAccessibility } = await import('../src/sceneA11ySync.js');
        const showMenu = vi.fn(() => ['el']);
        const setOverlay = vi.fn();
        const scene = {
            state: GAME_STATE.PLAYING,
            difficulty: 'normal',
            trainingMode: false,
            hardcoreMode: false,
            playMode: 'daily',
            dailyChallengeMode: true,
            round: { score: 5 },
            ui: {
                _prepareMenuRebuild: vi.fn(),
                showMenu,
                setOverlay,
            },
        };
        openMainMenu(scene);
        expect(scene.state).toBe(GAME_STATE.MENU);
        expect(scene.playMode).toBe('classic');
        expect(scene.dailyChallengeMode).toBe(false);
        expect(scene.round.score).toBe(0);
        expect(showMenu).toHaveBeenCalledWith('normal', false, false);
        expect(setOverlay).toHaveBeenCalledWith('menu', ['el']);
        expect(openMenuAccessibility).toHaveBeenCalledWith(scene);
    });
});
