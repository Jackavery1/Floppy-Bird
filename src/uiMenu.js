import { loadHighScore } from './storage.js';
import {
    computeMenuLayout,
    diffLabelColor,
    UI_LAYOUT,
} from './uiLayout.js';
import { applyMenuLayout, drawDiffButtons } from './uiMenuLayout.js';
import { destroyInGameControls } from './uiHud.js';
import {
    buildMenuHeader,
    buildMenuDifficulty,
    buildMenuFooter,
    buildMenuDailyChallenge,
    refreshDailyChallengeButton,
    playMenuIntroTween,
} from './uiMenuBuild.js';
import {
    buildMenuOptions,
    refreshOptionsButtonLabel,
    refreshHardcoreLockState,
    setMenuOptionsOpen,
    toggleMenuOptions,
    applyTrainingLabel,
    applyHardcoreLabel,
} from './uiMenuOptions.js';
import {
    buildMenuScoresPanel,
    refreshScoresButtonLabel,
    setMenuScoresOpen,
    toggleMenuScores,
} from './uiMenuScoresPanel.js';
import {
    buildMenuSkinsPanel,
    setMenuSkinsOpen,
    toggleMenuSkins,
} from './uiMenuSkinsPanel.js';
import { refreshScoresTab } from './uiMenuScores.js';
import { syncMenuChromeVisibility } from './uiMenuPanel.js';
import { buildMetaContext } from './metaContext.js';
import { isHardcoreUnlocked } from './hardcoreUnlock.js';

/** @param {import('./ui.js').UI} ui */
export function closeAllMenuPanels(ui) {
    setMenuOptionsOpen(ui, false);
    setMenuScoresOpen(ui, false);
    setMenuSkinsOpen(ui, false);
}

export function refreshBestScore(ui, difficulty, hardcoreMode) {
    ui._currentDifficulty = difficulty;
    ui.highScore = loadHighScore(difficulty, hardcoreMode);
}

export function showMenu(ui, difficulty, trainingMode, hardcoreMode) {
    if (ui.scoreText) {
        ui.scoreText.destroy();
        ui.scoreText = null;
    }
    if (ui._scoreShadow) {
        ui._scoreShadow.destroy();
        ui._scoreShadow = null;
    }
    destroyInGameControls(ui);

    ui._currentDifficulty = difficulty;
    ui._optionsOpen = false;
    ui._scoresOpen = false;
    ui._skinsOpen = false;
    ui.highScore = loadHighScore(difficulty, hardcoreMode);
    const elements = [];
    const layout = computeMenuLayout();
    ui._menuLayout = layout;
    ui._closeAllMenuPanels = () => closeAllMenuPanels(ui);

    elements.push(ui.createOverlay(0.22, 50));

    const title = buildMenuHeader(ui, elements, layout);
    buildMenuDifficulty(ui, elements, layout, difficulty);
    buildMenuDailyChallenge(ui, elements, layout, difficulty);
    buildMenuFooter(ui, elements, layout);
    buildMenuScoresPanel(ui, elements, layout);
    buildMenuOptions(ui, elements, layout);
    buildMenuSkinsPanel(ui, elements, layout);

    applyMenuLayout(ui, difficulty);
    ui._menuChromeElements = [
        ui._menuTitleShadow,
        title,
        ui._diffBtnGraphics,
        ...(ui._diffBtnLabels ?? []).flatMap(({ label, hitZone }) => [label, hitZone]),
        ui._dailyBtnBg,
        ui._dailyBtnLabel,
        ui._dailyMenuSubtitle,
        ui._dailyBtnHit,
        ui._startText,
        ui._hint1,
    ].filter(Boolean);
    syncMenuChromeVisibility(ui);
    playMenuIntroTween(ui, title);

    return elements;
}

export function toggleMenuOptionsPanel(ui) {
    toggleMenuOptions(ui);
}

export function toggleMenuScoresPanel(ui) {
    toggleMenuScores(ui);
}

export function toggleMenuSkinsPanel(ui) {
    toggleMenuSkins(ui);
}

export function updateTrainingLabel(ui, trainingMode) {
    applyTrainingLabel(ui, trainingMode);
    refreshOptionsButtonLabel(ui);
}

export function updateHardcoreLabel(ui, hardcoreMode) {
    const ctx = buildMetaContext(ui.scene);
    const unlocked = isHardcoreUnlocked(ctx);
    applyHardcoreLabel(ui, hardcoreMode, unlocked);
    refreshBestScore(ui, ui._currentDifficulty, hardcoreMode);
    refreshScoresTab(ui);
    refreshHardcoreLockState(ui);
    refreshOptionsButtonLabel(ui);
}

export function updateDifficultyButtons(ui, difficulty) {
    ui._currentDifficulty = difficulty;
    refreshBestScore(ui, difficulty, ui.scene?.hardcoreMode ?? false);
    refreshDailyChallengeButton(ui, difficulty);
    ui._hoveredDifficulty = null;
    drawDiffButtons(ui, difficulty, ui._menuLayout ?? UI_LAYOUT.menu);

    ui._diffBtnLabels.forEach(({ label, diff }) => {
        label.setColor(diffLabelColor(difficulty, diff));
    });
}

export function refreshHighScore(ui, difficulty, hardcoreMode = false) {
    refreshBestScore(ui, difficulty, hardcoreMode);
    refreshHardcoreLockState(ui);
    refreshScoresButtonLabel(ui);
}
