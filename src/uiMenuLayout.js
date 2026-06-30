import { GAME_CONFIG, DIFFICULTY_ORDER } from './config.js';
import { isCoarsePointer } from './device.js';
import {
    computeMenuLayout,
    diffButtonCenter,
    diffLabelColor,
    DIFF_BTN_ACTIVE,
    DIFF_BTN_HOVER,
    DIFF_BTN_IDLE,
    modesAccordionLabel,
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

export function applyMenuLayout(ui, difficulty, trainingMode, hardcoreMode) {
    const layout = computeMenuLayout(isCoarsePointer(), ui._modesExpanded);
    ui._menuLayout = layout;

    if (ui._modesHeader) {
        ui._modesHeader.setVisible(layout.compact);
        ui._modesHeader.setY(layout.modesHeader);
        ui._modesHeader.setText(modesAccordionLabel(layout.modesExpanded, trainingMode, hardcoreMode));
    }
    if (ui._modesHeaderHit) {
        ui._modesHeaderHit.setVisible(layout.compact);
        ui._modesHeaderHit.setY(layout.modesHeader);
    }

    const showModes = !layout.compact || layout.modesExpanded;
    if (ui._trainingLabel) {
        ui._trainingLabel.setVisible(showModes);
        if (showModes && layout.training != null) ui._trainingLabel.setY(layout.training);
    }
    if (ui._trainingHit) {
        ui._trainingHit.setVisible(showModes);
        if (showModes && layout.training != null) ui._trainingHit.setY(layout.training);
    }
    if (ui._hardcoreLabel) {
        ui._hardcoreLabel.setVisible(showModes);
        if (showModes && layout.hardcore != null) ui._hardcoreLabel.setY(layout.hardcore);
    }
    if (ui._hardcoreHit) {
        ui._hardcoreHit.setVisible(showModes);
        if (showModes && layout.hardcore != null) ui._hardcoreHit.setY(layout.hardcore);
    }

    drawDiffButtons(ui, difficulty, layout);
    ui._diffBtnLabels?.forEach(({ label, diff, hitZone }, i) => {
        label.setY(layout.difficulty);
        label.setColor(diffLabelColor(ui._currentDifficulty, diff));
        hitZone.setY(layout.difficulty);
        hitZone.x = diffButtonCenter(i);
    });

    ui._startText?.setY(layout.start);
    ui._hint1?.setY(layout.hint1);
    ui._hint2?.setY(layout.hint2);
    ui._muteText?.setY(layout.mute);
    ui._muteHit?.setY(layout.mute);
}

export function bestScoreLabel(difficulty, hardcoreMode) {
    const diff = GAME_CONFIG.difficultyLabels[difficulty] ?? '';
    return hardcoreMode ? `MEILLEUR HC (${diff})` : `MEILLEUR (${diff})`;
}
