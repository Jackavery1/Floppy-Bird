import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DIFFICULTY } from '../src/config.js';
import { createRoundState } from '../src/roundState.js';
import { createBaseScene, createGraphicsMock } from './helpers/phaserMock.js';

const hud = vi.hoisted(() => ({
    createScoreDisplay: vi.fn(),
    hideInGameScore: vi.fn(),
    createInGameControls: vi.fn(() => []),
    updateScore: vi.fn(),
    showRecordBroken: vi.fn(),
    showFlash: vi.fn(),
    destroyInGameControls: vi.fn(),
    showJumpTutorial: vi.fn(),
    dismissJumpTutorial: vi.fn(() => false),
    showGapTutorial: vi.fn(),
    showScoreTutorial: vi.fn(),
    dismissGameplayTutorial: vi.fn(() => false),
    showDailyGoalReached: vi.fn(),
    showDailyGoalBrief: vi.fn(),
    showDifficultyEscalation: vi.fn(),
    showDifficultyEscalationPreview: vi.fn(),
    showSpeedBoostPreview: vi.fn(),
    showCoyoteHint: vi.fn(),
    showHardcoreInvincibilityHint: vi.fn(),
    showHardcoreTutorial: vi.fn(),
    dismissHardcoreTutorial: vi.fn(() => false),
    showTrainingTutorial: vi.fn(),
    dismissTrainingTutorial: vi.fn(() => false),
    showScoreStreak: vi.fn(),
}));

const menu = vi.hoisted(() => ({
    showMenu: vi.fn(() => []),
    updateTrainingLabel: vi.fn(),
    updateTrainingSpeedLabel: vi.fn(),
    updateHardcoreLabel: vi.fn(),
    updateDifficultyButtons: vi.fn(),
    refreshHighScore: vi.fn(),
}));

vi.mock('../src/uiHud.js', () => hud);
vi.mock('../src/uiMenu.js', () => menu);
vi.mock('../src/uiMenuOptions.js', () => ({
    toggleMenuOptions: vi.fn(),
    refreshHardcoreLockState: vi.fn(),
}));
vi.mock('../src/uiMenuScoresPanel.js', () => ({ toggleMenuScores: vi.fn() }));
vi.mock('../src/uiMenuSkinsPanel.js', () => ({ toggleMenuSkins: vi.fn() }));
vi.mock('../src/uiMenuSkins.js', () => ({ cycleMenuSkin: vi.fn() }));
vi.mock('../src/uiPause.js', () => ({ showPause: vi.fn(() => ({ elements: [] })) }));
vi.mock('../src/uiGameOverLoader.js', () => ({
    preloadGameOverUI: vi.fn(() => Promise.resolve()),
    buildGameOverUI: vi.fn(() => ({ elements: [] })),
}));
vi.mock('../src/storage.js', () => ({ loadHighScore: vi.fn(() => 0) }));

import { UI } from '../src/ui.js';
import { toggleMenuOptions, refreshHardcoreLockState } from '../src/uiMenuOptions.js';
import { toggleMenuScores } from '../src/uiMenuScoresPanel.js';
import { toggleMenuSkins } from '../src/uiMenuSkinsPanel.js';
import { cycleMenuSkin } from '../src/uiMenuSkins.js';
import { buildGameOverUI } from '../src/uiGameOverLoader.js';

describe('UI façade — délégation', () => {
    let ui;
    let scene;

    beforeEach(() => {
        vi.clearAllMocks();
        scene = createBaseScene({ round: createRoundState() });
        ui = new UI(scene);
    });

    it('délègue les méthodes HUD', () => {
        ui.createScoreDisplay();
        ui.hideInGameScore();
        ui.createInGameControls({ onPause: vi.fn() });
        ui.updateScore(4);
        ui.showRecordBroken();
        ui.showDailyGoalReached();
        ui.showDailyGoalBrief(5);
        ui.showDifficultyEscalation();
        ui.showScoreStreak(10);
        ui.showJumpTutorial();
        ui.showGapTutorial();
        ui.showScoreTutorial();
        ui.dismissJumpTutorial();
        ui.dismissGameplayTutorial();
        ui.showDifficultyEscalationPreview();
        ui.showSpeedBoostPreview();
        ui.showCoyoteHint();
        ui.showHardcoreInvincibilityHint(700);
        ui.showHardcoreTutorial();
        ui.dismissHardcoreTutorial();
        ui.showTrainingTutorial();
        ui.dismissTrainingTutorial();
        ui.showFlash();

        expect(hud.createScoreDisplay).toHaveBeenCalledWith(ui);
        expect(hud.showCoyoteHint).toHaveBeenCalledWith(ui);
        expect(hud.showHardcoreInvincibilityHint).toHaveBeenCalledWith(ui, 700);
        expect(hud.showFlash).toHaveBeenCalledWith(ui);
    });

    it('délègue les méthodes menu', () => {
        ui.showMenu(DIFFICULTY.EASY, true, false);
        ui.updateTrainingLabel(true);
        ui.updateHardcoreLabel(false);
        ui.updateDifficultyButtons(DIFFICULTY.HARD);
        ui.refreshHighScore(DIFFICULTY.HARD, true, 'classic');

        expect(menu.showMenu).toHaveBeenCalledWith(ui, DIFFICULTY.EASY, true, false);
        expect(menu.refreshHighScore).toHaveBeenCalledWith(ui, DIFFICULTY.HARD, true, 'classic');
    });

    it('délègue les panneaux et skins', () => {
        ui.toggleMenuOptionsPanel();
        ui.toggleMenuScoresPanel();
        ui.toggleMenuSkinsPanel();
        ui.cycleMenuSkin(1);
        ui.refreshHardcoreLockState();

        expect(toggleMenuOptions).toHaveBeenCalledWith(ui);
        expect(toggleMenuScores).toHaveBeenCalledWith(ui);
        expect(toggleMenuSkins).toHaveBeenCalledWith(ui);
        expect(cycleMenuSkin).toHaveBeenCalledWith(ui, 1);
        expect(refreshHardcoreLockState).toHaveBeenCalledWith(ui);
    });

    it('délègue showGameOver', () => {
        ui.showGameOver(12, { entries: [] }, true, false, false, 0, 'classic', 'pipe');
        expect(buildGameOverUI).toHaveBeenCalled();
    });

    it('drawGameOverRestartButton et drawGameOverMenuButton dessinent si graphics présents', () => {
        ui._restartBtnGraphics = createGraphicsMock();
        ui._menuBtnGraphics = createGraphicsMock();
        ui.drawGameOverRestartButton(300);
        ui.drawGameOverMenuButton(360);
        expect(ui._restartBtnGraphics.clear).toHaveBeenCalled();
        expect(ui._menuBtnGraphics.fillRoundedRect).toHaveBeenCalled();
    });

    it('drawGameOverRestartButton est no-op sans graphics', () => {
        expect(() => ui.drawGameOverRestartButton(300)).not.toThrow();
    });
});
