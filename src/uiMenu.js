import { loadHighScore } from './storage.js';
import { computeMenuLayout, UI_LAYOUT } from './uiLayout.js';
import { syncDifficultyButtonLabel } from './uiText.js';
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
    teardownOptionsPanel,
    applyTrainingLabel,
    applyHardcoreLabel,
} from './uiMenuOptions.js';
import { applyTrainingSpeedLabel } from './uiMenuOptionsLabels.js';
import {
    buildMenuScoresPanel,
    refreshScoresButtonLabel,
    setMenuScoresOpen,
} from './uiMenuScoresPanel.js';
import { buildMenuSkinsPanel, setMenuSkinsOpen } from './uiMenuSkinsPanel.js';
import { refreshScoresTab } from './uiMenuScores.js';
import { setMenuPanelVisible, syncMenuChromeVisibility } from './uiMenuPanel.js';
import { setOptionsContentVisible } from './uiMenuOptionsContent.js';
import { buildMetaContext } from './metaContext.js';
import { syncMenuToggleAccessibility } from './uiDomAccessibilityFlows.js';
import {
    setOptionsPanelAccessibility,
    setScoresPanelAccessibility,
    setSkinsPanelAccessibility,
} from './uiDomAccessibility.js';
import { isHardcoreUnlocked } from './hardcoreUnlock.js';
import { DEPTH } from './uiLayout.js';

/** @param {import('./ui.js').UI} ui */
function resetMenuPanelRefs(ui) {
    ui._optionsPanelRoot = null;
    ui._optionsChromeElements = [];
    ui._optionsPanelElements = [];
    ui._optionsControlsElements = [];
    ui._optionsSettingsElements = [];
    ui._scoresPanelElements = [];
    ui._skinsPanelElements = [];
}

/** @param {import('./ui.js').UI} ui */
function resetMenuPanelFlags(ui) {
    ui._optionsOpen = false;
    ui._scoresOpen = false;
    ui._skinsOpen = false;
    ui._optionsActiveTab = 'preferences';
}

/** @param {import('./ui.js').UI} ui */
function forceHideMenuPanels(ui) {
    setOptionsContentVisible(ui, false);
    if (ui._scoresPanelElements?.length) {
        setMenuPanelVisible(ui._scoresPanelElements, false, ui.scene);
        ui._scoresBackdrop?.setVisible?.(false);
    }
    if (ui._skinsPanelElements?.length) {
        setMenuPanelVisible(ui._skinsPanelElements, false, ui.scene);
        ui._skinsBackdrop?.setVisible?.(false);
    }
}

/** @param {import('./ui.js').UI} ui */
function ensureMenuActionRowVisible(ui) {
    if (ui._optionsOpen || ui._scoresOpen || ui._skinsOpen) return;
    syncMenuChromeVisibility(ui);
    for (const el of [
        ui._scoresBtnBg,
        ui._scoresBtnLabel,
        ui._scoresBtnHit,
        ui._optionsBtnBg,
        ui._optionsBtnLabel,
        ui._optionsBtnHit,
        ui._skinsBtnBg,
        ui._skinsBtnLabel,
        ui._skinsBtnHit,
    ]) {
        el?.setVisible?.(true);
        el?.setAlpha?.(1);
    }
}

/** @param {import('./ui.js').UI} ui @param {{ force?: boolean }} [opts] */
export function closeAllMenuPanels(ui, opts = {}) {
    const panelOpts = opts.force ? { force: true } : undefined;
    if (opts.force) forceHideMenuPanels(ui);
    setMenuOptionsOpen(ui, false, panelOpts);
    setMenuScoresOpen(ui, false, panelOpts);
    setMenuSkinsOpen(ui, false, panelOpts);
}

/** Réinitialise flags panneaux, options et a11y avant rebuild du menu principal. */
export function prepareMenuRebuild(ui) {
    resetMenuPanelFlags(ui);
    teardownOptionsPanel(ui);
    const scene = ui.scene;
    if (scene) {
        setOptionsPanelAccessibility(scene, false);
        setScoresPanelAccessibility(scene, false);
        setSkinsPanelAccessibility(scene, false);
    }
    for (const key of ['menu', 'pause', 'gameOver']) {
        ui.clearOverlay(key);
    }
    resetMenuPanelRefs(ui);
    destroyInGameControls(ui);
    if (ui._startText?.scene?.tweens) {
        ui.scene.tweens.killTweensOf(ui._startText);
    }
    ui._restartBtnGraphics = null;
    ui._restartBtnText = null;
    ui._menuBtnGraphics = null;
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
        ui._dailyBtnSubtitle,
        ui._dailyBtnHit,
        ui._startText,
        ui._startHit,
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

/** @param {import('./ui.js').UI} ui @param {number} scale @param {boolean} [trainingMode] */
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
