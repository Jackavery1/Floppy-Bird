import { GAME_CONFIG, DIFFICULTY_ORDER } from './config.js';
import { menuControlsHint } from './device.js';
import {
    formatDailyMenuButtonLabel,
    formatDailyMenuSubtitle,
} from './dailyChallenge.js';
import { sceneTween } from './motion.js';
import {
    addCenteredText,
    addReliefText,
    applyFittedLabel,
    DAILY_BTN_TEXT_MAX_WIDTH,
    diffButtonCenter,
    diffLabelColor,
    fitTitleFontSize,
    GAME_TITLE,
    MIN_TOUCH,
    PANEL_TEXT_MAX_WIDTH,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';
import { drawDiffButtons } from './uiMenuLayout.js';

export function buildMenuHeader(ui, elements, layout) {
    const titleSize = fitTitleFontSize(ui.scene, GAME_TITLE);
    const titleStyle = {
        fontSize: `${titleSize}px`,
        fill: '#FDD835',
        fontStyle: 'bold',
        stroke: '#E65100',
        strokeThickness: 4,
    };
    const { shadow, label: title } = addReliefText(
        ui.scene,
        GAME_CONFIG.centerX,
        layout.title,
        GAME_TITLE,
        titleStyle,
        51,
        { dx: 3, dy: 4, fill: '#BF360C', alpha: 0.65 },
    );
    ui._menuTitleShadow = shadow;
    elements.push(shadow, title);

    return title;
}

export function buildMenuDifficulty(ui, elements, layout, difficulty) {
    const { diffBtn } = UI_LAYOUT;
    ui._diffBtnGraphics = ui.scene.add.graphics().setDepth(52);
    elements.push(ui._diffBtnGraphics);
    drawDiffButtons(ui, difficulty, layout);

    ui._diffBtnLabels = [];
    DIFFICULTY_ORDER.forEach((diff, i) => {
        const btnCx = diffButtonCenter(i);
        const label = addCenteredText(ui.scene, btnCx, layout.difficulty,
            GAME_CONFIG.difficultyLabels[diff], {
                fontSize: '9px',
                fill: diffLabelColor(ui._currentDifficulty, diff),
                fontStyle: 'bold',
            }, 53);
        elements.push(label);

        const hitZone = ui.scene.add.rectangle(
            btnCx, layout.difficulty, diffBtn.width, MIN_TOUCH, 0x000000, 0,
        );
        hitZone.setDepth(54);
        hitZone.setInteractive({ useHandCursor: true });
        hitZone.on('pointerover', () => {
            ui._hoveredDifficulty = diff;
            drawDiffButtons(ui, ui._currentDifficulty, ui._menuLayout);
        });
        hitZone.on('pointerout', () => {
            ui._hoveredDifficulty = null;
            drawDiffButtons(ui, ui._currentDifficulty, ui._menuLayout);
        });
        hitZone.on('pointerdown', (_p, _lx, _ly, event) => {
            stopUiEvent(event);
            ui.scene.changeDifficulty(diff);
        });
        ui._diffBtnLabels.push({ label, diff, hitZone });
        elements.push(hitZone);
    });
}

const DAILY_BTN_COLOR = 0x6A1B9A;
const DAILY_BTN_HOVER = 0x9C27B0;

export function buildMenuDailyChallenge(ui, elements, layout, difficulty) {
    ui._dailyBtnBg = ui.scene.add.rectangle(
        GAME_CONFIG.centerX, layout.dailyBtn, 228, MIN_TOUCH, DAILY_BTN_COLOR, 0.9,
    );
    ui._dailyBtnBg.setDepth(53);
    ui._dailyBtnBg.setStrokeStyle(2, DAILY_BTN_HOVER, 0.7);
    elements.push(ui._dailyBtnBg);

    ui._dailyBtnLabel = addCenteredText(
        ui.scene, GAME_CONFIG.centerX, layout.dailyBtn,
        formatDailyMenuButtonLabel(difficulty), {
            fontSize: '10px',
            fill: '#FFFFFF',
            fontStyle: 'bold',
            stroke: '#4A148C',
            strokeThickness: 2,
        }, 54,
    );
    applyFittedLabel(
        ui.scene,
        ui._dailyBtnLabel,
        formatDailyMenuButtonLabel(difficulty),
        {
            fontSize: '10px',
            fill: '#FFFFFF',
            fontStyle: 'bold',
            stroke: '#4A148C',
            strokeThickness: 2,
        },
        DAILY_BTN_TEXT_MAX_WIDTH,
    );
    elements.push(ui._dailyBtnLabel);

    ui._dailyMenuSubtitle = addCenteredText(
        ui.scene, GAME_CONFIG.centerX, layout.dailySubtitle,
        formatDailyMenuSubtitle(difficulty), {
            fontSize: '9px',
            fill: '#CE93D8',
            stroke: '#0d1117',
            strokeThickness: 2,
        }, 52,
    );
    applyFittedLabel(
        ui.scene,
        ui._dailyMenuSubtitle,
        formatDailyMenuSubtitle(difficulty),
        {
            fontSize: '9px',
            fill: '#CE93D8',
            stroke: '#0d1117',
            strokeThickness: 2,
        },
        PANEL_TEXT_MAX_WIDTH,
    );
    elements.push(ui._dailyMenuSubtitle);

    ui._dailyBtnHit = ui.scene.add.rectangle(
        GAME_CONFIG.centerX, layout.dailyBtn, 228, MIN_TOUCH, 0x000000, 0,
    );
    ui._dailyBtnHit.setDepth(55);
    ui._dailyBtnHit.setInteractive({ useHandCursor: true });
    ui._dailyBtnHit.on('pointerdown', (_p, _lx, _ly, event) => {
        stopUiEvent(event);
        ui.scene.launchDailyChallenge();
    });
    elements.push(ui._dailyBtnHit);
}

export function refreshDailyChallengeButton(ui, difficulty) {
    if (!ui._dailyBtnLabel) return;
    const btnStyle = {
        fontSize: '10px',
        fill: '#FFFFFF',
        fontStyle: 'bold',
        stroke: '#4A148C',
        strokeThickness: 2,
    };
    const subtitleStyle = {
        fontSize: '9px',
        fill: '#CE93D8',
        stroke: '#0d1117',
        strokeThickness: 2,
    };
    applyFittedLabel(
        ui.scene,
        ui._dailyBtnLabel,
        formatDailyMenuButtonLabel(difficulty),
        btnStyle,
        DAILY_BTN_TEXT_MAX_WIDTH,
    );
    if (ui._dailyMenuSubtitle) {
        applyFittedLabel(
            ui.scene,
            ui._dailyMenuSubtitle,
            formatDailyMenuSubtitle(difficulty),
            subtitleStyle,
            PANEL_TEXT_MAX_WIDTH,
        );
    }
}

export function buildMenuFooter(ui, elements, layout) {
    ui._startText = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.start,
        'APPUYER POUR JOUER', { fontSize: '14px', fill: '#ffffff' }, 51);
    sceneTween(ui.scene, {
        targets: ui._startText,
        alpha: 0,
        duration: 400,
        yoyo: true,
        repeat: -1,
        ease: 'Power0',
    });
    elements.push(ui._startText);

    ui._hint1 = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.hint1,
        menuControlsHint(), {
            fontSize: '10px', fill: '#B0BEC5', stroke: '#0d1117', strokeThickness: 2,
            align: 'center',
        }, 52);
    elements.push(ui._hint1);

    return ui._startText;
}

export function playMenuIntroTween(ui, title) {
    const targets = [
        title, ui._menuTitleShadow, ui._startText,
        ui._scoresBtnLabel, ui._scoresBtnBg,
        ui._optionsBtnLabel, ui._optionsBtnBg,
        ui._skinsBtnLabel, ui._skinsBtnBg,
        ui._dailyBtnLabel, ui._dailyBtnBg, ui._dailyMenuSubtitle,
    ];
    targets.forEach(el => el?.setAlpha(0));
    sceneTween(ui.scene, {
        targets: targets.filter(Boolean),
        alpha: 1,
        duration: 400,
        stagger: 60,
        ease: 'Power2',
    });
}
