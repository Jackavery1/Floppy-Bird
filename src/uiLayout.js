import { GAME_CONFIG } from './config.js';

export const MIN_TOUCH = 44;
export const PAUSE_BTN_VISUAL = MIN_TOUCH;
/** Espacement vertical minimal entre centres de lignes tactiles (évite chevauchement 44 px). */
export const MENU_ROW_GAP = MIN_TOUCH;

export const GAME_OVER_PANEL = { x: 24, y: 80, w: 240, h: 340, radius: 12 };

export const UI_LAYOUT = {
    scoreHud: 48,
    menu: {
        title: 108,
        best: 136,
        difficulty: 176,
        start: 234,
        optionsBtn: 278,
        hint1: 314,
    },
    optionsPanel: {
        panelTop: 198,
        panelH: 278,
        w: 240,
        daily: 216,
        training: 256,
        hardcore: 296,
        dailyToggle: 336,
        metaSkin: 376,
        mute: 416,
        hint2: 450,
    },
    pause: { title: 210, resumeBtn: 250, menuBtn: 302 },
    playing: { trainingBadgeY: 22, hardcoreBadgeY: 36, pauseBtnX: 258, pauseBtnY: 32 },
    diffBtn: { width: 68, height: MIN_TOUCH, gap: 10, radius: 6, x: [32, 110, 188] },
    menuBtn: { width: 100, height: MIN_TOUCH, radius: 8 },
};

/** Coordonnées jeu (288×512) pour les tests e2e tactile / pointer. */
export const TOUCH_TARGETS = Object.freeze({
    menuStart: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.menu.start },
    menuOptions: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.menu.optionsBtn },
    menuMute: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.mute },
    menuSkin: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.metaSkin },
    menuTraining: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.training },
    menuHardcore: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.hardcore },
    menuDailyToggle: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.optionsPanel.dailyToggle },
    menuDiffEasy: { x: diffButtonCenter(0), y: UI_LAYOUT.menu.difficulty },
    menuDiffNormal: { x: diffButtonCenter(1), y: UI_LAYOUT.menu.difficulty },
    menuDiffHard: { x: diffButtonCenter(2), y: UI_LAYOUT.menu.difficulty },
    pauseButton: { x: UI_LAYOUT.playing.pauseBtnX, y: UI_LAYOUT.playing.pauseBtnY },
    pauseResume: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.pause.resumeBtn },
    pauseMenu: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.pause.menuBtn },
});

export const PAUSE_BTN_COLOR = 0x37474F;
export const PAUSE_BTN_HOVER = 0x546E7A;
export const MENU_BTN_COLOR = 0x1565C0;
export const MENU_BTN_HOVER = 0x42A5F5;
export const DIFF_BTN_ACTIVE = 0xFDD835;
export const DIFF_BTN_IDLE = { color: 0xffffff, alpha: 0.2 };
export const DIFF_BTN_HOVER = { color: 0xffffff, alpha: 0.38 };
export const TITLE_MAX_WIDTH = 260;
export const GAME_TITLE = 'FLOPPY BIRD';
export const FONT = 'Arial';

export function computeMenuLayout() {
    return { ...UI_LAYOUT.menu, compact: false };
}

export function diffButtonCenter(index) {
    const { diffBtn } = UI_LAYOUT;
    return diffBtn.x[index] + diffBtn.width / 2;
}

export function stopUiEvent(event) {
    event?.stopPropagation?.();
}

export function addCenteredText(scene, x, y, text, style, depth) {
    const label = scene.add.text(x, y, text, { fontFamily: FONT, ...style });
    label.setOrigin(0.5, 0.5);
    label.setDepth(depth);
    return label;
}

export function diffLabelColor(difficulty, diff) {
    if (difficulty === diff) return '#000000';
    return GAME_CONFIG.difficultyColors[diff] ?? '#ffffff';
}

export function fitTitleFontSize(scene, text, maxWidth = TITLE_MAX_WIDTH) {
    let fontSize = 48;
    while (fontSize >= 14) {
        const probe = scene.make.text({
            x: 0,
            y: 0,
            text,
            style: {
                fontSize: `${fontSize}px`,
                fontStyle: 'bold',
                fontFamily: FONT,
                stroke: '#E65100',
                strokeThickness: 3,
            },
            add: false,
        });
        if (probe.width < maxWidth) {
            probe.destroy();
            return fontSize;
        }
        probe.destroy();
        fontSize -= 2;
    }
    return 26;
}
