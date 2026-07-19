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
    showHardcoreTutorial: vi.fn(),
    dismissHardcoreTutorial: vi.fn(() => false),
    showTrainingTutorial: vi.fn(),
    dismissTrainingTutorial: vi.fn(() => false),
    showScoreStreak: vi.fn(),
    showGameOverLoading: vi.fn(),
    hideGameOverLoading: vi.fn(),
}));

const menu = vi.hoisted(() => ({
    showMenu: vi.fn(() => []),
    updateTrainingLabel: vi.fn(),
    updateTrainingSpeedLabel: vi.fn(),
    updateHardcoreLabel: vi.fn(),
    updateDifficultyButtons: vi.fn(),
    refreshHighScore: vi.fn(),
}));

vi.mock('../src/ui/hud/uiHud.js', () => hud);
vi.mock('../src/ui/menu/uiMenu.js', () => menu);
vi.mock('../src/ui/menu/uiMenuOptions.js', () => ({
    toggleMenuOptions: vi.fn(),
    refreshHardcoreLockState: vi.fn(),
}));
vi.mock('../src/ui/menu/uiMenuScoresPanel.js', () => ({ toggleMenuScores: vi.fn() }));
vi.mock('../src/ui/menu/uiMenuSkinsPanel.js', () => ({ toggleMenuSkins: vi.fn() }));
vi.mock('../src/ui/menu/uiMenuSkinCycle.js', () => ({ cycleMenuSkin: vi.fn() }));
vi.mock('../src/ui/core/uiPause.js', () => ({ showPause: vi.fn(() => ({ elements: [] })) }));
vi.mock('../src/ui/gameOver/uiGameOverLoader.js', () => ({
    preloadGameOverUI: vi.fn(() => Promise.resolve()),
    buildGameOverUI: vi.fn(() => ({ elements: [] })),
}));
vi.mock('../src/highScores.js', () => ({
    loadHighScore: vi.fn(() => 0),
    loadBestScoreAny: vi.fn(() => 0),
    loadBestHardcoreScore: vi.fn(() => 0),
}));

import { UI } from '../src/ui/core/ui.js';
import { UI_FACADE_METHODS } from '../src/ui/core/uiFacadeBind.js';
import { toggleMenuOptions, refreshHardcoreLockState } from '../src/ui/menu/uiMenuOptions.js';
import { toggleMenuScores } from '../src/ui/menu/uiMenuScoresPanel.js';
import { toggleMenuSkins } from '../src/ui/menu/uiMenuSkinsPanel.js';
import { cycleMenuSkin } from '../src/ui/menu/uiMenuSkinCycle.js';
import { buildGameOverUI } from '../src/ui/gameOver/uiGameOverLoader.js';

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
        ui.showHardcoreTutorial();
        ui.dismissHardcoreTutorial();
        ui.showTrainingTutorial();
        ui.dismissTrainingTutorial();
        ui.showFlash();

        expect(hud.createScoreDisplay).toHaveBeenCalledWith(ui);
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
        ui.showGameOver({
            finalScore: 12,
            leaderboardData: { entries: [] },
            fadeIn: true,
            isNewRecord: false,
            hardcoreMode: false,
            dailyGoal: 0,
            activeSkinId: 'classic',
            deathCause: 'pipe',
        });
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

    it('expose les méthodes déléguées via uiFacadeBind', () => {
        expect(UI_FACADE_METHODS).toHaveLength(41);
        for (const name of UI_FACADE_METHODS) {
            expect(typeof ui[name]).toBe('function');
        }
    });
});
