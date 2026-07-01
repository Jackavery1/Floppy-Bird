import { loadHighScore } from './storage.js';
import {
    computeMenuLayout,
    diffLabelColor,
    UI_LAYOUT,
} from './uiLayout.js';
import { applyMenuLayout, bestScoreLabel, drawDiffButtons } from './uiMenuLayout.js';
import { destroyInGameControls } from './uiHud.js';
import {
    buildMenuHeader,
    buildMenuDifficulty,
    buildMenuFooter,
    playMenuIntroTween,
} from './uiMenuBuild.js';
import {
    buildMenuOptions,
    refreshOptionsButtonLabel,
    toggleMenuOptions,
} from './uiMenuOptions.js';
import {
    trainingToggleLabel,
    hardcoreToggleLabel,
    dailyToggleLabel,
} from './device.js';
import { getMenuDailySubtitle } from './dailyChallenge.js';

export function refreshBestScore(ui, difficulty, hardcoreMode) {
    ui._currentDifficulty = difficulty;
    ui.highScore = loadHighScore(difficulty, hardcoreMode);
    if (ui._bestText) {
        ui._bestText.setText(`${bestScoreLabel(difficulty, hardcoreMode)} : ${ui.highScore}`);
    }
}

export function showMenu(ui, difficulty, trainingMode, hardcoreMode, dailyChallengeMode) {
    if (ui.scoreText) {
        ui.scoreText.destroy();
        ui.scoreText = null;
    }
    destroyInGameControls(ui);

    ui._currentDifficulty = difficulty;
    ui._optionsOpen = false;
    ui.highScore = loadHighScore(difficulty, hardcoreMode);
    const elements = [];
    const layout = computeMenuLayout();
    ui._menuLayout = layout;

    elements.push(ui.createOverlay(0.22, 50));

    const title = buildMenuHeader(ui, elements, layout, difficulty, hardcoreMode);
    buildMenuDifficulty(ui, elements, layout, difficulty);
    buildMenuFooter(ui, elements, layout);
    buildMenuOptions(ui, elements, layout, trainingMode, hardcoreMode, dailyChallengeMode);

    applyMenuLayout(ui, difficulty);
    playMenuIntroTween(ui, title);

    return elements;
}

export function toggleMenuOptionsPanel(ui) {
    toggleMenuOptions(
        ui,
        ui.scene.trainingMode,
        ui.scene.hardcoreMode,
        ui.scene.dailyChallengeMode,
    );
}

function syncOptionsLabels(ui, trainingMode, hardcoreMode, dailyChallengeMode) {
    refreshOptionsButtonLabel(ui, trainingMode, hardcoreMode, dailyChallengeMode);
}

export function updateTrainingLabel(ui, trainingMode) {
    if (ui._trainingLabel) {
        ui._trainingLabel.setText(trainingToggleLabel(trainingMode));
        ui._trainingLabel.setColor(trainingMode ? '#81D4FA' : '#888888');
    }
    syncOptionsLabels(ui, trainingMode, ui.scene.hardcoreMode, ui.scene.dailyChallengeMode);
}

export function updateHardcoreLabel(ui, hardcoreMode) {
    if (ui._hardcoreLabel) {
        ui._hardcoreLabel.setText(hardcoreToggleLabel(hardcoreMode));
        ui._hardcoreLabel.setColor(hardcoreMode ? '#FF8A80' : '#888888');
    }
    refreshBestScore(ui, ui._currentDifficulty, hardcoreMode);
    syncOptionsLabels(ui, ui.scene.trainingMode, hardcoreMode, ui.scene.dailyChallengeMode);
}

export function updateDailyLabel(ui, dailyChallengeMode) {
    if (ui._dailyLabel) {
        ui._dailyLabel.setText(dailyToggleLabel(dailyChallengeMode));
        ui._dailyLabel.setColor(dailyChallengeMode ? '#CE93D8' : '#888888');
    }
    if (ui._dailySubtitle) {
        ui._dailySubtitle.setText(getMenuDailySubtitle(dailyChallengeMode));
    }
    syncOptionsLabels(ui, ui.scene.trainingMode, ui.scene.hardcoreMode, dailyChallengeMode);
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
