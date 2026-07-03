import { GAME_CONFIG } from './config.js';
import { deathCauseLabel } from './device.js';
import { Utils } from './utils.js';
import { getSkin, isSpecialSkin } from './skins/index.js';
import { shade } from './uiGameOverDecor.js';
import { bestScoreLabel } from './uiMenuLayout.js';
import { addCenteredText, DEPTH, FONT_TITLE } from './uiLayout.js';

/**
 * En-tête, médaille/record et bloc score du game over.
 * @param {import('phaser').Scene} scene
 * @param {number} cx
 * @param {(offset: number) => number} y
 * @param {import('./ui.js').UI} ui
 * @param {{
 *   finalScore: number,
 *   fadeIn: boolean,
 *   isNewRecord: boolean,
 *   deathCause: string|null,
 *   hardcoreMode: boolean,
 *   dailyGoal: number,
 *   activeSkinId: string,
 * }} opts
 */
export function buildGameOverSummary(scene, cx, y, ui, opts) {
    const { finalScore, fadeIn, isNewRecord, deathCause, hardcoreMode, dailyGoal, activeSkinId } =
        opts;
    const isDaily = dailyGoal > 0;
    const special = !isDaily && isSpecialSkin(activeSkinId);
    const activeSkin = getSkin(activeSkinId);
    const elements = [];

    const gameOverText = addCenteredText(
        scene,
        cx,
        y(28),
        'GAME OVER',
        {
            fontFamily: FONT_TITLE,
            fontSize: '14px',
            fill: '#FF1744',
            fontStyle: 'normal',
            stroke: '#8B0000',
            strokeThickness: 2,
        },
        DEPTH.MENU_RAISED
    );
    elements.push(gameOverText);

    const deathLabel = deathCauseLabel(deathCause);
    if (deathLabel) {
        elements.push(
            addCenteredText(
                scene,
                cx,
                y(52),
                deathLabel,
                {
                    fontSize: '10px',
                    fill: '#FFAB91',
                    fontStyle: 'italic',
                },
                DEPTH.MENU_RAISED
            )
        );
    }

    elements.push(scene.add.rectangle(cx, y(42), 90, 2, 0xffd700, 0.8).setDepth(DEPTH.MENU_RAISED));

    let medal = null;
    let recordBanner = null;
    let recordBadge = null;
    const medalY = y(58);
    if (isNewRecord) {
        recordBanner = scene.add.graphics().setDepth(DEPTH.MENU_PANEL);
        recordBanner.fillStyle(0xfdd835, 0.16);
        recordBanner.fillRoundedRect(cx - 78, medalY - 9, 156, 18, 4);
        recordBadge = addCenteredText(
            scene,
            cx,
            medalY,
            '★ NOUVEAU RECORD ★',
            {
                fontSize: '11px',
                fill: '#FDD835',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 1,
            },
            DEPTH.MENU_RAISED
        );
        elements.push(recordBanner, recordBadge);
    } else {
        const medalColor =
            finalScore > 20
                ? 0xffd700
                : finalScore > 10
                  ? 0x9e9e9e
                  : finalScore > 5
                    ? 0xcd7f32
                    : null;
        if (medalColor !== null) {
            const mg = scene.add.graphics().setDepth(DEPTH.MENU_RAISED);
            mg.lineStyle(1.5, shade(medalColor, 1.25), 0.7);
            mg.strokeCircle(cx, medalY, 20);
            mg.fillStyle(medalColor, 1);
            mg.fillCircle(cx, medalY, 20);
            mg.fillStyle(shade(medalColor, 0.55), 1);
            mg.fillCircle(cx, medalY, 20 - 15);
            mg.fillStyle(0xffffff, 0.5);
            mg.fillPoints(Utils.makeStarPoints(cx, medalY, 12, 5.5), true);
            medal = mg;
            elements.push(medal);
        }
    }

    elements.push(
        addCenteredText(
            scene,
            cx,
            y(82),
            'SCORE',
            { fontSize: '10px', fill: '#ffffff' },
            DEPTH.MENU_RAISED
        )
    );

    const scoreText = addCenteredText(
        scene,
        cx,
        y(102),
        fadeIn ? '0' : String(finalScore),
        {
            fontSize: '22px',
            fill: isNewRecord ? '#FDD835' : '#ffffff',
            fontStyle: 'bold',
        },
        DEPTH.MENU_RAISED
    );
    elements.push(scoreText);

    elements.push(
        addCenteredText(
            scene,
            cx,
            y(125),
            isDaily
                ? 'OBJECTIF DU JOUR · hors TOP 5 classique'
                : special
                  ? `MEILLEUR${hardcoreMode ? ' HC' : ''} · ${activeSkin.label} (${GAME_CONFIG.difficultyLabels[ui._currentDifficulty] ?? ''})`
                  : bestScoreLabel(ui._currentDifficulty, hardcoreMode),
            { fontSize: '9px', fill: '#FDD835' },
            DEPTH.MENU_RAISED
        )
    );

    elements.push(
        addCenteredText(
            scene,
            cx,
            y(143),
            isDaily ? (finalScore >= dailyGoal ? '✓ RÉUSSI' : '✗ RATÉ') : String(ui.highScore),
            {
                fontSize: isDaily ? '14px' : '16px',
                fill: isDaily ? (finalScore >= dailyGoal ? '#81C784' : '#FF8A80') : '#FDD835',
                fontStyle: 'bold',
            },
            DEPTH.MENU_RAISED
        )
    );

    return { elements, scoreText, isDaily, special, activeSkin };
}
