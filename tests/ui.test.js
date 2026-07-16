import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UI } from '../src/ui/core/ui.js';
import { DIFFICULTY } from '../src/config.js';
import { createRoundState } from '../src/roundState.js';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/storage.js', () => ({
    loadHighScore: vi.fn(() => 12),
    saveHighScore: vi.fn((s) => s),
    saveToLeaderboard: vi.fn(() => ({ entries: [], highlightId: null })),
}));

vi.mock('../src/audio.js', () => ({
    cycleSoundLevel: vi.fn(),
    formatSoundLabel: vi.fn(() => '100 %'),
    isAudioAvailable: vi.fn(() => true),
}));

describe('UI', () => {
    let scene;
    let ui;

    beforeEach(() => {
        scene = createBaseScene({ round: createRoundState() });
        ui = new UI(scene);
    });

    it('createScoreDisplay affiche 0', () => {
        ui.createScoreDisplay();
        expect(ui.scoreText).toBeTruthy();
        expect(scene.add.text).toHaveBeenCalled();
    });

    it('updateScore met à jour la valeur', () => {
        ui.createScoreDisplay();
        ui.scoreText = { setText: vi.fn() };
        ui.updateScore(3);
        expect(ui.scoreValue).toBe(3);
    });

    it('showMenu retourne des éléments UI', () => {
        const elements = ui.showMenu(DIFFICULTY.NORMAL, false);
        expect(elements.length).toBeGreaterThan(0);
    });

    it('showPause retourne boutons reprendre et menu', () => {
        const { elements } = ui.showPause({
            onResume: vi.fn(),
            onMenu: vi.fn(),
        });
        expect(elements.length).toBeGreaterThan(2);
    });

    it('refreshHighScore charge le record par difficulté', async () => {
        const { loadHighScore } = await import('../src/storage.js');
        vi.mocked(loadHighScore).mockClear();
        ui.refreshHighScore(DIFFICULTY.HARD);
        expect(loadHighScore).toHaveBeenLastCalledWith(DIFFICULTY.HARD, false, null);
    });

    it('createOverlay crée un rectangle plein écran', () => {
        const overlay = ui.createOverlay(0.5);
        expect(overlay).toBeTruthy();
        expect(scene.add.rectangle).toHaveBeenCalled();
    });

    it('setOverlay et clearOverlay gèrent les éléments', () => {
        const el = { destroy: vi.fn() };
        ui.setOverlay('menu', [el]);
        expect(ui._overlays.menu).toContain(el);
        ui.clearOverlay('menu');
        expect(el.destroy).toHaveBeenCalled();
        expect(ui._overlays.menu).toHaveLength(0);
    });

    it('showFlash crée un flash plein écran', () => {
        ui.showFlash();
        expect(scene.add.rectangle).toHaveBeenCalled();
        expect(scene.tweens.add).toHaveBeenCalled();
    });

    it('destroy nettoie score et overlays', () => {
        ui.scoreText = { destroy: vi.fn() };
        ui._diffBtnGraphics = { destroy: vi.fn() };
        ui.setOverlay('pause', [{ destroy: vi.fn() }]);
        ui.destroy();
        expect(ui.scoreText.destroy).toHaveBeenCalled();
        expect(ui._diffBtnLabels).toEqual([]);
    });
});
