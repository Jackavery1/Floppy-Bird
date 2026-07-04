import { getSkin } from './skins/index.js';
import { DESIGN_TOKENS, menuTextStyle } from './designTokens.js';
import { addCenteredText, DEPTH, FONT_SIZE_BADGE, FONT_SIZE_HINT } from './uiLayout.js';

function drawEntrySkinSwatch(scene, x, y, skinId, depth) {
    const color = getSkin(skinId).palette.body;
    const swatch = scene.add.rectangle(x, y, 7, 7, color, 1);
    swatch.setStrokeStyle(1, 0x000000, 0.6);
    swatch.setDepth(depth);
    return swatch;
}

/**
 * @param {import('phaser').Scene} scene
 * @param {{
 *   cx: number,
 *   y: (offset: number) => number,
 *   entries: { score: number, id: string, skinId?: string }[],
 *   highlightId: string|null,
 *   isDaily: boolean,
 *   dailyGoal: number,
 *   finalScore: number,
 *   special: boolean,
 *   hardcoreMode: boolean,
 *   activeSkin: { label: string },
 * }} opts
 */
export function buildGameOverLeaderboard(scene, opts) {
    const {
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
    } = opts;
    const leaderboardElements = [];

    if (isDaily) {
        leaderboardElements.push(
            addCenteredText(
                scene,
                cx,
                y(168),
                `— OBJECTIF : ${dailyGoal} —`,
                menuTextStyle({
                    fontSize: FONT_SIZE_HINT,
                    fill: DESIGN_TOKENS.texteLeaderboard,
                    fontStyle: 'bold',
                }),
                DEPTH.MENU_RAISED
            )
        );
        leaderboardElements.push(
            addCenteredText(
                scene,
                cx,
                y(183),
                finalScore >= dailyGoal
                    ? "Bravo, défi validé pour aujourd'hui !"
                    : `Encore ${dailyGoal - finalScore} point(s) pour valider le défi.`,
                menuTextStyle({
                    fontSize: FONT_SIZE_BADGE,
                    fill: DESIGN_TOKENS.texteMuted,
                }),
                DEPTH.MENU_RAISED
            )
        );
        return leaderboardElements;
    }

    const boardTitle = special
        ? `— TOP 5 · ${activeSkin.label.toUpperCase()}${hardcoreMode ? ' HC' : ''} —`
        : hardcoreMode
          ? '— TOP 5 HARDCORE —'
          : '— TOP 5 —';
    leaderboardElements.push(
        addCenteredText(
            scene,
            cx,
            y(168),
            boardTitle,
            menuTextStyle({
                fontSize: FONT_SIZE_HINT,
                fill: DESIGN_TOKENS.texteLeaderboard,
                fontStyle: 'bold',
            }),
            DEPTH.MENU_RAISED
        )
    );

    entries.forEach((entry, i) => {
        const isNew = entry.id === highlightId;
        const rank = i === 0 ? '👑' : `${i + 1}.`;
        const rowY = y(183 + i * 13);
        if (!special) {
            leaderboardElements.push(
                drawEntrySkinSwatch(
                    scene,
                    cx - 62,
                    rowY,
                    entry.skinId ?? 'classic',
                    DEPTH.MENU_RAISED
                )
            );
        }
        leaderboardElements.push(
            addCenteredText(
                scene,
                cx,
                rowY,
                `${rank} ${entry.score}`,
                menuTextStyle({
                    fontSize: '11px',
                    fill: isNew
                        ? DESIGN_TOKENS.accentLeaderboardNew
                        : i === 0
                          ? DESIGN_TOKENS.accentTitre
                          : DESIGN_TOKENS.texteMuted,
                    fontStyle: isNew || i === 0 ? 'bold' : 'normal',
                }),
                DEPTH.MENU_RAISED
            )
        );
    });

    return leaderboardElements;
}
