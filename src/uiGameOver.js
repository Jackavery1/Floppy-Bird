import { sceneTween } from './motion.js';
import { GAME_CONFIG } from './config.js';
import { restartHint, menuHint } from './device.js';
import { Utils } from './utils.js';
import { getSkin, isSpecialSkin } from './skins/index.js';
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

const CONFETTI_COLORS = [0xFFD700, 0xFF6F91, 0x64B5F6, 0x81C784, 0xFFFFFF];

/** Assombrit une couleur hex d'un facteur (0-1). */
function shade(color, factor) {
    const r = Math.floor(((color >> 16) & 0xFF) * factor);
    const g = Math.floor(((color >> 8) & 0xFF) * factor);
    const b = Math.floor((color & 0xFF) * factor);
    return (r << 16) | (g << 8) | b;
}

/** Petits liserés dorés dans les coins du panneau, façon plaque de trophée. */
function drawPlaqueCorners(g, P) {
    const inset = 7;
    const len = 10;
    const t = 2;
    g.fillStyle(0xFFD700, 0.55);
    const corners = [
        [P.x + inset, P.y + inset, len, t], [P.x + inset, P.y + inset, t, len],
        [P.x + P.w - inset - len, P.y + inset, len, t], [P.x + P.w - inset - t, P.y + inset, t, len],
        [P.x + inset, P.y + P.h - inset - t, len, t], [P.x + inset, P.y + P.h - inset - len, t, len],
        [P.x + P.w - inset - len, P.y + P.h - inset - t, len, t], [P.x + P.w - inset - t, P.y + P.h - inset - len, t, len],
    ];
    corners.forEach(([x, y, w, h]) => g.fillRect(x, y, w, h));
}

/** Fine ligne de séparation entre deux blocs du panneau. */
function drawDivider(scene, cx, y, width, depth) {
    const line = scene.add.rectangle(cx, y, width, 1, 0xFFD700, 0.18);
    line.setDepth(depth);
    return line;
}

/** Pluie de confettis courte (nouveau record uniquement). */
function spawnConfetti(scene, cx, topY, elements) {
    for (let i = 0; i < 12; i++) {
        const startX = cx + Utils.randomInt(-95, 95);
        const size = Utils.randomInt(3, 6);
        const color = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
        const piece = scene.add.rectangle(startX, topY, size, size, color, 0.95);
        piece.setDepth(DEPTH.PANEL_TOP);
        elements.push(piece);
        sceneTween(scene, {
            targets: piece,
            y: topY + Utils.randomInt(170, 250),
            x: startX + Utils.randomInt(-30, 30),
            angle: Utils.randomInt(-180, 180),
            alpha: 0,
            duration: Utils.randomInt(900, 1400),
            delay: Utils.randomInt(0, 220),
            ease: 'Cubic.easeIn',
        });
    }
}

function drawEntrySkinSwatch(scene, x, y, skinId, depth) {
    const color = getSkin(skinId).palette.body;
    const swatch = scene.add.rectangle(x, y, 7, 7, color, 1);
    swatch.setStrokeStyle(1, 0x000000, 0.6);
    swatch.setDepth(depth);
    return swatch;
}

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

    const overlay = ui.createOverlay(0.75, 50);

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
    }, 52);

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
        }, 52);
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
    }, 52);

    const scoreText = addCenteredText(scene, cx, y(102), fadeIn ? '0' : String(finalScore), {
        fontSize: '22px', fill: isNewRecord ? '#FDD835' : '#ffffff', fontStyle: 'bold',
    }, 52);

    const highLbl = addCenteredText(scene, cx, y(125),
        isDaily
            ? 'OBJECTIF DU JOUR'
            : special
                ? `MEILLEUR${hardcoreMode ? ' HC' : ''} · ${activeSkin.label} (${GAME_CONFIG.difficultyLabels[ui._currentDifficulty] ?? ''})`
                : (hardcoreMode
                    ? `MEILLEUR HC (${GAME_CONFIG.difficultyLabels[ui._currentDifficulty] ?? ''})`
                    : `MEILLEUR (${GAME_CONFIG.difficultyLabels[ui._currentDifficulty] ?? ''})`), {
            fontSize: '9px', fill: '#FDD835',
        }, 52);

    const highScoreText = addCenteredText(scene, cx, y(143),
        isDaily
            ? (finalScore >= dailyGoal ? '✓ RÉUSSI' : '✗ RATÉ')
            : String(ui.highScore), {
            fontSize: isDaily ? '14px' : '16px',
            fill: isDaily
                ? (finalScore >= dailyGoal ? '#81C784' : '#FF8A80')
                : '#FDD835',
            fontStyle: 'bold',
        }, 52);

    const dividerTop = drawDivider(scene, cx, y(156), P.w - 64, 52);

    const leaderboardElements = [];
    if (isDaily) {
        leaderboardElements.push(addCenteredText(scene, cx, y(168), `— OBJECTIF : ${dailyGoal} —`, {
            fontSize: '9px', fill: '#90CAF9', fontStyle: 'bold',
        }, 52));
        leaderboardElements.push(addCenteredText(scene, cx, y(183),
            finalScore >= dailyGoal
                ? 'Bravo, défi validé pour aujourd\'hui !'
                : `Encore ${dailyGoal - finalScore} point(s) pour valider le défi.`, {
                fontSize: '10px',
                fill: '#cccccc',
            }, 52));
    } else {
        const boardTitle = special
            ? `— TOP 5 · ${activeSkin.label.toUpperCase()}${hardcoreMode ? ' HC' : ''} —`
            : (hardcoreMode ? '— TOP 5 HARDCORE —' : '— TOP 5 —');
        leaderboardElements.push(addCenteredText(scene, cx, y(168), boardTitle, {
            fontSize: '9px', fill: '#90CAF9', fontStyle: 'bold',
        }, 52));

        entries.forEach((entry, i) => {
            const isNew = entry.id === highlightId;
            const rank = i === 0 ? '👑' : `${i + 1}.`;
            const rowY = y(183 + i * 13);
            if (!special) {
                leaderboardElements.push(
                    drawEntrySkinSwatch(scene, cx - 62, rowY, entry.skinId ?? 'classic', 52),
                );
            }
            leaderboardElements.push(addCenteredText(scene, cx, rowY,
                `${rank} ${entry.score}`, {
                    fontSize: '11px',
                    fill: isNew ? '#ffff00' : i === 0 ? '#FDD835' : '#cccccc',
                    fontStyle: isNew || i === 0 ? 'bold' : 'normal',
                }, 52));
        });
    }

    const dividerBottom = drawDivider(scene, cx, y(244), P.w - 64, 52);

    const restartText = addCenteredText(scene, cx, y(252), restartHint(), {
        fontSize: '9px', fill: '#ffffff', fontStyle: 'italic',
    }, 52);

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
    }, 54);

    const menuHitZone = scene.add.rectangle(
        cx, menuBtnY, menuBtn.width, MIN_TOUCH, 0x000000, 0,
    );
    menuHitZone.setDepth(DEPTH.PANEL_BACKDROP);
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
