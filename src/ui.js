import { GAME_CONFIG, DIFFICULTY, DIFFICULTY_ORDER } from './config.js';
import { cycleSoundLevel, formatSoundLabel, isAudioAvailable } from './audio.js';
import {
    loadHighScore,
    saveHighScore as persistHighScore,
    saveToLeaderboard,
} from './storage.js';
import {
    jumpHint,
    pauseResumeHint,
    difficultyHint,
} from './device.js';
import { buildGameOverUI } from './uiGameOver.js';
import {
    addCenteredText,
    diffButtonCenter,
    diffLabelColor,
    DIFF_BTN_ACTIVE,
    DIFF_BTN_HOVER,
    DIFF_BTN_IDLE,
    fitTitleFontSize,
    GAME_TITLE,
    MIN_TOUCH,
    MENU_BTN_COLOR,
    MENU_BTN_HOVER,
    PAUSE_BTN_COLOR,
    PAUSE_BTN_HOVER,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';

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
        this._inGameControlElements = [];
    }

    createOverlay(alpha = 0.7, depth = 50, color = 0x000000) {
        return this.scene.add.rectangle(
            GAME_CONFIG.centerX, GAME_CONFIG.centerY,
            GAME_CONFIG.width, GAME_CONFIG.height, color, alpha,
        ).setDepth(depth);
    }

    createScoreDisplay() {
        if (this.scoreText) this.scoreText.destroy();
        this.scoreValue = 0;
        this.scoreText = addCenteredText(this.scene, GAME_CONFIG.centerX, UI_LAYOUT.scoreHud, '0', {
            fontSize: '40px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3,
        }, 100);
    }

    hideInGameScore() {
        if (this.scoreText) {
            this.scoreText.setVisible(false);
        }
        this._destroyInGameControls();
    }

    _destroyInGameControls() {
        this._inGameControlElements.forEach(e => e?.destroy());
        this._inGameControlElements = [];
        this._pauseBtnGraphics = null;
        this._trainingBadge = null;
    }

    createInGameControls({ trainingMode, onPause }) {
        this._destroyInGameControls();
        const elements = [];
        const { playing } = UI_LAYOUT;

        if (trainingMode) {
            this._trainingBadge = addCenteredText(
                this.scene, GAME_CONFIG.centerX, playing.trainingBadgeY,
                'ENTRAÎNEMENT', {
                    fontSize: '10px',
                    fill: '#81D4FA',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 2,
                }, 99,
            );
            elements.push(this._trainingBadge);
        }

        this._pauseBtnGraphics = this.scene.add.graphics().setDepth(102);
        elements.push(this._pauseBtnGraphics);
        this._drawPauseButton(PAUSE_BTN_COLOR);

        const pauseHit = this.scene.add.rectangle(
            playing.pauseBtnX, playing.pauseBtnY, MIN_TOUCH, MIN_TOUCH, 0x000000, 0,
        );
        pauseHit.setDepth(103);
        pauseHit.setInteractive({ useHandCursor: true });
        pauseHit.on('pointerover', () => this._drawPauseButton(PAUSE_BTN_HOVER));
        pauseHit.on('pointerout', () => this._drawPauseButton(PAUSE_BTN_COLOR));
        pauseHit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            onPause();
        });
        elements.push(pauseHit);

        this._inGameControlElements = elements;
        return elements;
    }

    _drawPauseButton(fillColor) {
        if (!this._pauseBtnGraphics) return;
        const { playing } = UI_LAYOUT;
        const g = this._pauseBtnGraphics;
        const size = 28;
        g.clear();
        g.fillStyle(fillColor, 1);
        g.fillRoundedRect(playing.pauseBtnX - size / 2, playing.pauseBtnY - size / 2, size, size, 4);
        g.fillStyle(0xffffff, 1);
        const barW = 4;
        const barH = 14;
        const gap = 4;
        g.fillRect(playing.pauseBtnX - gap / 2 - barW, playing.pauseBtnY - barH / 2, barW, barH);
        g.fillRect(playing.pauseBtnX + gap / 2, playing.pauseBtnY - barH / 2, barW, barH);
    }

    updateScore(newScore) {
        this.scoreValue = newScore;
        if (this.scoreText) {
            this.scoreText.setText(String(this.scoreValue));
            this.scene.tweens.add({
                targets: this.scoreText,
                scaleX: 1.4,
                scaleY: 1.4,
                duration: 100,
                yoyo: true,
                ease: 'Quad.easeOut',
            });
        }
    }

    showRecordBroken() {
        const banner = addCenteredText(this.scene, GAME_CONFIG.centerX, 90, 'NOUVEAU RECORD !', {
            fontSize: '16px',
            fill: '#FDD835',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2,
        }, 101);
        this.scene.tweens.add({
            targets: banner,
            scaleX: { from: 0.8, to: 1.1 },
            scaleY: { from: 0.8, to: 1.1 },
            duration: 200,
            yoyo: true,
            repeat: 1,
            ease: 'Back.easeOut',
        });
        this.scene.tweens.add({
            targets: banner,
            alpha: { from: 1, to: 0 },
            y: 72,
            duration: 1400,
            delay: 600,
            ease: 'Power2',
            onComplete: () => banner.destroy(),
        });
    }

    showMenu(difficulty = DIFFICULTY.NORMAL, trainingMode = false) {
        if (this.scoreText) {
            this.scoreText.destroy();
            this.scoreText = null;
        }
        this._destroyInGameControls();

        this._currentDifficulty = difficulty;
        this.highScore = loadHighScore(difficulty);
        const elements = [];
        const { menu, diffBtn } = UI_LAYOUT;

        const overlay = this.createOverlay(0.22, 50);
        elements.push(overlay);

        const titleSize = fitTitleFontSize(this.scene, GAME_TITLE);
        const title = addCenteredText(this.scene, GAME_CONFIG.centerX, menu.title, GAME_TITLE, {
            fontSize: `${titleSize}px`,
            fill: '#FDD835',
            fontStyle: 'bold',
            stroke: '#E65100',
            strokeThickness: 3,
        }, 51);
        elements.push(title);

        const bestText = addCenteredText(this.scene, GAME_CONFIG.centerX, menu.best,
            `MEILLEUR (${GAME_CONFIG.difficultyLabels[difficulty]}) : ${this.highScore}`,
            { fontSize: '14px', fill: '#ffffff' }, 51);
        elements.push(bestText);

        this._trainingLabel = addCenteredText(this.scene, GAME_CONFIG.centerX, menu.training,
            this._trainingLabelText(trainingMode), {
                fontSize: '11px',
                fill: trainingMode ? '#81D4FA' : '#888888',
                fontStyle: 'bold',
            }, 51);
        elements.push(this._trainingLabel);

        const trainingHit = this.scene.add.rectangle(
            GAME_CONFIG.centerX, menu.training, 200, MIN_TOUCH, 0x000000, 0,
        );
        trainingHit.setDepth(54);
        trainingHit.setInteractive({ useHandCursor: true });
        trainingHit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            this.scene.toggleTraining();
        });
        elements.push(trainingHit);

        this._diffBtnGraphics = this.scene.add.graphics().setDepth(52);
        elements.push(this._diffBtnGraphics);
        this._drawDiffButtons(difficulty);

        this._diffBtnLabels = [];
        DIFFICULTY_ORDER.forEach((diff, i) => {
            const btnCx = diffButtonCenter(i);
            const label = addCenteredText(this.scene, btnCx, menu.difficulty,
                GAME_CONFIG.difficultyLabels[diff], {
                    fontSize: '9px',
                    fill: diffLabelColor(this._currentDifficulty, diff),
                    fontStyle: 'bold',
                }, 53);
            elements.push(label);
            this._diffBtnLabels.push({ label, diff });

            const hitZone = this.scene.add.rectangle(
                btnCx, menu.difficulty, diffBtn.width, MIN_TOUCH, 0x000000, 0,
            );
            hitZone.setDepth(54);
            hitZone.setInteractive({ useHandCursor: true });
            hitZone.on('pointerover', () => {
                this._hoveredDifficulty = diff;
                this._drawDiffButtons(this._currentDifficulty);
            });
            hitZone.on('pointerout', () => {
                this._hoveredDifficulty = null;
                this._drawDiffButtons(this._currentDifficulty);
            });
            hitZone.on('pointerdown', (_p, _lx, _ly, event) => {
                stopUiEvent(event);
                this.scene.changeDifficulty(diff);
            });
            elements.push(hitZone);
        });

        const startText = addCenteredText(this.scene, GAME_CONFIG.centerX, menu.start,
            'APPUYER POUR JOUER', { fontSize: '14px', fill: '#ffffff' }, 51);
        this.scene.tweens.add({
            targets: startText,
            alpha: 0,
            duration: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Power0',
        });
        elements.push(startText);

        elements.push(addCenteredText(this.scene, GAME_CONFIG.centerX, menu.hint1,
            jumpHint(), { fontSize: '11px', fill: '#ffffff' }, 52));
        elements.push(addCenteredText(this.scene, GAME_CONFIG.centerX, menu.hint2,
            `${difficultyHint()} · T : entraînement`, { fontSize: '11px', fill: '#ffffff' }, 52));

        const muteText = addCenteredText(this.scene, GAME_CONFIG.centerX, menu.mute,
            `SON : ${formatSoundLabel()}`, { fontSize: '11px', fill: '#cccccc' }, 52);
        elements.push(muteText);

        const muteHit = this.scene.add.rectangle(
            GAME_CONFIG.centerX, menu.mute, 140, MIN_TOUCH, 0x000000, 0,
        );
        muteHit.setDepth(54);
        if (isAudioAvailable()) {
            muteHit.setInteractive({ useHandCursor: true });
            muteHit.on('pointerdown', (_p, _lx, _ly, event) => {
                stopUiEvent(event);
                cycleSoundLevel();
                muteText.setText(`SON : ${formatSoundLabel()}`);
            });
        }
        elements.push(muteHit);

        [title, bestText, this._trainingLabel, startText].forEach(el => el.setAlpha(0));
        this.scene.tweens.add({
            targets: [title, bestText, this._trainingLabel, startText],
            alpha: 1,
            duration: 400,
            stagger: 80,
            ease: 'Power2',
        });

        return elements;
    }

    _trainingLabelText(enabled) {
        return enabled
            ? 'ENTRAÎNEMENT : ON (ralenti + fantôme)'
            : 'ENTRAÎNEMENT : OFF (T pour activer)';
    }

    updateTrainingLabel(trainingMode) {
        if (this._trainingLabel) {
            this._trainingLabel.setText(this._trainingLabelText(trainingMode));
            this._trainingLabel.setColor(trainingMode ? '#81D4FA' : '#888888');
        }
    }

    _drawDiffButtons(difficulty) {
        if (!this._diffBtnGraphics) return;
        const g = this._diffBtnGraphics;
        g.clear();

        const { diffBtn, menu } = UI_LAYOUT;

        DIFFICULTY_ORDER.forEach((diff, i) => {
            const bx = diffBtn.x[i];
            const by = menu.difficulty - diffBtn.height / 2;
            if (difficulty === diff) {
                g.fillStyle(DIFF_BTN_ACTIVE, 1);
            } else if (this._hoveredDifficulty === diff) {
                g.fillStyle(DIFF_BTN_HOVER.color, DIFF_BTN_HOVER.alpha);
            } else {
                g.fillStyle(DIFF_BTN_IDLE.color, DIFF_BTN_IDLE.alpha);
            }
            g.fillRoundedRect(bx, by, diffBtn.width, diffBtn.height, diffBtn.radius);
        });
    }

    updateDifficultyButtons(difficulty) {
        this._currentDifficulty = difficulty;
        this.highScore = loadHighScore(difficulty);
        this._hoveredDifficulty = null;
        this._drawDiffButtons(difficulty);

        this._diffBtnLabels.forEach(({ label, diff }) => {
            label.setColor(diffLabelColor(difficulty, diff));
        });
    }

    refreshHighScore(difficulty) {
        this._currentDifficulty = difficulty;
        this.highScore = loadHighScore(difficulty);
    }

    showPause({ onResume, onMenu }) {
        const { pause, menuBtn } = UI_LAYOUT;
        const overlay = this.createOverlay(0.65, 90);
        const elements = [overlay];

        const pauseTitle = addCenteredText(this.scene, GAME_CONFIG.centerX, pause.title,
            'PAUSE', { fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' }, 91);
        elements.push(pauseTitle);

        const resumeGraphics = this.scene.add.graphics().setDepth(92);
        elements.push(resumeGraphics);
        const resumeBtnY = pause.resumeBtn;
        const drawResume = (color) => {
            resumeGraphics.clear();
            resumeGraphics.fillStyle(color, 1);
            resumeGraphics.fillRoundedRect(
                GAME_CONFIG.centerX - menuBtn.width / 2,
                resumeBtnY - menuBtn.height / 2,
                menuBtn.width,
                menuBtn.height,
                menuBtn.radius,
            );
        };
        drawResume(MENU_BTN_COLOR);

        const resumeText = addCenteredText(this.scene, GAME_CONFIG.centerX, resumeBtnY,
            'REPRENDRE', { fontSize: '13px', fill: '#ffffff', fontStyle: 'bold' }, 93);
        elements.push(resumeText);

        const resumeHit = this.scene.add.rectangle(
            GAME_CONFIG.centerX, resumeBtnY, menuBtn.width, MIN_TOUCH, 0x000000, 0,
        );
        resumeHit.setDepth(94);
        resumeHit.setInteractive({ useHandCursor: true });
        resumeHit.on('pointerover', () => drawResume(MENU_BTN_HOVER));
        resumeHit.on('pointerout', () => drawResume(MENU_BTN_COLOR));
        resumeHit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            onResume();
        });
        elements.push(resumeHit);

        const menuGraphics = this.scene.add.graphics().setDepth(92);
        elements.push(menuGraphics);
        const menuBtnY = pause.menuBtn;
        const drawMenu = (color) => {
            menuGraphics.clear();
            menuGraphics.fillStyle(color, 1);
            menuGraphics.fillRoundedRect(
                GAME_CONFIG.centerX - menuBtn.width / 2,
                menuBtnY - menuBtn.height / 2,
                menuBtn.width,
                menuBtn.height,
                menuBtn.radius,
            );
        };
        drawMenu(MENU_BTN_COLOR);

        const menuText = addCenteredText(this.scene, GAME_CONFIG.centerX, menuBtnY,
            'MENU', { fontSize: '13px', fill: '#ffffff', fontStyle: 'bold' }, 93);
        elements.push(menuText);

        const menuHit = this.scene.add.rectangle(
            GAME_CONFIG.centerX, menuBtnY, menuBtn.width, MIN_TOUCH, 0x000000, 0,
        );
        menuHit.setDepth(94);
        menuHit.setInteractive({ useHandCursor: true });
        menuHit.on('pointerover', () => drawMenu(MENU_BTN_HOVER));
        menuHit.on('pointerout', () => drawMenu(MENU_BTN_COLOR));
        menuHit.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            onMenu();
        });
        elements.push(menuHit);

        elements.push(addCenteredText(this.scene, GAME_CONFIG.centerX, pause.menuBtn + 36,
            pauseResumeHint(), { fontSize: '11px', fill: '#cccccc' }, 91));

        return { elements };
    }

    showFlash() {
        const flash = this.scene.add.rectangle(
            GAME_CONFIG.centerX, GAME_CONFIG.centerY,
            GAME_CONFIG.width, GAME_CONFIG.height, 0xffffff, 0.8,
        );
        flash.setDepth(200);
        this.scene.tweens.add({
            targets: flash,
            alpha: { from: 0.8, to: 0 },
            duration: 166,
            ease: 'Power1',
            onComplete: () => flash.destroy(),
        });
    }

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

    showGameOver(finalScore, leaderboardData, fadeIn = false, isNewRecord = false) {
        return buildGameOverUI(this.scene, this, finalScore, leaderboardData, fadeIn, isNewRecord);
    }

    saveHighScore(score, difficulty = this._currentDifficulty) {
        this.highScore = persistHighScore(score, difficulty, this.highScore);
    }

    saveToLeaderboard(score, difficulty = this._currentDifficulty) {
        return saveToLeaderboard(score, difficulty);
    }

    destroy() {
        if (this.scoreText) this.scoreText.destroy();
        this._destroyInGameControls();
        if (this._diffBtnGraphics) this._diffBtnGraphics.destroy();
        if (this._menuBtnGraphics) this._menuBtnGraphics.destroy();
        this._diffBtnLabels = [];
    }
}
