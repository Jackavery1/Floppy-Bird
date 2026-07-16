import { getSkin, isSpecialSkin } from '../../skins/index.js';
import { buildGameOverSummaryHeader } from './uiGameOverSummaryHeader.js';
import { buildGameOverSummaryMedal } from './uiGameOverSummaryMedal.js';
import { buildGameOverSummaryScore } from './uiGameOverSummaryScore.js';

/**
 * En-tête, médaille/record et bloc score du game over.
 * @param {import('phaser').Scene} scene
 * @param {number} cx
 * @param {(offset: number) => number} y
 * @param {import('../core/ui.js').UI} ui
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

    const { elements: headerElements } = buildGameOverSummaryHeader(scene, cx, y, {
        deathCause,
    });

    const medalY = y(58);
    const { elements: medalElements } = buildGameOverSummaryMedal(scene, cx, medalY, {
        finalScore,
        isNewRecord,
    });

    const { elements: scoreElements, scoreText } = buildGameOverSummaryScore(scene, cx, y, ui, {
        finalScore,
        fadeIn,
        isNewRecord,
        hardcoreMode,
        dailyGoal,
        isDaily,
        special,
        activeSkin,
    });

    return {
        elements: [...headerElements, ...medalElements, ...scoreElements],
        scoreText,
        isDaily,
        special,
        activeSkin,
    };
}
