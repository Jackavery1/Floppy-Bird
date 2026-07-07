import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';

export const MIN_TOUCH = 44;

/** Grille spacing 4 px — référence layout menu / HUD. */
export const SPACING = Object.freeze({
    unit: 4,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    touch: MIN_TOUCH,
});
/** Taille minimale des hints secondaires (menu, game over, HUD). */
export const FONT_SIZE_HINT = '11px';
/** Petits badges in-game (mode, objectif). */
export const FONT_SIZE_BADGE = '11px';
/** Petits labels compacts (grille skins). */
export const FONT_SIZE_COMPACT = '10px';
export const PAUSE_BTN_VISUAL = MIN_TOUCH;
/** Marge droite (px jeu) pour le bouton pause — évite les taps ratés au bord letterbox. */
export const PAUSE_BTN_INSET = 12;
/** Marge haute minimale (px jeu) pour HUD pause / score sous encoche visuelle. */
export const HUD_SAFE_TOP = 16;

/** Marge entre le bas du panneau et le bouton RETOUR. */
export const PANEL_CLOSE_INSET = SPACING.md;

/** @param {number} panelTop @param {number} panelH @param {number} [inset] */
export function panelCloseBtnY(panelTop, panelH, inset = PANEL_CLOSE_INSET) {
    return panelTop + panelH - inset - MIN_TOUCH / 2;
}

/** @param {{ y: number, h: number }} [panel] */
export function gameOverMenuBtnY(panel = GAME_OVER_PANEL) {
    return panelCloseBtnY(panel.y, panel.h);
}

/** @param {{ y: number, h: number }} [panel] */
export function gameOverRestartBtnY(panel = GAME_OVER_PANEL) {
    return gameOverMenuBtnY(panel) - MIN_TOUCH - SPACING.sm;
}

/** @param {{ panelTop: number, panelH: number }} panel */
function withPanelCloseBtn(panel) {
    return { ...panel, closeBtn: panelCloseBtnY(panel.panelTop, panel.panelH) };
}

const OPTIONS_TAB_INSET = 10;
const OPTIONS_TAB_GAP = 6;

/** @param {{ w: number }} panel */
function withOptionsTabs(panel) {
    const panelLeft = GAME_CONFIG.centerX - panel.w / 2;
    const innerW = panel.w - OPTIONS_TAB_INSET * 2;
    const tabBtnW = Math.floor((innerW - OPTIONS_TAB_GAP * 2) / 3);
    const tabControlsX = panelLeft + OPTIONS_TAB_INSET + tabBtnW / 2;
    const tabSettingsX = tabControlsX + tabBtnW + OPTIONS_TAB_GAP;
    const tabModesX = tabSettingsX + tabBtnW + OPTIONS_TAB_GAP;
    return {
        ...panel,
        tabBtnW,
        tabControlsX,
        tabSettingsX,
        tabModesX,
        tabInset: OPTIONS_TAB_INSET,
    };
}

export const GAME_OVER_PANEL = { x: 24, y: 60, w: 240, h: 400, radius: 12 };

export const UI_LAYOUT = {
    scoreHud: 68,
    menu: {
        title: 108,
        difficulty: 200,
        start: 278,
        dailyBtn: 318,
        menuRow: 378,
        scoresBtn: 56,
        optionsBtn: 144,
        skinsBtn: 232,
        menuBtnW: MIN_TOUCH * 2,
        hint1: 424,
    },
    optionsPanel: withPanelCloseBtn(
        withOptionsTabs({
            panelTop: 100,
            panelH: 380,
            w: 260,
            tabRow: 120,
            controlsTitle: 162,
            controlsFirst: 196,
            controlsGap: 22,
            training: 212,
            hardcore: 264,
            settingsMute: 240,
        })
    ),
    scoresPanel: withPanelCloseBtn({
        panelTop: 108,
        panelH: 356,
        w: 260,
        scoresTitle: 140,
        scoresFirst: 176,
        scoresGap: 30,
        scoresHardcore: 272,
        scoresAchievements: 306,
    }),
    skinsPanel: withPanelCloseBtn({
        panelTop: 132,
        panelH: 372,
        w: 252,
        skinsTitle: 156,
        skinsSubtitle: 172,
        skinsRow1: 208,
        skinsHint: 408,
    }),
    pause: { title: 210, resumeBtn: 250, menuBtn: 302 },
    playing: {
        trainingBadgeY: 30,
        hardcoreBadgeY: 44,
        pauseBtnX: GAME_CONFIG.width - MIN_TOUCH / 2 - PAUSE_BTN_INSET,
        pauseBtnY: MIN_TOUCH / 2 + HUD_SAFE_TOP,
    },
    diffBtn: { width: 68, height: MIN_TOUCH, gap: 10, radius: 6, x: [32, 110, 188] },
    menuBtn: { width: 100, height: MIN_TOUCH, radius: 8 },
};

/** Coordonnées jeu (288×512) pour les tests e2e tactile / pointer. */
export const TOUCH_TARGETS = Object.freeze({
    menuStart: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.menu.start },
    menuDaily: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.menu.dailyBtn },
    menuScores: { x: UI_LAYOUT.menu.scoresBtn, y: UI_LAYOUT.menu.menuRow },
    menuOptions: { x: UI_LAYOUT.menu.optionsBtn, y: UI_LAYOUT.menu.menuRow },
    menuSkins: { x: UI_LAYOUT.menu.skinsBtn, y: UI_LAYOUT.menu.menuRow },
    menuMute: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.settingsMute },
    menuTraining: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.training },
    menuHardcore: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.hardcore },
    menuOptionsTabControls: {
        x: UI_LAYOUT.optionsPanel.tabControlsX,
        y: UI_LAYOUT.optionsPanel.tabRow,
    },
    menuOptionsTabSettings: {
        x: UI_LAYOUT.optionsPanel.tabSettingsX,
        y: UI_LAYOUT.optionsPanel.tabRow,
    },
    menuOptionsTabModes: { x: UI_LAYOUT.optionsPanel.tabModesX, y: UI_LAYOUT.optionsPanel.tabRow },
    menuOptionsClose: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.closeBtn },
    menuScoresClose: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.scoresPanel.closeBtn },
    menuSkinsClose: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.skinsPanel.closeBtn },
    menuDiffEasy: { x: diffButtonCenter(0), y: UI_LAYOUT.menu.difficulty },
    menuDiffNormal: { x: diffButtonCenter(1), y: UI_LAYOUT.menu.difficulty },
    menuDiffHard: { x: diffButtonCenter(2), y: UI_LAYOUT.menu.difficulty },
    menuSkinsPrev: { x: GAME_CONFIG.centerX - 100, y: UI_LAYOUT.skinsPanel.skinsRow1 },
    menuSkinsNext: { x: GAME_CONFIG.centerX + 100, y: UI_LAYOUT.skinsPanel.skinsRow1 },
    pauseButton: { x: UI_LAYOUT.playing.pauseBtnX, y: UI_LAYOUT.playing.pauseBtnY },
    pauseResume: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.pause.resumeBtn },
    pauseMenu: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.pause.menuBtn },
    gameOverRestart: { x: GAME_CONFIG.centerX, y: gameOverRestartBtnY() },
    gameOverMenu: { x: GAME_CONFIG.centerX, y: gameOverMenuBtnY() },
    scoreHud: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.scoreHud },
});

export const GAME_OVER_RESTART_BTN_WIDTH = 100;
export const GAME_OVER_RESTART_BTN_COLOR = hexVersPhaser(DESIGN_TOKENS.accent);
export const GAME_OVER_RESTART_BTN_HOVER = hexVersPhaser(DESIGN_TOKENS.accentTitre);
export const PAUSE_BTN_COLOR = hexVersPhaser(DESIGN_TOKENS.boutonPause);
export const PAUSE_BTN_HOVER = hexVersPhaser(DESIGN_TOKENS.boutonPauseHover);
export const MENU_BTN_COLOR = hexVersPhaser(DESIGN_TOKENS.boutonMenu);
export const MENU_BTN_HOVER = hexVersPhaser(DESIGN_TOKENS.boutonMenuHover);
export const DIFF_BTN_ACTIVE = hexVersPhaser(DESIGN_TOKENS.accent);
export const DIFF_BTN_IDLE = { color: 0xffffff, alpha: 0.2 };
export const DIFF_BTN_HOVER = { color: 0xffffff, alpha: 0.38 };
export const TITLE_MAX_WIDTH = 260;
export const PANEL_TEXT_MAX_WIDTH = 236;
export const DAILY_BTN_TEXT_MAX_WIDTH = 216;
export const GAME_TITLE = 'FLOPPY BIRD';
export const FONT = DESIGN_TOKENS.policeInterface;
export const FONT_TITLE = DESIGN_TOKENS.policeTitre;

export function computeMenuLayout() {
    return { ...UI_LAYOUT.menu };
}

export function diffButtonCenter(index) {
    const { diffBtn } = UI_LAYOUT;
    return diffBtn.x[index] + diffBtn.width / 2;
}

export function stopUiEvent(event) {
    event?.stopPropagation?.();
}
