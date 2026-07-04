import { GAME_CONFIG, DIFFICULTY_ORDER } from './config.js';
import { DESIGN_TOKENS } from './designTokens.js';
import {
    addCenteredText,
    DEPTH,
    diffButtonCenter,
    diffLabelColor,
    fitTitleFontSize,
    GAME_TITLE,
    FONT_TITLE,
    FONT_SIZE_HINT,
    MIN_TOUCH,
    stopUiEvent,
    UI_LAYOUT,
} from './uiLayout.js';
import { addReliefText } from './uiText.js';
import { drawDiffButtons } from './uiMenuLayout.js';

export function buildMenuHeader(ui, elements, layout) {
    const titleSize = fitTitleFontSize(ui.scene, GAME_TITLE);
    const titleStyle = {
        fontFamily: FONT_TITLE,
        fontSize: `${titleSize}px`,
        fill: DESIGN_TOKENS.accentTitre,
        fontStyle: 'normal',
        stroke: DESIGN_TOKENS.accentTitreContour,
        strokeThickness: 4,
    };
    const { shadow, label: title } = addReliefText(
        ui.scene,
        GAME_CONFIG.centerX,
        layout.title,
        GAME_TITLE,
        titleStyle,
        DEPTH.MENU_PANEL,
        { dx: 3, dy: 4, fill: DESIGN_TOKENS.accentTitreOmbre, alpha: 0.65 }
    );
    ui._menuTitleShadow = shadow;
    elements.push(shadow, title);

    return title;
}

export function buildMenuDifficulty(ui, elements, layout, difficulty) {
    const { diffBtn } = UI_LAYOUT;
    ui._diffBtnGraphics = ui.scene.add.graphics().setDepth(DEPTH.MENU_RAISED);
    elements.push(ui._diffBtnGraphics);
    drawDiffButtons(ui, difficulty, layout);

    ui._diffBtnLabels = [];
    DIFFICULTY_ORDER.forEach((diff, i) => {
        const btnCx = diffButtonCenter(i);
        const label = addCenteredText(
            ui.scene,
            btnCx,
            layout.difficulty,
            GAME_CONFIG.difficultyLabels[diff],
            {
                fontSize: FONT_SIZE_HINT,
                fill: diffLabelColor(ui._currentDifficulty, diff),
                fontStyle: 'bold',
            },
            DEPTH.MENU_BTN_BG
        );
        elements.push(label);

        const hitW = Math.max(diffBtn.width, MIN_TOUCH);
        const hitZone = ui.scene.add.rectangle(
            btnCx,
            layout.difficulty,
            hitW,
            MIN_TOUCH,
            0x000000,
            0
        );
        hitZone.setDepth(DEPTH.MENU_HIT);
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
