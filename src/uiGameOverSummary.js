import { GAME_CONFIG } from './config.js';
import {
    DESIGN_TOKENS,
    hexVersPhaser,
    MEDAILLE_COLORS_PHASER,
    menuTextStyle,
} from './designTokens.js';
import { deathCauseLabel, coyoteDeathHint } from './device.js';
import { Utils } from './utils.js';
import { getSkin, isSpecialSkin } from './skins/index.js';
import { shade } from './uiGameOverDecor.js';
import { bestScoreLabel } from './uiMenuLayout.js';
import { addCenteredText, DEPTH, FONT_SIZE_BADGE, FONT_SIZE_HINT, FONT_TITLE } from './uiLayout.js';

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
 *   coyoteFramesAtDeath: number|null,
 *   hardcoreMode: boolean,
 *   dailyGoal: number,
 *   activeSkinId: string,
 * }} opts
 */
export function buildGameOverSummary(scene, cx, y, ui, opts) {
    const {
        finalScore,
        fadeIn,
        isNewRecord,
        deathCause,
        coyoteFramesAtDeath,
        hardcoreMode,
        dailyGoal,
        activeSkinId,
    } = opts;
    const isDaily = dailyGoal > 0;
    const special = !isDaily && isSpecialSkin(activeSkinId);
    const activeSkin = getSkin(activeSkinId);
    const elements = [];

    const gameOverText = addCenteredText(
        scene,
        cx,
        y(28),
        'GAME OVER',
        menuTextStyle({
            fontFamily: FONT_TITLE,
            fontSize: '14px',
            fill: DESIGN_TOKENS.texteGameOver,
            fontStyle: 'normal',
            stroke: DESIGN_TOKENS.contourGameOver,
        }),
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
                menuTextStyle({
                    fontSize: FONT_SIZE_BADGE,
                    fill: DESIGN_TOKENS.accentScoreHardcore,
                    fontStyle: 'italic',
                }),
                DEPTH.MENU_RAISED
            )
        );
    }

    const coyoteHint = coyoteDeathHint(coyoteFramesAtDeath, deathCause);
    if (coyoteHint) {
        elements.push(
            addCenteredText(
                scene,
                cx,
                y(deathLabel ? 66 : 52),
                coyoteHint,
                menuTextStyle({
                    fontSize: FONT_SIZE_HINT,
                    fill: DESIGN_TOKENS.bannerCoyote,
                    fontStyle: 'normal',
                }),
                DEPTH.MENU_RAISED
            )
        );
    }

    elements.push(
        scene.add
            .rectangle(cx, y(42), 90, 2, hexVersPhaser(DESIGN_TOKENS.liseréGameOver), 0.8)
            .setDepth(DEPTH.MENU_RAISED)
    );

    let medal = null;
    let recordBanner = null;
    let recordBadge = null;
    const medalY = y(58);
    if (isNewRecord) {
        recordBanner = scene.add.graphics().setDepth(DEPTH.MENU_PANEL);
        recordBanner.fillStyle(hexVersPhaser(DESIGN_TOKENS.accentTitre), 0.16);
        recordBanner.fillRoundedRect(cx - 78, medalY - 9, 156, 18, 4);
        recordBadge = addCenteredText(
            scene,
            cx,
            medalY,
            '★ NOUVEAU RECORD ★',
            menuTextStyle({
                fontSize: '11px',
                fill: DESIGN_TOKENS.accentTitre,
                fontStyle: 'bold',
                stroke: DESIGN_TOKENS.contourHud,
                strokeThickness: 1,
            }),
            DEPTH.MENU_RAISED
        );
        elements.push(recordBanner, recordBadge);
    } else {
        const medalColor =
            finalScore > 20
                ? MEDAILLE_COLORS_PHASER.or
                : finalScore > 10
                  ? MEDAILLE_COLORS_PHASER.argent
                  : finalScore > 5
                    ? MEDAILLE_COLORS_PHASER.bronze
                    : null;
        if (medalColor !== null) {
            const mg = scene.add.graphics().setDepth(DEPTH.MENU_RAISED);
            mg.lineStyle(1.5, shade(medalColor, 1.25), 0.7);
            mg.strokeCircle(cx, medalY, 20);
            mg.fillStyle(medalColor, 1);
            mg.fillCircle(cx, medalY, 20);
            mg.fillStyle(shade(medalColor, 0.55), 1);
            mg.fillCircle(cx, medalY, 20 - 15);
            mg.fillStyle(hexVersPhaser(DESIGN_TOKENS.texteHud), 0.5);
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
            menuTextStyle({ fontSize: FONT_SIZE_BADGE, fill: DESIGN_TOKENS.texteMenu }),
            DEPTH.MENU_RAISED
        )
    );

    const scoreText = addCenteredText(
        scene,
        cx,
        y(102),
        fadeIn ? '0' : String(finalScore),
        menuTextStyle({
            fontSize: '22px',
            fill: isNewRecord ? DESIGN_TOKENS.accentTitre : DESIGN_TOKENS.texteMenu,
            fontStyle: 'bold',
        }),
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
            menuTextStyle({ fontSize: FONT_SIZE_HINT, fill: DESIGN_TOKENS.accentTitre }),
            DEPTH.MENU_RAISED
        )
    );

    elements.push(
        addCenteredText(
            scene,
            cx,
            y(143),
            isDaily ? (finalScore >= dailyGoal ? '✓ RÉUSSI' : '✗ RATÉ') : String(ui.highScore),
            menuTextStyle({
                fontSize: isDaily ? '14px' : '16px',
                fill: isDaily
                    ? finalScore >= dailyGoal
                        ? DESIGN_TOKENS.bannerSuccess
                        : DESIGN_TOKENS.badgeHardcore
                    : DESIGN_TOKENS.accentTitre,
                fontStyle: 'bold',
            }),
            DEPTH.MENU_RAISED
        )
    );

    return { elements, scoreText, isDaily, special, activeSkin };
}
