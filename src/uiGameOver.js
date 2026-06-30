import { sceneTween } from './motion.js';
import { GAME_CONFIG } from './config.js';
import { restartHint, menuHint } from './device.js';
import { Utils } from './utils.js';
import {
    addCenteredText,
    GAME_OVER_PANEL,
    MENU_BTN_COLOR,
    MENU_BTN_HOVER,
    MIN_TOUCH,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';

export function buildGameOverUI(scene, ui, finalScore, leaderboardData, fadeIn, isNewRecord, hardcoreMode = false) {
    ui.hideInGameScore();

    const { entries, highlightId } = leaderboardData;
    const P = GAME_OVER_PANEL;
    const cx = P.x + P.w / 2;
    const y = (offset) => P.y + offset;

    const overlay = ui.createOverlay(0.75, 50);

    const panel = scene.add.graphics().setDepth(51);
    panel.fillStyle(0x141E30, 0.92);
    panel.fillRoundedRect(P.x, P.y, P.w, P.h, P.radius);
    panel.lineStyle(2, 0xFFD700, 1);
    panel.strokeRoundedRect(P.x, P.y, P.w, P.h, P.radius);

    const gameOverText = addCenteredText(scene, cx, y(28), 'GAME OVER', {
        fontSize: '24px', fill: '#FF1744', fontStyle: 'bold',
        stroke: '#8B0000', strokeThickness: 2,
    }, 52);

    let medal = null;
    let recordBadge = null;
    const medalY = y(58);
    if (isNewRecord) {
        recordBadge = addCenteredText(scene, cx, medalY, 'NOUVEAU RECORD !', {
            fontSize: '11px', fill: '#FDD835', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 1,
        }, 52);
    } else {
        const medalColor = finalScore > 20 ? 0xFFD700 : finalScore > 10 ? 0x9E9E9E : finalScore > 5 ? 0xCD7F32 : null;
        if (medalColor !== null) {
            const mg = scene.add.graphics().setDepth(52);
            mg.fillStyle(medalColor, 1);
            mg.fillCircle(cx, medalY, 20);
            mg.fillStyle(0xFFFFFF, 0.4);
            mg.fillPoints(Utils.makeStarPoints(cx, medalY, 12, 6), true);
            medal = mg;
        }
    }

    const scoreLbl = addCenteredText(scene, cx, y(82), 'SCORE', {
        fontSize: '10px', fill: '#ffffff',
    }, 52);

    const scoreText = addCenteredText(scene, cx, y(102), String(finalScore), {
        fontSize: '22px', fill: isNewRecord ? '#FDD835' : '#ffffff', fontStyle: 'bold',
    }, 52);

    const highLbl = addCenteredText(scene, cx, y(125),
        hardcoreMode
            ? `MEILLEUR HC (${GAME_CONFIG.difficultyLabels[ui._currentDifficulty] ?? ''})`
            : `MEILLEUR (${GAME_CONFIG.difficultyLabels[ui._currentDifficulty] ?? ''})`, {
            fontSize: '9px', fill: '#FDD835',
        }, 52);

    const highScoreText = addCenteredText(scene, cx, y(143), String(ui.highScore), {
        fontSize: '16px', fill: '#FDD835', fontStyle: 'bold',
    }, 52);

    const leaderboardElements = [
        addCenteredText(scene, cx, y(168), hardcoreMode ? '— TOP 5 HARDCORE —' : '— TOP 5 —', {
            fontSize: '9px', fill: '#90CAF9', fontStyle: 'bold',
        }, 52),
    ];

    entries.forEach((entry, i) => {
        const isNew = entry.id === highlightId;
        leaderboardElements.push(addCenteredText(scene, cx, y(183 + i * 13),
            `${i + 1}. ${entry.score}`, {
                fontSize: '11px',
                fill: isNew ? '#ffff00' : '#cccccc',
                fontStyle: isNew ? 'bold' : 'normal',
            }, 52));
    });

    const restartText = addCenteredText(scene, cx, y(252), restartHint(), {
        fontSize: '9px', fill: '#ffffff', fontStyle: 'italic',
    }, 52);

    const menuBtnY = y(285);
    ui._menuBtnGraphics = scene.add.graphics().setDepth(53);
    ui.drawGameOverMenuButton(menuBtnY, MENU_BTN_COLOR);

    const menuBtnText = addCenteredText(scene, cx, menuBtnY, 'MENU', {
        fontSize: '13px', fill: '#ffffff', fontStyle: 'bold',
    }, 54);

    const { menuBtn } = UI_LAYOUT;
    const menuHitZone = scene.add.rectangle(
        cx, menuBtnY, menuBtn.width, MIN_TOUCH, 0x000000, 0,
    );
    menuHitZone.setDepth(55);
    menuHitZone.setInteractive({ useHandCursor: true });
    menuHitZone.on('pointerover', () => ui.drawGameOverMenuButton(menuBtnY, MENU_BTN_HOVER));
    menuHitZone.on('pointerout', () => ui.drawGameOverMenuButton(menuBtnY, MENU_BTN_COLOR));
    menuHitZone.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        scene.returnToMenu();
    });

    const menuHintText = addCenteredText(scene, cx, y(308), menuHint(), {
        fontSize: '9px', fill: '#aaaaaa',
    }, 52);

    const elements = [
        overlay, panel, gameOverText, medal, scoreLbl, scoreText, recordBadge,
        highLbl, highScoreText, ...leaderboardElements,
        restartText, ui._menuBtnGraphics, menuBtnText, menuHitZone, menuHintText,
    ].filter(Boolean);

    if (fadeIn) {
        elements.forEach(e => e.setAlpha(0));
        sceneTween(scene, {
            targets: elements,
            alpha: 1,
            duration: 500,
            ease: 'Power2',
        });
    }

    return { elements };
}
