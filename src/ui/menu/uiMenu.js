import { loadHighScore } from '../../storage.js';
import { computeMenuLayout, UI_LAYOUT } from '../shared/uiLayout.js';
import { syncDifficultyButtonLabel } from '../shared/uiText.js';
import { applyMenuLayout, drawDiffButtons } from './uiMenuLayout.js';
import { destroyInGameControls } from '../hud/uiHud.js';
import { buildMenuFooter, buildMenuFirstRunHint, playMenuIntroTween } from './uiMenuBuild.js';
import { buildMenuHeader, buildMenuDifficulty } from './uiMenuHeader.js';
import { buildMenuDailyChallenge, refreshDailyChallengeButton } from './uiMenuDailyChallenge.js';
import {
    buildMenuOptions,
    refreshOptionsButtonLabel,
    refreshHardcoreLockState,
    applyTrainingLabel,
    applyHardcoreLabel,
} from './uiMenuOptions.js';
import { applyTrainingSpeedLabel } from './uiMenuOptionsLabels.js';
import { buildMenuScoresPanel, refreshScoresButtonLabel } from './uiMenuScoresPanel.js';
import { buildMenuSkinsPanel } from './uiMenuSkinsPanel.js';
import { refreshScoresTab } from './uiMenuScores.js';
import { setOptionsContentVisible } from './uiMenuOptionsContent.js';
import { buildMetaContext } from '../../metaContext.js';
import { syncMenuToggleAccessibility } from '../a11y/uiDomAccessibilityMenuToggles.js';
import { isHardcoreUnlocked } from '../../hardcoreUnlock.js';
import { DEPTH } from '../shared/uiLayout.js';
import { closeAllMenuPanels, ensureMenuActionRowVisible } from './uiMenuPanels.js';

export { closeAllMenuPanels, prepareMenuRebuild } from './uiMenuPanels.js';

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

    elements.push(ui.createOverlay(0.22, DEPTH.OVERLAY_DIM));

    const title = buildMenuHeader(ui, elements, layout);
    buildMenuDifficulty(ui, elements, layout, difficulty);
    buildMenuDailyChallenge(ui, elements, layout, difficulty);
    buildMenuFooter(ui, elements, layout);
    buildMenuFirstRunHint(ui, elements, layout);
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
        ui._dailyBtnSubtitle,
        ui._dailyBtnHit,
        ui._startText,
        ui._startHit,
        ui._firstRunHint,
        ui._scoresBtnBg,
        ui._scoresBtnLabel,
        ui._scoresBtnHit,
        ui._optionsBtnBg,
        ui._optionsBtnLabel,
        ui._optionsBtnHit,
        ui._skinsBtnBg,
        ui._skinsBtnLabel,
        ui._skinsBtnHit,
    ].filter(Boolean);
    closeAllMenuPanels(ui, { force: true });
    setOptionsContentVisible(ui, false);
    ui._optionsPanelRoot?.setVisible(false);
    ensureMenuActionRowVisible(ui);
    playMenuIntroTween(ui, title);

    return elements;
}

export function updateTrainingLabel(ui, trainingMode) {
    applyTrainingLabel(ui, trainingMode);
    updateTrainingSpeedLabel(ui, ui.scene?.trainingTimeScale ?? 0.8, trainingMode);
    refreshOptionsButtonLabel(ui);
}

/** @param {import('../core/ui.js').UI} ui @param {number} scale @param {boolean} [trainingMode] */
export function updateTrainingSpeedLabel(ui, scale, trainingMode) {
    applyTrainingSpeedLabel(ui, scale, trainingMode);
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
    ui._focusedDifficulty = null;
    drawDiffButtons(ui, difficulty, ui._menuLayout ?? UI_LAYOUT.menu);

    ui._diffBtnLabels.forEach(({ label, diff }) => {
        syncDifficultyButtonLabel(label, difficulty, diff);
    });
    syncMenuToggleAccessibility(ui.scene);
}

export function refreshHighScore(ui, difficulty, hardcoreMode = false, skinId = null) {
    refreshBestScore(ui, difficulty, hardcoreMode, skinId);
    refreshHardcoreLockState(ui);
    refreshScoresButtonLabel(ui);
}
