import { loadHighScore } from './storage.js';
import { isCoarsePointer } from './device.js';
import {
    computeMenuLayout,
    diffLabelColor,
    modesAccordionLabel,
    UI_LAYOUT,
} from './uiLayout.js';
import { applyMenuLayout, bestScoreLabel, drawDiffButtons } from './uiMenuLayout.js';
import { appendMetaMenu } from './uiMeta.js';
import { destroyInGameControls } from './uiHud.js';
import {
    buildMenuHeader,
    buildMenuModes,
    buildMenuDifficulty,
    buildMenuFooter,
    playMenuIntroTween,
} from './uiMenuBuild.js';
import {
    trainingToggleLabel,
    hardcoreToggleLabel,
} from './device.js';

export function refreshBestScore(ui, difficulty, hardcoreMode) {
    ui._currentDifficulty = difficulty;
    ui.highScore = loadHighScore(difficulty, hardcoreMode);
    if (ui._bestText) {
        ui._bestText.setText(`${bestScoreLabel(difficulty, hardcoreMode)} : ${ui.highScore}`);
    }
}

export function showMenu(ui, difficulty, trainingMode, hardcoreMode) {
    if (ui.scoreText) {
        ui.scoreText.destroy();
        ui.scoreText = null;
    }
    destroyInGameControls(ui);

    ui._currentDifficulty = difficulty;
    ui._modesExpanded = !isCoarsePointer();
    ui.highScore = loadHighScore(difficulty, hardcoreMode);
    const elements = [];
    const layout = computeMenuLayout(isCoarsePointer(), ui._modesExpanded);
    ui._menuLayout = layout;

    elements.push(ui.createOverlay(0.22, 50));

    const title = buildMenuHeader(ui, elements, layout, difficulty, hardcoreMode);
    buildMenuModes(ui, elements, layout, trainingMode, hardcoreMode);
    buildMenuDifficulty(ui, elements, layout, difficulty);
    buildMenuFooter(ui, elements, layout);
    appendMetaMenu(ui, elements, layout);

    applyMenuLayout(ui, difficulty, trainingMode, hardcoreMode);
    playMenuIntroTween(ui, title);

    return elements;
}

export function updateTrainingLabel(ui, trainingMode) {
    if (ui._trainingLabel) {
        ui._trainingLabel.setText(trainingToggleLabel(trainingMode));
        ui._trainingLabel.setColor(trainingMode ? '#81D4FA' : '#888888');
    }
    if (ui._modesHeader && ui._menuLayout?.compact) {
        ui._modesHeader.setText(modesAccordionLabel(
            ui._modesExpanded,
            trainingMode,
            ui.scene.hardcoreMode,
        ));
    }
}

export function updateHardcoreLabel(ui, hardcoreMode) {
    if (ui._hardcoreLabel) {
        ui._hardcoreLabel.setText(hardcoreToggleLabel(hardcoreMode));
        ui._hardcoreLabel.setColor(hardcoreMode ? '#FF8A80' : '#888888');
    }
    if (ui._modesHeader && ui._menuLayout?.compact) {
        ui._modesHeader.setText(modesAccordionLabel(
            ui._modesExpanded,
            ui.scene.trainingMode,
            hardcoreMode,
        ));
    }
    refreshBestScore(ui, ui._currentDifficulty, hardcoreMode);
}

export function updateDifficultyButtons(ui, difficulty) {
    ui._currentDifficulty = difficulty;
    refreshBestScore(ui, difficulty, ui.scene?.hardcoreMode ?? false);
    ui._hoveredDifficulty = null;
    drawDiffButtons(ui, difficulty, ui._menuLayout ?? UI_LAYOUT.menu);

    ui._diffBtnLabels.forEach(({ label, diff }) => {
        label.setColor(diffLabelColor(difficulty, diff));
    });
}

export function refreshHighScore(ui, difficulty, hardcoreMode = false) {
    refreshBestScore(ui, difficulty, hardcoreMode);
}
