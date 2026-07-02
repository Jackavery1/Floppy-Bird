import { GAME_CONFIG, DIFFICULTY_ORDER } from './config.js';
import { loadHighScore } from './storage.js';
import { loadUnlockedAchievements } from './metaStorage.js';
import { ACHIEVEMENTS } from './achievements.js';
import { addCenteredText, DEPTH, UI_LAYOUT } from './uiLayout.js';

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
        scene, GAME_CONFIG.centerX, panel.scoresTitle,
        'MEILLEURS SCORES', {
            fontSize: '12px', fill: '#90CAF9', fontStyle: 'bold',
            stroke: '#0d1117', strokeThickness: 2,
        }, DEPTH.PANEL_FRAME,
    );
    panelElements.push(title);
    elements.push(title);
    ui._scoresTabElements.push(title);

    ui._scoreLines = DIFFICULTY_ORDER.map((diff, i) => {
        const y = panel.scoresFirst + i * panel.scoresGap;
        const label = addCenteredText(
            scene, GAME_CONFIG.centerX, y,
            formatScoreLine(diff), {
                fontSize: '12px', fill: '#ECEFF1',
                stroke: '#0d1117', strokeThickness: 2,
            }, DEPTH.PANEL_FRAME,
        );
        panelElements.push(label);
        elements.push(label);
        ui._scoresTabElements.push(label);
        return { diff, label };
    });

    ui._hardcoreScoreLine = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.scoresHardcore,
        formatHardcoreLine(), {
            fontSize: '12px', fill: '#FFAB91', fontStyle: 'bold',
            stroke: '#0d1117', strokeThickness: 2,
        }, DEPTH.PANEL_FRAME,
    );
    panelElements.push(ui._hardcoreScoreLine);
    elements.push(ui._hardcoreScoreLine);
    ui._scoresTabElements.push(ui._hardcoreScoreLine);

    ui._achievementsScoreLine = addCenteredText(
        scene, GAME_CONFIG.centerX, panel.scoresAchievements,
        formatAchievementsLine(), {
            fontSize: '11px', fill: '#B0BEC5',
            stroke: '#0d1117', strokeThickness: 2,
        }, DEPTH.PANEL_FRAME,
    );
    panelElements.push(ui._achievementsScoreLine);
    elements.push(ui._achievementsScoreLine);
    ui._scoresTabElements.push(ui._achievementsScoreLine);
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
    return `Trophées · ${n}/${ACHIEVEMENTS.length}`;
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
