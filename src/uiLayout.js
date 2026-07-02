import { GAME_CONFIG } from './config.js';

export const MIN_TOUCH = 44;
export const PAUSE_BTN_VISUAL = MIN_TOUCH;
/** Espacement vertical minimal entre centres de lignes tactiles (évite chevauchement 44 px). */
export const MENU_ROW_GAP = 44;

export const GAME_OVER_PANEL = { x: 24, y: 80, w: 240, h: 340, radius: 12 };

export const UI_LAYOUT = {
    scoreHud: 48,
    menu: {
        title: 108,
        difficulty: 142,
        dailyBtn: 186,
        dailySubtitle: 212,
        start: 248,
        menuRow: 292,
        scoresBtn: 58,
        optionsBtn: 144,
        skinsBtn: 230,
        menuBtnW: 72,
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
    playing: { trainingBadgeY: 22, hardcoreBadgeY: 36, pauseBtnX: 258, pauseBtnY: 32 },
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
export const PANEL_TEXT_MAX_WIDTH = 236;
export const DAILY_BTN_TEXT_MAX_WIDTH = 216;
export const GAME_TITLE = 'FLOPPY BIRD';
export const FONT = "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif";

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

/**
 * Texte centré avec ombre portée (relief). Retourne { shadow, label }.
 * @param {import('phaser').Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} text
 * @param {Phaser.Types.GameObjects.Text.TextStyle} style
 * @param {number} depth profondeur du label principal (l’ombre est depth - 1)
 * @param {{ dx?: number, dy?: number, fill?: string, alpha?: number }} [relief]
 */
export function addReliefText(scene, x, y, text, style, depth, relief = {}) {
    const dx = relief.dx ?? 3;
    const dy = relief.dy ?? 3;
    const shadowFill = relief.fill ?? '#1a1a2e';
    const shadowAlpha = relief.alpha ?? 0.55;
    const base = { fontFamily: FONT, ...style };

    const shadow = scene.add.text(x + dx, y + dy, text, {
        ...base,
        fill: shadowFill,
        stroke: undefined,
        strokeThickness: 0,
    });
    shadow.setOrigin(0.5, 0.5);
    shadow.setAlpha(shadowAlpha);
    shadow.setDepth(depth - 1);

    const label = scene.add.text(x, y, text, base);
    label.setOrigin(0.5, 0.5);
    label.setDepth(depth);

    return { shadow, label };
}

export function diffLabelColor(difficulty, diff) {
    if (difficulty === diff) return '#000000';
    return GAME_CONFIG.difficultyColors[diff] ?? '#ffffff';
}

export function fitTitleFontSize(scene, text, maxWidth = TITLE_MAX_WIDTH) {
    return fitLabelFontSize(scene, text, {
        fontSize: '48px',
        fontStyle: 'bold',
        stroke: '#E65100',
        strokeThickness: 3,
    }, maxWidth, 14, 2);
}

export function fitLabelFontSize(
    scene,
    text,
    style,
    maxWidth = PANEL_TEXT_MAX_WIDTH,
    minSize = 8,
    step = 1,
) {
    const baseSize = parseInt(String(style.fontSize ?? '12px'), 10) || 12;
    let fontSize = baseSize;
    while (fontSize >= minSize) {
        const probe = scene.make.text({
            x: 0,
            y: 0,
            text,
            style: {
                fontFamily: FONT,
                ...style,
                fontSize: `${fontSize}px`,
            },
            add: false,
        });
        if (probe.width <= maxWidth) {
            probe.destroy();
            return fontSize;
        }
        probe.destroy();
        fontSize -= step;
    }
    return minSize;
}

export function applyFittedLabel(scene, label, text, style, maxWidth = PANEL_TEXT_MAX_WIDTH) {
    const fontSize = fitLabelFontSize(scene, text, style, maxWidth);
    label.setText(text);
    label.setFontSize?.(fontSize);
}

export function addFittedCenteredText(scene, x, y, text, style, depth, maxWidth = PANEL_TEXT_MAX_WIDTH) {
    const label = addCenteredText(scene, x, y, text, style, depth);
    applyFittedLabel(scene, label, text, style, maxWidth);
    return label;
}

