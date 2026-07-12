import { GAME_CONFIG } from './config.js';
import { formatDailyMenuButtonLabel, formatDailyMenuSubtitle } from './dailyChallenge.js';
import {
    DESIGN_TOKENS,
    hexVersPhaser,
    menuHomeTextStyle,
    panelChromeTextStyle,
} from './designTokens.js';
import {
    addCenteredText,
    applyFittedLabel,
    DAILY_BTN_TEXT_MAX_WIDTH,
    DEPTH,
    MIN_TOUCH,
    stopUiEvent,
} from './uiLayout.js';

const DAILY_BTN_COLOR = hexVersPhaser(DESIGN_TOKENS.boutonDaily);
const DAILY_BTN_HOVER = hexVersPhaser(DESIGN_TOKENS.boutonDailyHover);

const DAILY_BTN_STYLE = panelChromeTextStyle({
    fontSize: '12px',
    fill: DESIGN_TOKENS.texteMenu,
    fontStyle: 'bold',
    stroke: DESIGN_TOKENS.badgeDailyContour,
});

const DAILY_SUBTITLE_STYLE = menuHomeTextStyle({
    fontSize: '10px',
    fill: DESIGN_TOKENS.badgeDailySecondary,
});

export function buildMenuDailyChallenge(ui, elements, layout, difficulty) {
    ui._dailyBtnBg = ui.scene.add.rectangle(
        GAME_CONFIG.centerX,
        layout.dailyBtn,
        228,
        MIN_TOUCH,
        DAILY_BTN_COLOR,
        0.9
    );
    ui._dailyBtnBg.setDepth(DEPTH.MENU_BTN_BG);
    ui._dailyBtnBg.setStrokeStyle(2, DAILY_BTN_HOVER, 0.7);
    elements.push(ui._dailyBtnBg);

    ui._dailyBtnLabel = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        layout.dailyBtn,
        formatDailyMenuButtonLabel(difficulty),
        DAILY_BTN_STYLE,
        DEPTH.MENU_BTN_BG
    );
    applyFittedLabel(
        ui.scene,
        ui._dailyBtnLabel,
        formatDailyMenuButtonLabel(difficulty),
        DAILY_BTN_STYLE,
        DAILY_BTN_TEXT_MAX_WIDTH
    );
    elements.push(ui._dailyBtnLabel);

    ui._dailyBtnSubtitle = addCenteredText(
        ui.scene,
        GAME_CONFIG.centerX,
        layout.dailySubtitle,
        formatDailyMenuSubtitle(difficulty),
        DAILY_SUBTITLE_STYLE,
        DEPTH.MENU_BTN_BG
    );
    applyFittedLabel(
        ui.scene,
        ui._dailyBtnSubtitle,
        formatDailyMenuSubtitle(difficulty),
        DAILY_SUBTITLE_STYLE,
        DAILY_BTN_TEXT_MAX_WIDTH
    );
    elements.push(ui._dailyBtnSubtitle);

    ui._dailyBtnHit = ui.scene.add.rectangle(
        GAME_CONFIG.centerX,
        layout.dailyBtn,
        228,
        MIN_TOUCH,
        0x000000,
        0
    );
    ui._dailyBtnHit.setDepth(DEPTH.MENU_HIT);
    ui._dailyBtnHit.setInteractive({ useHandCursor: true });
    ui._dailyBtnHit.on('pointerover', () => {
        ui._dailyBtnBg.setFillStyle(DAILY_BTN_HOVER, 0.95);
    });
    ui._dailyBtnHit.on('pointerout', () => {
        ui._dailyBtnBg.setFillStyle(DAILY_BTN_COLOR, 0.9);
    });
    ui._dailyBtnHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        ui.scene.launchDailyChallenge();
    });
    elements.push(ui._dailyBtnHit);
}

export function refreshDailyChallengeButton(ui, difficulty) {
    if (!ui._dailyBtnLabel) return;
    const label = formatDailyMenuButtonLabel(difficulty);
    applyFittedLabel(ui.scene, ui._dailyBtnLabel, label, DAILY_BTN_STYLE, DAILY_BTN_TEXT_MAX_WIDTH);
    if (!ui._dailyBtnSubtitle) return;
    const subtitle = formatDailyMenuSubtitle(difficulty);
    applyFittedLabel(
        ui.scene,
        ui._dailyBtnSubtitle,
        subtitle,
        DAILY_SUBTITLE_STYLE,
        DAILY_BTN_TEXT_MAX_WIDTH
    );
}
