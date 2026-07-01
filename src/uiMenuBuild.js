import { GAME_CONFIG, DIFFICULTY_ORDER } from './config.js';
import { jumpHint, optionsHint } from './device.js';
import { sceneTween } from './motion.js';
import {
    addCenteredText,
    diffButtonCenter,
    diffLabelColor,
    fitTitleFontSize,
    GAME_TITLE,
    MIN_TOUCH,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';
import { bestScoreLabel, drawDiffButtons } from './uiMenuLayout.js';

export function buildMenuHeader(ui, elements, layout, difficulty, hardcoreMode) {
    const titleSize = fitTitleFontSize(ui.scene, GAME_TITLE);
    const title = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.title, GAME_TITLE, {
        fontSize: `${titleSize}px`,
        fill: '#FDD835',
        fontStyle: 'bold',
        stroke: '#E65100',
        strokeThickness: 3,
    }, 51);
    elements.push(title);

    ui._bestText = addCenteredText(ui.scene, GAME_CONFIG.centerX, layout.best,
        `${bestScoreLabel(difficulty, hardcoreMode)} : ${ui.highScore}`,
        { fontSize: '14px', fill: '#ffffff' }, 51);
    elements.push(ui._bestText);

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
        `${jumpHint()} · ${optionsHint()}`, { fontSize: '10px', fill: '#aaaaaa' }, 52);
    elements.push(ui._hint1);

    return ui._startText;
}

export function playMenuIntroTween(ui, title) {
    [title, ui._bestText, ui._startText, ui._optionsBtnLabel].forEach(el => el?.setAlpha(0));
    sceneTween(ui.scene, {
        targets: [title, ui._bestText, ui._startText, ui._optionsBtnLabel].filter(Boolean),
        alpha: 1,
        duration: 400,
        stagger: 80,
        ease: 'Power2',
    });
}
