import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBaseScene } from './helpers/phaserMock.js';

vi.mock('../src/motion.js', () => ({
    sceneTween: vi.fn(),
}));

vi.mock('../src/dailyChallenge.js', () => ({
    formatDailyHudLabel: vi.fn((score, goal) => `${score}/${goal}`),
}));

vi.mock('../src/skins/index.js', () => ({
    getSkin: vi.fn(() => ({ label: 'Classic' })),
}));

describe('uiHudScore', () => {
    let scene;
    /** @type {import('../src/ui/core/ui.js').UI} */
    let ui;

    beforeEach(() => {
        scene = createBaseScene();
        ui = { scene, scoreValue: 0 };
    });

    it('createScoreDisplay détruit score et bannières existants', async () => {
        const { createScoreDisplay } = await import('../src/ui/hud/uiHudScore.js');
        const oldScore = { destroy: vi.fn() };
        const oldShadow = { destroy: vi.fn() };
        const oldRecord = { destroy: vi.fn() };
        const oldDaily = { destroy: vi.fn() };
        ui.scoreText = oldScore;
        ui._scoreTextShadow = oldShadow;
        ui._recordBanner = oldRecord;
        ui._dailyGoalBanner = oldDaily;

        createScoreDisplay(ui);

        expect(oldScore.destroy).toHaveBeenCalled();
        expect(oldShadow.destroy).toHaveBeenCalled();
        expect(oldRecord.destroy).toHaveBeenCalled();
        expect(oldDaily.destroy).toHaveBeenCalled();
        expect(ui._recordBanner).toBeNull();
        expect(ui._dailyGoalBanner).toBeNull();
        expect(ui._scoreTextShadow).toBeTruthy();
    });

    it('showInGameScore repositionne et affiche le score', async () => {
        const { showInGameScore } = await import('../src/ui/hud/uiHudScore.js');
        const { DEPTH, UI_LAYOUT } = await import('../src/ui/shared/uiLayout.js');
        ui.scoreText = {
            setVisible: vi.fn(),
            setAlpha: vi.fn(),
            setScale: vi.fn(),
            setY: vi.fn(),
            setDepth: vi.fn(),
        };
        ui._scoreTextShadow = {
            setVisible: vi.fn(),
            setAlpha: vi.fn(),
            setScale: vi.fn(),
            setY: vi.fn(),
            setDepth: vi.fn(),
        };

        showInGameScore(ui, UI_LAYOUT.scoreHud + 12);

        expect(ui.scoreText.setVisible).toHaveBeenCalledWith(true);
        expect(ui.scoreText.setY).toHaveBeenCalledWith(UI_LAYOUT.scoreHud + 12);
        expect(ui.scoreText.setDepth).toHaveBeenCalledWith(DEPTH.SCORE_HUD);
        expect(ui._scoreTextShadow.setVisible).toHaveBeenCalledWith(true);
        expect(ui._scoreTextShadow.setY).toHaveBeenCalledWith(UI_LAYOUT.scoreHud + 12 + 4);
    });

    it('updateScore met à jour le badge daily quand présent', async () => {
        const { updateScore } = await import('../src/ui/hud/uiHudScore.js');
        const { formatDailyHudLabel } = await import('../src/dailyChallenge.js');
        ui.scoreText = { setText: vi.fn(), setScale: vi.fn() };
        ui._scoreTextShadow = { setText: vi.fn(), setScale: vi.fn() };
        ui._dailyBadge = { setText: vi.fn() };
        scene.dailyGoal = 10;
        scene.activeSkinId = 'classic';

        updateScore(ui, 3);

        expect(formatDailyHudLabel).toHaveBeenCalledWith(3, 10);
        expect(ui.scoreText.setText).toHaveBeenCalledWith('3');
        expect(ui._scoreTextShadow.setText).toHaveBeenCalledWith('3');
        expect(ui._dailyBadge.setText).toHaveBeenCalledWith('3/10 · Classic');
    });
});
