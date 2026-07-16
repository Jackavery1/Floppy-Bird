import { GAME_CONFIG } from '../../config.js';
import { DESIGN_TOKENS, menuTextStyle } from '../../designTokens.js';
import { bestScoreLabel } from '../../scoreLabels.js';
import { addCenteredText, DEPTH, FONT_SIZE_BADGE, FONT_SIZE_HINT } from '../shared/uiLayout.js';

/**
 * Bloc score et libellés record / daily / skin spécial.
 * @param {import('phaser').Scene} scene
 * @param {number} cx
 * @param {(offset: number) => number} y
 * @param {import('../core/ui.js').UI} ui
 * @param {{
 *   finalScore: number,
 *   fadeIn: boolean,
 *   isNewRecord: boolean,
 *   hardcoreMode: boolean,
 *   dailyGoal: number,
 *   activeSkinId: string,
 *   isDaily: boolean,
 *   special: boolean,
 *   activeSkin: ReturnType<typeof getSkin>,
 * }} opts
 */
export function buildGameOverSummaryScore(scene, cx, y, ui, opts) {
    const {
        finalScore,
        fadeIn,
        isNewRecord,
        hardcoreMode,
        dailyGoal,
        isDaily,
        special,
        activeSkin,
    } = opts;
    const elements = [];

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

    return { elements, scoreText };
}
