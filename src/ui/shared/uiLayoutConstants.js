import { GAME_CONFIG } from '../../config.js';
import { DESIGN_TOKENS, hexVersPhaser } from '../../designTokens.js';

export const MIN_TOUCH = 44;
/** CTA primaires (démarrer, sauter, rejouer) — recommandation Material 48 px. */
export const MIN_CTA_TOUCH = 48;
/** Hit zone SCORES / OPT. / SKINS — hauteur Material 48, largeur visuelle inchangée. */
export const MENU_SECONDARY_HIT = MIN_CTA_TOUCH;

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
export {
    FONT_SIZE_HINT,
    FONT_SIZE_BADGE,
    FONT_SIZE_COMPACT,
    FONT_SIZE_BODY,
    FONT_SIZE_SMALL,
    FONT_SIZE_TINY,
    FONT_SIZE_CHROME,
    FONT_SIZE_BANNER,
    FONT_SIZE_EMPHASIS,
    FONT_SIZE_TITLE,
    FONT_SIZE_DISPLAY,
    FONT_SIZE_SCORE,
} from './fontSizes.js';
export const PAUSE_BTN_VISUAL = MIN_TOUCH;
/** Zone tactile du bouton pause (coin HUD) — alignée CTA 48 px. */
export const PAUSE_BTN_HIT = MIN_CTA_TOUCH;
/** Marge droite (px jeu) pour le bouton pause — évite les taps ratés au bord letterbox. */
export const PAUSE_BTN_INSET = 12;
/** Marge haute minimale (px jeu) pour HUD pause / score sous encoche visuelle. */
export const HUD_SAFE_TOP = 16;

/** Marge entre le bas du panneau et le bouton RETOUR. */
export const PANEL_CLOSE_INSET = SPACING.md;

/** @param {number} panelTop @param {number} panelH @param {number} [inset] @param {number} [hit] */
export function panelCloseBtnY(panelTop, panelH, inset = PANEL_CLOSE_INSET, hit = MIN_TOUCH) {
    return panelTop + panelH - inset - hit / 2;
}

/** @param {{ y: number, h: number }} [panel] */
export function gameOverMenuBtnY(panel = GAME_OVER_PANEL) {
    return panelCloseBtnY(panel.y, panel.h, PANEL_CLOSE_INSET, MIN_CTA_TOUCH);
}

/** @param {{ y: number, h: number }} [panel] */
export function gameOverRestartBtnY(panel = GAME_OVER_PANEL) {
    return gameOverMenuBtnY(panel) - MIN_CTA_TOUCH - SPACING.sm;
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
    const tabBtnW = Math.floor((innerW - OPTIONS_TAB_GAP) / 2);
    const tabControlsX = panelLeft + OPTIONS_TAB_INSET + tabBtnW / 2;
    const tabPreferencesX = tabControlsX + tabBtnW + OPTIONS_TAB_GAP;
    return {
        ...panel,
        tabBtnW,
        tabControlsX,
        tabPreferencesX,
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
        dailySubtitle: 348,
        menuRow: 378,
        scoresBtn: 52,
        optionsBtn: 144,
        skinsBtn: 236,
        /** Largeur visuelle SCORES/OPT./SKINS ; hit hauteur = MENU_SECONDARY_HIT (48). */
        menuBtnW: 80,
        hint1: 424,
    },
    optionsPanel: withPanelCloseBtn(
        withOptionsTabs({
            panelTop: 88,
            panelH: 400,
            w: 268,
            tabRow: 112,
            controlsTitle: 156,
            controlsFirst: 190,
            controlsGap: 23,
            settingsMute: 180,
            training: 224,
            trainingSpeed: 268,
            hardcore: 312,
        })
    ),
    scoresPanel: withPanelCloseBtn({
        panelTop: 96,
        panelH: 400,
        w: 260,
        scoresTitle: 132,
        scoresFirst: 168,
        scoresGap: 30,
        scoresHardcoreFirst: 268,
        scoresHardcoreGap: 28,
        scoresAchievements: 360,
    }),
    skinsPanel: withPanelCloseBtn({
        panelTop: 80,
        panelH: 424,
        w: 268,
        skinsTitle: 118,
        skinsSubtitle: 140,
        skinsPattern: 164,
        skinsRow1: 208,
    }),
    pause: { title: 210, resumeBtn: 250, menuBtn: 302 },
    playing: {
        trainingBadgeY: 30,
        hardcoreBadgeY: 44,
        pauseBtnX: GAME_CONFIG.width - PAUSE_BTN_HIT / 2 - PAUSE_BTN_INSET,
        pauseBtnY: PAUSE_BTN_HIT / 2 + HUD_SAFE_TOP,
        /** Sous la zone jump a11y (96×96 à centerY) — évite le conflit « TAP : passer ». */
        tutorialSkipY: GAME_CONFIG.centerY + MIN_CTA_TOUCH + MIN_CTA_TOUCH / 2 + SPACING.sm,
    },
    diffBtn: { width: 68, height: MIN_TOUCH, gap: 10, radius: 6, x: [32, 110, 188] },
    menuBtn: { width: 100, height: MIN_CTA_TOUCH, radius: 8 },
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
    menuTrainingSpeed: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.trainingSpeed },
    menuHardcore: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.hardcore },
    menuOptionsTabControls: {
        x: UI_LAYOUT.optionsPanel.tabControlsX,
        y: UI_LAYOUT.optionsPanel.tabRow,
    },
    menuOptionsTabPreferences: {
        x: UI_LAYOUT.optionsPanel.tabPreferencesX,
        y: UI_LAYOUT.optionsPanel.tabRow,
    },
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
    tutorialSkip: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.playing.tutorialSkipY },
    gameOverRestart: { x: GAME_CONFIG.centerX, y: gameOverRestartBtnY() },
    gameOverMenu: { x: GAME_CONFIG.centerX, y: gameOverMenuBtnY() },
    scoreHud: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.scoreHud },
});

export const GAME_OVER_RESTART_BTN_WIDTH = 100;
export const GAME_OVER_RESTART_BTN_HEIGHT = MIN_CTA_TOUCH;
export const GAME_OVER_RESTART_BTN_COLOR = hexVersPhaser(DESIGN_TOKENS.accent);
export const GAME_OVER_RESTART_BTN_HOVER = hexVersPhaser(DESIGN_TOKENS.accentHover);
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
