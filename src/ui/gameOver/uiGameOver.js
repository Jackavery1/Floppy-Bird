import { drawDivider, spawnConfetti } from './uiGameOverDecor.js';
import { buildGameOverLeaderboard } from './uiGameOverLeaderboard.js';
import { buildGameOverActions, animateGameOverReveal } from './uiGameOverActions.js';
import { buildGameOverShell } from './uiGameOverPanel.js';
import { buildGameOverSummary } from './uiGameOverSummary.js';
import { DEPTH } from '../shared/uiLayout.js';

/**
 * @param {import('../../sceneTypes.js').SceneContext} scene
 * @param {import('../core/ui.js').UI} ui
 * @param {{
 *   finalScore: number,
 *   leaderboardData: { entries: unknown[], highlightId?: unknown },
 *   fadeIn?: boolean,
 *   isNewRecord?: boolean,
 *   hardcoreMode?: boolean,
 *   dailyGoal?: number,
 *   activeSkinId?: string,
 *   deathCause?: string | null,
 * }} opts
 */
export function buildGameOverUI(scene, ui, opts) {
    const {
        finalScore,
        leaderboardData,
        fadeIn = false,
        isNewRecord = false,
        hardcoreMode = false,
        dailyGoal = 0,
        activeSkinId = 'classic',
        deathCause = null,
    } = opts;

    ui.hideInGameScore();

    const { entries, highlightId } = leaderboardData;
    const { overlay, panel, cx, y, P } = buildGameOverShell(scene, ui);

    const {
        elements: summaryElements,
        scoreText,
        isDaily,
        special,
        activeSkin,
    } = buildGameOverSummary(scene, cx, y, ui, {
        finalScore,
        fadeIn,
        isNewRecord,
        deathCause,
        hardcoreMode,
        dailyGoal,
        activeSkinId,
    });

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

    const actionElements = buildGameOverActions(
        scene,
        ui,
        cx,
        y,
        P,
        { isDaily, fadeIn, finalScore, isNewRecord },
        scoreText
    );

    const elements = [
        overlay,
        panel,
        ...summaryElements,
        dividerTop,
        ...leaderboardElements,
        dividerBottom,
        ...actionElements,
    ].filter(Boolean);

    if (fadeIn) {
        animateGameOverReveal(scene, elements, scoreText, finalScore, isNewRecord, cx, P);
    } else if (isNewRecord) {
        spawnConfetti(scene, cx, P.y - 6, elements);
    }

    return { elements };
}
