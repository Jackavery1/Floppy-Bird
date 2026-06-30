import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UI } from '../src/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
}));

describe('uiHud', () => {
    let scene;
    let ui;

    beforeEach(() => {
        scene = createBaseScene();
        ui = new UI(scene);
        ui._inGameControlElements = [];
    });

    it('createScoreDisplay affiche 0', async () => {
        const { createScoreDisplay } = await import('../src/uiHud.js');
        createScoreDisplay(ui);
        expect(ui.scoreText).toBeTruthy();
        expect(ui.scoreValue).toBe(0);
    });

    it('updateScore met à jour le texte', async () => {
        const { createScoreDisplay, updateScore } = await import('../src/uiHud.js');
        createScoreDisplay(ui);
        ui.scoreText.setText = vi.fn();
        updateScore(ui, 4);
        expect(ui.scoreValue).toBe(4);
        expect(ui.scoreText.setText).toHaveBeenCalledWith('4');
    });

    it('createInGameControls ajoute pause et badges modes', async () => {
        const { createInGameControls } = await import('../src/uiHud.js');
        const onPause = vi.fn();
        const elements = createInGameControls(ui, {
            trainingMode: true,
            hardcoreMode: true,
            onPause,
        });
        expect(elements.length).toBeGreaterThan(2);
        expect(ui._trainingBadge).toBeTruthy();
        expect(ui._hardcoreBadge).toBeTruthy();
    });

    it('hideInGameScore masque le score et détruit les contrôles', async () => {
        const { createScoreDisplay, createInGameControls, hideInGameScore } = await import('../src/uiHud.js');
        createScoreDisplay(ui);
        ui.scoreText.setVisible = vi.fn();
        createInGameControls(ui, { trainingMode: false, hardcoreMode: false, onPause: vi.fn() });
        hideInGameScore(ui);
        expect(ui.scoreText.setVisible).toHaveBeenCalledWith(false);
        expect(ui._inGameControlElements).toHaveLength(0);
    });

    it('showRecordBroken crée une bannière', async () => {
        const { showRecordBroken } = await import('../src/uiHud.js');
        showRecordBroken(ui);
        expect(scene.add.text).toHaveBeenCalled();
    });

    it('showFlash ajoute un rectangle plein écran', async () => {
        const { showFlash } = await import('../src/uiHud.js');
        showFlash(ui);
        expect(scene.add.rectangle).toHaveBeenCalled();
    });

    it('dismissJumpTutorial détruit le hint', async () => {
        const { showJumpTutorial, dismissJumpTutorial } = await import('../src/uiHud.js');
        showJumpTutorial(ui);
        expect(dismissJumpTutorial(ui)).toBe(true);
        expect(ui._tutorialHint).toBeNull();
    });
});
