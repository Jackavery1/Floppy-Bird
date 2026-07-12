import { GAME_CONFIG, DIFFICULTY_ORDER } from './config.js';
import {
    computeMenuLayout,
    diffButtonCenter,
    DIFF_BTN_ACTIVE,
    DIFF_BTN_HOVER,
    DIFF_BTN_IDLE,
    UI_LAYOUT,
} from './uiLayout.js';
import { syncDifficultyButtonLabel } from './uiText.js';

export function drawDiffButtons(ui, difficulty, layout) {
    if (!ui._diffBtnGraphics) return;
    const g = ui._diffBtnGraphics;
    g.clear();

    const { diffBtn } = UI_LAYOUT;
    const diffY = layout.difficulty;

    DIFFICULTY_ORDER.forEach((diff, i) => {
        const bx = diffBtn.x[i];
        const by = diffY - diffBtn.height / 2;
        if (difficulty === diff) {
            g.fillStyle(DIFF_BTN_ACTIVE, 1);
        } else if (ui._hoveredDifficulty === diff || ui._focusedDifficulty === diff) {
            g.fillStyle(DIFF_BTN_HOVER.color, DIFF_BTN_HOVER.alpha);
        } else {
            g.fillStyle(DIFF_BTN_IDLE.color, DIFF_BTN_IDLE.alpha);
        }
        g.fillRoundedRect(bx, by, diffBtn.width, diffBtn.height, diffBtn.radius);
    });
}

export function applyMenuLayout(ui, difficulty) {
    const layout = computeMenuLayout();
    ui._menuLayout = layout;

    drawDiffButtons(ui, difficulty, layout);
    ui._diffBtnLabels?.forEach(({ label, diff, hitZone }, i) => {
        label.setY(layout.difficulty);
        syncDifficultyButtonLabel(label, ui._currentDifficulty, diff);
        hitZone.setY(layout.difficulty);
        hitZone.x = diffButtonCenter(i);
    });

    ui._startText?.setY(layout.start);
    ui._dailyBtnLabel?.setY(layout.dailyBtn);
    ui._dailyBtnBg?.setY(layout.dailyBtn);
    ui._dailyBtnHit?.setY(layout.dailyBtn);
    ui._dailyBtnSubtitle?.setY(layout.dailySubtitle);
    const rowY = layout.menuRow;
    ui._scoresBtnLabel?.setY(rowY);
    ui._scoresBtnHit?.setY(rowY);
    ui._scoresBtnBg?.setY(rowY);
    ui._optionsBtnLabel?.setY(rowY);
    ui._optionsBtnHit?.setY(rowY);
    ui._optionsBtnBg?.setY(rowY);
    ui._skinsBtnLabel?.setY(rowY);
    ui._skinsBtnHit?.setY(rowY);
    ui._skinsBtnBg?.setY(rowY);
    ui._scoresBtnBg.x = layout.scoresBtn;
    ui._scoresBtnLabel?.setX?.(layout.scoresBtn);
    ui._scoresBtnHit.x = layout.scoresBtn;
    ui._optionsBtnBg.x = layout.optionsBtn;
    ui._optionsBtnLabel?.setX?.(layout.optionsBtn);
    ui._optionsBtnHit.x = layout.optionsBtn;
    ui._skinsBtnBg.x = layout.skinsBtn;
    ui._skinsBtnLabel?.setX?.(layout.skinsBtn);
    ui._skinsBtnHit.x = layout.skinsBtn;
}

export function bestScoreLabel(difficulty, hardcoreMode) {
    const diff = GAME_CONFIG.difficultyLabels[difficulty] ?? '';
    return hardcoreMode ? `MEILLEUR HC (${diff})` : `MEILLEUR (${diff})`;
}
