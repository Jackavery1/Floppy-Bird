import { GAME_CONFIG } from './config.js';
import { DESIGN_TOKENS, hexVersPhaser } from './designTokens.js';

export const MIN_TOUCH = 44;
export const PAUSE_BTN_VISUAL = MIN_TOUCH;
/** Marge droite (px jeu) pour le bouton pause — évite les taps ratés au bord letterbox. */
export const PAUSE_BTN_INSET = 12;
/** Marge haute minimale (px jeu) pour HUD pause / score sous encoche visuelle. */
export const HUD_SAFE_TOP = 16;

export const GAME_OVER_PANEL = { x: 24, y: 80, w: 240, h: 340, radius: 12 };

export const UI_LAYOUT = {
    scoreHud: 68,
    menu: {
        title: 108,
        difficulty: 142,
        dailyBtn: 186,
        dailySubtitle: 212,
        start: 248,
        menuRow: 292,
        scoresBtn: 56,
        optionsBtn: 144,
        skinsBtn: 232,
        menuBtnW: MIN_TOUCH * 2,
        hint1: 336,
    },
    optionsPanel: {
        panelTop: 200,
        panelH: 252,
        w: 252,
        hintLine: 218,
        training: 256,
        hardcore: 296,
        mute: 336,
        hint2: 376,
    },
    scoresPanel: {
        panelTop: 188,
        panelH: 292,
        w: 252,
        scoresTitle: 212,
        scoresFirst: 244,
        scoresGap: 28,
        scoresHardcore: 332,
        scoresAchievements: 360,
    },
    skinsPanel: {
        panelTop: 132,
        panelH: 286,
        w: 252,
        skinsTitle: 156,
        skinsSubtitle: 172,
        skinsRow1: 208,
        skinsHint: 408,
    },
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
    menuMute: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.mute },
    menuTraining: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.training },
    menuHardcore: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.hardcore },
    menuDiffEasy: { x: diffButtonCenter(0), y: UI_LAYOUT.menu.difficulty },
    menuDiffNormal: { x: diffButtonCenter(1), y: UI_LAYOUT.menu.difficulty },
    menuDiffHard: { x: diffButtonCenter(2), y: UI_LAYOUT.menu.difficulty },
    menuSkinsPrev: { x: GAME_CONFIG.centerX - 100, y: UI_LAYOUT.skinsPanel.skinsRow1 },
    menuSkinsNext: { x: GAME_CONFIG.centerX + 100, y: UI_LAYOUT.skinsPanel.skinsRow1 },
    pauseButton: { x: UI_LAYOUT.playing.pauseBtnX, y: UI_LAYOUT.playing.pauseBtnY },
    pauseResume: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.pause.resumeBtn },
    pauseMenu: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.pause.menuBtn },
    scoreHud: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.scoreHud },
});

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
