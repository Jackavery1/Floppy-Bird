import { GAME_CONFIG } from './config.js';

export const MIN_TOUCH = 44;

export const GAME_OVER_PANEL = { x: 24, y: 80, w: 240, h: 340, radius: 12 };

export const UI_LAYOUT = {
    scoreHud: 48,
    menu: {
        title: 120,
        best: 148,
        daily: 158,
        training: 172,
        hardcore: 192,
        difficulty: 216,
        start: 276,
        hint1: 460,
        hint2: 475,
        mute: 442,
    },
    pause: { title: 210, resumeBtn: 250, menuBtn: 298 },
    playing: { trainingBadgeY: 22, hardcoreBadgeY: 36, pauseBtnX: 264, pauseBtnY: 28 },
    diffBtn: { width: 68, height: 26, gap: 10, radius: 6, x: [32, 110, 188] },
    menuBtn: { width: 100, height: 36, radius: 8 },
};

/** Coordonnées jeu (288×512) pour les tests e2e tactile / pointer. */
export const TOUCH_TARGETS = Object.freeze({
    menuStart: { x: GAME_CONFIG.centerX, y: UI_LAYOUT.menu.start },
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

export function modesAccordionLabel(expanded, trainingMode, hardcoreMode) {
    const chevron = expanded ? '▾' : '▸';
    const ent = trainingMode ? 'ON' : 'OFF';
    const hard = hardcoreMode ? 'ON' : 'OFF';
    return `${chevron} MODES · Entr.${ent} · Hard.${hard}`;
}

export function computeMenuLayout(compact, modesExpanded) {
    if (!compact) {
        return { ...UI_LAYOUT.menu, compact: false, modesExpanded: true, modesHeader: null };
    }
    let y = 168;
    const layout = {
        compact: true,
        modesExpanded,
        title: UI_LAYOUT.menu.title,
        best: UI_LAYOUT.menu.best,
        daily: UI_LAYOUT.menu.daily,
        modesHeader: y,
    };
    if (modesExpanded) {
        y += 20;
        layout.training = y;
        y += 20;
        layout.hardcore = y;
        y += 14;
    } else {
        layout.training = null;
        layout.hardcore = null;
        y += 22;
    }
    layout.difficulty = y;
    layout.start = layout.difficulty + 60;
    layout.mute = layout.start + 166;
    layout.hint1 = layout.mute + 18;
    layout.hint2 = layout.hint1 + 15;
    return layout;
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
