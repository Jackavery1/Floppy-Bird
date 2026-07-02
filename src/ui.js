import { GAME_CONFIG, DIFFICULTY } from './config.js';
import { Utils } from './utils.js';
import { loadHighScore } from './storage.js';
import { buildGameOverUI } from './uiGameOver.js';
import { DEPTH, MENU_BTN_COLOR, UI_LAYOUT } from './uiLayout.js';
import {
    createScoreDisplay,
    hideInGameScore,
    createInGameControls,
    updateScore,
    showRecordBroken,
    showFlash,
    destroyInGameControls,
    showJumpTutorial,
    dismissJumpTutorial,
    showDailyGoalReached,
} from './uiHud.js';
import {
    showMenu,
    updateTrainingLabel,
    updateHardcoreLabel,
    updateDifficultyButtons,
    refreshHighScore as refreshMenuHighScore,
    toggleMenuOptionsPanel,
    toggleMenuScoresPanel,
    toggleMenuSkinsPanel,
} from './uiMenu.js';
import { showPause } from './uiPause.js';
import { refreshHardcoreLockState } from './uiMenuOptions.js';

export class UI {
    constructor(scene) {
        this.scene = scene;
        this.scoreText = null;
        this.scoreValue = 0;
        this.highScore = loadHighScore(DIFFICULTY.NORMAL);

        this._diffBtnGraphics = null;
        this._diffBtnLabels = [];
        this._currentDifficulty = DIFFICULTY.NORMAL;
        this._menuBtnGraphics = null;
        this._pauseBtnGraphics = null;
        this._trainingBadge = null;
        this._hoveredDifficulty = null;
        this._trainingLabel = null;
        this._hardcoreLabel = null;
        this._tutorialHint = null;
        this._inGameControlElements = [];
        this._overlays = { menu: [], pause: [], gameOver: [] };
    }

    /** @param {'menu' | 'pause' | 'gameOver'} key */
    clearOverlay(key) {
        Utils.clearElements(this._overlays[key]);
    }

    /** @param {'menu' | 'pause' | 'gameOver'} key @param {import('phaser').GameObjects.GameObject[]} elements */
    setOverlay(key, elements) {
        this.clearOverlay(key);
        this._overlays[key].push(...elements);
    }

    createOverlay(alpha = 0.7, depth = DEPTH.OVERLAY_DIM, color = 0x000000) {
        return this.scene.add.rectangle(
            GAME_CONFIG.centerX, GAME_CONFIG.centerY,
            GAME_CONFIG.width, GAME_CONFIG.height, color, alpha,
        ).setDepth(depth);
    }

    createScoreDisplay() { createScoreDisplay(this); }
    hideInGameScore() { hideInGameScore(this); }
    createInGameControls(opts) { return createInGameControls(this, opts); }
    updateScore(newScore) { updateScore(this, newScore); }
    showRecordBroken() { showRecordBroken(this); }
    showDailyGoalReached() { showDailyGoalReached(this); }
    showMenu(difficulty, trainingMode, hardcoreMode) {
        return showMenu(this, difficulty, trainingMode, hardcoreMode);
    }
    updateTrainingLabel(trainingMode) { updateTrainingLabel(this, trainingMode); }
    updateHardcoreLabel(hardcoreMode) { updateHardcoreLabel(this, hardcoreMode); }
    showJumpTutorial() { showJumpTutorial(this); }
    dismissJumpTutorial() { return dismissJumpTutorial(this); }
    updateDifficultyButtons(difficulty) { updateDifficultyButtons(this, difficulty); }
    refreshHighScore(difficulty, hardcoreMode = false, skinId = null) {
        refreshMenuHighScore(this, difficulty, hardcoreMode, skinId);
    }
    toggleMenuOptionsPanel() { toggleMenuOptionsPanel(this); }
    toggleMenuScoresPanel() { toggleMenuScoresPanel(this); }
    toggleMenuSkinsPanel() { toggleMenuSkinsPanel(this); }
    showPause(opts) { return showPause(this, opts); }
    showFlash() { showFlash(this); }
    refreshHardcoreLockState() { refreshHardcoreLockState(this); }

    drawGameOverMenuButton(menuBtnY, fillColor = MENU_BTN_COLOR) {
        const { menuBtn } = UI_LAYOUT;
        const g = this._menuBtnGraphics;
        if (!g) return;
        g.clear();
        g.fillStyle(fillColor, 1);
        g.fillRoundedRect(
            GAME_CONFIG.centerX - menuBtn.width / 2,
            menuBtnY - menuBtn.height / 2,
            menuBtn.width,
            menuBtn.height,
            menuBtn.radius,
        );
    }

    showGameOver(finalScore, leaderboardData, fadeIn = false, isNewRecord = false, hardcoreMode = false, dailyGoal = 0, activeSkinId = 'classic') {
        return buildGameOverUI(
            this.scene, this, finalScore, leaderboardData, fadeIn, isNewRecord, hardcoreMode, dailyGoal, activeSkinId,
        );
    }

    destroy() {
        if (this.scoreText) this.scoreText.destroy();
        if (this._scoreShadow) this._scoreShadow.destroy();
        destroyInGameControls(this);
        this.clearOverlay('menu');
        this.clearOverlay('pause');
        this.clearOverlay('gameOver');
        if (this._diffBtnGraphics) this._diffBtnGraphics.destroy();
        if (this._menuBtnGraphics) this._menuBtnGraphics.destroy();
        this._diffBtnLabels = [];
    }
}
