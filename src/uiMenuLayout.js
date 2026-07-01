import { GAME_CONFIG, DIFFICULTY_ORDER } from './config.js';
import {
    computeMenuLayout,
    diffButtonCenter,
    diffLabelColor,
    DIFF_BTN_ACTIVE,
    DIFF_BTN_HOVER,
    DIFF_BTN_IDLE,
    UI_LAYOUT,
} from './uiLayout.js';

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
        } else if (ui._hoveredDifficulty === diff) {
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
        label.setColor(diffLabelColor(ui._currentDifficulty, diff));
        hitZone.setY(layout.difficulty);
        hitZone.x = diffButtonCenter(i);
    });

    ui._startText?.setY(layout.start);
    ui._hint1?.setY(layout.hint1);
    ui._optionsBtnLabel?.setY(layout.optionsBtn);
    ui._optionsBtnHit?.setY(layout.optionsBtn);
}

export function bestScoreLabel(difficulty, hardcoreMode) {
    const diff = GAME_CONFIG.difficultyLabels[difficulty] ?? '';
    return hardcoreMode ? `MEILLEUR HC (${diff})` : `MEILLEUR (${diff})`;
}
