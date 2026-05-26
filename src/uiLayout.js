import { GAME_CONFIG } from './config.js';

const cx = () => GAME_CONFIG.centerX;

export const GAME_OVER_PANEL = {
    x: 24,
    y: 80,
    w: 240,
    h: 340,
    radius: 12,
};

export const UI_LAYOUT = {
    scoreHud: 48,
    menu: {
        title: 120,
        best: 162,
        difficulty: 204,
        start: 264,
        hintBar: 472,
        hint1: 460,
        hint2: 475,
        mute: 442,
    },
    pause: {
        title: 228,
        escHint: 264,
        menuHint: 282,
    },
    diffBtn: { width: 68, height: 26, gap: 10, radius: 6, x: [32, 110, 188] },
    menuBtn: { width: 100, height: 36, radius: 8 },
    hintBarHeight: 80,
};

export function layoutX() {
    return cx();
}

export function layoutDiffButtonCenter(index) {
    const { diffBtn } = UI_LAYOUT;
    return diffBtn.x[index] + diffBtn.width / 2;
}
