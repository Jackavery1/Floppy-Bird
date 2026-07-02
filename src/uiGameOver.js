import { sceneTween } from './motion.js';
import { GAME_CONFIG } from './config.js';
import { restartHintForMode, menuHint } from './device.js';
import { Utils } from './utils.js';
import { getSkin, isSpecialSkin } from './skins/index.js';
import { shade, drawPlaqueCorners, drawDivider, spawnConfetti } from './uiGameOverDecor.js';
import { buildGameOverLeaderboard } from './uiGameOverLeaderboard.js';
import { bestScoreLabel } from './uiMenuLayout.js';
import {
    addCenteredText,
    DEPTH,
    GAME_OVER_PANEL,
    MENU_BTN_COLOR,
    MENU_BTN_HOVER,
    MIN_TOUCH,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';

export function buildGameOverUI(
    scene, ui, finalScore, leaderboardData, fadeIn, isNewRecord, hardcoreMode = false, dailyGoal = 0, activeSkinId = 'classic',
) {
    ui.hideInGameScore();

    const { entries, highlightId } = leaderboardData;
    const isDaily = dailyGoal > 0;
    const special = !isDaily && isSpecialSkin(activeSkinId);
    const activeSkin = getSkin(activeSkinId);
    const P = GAME_OVER_PANEL;
    const cx = P.x + P.w / 2;
    const y = (offset) => P.y + offset;

    const overlay = ui.createOverlay(0.75, DEPTH.OVERLAY_DIM);

    const panel = scene.add.graphics().setDepth(DEPTH.MENU_PANEL);
    panel.fillStyle(0x141E30, 0.92);
    panel.fillRoundedRect(P.x, P.y, P.w, P.h, P.radius);
    panel.lineStyle(2, 0xFFD700, 1);
    panel.strokeRoundedRect(P.x, P.y, P.w, P.h, P.radius);
    panel.lineStyle(1, 0xFFD700, 0.25);
    panel.strokeRoundedRect(P.x + 5, P.y + 5, P.w - 10, P.h - 10, Math.max(P.radius - 4, 2));
    drawPlaqueCorners(panel, P);

    const gameOverText = addCenteredText(scene, cx, y(28), 'GAME OVER', {
        fontSize: '24px', fill: '#FF1744', fontStyle: 'bold',
        stroke: '#8B0000', strokeThickness: 2,
    }, DEPTH.MENU_RAISED);

    const titleRule = scene.add.rectangle(cx, y(42), 90, 2, 0xFFD700, 0.8).setDepth(DEPTH.MENU_RAISED);

    let medal = null;
    let recordBanner = null;
    let recordBadge = null;
    const medalY = y(58);
    if (isNewRecord) {
        recordBanner = scene.add.graphics().setDepth(DEPTH.MENU_PANEL);
        recordBanner.fillStyle(0xFDD835, 0.16);
        recordBanner.fillRoundedRect(cx - 78, medalY - 9, 156, 18, 4);
        recordBadge = addCenteredText(scene, cx, medalY, '★ NOUVEAU RECORD ★', {
            fontSize: '11px', fill: '#FDD835', fontStyle: 'bold',
            stroke: '#000000', strokeThickness: 1,
        }, DEPTH.MENU_RAISED);
    } else {
        const medalColor = finalScore > 20 ? 0xFFD700 : finalScore > 10 ? 0x9E9E9E : finalScore > 5 ? 0xCD7F32 : null;
        if (medalColor !== null) {
            const mg = scene.add.graphics().setDepth(DEPTH.MENU_RAISED);
            mg.lineStyle(1.5, shade(medalColor, 1.25), 0.7);
            mg.strokeCircle(cx, medalY, 20);
            mg.fillStyle(medalColor, 1);
            mg.fillCircle(cx, medalY, 20);
            mg.fillStyle(shade(medalColor, 0.55), 1);
            mg.fillCircle(cx, medalY, 20 - 15);
            mg.fillStyle(0xFFFFFF, 0.5);
            mg.fillPoints(Utils.makeStarPoints(cx, medalY, 12, 5.5), true);
            medal = mg;
        }
    }

    const scoreLbl = addCenteredText(scene, cx, y(82), 'SCORE', {
        fontSize: '10px', fill: '#ffffff',
    }, DEPTH.MENU_RAISED);

    const scoreText = addCenteredText(scene, cx, y(102), fadeIn ? '0' : String(finalScore), {
        fontSize: '22px', fill: isNewRecord ? '#FDD835' : '#ffffff', fontStyle: 'bold',
    }, DEPTH.MENU_RAISED);

    const highLbl = addCenteredText(scene, cx, y(125),
        isDaily
            ? 'OBJECTIF DU JOUR'
            : special
                ? `MEILLEUR${hardcoreMode ? ' HC' : ''} · ${activeSkin.label} (${GAME_CONFIG.difficultyLabels[ui._currentDifficulty] ?? ''})`
                : bestScoreLabel(ui._currentDifficulty, hardcoreMode), {
            fontSize: '9px', fill: '#FDD835',
        }, DEPTH.MENU_RAISED);

    const highScoreText = addCenteredText(scene, cx, y(143),
        isDaily
            ? (finalScore >= dailyGoal ? '✓ RÉUSSI' : '✗ RATÉ')
            : String(ui.highScore), {
            fontSize: isDaily ? '14px' : '16px',
            fill: isDaily
                ? (finalScore >= dailyGoal ? '#81C784' : '#FF8A80')
                : '#FDD835',
            fontStyle: 'bold',
        }, DEPTH.MENU_RAISED);

    const dividerTop = drawDivider(scene, cx, y(156), P.w - 64, DEPTH.MENU_RAISED);

    const leaderboardElements = buildGameOverLeaderboard(scene, {
        cx,
        y,
        entries,
        highlightId,
        isDaily,
        dailyGoal,
        finalScore,
        special,
        hardcoreMode,
        activeSkin,
    });

    const dividerBottom = drawDivider(scene, cx, y(244), P.w - 64, DEPTH.MENU_RAISED);

    const restartText = addCenteredText(scene, cx, y(252), restartHintForMode(isDaily), {
        fontSize: '9px', fill: '#ffffff', fontStyle: 'italic',
    }, DEPTH.MENU_RAISED);

    const menuBtnY = y(285);
    const menuBtnShadow = scene.add.graphics().setDepth(DEPTH.MENU_RAISED);
    const { menuBtn } = UI_LAYOUT;
    menuBtnShadow.fillStyle(0x000000, 0.35);
    menuBtnShadow.fillRoundedRect(
        cx - menuBtn.width / 2, menuBtnY - menuBtn.height / 2 + 3, menuBtn.width, menuBtn.height, menuBtn.radius,
    );
    ui._menuBtnGraphics = scene.add.graphics().setDepth(DEPTH.MENU_BTN_BG);
    ui.drawGameOverMenuButton(menuBtnY, MENU_BTN_COLOR);

    const menuBtnText = addCenteredText(scene, cx, menuBtnY, 'MENU', {
        fontSize: '13px', fill: '#ffffff', fontStyle: 'bold',
    }, DEPTH.MENU_BTN_BG);

    const menuHitZone = scene.add.rectangle(
        cx, menuBtnY, menuBtn.width, MIN_TOUCH, 0x000000, 0,
    );
    menuHitZone.setDepth(DEPTH.MENU_HIT);
    menuHitZone.setInteractive({ useHandCursor: true });
    menuHitZone.on('pointerover', () => ui.drawGameOverMenuButton(menuBtnY, MENU_BTN_HOVER));
    menuHitZone.on('pointerout', () => ui.drawGameOverMenuButton(menuBtnY, MENU_BTN_COLOR));
    menuHitZone.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        scene.returnToMenu();
    });

    const menuHintText = addCenteredText(scene, cx, y(308), menuHint(), {
        fontSize: '9px', fill: '#aaaaaa',
    }, DEPTH.MENU_RAISED);

    const elements = [
        overlay, panel, gameOverText, titleRule, medal, recordBanner, scoreLbl, scoreText, recordBadge,
        highLbl, highScoreText, dividerTop, ...leaderboardElements, dividerBottom,
        restartText, menuBtnShadow, ui._menuBtnGraphics, menuBtnText, menuHitZone, menuHintText,
    ].filter(Boolean);

    if (fadeIn) {
        elements.forEach(e => e.setAlpha(0));
        sceneTween(scene, {
            targets: elements,
            alpha: 1,
            duration: 500,
            ease: 'Power2',
        });

        const counter = { v: 0 };
        sceneTween(scene, {
            targets: counter,
            v: finalScore,
            duration: 650,
            delay: 150,
            ease: 'Cubic.easeOut',
            onUpdate: () => scoreText.setText(String(Math.round(counter.v))),
            onComplete: () => scoreText.setText(String(finalScore)),
        });

        if (isNewRecord) {
            spawnConfetti(scene, cx, P.y - 6, elements);
        }
    }

    return { elements };
}
