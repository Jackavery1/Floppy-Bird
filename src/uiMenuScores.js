import { GAME_CONFIG, DIFFICULTY_ORDER } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser, menuHomeTextStyle, panelChromeTextStyle } from './designTokens.js';
import { loadHighScore } from './storage.js';
import { loadUnlockedAchievements } from './metaStorage.js';
import { ACHIEVEMENTS } from './achievements.js';
import { addCenteredText, DEPTH, UI_LAYOUT } from './uiLayout.js';
import { buildMenuToggleButton } from './uiMenuPanel.js';

const SCORES_BTN_COLOR = hexVersPhaser(DESIGN_TOKENS.boutonScores);
const SCORES_BTN_STROKE = hexVersPhaser(DESIGN_TOKENS.boutonScoresStroke);
const SCORES_BTN_HOVER = hexVersPhaser(DESIGN_TOKENS.boutonScoresHover);

const SCORE_LINE_STYLE = menuHomeTextStyle({
    fontSize: '12px',
});

/** @typedef {'easy'|'normal'|'hard'} DifficultyId */

/**
 * @param {import('./ui.js').UI} ui
 * @param {import('phaser').GameObjects.GameObject[]} elements
 * @param {import('phaser').GameObjects.GameObject[]} panelElements
 */
export function buildScoresTab(ui, elements, panelElements) {
    const scene = ui.scene;
    const panel = UI_LAYOUT.scoresPanel;
    ui._scoresTabElements = [];

    const title = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.scoresTitle,
        'MEILLEURS SCORES',
        panelChromeTextStyle({
            fontSize: '12px',
            fill: DESIGN_TOKENS.accentTitre,
            fontStyle: 'bold',
            stroke: DESIGN_TOKENS.accentTitreContour,
        }),
        DEPTH.PANEL_FRAME
    );
    panelElements.push(title);
    elements.push(title);
    ui._scoresTabElements.push(title);

    const titleRule = scene.add.graphics().setDepth(DEPTH.PANEL_FRAME);
    titleRule.lineStyle(1, SCORES_BTN_STROKE, 0.45);
    titleRule.lineBetween(GAME_CONFIG.centerX - 88, panel.scoresTitle + 14, GAME_CONFIG.centerX + 88, panel.scoresTitle + 14);
    panelElements.push(titleRule);
    elements.push(titleRule);
    ui._scoresTabElements.push(titleRule);

    ui._scoreLines = DIFFICULTY_ORDER.map((diff, i) => {
        const y = panel.scoresFirst + i * panel.scoresGap;
        const label = addCenteredText(
            scene,
            GAME_CONFIG.centerX,
            y,
            formatScoreLine(diff),
            {
                ...SCORE_LINE_STYLE,
                fill: GAME_CONFIG.difficultyColors[diff],
            },
            DEPTH.PANEL_FRAME
        );
        panelElements.push(label);
        elements.push(label);
        ui._scoresTabElements.push(label);
        return { diff, label };
    });

    ui._hardcoreScoreLine = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.scoresHardcore,
        formatHardcoreLine(),
        {
            ...SCORE_LINE_STYLE,
            fill: DESIGN_TOKENS.badgeHardcore,
        },
        DEPTH.PANEL_FRAME
    );
    panelElements.push(ui._hardcoreScoreLine);
    elements.push(ui._hardcoreScoreLine);
    ui._scoresTabElements.push(ui._hardcoreScoreLine);

    ui._achievementsScoreLine = addCenteredText(
        scene,
        GAME_CONFIG.centerX,
        panel.scoresAchievements,
        formatAchievementsLine(),
        panelChromeTextStyle({
            fontSize: '11px',
            fill: DESIGN_TOKENS.medailleOr,
            stroke: DESIGN_TOKENS.contourMenu,
        }),
        DEPTH.PANEL_FRAME
    );
    panelElements.push(ui._achievementsScoreLine);
    elements.push(ui._achievementsScoreLine);
    ui._scoresTabElements.push(ui._achievementsScoreLine);

    const closeBtn = buildMenuToggleButton(scene, elements, {
        cx: GAME_CONFIG.centerX,
        cy: panel.closeBtn,
        width: 160,
        depth: DEPTH.PANEL_FRAME,
        color: SCORES_BTN_COLOR,
        stroke: SCORES_BTN_STROKE,
        hoverColor: SCORES_BTN_HOVER,
        labelText: '◂ RETOUR',
        labelStroke: DESIGN_TOKENS.boutonScoresStroke,
        rounded: true,
        onToggle: () => ui._scoresPanelController?.setOpen(false),
    });
    panelElements.push(closeBtn.bg, closeBtn.label, closeBtn.hit);
    ui._scoresTabElements.push(closeBtn.bg, closeBtn.label, closeBtn.hit);
    ui._scoresCloseHit = closeBtn.hit;
}

/** @param {DifficultyId} diff @param {boolean} hardcore */
function formatScoreLine(diff) {
    const label = GAME_CONFIG.difficultyLabels[diff];
    const score = loadHighScore(diff, false);
    return `${label} · ${score}`;
}

function formatHardcoreLine() {
    let best = 0;
    for (const diff of DIFFICULTY_ORDER) {
        best = Math.max(best, loadHighScore(diff, true));
    }
    return `HARDCORE · ${best}`;
}

function formatAchievementsLine() {
    const n = loadUnlockedAchievements().length;
    return `★ TROPHÉES · ${n}/${ACHIEVEMENTS.length}`;
}

/** @param {import('./ui.js').UI} ui */
export function refreshScoresTab(ui) {
    if (!ui._scoreLines) return;
    ui._scoreLines.forEach(({ diff, label }) => {
        label.setText(formatScoreLine(diff));
    });
    ui._hardcoreScoreLine?.setText(formatHardcoreLine());
    ui._achievementsScoreLine?.setText(formatAchievementsLine());
}
