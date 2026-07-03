import { loadHighScore } from './storage.js';
import { computeMenuLayout, diffLabelColor, UI_LAYOUT } from './uiLayout.js';
import { applyMenuLayout, drawDiffButtons } from './uiMenuLayout.js';
import { destroyInGameControls } from './uiHud.js';
import { buildMenuFooter, playMenuIntroTween } from './uiMenuBuild.js';
import { buildMenuHeader, buildMenuDifficulty } from './uiMenuHeader.js';
import { buildMenuDailyChallenge, refreshDailyChallengeButton } from './uiMenuDailyChallenge.js';
import {
    buildMenuOptions,
    refreshOptionsButtonLabel,
    refreshHardcoreLockState,
    setMenuOptionsOpen,
    applyTrainingLabel,
    applyHardcoreLabel,
} from './uiMenuOptions.js';
import {
    buildMenuScoresPanel,
    refreshScoresButtonLabel,
    setMenuScoresOpen,
} from './uiMenuScoresPanel.js';
import { buildMenuSkinsPanel, setMenuSkinsOpen } from './uiMenuSkinsPanel.js';
import { refreshScoresTab } from './uiMenuScores.js';
import { syncMenuChromeVisibility } from './uiMenuPanel.js';
import { buildMetaContext } from './metaContext.js';
import { isHardcoreUnlocked } from './hardcoreUnlock.js';
import { DEPTH } from './uiLayout.js';

/** @param {import('./ui.js').UI} ui */
export function closeAllMenuPanels(ui) {
    setMenuOptionsOpen(ui, false);
    setMenuScoresOpen(ui, false);
    setMenuSkinsOpen(ui, false);
}

export function refreshBestScore(ui, difficulty, hardcoreMode, skinId = null) {
    ui._currentDifficulty = difficulty;
    ui.highScore = loadHighScore(difficulty, hardcoreMode, skinId);
}

export function showMenu(ui, difficulty, trainingMode, hardcoreMode) {
    if (ui.scoreText) {
        ui.scoreText.destroy();
        ui.scoreText = null;
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

    elements.push(ui.createOverlay(0.22, DEPTH.OVERLAY_DIM));

    const title = buildMenuHeader(ui, elements, layout);
    buildMenuDifficulty(ui, elements, layout, difficulty);
    buildMenuDailyChallenge(ui, elements, layout, difficulty);
    buildMenuFooter(ui, elements, layout);
    buildMenuScoresPanel(ui, elements, layout);
    buildMenuOptions(ui, elements, layout);
    buildMenuSkinsPanel(ui, elements, layout);

    const unlocked = isHardcoreUnlocked(buildMetaContext(ui.scene));
    applyTrainingLabel(ui, trainingMode);
    applyHardcoreLabel(ui, hardcoreMode, unlocked);

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
        ui._startHit,
        ui._hint1,
    ].filter(Boolean);
    syncMenuChromeVisibility(ui);
    playMenuIntroTween(ui, title);

    return elements;
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

export function refreshHighScore(ui, difficulty, hardcoreMode = false, skinId = null) {
    refreshBestScore(ui, difficulty, hardcoreMode, skinId);
    refreshHardcoreLockState(ui);
    refreshScoresButtonLabel(ui);
}
