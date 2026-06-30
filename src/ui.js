import { GAME_CONFIG, DIFFICULTY } from './config.js';
import {
    loadHighScore,
    saveHighScore as persistHighScore,
    saveToLeaderboard,
} from './storage.js';
import { buildGameOverUI } from './uiGameOver.js';
import { MENU_BTN_COLOR, UI_LAYOUT } from './uiLayout.js';
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
} from './uiHud.js';
import {
    showMenu,
    updateTrainingLabel,
    updateHardcoreLabel,
    updateDifficultyButtons,
    refreshHighScore,
} from './uiMenu.js';
import { showPause } from './uiPause.js';

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
    }

    createOverlay(alpha = 0.7, depth = 50, color = 0x000000) {
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
    showMenu(difficulty, trainingMode, hardcoreMode) {
        return showMenu(this, difficulty, trainingMode, hardcoreMode);
    }
    updateTrainingLabel(trainingMode) { updateTrainingLabel(this, trainingMode); }
    updateHardcoreLabel(hardcoreMode) { updateHardcoreLabel(this, hardcoreMode); }
    showJumpTutorial() { showJumpTutorial(this); }
    dismissJumpTutorial() { return dismissJumpTutorial(this); }
    updateDifficultyButtons(difficulty) { updateDifficultyButtons(this, difficulty); }
    refreshHighScore(difficulty, hardcoreMode = false) {
        refreshHighScore(this, difficulty, hardcoreMode);
    }
    showPause(opts) { return showPause(this, opts); }
    showFlash() { showFlash(this); }

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

    showGameOver(finalScore, leaderboardData, fadeIn = false, isNewRecord = false, hardcoreMode = false) {
        return buildGameOverUI(this.scene, this, finalScore, leaderboardData, fadeIn, isNewRecord, hardcoreMode);
    }

    saveHighScore(score, difficulty = this._currentDifficulty, hardcore = false) {
        this.highScore = persistHighScore(score, difficulty, this.highScore, hardcore);
    }

    saveToLeaderboard(score, difficulty = this._currentDifficulty, hardcore = false) {
        return saveToLeaderboard(score, difficulty, hardcore);
    }

    destroy() {
        if (this.scoreText) this.scoreText.destroy();
        destroyInGameControls(this);
        if (this._diffBtnGraphics) this._diffBtnGraphics.destroy();
        if (this._menuBtnGraphics) this._menuBtnGraphics.destroy();
        this._diffBtnLabels = [];
    }
}
