import { GAME_CONFIG } from './config.js';

export const MIN_TOUCH = 44;

export const GAME_OVER_PANEL = { x: 24, y: 80, w: 240, h: 340, radius: 12 };

export const UI_LAYOUT = {
    scoreHud: 48,
    menu: {
        title: 120,
        best: 148,
        training: 178,
        difficulty: 204,
        start: 264,
        hint1: 460,
        hint2: 475,
        mute: 442,
    },
    pause: { title: 210, resumeBtn: 250, menuBtn: 298 },
    playing: { trainingBadgeY: 22, pauseBtnX: 264, pauseBtnY: 28 },
    diffBtn: { width: 68, height: 26, gap: 10, radius: 6, x: [32, 110, 188] },
    menuBtn: { width: 100, height: 36, radius: 8 },
};

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
