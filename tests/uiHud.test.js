import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UI } from '../src/ui/core/ui.js';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
    prefersReducedMotion: vi.fn(() => false),
}));

describe('uiHud', () => {
    let scene;
    let ui;

    beforeEach(() => {
        scene = createBaseScene();
        ui = new UI(scene);
        ui._inGameControlElements = [];
    });

    it('createScoreDisplay affiche 0 visible en haut du HUD', async () => {
        const { createScoreDisplay } = await import('../src/ui/hud/uiHud.js');
        const { DEPTH, UI_LAYOUT } = await import('../src/ui/shared/uiLayout.js');
        createScoreDisplay(ui);
        expect(ui.scoreText).toBeTruthy();
        expect(ui.scoreValue).toBe(0);
        expect(ui.scoreText.visible).toBe(true);
        expect(ui.scoreText.alpha).toBe(1);
        expect(ui.scoreText.depth).toBe(DEPTH.SCORE_HUD);
        expect(ui.scoreText.y).toBe(UI_LAYOUT.scoreHud);
    });

    it('createInGameControls repositionne le score sous les badges', async () => {
        const { createScoreDisplay, createInGameControls } = await import('../src/ui/hud/uiHud.js');
        const { UI_LAYOUT } = await import('../src/ui/shared/uiLayout.js');
        createScoreDisplay(ui);
        createInGameControls(ui, {
            trainingMode: true,
            hardcoreMode: true,
            dailyMode: true,
            dailyGoal: 5,
            activeSkinId: 'classic',
            onPause: vi.fn(),
        });
        expect(ui.scoreText.visible).toBe(true);
        expect(ui.scoreText.y).toBeGreaterThan(UI_LAYOUT.scoreHud - 1);
    });

    it('updateScore met à jour le texte', async () => {
        const { createScoreDisplay, updateScore } = await import('../src/ui/hud/uiHud.js');
        createScoreDisplay(ui);
        ui.scoreText.setText = vi.fn();
        updateScore(ui, 4);
        expect(ui.scoreValue).toBe(4);
        expect(ui.scoreText.setText).toHaveBeenCalledWith('4');
    });

    it('createInGameControls ajoute pause et badges modes', async () => {
        const { createInGameControls } = await import('../src/ui/hud/uiHud.js');
        const { MIN_TOUCH, MIN_CTA_TOUCH, PAUSE_BTN_HIT, PAUSE_BTN_VISUAL } =
            await import('../src/ui/shared/uiLayout.js');
        const onPause = vi.fn();
        const elements = createInGameControls(ui, {
            trainingMode: true,
            hardcoreMode: true,
            onPause,
        });
        expect(elements.length).toBeGreaterThan(2);
        expect(ui._trainingBadge).toBeTruthy();
        expect(ui._hardcoreBadge).toBeTruthy();
        const pauseHit = scene.add.rectangle.mock.calls.find(
            ([, , w, h]) => w === PAUSE_BTN_HIT && h === PAUSE_BTN_HIT
        );
        expect(pauseHit).toBeTruthy();
        expect(PAUSE_BTN_HIT).toBe(MIN_CTA_TOUCH);
        expect(PAUSE_BTN_VISUAL).toBe(MIN_TOUCH);
    });

    it('hideInGameScore masque le score et détruit les contrôles', async () => {
        const { createScoreDisplay, createInGameControls, hideInGameScore, showInGameScore } =
            await import('../src/ui/hud/uiHud.js');
        createScoreDisplay(ui);
        ui.scoreText.setVisible = vi.fn();
        createInGameControls(ui, { trainingMode: false, hardcoreMode: false, onPause: vi.fn() });
        hideInGameScore(ui);
        expect(ui.scoreText.setVisible).toHaveBeenCalledWith(false);
        expect(ui._inGameControlElements).toHaveLength(0);
        showInGameScore(ui);
        expect(ui.scoreText.setVisible).toHaveBeenCalledWith(true);
    });

    it('dismissJumpTutorial détruit le hint', async () => {
        const { showJumpTutorial, dismissJumpTutorial } = await import('../src/ui/hud/uiHud.js');
        showJumpTutorial(ui);
        expect(dismissJumpTutorial(ui)).toBe(true);
        expect(ui._tutorialHint).toBeNull();
    });
});
