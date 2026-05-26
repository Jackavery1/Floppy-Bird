import { GAME_CONFIG } from './config.js';
import { cycleSoundLevel, formatSoundLabel, isAudioAvailable } from './audio.js';
import { DIFFICULTY } from './gameConstants.js';
import {
    UI_LAYOUT,
    GAME_OVER_PANEL,
    layoutX,
    layoutDiffButtonCenter,
} from './uiLayout.js';

const MENU_BTN_COLOR = 0x1565C0;
const MENU_BTN_HOVER = 0x42A5F5;
const DIFF_BTN_ACTIVE = 0xFDD835;
const DIFF_BTN_IDLE = { color: 0xffffff, alpha: 0.2 };
const DIFF_BTN_HOVER = { color: 0xffffff, alpha: 0.38 };
const TITLE_MAX_WIDTH = 260;
const GAME_TITLE = 'FLOPPY BIRD';

function fitTitleFontSize(scene, text, maxWidth = TITLE_MAX_WIDTH) {
    let fontSize = 48;
    while (fontSize >= 14) {
        const probe = scene.make.text({
            x: 0,
            y: 0,
            text,
            style: {
                fontSize: `${fontSize}px`,
                fontStyle: 'bold',
                fontFamily: 'Arial',
                stroke: '#E65100',
                strokeThickness: 3,
            },
            add: false,
        });
        if (probe.width < maxWidth) {
            probe.destroy();
            return fontSize;
        }
        probe.destroy();
        fontSize -= 2;
    }
    return 26;
}

export class UI {
    constructor(scene) {
        this.scene = scene;
        this.scoreText = null;
        this.scoreValue = 0;
        this.highScore = this.loadHighScore();

        this._diffBtnGraphics = null;
        this._diffBtnLabels = [];
        this._currentDifficulty = DIFFICULTY.NORMAL;
        this._menuBtnGraphics = null;
        this._hoveredDifficulty = null;
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
        this.scoreText = this.scene.add.text(layoutX(), UI_LAYOUT.scoreHud, '0', {
            fontSize: '40px',
            fill: '#ffffff',
            fontStyle: 'bold',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 3,
        });
        this.scoreText.setOrigin(0.5, 0.5);
        this.scoreText.setDepth(100);
    }

    hideInGameScore() {
        if (this.scoreText) {
            this.scoreText.setVisible(false);
        }
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

    showMenu(difficulty = DIFFICULTY.NORMAL) {
        if (this.scoreText) {
            this.scoreText.destroy();
            this.scoreText = null;
        }

        this._currentDifficulty = difficulty;
        const elements = [];
        const { menu, diffBtn } = UI_LAYOUT;

        const overlay = this.createOverlay(0.22, 50);
        elements.push(overlay);

        const titleSize = fitTitleFontSize(this.scene, GAME_TITLE);
        const title = this.scene.add.text(layoutX(), menu.title, GAME_TITLE, {
            fontSize: `${titleSize}px`,
            fill: '#FDD835',
            fontStyle: 'bold',
            fontFamily: 'Arial',
            stroke: '#E65100',
            strokeThickness: 3,
        });
        title.setOrigin(0.5, 0.5);
        title.setDepth(51);
        elements.push(title);

        const bestText = this.scene.add.text(layoutX(), menu.best, `MEILLEUR : ${this.highScore}`, {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial',
        });
        bestText.setOrigin(0.5, 0.5);
        bestText.setDepth(51);
        elements.push(bestText);

        this._diffBtnGraphics = this.scene.add.graphics().setDepth(52);
        elements.push(this._diffBtnGraphics);
        this._drawDiffButtons(difficulty);

        const diffs = [DIFFICULTY.EASY, DIFFICULTY.NORMAL, DIFFICULTY.HARD];
        const labels = ['FACILE', 'NORMAL', 'DIFFICILE'];

        this._diffBtnLabels = [];
        diffs.forEach((diff, i) => {
            const btnCx = layoutDiffButtonCenter(i);
            const label = this.scene.add.text(btnCx, menu.difficulty, labels[i], {
                fontSize: '9px',
                fill: this._currentDifficulty === diff ? '#000000' : '#ffffff',
                fontStyle: 'bold',
                fontFamily: 'Arial',
            });
            label.setOrigin(0.5, 0.5);
            label.setDepth(53);
            elements.push(label);
            this._diffBtnLabels.push({ label, diff });

            const hitZone = this.scene.add.rectangle(
                btnCx, menu.difficulty, diffBtn.width, diffBtn.height, 0x000000, 0,
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
                if (event?.stopPropagation) event.stopPropagation();
                this.scene.changeDifficulty(diff);
            });
            elements.push(hitZone);
        });

        const startText = this.scene.add.text(layoutX(), menu.start, 'APPUYER POUR JOUER', {
            fontSize: '14px',
            fill: '#ffffff',
            fontFamily: 'Arial',
        });
        startText.setOrigin(0.5, 0.5);
        startText.setDepth(51);
        this.scene.tweens.add({
            targets: startText,
            alpha: 0,
            duration: 400,
            yoyo: true,
            repeat: -1,
            ease: 'Power0',
        });
        elements.push(startText);

        const hint1 = this.scene.add.text(layoutX(), menu.hint1, 'ESPACE / TAP : sauter', {
            fontSize: '11px', fill: '#ffffff', fontFamily: 'Arial',
        });
        hint1.setOrigin(0.5, 0.5);
        hint1.setDepth(52);
        elements.push(hint1);

        const hint2 = this.scene.add.text(layoutX(), menu.hint2, '1  2  3 : difficulté', {
            fontSize: '11px', fill: '#ffffff', fontFamily: 'Arial',
        });
        hint2.setOrigin(0.5, 0.5);
        hint2.setDepth(52);
        elements.push(hint2);

        const muteText = this.scene.add.text(
            layoutX(), menu.mute, `SON : ${formatSoundLabel()}`,
            { fontSize: '11px', fill: '#cccccc', fontFamily: 'Arial' },
        );
        muteText.setOrigin(0.5, 0.5);
        muteText.setDepth(52);
        elements.push(muteText);

        const muteHit = this.scene.add.rectangle(layoutX(), menu.mute, 110, 22, 0x000000, 0);
        muteHit.setDepth(54);
        if (isAudioAvailable()) {
            muteHit.setInteractive({ useHandCursor: true });
            muteHit.on('pointerdown', (_p, _lx, _ly, event) => {
                if (event?.stopPropagation) event.stopPropagation();
                cycleSoundLevel();
                muteText.setText(`SON : ${formatSoundLabel()}`);
            });
        }
        elements.push(muteHit);

        [title, bestText, startText].forEach(el => el.setAlpha(0));
        this.scene.tweens.add({
            targets: [title, bestText, startText],
            alpha: 1,
            duration: 400,
            stagger: 80,
            ease: 'Power2',
        });

        return elements;
    }

    _drawDiffButtons(difficulty) {
        if (!this._diffBtnGraphics) return;
        const g = this._diffBtnGraphics;
        g.clear();

        const { diffBtn, menu } = UI_LAYOUT;
        const diffs = [DIFFICULTY.EASY, DIFFICULTY.NORMAL, DIFFICULTY.HARD];

        diffs.forEach((diff, i) => {
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
        this._hoveredDifficulty = null;
        this._drawDiffButtons(difficulty);

        this._diffBtnLabels.forEach(({ label, diff }) => {
            label.setColor(difficulty === diff ? '#000000' : '#ffffff');
        });
    }

    showPause() {
        const { pause } = UI_LAYOUT;
        const overlay = this.createOverlay(0.65, 90);

        const pauseTitle = this.scene.add.text(layoutX(), pause.title, 'PAUSE', {
            fontSize: '32px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'Arial',
        });
        pauseTitle.setOrigin(0.5, 0.5);
        pauseTitle.setDepth(91);

        const escHint = this.scene.add.text(layoutX(), pause.escHint, 'ESC : reprendre', {
            fontSize: '12px', fill: '#ffffff', fontFamily: 'Arial',
        });
        escHint.setOrigin(0.5, 0.5);
        escHint.setDepth(91);

        const menuHint = this.scene.add.text(layoutX(), pause.menuHint, 'M : menu', {
            fontSize: '12px', fill: '#ffffff', fontFamily: 'Arial',
        });
        menuHint.setOrigin(0.5, 0.5);
        menuHint.setDepth(91);

        return { overlay, pauseText: pauseTitle, elements: [overlay, pauseTitle, escHint, menuHint] };
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

    _drawGameOverMenuButton(fillColor) {
        const { menuBtn } = UI_LAYOUT;
        const g = this._menuBtnGraphics;
        const y = this._gameOverMenuBtnY;
        g.clear();
        g.fillStyle(fillColor, 1);
        g.fillRoundedRect(
            layoutX() - menuBtn.width / 2,
            y - menuBtn.height / 2,
            menuBtn.width,
            menuBtn.height,
            menuBtn.radius,
        );
    }

    showGameOver(finalScore, leaderboardData, fadeIn = false) {
        this.hideInGameScore();

        const { entries, highlightId } = leaderboardData;
        const P = GAME_OVER_PANEL;
        const cx = P.x + P.w / 2;

        const overlay = this.scene.add.rectangle(
            GAME_CONFIG.centerX, GAME_CONFIG.centerY,
            GAME_CONFIG.width, GAME_CONFIG.height,
            0x000000, 0.75,
        );
        overlay.setDepth(50);

        const panel = this.scene.add.graphics().setDepth(51);
        panel.fillStyle(0x141E30, 0.92);
        panel.fillRoundedRect(P.x, P.y, P.w, P.h, P.radius);
        panel.lineStyle(2, 0xFFD700, 1);
        panel.strokeRoundedRect(P.x, P.y, P.w, P.h, P.radius);

        const y = (offset) => P.y + offset;

        const gameOverText = this.scene.add.text(cx, y(28), 'GAME OVER', {
            fontSize: '24px', fill: '#FF1744', fontStyle: 'bold', fontFamily: 'Arial',
            stroke: '#8B0000', strokeThickness: 2,
        });
        gameOverText.setOrigin(0.5, 0.5);
        gameOverText.setDepth(52);

        let medal = null;
        const medalY = y(58);
        const medalColor = finalScore > 20 ? 0xFFD700 : finalScore > 10 ? 0x9E9E9E : finalScore > 5 ? 0xCD7F32 : null;
        if (medalColor !== null) {
            const mg = this.scene.add.graphics().setDepth(52);
            mg.fillStyle(medalColor, 1);
            mg.fillCircle(cx, medalY, 20);
            mg.fillStyle(0xFFFFFF, 0.4);
            const pts = [];
            for (let i = 0; i < 10; i++) {
                const a = (i * Math.PI / 5) - Math.PI / 2;
                const r = i % 2 === 0 ? 12 : 6;
                pts.push({ x: cx + Math.cos(a) * r, y: medalY + Math.sin(a) * r });
            }
            mg.fillPoints(pts, true);
            medal = mg;
        }

        const scoreLbl = this.scene.add.text(cx, y(82), 'SCORE', {
            fontSize: '10px', fill: '#ffffff', fontFamily: 'Arial',
        });
        scoreLbl.setOrigin(0.5, 0.5);
        scoreLbl.setDepth(52);

        const scoreText = this.scene.add.text(cx, y(102), String(finalScore), {
            fontSize: '22px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'Arial',
        });
        scoreText.setOrigin(0.5, 0.5);
        scoreText.setDepth(52);

        const highLbl = this.scene.add.text(cx, y(125), 'MEILLEUR', {
            fontSize: '9px', fill: '#FDD835', fontFamily: 'Arial',
        });
        highLbl.setOrigin(0.5, 0.5);
        highLbl.setDepth(52);

        const highScoreText = this.scene.add.text(cx, y(143), String(this.highScore), {
            fontSize: '16px', fill: '#FDD835', fontStyle: 'bold', fontFamily: 'Arial',
        });
        highScoreText.setOrigin(0.5, 0.5);
        highScoreText.setDepth(52);

        const leaderboardElements = [];

        const topLbl = this.scene.add.text(cx, y(168), '— TOP 5 —', {
            fontSize: '9px', fill: '#90CAF9', fontFamily: 'Arial', fontStyle: 'bold',
        });
        topLbl.setOrigin(0.5, 0.5);
        topLbl.setDepth(52);
        leaderboardElements.push(topLbl);

        entries.forEach((entry, i) => {
            const isNew = entry.id === highlightId;
            const ligne = this.scene.add.text(cx, y(183 + i * 13), `${i + 1}. ${entry.score}`, {
                fontSize: '11px',
                fill: isNew ? '#ffff00' : '#cccccc',
                fontFamily: 'Arial',
                fontStyle: isNew ? 'bold' : 'normal',
            });
            ligne.setOrigin(0.5, 0.5);
            ligne.setDepth(52);
            leaderboardElements.push(ligne);
        });

        const restartText = this.scene.add.text(cx, y(252), 'ESPACE / TAP : rejouer', {
            fontSize: '9px', fill: '#ffffff', fontStyle: 'italic', fontFamily: 'Arial',
        });
        restartText.setOrigin(0.5, 0.5);
        restartText.setDepth(52);

        this._gameOverMenuBtnY = y(285);
        this._menuBtnGraphics = this.scene.add.graphics().setDepth(53);
        this._drawGameOverMenuButton(MENU_BTN_COLOR);

        const menuBtnText = this.scene.add.text(cx, this._gameOverMenuBtnY, 'MENU', {
            fontSize: '13px', fill: '#ffffff', fontStyle: 'bold', fontFamily: 'Arial',
        });
        menuBtnText.setOrigin(0.5, 0.5);
        menuBtnText.setDepth(54);

        const { menuBtn } = UI_LAYOUT;
        const menuHitZone = this.scene.add.rectangle(
            cx, this._gameOverMenuBtnY, menuBtn.width, menuBtn.height, 0x000000, 0,
        );
        menuHitZone.setDepth(55);
        menuHitZone.setInteractive({ useHandCursor: true });
        menuHitZone.on('pointerover', () => this._drawGameOverMenuButton(MENU_BTN_HOVER));
        menuHitZone.on('pointerout', () => this._drawGameOverMenuButton(MENU_BTN_COLOR));
        menuHitZone.on('pointerdown', (_p, _lx, _ly, event) => {
            if (event?.stopPropagation) event.stopPropagation();
            this.scene.returnToMenu();
        });

        const menuHint = this.scene.add.text(cx, y(308), 'ou touche M', {
            fontSize: '9px', fill: '#aaaaaa', fontFamily: 'Arial',
        });
        menuHint.setOrigin(0.5, 0.5);
        menuHint.setDepth(52);

        const elements = [
            overlay, panel, gameOverText, medal, scoreLbl, scoreText,
            highLbl, highScoreText, ...leaderboardElements,
            restartText, this._menuBtnGraphics, menuBtnText, menuHitZone, menuHint,
        ].filter(Boolean);

        if (fadeIn) {
            elements.forEach(e => e.setAlpha(0));
            this.scene.tweens.add({
                targets: elements,
                alpha: 1,
                duration: 500,
                ease: 'Power2',
            });
        }

        return { elements };
    }

    loadHighScore() {
        try {
            const raw = localStorage.getItem(GAME_CONFIG.storage.highScore);
            const n = Number.parseInt(raw ?? '', 10);
            return Number.isFinite(n) && n >= 0 ? n : 0;
        } catch {
            return 0;
        }
    }

    saveHighScore(score) {
        if (score > this.highScore) {
            this.highScore = score;
            try {
                localStorage.setItem(GAME_CONFIG.storage.highScore, String(score));
            } catch { /* quota */ }
        }
    }

    saveToLeaderboard(score) {
        const highlightId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        let entries = this.loadLeaderboard();
        entries.push({ score, id: highlightId });
        entries.sort((a, b) => b.score - a.score);
        entries = entries.slice(0, 5);
        try {
            localStorage.setItem(GAME_CONFIG.storage.leaderboard, JSON.stringify(entries));
        } catch { /* quota */ }
        return { entries, highlightId };
    }

    loadLeaderboard() {
        try {
            const data = localStorage.getItem(GAME_CONFIG.storage.leaderboard);
            if (!data) return [];
            const parsed = JSON.parse(data);
            if (!Array.isArray(parsed)) return [];
            return parsed
                .map(item => {
                    if (typeof item === 'number') {
                        return { score: item, id: `legacy-${item}` };
                    }
                    const s = Number(item.score);
                    return {
                        score: Number.isFinite(s) && s >= 0 ? s : 0,
                        id: item.id || `legacy-${s}`,
                    };
                })
                .filter(e => Number.isFinite(e.score) && e.score >= 0);
        } catch {
            return [];
        }
    }

    destroy() {
        if (this.scoreText) this.scoreText.destroy();
    }
}
